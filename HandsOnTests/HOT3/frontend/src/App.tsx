import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import './App.css'
import  {AppSidebar}  from '@/components/AppSidebar'


function App() {

  return (
    <>
      <SidebarProvider open={false}>
        <AppSidebar/>
        <SidebarInset>

        </SidebarInset>
      </SidebarProvider>
    </>
  )
}


export default App
