"use client";
import React, { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container min-h-screen ">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
