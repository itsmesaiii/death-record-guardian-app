
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FormField } from "./FormField";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";

interface FormData {
  fullName: string;
  aadhaarNumber: string;
  dateOfDeath: Date | undefined;
  pdfFile: File | null;
}

interface FormErrors {
  fullName?: string;
  aadhaarNumber?: string;
  dateOfDeath?: string;
  pdfFile?: string;
}

export function DeathRecordForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    aadhaarNumber: "",
    dateOfDeath: undefined,
    pdfFile: null,
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors: FormErrors = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    
    if (formData.aadhaarNumber && !/^\d{12}$/.test(formData.aadhaarNumber)) {
      errors.aadhaarNumber = "Aadhaar number must be 12 digits";
    }
    
    if (!formData.dateOfDeath) {
      errors.dateOfDeath = "Date of death is required";
    }
    
    if (!formData.pdfFile) {
      errors.pdfFile = "Form 2 PDF is required";
    }
    
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      
      // Simulate API call with delay
      setTimeout(() => {
        // Check if Aadhaar number matches a beneficiary
        // For demo purposes: Aadhaar numbers starting with '12' will match
        const isMatch = formData.aadhaarNumber.startsWith("12");
        
        // Prepare data for demonstration
        const submissionData = {
          ...formData,
          dateOfDeath: formData.dateOfDeath ? format(formData.dateOfDeath, "yyyy-MM-dd") : "",
          pdfFilename: formData.pdfFile?.name,
          isMatch,
          submissionDate: new Date().toISOString(),
          id: Date.now().toString(),
        };
        
        // Save to localStorage for history demonstration
        const history = JSON.parse(localStorage.getItem("vao_submissions") || "[]");
        history.unshift(submissionData);
        localStorage.setItem("vao_submissions", JSON.stringify(history));
        
        // Navigate to confirmation page with result
        navigate("/submission-confirmation", { 
          state: { 
            isMatch,
            recordId: submissionData.id,
            name: formData.fullName 
          } 
        });
        
        setIsSubmitting(false);
      }, 1500);
    } else {
      toast.error("Please fix the errors in the form.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type !== "application/pdf") {
      setFormErrors({
        ...formErrors,
        pdfFile: "Only PDF files are allowed",
      });
      return;
    }
    
    setFormData({
      ...formData,
      pdfFile: file,
    });
    
    if (formErrors.pdfFile) {
      setFormErrors({
        ...formErrors,
        pdfFile: undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <FormField
            id="fullName"
            label="Full Name of Deceased"
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={(value) => setFormData({ ...formData, fullName: value })}
            error={formErrors.fullName}
            required
          />
          
          <FormField
            id="aadhaarNumber"
            label="Aadhaar Number"
            placeholder="Enter 12-digit Aadhaar number or leave blank"
            value={formData.aadhaarNumber}
            onChange={(value) => {
              // Only allow digits
              if (/^\d*$/.test(value) && value.length <= 12) {
                setFormData({ ...formData, aadhaarNumber: value });
                
                if (formErrors.aadhaarNumber && /^\d{12}$/.test(value)) {
                  setFormErrors({
                    ...formErrors,
                    aadhaarNumber: undefined,
                  });
                }
              }
            }}
            error={formErrors.aadhaarNumber}
            pattern="\d{12}"
          />
          
          <div className="space-y-2">
            <Label htmlFor="dateOfDeath" className={cn(formErrors.dateOfDeath && "text-destructive")}>
              Date of Death <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="dateOfDeath"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dateOfDeath && "text-muted-foreground",
                    formErrors.dateOfDeath && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dateOfDeath ? format(formData.dateOfDeath, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dateOfDeath}
                  onSelect={(date) => {
                    setFormData({ ...formData, dateOfDeath: date || undefined });
                    if (formErrors.dateOfDeath && date) {
                      setFormErrors({
                        ...formErrors,
                        dateOfDeath: undefined,
                      });
                    }
                  }}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {formErrors.dateOfDeath && <p className="text-xs text-destructive">{formErrors.dateOfDeath}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pdfUpload" className={cn(formErrors.pdfFile && "text-destructive")}>
              Upload Form 2 PDF <span className="text-destructive">*</span>
            </Label>
            <div className={cn("border-2 border-dashed rounded-md p-6 text-center hover:bg-muted/50 transition-colors",
                            formErrors.pdfFile && "border-destructive")}>
              <input
                id="pdfUpload"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <label htmlFor="pdfUpload" className="cursor-pointer block">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  {formData.pdfFile ? (
                    <div className="text-sm">
                      <span className="font-semibold">{formData.pdfFile.name}</span> 
                      <p className="text-muted-foreground">Click to change file</p>
                    </div>
                  ) : (
                    <div className="text-sm">
                      <span className="font-semibold">Click to upload PDF</span>
                      <p className="text-muted-foreground">Form 2 document required</p>
                    </div>
                  )}
                </div>
              </label>
            </div>
            {formErrors.pdfFile && <p className="text-xs text-destructive">{formErrors.pdfFile}</p>}
          </div>
        </CardContent>
      </Card>
      
      <Button 
        type="submit" 
        className="w-full bg-vao-primary hover:bg-vao-secondary text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Death Record"}
      </Button>
    </form>
  );
}
