"use server";
export const fetchingUser = async () => {
  try {
    const res = await fetch("/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    return error;
  }
};
