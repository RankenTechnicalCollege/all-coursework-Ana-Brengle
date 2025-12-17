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


const AddBug = () => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stepsToReproduce, setStepsToReproduce] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description || !stepsToReproduce) {
      toast.error("Please fill in all fields", { position: "bottom-right" });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/bugs", {
        title,
        description,
        stepsToReproduce: stepsToReproduce,
      });
      const addedBug = response.data;
      toast.success(`Bug added successfully!: ${addedBug.title}`, { position: "bottom-right" });
      setTitle("");
      setDescription("");
      setStepsToReproduce("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add bug", { position: "bottom-right" });
    } finally {
      setLoading(false);
    }
  };

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
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Bug Title</Label>
          <Input id="title" placeholder="e.g., Bug Title"
           value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Bug Description</Label>
          <Input id="description" placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam magna purus, viverra ut sem vel, faucibus semper lacus. " value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stepsToReproduce">Steps to Reproduce</Label>
            <Textarea id="stepsToReproduce" placeholder="Step 1: ......." value={stepsToReproduce} onChange={(e) => setStepsToReproduce(e.target.value)} />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "Add Bug"}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
};

export default AddBug;
