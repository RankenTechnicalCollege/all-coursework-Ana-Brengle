'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import api from "@/lib/api";
import type { Bug } from "./types/interfaces";
import type { User } from "./types/interfaces";
import { toast } from "react-toastify";

interface EditBugDialogProps {
  bug: Bug;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export default function EditBugDialog({ bug, onOpenChange, open, onSave }: EditBugDialogProps) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stepsToReproduce, setStepsToReproduce] = useState("");
  const [comment, setComment] = useState("");
  const [classification, setClassification] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [statusLabel, setStatusLabel] = useState("");
  const [assignUser, setAssignUser] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Fetch assignable users
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      const allowedUsers: User[] = res.data.filter(
        (u: User) => u.role.includes("developer") || u.role.includes("quality analyst")
      );
      setAssignUser(allowedUsers);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    }
  };

  // Fetch current user
  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/users/me");
      setCurrentUser(res.data as User);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch current user");
    }
  };

  useEffect(() => {
  const fetchData = async () => {
    await fetchUsers();
    await fetchCurrentUser();
  };

  fetchData();
}, []);

  // Initialize form fields when bug changes
  useEffect(() => {
    if (!bug) return;
    const initializeFactors = () => {
    setTitle(bug.title || "");
    setDescription(bug.description || "");
    setStepsToReproduce(bug.stepsToReproduce || "");
    setClassification(bug.classification || "");
    setAssignedUser(bug.assignedUser || "");
    setStatusLabel(bug.statusLabel || "open");

    };
    initializeFactors();
   
  }, [bug]);

  const canEdit = currentUser
    ? currentUser.role.includes("developer") || bug.assignedTo === currentUser._id
    : false;

  const canAssignUser = currentUser ? currentUser.role.includes("developer") || currentUser.role.includes("quality analyst") : false;

  const canClassify = currentUser ? currentUser.role.includes("business analyst") || currentUser.role.includes("technical manager") : false;

  const handleSave = async () => {
    try {
      const patchData: Partial<Bug> = {};
      if (title !== bug.title) patchData.title = title;
      if (description !== bug.description) patchData.description = description;
      if (JSON.stringify(stepsToReproduce) !== JSON.stringify(bug.stepsToReproduce || [])) patchData.stepsToReproduce = stepsToReproduce;
      if (classification !== bug.classification) patchData.classification = classification;
      if (assignedUser !== bug.assignedUser) patchData.assignedUser = assignedUser;
      if (statusLabel !== bug.statusLabel) patchData.statusLabel = statusLabel;

      if (Object.keys(patchData).length === 0) {
        onOpenChange(false);
        return;
      }

      const response = await api.patch(`/bugs/${bug._id}`, patchData);
      const updatedBug = response.data;
      toast.success(`Bug updated : ${updatedBug._id}`, { position: "bottom-right" });
      onSave();
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to update bug:", err);
      toast.error("Failed to update bug");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Bug</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mt-1">
            <div className="space-y-1">
              <p><span className="font-medium">Bug Id:</span> {bug._id}</p>
              <p><span className="font-medium">Bug Title:</span> {bug.title}</p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <form className="mt-6 space-y-6">
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[80px]"
                readOnly={!canEdit}
              />
            </Field>
            <Field>
              <FieldLabel>Steps to Reproduce</FieldLabel>
              <Textarea
                value={stepsToReproduce}
                onChange={(e) => setStepsToReproduce(e.target.value)}
                className="w-full min-h-[80px]"
                readOnly={!canEdit}
              />
            </Field>
            <FieldSeparator />
            <Field>
              <FieldLabel>Add a Comment</FieldLabel>
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full"
                disabled={!currentUser}
              />
            </Field>
            <FieldSeparator />
            {canClassify && (
              <Field>
                <FieldLabel>Classification</FieldLabel>
                <RadioGroup value={classification} onValueChange={setClassification} className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="approved" id="r1" />
                    <Label htmlFor="r1">Approved</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="unapproved" id="r2" />
                    <Label htmlFor="r2">Unapproved</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="duplicate" id="r3" />
                    <Label htmlFor="r3">Duplicate</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="unclassified" id="r4" />
                    <Label htmlFor="r4">Unclassified</Label>
                  </div>
                </RadioGroup>
              </Field>
            )}
            <FieldSeparator />
            {canAssignUser && (
              <Field>
                <FieldLabel>Assign To User</FieldLabel>
                <Select value={assignedUser} onValueChange={setAssignedUser}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select User" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignUser.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.fullName} ({user.role.join(", ")})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select value={statusLabel} onValueChange={setStatusLabel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <DialogFooter className="flex justify-end gap-3 mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleSave} disabled={!canEdit}>Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
