
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface AvatarUserProps {
  name?: string;
}

export function AvatarUser({ name }: AvatarUserProps) {
  // Generate initials from name if provided
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : null;

  return (
    <Avatar className="h-9 w-9 border border-vao-light">
      <AvatarFallback className="bg-vao-light text-vao-primary">
        {initials || <User className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  );
}
