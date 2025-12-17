import type { User } from "./types/interfaces";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
//import { useNavigate } from "react-router-dom";
interface UserProps {
  user: User;
  currentUser: User | null;
  onEdit?: (userId: string) => void
}

const UserItem = ({ user ,currentUser, onEdit }: UserProps) => {


  const getDisplayName = () => {
    if (!user) return "Loading...";
    if (user.fullName && user.fullName.trim().length > 0) return user.fullName;
    if (user.email) return user.email;
    return "No User";
  };

  const canEdit = () => {
    if (!currentUser) return false;
    return currentUser.role?.includes("Technical Manager") || currentUser._id === user._id;
  };


  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="font-medium text-lg">{getDisplayName()}</div>
        {canEdit() && onEdit && (
          <Button
            size="sm"
            variant="ghost"
           onClick={() => onEdit(user._id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="text-sm text-gray-500">{user._id || "No ID"}</div>
      <div className="text-sm text-gray-500">{user.email || "No email"}</div>
      <div className="flex gap-2 flex-wrap">
        {user.role?.length ? (
          user.role.map((role, index) => (
            <Badge key={index} variant="secondary">
              {role}
            </Badge>
          ))
        ) : (
          <Badge variant="secondary">No role</Badge>
        )}
      </div>
    </div>
  );
};

export { UserItem };
