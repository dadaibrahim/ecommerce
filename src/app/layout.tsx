// app/layout.tsx
import './globals.css'; 
import { ReactNode } from "react";
import Navbar from "@/components/navbar"; // Make sure the import path is correct

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Your E-Commerce Store</title>
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
