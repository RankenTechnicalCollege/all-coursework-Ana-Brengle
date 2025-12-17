'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import api from "@/lib/api"; // Your API helper
import type { Bug } from "./types/interfaces";
import { toast } from "react-toastify";

interface BugSheetProps {
  bugId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCloseBug?: (bugId: string) => void;
}

const BugSheet = ({ bugId, onCloseBug }: BugSheetProps) => {
  const [bug, setBug] = useState<Bug | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the bug data
  useEffect(() => {
    const fetchBug = async () => {
      try {
        const res = await api.get(`/bugs/${bugId}`);
        setBug(res.data);
      } catch (err) {
        console.error("Failed to fetch bug:", err);
        toast.error("Failed to load bug data");
      } finally {
        setLoading(false);
      }
    };

    fetchBug();
  }, [bugId]);

  const handleCloseBug = async () => {
    if (!bug) return;
    try {
      await api.patch(`/bugs/${bug._id}`, { statusLabel: "closed" });
      console.log("Bug closed successfully!");
      setBug({ ...bug, statusLabel: "closed" });
      if (onCloseBug && bug._id) onCloseBug(bug._id);
    } catch (err) {
      console.error("Failed to close bug:", err);
      toast.error("Failed to close bug");
    }
  };

  if (loading) return <p>Loading bug details...</p>;
  if (!bug) return <p>Bug not found</p>;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>View Bug Details</Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Bug Information</SheetTitle>
          <SheetDescription>
            Detailed information and status of the selected bug
          </SheetDescription>
        </SheetHeader>

        <Separator />

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="mb-2 text-sm font-semibold">Title</h4>
              <p className="text-sm text-muted-foreground">{bug.title}</p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold">Description</h4>
              <p className="text-sm text-muted-foreground">{bug.description}</p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold">Steps to Reproduce</h4>
              <p className="text-sm text-muted-foreground">{bug.stepsToReproduce}</p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold">Status</h4>
              <p className="text-sm text-muted-foreground">{bug.statusLabel}</p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold">Classification</h4>
              <p className="text-sm text-muted-foreground">{bug.classification}</p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold">Assigned To</h4>
              <p className="text-sm text-muted-foreground">{bug.assignedUser ?? "Unassigned"}</p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold">Author</h4>
              <p className="text-sm text-muted-foreground">{bug.authorOfBug ?? "Unknown"}</p>
            </div>
          </div>
        </div>

        <Separator />

        <SheetFooter className="flex flex-col gap-2">
          <Button className="w-full" variant="outline">
            Add Comment
          </Button>
          <Button className="w-full">Edit Bug</Button>
          <Button
            className="w-full"
            variant="destructive"
            onClick={handleCloseBug}
            disabled={bug.statusLabel === "closed"}
          >
            Close Bug
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default BugSheet;
