import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory fallback tracking for visits if Cloudflare D1 isn't configured
  const localDbPath = path.join(process.cwd(), 'local_db.json');
  
  const getLocalDb = () => {
    if (fs.existsSync(localDbPath)) {
      try {
        return JSON.parse(fs.readFileSync(localDbPath, 'utf8'));
      } catch (err) {
        return { database_user: [], log: [] };
      }
    }
    return { database_user: [], log: [] };
  };

  const saveLocalDb = (db: any) => {
    fs.writeFileSync(localDbPath, JSON.stringify(db, null, 2), 'utf8');
  };

  // Endpoint to track visits, returns the current total visits (incrementing)
  app.post("/api/visits", async (req, res) => {
    const workerUrl = process.env.CLOUDFLARE_WORKER_URL || "https://dimdump.melamelati175.workers.dev";

    // Fallback if not configured
    if (!workerUrl) {
      const db = getLocalDb();
      const deviceId = Array.isArray(req.headers['x-device-id']) ? req.headers['x-device-id'][0] : (req.headers['x-device-id'] || 'unknown_device');
      const ua = req.headers['user-agent'] || '';
      
      const userIndex = db.database_user.findIndex((u: any) => u.device_id === deviceId);
      if (userIndex === -1) {
        db.database_user.push({
          device_id: deviceId,
          jumlah_kunjungan: 1,
          user_agent_original: ua
        });
      } else {
        db.database_user[userIndex].jumlah_kunjungan += 1;
      }
      
      db.log.push({
        id_log: db.log.length + 1,
        device_id: deviceId,
        waktu: new Date().toISOString()
      });
      
      saveLocalDb(db);
      
      const totalVisits = db.database_user.reduce((sum: number, u: any) => sum + (u.jumlah_kunjungan || 1), 0);
      return res.json({ visits: totalVisits, source: 'local' });
    }

    try {
      // Call the Cloudflare Worker endpoint
      const response = await fetch(`${workerUrl.replace(/\/$/, '')}/api/visits`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': req.headers['user-agent'] || '',
          'X-Device-Id': Array.isArray(req.headers['x-device-id']) ? req.headers['x-device-id'][0] : (req.headers['x-device-id'] || '')
        }
      });

      if (response.ok) {
        const data = await response.json();
        return res.json(data);
      } else {
        let errMsg = "Worker responded with error config";
        try { const errData = await response.json(); if (errData.error) errMsg = errData.error; } catch (e) {}
        throw new Error(errMsg);
      }
    } catch (e) {
      console.error("Worker Fetch Error (Visits POST):", e);
      const db = getLocalDb();
      const totalVisits = db.database_user.reduce((sum: number, u: any) => sum + (u.jumlah_kunjungan || 1), 0);
      return res.json({ visits: totalVisits, source: 'local-fallback' });
    }
  });

  // Endpoint to send user info updates
  app.post("/api/user-info", async (req, res) => {
    const workerUrl = process.env.CLOUDFLARE_WORKER_URL || "https://dimdump.melamelati175.workers.dev";

    // Fallback if not configured
    if (!workerUrl) {
      const db = getLocalDb();
      const deviceId = Array.isArray(req.headers['x-device-id']) ? req.headers['x-device-id'][0] : (req.headers['x-device-id'] || 'unknown_device');
      
      const userIndex = db.database_user.findIndex((u: any) => u.device_id === deviceId);
      if (userIndex !== -1) {
        if (req.body.name !== undefined) db.database_user[userIndex].nama_lengkap = req.body.name;
        if (req.body.contact !== undefined) db.database_user[userIndex].nomor_telepon = req.body.contact;
        if (req.body.address !== undefined) db.database_user[userIndex].detail_alamat = req.body.address;
        if (req.body.patokan !== undefined) db.database_user[userIndex].patokan = req.body.patokan;
        if (req.body.lat !== undefined) db.database_user[userIndex].lat = req.body.lat;
        if (req.body.lng !== undefined) db.database_user[userIndex].lng = req.body.lng;
      } else {
        db.database_user.push({
          device_id: deviceId,
          jumlah_kunjungan: 1,
          nama_lengkap: req.body.name || "",
          nomor_telepon: req.body.contact || "",
          detail_alamat: req.body.address || "",
          patokan: req.body.patokan || "",
          lat: req.body.lat || "",
          lng: req.body.lng || "",
        });
      }
      
      saveLocalDb(db);
      return res.json({ success: true, source: 'local' });
    }

    try {
      const response = await fetch(`${workerUrl.replace(/\/$/, '')}/api/user-info`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Device-Id': Array.isArray(req.headers['x-device-id']) ? req.headers['x-device-id'][0] : (req.headers['x-device-id'] || '')
        },
        body: JSON.stringify(req.body)
      });

      if (response.ok) {
        const data = await response.json();
        return res.json(data);
      } else {
        let errMsg = "Worker responded with error config";
        try { const errData = await response.json(); if (errData.error) errMsg = errData.error; } catch (e) {}
        throw new Error(errMsg);
      }
    } catch (e) {
      console.warn("Worker Fetch Error (User-Info POST):", e);
      return res.json({ success: false, source: 'local-fallback' });
    }
  });

  // Endpoint to get current total visits without incrementing
  app.get("/api/visits", async (req, res) => {
    const workerUrl = process.env.CLOUDFLARE_WORKER_URL || "https://dimdump.melamelati175.workers.dev";

    if (!workerUrl) {
      const db = getLocalDb();
      const totalVisits = db.database_user.reduce((sum: number, u: any) => sum + (u.jumlah_kunjungan || 1), 0);
      return res.json({ visits: totalVisits, source: 'local' });
    }

    try {
      const response = await fetch(`${workerUrl.replace(/\/$/, '')}/api/visits`, {
        method: 'GET'
      });

      if (response.ok) {
        const data = await response.json();
        return res.json(data);
      } else {
        throw new Error("Worker responded with error config");
      }
    } catch (e) {
      console.error("Worker Fetch Error (Visits GET):", e);
      const db = getLocalDb();
      const totalVisits = db.database_user.reduce((sum: number, u: any) => sum + (u.jumlah_kunjungan || 1), 0);
      return res.json({ visits: totalVisits, source: 'local-fallback' });
    }
  });

  // Endpoint to fetch dynamic content via Cloudflare KV
  app.get("/api/data", async (req, res) => {
    const workerUrl = process.env.CLOUDFLARE_WORKER_URL || "https://dimdump.melamelati175.workers.dev";

    const readLocalData = () => {
      const p = path.join(process.cwd(), 'public', 'cloudflare', 'data.json');
      if (fs.existsSync(p)) {
        try {
          return JSON.parse(fs.readFileSync(p, 'utf8'));
        } catch (e) {
          console.error("Local data JSON parse error:", e);
          return [];
        }
      }
      return [];
    };

    if (!workerUrl) {
      return res.json(readLocalData());
    }

    try {
      // Call the Cloudflare Worker endpoint
      const response = await fetch(`${workerUrl.replace(/\/$/, '')}/api/data`);
      
      if (response.ok) {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          return res.json(data);
        } catch (parseError) {
          console.warn("Worker returned invalid JSON, falling back to local data. Expected '[]' format.");
          return res.json(readLocalData());
        }
      } else {
        // Fallback to local data on error (e.g. 404 from worker)
        return res.json(readLocalData());
      }
    } catch (e) {
      console.warn("Could not fetch from Worker, falling back to local data.");
      return res.json(readLocalData());
    }
  });

  // --- ADMIN ENDPOINTS ---

  app.get("/api/admin/db", async (req, res) => {
    const workerUrl = process.env.CLOUDFLARE_WORKER_URL || "https://dimdump.melamelati175.workers.dev";
    if (!workerUrl) {
      const db = getLocalDb();
      return res.json(db);
    }
    
    try {
      const response = await fetch(`${workerUrl.replace(/\/$/, '')}/api/admin/db`);
      if (response.ok) {
        const data = await response.json();
        return res.json(data);
      } else {
        throw new Error("Worker /api/admin/db failed");
      }
    } catch (e) {
      console.warn("Failed to fetch from worker admin db, falling back to local.");
      return res.json(getLocalDb());
    }
  });

  app.post("/api/admin/kv", express.json(), async (req, res) => {
    const workerUrl = process.env.CLOUDFLARE_WORKER_URL || "https://dimdump.melamelati175.workers.dev";
    if (!workerUrl) {
      const p = path.join(process.cwd(), 'public', 'cloudflare', 'data.json');
      try {
        fs.writeFileSync(p, JSON.stringify(req.body, null, 2), 'utf8');
        return res.json({ success: true, source: 'local' });
      } catch (e) {
        console.error("Failed to save KV data to local file:", e);
        return res.status(500).json({ error: "Failed to save KV data" });
      }
    }
    
    try {
      const response = await fetch(`${workerUrl.replace(/\/$/, '')}/api/admin/kv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      });
      if (response.ok) {
        return res.json({ success: true, source: 'cloudflare' });
      } else {
        throw new Error("Worker /api/admin/kv save failed");
      }
    } catch (e) {
      console.error("Failed to save KV to worker:", e);
      return res.status(500).json({ error: "Failed to save to worker" });
    }
  });

  app.delete("/api/admin/users/:deviceId", async (req, res) => {
    const workerUrl = process.env.CLOUDFLARE_WORKER_URL || "https://dimdump.melamelati175.workers.dev";
    const deviceId = req.params.deviceId;
    
    if (!workerUrl) {
      const db = getLocalDb();
      if (db.database_user) {
        db.database_user = db.database_user.filter((u: any) => u.device_id !== deviceId);
        saveLocalDb(db);
      }
      return res.json({ success: true, source: 'local' });
    }
    
    try {
      const response = await fetch(`${workerUrl.replace(/\/$/, '')}/api/admin/users/${deviceId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        return res.json(await response.json());
      } else {
        throw new Error("Worker /api/admin/users delete failed");
      }
    } catch (e) {
      console.error("Failed to delete user on worker:", e);
      return res.status(500).json({ error: "Failed to delete from worker" });
    }
  });

  app.delete("/api/admin/logs/:idLog", async (req, res) => {
    const workerUrl = process.env.CLOUDFLARE_WORKER_URL || "https://dimdump.melamelati175.workers.dev";
    const idLog = parseInt(req.params.idLog, 10);
    
    if (!workerUrl) {
      const db = getLocalDb();
      if (db.log) {
        db.log = db.log.filter((l: any) => l.id_log !== idLog);
        saveLocalDb(db);
      }
      return res.json({ success: true, source: 'local' });
    }
    
    try {
      const response = await fetch(`${workerUrl.replace(/\/$/, '')}/api/admin/logs/${idLog}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        return res.json(await response.json());
      } else {
        throw new Error("Worker /api/admin/logs delete failed");
      }
    } catch (e) {
      console.error("Failed to delete log on worker:", e);
      return res.status(500).json({ error: "Failed to delete from worker" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : {
          clientPort: 443
        }
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('/admin*', (req, res) => {
      res.sendFile(path.join(distPath, 'admin/index.html'));
    });
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
