import { ReactNode } from "react";
import Sidebar from "./_components/sidebar";
import { Navbar } from "./_components/navbar";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='h-full'>
      <div className='h-20 md:pl-14 fixed inset-y-0 w-full z-50'>
        <Navbar />
      </div>
      <div className='hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50'>
        <Sidebar />
      </div>
      <main className='md:pl-56 pt-20 h-full '>{children}</main>
    </div>
  );
};

export default DashboardLayout;
