// app/api/postings/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Posting from "@/models/Posting";

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const doc = await Posting.findById(id).lean();
      if (!doc) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
      return NextResponse.json({ success: true, posting: doc });
    }
    // optional: support filtering/search in query params later
    const docs = await Posting.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, postings: docs });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const created = await Posting.create(body);
    return NextResponse.json({ success: true, posting: created });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ success: false, message: "Missing id" }, { status: 400 });
    updates.updatedAt = new Date();
    const updated = await Posting.findByIdAndUpdate(id, updates, { new: true }).lean();
    if (!updated) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, posting: updated });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Missing id" }, { status: 400 });
    const deleted = await Posting.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
