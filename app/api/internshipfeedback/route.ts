// app/api/internshipfeedback/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import InternshipFeedback from "@/models/InternshipFeedback";

/**
 * POST -> create feedback
 * GET  -> list or get by internshipRole (query: internship=role)
 * PATCH -> update by id (body contains updates)
 * DELETE -> delete by id (query id=...)
 */

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const created = await InternshipFeedback.create(body);
    return NextResponse.json({ success: true, feedback: created }, { status: 201 });
  } catch (err: any) {
    console.error("Create feedback error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const internship = searchParams.get("internship"); // optional filter by internship role
    if (internship) {
      const item = await InternshipFeedback.findOne({ internshipRole: internship }).lean();
      return NextResponse.json({ success: true, feedback: item || null });
    }
    const all = await InternshipFeedback.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, feedbacks: all });
  } catch (err: any) {
    console.error("Fetch feedback error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ success: false, message: "ID missing" }, { status: 400 });
    const updated = await InternshipFeedback.findByIdAndUpdate(id, updates, { new: true }).lean();
    return NextResponse.json({ success: true, feedback: updated });
  } catch (err: any) {
    console.error("Update feedback error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    // ✅ Try both ID and internshipRole
    const id = searchParams.get("id");
    const internshipRole = searchParams.get("internshipRole");

    let deleted = null;

    if (id) {
      // Delete by MongoDB _id
      deleted = await InternshipFeedback.findByIdAndDelete(id);
    } else if (internshipRole) {
      // Delete by internshipRole (used in your frontend)
      deleted = await InternshipFeedback.findOneAndDelete({ internshipRole });
    } else {
      return NextResponse.json(
        { success: false, message: "Missing id or internshipRole" },
        { status: 400 }
      );
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Feedback not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Feedback removed successfully",
    });
  } catch (err: any) {
    console.error("Delete feedback error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
