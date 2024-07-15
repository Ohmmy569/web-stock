import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@lib/connectDB";
import History from "@lib/models/history";

export async function GET() {
  try {
    await connectMongoDB();
    const history = await History.find();
    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json(
      { message: "An error occured while fetching history." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      action,
      user,
      partCode,
      type,
      partName,
      amount,
      brand,
      costPrice,
      salePrice,
    } = await req.json();

    await connectMongoDB();

    await History.create({
      action,
      user,
      partCode,
      type,
      partName,
      amount,
      brand,
      costPrice,
      salePrice,
    });

    return NextResponse.json({ message: "history created." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occured while creating history.", error },
      { status: 500 }
    );
  }
}
