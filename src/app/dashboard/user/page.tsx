"use client";
import React from 'react'
import { useRouter } from "next/router";
import { useEffect } from "react";
import UserTable from '@/app/components/UserTable';

function page() {
  return (
    <div>
      <UserTable />
    </div>
  )
}

export default page