import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  gender?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, dateOfBirth: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper for local mock user storage
const USERS_STORAGE_KEY = "skinscan_offline_users";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function checkSession() {
      const storedUser = localStorage.getItem("skinscan_user");
      const token = localStorage.getItem("skinscan_token");
      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("skinscan_token");
          localStorage.removeItem("skinscan_user");
        }
      }
      setIsLoading(false);
    }
    checkSession();
  }, []);

  const getLocalUsers = (): Array<User & { password?: string }> => {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  };

  const saveLocalUsers = (users: Array<User & { password?: string }>) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const login = async (email: string, password: string) => {
    // Artificial delay to feel premium
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = getLocalUsers();
    const normalizedEmail = email.trim().toLowerCase();
    
    // Find matching user (if no password is set or matches)
    const existingUser = users.find(u => u.email === normalizedEmail);

    if (!existingUser) {
      // For convenience during testing/development, auto-register if they login with any password,
      // or we can throw an error. Let's do a prompt or auto-signup to make UX robust.
      const newUser: User = {
        id: "usr_" + Date.now().toString(),
        name: email.split("@")[0],
        email: normalizedEmail,
        dateOfBirth: "1995-01-01",
      };
      
      users.push({ ...newUser, password });
      saveLocalUsers(users);
      
      setUser(newUser);
      localStorage.setItem("skinscan_token", "offline_token_" + newUser.id);
      localStorage.setItem("skinscan_user", JSON.stringify(newUser));
      return;
    }

    if (existingUser.password && existingUser.password !== password) {
      throw new Error("Invalid password");
    }

    const { password: _, ...userSession } = existingUser;
    setUser(userSession);
    localStorage.setItem("skinscan_token", "offline_token_" + existingUser.id);
    localStorage.setItem("skinscan_user", JSON.stringify(userSession));
  };

  const signup = async (name: string, email: string, password: string, dateOfBirth: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const users = getLocalUsers();
    const normalizedEmail = email.trim().toLowerCase();
    
    if (users.some(u => u.email === normalizedEmail)) {
      throw new Error("An account with this email already exists");
    }

    const newUser: User = {
      id: "usr_" + Date.now().toString(),
      name: name.trim(),
      email: normalizedEmail,
      dateOfBirth,
    };

    users.push({ ...newUser, password });
    saveLocalUsers(users);

    setUser(newUser);
    localStorage.setItem("skinscan_token", "offline_token_" + newUser.id);
    localStorage.setItem("skinscan_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("skinscan_token");
    localStorage.removeItem("skinscan_user");
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("skinscan_user", JSON.stringify(updatedUser));

    // Update in local users array
    const users = getLocalUsers();
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, ...updates };
      }
      return u;
    });
    saveLocalUsers(updatedUsers);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
