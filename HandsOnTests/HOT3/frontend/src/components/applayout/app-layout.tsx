import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/Header"
import { useState, useEffect } from "react"
interface User {
  fullName: string;
  email: string;
  role: string[];
}



const AppLayout = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Replace this with your actual user fetching logic
    const fetchUser = async () => {
      // Example: fetch from an API or auth provider
      const response = await fetch("/api/current-user");
      const data = await response.json();
      setUser(data);
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>; // Show loading while fetching user
  }
  return (
    <SidebarProvider defaultOpen={false}>
    <AppSidebar />
    <SidebarInset>
        <Header user={user}/>
        <main className="p-6">
        <Outlet />
        </main>
    </SidebarInset>
    </SidebarProvider>

  )
}
export default AppLayout
