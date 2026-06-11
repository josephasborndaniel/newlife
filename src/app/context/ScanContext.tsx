import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { db } from "@/lib/database";
import { analyzeImage } from "@/lib/mlApi";

export interface Scan {
  id: string;
  image: string;
  condition: string;
  confidence: number;
  severity: "High" | "Medium" | "Low";
  description: string;
  date: string;
  bodyArea?: string;
  metrics?: {
    asymmetry: number;
    border: number;
    color: number;
    diameter: number;
  };
}

export type ScanSubmission = {
  image: string;
  bodyArea?: string;
};

interface ScanContextType {
  scans: Scan[];
  addScan: (scan: ScanSubmission) => Promise<Scan | null>;
  getScan: (id: string) => Scan | undefined;
  currentScan: Scan | null;
  setCurrentScan: (scan: Scan | null) => void;
  isLoadingScans: boolean;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export function ScanProvider({ children }: { children: ReactNode }) {
  const [scans, setScans] = useState<Scan[]>([]);
  const [currentScan, setCurrentScan] = useState<Scan | null>(null);
  const [isLoadingScans, setIsLoadingScans] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    async function fetchScans() {
      if (isAuthenticated && user?.id) {
        setIsLoadingScans(true);
        try {
          await db.init();
          const data = await db.getScansByUser(user.id);
          setScans(data);
        } catch (e) {
          console.warn("Failed to load scans from database", e);
          const cached = localStorage.getItem("skinscan_scans");
          setScans(cached ? JSON.parse(cached) : []);
        } finally {
          setIsLoadingScans(false);
        }
      } else {
        setScans([]);
      }
    }
    fetchScans();
  }, [isAuthenticated, user?.id]);

  const addScan = async (scanDetails: ScanSubmission) => {
    if (!user?.id) return null;

    const mlResult = await analyzeImage(scanDetails.image);

    const newScan = await db.insertScan(user.id, {
      image: scanDetails.image,
      condition: mlResult.condition,
      confidence: mlResult.confidence,
      severity: mlResult.severity,
      description: mlResult.description,
      bodyArea: scanDetails.bodyArea || "General",
      metrics: mlResult.metrics,
    });

    setScans((prev) => {
      const updated = [newScan, ...prev];
      localStorage.setItem("skinscan_scans", JSON.stringify(updated));
      return updated;
    });
    setCurrentScan(newScan);
    return newScan;
  };

  const getScan = (id: string) => {
    return scans.find((scan) => scan.id === id);
  };

  return (
    <ScanContext.Provider
      value={{
        scans,
        addScan,
        getScan,
        currentScan,
        setCurrentScan,
        isLoadingScans,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
}

export function useScans() {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error("useScans must be used within ScanProvider");
  }
  return context;
}
