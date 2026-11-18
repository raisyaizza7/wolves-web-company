import { NextResponse } from "next/server";
import { db, AthleteRecord } from "@/lib/db";

export async function GET() {
  try {
    const all = await db.find<AthleteRecord>("Athletes");
    const approved = all.filter((a) => a.status === "approved");
    return NextResponse.json({ success: true, data: approved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

