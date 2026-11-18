import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession, verifyPassword, hashPassword } from "@/lib/auth";
import { db, UserRecord } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Password saat ini dan password baru wajib diisi." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password baru minimal harus 6 karakter." },
        { status: 400 }
      );
    }

    const user = await db.findById<UserRecord>("Users", session.id);
    if (!user) {
      return NextResponse.json({ success: false, error: "User tidak ditemukan" }, { status: 404 });
    }

    const valid = await verifyPassword(currentPassword, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: "Password saat ini salah." },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);
    await db.update<UserRecord>("Users", user.id, { password_hash: newHash });

    return NextResponse.json({
      success: true,
      message: "Password berhasil diubah. Harap ingat password baru Anda.",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

