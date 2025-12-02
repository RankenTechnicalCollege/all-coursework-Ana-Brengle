import { Outlet } from "react-router-dom";
import { Navbar1 } from "@/components/navbar1";

const AppLayout = () => {
    return(
    <>
    <Navbar1 />
    <Outlet />
    </>
    )
}
export default AppLayout