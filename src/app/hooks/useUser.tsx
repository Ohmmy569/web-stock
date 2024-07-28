"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { User } from "../type";

const fetchUsers = async () => {
  const { data } = await axios.get<User[]>("/api/users");
  return data;
};

export const UseUser = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });
};
