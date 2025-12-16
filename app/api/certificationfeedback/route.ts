import { NextResponse } from "next/server";
import CertificationFeedback from "@/models/CertificationFeedback";
import dbConnect from "@/lib/mongoose";


export async function GET(request: Request) {
  await dbConnect();


  const { searchParams } = new URL(request.url);
  const certification = searchParams.get("certification"); // ?certification=React...
  const id = searchParams.get("id");

  try {
    if (id) {
      const doc = await CertificationFeedback.findById(id).lean();
      if (!doc) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
      return NextResponse.json({ success: true, feedback: doc });
    }

    if (certification) {
      const doc = await CertificationFeedback.findOne({ certificationName: certification }).lean();
      if (!doc) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
      return NextResponse.json({ success: true, feedback: doc });
    }

    // No query: return all (or you can restrict to user)
    const docs = await CertificationFeedback.find({}).lean();
    return NextResponse.json({ success: true, feedbacks: docs });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
 await dbConnect();

  try {
    const body = await request.json();
    const doc = await CertificationFeedback.create({ ...body });
    return NextResponse.json({ success: true, feedback: doc });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { id, ...rest } = body;
    if (!id) return NextResponse.json({ success: false, message: "Missing id" }, { status: 400 });
    const updated = await CertificationFeedback.findByIdAndUpdate(id, rest, { new: true }).lean();
    if (!updated) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, feedback: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const certification = searchParams.get("certification");

    if (id) {
      const deleted = await CertificationFeedback.findByIdAndDelete(id);
      if (!deleted) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
      return NextResponse.json({ success: true });
    }

    if (certification) {
      const deleted = await CertificationFeedback.findOneAndDelete({ certificationName: certification });
      if (!deleted) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Missing identifier" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

