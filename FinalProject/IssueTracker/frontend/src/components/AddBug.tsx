import { Button } from "@/components/ui/button";
//import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api"; // import your axios instance
import { useState } from "react";
import { toast } from "react-toastify";

interface AddBugProps {

  onSave: () => void
}



const AddBug = ({ onSave }: AddBugProps) => {

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(e.currentTarget);
    try {
      const response = await api.post("/bugs/new", {
        title: formData.get("title"),
        description: formData.get("description"),
        stepsToReproduce: formData.get("stepsToReproduce"),
      });
      form.reset();
      onSave();
      const addedBug = response.data;
      toast.success(`Bug added successfully!: ${addedBug.title}`, { position: "bottom-right" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add bug", { position: "bottom-right" });
    } finally {
      setLoading(false);
    }
  };
return (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">Add Bug</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add Bug Details</DialogTitle>
        <DialogDescription>
          Enter your bug details.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Bug Title</Label>
          <Input id="title" name="title" placeholder="e.g., Bug Title" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Bug Description</Label>
          <Input id="description" name="description" placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam magna purus, viverra ut sem vel, faucibus semper lacus. " />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stepsToReproduce">Steps to Reproduce</Label>
            <Textarea id="stepsToReproduce" name="stepsToReproduce" placeholder="Step 1: ......." />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Bug"}</Button>
        </DialogFooter>
        </form>
    </DialogContent>
  </Dialog>
);
};


export default AddBug;
