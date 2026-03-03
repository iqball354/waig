import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock API Routes
  app.get("/api/stats", (req, res) => {
    res.json({
      totalPostings: 1284,
      scheduled: 42,
      success: 1230,
      trends: {
        total: "+12.5%",
        scheduled: "+5%",
        success: "+10.2%"
      }
    });
  });

  app.get("/api/postings", (req, res) => {
    res.json([
      {
        id: 1,
        media: "https://picsum.photos/seed/promo/100/100",
        caption: "Promo Diskon Akhir Tahun untuk Semua Produk!",
        schedule: "25 Okt 2023 10:00 WIB",
        platform: "Instagram",
        status: "Terjadwal"
      },
      {
        id: 2,
        media: "https://picsum.photos/seed/tips/100/100",
        caption: "Tips Mengelola Konten agar Tetap Konsisten...",
        schedule: "24 Okt 2023 14:30 WIB",
        platform: "Facebook",
        status: "Sukses"
      },
      {
        id: 3,
        media: "https://picsum.photos/seed/giveaway/100/100",
        caption: "Pengumuman Pemenang Giveaway Mingguan!",
        schedule: "23 Okt 2023 09:00 WIB",
        platform: "Instagram",
        status: "Gagal"
      }
    ]);
  });

  app.get("/api/accounts", (req, res) => {
    res.json([
      {
        id: "88294102931",
        name: "Travel Nusantara ID",
        type: "FB Page",
        status: "Aktif",
        expiry: "12 Mei 2024",
        daysLeft: 45
      },
      {
        id: "10293184920",
        name: "@nusantara_travel",
        type: "IG Business",
        status: "Perlu Re-auth",
        expiry: "Kedaluwarsa",
        daysLeft: -2
      },
      {
        id: "77210592183",
        name: "Kuliner Hits Bandung",
        type: "FB Page",
        status: "Aktif",
        expiry: "20 Juni 2024",
        daysLeft: 84
      }
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
