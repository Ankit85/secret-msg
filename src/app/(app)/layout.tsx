"use client";
import React, { ReactNode } from "react";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container min-h-screen">
      <Navbar />
      {children}
    </div>
  );
}
