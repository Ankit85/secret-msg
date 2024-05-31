"use client";
import React from "react";
import { ModeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="container flex h-14 items-center justify-between  ">
      <a href="#">
        <h1 className="font-bold text-xl">Anon</h1>
      </a>
      <div className="flex gap-5">
        {session ? (
          <>
            <Button variant={"outline"} onClick={() => signOut()}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href={"/signin"}>
              <Button variant={"outline"}>Login</Button>
            </Link>
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
}

export default Navbar;
