"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useSession } from "next-auth/react";

function page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "authenticated") {
    return router.push("/dashboard/parts");
  }
}

export default page;
