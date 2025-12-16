import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Application from "@/models/Application";

/**
 * POST /api/applications
 * Save internship application form data
 */
export async function POST(req: Request) {
  try {
    await dbConnect(); // connect to MongoDB
    const body = await req.json(); // parse request body

    // Create a new record in MongoDB using your Application model
    const newApp = await Application.create(body);

    return NextResponse.json(
      { success: true, message: "Application submitted!", application: newApp },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error submitting application:", err);
    return NextResponse.json(
      { success: false, message: "Failed to submit application", error: err.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/applications
 * Fetch all saved applications (for admin or student “My Applications” page)
 */
export async function GET() {
  try {
    await dbConnect();
    const apps = await Application.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, applications: apps });
  } catch (err: any) {
    console.error("Error fetching applications:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch applications", error: err.message },
      { status: 500 }
    );
  }
}

// DELETE /api/application?id=<applicationId>
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Application ID missing" }, { status: 400 });
    }

    await Application.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Application deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting application:", err);
    return NextResponse.json(
      { success: false, message: "Failed to delete application", error: err.message },
      { status: 500 }
    );
  }
}

