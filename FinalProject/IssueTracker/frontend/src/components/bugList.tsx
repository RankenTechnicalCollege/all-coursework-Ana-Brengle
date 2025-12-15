import { Button } from "@/components/ui/button";

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
import { useNavigate } from "react-router-dom";
import { type BugsList} from "@/components/types/interfaces"
import { Edit2, Trash2 } from "lucide-react";




export default function BugList() {
    const [bugs, setBugs] = useState<BugsList[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate()


  return (
    <>
      <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {bugs.map((bug) => (
          <Card
            key={bug.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/bugs/${bug.id}`)}
          >
            <CardHeader>
              <CardTitle>{bug.title}</CardTitle>
              <CardDescription>{bug.status}</CardDescription>
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

