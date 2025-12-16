"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import  type { Bug } from "./types/interfaces";

interface BugProps {
  bug: Bug;
}

export function BugSheet({ bug }: BugProps) {
  return (
    <Sheet>
      <SheetContent position="right" size="lg">
        <SheetHeader>
          <SheetTitle>{bug.title}</SheetTitle>
          <SheetDescription>Details for the bug report</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          <div>
            <h4 className="font-semibold">Description</h4>
            <p>{bug.description}</p>
          </div>
          <div>
            <h4 className="font-semibold">Steps to Reproduce</h4>
            <p>{bug.stepsToReproduce}</p>
          </div>
          <div>
            <h4 className="font-semibold">Author</h4>
            <p>{bug.authorOfBug}</p>
          </div>
          <div>
            <h4 className="font-semibold">Classification</h4>
            <p>{bug.classification}</p>
          </div>
          <div>
            <h4 className="font-semibold">Status</h4>
            <p>{bug.closedOn ? "Closed" : "Open"}</p>
          </div>

          <div>
            <h4 className="font-semibold">Created On</h4>
            <p>{new Date(bug.createdOn).toLocaleString()}</p>
          </div>

          <div>
            <h4 className="font-semibold">Last Updated</h4>
            <p>{new Date(bug.lastUpdated).toLocaleString()}</p>
          </div>

          {bug.assignedUserName && (
            <div>
              <h4 className="font-semibold">Assigned To</h4>
              <p>{bug.assignedUserName}</p>
            </div>
          )}

          <div>
            <h4 className="font-semibold">Test Cases</h4>
            {bug.testCases.length > 0 ? (
              <ul className="list-disc ml-5">
                {bug.testCases.map((tc, idx) => (
                  <li key={idx}>{tc}</li>
                ))}
              </ul>
            ) : (
              <p>None</p>
            )}
          </div>

          <div>
            <h4 className="font-semibold">Work Hours Logged</h4>
            {bug.workHoursLogged.length > 0 ? (
              <ul className="list-disc ml-5">
                {bug.workHoursLogged.map((wh, idx) => (
                  <li key={idx}>{wh}</li>
                ))}
              </ul>
            ) : (
              <p>None</p>
            )}
          </div>

          <div>
            <h4 className="font-semibold">Fix Version</h4>
            <p>{bug.fixInVersion || "Not assigned"}</p>
          </div>

          <div>
            <h4 className="font-semibold">Fixed On</h4>
            <p>{bug.fixedOnDate ? new Date(bug.fixedOnDate).toLocaleString() : "Not fixed"}</p>
          </div>

          <div>
            <h4 className="font-semibold">Closed On</h4>
            <p>{bug.closedOn ? new Date(bug.closedOn).toLocaleString() : "Not closed"}</p>
          </div>

          <div>
            <h4 className="font-semibold">Comments</h4>
            {bug.comments.length > 0 ? (
              <ul className="list-disc ml-5">
                {bug.comments.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            ) : (
              <p>No comments yet</p>
            )}
          </div>

          <div>
            <h4 className="font-semibold">Edits</h4>
            {bug.edits.length > 0 ? (
              <ul className="list-disc ml-5">
                {bug.edits.map((e, idx) => (
                  <li key={idx}>{e}</li>
                ))}
              </ul>
            ) : (
              <p>No edits</p>
            )}
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button variant="secondary">Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
