//import { Button } from "@/components/ui/button";

import {
  Card,
  CardAction,
  //CardAction,
  //CardContent,
  CardDescription,
  //CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import axios from 'axios'
import { useEffect, useState } from "react";
import {  type User } from "./userListItem";
import { useNavigate } from "react-router-dom";




export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate()


    useEffect(() => {
        const fetchUsers = async () => {
            try{
               const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
                setUsers(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch users');
                setLoading(false);
                console.error('Error fetching users:', err);
            }
        }
        fetchUsers()
    }, [])
    if (loading) return <div className="p-4">Loading users...</div>;
     if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {users.map((user) => (
          <Card
            key={user.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/users/${user.id}`)}
          >
            <CardHeader>
              <CardTitle>{user.givenName} {user.familyName}</CardTitle>
              <CardDescription>{user.role.join(", ")}</CardDescription>
              <CardAction>
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
    </>
  );
}

