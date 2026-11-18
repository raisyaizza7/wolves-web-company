import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { db, RoleRecord } from "@/lib/db";

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

  const roles = await db.find<RoleRecord>("Roles");
  return NextResponse.json({ success: true, data: roles });
}

export async function POST(req: NextRequest) {
  const session = await verifyAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { name, description, permissions } = await req.json();
    if (!name) {
      return NextResponse.json({ success: false, error: "Nama role wajib diisi" }, { status: 400 });
    }

    const cleanName = name.trim().toLowerCase().replace(/\s+/g, "_");
    const existing = await db.find<RoleRecord>("Roles", { name: cleanName });
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: "Role dengan nama ini sudah ada." }, { status: 409 });
    }

    const newRole = await db.create<RoleRecord>("Roles", {
      name: cleanName,
      description: description || "",
      permissions: permissions || "read:profile",
      is_system: false,
    });

    return NextResponse.json({ success: true, data: newRole });
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
      return NextResponse.json({ success: false, error: "ID role wajib diisi" }, { status: 400 });
    }

    const role = await db.findById<RoleRecord>("Roles", id);
    if (!role) {
      return NextResponse.json({ success: false, error: "Role tidak ditemukan" }, { status: 404 });
    }

    if (role.is_system === true || role.is_system === "TRUE" || role.name === "admin" || role.name === "user") {
      return NextResponse.json({ success: false, error: "Role bawaan sistem tidak dapat dihapus." }, { status: 400 });
    }

    await db.delete("Roles", id);
    return NextResponse.json({ success: true, message: "Role berhasil dihapus" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

