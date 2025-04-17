
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("vao_user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-vao-light p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-3xl font-bold text-vao-primary">VAO Mobile App</h1>
          <p className="text-vao-gray">Death Record Management System</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default Index;
