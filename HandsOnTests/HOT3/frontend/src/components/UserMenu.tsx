import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import  {AxiosError} from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import api from "@/lib/api"

interface User {
  id: string
  fullName: string
  role?: string
  email?: string
}

export default function UserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchId, setSearchId] = useState("")
  const [searched, setSearched] = useState(false)
  const navigate = useNavigate()

  const fetchUserById = async () => {
    if (!searchId.trim()) {
      setError("Please enter a user ID")
      setUser(null)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await api.get(
        `users/${searchId}`
      )

      if (response.data && (response.data.id || response.data._id)) {
      const fetchedUser: User = {
        id: response.data.id || response.data._id,
        fullName: response.data.fullName,
        role: response.data.role,
        email: response.data.email,
      } 
        setUser(fetchedUser)
        setError(null)
    }else {
        setUser(null)
       setError("User not found")
     }
      
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>
      setError(
        axiosError.response?.data?.message || axiosError.message || "User not found"
      )
      setUser(null)
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search user by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <Button className="border rounded px-3 py-2 bg-gray-200 hover:bg-gray-300" onClick={fetchUserById}>
          Search
        </Button>
        <Button className="border rounded px-3 py-2 bg-gray-200 hover:bg-gray-300"onClick={() => {
            setSearchId("")
            setUser(null)
            setError(null)
            setSearched(false)
          }}>Clear</Button>
      </div>
      {loading && <div>Loading user...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && searched && !error && !user && searchId && (
        <div className="text-gray-500">User not found</div>
      )}
      {user && (
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/users/${user.id}`)}>
            <CardHeader>
              <CardTitle>{user.fullName}</CardTitle>
              <CardDescription>{user.role}</CardDescription>
              <CardContent>{user.email}</CardContent>
            </CardHeader>
          </Card>
      )}
    </div>
  )
}
