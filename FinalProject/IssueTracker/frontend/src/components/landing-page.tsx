import { Hero1 } from "@/components/hero1";
import api from "@/lib/api";
import { useState, useEffect } from "react";

export function LandingPage() {
    const [user, setUser] = useState<string>("")
    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await api.get("/users/me")
                setUser(res.data.fullName)
            } catch (err) {
                console.error("Failed to fetch user", err);
            }
        }
        fetchUser();
    }, [])
    
    return (
        <Hero1 heading={`Welcome back, ${user}`} description='Here is your issue tracker!' image={{src:"react.svg", alt:"React Logo"}}/>
    )
}