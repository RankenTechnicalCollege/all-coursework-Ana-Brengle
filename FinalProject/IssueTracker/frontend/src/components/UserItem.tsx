import type { User } from "./types/interfaces";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import { useState } from "react";
import { UserInfo } from "./UserInfo";

interface UserProps {
  user: User;
  onEdit?: (userId: string) => void;
}

const UserItem = ({ user, onEdit }: UserProps) => {
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);

  const getDisplayName = () => {
    if (!user) return "Loading...";
    if (user.fullName && user.fullName.trim().length > 0) return user.fullName;
    if (user.email) return user.email;
    return "No User";
  };
  const roles = Array.isArray(user.role) ? user.role : [];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="font-medium text-lg">{getDisplayName()}</div>
        {onEdit && (
          <Button size="sm" variant="ghost" onClick={() => onEdit(user._id)}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={() => setIsUserInfoOpen(true)}>
          <Eye className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-sm text-gray-500">{user._id || "No ID"}</div>
      <div className="text-sm text-gray-500">{user.email || "No email"}</div>
      <div className="flex gap-2 flex-wrap">
        {roles.length > 0
    ? roles.map((role, i) => <Badge key={i}>{role}</Badge>)
    : <Badge>No role</Badge>
  }
      </div>
      <UserInfo isOpen={isUserInfoOpen} onOpenChange={setIsUserInfoOpen} userId={user._id} />
    </div>
  );
};

export { UserItem };
