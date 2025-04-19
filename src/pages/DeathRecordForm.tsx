
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DeathRecordForm as RecordForm } from "@/components/death-record/DeathRecordForm";

const DeathRecordForm = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("vao_user");
    if (!user) {
      navigate("/");
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-vao-light pb-8">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container max-w-md mx-auto p-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-bold text-xl ml-2">Submit Death Record / மரண பதிவு சமர்ப்பிக்கவும்</h1>
          </div>
        </div>
      </header>
      
      <main className="container max-w-md mx-auto p-4 py-6">
        <div className="mb-6">
          <p className="text-muted-foreground">Please fill out all required fields and upload Form 2 document to submit a death record. </p>
          <p className="text-muted-foreground"> இறப்பு பதிவேட்டை சமர்ப்பிக்க தேவையான அனைத்து புலங்களையும் நிரப்பி படிவம் 2 ஆவணத்தைப் பதிவேற்றவும்.</p>

        </div>
        
        <RecordForm />
      </main>
    </div>
  );
};

export default DeathRecordForm;