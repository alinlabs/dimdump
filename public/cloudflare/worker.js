export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');

    // CORS Headers untuk mengizinkan request dari frontend
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, User-Agent, X-Device-Id',
    };

    // Preflight request handling
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // ----------------------------------------------------
    // 1. ENDPOINT: GET /api/data (Mengambil dari KV)
    // ----------------------------------------------------
    if (url.pathname === "/api/data" && request.method === "GET") {
      try {
        // Ambil data dari KV dengan key 'database_static'
        const dataStr = await env.database_static.get("database_static");
        
        if (!dataStr) {
          return new Response(JSON.stringify({ error: "Data not found" }), { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          });
        }
        
        return new Response(dataStr, { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }
    }

    // ----------------------------------------------------
    // 2. ENDPOINT: GET /api/visits (Ambil total kunjungan saja)
    // ----------------------------------------------------
    if (url.pathname === "/api/visits" && request.method === "GET") {
      try {
        const stmt = env.data_realtime.prepare(`SELECT SUM(jumlah_kunjungan) as total FROM database_user`);
        const result = await stmt.first();
        
        return new Response(JSON.stringify({ 
          visits: result && result.total ? result.total : 0, 
          source: 'cloudflare-worker-d1',
          action: 'read'
        }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }
    }

    // ----------------------------------------------------
    // 3. ENDPOINT: POST /api/visits (Menyimpan log & device ke D1)
    // ----------------------------------------------------
    if (url.pathname === "/api/visits" && request.method === "POST") {
      try {
        // Deteksi User-Agent yang lebih mudah dibaca
        const ua = request.headers.get("User-Agent") || "";
        const deviceId = request.headers.get("X-Device-Id") || "unknown_device";
        
        // Helper Parser sederhana
        let parsedBrowser = "Unknown Browser";
        if (ua.includes("Edg")) parsedBrowser = "Edge";
        else if (ua.includes("OPR") || ua.includes("Opera")) parsedBrowser = "Opera";
        else if (ua.includes("Chrome")) parsedBrowser = "Chrome";
        else if (ua.includes("Firefox")) parsedBrowser = "Firefox";
        else if (ua.includes("Safari")) parsedBrowser = "Safari";
        
        let parsedOS = "Unknown OS";
        if (ua.includes("Windows NT 10.0")) parsedOS = "Windows 10/11";
        else if (ua.includes("Windows NT 6.1")) parsedOS = "Windows 7";
        else if (ua.includes("Mac OS X")) parsedOS = "Mac/iOS";
        else if (ua.includes("Android")) parsedOS = "Android";
        else if (ua.includes("Linux")) parsedOS = "Linux";
        
        const deviceType = /mobile/i.test(ua) ? "Mobile" : /tablet/i.test(ua) ? "Tablet" : "Desktop";
        
        // Gabungkan formatnya agar rapi ketika dilihat di database
        const readableUserAgent = `OS: ${parsedOS} | Browser: ${parsedBrowser} | Tipe: ${deviceType}`;

        // Cek apakah device_id sudah ada di database_user
        const checkStmt = await env.data_realtime.prepare(`SELECT device_id FROM database_user WHERE device_id = ?`).bind(deviceId).first();

        if (!checkStmt) {
          // Jika baru, isi database_user terlebih dahulu
          await env.data_realtime.prepare(`
            INSERT INTO database_user (device_id, jumlah_kunjungan, os, browser, tipe_perangkat, user_agent_original) 
            VALUES (?, 1, ?, ?, ?, ?)
          `).bind(deviceId, parsedOS, parsedBrowser, deviceType, ua).run();
        } else {
          // Jika sudah ada, update jumlah kunjungan dan update user_agent ke format terbaca
          await env.data_realtime.prepare(`
            UPDATE database_user SET jumlah_kunjungan = jumlah_kunjungan + 1, os = ?, browser = ?, tipe_perangkat = ?, user_agent_original = ? WHERE device_id = ?
          `).bind(parsedOS, parsedBrowser, deviceType, ua, deviceId).run();
        }

        // Catat ke log kunjungan dengan relasi device_id
        await env.data_realtime.prepare(`
          INSERT INTO log (device_id) VALUES (?)
        `).bind(deviceId).run();

        // Ambil total kunjungan global terbaru
        const sumStmt = await env.data_realtime.prepare(`SELECT SUM(jumlah_kunjungan) as total FROM database_user`);
        const result = await sumStmt.first();
        const total = result && result.total ? result.total : 1;
        
        return new Response(JSON.stringify({ 
          visits: total, 
          source: 'cloudflare-worker-d1',
          device: deviceType
        }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }
    }

        // ----------------------------------------------------
    // 4. ENDPOINT: POST /api/user-info (Update data pemesan)
    // ----------------------------------------------------
    if (url.pathname === "/api/user-info" && request.method === "POST") {
      try {
        const deviceId = request.headers.get("X-Device-Id") || "unknown_device";
        const body = await request.json();
        
        // Cek apakah device_id sudah ada di database_user
        const checkStmt = await env.data_realtime.prepare(`SELECT device_id FROM database_user WHERE device_id = ?`).bind(deviceId).first();
        
        if (!checkStmt) {
           await env.data_realtime.prepare(`
             INSERT INTO database_user (device_id, nama_lengkap, nomor_telepon, detail_alamat, patokan, lat, lng) 
             VALUES (?, ?, ?, ?, ?, ?, ?)
           `).bind(deviceId, body.name || "", body.contact || "", body.address || "", body.patokan || "", body.lat || "", body.lng || "").run();
        } else {
           await env.data_realtime.prepare(`
             UPDATE database_user 
             SET nama_lengkap = COALESCE(?, nama_lengkap), 
                 nomor_telepon = COALESCE(?, nomor_telepon), 
                 detail_alamat = COALESCE(?, detail_alamat), 
                 patokan = COALESCE(?, patokan),
                 lat = COALESCE(?, lat),
                 lng = COALESCE(?, lng)
             WHERE device_id = ?
           `).bind(body.name || null, body.contact || null, body.address || null, body.patokan || null, body.lat || null, body.lng || null, deviceId).run();
        }

        return new Response(JSON.stringify({ success: true, source: 'cloudflare-worker-d1' }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }
    }

    // ----------------------------------------------------
    // 5. ENDPOINT: GET / (Check Status Worker)
    // ----------------------------------------------------
    if (url.pathname === "/" && request.method === "GET") {
      return new Response(JSON.stringify({ status: "API Worker is running", version: "1.0.0" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // ----------------------------------------------------
    // 6. ENDPOINT: GET /api/admin/db (Admin: Get full DB)
    // ----------------------------------------------------
    if (url.pathname === "/api/admin/db" && request.method === "GET") {
      try {
        const users = await env.data_realtime.prepare(`SELECT * FROM database_user`).all();
        const logs = await env.data_realtime.prepare(`SELECT * FROM log ORDER BY id_log DESC`).all();
        
        return new Response(JSON.stringify({
          database_user: users.results || [],
          log: logs.results || []
        }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }
    }

    // ----------------------------------------------------
    // 7. ENDPOINT: POST /api/admin/kv (Admin: Save to KV)
    // ----------------------------------------------------
    if (url.pathname === "/api/admin/kv" && request.method === "POST") {
      try {
        const body = await request.text(); // Get raw text to store
        // Ensure it's valid JSON
        JSON.parse(body);
        
        await env.database_static.put("database_static", body);
        
        return new Response(JSON.stringify({ success: true }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: "Invalid JSON or failed to save: " + e.message }), { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }
    }

    // ----------------------------------------------------
    // 8. ENDPOINT: DELETE /api/admin/users/:device_id
    // ----------------------------------------------------
    if (url.pathname.startsWith("/api/admin/users/") && request.method === "DELETE") {
      try {
        const device_id = url.pathname.split('/').pop();
        await env.data_realtime.prepare(`DELETE FROM database_user WHERE device_id = ?`).bind(device_id).run();
        
        return new Response(JSON.stringify({ success: true }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }
    }

    // ----------------------------------------------------
    // 9. ENDPOINT: DELETE /api/admin/logs/:id_log
    // ----------------------------------------------------
    if (url.pathname.startsWith("/api/admin/logs/") && request.method === "DELETE") {
      try {
        const id_log = url.pathname.split('/').pop();
        await env.data_realtime.prepare(`DELETE FROM log WHERE id_log = ?`).bind(id_log).run();
        
        return new Response(JSON.stringify({ success: true }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }
    }

    // Jika route tidak ditemukan
    return new Response("Endpoint Not Found", { status: 404, headers: corsHeaders });
  }
};
