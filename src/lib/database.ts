import { Capacitor } from "@capacitor/core";
import type { Scan } from "@/app/context/ScanContext";

const DB_NAME = "skinscan";
const WEB_STORAGE_KEY = "skinscan_sqlite_store";

export interface ChatMessageRecord {
  id: string;
  sender: "user" | "doctor";
  text: string;
  timestamp: string;
}

interface WebStore {
  scans: Scan[];
  quizzes: Record<string, Record<number, string>>;
  chats: Record<string, ChatMessageRecord[]>;
}

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function generateChatReply(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("mole") || lower.includes("spot") || lower.includes("dark")) {
    return "Changes in moles should be monitored closely. Use Start New Scan to analyze the spot and track it over time.";
  }
  if (lower.includes("itch") || lower.includes("rash") || lower.includes("dry") || lower.includes("red")) {
    return "Dry, itchy, or red patches may indicate eczema or psoriasis. Moisturize and run a scan through the app for evaluation.";
  }
  if (lower.includes("sun") || lower.includes("burn") || lower.includes("uv")) {
    return "Sunburn increases long-term risk. Check the Weather module for local UV levels and use SPF 30+ every two hours.";
  }
  if (lower.includes("hello") || lower.includes("hi")) {
    return "Hello! I am Dr. Sara, your SkinScan AI companion. How can I help you manage your skin health today?";
  }
  return "Thank you for sharing that. I recommend scanning the affected area with our built-in tool so I can better guide your care.";
}

class SkinScanDatabase {
  private initialized = false;
  private webStore: WebStore = { scans: [], quizzes: {}, chats: {} };
  private nativeDb: import("@capacitor-community/sqlite").SQLiteDBConnection | null = null;

  async init(): Promise<void> {
    if (this.initialized) return;

    if (Capacitor.isNativePlatform()) {
      await this.initNative();
    } else {
      await this.initWeb();
    }
    this.initialized = true;
  }

  private async initWeb(): Promise<void> {
    const raw = localStorage.getItem(WEB_STORAGE_KEY);
    if (raw) {
      this.webStore = JSON.parse(raw) as WebStore;
    } else {
      const legacy = localStorage.getItem("skinscan_scans");
      if (legacy) {
        try {
          this.webStore.scans = JSON.parse(legacy) as Scan[];
        } catch {
          /* ignore */
        }
      }
      await this.persistWeb();
    }
  }

