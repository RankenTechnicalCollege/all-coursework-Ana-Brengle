import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import api from "@/lib/api";
import type { User } from "./types/interfaces";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
interface UserInfoProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

const UserInfo = ({ isOpen, onOpenChange, userId }: UserInfoProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const fetchUser = async () => {
        try {
            const res = await api.get(`/users/${userId}`);
            setUser(res.data);
        } catch (err) {
            console.error("Failed to fetch user:", err);
            toast.error("Failed to load user data");
        } finally {
            setLoading(false);
        }
        };
        fetchUser();
    }, [userId]);

    return (
  <Sheet open={isOpen} onOpenChange={onOpenChange}>
    <SheetContent className="flex flex-col">
      <SheetHeader>
        <SheetTitle>User  Information</SheetTitle>
        <SheetDescription>
          Detailed user profile information
        </SheetDescription>
      </SheetHeader>
      <Separator />
      <div className="flex-1 overflow-y-auto p-4">
         {loading ? (
            <p className="text-sm text-muted-foreground">Loading user data...</p>
          ) : user ? (
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="mb-2 text-sm font-semibold">Description</h4>
                <p className="text-sm text-muted-foreground">
                  Full Name: {user.fullName}
                </p>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold">Specifications</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>Email: {user.email}</li>
                  <li>Roles: Roles: {Array.isArray(user.role) ? user.role.join(", ") : "None"}</li>
                  <li>Created Bugs: {user.createdBugs.length}</li>
                  <li>Assigned Bugs: {user.assignedBugs.length}</li>
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">User not found.</p>
          )}
        </div>
      <Separator />
    </SheetContent>
  </Sheet>
);
}

export { UserInfo };
