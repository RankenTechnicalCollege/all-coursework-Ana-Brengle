import { Button } from "@/components/ui/button";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface User{
    id: string,
    fullName: string,
    email: string,
    assignedBugs: string[],
    createdBugs: string[]

}

