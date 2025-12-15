"use client"

import * as React from "react"
import {
  UserIcon,
  ShoppingBasket

} from "lucide-react"
import {useNavigate} from 'react-router-dom'
import { NavMain } from "@/components/nav-main"
//import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
//import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useEffect,useState } from "react"


// This is sample data.
const data = {
  // user: {
  //   name: string,
  //   email: "m@example.com",
  //   avatar: "/avatars/shadcn.jpg",
  // },
  // teams: [
  //   {
  //     name: "Acme Inc",
  //     logo: GalleryVerticalEnd,
  //     plan: "Enterprise",
  //   },
  //   {
  //     name: "Acme Corp.",
  //     logo: AudioWaveform,
  //     plan: "Startup",
  //   },
  //   {
  //     name: "Evil Corp.",
  //     logo: Command,
  //     plan: "Free",
  //   },
  // ],
  navMain: [
  {
    title: "Users",
    url: "/users",
    icon: UserIcon,
    isActive: true,
  },
  {
    title: "Products",
    url: "/products",
    icon: ShoppingBasket,
  },
],
}
  

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<null | { fullName: string; email: string; role: string[] }>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("http://localhost:2023/api/users/me", {
          credentials: "include",
        })

        if (!res.ok) {
          navigate("/login")
          return
        }

        const data = await res.json()
        setUser({
          fullName: data.fullName || data.name || "Unknown User",
          email: data.email || "unknown@example.com",
          role: data.role || [],
        })
        //setUser(data)
      } catch (err) {
        console.error("Error loading user:", err)
        navigate("/login")
      }
    }

    loadUser()
  }, [navigate])
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {user && <NavUser user={user} />}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
