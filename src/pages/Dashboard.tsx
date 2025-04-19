// src/pages/Dashboard.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Plus , History } from "lucide-react";
import { AvatarUser } from "@/components/ui/avatar-user";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ActionButton } from "@/components/dashboard/ActionButton";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
  name: string;
  username: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("vao_user");
    if (!saved) {
      navigate("/");
      return;
    }
    setUser(JSON.parse(saved));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("vao_user");
    toast.success("Successfully logged out");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-vao-light">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container max-w-md mx-auto p-4 flex justify-between items-center">
          <div>
            <h1 className="font-bold text-xl">
              VAO Dashboard / VAO டாஷ்போர்டு
            </h1>
            <p className="text-sm text-muted-foreground">{user.name.toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-4">
            <AvatarUser name={user.name} />
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container max-w-md mx-auto p-4 py-6 space-y-6">
        <DashboardStats />

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions / விரைவு செயலிகள்</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ActionButton
              to="/death-record"
              className="w-full flex items-center justify-center space-x-2 bg-vao-primary hover:bg-vao-secondary text-white py-3">
              <Plus className="h-5 w-5" />
              <span>New Record / புதிய பதிவு</span>
            </ActionButton>
          </CardContent>
        </Card>

        {/* All Records (moved here) */}
        <Card>
  <CardHeader>
    <CardTitle>All Records / அனைத்து பதிவுகள்</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <ActionButton
      to="/submission-history"
      className="w-full flex items-center justify-center space-x-2 bg-vao-primary hover:bg-vao-secondary text-white py-3">
      <History className="h-5 w-5" />
      <span>All Records / அனைத்து பதிவுகள்</span>
    </ActionButton>
  </CardContent>
</Card>

      </main>
    </div>
  );
};

export default Dashboard;
