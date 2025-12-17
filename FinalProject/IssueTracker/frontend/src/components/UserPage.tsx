"use client";

import { columns } from "@/components/ui/columns";
import { DataTable } from "@/components/ui/data-table";
import type { Bug, User } from "./types/interfaces";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import EditBugDialog from "./BugEdit";
import { ChartRadialLabel } from "./ui/BugChart";
import BugSheet from "./BugInfo";
import api from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";

export default function UserPage() {
  const [user, setUser] = useState<User | null>(null);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingBugs, setLoadingBugs] = useState(true);

  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [selectedBugId, setSelectedBugId] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Fetch user data
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get(`/users/me`); // adjust endpoint
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUser();
  }, []);

  // Fetch bugs assigned to this user
  useEffect(() => {
    async function fetchBugs() {
      if (!user?._id) return;
      try {
        const res = await api.get(`/bugs?assignedUser=${user._id}`);
        setBugs(res.data);
      } catch (err) {
        console.error("Failed to fetch bugs", err);
      } finally {
        setLoadingBugs(false);
      }
    }
    fetchBugs();
  }, [user]);

  const handleView = (bug: Bug) => {
    if (bug._id) setSelectedBugId(bug._id);
    setIsSheetOpen(true);
  };

  const handleEdit = (bug: Bug) => {
    setSelectedBug(bug);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center gap-4">
            {loadingUser ? (
              <Spinner />
            ) : user ? (
              <>
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-xl font-bold">
                  {user.fullName?.[0] ?? "U"}
                </div>
                <div className="flex flex-col">
                  <CardTitle>{user.fullName}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                  <CardDescription>
                    Roles: {user.role?.join(", ") ?? "None"}
                  </CardDescription>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">User not found</p>
            )}
          </CardHeader>
        </Card>

        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle>User Bugs</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="p-0 flex-1">
            <ScrollArea className="h-96">
              <div className="flex flex-col space-y-2 p-2">
                {loadingBugs ? (
                  <div className="flex justify-center items-center h-full">
                    <Spinner />
                  </div>
                ) : bugs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center">
                    No bugs assigned.
                  </p>
                ) : (
                  bugs.map((bug) => (
                    <Card
                      key={bug._id}
                      className="p-3 hover:bg-muted cursor-pointer"
                      onClick={() => handleView(bug)}
                    >
                      <CardHeader className="p-0">
                        <CardTitle className="text-sm font-semibold">
                          {bug.title}
                        </CardTitle>
                        {/* <CardDescription className="text-xs text-muted-foreground">
                          Last Updated: {new Date(bug.lastUpdated).toLocaleDateString()}
                        </CardDescription> */}
                      </CardHeader>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <div className="md:grid md:grid-cols-1 gap-4">
        <ChartRadialLabel />
      </div>
      <DataTable columns={columns(handleView, handleEdit)} data={bugs} />
      {selectedBug && (
        <EditBugDialog
          bug={selectedBug}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={() => {
            console.log("Bug saved");
          }}
        />
      )}
      {selectedBugId && (
        <BugSheet
          bugId={selectedBugId}
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          onCloseBug={() => setSelectedBugId(null)}
        />
      )}
    </div>
  );
}
