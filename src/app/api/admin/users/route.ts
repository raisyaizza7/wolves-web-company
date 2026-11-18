import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { db, UserRecord } from "@/lib/db";

async function verifyAdmin() {
  const session = await getCurrentSession();
  if (!session || session.role_id !== "admin") {
    return null;
  }
  return session;
}

export async function GET(req: NextRequest) {
  const session = await verifyAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase();

  let users = await db.find<UserRecord>("Users");
  // Jangan expose password hash
  let safeUsers = users.map(({ password_hash, ...rest }) => rest);

  if (q) {
    safeUsers = safeUsers.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ success: true, data: safeUsers });
}

export async function PUT(req: NextRequest) {
  const session = await verifyAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id, role_id, status } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "ID user wajib disertakan" }, { status: 400 });
    }

    const targetUser = await db.findById<UserRecord>("Users", id);
    if (!targetUser) {
      return NextResponse.json({ success: false, error: "User tidak ditemukan" }, { status: 404 });
    }

    // Safety checks: Admin tidak bisa menonaktifkan atau mengubah role dirinya sendiri
    if (session.id === id) {
      if (status === "inactive") {
        return NextResponse.json(
          { success: false, error: "Anda tidak dapat menonaktifkan akun admin Anda sendiri." },
          { status: 400 }
        );
      }
      if (role_id && role_id !== "admin") {
        return NextResponse.json(
          { success: false, error: "Anda tidak dapat mencabut role admin dari diri Anda sendiri." },
          { status: 400 }
        );
      }
    }

    const updates: Partial<UserRecord> = {};
    if (role_id) updates.role_id = role_id;
    if (status) updates.status = status;

    await db.update<UserRecord>("Users", id, updates);

    return NextResponse.json({ success: true, message: "User berhasil diperbarui" });
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
      return NextResponse.json({ success: false, error: "ID user wajib disertakan" }, { status: 400 });
    }

    if (session.id === id) {
      return NextResponse.json(
        { success: false, error: "Anda tidak dapat menghapus akun Anda sendiri." },
        { status: 400 }
      );
    }

    const allUsers = await db.find<UserRecord>("Users");
    const activeAdmins = allUsers.filter((u) => u.role_id === "admin" && u.status === "active");
    if (activeAdmins.length <= 1 && activeAdmins[0]?.id === id) {
      return NextResponse.json(
        { success: false, error: "Tidak dapat menghapus admin terakhir yang aktif." },
        { status: 400 }
      );
    }

    await db.delete("Users", id);
    return NextResponse.json({ success: true, message: "User berhasil dihapus" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

