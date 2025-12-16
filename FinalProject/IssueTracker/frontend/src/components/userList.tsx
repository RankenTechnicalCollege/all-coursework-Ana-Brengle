import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,

} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import type { User } from "@/components/types/interfaces";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { UserItem } from "./UserItem";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const [keywords, setKeywords] = useState("");
  const [role, setRole] = useState<string>("all");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (keywords) params.append("keywords", keywords);
      if (role && role !== "all") params.append("role", role);
      if (minAge) params.append("minAge", minAge);
      if (maxAge) params.append("maxAge", maxAge);
      if (sortBy) params.append("sortBy", sortBy);

      const response = await api.get(`/users?${params.toString()}`);
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

   const handleSearch = () => {
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, [role, sortBy])


  if (loading) return <div className="p-4">Loading users...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

   return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              placeholder="Search users..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
          <Select onValueChange={setRole} defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="tester">Tester</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Min Age"
              value={minAge}
              onChange={(e) => setMinAge(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max Age"
              value={maxAge}
              onChange={(e) => setMaxAge(e.target.value)}
            />
          </div>
          <Select onValueChange={setSortBy} defaultValue="name">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Given Name</SelectItem>
              <SelectItem value="role">Role</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Users */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : users.length === 0 ? (
        <div className="text-center text-muted-foreground">No users found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <Card key={user._id}>
              <CardContent className="pt-6">
                <UserItem user={user} currentUser={user}/>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
