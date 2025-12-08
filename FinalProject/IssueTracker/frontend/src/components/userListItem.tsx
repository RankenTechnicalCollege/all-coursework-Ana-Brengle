'use client'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
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
import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect} from "react"
import { ChevronDown } from "lucide-react"
import axios from "axios"



 export interface User{
    id: string;
    name: string;
    email: string;
    givenName: string;
    familyName: string;
    role: string[];
    createdBugs: string[];
    assignedBugs: string[];
    }
interface UserListItemsProps {
   user?: User
}

const UserListItem1 =({user: initialUser} : UserListItemsProps) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState<User | null>(initialUser || null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isOpen, setIsOpen] = useState(false)
   const [isOpenAssigned, setIsOpenAssigned] = useState(false)

    useEffect(() => {
    if (!user && id) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${id}`)
          setUser(response.data)
        } catch (err) {
          setError("Failed to fetch user")
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [id, user])

  if (loading) return <div className="p-4">Loading user...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!user) return <div className="p-4">User not found</div>
    
   return (
    <>
    <Card>
        <CardHeader>
            <CardTitle>{user?.givenName} {user?.familyName}</CardTitle>
            <CardAction>
                <Button variant="link" onClick={() => navigate(`/users/${user?.id}/edit`)}>Edit</Button>
            </CardAction>
            <CardDescription>{user?.role.join(", ")}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex gap-4">
                {/* Created Bugs */}
                <div className="flex-1">
                    <h4 className="text-sm font-semibold mb-1">Created Bugs</h4>
                    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon">
                        <ChevronDown
                            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="flex flex-col gap-2 mt-2">
                        {user?.createdBugs.length ? (
                        user.createdBugs.map((bug, idx) => (
                            <div key={idx} className="rounded-md border px-4 py-2 font-mono text-sm">
                            {bug}
                            </div>
                        ))
                        ) : (
                        <div className="text-gray-400 text-sm">No created bugs</div>
                        )}
                    </CollapsibleContent>
                    </Collapsible>
                </div>
                </div>

                {/* Assigned Bugs */}
                <div className="flex-1">
                    <h4 className="text-sm font-semibold mb-1">Assigned Bugs</h4>
                    <Collapsible open={isOpenAssigned} onOpenChange={setIsOpenAssigned}>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon">
                        <ChevronDown
                            className={`transition-transform ${isOpenAssigned ? 'rotate-180' : ''}`}
                        />
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="flex flex-col gap-2 mt-2">
                        {user?.assignedBugs.length ? (
                        user.assignedBugs.map((bug, idx) => (
                            <div key={idx} className="rounded-md border px-4 py-2 font-mono text-sm">
                            {bug}
                            </div>
                        ))
                        ) : (
                        <div className="text-gray-400 text-sm">No assigned bugs</div>
                        )}
                </CollapsibleContent>
                </Collapsible>
            </div>

        </CardContent>
    </Card>
    </>
   )
}

export {UserListItem1}