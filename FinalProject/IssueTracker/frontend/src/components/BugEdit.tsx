"use client";

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
import type { Bug, TestCases } from "./types/interfaces";
import type { User } from "./types/interfaces";
import { toast } from "react-toastify";
import { BadgeCheck, Ban, Trash2 } from "lucide-react";

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
  const [newTestCase, setNewTestCase] = useState("");
  const [testCases, setTestCases] = useState(bug?.testCases || []);
  const [comments, setComments] = useState(bug?.comments || []);

  // Fetch assignable users
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      const allowedUsers: User[] = res.data.filter(
        (u: User) => u.permissions.canBeAssignedTo
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
  setTitle(bug.title || ""),
  setDescription(bug.description || ""),
  setStepsToReproduce(bug.stepsToReproduce || ""),
  setClassification(bug.classification || ""),
  setAssignedUser(bug.assignedUser || ""),
  setStatusLabel(bug.statusLabel || "open"),
  setTestCases(bug.testCases || []),
  setComments(bug.comments || []),
}, [bug]);
  // Permission checks
  const canEditBug = currentUser
    ? currentUser.permissions.canEditAnyBug ||
      (currentUser.permissions.canEditMyBug && bug.authorOfBug === currentUser._id) ||
      (currentUser.permissions.canEditIfAssignedTo && bug.assignedTo === currentUser._id)
    : false;

  const canAssignUser = currentUser ? currentUser.permissions.canReassignAnyBug || currentUser.permissions.canReassignIfAssignedTo : false;
  const canClassify = currentUser ? currentUser.permissions.canClassifyAnyBug : false;
  const canAddComment = currentUser ? currentUser.permissions.canAddComment : false;
  const canAddTestCase = currentUser ? currentUser.permissions.canAddTestCase : false;
  const canDeleteTestCase = currentUser ? currentUser.permissions.canDeleteTestCase : false;

  // Save bug changes
  const handleSave = async () => {
    try {
      const patchData: Partial<Bug> = {};
      if (title !== bug.title) patchData.title = title;
      if (description !== bug.description) patchData.description = description;
      if (stepsToReproduce !== bug.stepsToReproduce) patchData.stepsToReproduce = stepsToReproduce;
      if (classification !== bug.classification) patchData.classification = classification;
      if (assignedUser !== bug.assignedUser) patchData.assignedUser = assignedUser;
      if (statusLabel !== bug.statusLabel) patchData.statusLabel = statusLabel;

      if (Object.keys(patchData).length === 0) {
        onOpenChange(false);
        return;
      }

      const response = await api.patch(`/bugs/${bug._id}`, patchData);
      toast.success(`Bug updated: ${response.data._id}`, { position: "bottom-right" });
      onSave();
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to update bug:", err);
      toast.error("Failed to update bug");
    }
  };

  // Add comment
  const handleAddComment = async () => {
    if (!comment || !currentUser) return;
    try {
      const res = await api.post(`/bugs/${bug._id}/comments`, {
        text: comment,
        authorId: currentUser._id,
      });
      setComments([...comments, { text: comment, author: currentUser.fullName }]);
      setComment("");
      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    }
  };

  // Add test case
  const handleAddTestCase = async () => {
    if (!newTestCase || !currentUser) return;
    try {
      const res = await api.post(`/bugs/${bug._id}/tests`, {
        title: newTestCase,
        status: "open",
      });
      const addedTest: TestCases = {
        text: newTestCase,
        author: currentUser.fullName,
      }
      setTestCases([...testCases, addedTest]);
      setNewTestCase("");
      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add test case");
    }
  };

  // Delete test case
  const handleDeleteTestCase = async (index: number) => {
    if (!canDeleteTestCase) return;
    try {
      // Ideally, call API to delete test case by ID
      const updated = [...testCases];
      updated.splice(index, 1);
      setTestCases(updated);
      toast.success("Test case deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete test case");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Bug</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mt-1">
            <p><span className="font-medium">Bug Id:</span> {bug._id}</p>
            <p><span className="font-medium">Bug Title:</span> {bug.title}</p>
          </DialogDescription>
        </DialogHeader>

        <form className="mt-6 space-y-6">
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                readOnly={!canEditBug}
              />
            </Field>
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                readOnly={!canEditBug}
                className="w-full min-h-[80px]"
              />
            </Field>
            <Field>
              <FieldLabel>Steps to Reproduce</FieldLabel>
              <Textarea
                value={stepsToReproduce}
                onChange={(e) => setStepsToReproduce(e.target.value)}
                readOnly={!canEditBug}
                className="w-full min-h-[80px]"
              />
            </Field>

            <FieldSeparator />

            {canClassify && (
              <Field>
                <FieldLabel>Classification</FieldLabel>
                <RadioGroup value={classification} onValueChange={setClassification} className="flex flex-col gap-2 mt-2">
                  {["approved", "unapproved", "duplicate", "unclassified"].map((val) => (
                    <div className="flex items-center gap-3" key={val}>
                      <RadioGroupItem value={val} id={val} />
                      <Label htmlFor={val}>{val.charAt(0).toUpperCase() + val.slice(1)}</Label>
                    </div>
                  ))}
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
                        {user.fullName}
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
                  {["open", "resolved", "closed"].map((status) => (
                    <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <FieldSeparator />

            {/* Comments */}
            <Field>
              <FieldLabel>Comments</FieldLabel>
              <div className="flex flex-col gap-2">
                {comments.map((c, idx) => (
                  <div key={idx} className="p-2 border rounded">
                    <strong>{c.author}:</strong> {c.text}
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <Input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={!canAddComment}
                    placeholder="Add a comment"
                  />
                  <Button onClick={handleAddComment} disabled={!canAddComment}>Add</Button>
                </div>
              </div>
            </Field>

            <FieldSeparator />

            {/* Test Cases */}
            <Field>
              <FieldLabel>Test Cases</FieldLabel>
              <div className="flex flex-col gap-2">
                {testCases.map((t, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 border rounded">
                    <span>{t.text}</span>
                    {canDeleteTestCase && (
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteTestCase(idx)}>
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newTestCase}
                    onChange={(e) => setNewTestCase(e.target.value)}
                    disabled={!canAddTestCase}
                    placeholder="Add a test case"
                  />
                  <Button onClick={handleAddTestCase} disabled={!canAddTestCase}>Add</Button>
                </div>
              </div>
            </Field>

          </FieldGroup>

          <DialogFooter className="flex justify-end gap-3 mt-4">
            <DialogClose asChild>
              <Button variant="outline"><Ban /> Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleSave} disabled={!canEditBug}><BadgeCheck /> Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
