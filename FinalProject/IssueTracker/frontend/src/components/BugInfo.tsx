'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import api from "@/lib/api"; 
import type { Bug } from "./types/interfaces";
import { toast } from "react-toastify";
import { DoorClosed} from "lucide-react";


interface BugSheetProps {
  bugId: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCloseBug?: (bugId: string) => void;
}

const BugSheet = ({bugId, isOpen = false, onOpenChange, onCloseBug }: BugSheetProps) => {
  const [bug, setBug] = useState<Bug | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bugOverview");

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
    if (!bug || !bug._id) return;
    try {
      await api.patch(`/bugs/${bug._id}`, { statusLabel: "closed" });
      setBug({ ...bug, statusLabel: "closed" });
      toast.success("Bug closed successfully!");
      if (onCloseBug) onCloseBug(bug._id);
    } catch (err) {
      console.error("Failed to close bug:", err);
      toast.error("Failed to close bug");
    }
  };

  if (loading) return <p>Loading bug details...</p>;
  if (!bug) return <p>Bug not found</p>;

  const steps = bug.stepsToReproduce?.split("\n") || [];

  const tabs = [
    {
      id: "bugOverview",
      label: "Basic Bug Info",
      content: (
        <div className="space-y-2">
          <p><strong>Title:</strong> {bug.title}</p>
          <p><strong>Description:</strong> {bug.description}</p>
          <p><strong>Author:</strong> {bug.authorOfBug}</p>
          {steps.length > 0 && (
            <div>
              <strong>Steps to Reproduce:</strong>
              <ul className="list-disc list-inside">
                {steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "comments",
      label: "Comments",
      content: (
        <div className="space-y-2">
          {bug.comments?.length ? (
            bug.comments.map((comment, index) => (
              <div key={index} className="p-2 border rounded">
                <p className="text-sm font-semibold">{bug.authorOfBug}:</p>
                <p>{comment.text}</p>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      ),
    },
    {
      id: "testCases",
      label: "Test Cases",
      content: (
        <div className="space-y-2">
          {bug.testCases?.length ? (
            bug.testCases.map((tc, index) => <p key={index}>{tc.text}</p>)
          ) : (
            <p>No test cases found.</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Bug Information</SheetTitle>
          <SheetDescription>
            Detailed information and status of the selected bug
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 p-4">
          <div className="flex gap-2 border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-3 pb-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-primary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-sm mt-4">
            {tabs.find((tab) => tab.id === activeTab)?.content}
          </div>
        </div>

        <SheetFooter className="flex flex-col gap-2 mt-4">
          <Button
            className="w-full"
            variant="destructive"
            onClick={handleCloseBug}
            disabled={bug.statusLabel === "closed"}
          >
            <DoorClosed /> Close Bug
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default BugSheet;
