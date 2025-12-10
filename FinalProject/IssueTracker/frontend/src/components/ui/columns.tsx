import {type ColumnDef} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

type Bug = {
    _id: string
  id?: string
  bugId?: string
  title?: string
  description?: string
  stepsToReproduce?: string
  authorOfBug?: string
  createdOn: string
  classification: string
  closed: boolean
  lastUpdated: string
  edits: string[],
  comments: string[]
  classifiedOn: Date
  assignedToUserName: string
  assignedToUserId: string
  testCases: string[]
  closedOn: string
}

export const columns = (
  onView: (bug: Bug) => void,   // For viewing bug details
  onEdit: (bug: Bug) => void    // For editing bug
): ColumnDef<Bug>[] => [
  {
    id: "select",
    header: ({table}) => (
        <Checkbox checked={table.getIsAllRowsSelected()}
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label='Select All' />
    ),
    cell: ({row}) => (
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select Row'
        /> 
    ),
    enableSorting: false,
    enableHiding: false
  },
    {
      accessorKey: 'title',
      header: "Title",
      cell: ({row}) => {
        const bugTitle = row.getValue('title') as string
        return<span>{bugTitle || "Unassigned"}</span>
      }
    },
    {
      accessorKey: 'bugId',
      header: "Bug Id",
      cell: ({row}) => {
        const bugId = row.original._id
        return (
          <button onClick={() => onView(row.original)} className='text-blue-600 hover:text-blue-800 hover:underline font-mono '>{bugId}</button>
        )
      }
    },
    {
      accessorKey: 'classification',
      header: "Classification",
      cell: ({row}) => {
        const classification = row.getValue('classification') as string
        return<span>{classification || "open"}</span>
      }
    },
    {
      accessorKey: 'authorOfBug',
      header: "Bug author",
      cell: ({row}) => {
        const bugAuthor = row.getValue('authorOfBug') as string
        return<span>{bugAuthor || "Unknown"}</span>
      }
    },
    {
      accessorKey: 'assignedToUserName',
      header: "Assigned To",
      cell: ({row}) => {
        const assignedToUserName = row.getValue('assignedToUserName') as string
        return<span>{assignedToUserName || "Unassigned"}</span>
      }
    },
    {
      accessorKey: 'edit',
      header: "Edit Bug",
      cell: ({row}) => {
        return (
          <Button variant="outline" size="sm" onClick={() => onEdit(row.original)}>Edit</Button>
        )
      }
    }
  ]