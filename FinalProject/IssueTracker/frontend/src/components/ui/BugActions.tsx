"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import BugSheet from "../BugInfo";
import { useState } from "react";

interface BugActionsProps {
  bugId: string;
}

export const BugActions = ({ bugId }: BugActionsProps) => {
const [isOpen, setIsOpen] = useState(false);
  if (!bugId) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            View Bug Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <BugSheet
        bugId={bugId}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
};
