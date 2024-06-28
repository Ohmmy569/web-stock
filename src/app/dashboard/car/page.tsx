"use client";
import React from 'react'
import { useRouter } from "next/router";
import { useEffect } from "react";
import CarTable from '@/app/components/Cartable';


function page() {
  return (
    <div>
      <CarTable />
    </div>
  )
}

export default page