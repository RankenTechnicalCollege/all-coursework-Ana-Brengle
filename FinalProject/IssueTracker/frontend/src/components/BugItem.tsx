import { Button } from "@/components/ui/button";
import type { Bug } from "./types/interfaces";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BugProps {
  bug: Bug;
  onEdit: (bug: Bug) => void;
}

const BugItem = ({ bug, onEdit }: BugProps) => {
  const navigate = useNavigate();

  const displayBugTitle = () => (bug.title?.trim() ? bug.title : "Untitled Bug");

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="cursor-pointer" onClick={() => navigate(`/bug/${bug._id}`)}>
        <h3 className="font-semibold">{displayBugTitle()}</h3>
        <p className="text-sm text-muted-foreground">
          <Badge>{bug.classification || "Unclassified"}</Badge>
        </p>
      </div>

      <Button
        variant="outline"
        size="icon"
        aria-label="Edit Bug"
        onClick={() => onEdit(bug)}
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <div className="flex flex-col text-sm text-gray-500">
        <span>{bug._id || "No ID"}</span>
        <span>{bug.description || "No Description"}</span>
      </div>
    </div>
  );
};

export { BugItem };
