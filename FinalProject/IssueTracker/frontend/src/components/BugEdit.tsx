'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import api from "@/lib/api";
import type { Bug } from "./types/interfaces";

interface EditBugDialogProps {
  bug: Bug;
  currentUserId: string;
  onUpdated: (updatedBug: Bug) => void;
}

export default function EditBugDialog({ bug, currentUserId, onUpdated }: EditBugDialogProps) {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState(bug.title);
  const [description, setDescription] = useState(bug.description);
  const [steps, setSteps] = useState(bug.stepsToReproduce || "");


  const handleSave = async () => {
    try {
      const patchData: Partial<Bug> = {};
      if (title !== bug.title) patchData.title = title;
      if (description !== bug.description) patchData.description = description;
      if (JSON.stringify(steps) !== JSON.stringify(bug.steps || [])) patchData.steps = steps;

      if (Object.keys(patchData).length === 0) {
        setOpen(false); // nothing changed
        return;
      }

      const response = await api.patch(`/bugs/${bug._id}`, patchData);
      onUpdated(response.data);
      setOpen(false);
    } catch (err) {
      console.error("Failed to update bug:", err);
      alert("Failed to update bug.");
    }
  };

  useEffect(() => {
    setTitle(bug.title);
    setDescription(bug.description);
    setSteps(bug.stepsToReproduce || " ");
  }, [bug]);

  // Permission check: only assigned user can edit
  const canEdit = bug.assignedTo === currentUserId;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {canEdit ? (
        <>
          <DialogTrigger asChild>
            <Button>Edit</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Bug</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Steps</Label>
                {steps.map((step, index) => (
                  <Textarea
                    key={index}
                    placeholder={`Steps ${index + 1}`}
                    value={step}
                    onChange={(e) => handleStepChange(index, e.target.value)}
                  />
                ))}
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </>
      ) : (
        <Button disabled title="Only the assigned user can edit this bug">
          Edit
        </Button>
      )}
    </Dialog>
  );
}
