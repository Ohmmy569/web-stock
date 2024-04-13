import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";
import bcrypt from "bcryptjs";


export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    await connectDB();
    await User.create({ username, password: hashedPassword });

    return NextResponse.json({ message: "success" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "error" }, { status: 400 });
  }
}
