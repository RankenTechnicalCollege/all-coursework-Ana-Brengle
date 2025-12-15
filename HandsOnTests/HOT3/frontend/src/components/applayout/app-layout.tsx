import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { AxiosError } from "axios";


interface User {
  fullName: string;
  email: string;
  role: string[];
}

const AppLayout = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

 useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await api.get("/users/me");
      setUser(response.data);
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        navigate("/login");
      } else {
        console.error("Failed to fetch user:", axiosError);
      }
    }
  };

  fetchUser();
}, [navigate]);

  if (!user) {
    return <div>Loading...</div>; // Show loading while fetching user
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <Header user={user} />
        <main className="p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