  private async persistWeb(): Promise<void> {
    localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(this.webStore));
    localStorage.setItem("skinscan_scans", JSON.stringify(this.webStore.scans));
  }

  private async initNative(): Promise<void> {
    const { CapacitorSQLite, SQLiteConnection } = await import("@capacitor-community/sqlite");
    const sqlite = new SQLiteConnection(CapacitorSQLite);
    const exists = (await sqlite.isConnection(DB_NAME, false)).result ?? false;
    this.nativeDb = exists
      ? await sqlite.retrieveConnection(DB_NAME, false)
      : await sqlite.createConnection(DB_NAME, false, "no-encryption", 1, false);

    await this.nativeDb.open();
    await this.nativeDb.execute(`
      CREATE TABLE IF NOT EXISTS scans (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        image TEXT NOT NULL,
        condition TEXT NOT NULL,
        confidence INTEGER NOT NULL,
        severity TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        bodyArea TEXT,
        metrics TEXT
      );
      CREATE TABLE IF NOT EXISTS quizzes (
        userId TEXT PRIMARY KEY,
        skinProfile TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        sender TEXT NOT NULL,
        text TEXT NOT NULL,
        timestamp TEXT NOT NULL
      );
    `);
  }

  async getScansByUser(userId: string): Promise<Scan[]> {
    await this.init();

    if (this.nativeDb) {
      const result = await this.nativeDb.query(
        "SELECT * FROM scans WHERE userId = ? ORDER BY date DESC",
        [userId]
      );
      return (result.values ?? []).map((row) => ({
        id: row.id as string,
        userId: row.userId as string,
        image: row.image as string,
        condition: row.condition as string,
        confidence: row.confidence as number,
        severity: row.severity as Scan["severity"],
        description: row.description as string,
        date: row.date as string,
        bodyArea: row.bodyArea as string | undefined,
        metrics: row.metrics ? JSON.parse(row.metrics as string) : undefined,
      })) as Scan[];
    }

    return this.webStore.scans
      .filter((s) => (s as Scan & { userId?: string }).userId === userId || !("userId" in s))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  async insertScan(userId: string, scan: Omit<Scan, "id" | "date"> & { id?: string }): Promise<Scan> {
    await this.init();

    const newScan: Scan & { userId: string } = {
      ...scan,
      id: scan.id ?? Date.now().toString(),
      date: today(),
      userId,
    };

    if (this.nativeDb) {
      await this.nativeDb.run(
        `INSERT INTO scans (id, userId, image, condition, confidence, severity, description, date, bodyArea, metrics)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newScan.id,
          userId,
          newScan.image,
          newScan.condition,
          newScan.confidence,
          newScan.severity,
          newScan.description,
          newScan.date,
          newScan.bodyArea ?? "General",
          newScan.metrics ? JSON.stringify(newScan.metrics) : null,
        ]
      );
      return newScan;
    }

    this.webStore.scans.unshift(newScan);
    await this.persistWeb();
    return newScan;
  }

  async getQuizProfile(userId: string): Promise<Record<number, string> | null> {
    await this.init();

    if (this.nativeDb) {
      const result = await this.nativeDb.query("SELECT skinProfile FROM quizzes WHERE userId = ?", [userId]);
      if (!result.values?.length) return null;
      return JSON.parse(result.values[0].skinProfile as string);
    }

    return this.webStore.quizzes[userId] ?? null;
  }

  async saveQuizProfile(userId: string, skinProfile: Record<number, string>): Promise<void> {
    await this.init();

    if (this.nativeDb) {
      await this.nativeDb.run(
        `INSERT OR REPLACE INTO quizzes (userId, skinProfile) VALUES (?, ?)`,
        [userId, JSON.stringify(skinProfile)]
      );
      return;
    }

    this.webStore.quizzes[userId] = skinProfile;
    await this.persistWeb();
  }

  async getChatMessages(userId: string): Promise<ChatMessageRecord[]> {
    await this.init();

    if (this.nativeDb) {
      const result = await this.nativeDb.query(
        "SELECT id, sender, text, timestamp FROM chat_messages WHERE userId = ? ORDER BY timestamp ASC",
        [userId]
      );
      return (result.values ?? []) as ChatMessageRecord[];
    }

    if (!this.webStore.chats[userId]) {
      this.webStore.chats[userId] = [
        {
          id: "m1",
          sender: "doctor",
          text: "Hello! I am Dr. Sara, your SkinScan AI companion. How can I help you manage your skin health today?",
          timestamp: new Date().toISOString(),
        },
      ];
      await this.persistWeb();
    }
    return this.webStore.chats[userId];
  }

  async postChatMessage(
    userId: string,
    text: string
  ): Promise<{ userMessage: ChatMessageRecord; doctorMessage: ChatMessageRecord }> {
    await this.init();

    const userMessage: ChatMessageRecord = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date().toISOString(),
    };

    const doctorMessage: ChatMessageRecord = {
      id: (Date.now() + 1).toString(),
      sender: "doctor",
      text: generateChatReply(text),
      timestamp: new Date().toISOString(),
    };

    if (this.nativeDb) {
      for (const msg of [userMessage, doctorMessage]) {
        await this.nativeDb.run(
          `INSERT INTO chat_messages (id, userId, sender, text, timestamp) VALUES (?, ?, ?, ?, ?)`,
          [msg.id, userId, msg.sender, msg.text, msg.timestamp]
        );
      }
      return { userMessage, doctorMessage };
    }

    const thread = await this.getChatMessages(userId);
    thread.push(userMessage, doctorMessage);
    this.webStore.chats[userId] = thread;
    await this.persistWeb();
    return { userMessage, doctorMessage };
  }
}

export const db = new SkinScanDatabase();
