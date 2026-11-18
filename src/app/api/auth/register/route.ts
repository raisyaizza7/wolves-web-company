import { NextRequest, NextResponse } from "next/server";
import { db, UserRecord, AthleteRecord, OrderRecord } from "@/lib/db";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { saveFile } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let name = "";
    let email = "";
    let password = "";
    let phone = "";
    let isAthleteRegistration = false;
    let position = "Point Guard";
    let jersey_number = "";
    let age = 17;
    let height_cm = 180;
    let weight_kg = 75;
    let origin = "";
    let birth_date = "";
    let photo_url = "/images/hero-basketball.jpg";
    let payment_proof_url = "";
    let notes = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      name = (formData.get("name") as string) || "";
      email = (formData.get("email") as string) || "";
      password = (formData.get("password") as string) || "";
      phone = (formData.get("phone") as string) || "";
      isAthleteRegistration = formData.get("is_athlete") === "true";
      position = (formData.get("position") as string) || "Point Guard";
      jersey_number = (formData.get("jersey_number") as string) || "";
      age = parseInt(formData.get("age") as string) || 17;
      height_cm = parseInt(formData.get("height_cm") as string) || 180;
      weight_kg = parseInt(formData.get("weight_kg") as string) || 75;
      origin = (formData.get("origin") as string) || "";
      birth_date = (formData.get("birth_date") as string) || "";
      notes = (formData.get("notes") as string) || "";

      const photoFile = formData.get("photo") as File | null;
      if (photoFile && photoFile.size > 0) {
        const savedPhoto = await saveFile(photoFile);
        photo_url = savedPhoto.path;
      }

      const proofFile = formData.get("payment_proof") as File | null;
      if (proofFile && proofFile.size > 0) {
        const savedProof = await saveFile(proofFile);
        payment_proof_url = savedProof.path;
      }
    } else {
      const json = await req.json();
      name = json.name || "";
      email = json.email || "";
      password = json.password || "";
      phone = json.phone || "";
      isAthleteRegistration = Boolean(json.is_athlete);
      position = json.position || "Point Guard";
      jersey_number = json.jersey_number || "";
      age = parseInt(json.age) || 17;
      height_cm = parseInt(json.height_cm) || 180;
      weight_kg = parseInt(json.weight_kg) || 75;
      origin = json.origin || "";
      birth_date = json.birth_date || "";
      notes = json.notes || "";
    }

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Nama, email, dan password wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password minimal harus 6 karakter." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await db.find<UserRecord>("Users", { email: cleanEmail });
    if (existing && existing.length > 0) {
      return NextResponse.json(
        { success: false, error: "Email sudah terdaftar. Silakan gunakan email lain atau login." },
        { status: 409 }
      );
    }

    const password_hash = await hashPassword(password);
    const newUser = await db.create<UserRecord>("Users", {
      name: name.trim(),
      email: cleanEmail,
      password_hash,
      role_id: "user",
      status: "active",
    });

    let newOrder: OrderRecord | null = null;
    let newAthlete: AthleteRecord | null = null;

    if (isAthleteRegistration) {
      const ticketNumber = `WLV-AKD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 1. Buat tiket pesanan pembayaran pendaftaran akademi (Rp 350.000)
      newOrder = await db.create<OrderRecord>("Orders", {
        ticket_number: ticketNumber,
        user_id: newUser.id,
        service_type: "akademi",
        customer_name: newUser.name,
        customer_phone: phone || "-",
        booking_date: new Date().toISOString().split("T")[0],
        quantity: 1,
        total_amount: 350000,
        notes: notes || "Pendaftaran & Iuran Perdana Siswa Baru Akademi Wolves",
        status: "menunggu_konfirmasi",
        payment_proof: payment_proof_url || "",
        items_detail: JSON.stringify({
          position,
          origin,
          birth_date,
          age,
          height_cm,
          weight_kg,
          jersey_number,
        }),
      });

      // 2. Buat profil atlet (berstatus pending, ditautkan ke order)
      newAthlete = await db.create<AthleteRecord>("Athletes", {
        user_id: newUser.id,
        name: newUser.name,
        position,
        jersey_number: jersey_number || "-",
        age,
        height_cm,
        weight_kg,
        origin: origin || "Kabupaten Bogor",
        birth_date: birth_date || "",
        photo_url,
        order_id: newOrder.id,
        status: "pending", // Menunggu ACC admin di dashboard
      });

      // Update referensi athlete_id di order
      await db.update<OrderRecord>("Orders", newOrder.id, {
        athlete_id: newAthlete.id,
      });
    }

    const token = await createSessionToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role_id: newUser.role_id,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role_id: newUser.role_id,
      },
      order: newOrder,
      athlete: newAthlete,
      message: isAthleteRegistration
        ? "Pendaftaran berhasil! Pembayaran QRIS dan data profil atlet Anda sedang diverifikasi oleh admin Wolves."
        : "Akun berhasil dibuat! Selamat datang di Wolves Basketball Club.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan saat mendaftar: " + err.message },
      { status: 500 }
    );
  }
}
