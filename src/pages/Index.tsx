// src/pages/Index.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { api } from "@/lib/api";               // ← imported API client
import tnLogo from "../assets/tamilnadu-logo.png";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    const user = localStorage.getItem("vao_user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Connectivity test to backend
  useEffect(() => {
    api.get("/death-records")
      .then(({ data }) => {
        console.log("✅ Backend reachable. Sample records:", data.slice(0, 3));
      })
      .catch((err) => {
        console.error("❌ API connection failed:", err);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-vao-light p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2 mb-6">
          <img
            src={tnLogo}
            alt="Government of Tamil Nadu Logo"
            className="mx-auto h-20"
          />
          <h1 className="text-2xl font-semibold text-vao-primary">
            Government of Tamil Nadu
          </h1>
          <h1 className="text-2xl font-semibold text-vao-primary">
            தமிழ்நாடு அரசு
          </h1>
          <p className="text-sm text-vao-gray">
            Death Record Management System
          </p>
          <p className="text-sm text-vao-gray">
            இறப்பு பதிவு மேலாண்மை அமைப்பு
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default Index;
