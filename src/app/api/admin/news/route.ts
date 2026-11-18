import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { db, NewsRecord } from "@/lib/db";
import { saveFile, deleteFile } from "@/lib/storage";

async function verifyAdmin() {
  const session = await getCurrentSession();
  if (!session || session.role_id !== "admin") return null;
  return session;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

export async function GET() {
  const session = await verifyAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
  }

  const news = await db.find<NewsRecord>("News");
  return NextResponse.json({ success: true, data: news });
}

export async function POST(req: NextRequest) {
  const session = await verifyAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const status = (formData.get("status") as "draft" | "published") || "published";
    const file = formData.get("thumbnail") as File | null;
    let thumbnail_path = (formData.get("thumbnail_path") as string) || "/images/news-championship.jpg";

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Judul dan konten berita wajib diisi." },
        { status: 400 }
      );
    }

    // Jika ada file gambar diupload
    if (file && file.size > 0) {
      const saved = await saveFile(file);
      thumbnail_path = saved.path;
    }

    const slug = slugify(title) + "-" + Date.now().toString().slice(-4);

    const record = await db.create<NewsRecord>("News", {
      title,
      slug,
      excerpt: excerpt || title.slice(0, 150),
      content,
      thumbnail_path,
      status,
      author_id: session.id,
    });

    return NextResponse.json({ success: true, data: record });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await verifyAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const status = formData.get("status") as "draft" | "published";
    const file = formData.get("thumbnail") as File | null;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID berita wajib diisi." }, { status: 400 });
    }

    const existing = await db.findById<NewsRecord>("News", id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Berita tidak ditemukan." }, { status: 404 });
    }

    const updates: Partial<NewsRecord> = {};
    if (title) updates.title = title;
    if (excerpt !== undefined) updates.excerpt = excerpt;
    if (content) updates.content = content;
    if (status) updates.status = status;

    if (file && file.size > 0) {
      const saved = await saveFile(file);
      updates.thumbnail_path = saved.path;
      // Hapus thumbnail lama jika berupa file upload lokal
      if (existing.thumbnail_path?.startsWith("/uploads/")) {
        await deleteFile(existing.thumbnail_path);
      }
    }

    await db.update<NewsRecord>("News", id, updates);

    return NextResponse.json({ success: true, message: "Berita berhasil diperbarui." });
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
      return NextResponse.json({ success: false, error: "ID berita wajib disertakan" }, { status: 400 });
    }

    const existing = await db.findById<NewsRecord>("News", id);
    if (existing && existing.thumbnail_path?.startsWith("/uploads/")) {
      await deleteFile(existing.thumbnail_path);
    }

    await db.delete("News", id);
    return NextResponse.json({ success: true, message: "Berita berhasil dihapus" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

