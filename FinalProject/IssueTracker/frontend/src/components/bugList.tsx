import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, RefreshCcw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { useEffect, useState } from "react";
import { type Bug} from "@/components/types/interfaces"
import api from "@/lib/api";
import { Spinner } from "./ui/spinner";
import { BugItem } from "./BugItem";

import EditBugDialog from "./BugEdit";



export default function BugList() {
    const [bugs, setBugs] = useState<Bug[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const [keywords, setKeywords] = useState('');
    const [classification, setClassification] = useState('');
    const [minAge, setMinAge] = useState<number | undefined>();
    const [maxAge, setMaxAge] = useState<number | undefined>();
    const [closed, setClosed] = useState(false);
    const [sortBy, setSortBy] = useState('newest')
    //const [assignedBugs, setAssignedBugs] = useState('')
    const [selectedBug, setSelectedBug] = useState<Bug | null>(null);

     const [dialogOpen, setDialogOpen] = useState(false);

    const fetchBugs = async () => {
      setLoading(true);
      setError(null);
    try {
      const params = new URLSearchParams();
      if (keywords) params.append("keywords", keywords);
      if (classification && classification !== "all") params.append("classification", classification);
      if (minAge !== undefined) params.append("minAge", minAge.toString());
      if (maxAge !== undefined) params.append("maxAge", maxAge.toString());
      params.append("closed", closed ? "true" : "false");
      if (sortBy) params.append("sortBy", sortBy);

      const response = await api.get(`/bugs?${params.toString()}`);
      setBugs(response.data);
    } catch (err) {
      setError("Failed to fetch bugs");
      console.error("Error fetching bugs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, [classification, sortBy, closed]);


  const handleSearch = () => {
    fetchBugs();
  };



  const clear = () => {
    setKeywords('')
    setClassification('')
    setClosed(false)
    setSortBy('newest')
    setMinAge(undefined);
    setMaxAge(undefined);
    fetchBugs()
  }
 

const handleEditClick = (bug: Bug) => {
  setSelectedBug(bug);
  setDialogOpen(true);
};


  return (
    <>
    <div className="space-y-6">
        <div className="flex flex-col gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Search bugs..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>
          <Button variant="outline" onClick={clear}>
            <RefreshCcw className="h-4 w-4 mr-1" /> Refresh
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Classification */}
            <div className="space-y-2">
              <Label>Classification</Label>
              <Select value={classification} onValueChange={setClassification}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classified">Classified</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="unapproved">Unapproved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Min Age (days)</Label>
              <Input
                type="number"
                placeholder="Min Age"
                value={minAge}
                onChange={(e) => setMinAge(e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div className="space-y-2">
              <Label>Max Age (days)</Label>
              <Input
                type="number"
                placeholder="Max Age"
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div className="flex items-center space-x-2 mt-6">
              <Checkbox checked={closed} onCheckedChange={(val) => setClosed(Boolean(val))} />
              <Label>Include Closed</Label>
            </div>
            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="classification">Classification</SelectItem>
                  <SelectItem value="assignedTo">Assigned To</SelectItem>
                  <SelectItem value="createdBy">Reported By</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      {loading ? (
        <div><Spinner/> Loading Bugs.....</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bugs.map((bug) => (
            <Card key={bug._id}>
              <CardContent className="pt-6">
                <BugItem bug={bug}
                  onEdit={handleEditClick}/>
              </CardContent>
            </Card>
          ))}
          {bugs.length === 0 && <div className="col-span-full text-center text-muted-foreground">No bugs found</div>}
        </div>
      )}
    </div>
      {selectedBug && (
      <EditBugDialog
        bug={selectedBug}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={() => {}}
      />
)}
    </>
  );
}

