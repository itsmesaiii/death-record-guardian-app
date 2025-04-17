
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, Home, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

const SubmissionConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isMatch, recordId, name } = location.state || {};
  
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("vao_user");
    if (!user) {
      navigate("/");
      return;
    }
    
    // Check if we have the needed state data
    if (!location.state || recordId === undefined) {
      navigate("/dashboard");
    }
  }, [navigate, location.state, recordId]);
  
  if (!location.state || recordId === undefined) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-vao-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`p-3 rounded-full ${isMatch ? 'bg-green-100' : 'bg-yellow-100'}`}>
              {isMatch ? (
                <Check className="h-8 w-8 text-green-600" />
              ) : (
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              )}
            </div>
            
            <div className="space-y-2">
              <CardTitle>
                {isMatch ? "Beneficiary Match Found" : "Record Saved Successfully"}
              </CardTitle>
              
              <CardDescription className="text-base">
                {isMatch ? (
                  <>
                    Death record for <span className="font-medium">{name}</span> has been matched with a beneficiary and forwarded to admin for verification.
                  </>
                ) : (
                  <>
                    Death record for <span className="font-medium">{name}</span> has been saved successfully. No beneficiary match was found.
                  </>
                )}
              </CardDescription>
            </div>
            
            <div className="border-t w-full my-4 pt-4 flex flex-col gap-3">
              <Button 
                className="w-full bg-vao-primary hover:bg-vao-secondary"
                onClick={() => navigate("/dashboard")}
              >
                <Home className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-vao-primary text-vao-primary hover:bg-vao-light"
                onClick={() => navigate("/death-record")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Submit Another Record
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionConfirmation;
