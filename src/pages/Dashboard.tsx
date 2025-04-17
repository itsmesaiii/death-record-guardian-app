
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, History, LogOut, Plus } from "lucide-react";
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
    // Check if user is logged in
    const savedUser = localStorage.getItem("vao_user");
    if (!savedUser) {
      navigate("/");
      return;
    }
    
    setUser(JSON.parse(savedUser));
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem("vao_user");
    toast.success("Successfully logged out");
    navigate("/");
  };
  
  if (!user) {
    return null; // Loading state could be improved
  }
  
  return (
    <div className="min-h-screen bg-vao-light">
      <header className="bg-white border-b">
        <div className="container max-w-md mx-auto p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-bold text-xl">VAO Dashboard</h1>
              <p className="text-sm text-muted-foreground">{user.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <AvatarUser name={user.name} />
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container max-w-md mx-auto p-4 py-6 space-y-6">
        <DashboardStats />
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ActionButton 
              to="/death-record" 
              className="bg-vao-primary hover:bg-vao-secondary text-white"
            >
              <Plus className="mr-2 h-5 w-5" />
              Submit New Death Record
            </ActionButton>
            
            <ActionButton 
              to="/submission-history" 
              variant="outline"
              className="border-vao-primary text-vao-primary hover:bg-vao-light"
            >
              <History className="mr-2 h-5 w-5" />
              View Submission History
            </ActionButton>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(() => {
              const history = JSON.parse(localStorage.getItem("vao_submissions") || "[]");
              if (history.length === 0) {
                return (
                  <div className="text-center py-6 text-muted-foreground">
                    <FileText className="mx-auto h-10 w-10 mb-2 text-vao-gray opacity-50" />
                    <p>No recent submissions</p>
                  </div>
                );
              }
              
              return history.slice(0, 3).map((item: any) => (
                <div key={item.id} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{item.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.dateOfDeath).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    {item.isMatch ? (
                      <span className="vao-status-success">Matched</span>
                    ) : (
                      <span className="vao-status-warning">Not Matched</span>
                    )}
                  </div>
                </div>
              ));
            })()}
            
            {JSON.parse(localStorage.getItem("vao_submissions") || "[]").length > 0 && (
              <Button 
                variant="ghost" 
                className="w-full text-vao-primary"
                onClick={() => navigate("/submission-history")}
              >
                View All Submissions
              </Button>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
