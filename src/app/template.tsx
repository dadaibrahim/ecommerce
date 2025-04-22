import Navbar from '@/components/navbar';
import './globals.css'; 
import { ReactNode } from "react";
 // Make sure the import path is correct
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <><Navbar/>{children}</>
  );
}
