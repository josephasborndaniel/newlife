import { Router, Response } from "express";
import { Db, ScanEntity } from "../db";
import { authenticateToken, AuthenticatedRequest } from "./middleware";

const router = Router();

// GET /api/scans
router.get("/", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = Db.read();
  const userScans = db.scans.filter(s => s.userId === req.userId);
  res.json(userScans);
});

// GET /api/scans/:id
router.get("/:id", authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const db = Db.read();
  const scan = db.scans.find(s => s.id === req.params.id && s.userId === req.userId);

  if (!scan) {
    return res.status(404).json({ error: "Scan not found" });
  }

  res.json(scan);
});

// POST /api/scans
router.post("/", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { image, bodyArea } = req.body;

  if (!image) {
    return res.status(400).json({ error: "Missing required scan image" });
  }

  const db = Db.read();
  let finalCondition: string | undefined;
  let finalConfidence: number | undefined;
  let finalSeverity: "High" | "Medium" | "Low" | undefined;
  let finalDescription: string | undefined;
  let finalMetrics = undefined;

  try {
    console.log("Forwarding scan image to Python ML server at http://localhost:8000/analyze...");
    const response = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image }),
    });

    if (response.ok) {
      const mlResult = await response.json() as {
        condition: string;
        confidence: number;
        severity: "High" | "Medium" | "Low";
        description: string;
        metrics: {
          asymmetry: number;
          border: number;
          color: number;
          diameter: number;
        };
      };
      
      console.log("Python ML service returned analysis:", mlResult);
      finalCondition = mlResult.condition;
      finalConfidence = mlResult.confidence;
      finalSeverity = mlResult.severity;
      finalDescription = mlResult.description;
      finalMetrics = mlResult.metrics;
    } else {
      console.warn("Python ML server returned an error code:", response.status);
      return res.status(503).json({ error: "ML analysis service unavailable. Ensure the Python ML server is running on port 8000." });
    }
  } catch (err: any) {
    console.warn("Could not connect to Python ML server (is it running?):", err.message);
    return res.status(503).json({ error: "ML analysis service unreachable. Ensure the Python ML server is running on port 8000." });
  }

  const newScan: ScanEntity = {
    id: Date.now().toString(),
    userId: req.userId!,
    image,
    condition: finalCondition,
    confidence: finalConfidence,
    severity: finalSeverity,
    description: finalDescription,
    date: new Date().toISOString().split("T")[0],
    bodyArea: bodyArea || "General",
    metrics: finalMetrics,
  };

  db.scans.unshift(newScan); // Add at the start
  Db.write(db);

  res.status(201).json(newScan);
});

export default router;
