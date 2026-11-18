import { NextRequest, NextResponse } from "next/server";
import { db, OrderRecord, AthleteRecord } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentSession();
    if (!user || user.role_id !== "admin") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }

    const orders = await db.find<OrderRecord>("Orders");
    orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ success: true, data: orders });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentSession();
    if (!user || user.role_id !== "admin") {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }

    const { id, status, admin_notes } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: "ID dan status wajib disertakan." }, { status: 400 });
    }

    const existingOrder = await db.findById<OrderRecord>("Orders", id);
    if (!existingOrder) {
      return NextResponse.json({ success: false, error: "Pesanan tidak ditemukan." }, { status: 404 });
    }

    const updates: Partial<OrderRecord> = { status };
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;

    await db.update<OrderRecord>("Orders", id, updates);

    // Otomatisasi: Jika status pesanan dikonfirmasi dan ada kaitan dengan atlet (akademi), ACC juga profil atletnya!
    if (status === "dikonfirmasi") {
      if (existingOrder.athlete_id) {
        await db.update<AthleteRecord>("Athletes", existingOrder.athlete_id, {
          status: "approved",
        });
      } else if (existingOrder.service_type === "akademi" && existingOrder.user_id) {
        const athletes = await db.find<AthleteRecord>("Athletes", { user_id: existingOrder.user_id });
        if (athletes && athletes.length > 0) {
          for (const ath of athletes) {
            await db.update<AthleteRecord>("Athletes", ath.id, { status: "approved" });
          }
        }
      }
    } else if (status === "dibatalkan") {
      if (existingOrder.athlete_id) {
        await db.update<AthleteRecord>("Athletes", existingOrder.athlete_id, {
          status: "rejected",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message:
        status === "dikonfirmasi"
          ? "Pembayaran pesanan berhasil dikonfirmasi! Profil atlet otomatis disetujui (ACC)."
          : "Status pesanan berhasil diperbarui.",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
