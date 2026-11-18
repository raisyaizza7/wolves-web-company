import { NextRequest, NextResponse } from "next/server";
import { db, OrderRecord } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";
import { saveFile } from "@/lib/storage";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentSession();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Silakan login terlebih dahulu untuk melihat pesanan Anda." },
        { status: 401 }
      );
    }

    let orders: OrderRecord[] = [];
    if (user.role_id === "admin") {
      orders = await db.find<OrderRecord>("Orders");
    } else {
      orders = await db.find<OrderRecord>("Orders", { user_id: user.id });
    }

    // Sort descending by created_at
    orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ success: true, data: orders });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Gagal memuat daftar pesanan." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentSession();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Silakan login terlebih dahulu untuk melakukan pemesanan." },
        { status: 401 }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    let service_type: 'merchandise' | 'sewa_lapangan' | 'akademi' | 'tiket_pertandingan' = "merchandise";
    let customer_name = user.name;
    let customer_phone = "";
    let booking_date = new Date().toISOString().split("T")[0];
    let quantity = 1;
    let total_amount = 0;
    let notes = "";
    let items_detail = "";
    let payment_proof_url = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      service_type = (formData.get("service_type") as any) || "merchandise";
      customer_name = (formData.get("customer_name") as string) || user.name;
      customer_phone = (formData.get("customer_phone") as string) || "";
      booking_date = (formData.get("booking_date") as string) || new Date().toISOString().split("T")[0];
      quantity = parseInt(formData.get("quantity") as string) || 1;
      total_amount = parseInt(formData.get("total_amount") as string) || 0;
      notes = (formData.get("notes") as string) || "";
      items_detail = (formData.get("items_detail") as string) || "";

      const proofFile = formData.get("payment_proof") as File | null;
      if (proofFile && proofFile.size > 0) {
        const saved = await saveFile(proofFile);
        payment_proof_url = saved.path;
      }
    } else {
      const json = await req.json();
      service_type = json.service_type || "merchandise";
      customer_name = json.customer_name || user.name;
      customer_phone = json.customer_phone || "";
      booking_date = json.booking_date || new Date().toISOString().split("T")[0];
      quantity = parseInt(json.quantity) || 1;
      total_amount = parseInt(json.total_amount) || 0;
      notes = json.notes || "";
      items_detail = json.items_detail || "";
      payment_proof_url = json.payment_proof || "";
    }

    if (!customer_phone) {
      return NextResponse.json(
        { success: false, error: "Nomor WhatsApp wajib diisi agar admin dapat menghubungi Anda." },
        { status: 400 }
      );
    }

    if (total_amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Total pembayaran tidak valid." },
        { status: 400 }
      );
    }

    const prefix = service_type === "merchandise" ? "MERCH" : service_type === "akademi" ? "AKD" : "LAP";
    const ticket_number = `WLV-${prefix}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = await db.create<OrderRecord>("Orders", {
      ticket_number,
      user_id: user.id,
      service_type,
      customer_name,
      customer_phone,
      booking_date,
      quantity,
      total_amount,
      notes,
      items_detail,
      payment_proof: payment_proof_url,
      status: "menunggu_konfirmasi",
    });

    return NextResponse.json({
      success: true,
      data: newOrder,
      message: "Pesanan berhasil dibuat! Admin Wolves akan memverifikasi pembayaran Anda.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Gagal membuat pesanan." },
      { status: 500 }
    );
  }
}
