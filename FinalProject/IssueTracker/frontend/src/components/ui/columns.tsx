"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { Bug } from "../types/interfaces";

import { BugActions } from "./BugActions";


export const columns = (

): ColumnDef<Bug>[] => [
  /* ---- Select column ---- */
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select All"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select Row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  /* ---- Bug ID ---- */
  {
    accessorKey: "bugId",
    header: "Bug ID",
    cell: ({ row }) => <span>{row.original.bugId || row.original._id || "N/A"}</span>,
  },

  /* ---- Title ---- */
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <span>{row.original.title || "Unassigned"}</span>,
  },

  /* ---- Status ---- */
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) =>
      row.original.status ? (
        <Badge variant="secondary">Closed</Badge>
      ) : (
        <Badge variant="outline">Open</Badge>
      ),
  },

  /* ---- Author ---- */
  {
    accessorKey: "authorOfBug",
    header: "Author",
    cell: ({ row }) => <span>{row.original.authorOfBug || "Unknown"}</span>,
  },

  /* ---- Actions (Ellipsis Dropdown) ---- */
  {
  id: "actions",
  header: "Actions",
  cell: ({ row }) => { const bugId = row.original._id || row.original.bugId;
    return bugId ? <BugActions bugId={bugId} /> : null;},
  enableSorting: false,
  enableHiding: false,

},
];
  