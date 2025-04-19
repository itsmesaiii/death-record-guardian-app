// src/pages/SubmissionConfirmation.tsx

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

            {/* Title */}
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">
                {isMatch
                  ? "Beneficiary Match Found"
                  : "Record Saved Successfully"}
              </CardTitle>
              <p className="text-sm italic text-muted-foreground">
                {isMatch
                  ? "பயனாளி இணைப்பு கண்டறியப்பட்டது"
                  : "பதிவு வெற்றிகரமாக சேமிக்கப்பட்டது"}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <CardDescription className="text-base">
                {isMatch ? (
                  <>
                    The death record for <span className="font-medium">{name}</span> was matched to an existing beneficiary and forwarded for administrative verification.
                  </>
                ) : (
                  <>
                    Death record for <span className="font-medium">{name}</span> has been saved successfully. No beneficiary match was found.
                  </>
                )}
              </CardDescription>
              <p className="text-sm italic text-muted-foreground">
                {isMatch
                  ? `${name} உடன் மரண பதிவு பயனாளியுடன் இணைப்பு கண்டறியப்பட்டு சரிபார்ப்புக்காக நிர்வாகிக்கு அனுப்பப்பட்டது.`
                  : `${name} இறப்பு பதிவு வெற்றிகரமாக சேமிக்கப்பட்டது. பயனாளி பொருத்தம் எதுவும் கிடைக்கவில்லை.`}
              </p>
            </div>
          </div>

          <div className="border-t w-full my-4 pt-4 flex flex-col gap-3">
            <Button 
                 className="w-full py-3 flex items-center justify-center space-x-2 bg-vao-primary hover:bg-vao-secondary"
                onClick={() => navigate("/dashboard")}
            >
              <Home className="h-5 w-5" />
              <span >Back to Dashboard / டாஷ்போர்டுக்கு திரும்பு</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full py-3 flex items-center justify-center space-x-2 border-vao-primary text-vao-primary hover:bg-vao-light"
              onClick={() => navigate("/death-record")}
            >
              <Plus className="h-5 w-5" />
              <span>Submit Again / மீண்டும் சமர்ப்பிக்கவும்</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionConfirmation;
