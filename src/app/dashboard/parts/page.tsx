"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import UserTable from "@/app/components/UserTable";
import PartTable from "@/app/components/PartTable";

export default function page() {
  return(
    <div>
      <PartTable />
    </div>
  )
}

page.requiredAuth = true;
