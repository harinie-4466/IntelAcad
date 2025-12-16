// app/api/resumes/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Resume from "@/models/Resume";


export async function GET(request: Request) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const resume = await Resume.findById(id).lean();
      if (!resume)
        return NextResponse.json({ success: false, message: "Resume not found" }, { status: 404 });

      return NextResponse.json({ success: true, resume });
    }

    const resumes = await Resume.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, resumes });
  } catch (err: any) {
    console.error("GET /api/resumes error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

/**
 * POST → Create a new resume (public for now)
 */
export async function POST(request: Request) {
  await connectToDatabase();
  try {
    const body = await request.json();
    const created = await Resume.create(body);
    return NextResponse.json({ success: true, resume: created });
  } catch (err: any) {
    console.error("POST /api/resumes error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}


export async function PATCH(request: Request) {
  await connectToDatabase();
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id)
      return NextResponse.json({ success: false, message: "Missing resume ID" }, { status: 400 });

    updates.updatedAt = new Date();

    const updated = await Resume.findByIdAndUpdate(id, updates, { new: true }).lean();

    if (!updated)
      return NextResponse.json({ success: false, message: "Resume not found" }, { status: 404 });

    return NextResponse.json({ success: true, resume: updated });
  } catch (err: any) {
    console.error("PATCH /api/resumes error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

/**
 * DELETE → Delete a resume (expects ?id= in query)
 * (Later you can restrict this to authenticated users)
 */
export async function DELETE(request: Request) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({ success: false, message: "Missing resume ID" }, { status: 400 });

    const deleted = await Resume.findByIdAndDelete(id);

    if (!deleted)
      return NextResponse.json({ success: false, message: "Resume not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Resume deleted successfully" });
  } catch (err: any) {
    console.error("DELETE /api/resumes error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
