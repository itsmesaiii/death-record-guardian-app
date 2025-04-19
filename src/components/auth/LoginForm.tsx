// src/components/auth/LoginForm.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LockKeyhole, User } from "lucide-react";

export function LoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 1) Load the accounts from localStorage
    const saved = localStorage.getItem("vao_accounts") || "[]";
    const accounts: { username: string; password: string }[] = JSON.parse(saved);

    // 2) Try to find a match
    const candidateUser = username.trim().toLowerCase();
    const candidatePass = password.trim().toLowerCase();
    const found = accounts.find(
    (acc) =>
           acc.username.toLowerCase() === candidateUser &&
          acc.password.toLowerCase() === candidatePass
       );

    // 3) Simulate an API delay
    setTimeout(() => {
      if (found) {
        // Successful login
        localStorage.setItem(
          "vao_user",
          JSON.stringify({ name: found.username, username: found.username })
        );
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">VAO Login / VAO உள்நுழைவு </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username /  பெயர்</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                placeholder="Enter username / பெயரை உள்ளிடவும்"
                className="pl-9"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password / கடவுச்சொல்</Label>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter password / கடவுச்சொல்லை உள்ளிடவும்"
                className="pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-vao-primary hover:bg-vao-secondary text-white py-3"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login / உள்நுழைய"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
