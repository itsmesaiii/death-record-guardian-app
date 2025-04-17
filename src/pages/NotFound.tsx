
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-vao-light p-4">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-vao-primary">404</h1>
        <p className="text-xl text-vao-gray mb-4">Oops! Page not found</p>
        <Button asChild className="bg-vao-primary hover:bg-vao-secondary">
          <a href="/dashboard">
            <HomeIcon className="mr-2 h-4 w-4" />
            Return to Dashboard
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
