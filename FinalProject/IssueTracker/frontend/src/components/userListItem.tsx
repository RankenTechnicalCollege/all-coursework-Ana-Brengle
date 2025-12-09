'use client'
//import { Button } from "@/components/ui/button"
import {
  Card,
  //CardAction,
  CardContent,
  CardDescription,
  //CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
//import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"
import {  useParams } from "react-router-dom"
import { useState, useEffect} from "react"
import { ChevronDown } from "lucide-react"
import axios from "axios"
import type { SingleUser } from "@/components/types/interfaces"

const UserItem  = () => {
  const { _id } = useParams()
  const [user, setUser] = useState<SingleUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!_id) return

    const fetchUser = async () => {
      try {
        const response = await axios.get<SingleUser>(`${import.meta.env.VITE_API_URL}/users/${_id}`)
        console.log("Single user API response:", response.data)
        setUser(response.data)
      } catch (err) {
        console.error("Error fetching user:", err)
        setError("Failed to fetch user")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [_id])

  if (loading) return <div className="p-4">Loading user...</div>
  if (error) return <div className="text-red-500 p-4">{error}</div>
  if (!user) return <div className="p-4">User not found</div>

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-2xl">{user.givenName} {user.familyName}</CardTitle>
        <CardDescription>
          <div><strong>ID:</strong> {user.id}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Roles:</strong> {user.role.join(", ")}</div>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col md:flex-row gap-4 mt-4">
        {/* Created Bugs */}
        <Collapsible>
          <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-2 bg-gray-100 rounded-md cursor-pointer">
            Created Bugs
            <ChevronDown className="ml-2" />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-2 border rounded-md mt-1 max-h-64 overflow-y-auto">
            {user.createdBugs.length === 0 ? (
              <p className="text-gray-500">No created bugs</p>
            ) : (
              <ul className="list-disc list-inside">
                {user.createdBugs.map((bug, idx) => (
                  <li key={idx}>{bug}</li>
                ))}
              </ul>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Assigned Bugs */}
        <Collapsible>
          <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-2 bg-gray-100 rounded-md cursor-pointer">
            Assigned Bugs
            <ChevronDown className="ml-2" />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-2 border rounded-md mt-1 max-h-64 overflow-y-auto">
            {user.assignedBugs.length === 0 ? (
              <p className="text-gray-500">No assigned bugs</p>
            ) : (
              <ul className="list-disc list-inside">
                {user.assignedBugs.map((bug, idx) => (
                  <li key={idx}>{bug}</li>
                ))}
              </ul>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}


export { UserItem };



