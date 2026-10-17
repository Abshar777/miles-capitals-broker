# Maintenance page

Instead of Cloudflare's "Connection timed out / Error 522" page, visitors see a Miles Capital
"We'll be back shortly" page that reloads by itself once the site is back.

| Situation | Handled by |
|---|---|
| Whole server down or unreachable (Cloudflare 521/522/523/524) | Cloudflare Worker |
| Server up, portal app crashed (nginx 502/504) | nginx (and the Worker) |
| Planned maintenance (deploys, migrations) | Worker switch `MAINTENANCE_MODE` |

Files:
- `maintenance.html` – the page. Self-contained (logo built in), because our server may be down.
- `cloudflare-maintenance-worker.js` – the Worker, with the page built in.
- `build-worker.mjs` – after editing `maintenance.html`, run `node deploy/build-worker.mjs`, then paste the worker again in Cloudflare.
- `nginx-maintenance.conf` – lines for the nginx portal server blocks.

Cloudflare plan: **Free** (custom error pages need Pro, so we use a Worker).

---

## 1. Cloudflare Worker (one time)

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Create Worker**.
   Name it `miles-maintenance` → **Deploy** (deploys the hello-world sample).
2. **Edit code** → delete everything → paste the whole of `cloudflare-maintenance-worker.js` → **Deploy**.
3. Worker → **Settings** → **Variables and Secrets** → **Add**:
   - `MAINTENANCE_MODE`, type **Text**, value `off`
   - `BYPASS_TOKEN`, type **Secret**, value: a long random string (e.g. output of `openssl rand -hex 24`). Keep it private.
   → **Deploy**.
4. Cloudflare dashboard → the **milescapitals.com** zone → **Workers Routes** → **Add route**, one per line below:

   | Route | Worker |
   |---|---|
   | `broker.milescapitals.com/*` | `miles-maintenance` |
   | `broker-admin.milescapitals.com/*` | `miles-maintenance` |
   | `broker.milescapitals.com/_next/*` | **None** |
   | `broker-admin.milescapitals.com/_next/*` | **None** |
   | `broker.milescapitals.com/api/*` | **None** |
   | `broker-admin.milescapitals.com/api/*` | **None** |

   On the two Worker routes set **Request limit failure mode → Fail open (proceed)**: if the Free
   plan's daily limit (100,000 requests) is ever reached, the site keeps working as it does today.

   The `None` routes keep static files and the portals' own login/session calls out of the
   Worker, so mostly page loads are counted. The API hosts (`api-broker…`) are left out on
   purpose: browsers call them constantly and would use up the free limit. The Worker already
   supports them (JSON "under maintenance" reply) if you ever add routes for them.

5. Check: open https://broker.milescapitals.com – it should work exactly as before.
   Then test the page with the switch (section 3) and turn it off again.

Check usage after a day: Workers & Pages → `miles-maintenance` → **Metrics**.

## 2. nginx (one time, on the server)

```bash
sudo mkdir -p /var/www/maintenance
sudo cp <frontend checkout>/deploy/maintenance.html /var/www/maintenance/maintenance.html
grep -l "server_name broker" /etc/nginx/sites-enabled/* /etc/nginx/conf.d/* 2>/dev/null
```

Paste the lines from `nginx-maintenance.conf` inside the `server { … }` block for
`broker.milescapitals.com` and the one for `broker-admin.milescapitals.com` (not the api-* blocks), then:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

`nginx -t` must say `syntax is ok` before reloading. After changing `maintenance.html`, copy it again.

## 3. Planned maintenance switch

- **Turn on:** Worker → Settings → Variables and Secrets → `MAINTENANCE_MODE` = `on` → Deploy.
  Everyone sees the maintenance page within seconds; the API keeps running.
- **Staff access while it's on:** open `https://broker.milescapitals.com/?maintenance_bypass=<BYPASS_TOKEN>`
  (and the same on `broker-admin…`). That browser can use the site normally for 12 hours.
- **Turn off:** set `MAINTENANCE_MODE` = `off` → Deploy. Open pages reload by themselves within 30 seconds.
