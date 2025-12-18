"use client";

import { columns as getColumns } from "@/components/ui/columns";
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

import { ChartRadialLabel } from "./ui/BugChart";
import BugSheet from "./BugInfo";
import api from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import AddBug from "./AddBug";

export default function UserPage() {
  const [user, setUser] = useState<User | null>(null);
  const [bugs, setBugs] = useState<(Bug & { userRelation: string })[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingBugs, setLoadingBugs] = useState(true);

  const [selectedBugId, setSelectedBugId] = useState<string | null>(null);

  // Fetch user data
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get(`/users/me`);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUser();
  }, []);

  // Fetch both assigned and created bugs
  useEffect(() => {
    async function fetchBugs() {
      if (!user?._id) return;
      setLoadingBugs(true);
      try {
        const [assignedRes, createdRes] = await Promise.all([
          api.get(`/bugs?assignedUser=${user._id}`),
          api.get(`/bugs?authorOfBug=${user.fullName}`)
        ]);

        // Mark assigned bugs
        const assignedIds = new Set(assignedRes.data.map((bug: Bug) => bug._id));
      const intersectionBugs = createdRes.data
        .filter((bug: Bug) => assignedIds.has(bug._id))
        .map((bug: Bug) => ({ ...bug, userRelation: "Both" }));

      setBugs(intersectionBugs);
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
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="grid md:grid-cols-2 gap-4">
        {/* User Card */}
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
                    Roles: {Array.isArray(user.role) ? user.role.join(", ") : "None"}
                  </CardDescription>
                  <div className="mt-3">
                    <AddBug onSave={() => {}} />
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">User not found</p>
            )}
          </CardHeader>
        </Card>

        {/* Bugs Card */}
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
                    No bugs assigned or created.
                  </p>
                ) : (
                  bugs.map((bug) => (
                    <Card
                      key={bug._id}
                      className="p-3 hover:bg-muted cursor-pointer"
                      onClick={() => handleView(bug)}
                    >
                      <CardHeader className="p-0 flex justify-between items-center">
                        <div>
                          <CardTitle className="text-sm font-semibold">
                            {bug.title}
                          </CardTitle>
                        </div>
                        <Badge variant="outline">Created & Assigned</Badge>
                      </CardHeader>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <div className="md:grid md:grid-cols-1 gap-4">
        <ChartRadialLabel />
      </div>

      {/* DataTable with userRelation column */}
      <DataTable
        columns={getColumns()}
        data={bugs}
      />

      {/* BugSheet */}
      {selectedBugId && (
        <BugSheet
          bugId={selectedBugId}
          onCloseBug={() => setSelectedBugId(null)}
        />
      )}
    </div>
  );
}
