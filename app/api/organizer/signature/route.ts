import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Organizer from "@/lib/database/models/organizer.model";

export async function POST(req: Request) {
  try {
    const { organizerId, signatureData } = await req.json();
    
    await connectToDatabase();
    
    const updatedOrganizer = await Organizer.findByIdAndUpdate(
      organizerId,
      { $set: { digitalSignature: signatureData } },
      { new: true }
    );

    if (!updatedOrganizer) {
      return NextResponse.json(
        { error: "Không tìm thấy ban tổ chức" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedOrganizer);
  } catch (error) {
    console.error("Lỗi khi cập nhật chữ ký:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật chữ ký" },
      { status: 500 }
    );
  }
} 