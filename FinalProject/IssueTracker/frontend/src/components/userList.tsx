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
import { Search } from "lucide-react";
import { UserEditDialog } from "./UserEdit";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const [keywords, setKeywords] = useState("");
  const [role, setRole] = useState<string>("all");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string>("")

  const handleEditClick = (userId: string) => {
    setSelectedUserId(userId)
    setEditDialogOpen(true)
  }


  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (keywords) params.append("keywords", keywords);
      if (role && role !== "all") params.append("role", role);
      if (minAge) params.append("minAge", Number(minAge).toString());
      if (maxAge) params.append("maxAge", Number(maxAge).toString());
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

  
    useEffect(() => {
    fetchUsers();
  }, [keywords, minAge, maxAge]);

  useEffect(() => {
    fetchUsers();
  }, [role,sortBy]);


   const handleSearch = () => {
    fetchUsers();
  };



   return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Search/>
            <Input
              placeholder="Search users..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="business analyst">Business Analyst</SelectItem>
              <SelectItem value="quality analyst">Quality Analyst</SelectItem>
              <SelectItem value="product manager">Product Manager</SelectItem>
              <SelectItem value="technical manager">Technical Manager</SelectItem>
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
          <Select onValueChange={setSortBy} value={sortBy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
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
                <UserItem user={user} currentUser={user} onEdit={() => handleEditClick(user._id)}/>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <UserEditDialog
        userId={selectedUserId}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  );
}
