import { Button } from "@/components/ui/button";
import type { Bug } from "./types/interfaces";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

interface BugProps {
  bug: Bug
currentUser: { _id: string; role?: string[] } | null;
}


const BugItem = ({bug, currentUser}: BugProps) => {
    const navigate = useNavigate()

    const DisplayBug = () => {
        if (bug.title && bug.title.trim().length > 0) {
            return bug.title;
        }
        else {
            return "Untitled Bug";
        }
    } 
    const canEdit = () => {
    if (!currentUser) return false; // no user => cannot edit
    return currentUser.role?.includes("Business Analyst") || bug.assignedTo === currentUser._id;
  };

  return (
     <div className="flex items-center justify-between gap-4">
      <div
        className="cursor-pointer"
        onClick={() => navigate(`/bug/${bug._id}`)}
      >
        <h3 className="font-semibold">{DisplayBug()}</h3>
        <p className="text-sm text-muted-foreground">
          {bug.classification}
        </p>
      </div>
      {canEdit() && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(`/bug/${bug._id}/edit`)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      <div className="text-sm text-gray-500">{bug._id || "No ID"}</div>
      <div className="text-sm text-gray-500">{bug.description || "No Description"}</div>
    </div>
  )
}
export {BugItem}