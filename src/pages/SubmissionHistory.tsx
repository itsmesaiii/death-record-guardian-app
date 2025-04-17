
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SubmissionHistory as History } from "@/components/history/SubmissionHistory";

const SubmissionHistory = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("vao_user");
    if (!user) {
      navigate("/");
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-vao-light">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container max-w-md mx-auto p-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-bold text-xl ml-2">Submission History</h1>
          </div>
        </div>
      </header>
      
      <main className="container max-w-md mx-auto p-4 py-6">
        <div className="mb-6">
          <p className="text-muted-foreground">View all your previous death record submissions and their status.</p>
        </div>
        
        <History />
      </main>
    </div>
  );
};

export default SubmissionHistory;
