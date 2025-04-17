
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ActionButtonProps {
  to: string;
  className?: string;
  variant?: "default" | "outline" | "secondary";
  children: React.ReactNode;
}

export function ActionButton({ to, className, variant = "default", children }: ActionButtonProps) {
  return (
    <Button
      asChild
      variant={variant}
      size="lg"
      className={cn("h-16 text-lg shadow-md", className)}
    >
      <Link to={to}>{children}</Link>
    </Button>
  );
}
