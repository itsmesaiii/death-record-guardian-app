// src/components/death-record/DeathRecordForm.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { api } from "@/lib/api";

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
    if (!formData.aadhaarNumber) {
      errors.aadhaarNumber = "Aadhaar number is required";
    } else if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
      errors.aadhaarNumber = "Aadhaar number must be 12 digits";
    }
    if (!formData.dateOfDeath) {
      errors.dateOfDeath = "Date of death is required";
    }
    if (!formData.pdfFile) {
      errors.pdfFile = "Form 2 PDF is required";
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);

      try {
        // Retrieve the logged‑in VAO's username
        const stored = localStorage.getItem("vao_user");
        const vao = stored ? JSON.parse(stored) : { username: "unknown" };

        // Build multipart payload
        const formPayload = new FormData();
        formPayload.append("name", formData.fullName);
        formPayload.append("aadhaarNumber", formData.aadhaarNumber);
        formPayload.append("dateOfDeath", formData.dateOfDeath!.toISOString());
        formPayload.append("proofFile", formData.pdfFile!);
        // Include specific VAO username in source
        formPayload.append("source", `VAO - ${vao.username}`);

        await api.post("/death-records", formPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Record submitted successfully");
        navigate("/submission-confirmation", {
          state: {
            isMatch: formData.aadhaarNumber.startsWith("12"),
            recordId: null,
            name: formData.fullName,
          },
        });
      } catch (err) {
        console.error(err);
        toast.error("Submission failed. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
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
    setFormData({ ...formData, pdfFile: file });
    if (formErrors.pdfFile) {
      setFormErrors({ ...formErrors, pdfFile: undefined });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Full Name */}
          <FormField
            id="fullName"
            label="Full Name of Deceased / மரணமடைந்தோரின் முழு பெயர்"
            placeholder="Name / பெயர்"
            value={formData.fullName}
            onChange={(v) => setFormData({ ...formData, fullName: v })}
            error={formErrors.fullName}
            required
          />

          {/* Aadhaar Number */}
          <div className="space-y-2">
            <Label
              htmlFor="aadhaarNumber"
              className={cn(formErrors.aadhaarNumber && "text-destructive")}
            >
              Enter 12-digit Aadhaar Number <span className="text-destructive">*</span>
              <br />
              <span className="text-sm">12 இலக்க ஆதார் எண்ணை உள்ளிடவும்.</span>
            </Label>
            <Input
              id="aadhaarNumber"
              type="text"
              placeholder="Aadhaar number / ஆதார் எண்"
              className={cn(formErrors.aadhaarNumber && "border-destructive")}
              value={formData.aadhaarNumber}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*$/.test(v) && v.length <= 12) {
                  setFormData({ ...formData, aadhaarNumber: v });
                  if (formErrors.aadhaarNumber && /^\d{12}$/.test(v)) {
                    setFormErrors({ ...formErrors, aadhaarNumber: undefined });
                  }
                }
              }}
              required
              pattern="\d{12}"
            />
            {formErrors.aadhaarNumber && (
              <p className="text-xs text-destructive">{formErrors.aadhaarNumber}</p>
            )}
          </div>

          {/* Date of Death */}
          <div className="space-y-2">
            <Label
              htmlFor="dateOfDeath"
              className={cn(formErrors.dateOfDeath && "text-destructive")}
            >
              Date of Death / இறப்பு தேதி <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="dateOfDeath"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dateOfDeath && "text-muted-foreground",
                    formErrors.dateOfDeath && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dateOfDeath
                    ? format(formData.dateOfDeath, "PPP")
                    : <span>Select date / தேதியைத் தேர்ந்தெடுக்கவும்</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dateOfDeath}
                  onSelect={(date) => {
                    setFormData({ ...formData, dateOfDeath: date || undefined });
                    if (formErrors.dateOfDeath && date) {
                      setFormErrors({ ...formErrors, dateOfDeath: undefined });
                    }
                  }}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {formErrors.dateOfDeath && (
              <p className="text-xs text-destructive">{formErrors.dateOfDeath}</p>
            )}
          </div>

          {/* PDF Upload */}
          <div className="space-y-2">
            <Label
              htmlFor="pdfUpload"
              className={cn(formErrors.pdfFile && "text-destructive")}
            >
              Upload Form 2 PDF / படிவம் 2 PDF பதிவேற்றவும் <span className="text-destructive">*</span>
            </Label>
            <div
              className={cn(
                "border-2 border-dashed rounded-md p-6 text-center hover:bg-muted/50 transition-colors",
                formErrors.pdfFile && "border-destructive"
              )}
            >
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
                    <>
                      <span className="font-semibold">{formData.pdfFile.name}</span>
                      <p className="text-sm">
                        Click to change file / கோப்பை மாற்ற கிளிக் செய்யவும்
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold">
                        Click to upload PDF / PDF பதிவேற்ற கிளிக் செய்யவும்
                      </span>
                      <p className="text-sm">
                        Form 2 document required / படிவம் 2 ஆவணம் தேவையானது
                      </p>
                    </>
                  )}
                </div>
              </label>
            </div>
            {formErrors.pdfFile && (
              <p className="text-xs text-destructive">{formErrors.pdfFile}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full bg-vao-primary hover:bg-vao-secondary text-white"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Submitting... / சமர்ப்பிக்கப்படுகிறது..."
          : "Submit Death Record / மரண பதிவு சமர்ப்பிக்கவும்"}
      </Button>
    </form>
  );
}
