"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { BadgeCheck, Ban, Trash2 } from "lucide-react";
import type { Bug, Comments, TestCases, User } from "./types/interfaces";

interface EditBugDialogProps {
  bug: Bug;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export default function EditBugDialog({ bug, onOpenChange, open, onSave }: EditBugDialogProps) {
  const [title, setTitle] = useState(bug?.title || "");
  const [description, setDescription] = useState(bug?.description || "");
  const [stepsToReproduce, setStepsToReproduce] = useState(bug?.stepsToReproduce || "");
  const [classification, setClassification] = useState(bug?.classification || "");
  const [assignedUser, setAssignedUser] = useState(bug?.assignedUser || "");
  const [statusLabel, setStatusLabel] = useState(bug?.statusLabel || "");
  const [comment, setComment] = useState("");
  const [newTestCase, setNewTestCase] = useState("");
  const [comments, setComments] = useState<Comments[]>(bug?.comments || []);
  const [testCases, setTestCases] = useState<TestCases[]>(bug?.testCases || []);
  const [assignUser, setAssignUser] = useState<User[]>([]);

  // Fetch assignable users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setAssignUser(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  // Save bug changes
  const handleSave = async () => {
    try {
      const patchData: Partial<Bug> = {
        title,
        description,
        stepsToReproduce,
        classification,
        assignedUser,
        statusLabel,
      };
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
    try {
      const res = await api.post(`/bugs/${bug._id}/comments`, { text: comment });
      const newComment = res.data.comment || { text: comment, commentAuthor: { fullName: "Anonymous" }, createdOn: new Date().toISOString() };
      setComments([...comments, newComment]);
      setComment("");
      toast.success(res.data.message || "Comment added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    }
  };

  // Add test case
  const handleAddTestCase = async () => {
    try {
      const res = await api.post(`/bugs/${bug._id}/tests`, { title: newTestCase, status: "open" });
      const addedTest: TestCases = { text: newTestCase, testAuthor: { fullName: "Anonymous" } };
      setTestCases([...testCases, addedTest]);
      setNewTestCase("");
      toast.success(res.data.message || "Test case added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add test case");
    }
  };

  // Delete test case
  const handleDeleteTestCase = async (testCaseId: string) => {
    try {
      const testCaseToDelete = testCases.find((t) => t._id === testCaseId);
      if (!testCaseToDelete) return toast.error("Test case not found");
      if (testCaseToDelete._id) await api.delete(`/bugs/${bug._id}/tests/${testCaseToDelete._id}`);
      setTestCases(testCases.filter((t) => t._id !== testCaseId));
      toast.success("Test case deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete test case");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>Edit Bug</DialogTitle>
          <DialogDescription>
            <p><strong>Bug Id:</strong> {bug._id}</p>
            <p><strong>Bug Title:</strong> {bug.title}</p>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full min-h-[80px]" />
            </Field>

            <Field>
              <FieldLabel>Steps to Reproduce</FieldLabel>
              <Textarea value={stepsToReproduce} onChange={(e) => setStepsToReproduce(e.target.value)} className="w-full min-h-[80px]" />
            </Field>

            <FieldSeparator />

            <Field>
              <FieldLabel>Classification</FieldLabel>
              <RadioGroup value={classification} onValueChange={setClassification} className="flex flex-col gap-2 mt-2">
                {["approved", "unapproved", "duplicate", "unclassified"].map((val) => (
                  <div className="flex items-center gap-3" key={val}>
                    <RadioGroupItem value={val} id={val} />
                    <label htmlFor={val}>{val.charAt(0).toUpperCase() + val.slice(1)}</label>
                  </div>
                ))}
              </RadioGroup>
            </Field>

            <FieldSeparator />

            <Field>
              <FieldLabel>Assign To User</FieldLabel>
              <Select value={assignedUser} onValueChange={setAssignedUser}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select User" /></SelectTrigger>
                <SelectContent>
                  {assignUser.map((user) => <SelectItem key={user._id} value={user._id}>{user.fullName}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select value={statusLabel} onValueChange={setStatusLabel}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select Status" /></SelectTrigger>
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
                    <strong>{c.commentAuthor?.fullName || "Anonymous"}:</strong> {c.text}
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment" />
                  <Button onClick={handleAddComment}>Add</Button>
                </div>
              </div>
            </Field>

            <FieldSeparator />

            {/* Test Cases */}
            <Field>
              <FieldLabel>Test Cases</FieldLabel>
              <div className="flex flex-col gap-2">
                {testCases.map((t) => (
                  <div key={t._id || t.text} className="flex justify-between items-center p-2 border rounded">
                    <span>{t.text}</span>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteTestCase(t._id!)}><Trash2 size={16} /></Button>
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <Input value={newTestCase} onChange={(e) => setNewTestCase(e.target.value)} placeholder="Add a test case" />
                  <Button onClick={handleAddTestCase}>Add</Button>
                </div>
              </div>
            </Field>
          </FieldGroup>

          <DialogFooter className="flex justify-end gap-3 mt-4">
            <DialogClose asChild><Button variant="outline"><Ban /> Cancel</Button></DialogClose>
            <Button type="submit"><BadgeCheck /> Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
