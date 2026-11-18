import { NextRequest, NextResponse } from "next/server";
import { db, UserRecord } from "@/lib/db";
import { verifyPassword, createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const users = await db.find<UserRecord>("Users", { email: email.trim().toLowerCase() });
    const user = users[0];

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Email atau password tidak valid." },
        { status: 401 }
      );
    }

    if (user.status === "inactive") {
      return NextResponse.json(
        { success: false, error: "Akun Anda sedang dinonaktifkan oleh Administrator." },
        { status: 403 }
      );
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: "Email atau password tidak valid." },
        { status: 401 }
      );
    }

    const token = await createSessionToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role_id: user.role_id,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan pada server: " + err.message },
      { status: 500 }
    );
  }
}

