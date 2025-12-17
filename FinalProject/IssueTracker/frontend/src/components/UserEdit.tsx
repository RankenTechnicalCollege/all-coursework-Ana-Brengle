"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,

} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import api from "@/lib/api"
import { toast } from "react-toastify"
import type { Bug, User } from "./types/interfaces"
import { useState,useEffect } from "react"

const availableRoles = [
  "Developer",
  "Business Analyst",
  "Quality Analyst",
  "Product Manager",
  "Technical Manager",
]
interface UserEditDialogProps {
  userId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const UserEditDialog:  React.FC<UserEditDialogProps> = ({
  userId,
  open,
  onOpenChange,
}) =>
    {const [fullName, setFullName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [roles, setRoles] = useState<string[]>([])
  const [assignedBugs, setAssignedBugs] = useState<string[]>([])
  const [bugsList, setBugsList] = useState<Bug[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // Fetch user and bugs data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return
      try {
        setLoading(true)

        const userResponse = await api.get<User>(`/users/${userId}`)
        const user = userResponse.data
        setFullName(user.fullName)
        setEmail(user.email)
        setRoles(user.role || [])
        setAssignedBugs(user.assignedBugs || [])

        const bugsResponse = await api.get<Bug[]>("/bugs")
        setBugsList(bugsResponse.data || [])
      } catch (error) {
        console.error(error)
        toast.error("Failed to load user data", { position: "bottom-right" })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  // Toggle role selection
  const handleRoleToggle = (role: string) => {
    if (roles.includes(role)) {
      setRoles(roles.filter((r) => r !== role))
    } else {
      setRoles([...roles, role])
    }
  }

  // Toggle bug selection
//   const handleBugSelect = (bugId: string) => {
//     if (assignedBugs.includes(bugId)) {
//       setAssignedBugs(assignedBugs.filter((b) => b !== bugId))
//     } else {
//       setAssignedBugs([...assignedBugs, bugId])
//     }
//   }

  // Save changes
  const handleSaveChanges = async () => {
    try {
      const userData: Partial<User> = {
        fullName,
        email,
        role: roles,
        assignedBugs,
      }

      await api.put(`/users/${userId}`, userData)
      toast.success("User updated successfully", { position: "bottom-right" })
    } catch (error) {
      console.error(error)
      toast.error("Failed to save user changes", { position: "bottom-right" })
    }
  }

    

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit User</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mt-1">
            Edit a user's name, email, password and roles. Also assign bugs to user. 
          </DialogDescription>
        </DialogHeader>
        <form className="mt-6 space-y-6">
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel>Full Name</FieldLabel>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}/>
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}/>
            </Field>
            <FieldSeparator />
            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input  className="w-full"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading} />
            </Field>
            <FieldSeparator />
            <Field>
              <FieldLabel>Roles</FieldLabel>
                <div className="flex flex-col space-y-1 mt-2">
                {availableRoles.map((role) => (
                  <div key={role} className="flex items-center space-x-2">
                    <Checkbox
                      id={role}
                      checked={roles.includes(role)}
                      onChange={() => handleRoleToggle(role)}
                      disabled={loading}
                    />
                    <Label htmlFor={role}>{role}</Label>
                  </div>
                ))}
              </div>
            </Field>
            <FieldSeparator />
            <Field>
              <FieldLabel>Assign Bugs to User: </FieldLabel>
              <MultiSelect values={assignedBugs} onValuesChange={setAssignedBugs}>
                <MultiSelectTrigger>
                    <MultiSelectValue placeholder="Select Bugs...."/>
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
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveChanges}>Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    )

}

export {UserEditDialog}