import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { db, AthleteRecord } from "@/lib/db";
import { deleteFile } from "@/lib/storage";

async function verifyAdmin() {
  const session = await getCurrentSession();
  if (!session || session.role_id !== "admin") return null;
  return session;
}

export async function GET() {
  const session = await verifyAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
  }

  const athletes = await db.find<AthleteRecord>("Athletes");
  return NextResponse.json({ success: true, data: athletes });
}

export async function PUT(req: NextRequest) {
  const session = await verifyAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id, status, jersey_number, position } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "ID atlet wajib disertakan" }, { status: 400 });
    }

    const updates: Partial<AthleteRecord> = {};
    if (status) updates.status = status;
    if (jersey_number !== undefined) updates.jersey_number = String(jersey_number);
    if (position) updates.position = position;

    await db.update<AthleteRecord>("Athletes", id, updates);

    return NextResponse.json({
      success: true,
      message: status === "approved" ? "Pemain atlet berhasil di-ACC dan aktif di daftar Pemain Atlet Website!" : "Status atlet berhasil diperbarui.",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await verifyAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "ID atlet wajib disertakan" }, { status: 400 });
    }

    const athlete = await db.findById<AthleteRecord>("Athletes", id);
    if (athlete && athlete.photo_url?.startsWith("/uploads/")) {
      await deleteFile(athlete.photo_url);
    }

    await db.delete("Athletes", id);
    return NextResponse.json({ success: true, message: "Data atlet berhasil dihapus" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

