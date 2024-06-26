"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import UserTable from "@/app/components/UserTable";

export default function page() {
  return(
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  )
}

page.requiredAuth = true;
