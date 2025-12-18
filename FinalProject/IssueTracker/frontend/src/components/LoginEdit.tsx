import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import api from "@/lib/api";
import type { User } from "./types/interfaces";
import { toast } from "react-toastify";

interface ExampleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UpdateProfileData {
  fullName: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
}

const Example: React.FC<ExampleProps> = ({ open, onOpenChange }) => {
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load logged-in user when sheet opens
  useEffect(() => {
    if (!open) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await api.get<User>("/users/me");
        setUser(res.data);
        setFullName(res.data.fullName || "");
        setEmail(res.data.email || "");
      } catch (err) {
        console.error("Failed to fetch user data", err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [open]);

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    // Password validation
    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (newPassword && !currentPassword) {
      setError("Current password is required to set a new password");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updateData: UpdateProfileData = {
        fullName,
        email,
      };

      if (newPassword) {
        updateData.newPassword = newPassword;
        updateData.currentPassword = currentPassword;
      }

      // PATCH logged-in user
      const { data } = await api.patch<User>("/users/me", updateData);
      setUser(data);
      setFullName(data.fullName ?? "");
      setEmail(data.email ?? "");
      toast.success("Profile updated successfully");
      onOpenChange(false);
    } catch (err: unknown) {
      console.error("Error updating profile:", err);
      const message =
        err instanceof Error ? err.message : "Failed to update profile";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 p-4">
            {error && <div className="text-red-600">{error}</div>}
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password to change password"
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                disabled={loading}
              />
            </div>
          </div>

          <SheetFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default Example;
