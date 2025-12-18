import { Hero1 } from "@/components/hero1";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export function LandingPage() {
    const [user, setUser] = useState<{fullName: string; role: string[]} | null>(null)
    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await api.get("/users/me")
                setUser({
                    fullName: res.data.fullName,
                    role: res.data.role || []
                })
            } catch (err) {
                console.error("Failed to fetch user", err);
            }
        }
        fetchUser();
    }, [])
    
    return (
        <>
        <Hero1 heading={`Welcome back, ${user?.fullName}`} description='Here is your issue tracker!' />
        <Badge className="mt-4">{user?.role.join(", ")}</Badge>
        </>

    )
}