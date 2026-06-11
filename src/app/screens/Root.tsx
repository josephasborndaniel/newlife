import { Outlet, useNavigate } from "react-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ScanProvider, useScans } from "../context/ScanContext";
import { Shield, Sparkles, Phone, Monitor, Sun, Users, Award, Download } from "lucide-react";

function RootLayout() {
  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden font-sans flex flex-col">
      <div className="flex-grow w-full h-full flex flex-col relative">
        <Outlet />
      </div>
    </div>
  );
}

export default function Root() {
  return (
    <AuthProvider>
      <ScanProvider>
        <RootLayout />
      </ScanProvider>
    </AuthProvider>
  );
}
