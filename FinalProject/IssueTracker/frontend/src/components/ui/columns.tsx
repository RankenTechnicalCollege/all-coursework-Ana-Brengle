"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { Bug } from "../types/interfaces";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { EllipsisVertical } from "lucide-react";

export const columns = (
  onView?: (bug: Bug) => void,
  onEdit?: (bug: Bug) => void,
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
    header: "",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          {onView && (
            <DropdownMenuItem onClick={() => onView(row.original)}>
              View
            </DropdownMenuItem>
          )}
          {onEdit && (
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              Edit
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
