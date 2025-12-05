import { Button } from "@/components/ui/button";

import {
  Card,
  //CardAction,
  CardContent,
  //CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import axios from 'axios'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
    id: string,
    fullName: string,
    email: string,
}



export default function UserList() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try{
                const res = await axios.get("api/users");
                setUsers(res.data);
            } catch (err) {
                console.error("Failed to fetch users: ", err)
            } finally{
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])
    if (loading) return <div className="p-4">Loading users...</div>;

  return (
    <>
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold mb-4">Users</h2>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle>{user.fullName}</CardTitle>
            </CardHeader>

            <CardContent>
              <p>Email: {user.email}</p>
            </CardContent>

            <CardFooter>
              <Button onClick={() => navigate(`/users/${user.id}/edit`)}>
                Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
    </>
  );
}

