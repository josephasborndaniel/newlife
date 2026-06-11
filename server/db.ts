import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const DB_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DB_DIR, "db.json");

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  dateOfBirth: string;
  gender?: string;
  avatar?: string;
}

export interface ScanEntity {
  id: string;
  userId: string;
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

export interface QuizEntity {
  userId: string;
  skinProfile: any;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "doctor";
  text: string;
  timestamp: string;
}

export interface ChatEntity {
  id: string;
  userId: string;
  messages: ChatMessage[];
}

interface DatabaseSchema {
  users: UserEntity[];
  scans: ScanEntity[];
  quizzes: QuizEntity[];
  chats: ChatEntity[];
}

// Default Seed Data
const getInitialData = (): DatabaseSchema => {
  const salt = bcrypt.genSaltSync(10);
  const defaultPasswordHash = bcrypt.hashSync("password123", salt);

  return {
    users: [
      {
        id: "1",
        name: "Venkat",
        email: "venkat@skinscan.ai",
        passwordHash: defaultPasswordHash,
        dateOfBirth: "1995-05-15",
        gender: "Male"
      }
    ],
    scans: [
      {
        id: "1",
        userId: "1",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400",
        condition: "Melanoma",
        confidence: 87,
        severity: "High",
        description: "A serious form of skin cancer that develops in melanocytes. Early detection is crucial for successful treatment.",
        date: "2026-05-08",
        bodyArea: "Back"
      },
      {
        id: "2",
        userId: "1",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
        condition: "Eczema",
        confidence: 92,
        severity: "Medium",
        description: "A condition that makes your skin red and itchy. It's common in children but can occur at any age.",
        date: "2026-05-05",
        bodyArea: "Arm"
      },
      {
        id: "3",
        userId: "1",
        image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400",
        condition: "Psoriasis",
        confidence: 78,
        severity: "Medium",
        description: "A skin disease that causes a rash with itchy, scaly patches, most commonly on the knees, elbows, trunk and scalp.",
        date: "2026-05-01",
        bodyArea: "Elbow"
      }
    ],
    quizzes: [],
    chats: [
      {
        id: "c1",
        userId: "1",
        messages: [
          {
            id: "m1",
            sender: "doctor",
            text: "Hello! I am Dr. Sara, your SkinScan AI companion. How can I help you manage your skin health today?",
            timestamp: new Date().toISOString()
          }
        ]
      }
    ]
  };
};

export class Db {
  private static ensureExists() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(getInitialData(), null, 2), "utf8");
    }
  }

  public static read(): DatabaseSchema {
    this.ensureExists();
    try {
      const content = fs.readFileSync(DB_FILE, "utf8");
      return JSON.parse(content);
    } catch (e) {
      console.error("Error reading db file, resetting schema", e);
      const schema = getInitialData();
      this.write(schema);
      return schema;
    }
  }

  public static write(data: DatabaseSchema): void {
    this.ensureExists();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  }
}
