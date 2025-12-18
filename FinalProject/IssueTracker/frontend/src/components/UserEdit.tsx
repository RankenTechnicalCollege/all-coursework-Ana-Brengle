"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectValue,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
} from "@/components/ui/multi-select";
import { toast } from "react-toastify";
import { Ban, Download } from "lucide-react";
import api from "@/lib/api";
import type { User, Bug } from "./types/interfaces";

const AVAILABLE_ROLES = ["Developer", "Business Analyst", "Quality Analyst", "Product Manager", "Technical Manager"];

interface UserEditDialogProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserEditDialog: React.FC<UserEditDialogProps> = ({ userId, open, onOpenChange }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [assignedBugs, setAssignedBugs] = useState<string[]>([]);
  const [bugsList, setBugsList] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(false);

  // Load user data
  useEffect(() => {
    if (!userId) return;
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userResponse = await api.get<User>(`/users/${userId}`);
        const user = userResponse.data;
        setFullName(user.fullName ?? "");
        setEmail(user.email ?? "");
        setRoles(Array.isArray(user.role) ? user.role : []);
        setAssignedBugs(user.assignedBugs ?? []);

        const bugsResponse = await api.get<Bug[]>("/bugs");
        setBugsList(bugsResponse.data ?? []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load user data", { position: "bottom-right" });
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleRoleToggle = (role: string) => {
    setRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const userData: Partial<User> = { fullName, email, role: roles, assignedBugs };
      await api.patch(`/users/${userId}`, userData);
      toast.success("User updated successfully", { position: "bottom-right" });
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save user changes", { position: "bottom-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Edit name, email, roles, and assigned bugs.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveChanges();
          }}
          className="mt-6 space-y-6"
        >
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel>Full Name</FieldLabel>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={loading} />
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
            </Field>
            <FieldSeparator />
            <Field>
              <FieldLabel>Roles</FieldLabel>
              <div className="flex flex-col mt-2 space-y-1">
                {AVAILABLE_ROLES.map((role) => {
                  const roleId = role.replace(/\s+/g, "-").toLowerCase();
                  return (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox id={roleId} checked={roles.includes(role)} onCheckedChange={() => handleRoleToggle(role)} disabled={loading} />
                      <Label htmlFor={roleId}>{role}</Label>
                    </div>
                  );
                })}
              </div>
            </Field>
            <FieldSeparator />
            <Field>
              <FieldLabel>Assign Bugs</FieldLabel>
              <MultiSelect values={assignedBugs} onValuesChange={setAssignedBugs}>
                <MultiSelectTrigger>
                  <MultiSelectValue placeholder="Select Bugs..." />
                </MultiSelectTrigger>
                <MultiSelectContent>
                  <MultiSelectGroup>
                    {bugsList.map((bug) => (
                      <MultiSelectItem key={bug._id} value={bug._id!}>
                        {bug.title || "Untitled Bug"}
                      </MultiSelectItem>
                    ))}
                  </MultiSelectGroup>
                </MultiSelectContent>
              </MultiSelect>
            </Field>
          </FieldGroup>
          <DialogFooter className="flex justify-end gap-3 mt-4">
            <DialogClose asChild>
              <Button variant="outline">
                <Ban /> Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              <Download /> Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
