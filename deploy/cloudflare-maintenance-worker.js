/**
 * Miles Capital – maintenance page Worker (Cloudflare Free plan).
 *
 * Sits in front of the portals and passes every request to our server as usual.
 * It only steps in when:
 *   - the server can't be reached or fails (Cloudflare 52x / 530, or 502 / 504 from nginx)
 *   - MAINTENANCE_MODE is "on" (manual switch), for anyone without the staff bypass cookie
 * Web hosts get deploy/maintenance.html; api-* hosts get a JSON 503.
 *
 * Settings (Worker -> Settings -> Variables and Secrets):
 *   MAINTENANCE_MODE  text    "on" | "off"     manual switch, takes effect within seconds
 *   BYPASS_TOKEN      secret  long random      staff open https://<site>/?maintenance_bypass=<token>
 *                                              once to use the site for 12 h while the switch is on
 *
 * The page below is generated: edit deploy/maintenance.html, then run `node deploy/build-worker.mjs`.
 * Setup steps: deploy/README.md
 */

const DOWN = new Set([520, 521, 522, 523, 524, 525, 526, 527, 530]);
const BYPASS_COOKIE = "mc_maintenance_bypass";
const BYPASS_SECONDS = 12 * 60 * 60;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const api = url.hostname.startsWith("api-");

    // WebSockets go straight through.
    if ((request.headers.get("Upgrade") || "").toLowerCase() === "websocket") {
      return fetch(request);
    }

    const token = env.BYPASS_TOKEN || "";

    // Staff bypass link: ?maintenance_bypass=<token> sets a cookie, then drops the parameter.
    if (token && url.searchParams.get("maintenance_bypass") === token) {
      url.searchParams.delete("maintenance_bypass");
      return new Response(null, {
        status: 302,
        headers: {
          Location: url.toString(),
          "Set-Cookie": `${BYPASS_COOKIE}=${token}; Max-Age=${BYPASS_SECONDS}; Path=/; Secure; HttpOnly; SameSite=Lax`,
          "Cache-Control": "no-store",
        },
      });
    }

    // Manual switch.
    if ((env.MAINTENANCE_MODE || "").trim().toLowerCase() === "on" && !hasBypass(request, token)) {
      return maintenance(api);
    }

    // Normal traffic: pass through, swap in the maintenance page only if the server failed.
    let response;
    try {
      response = await fetch(request);
    } catch (err) {
      return maintenance(api);
    }
    return serverDown(response, api) ? maintenance(api) : response;
  },
};

function serverDown(response, api) {
  if (DOWN.has(response.status)) return true;
  if (response.status === 502 || response.status === 504) {
    // On API hosts our backend may answer 502/504 itself with JSON (e.g. "MT5 refused"); keep those.
    if (!api) return true;
    return !(response.headers.get("Content-Type") || "").includes("application/json");
  }
  return false;
}

function hasBypass(request, token) {
  if (!token) return false;
  const cookies = (request.headers.get("Cookie") || "").split(/;\s*/);
  return cookies.includes(`${BYPASS_COOKIE}=${token}`);
}

function maintenance(api) {
  const headers = { "Cache-Control": "no-store", "Retry-After": "60" };
  if (api) {
    return new Response(
      JSON.stringify({ detail: "Miles Capital is under maintenance. Please try again in a few minutes." }),
      { status: 503, headers: { ...headers, "Content-Type": "application/json" } },
    );
  }
  return new Response(MAINTENANCE_HTML, {
    status: 503,
    headers: { ...headers, "Content-Type": "text/html; charset=utf-8" },
  });
}

// MAINTENANCE_HTML:START
const MAINTENANCE_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Maintenance | Miles Capital</title>
<!-- Self-contained on purpose: shown when our server is down, so nothing may load from it. -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #111222; --card: #19192f; --border: #2e2f57; --field: #282943;
    --text: #ffffff; --muted: #9a9ab0; --gold: #d4af37; --gold-hover: #d7b546;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; min-height: 100%; }
  body {
    background: var(--bg); color: var(--text);
    font: 400 15px/1.6 Rubik, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh; min-height: 100dvh; padding: 24px 16px;
  }
  .card {
    width: 100%; max-width: 480px; text-align: center;
    background: var(--card); border: 1px solid var(--border); border-radius: 8px;
    padding: 40px 32px;
  }
  .logo { width: 72px; height: 72px; border-radius: 12px; display: block; margin: 0 auto 24px; }
  .badge {
    display: inline-flex; align-items: center; gap: 8px; margin-bottom: 16px;
    padding: 4px 12px; border-radius: 999px; font-size: 13px;
    color: var(--gold); background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.3);
  }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--gold); animation: pulse 1.6s ease-in-out infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
  h1 { font-size: 22px; font-weight: 500; margin: 0 0 12px; }
  p { color: var(--muted); margin: 0 0 24px; }
  button {
    font: inherit; font-weight: 500; height: 48px; padding: 0 24px; width: 100%;
    border: 0; border-radius: 4px; cursor: pointer;
    background: var(--gold); color: #000;
  }
  button:hover { background: var(--gold-hover); }
  button:disabled { color: rgba(0, 0, 0, 0.3); cursor: default; }
  .status { margin-top: 16px; font-size: 13px; color: var(--muted); }
  @media (prefers-reduced-motion: reduce) { .dot { animation: none; } }
  @media (max-width: 420px) { .card { padding: 32px 20px; } }
</style>
</head>
<body>
  <main class="card">
    <img class="logo" alt="Miles Capital" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAnOElEQVR4nO2d+Zfk1nXfv6h9X3qb7tl3cShyKFIkRUmOTDt2bDk+Jz/lv8xPSU58nBzKVCzRcsQRRXEdzcqe3vfadyDn+wBUoXot9HRzqvDuRypWFYCqqQbwvu++++671yhO3bQgCIKWhF71DxAE4dUhAiAIGiMCIAgaIwIgCBojAiAIGiMCIAgaIwIgCBojAiAIGiMCIAgaIwIgCBojAiAIGiMCIAgaIwIgCBojAiAIGiMCIAgaIwIgCBojAiAIGiMCIAgaIwIgCBojAiAIGiMCIAgaIwIgCBojAiAIGiMCIAgaIwIgCBojAiAIGiMCIAgaIwIgCBojAiAIGiMCIAgaIwIgCBojAiAIGiMCIAgaIwIgCBojAiAIGiMCIAgaIwIgCBojAiAIGiMCIAgaIwIgCBojAiAIGiMCIAgaIwIgCBojAiAIGiMCIAgaIwIgCBoTedU/IKiEQwZm82FcKEZhuBvVCwOG+6ye7L3G/mfuNQ4+ez936OePO955f9y/5/19Npb9X2vwev97y34z/Nqy3L39Y+2n4e9TW9X/D3nuf5/nO4587v9r9r/t2V+u97C510O9Nfidgo0IwDkRjxp4+3YSf/fjrBID9T8+q4YYghEKIdR/bSDEZ75X2+3XIXU8X7vvnWOM0OC1c0xo32eNE9+Hhr6//9r5La6w2A3ZaWCqYe178H8mX5sw+9vN/n5TvXbem+57zz7T+ZxpH8fXpvNavT9iPz9rH+cc39/vfMbZxvdffdfCR39ooLHZdfVHcBABOCfYfmIRA6lECJEQG5PdCN2GZjdgbyM0Dmxz3+9vsMd/dvj9UZ89+Fv2f2ZgAdhtf7hh240fnsbtCoB7jNM4+/s8jfWQfe52sy8mTgPu7zdgWSHnGMN+WHzme8DiwwJMPkz3wX/PUGIcpqYN2TCCCMA543Sag17HGLweeh50toNj1LMFGPYbdfOql05vbLABGQjxljYMj6k8bDrb4wFuN/Zth2fboMPv/3bnP67Z7jXzvX+gKw5seHbDHzy720zvdkdQBsd7H4dtc7fv3zd8ft3vPbh93zUQhhAL4JxgD1SqmVja7Kjex26INK+HhwFub+ua8P193u1eM75/3BHH0ISnb9cZbgwNARwTf+i9EUIxm8DcVArxmO0Trje62Cw1UG92+qY/j58tJlDMxtUxbE+bew1s7TX6pji3qtf9xrjPYuj3/J7tQ8OHgfWw33LYf5xrKXiHEgeGFY5lsV3uod11vQqCFxGAc4I33MPlFkr1Htuiw7DjzevIO/jsOvP2Oeb6Dj73WNc+GOw7eGzfFTj4nGf7B28u4Jc/u4GZaER99sVGGf/022d4vLSrGhqJR8P4x1/cxIfvXFbvu10Tv/tiFf/y4AU6XdP+bq+zz3XQ9R16Xuee66QbOAtd559rxfQtj/7n9r8fPA87Hvc5Bi2oa1CqcoxwThd7ghEBOCd6poW1nY56jDu5TBwf/vhKf2iwU2ri02/W1MMVgFQigrfuzvY/w+2Pl0r4+NMltF0BECYOiQMQBI0RARAEjREBEASNEQEQBI0RARAEjREBEASNEQEQBI0RARAEjREBEASNEQEQBI0RARAEjREBEASNEQEQBI0RARAEjREBEASNEQEQBI0RARAEjREBEASNEQEQBI2RnIBCIGBm5HgsjHQyimQ8qnIYMpFpJMKaAHai1F7PQqvTRa3RQaXWQaXeQbvb0zpl+MQLAC9sMhZCOsGqN57yW4Mj+nn3B8UuvKWwvBlz932W+fZNC9VGF+V6+8xvFBbmyCQjyKZinkI8/XS5zvsjXg82DGfUdXbyVattod4y0e0hkEQiIWSSUcxPp3DlQg7z02lM51MoZOPIZWJIUwRiIUTCdrGFTreLar2N7VID69s1vNio4c+LJSxv1lBvHl01KBQCsskwknEnbXrLRK1pKkGZdCZeAHhxr8xG8c7tpKrEo/Lew81/P5wTP3RsrnxPFR1P/v1u18IfH+3g139cPfMLHouEcP/2NH7yxqyqHeAtnTXInW8Ob3fy37s574fKbznHcTuzEi+ut/HV87aqTxAUKJTRSAgLM2ncvVLA9Ys53LsxjTduz2K2kEY0GlHjWlYnYINvtdnjt9FssT5DHLFoBuGQff4qtRb++OctfPZwWz2WNhuDFOceZgtRvH07jfnpiDq3j1408eXzJip1EYCxuCFm8hG8ezelSkANSmSF1Wv2EtFIGGG+D9u18dx96tjQwW3hcLhfMovVd/gd//blBhq97pn+9mQ8gjduTeEff35V3bJuTTvT6g1em4PXPfXaed/rqfedLh9dmD13v/3c7fYQNiw8Xh7/tOSjwoZ/eS6NO1fyePfeHN57fR7z0xkk4lHEYhFEwqxrYKDW7ODZcgnPV/awtVdXPT7NfloDhUwUU7k4ri+kMVeM42dvzuGNm3ncuJjGR5+u4dGLCmqNwXVmr//2nQw+/FEWU9kQ2p0u2h0Tj5ZbqGDyiQShAs9WqYvPHjcQpQXg6dnD4RAWpuL4wdW0Gge6paLsceGglt7+Bz/nraM3lUsgn4mh2eZ48WxUn1ZGLh3DbCGBWCykatv1a9qpnt5b385Cr2dbLiZLghkWeizg2TOxstXBs9W6uim9VkHPNPF8vYNmZ/J7KYo8KxK9di2PX7y9gHdfm8OF6TRSiRgikYhzvQx0eyaWNqr4w7fr+PjBIr56uo1StYWOOjesf2aLSCETx1t3pvDBGzP44Y08cukIPnxnDtO5KP7531fx2Z93Ual1lWC8cTOD9+/lMKeqPFN07SHBoHryZDPxAkBT9/l6G6s73UEFHmcsz6KcP7mXxZ3LaRiGpSrEcDx8aTbs6+Zj4+c4c2O3cWZ+AN5ELLU1P51UXofTfC1rdjxabuB/fbKrxqX90jeOD6DTpdNrsgUgHDZwcTqpeuoP31nAnSsFpFMxZdVxSOfS6fTwZLmM//mvT/GrTxexsllV1tH+69Vq91QPz5Jmz1bK+I/vLeDn92cwlY3grdt5xKN2naJvv6vg+oUE/tP7RdxYSCAc6qEXQF/KxAsALzBv8land6h/oKYaht1YdisdVOumuqEwugbYAjCVxJeGocaWZwFvXgrA3FRSNVb6F9jT7y/SeSz829sWSrUeas3g3Z3srW8spPE3787jP/xoHguzGcQ4xt93klimjI3/v330CB/9ftGuV3iMUtMaoDX3cLGERquragn+xY9mUEiHcfdqFn//kx5uXUyqhn9tPoZIiA4/BJKJF4CRsVj0soetchd+XWL0NM8UEp4afy9PJBzqe6tpvperbeUIzCR9KFOAYeO/czmDX35wET97cxbT+aSy6IxDGvPaTh3/9MkzVaeQBUtHHab1ehYW12r43/9vFdl0BO/fKyg/0mvXMri+EFdWozL7A1z6TKtAoGbbRKlGxffXiyfjYeTTnKo7OwWIRUPIpqKIhUMoVdtY3aqj0QpoN+MTWm43L6bxDz9dwM/fnEExO5gm3Q+de598voqP/7CEjd26bx9Nz7TwbLmKX326hqfLVSUK/Pd5zaPhg4ITNLQSgFbHRKXeVcMBPyRiYWTT0aEx58vCIBVaFnRgbe01sb7dGIzhNYbnmEO0v313Dj+5V0Q2FTm+8a6U8evPlrC4Wu4XMvVLt2fi80d7+N1X29gut6ETWgkA53gpALQE/HQUNEfpB2CPfRZGAC0JRqzxO/l9O+U2NktN6A7PRS4VwQc/LOLd1wrKO38cHL8/+HYDjxb3Dp2/HxWL5dw7Pfz+mx38+UVFlXbXBa0EgB0EhwCbe4zqs3w1WM4dX5xNHXBAnXYGYDqfwGwxqd5XGx2Ua8GZrz8t8WgIb9zI4ievFzCbj5041bayWcMXT7awVWq8tO1kWsDSRgOfPWTsQEub8GCtBICU610sbzV9m4uch748lzmTYQBjEJQAFBLqRmMYKh86w9O6MB3HT39YwPX51Innmeb/4xd7+G61oqY7z4KeyajPEp6u1FQEqA5oJwCM69/ca/n2AzBo50IxeSYCwIClqVxMDQFoulbrHTUtpTOpRBhv3crh7uW08sSfBOfzX2xUsVNmb302jdWygPXdFr56VsFO5ezXfowj2glAq22iXOsqtfdD3HEEMqLwZUnEImoKkGsB9qot5QQMwsKS08Jh1dW5BO7fzGAqFx3pM1zJt75dP3PLyTItfPmkjKUN/1biJKKdANBcZHDQcYEihxGLhJFOnI0AqGnFTEytTVjfaWBlsw6dSSVCuHctjStzCXvl3ggw2Gdzr6k8+GeJBWB5q4UnyzVlLQbdCtBOALoml3LaMwF+4PqBbDqGVOLlZgL4Wc4A0ALg663dJtZ2OAWoJzwHF2fiuHslhfwJXn8v26Wmsp7Oo5fudE1887yKtZ3gDwO0EwAuuuFCj41d+gEsX2YqHYFcE/AyMwH0IbD353fxny/V2ijX9Jp73j/FevtiEldm4r6sK543+k78WnKj8nytgfWdFroBH5ppJwBkr9rB8mbTtx9gOh/HtXmuJz+9APCzxVxcrTDkuL/R7CmHlq7M5CK4Pp9Qc/6j6irbfLPVc1ZAns/vKtW6apVlqdYJtBWgpQBwKnBlx7/jjctIL86mVfTeaYmG7eXFag1At4dqk2mpghtrflI8BBv/tbm4mhkZHUuN/bnk+bwwTa4IrGFtu+17xmiS0FIAOBNQqnZ9m3eJeFiZ7vTen5ZkIqKCihj0wrx0u+XzGcdOAjwHl2Ziah2+n2GVWrD7PZyy1e02tsudQF8fLQWApn/DMSH9ruCjEzAWPf2KPcb/MwiIN/zmbgNr2/4XsASFmVwUC1MxJGLjueSm3uypoDGGjwf1EmktAPVWz1cIKcfvTDTJXvw0sJPLpGJqCMCEPhuOAOgIz8X1+TiuzMbOZGr1vO6Tb7+rK0vgvJyNrxotBYDXstroYafiz7yjB59jd/bgp7lp7TRg9hQgp693K221FFhHmMB1vhhFMTO68+9VsLLVwuZeJ7CzAVoKAOHim9Vt/zMBbLyX6Ag8hQDQeZjPxFVYMYcfnMbyOwwJCkx8ks/YefvPMs/CWdNomSqTlN+4kUlBWwGgBcB5Xr8zAfl0HBdn0gifwhEYcQSAy4o59UcBeJllrJMMe/8LhbOJrDxPuj0LS5st7FX955GYBLQVAC6+2au0VZIQP7DizHQhgcQpHIEMAebwgesKqo02dit6zgCwzV+e5eIqev8x9ny33sLGbse2Fi0WGUFg0Ccn4D54MavNnvL0TuVG/xxj1VnJh7MBbMB+YO/PJKD0JeyUOLZsBuleGplY1MB0NqKqOY2z+e+yU+7ii6d1e8WmZeLFRnCGbloLAFeScV2Ar5mAsJ3LL530f+o49p8r2mnAuQJwa1fPNQDpRFgtADqL5CrfB62OiU8f1vD1c/t6cQaJpcGCgLYCwJkAptJmWDADykYN7uNNy6m8YjahevJRTXg1g5C21wD0eqZax854dh3JpSii7P0xMfdKpd5TfiN7Q3BGAdr6AEi1bi8K8hNSqgqFsCefstNUjwqPtS2HqON/aPn2PwQFlnKbGvPpv8NQlaUC1PiJ3gLQ7KnsQH7TP7EnZyVaP2sC1NDBWU5cb3VVySoWtNANVcsxF0Ehw/qLE6YAAURrAeBUHIOBGj5X43EmYLaQRCIe8VUIVK0BUDMAHexW2+e6mGVcYa79XCqsSrpL83/1aC0Aaiag3lWx3n5QBSazMeRSzFw7egARrQaOGvbKLeyWmoGNLz8OVttNxSdn/B90tBYAdsCVRlflCPTTGJnVN5eOq8Qeo2KnFU+rASRXANIJqCNs/Fz8IwIwHugtAJalpgH3qv4We9gefTumf5SpLI51GQMwU0iia1qq8euaBSiVMJAc09V/OqK1ABAGAjEFNKfm/K7qU4uCRkhiyeChDGcAEhE0ml2Vzy4ogSR+ySScIcCr/iGCQnsBYEqunVLb92ovu2JwUsX3nwSPYUbheCyCSqOjBEDXNQAMAqIfQIYA44H2AtDq2BYALQE/MCcAS4Yzx/8oxUXzWaa9YhagNnbKXIWoqwAYygIQxgPtrwRnApj4kdNyfohGwiqxxyiOQPoKFqZTqtfj2J8+Bx1nALxOQGE80F4A2BFzFoBrvv1mByrmEsoPcBIcKlydz9ppwKttlDVNAsLRUiIaUrEAMgQYD0QAOBPQoAD4qxhMAWCW4Ol88tibmft4zMJMRjkadytNtRRYR5hMlSsB7QhAsQLGAe0FgDASkIuC/IQE8yamZ59WAOMCjk0Cko6pYznlyEpAOtYBYHNn42fvL4wPIgBOSHCp6j87TyIeVav76Nw7ing0jFTSznxD8399t+47DVkgMOw8gEwBJowPIgCAmpOnY47Lg/2QjEWUBcBGfmxV4VRUBQ+Va6wE3PAVcxAUOLpi8Y9Ri38K3w8iAM6aAKYH2/YZnhuNulV+4kcew5DhGZUExJ4BoBWgqQGgGv9L1FQRzgG5HM6aAPoAuDTYDzTrpwtJXJhKHXkMYwWuXMiqRs9KQLVGB7rCxj/uSUB1QwRAmacWKvWOigj00zvTrJ/OJZQAHDYT4M4AXJpJq7X/zADENGS6QgsgzNGSaMDYIALg1Jpj3vdynQUg/KwJMFSSj6MKhXAGgJWAGQXInn9zt452R78ZAIVhC+ak5AHUBREAB84AMFFHx8ciHcN18qVjiEQOOgKZMITZgygEzCC8slnzXYcgSHC29JgZU+EVIJfDodMzVbUgztX7gTMAFIDDKgYzcxAdhLQUdkpNrG7V9JwCdJDwn/FDBMCB2X0ZDejXEajM/OzhMwHZJEtfJ5SPwV0DENQik8JkIgLgmQnYLrexutXwFxIcNjBbTGFhOn1gH8f/8zNpJS71Zgettr4OQGE8EQFwUL10lRaAv1x9dGrNFVO4NJc9sK+YS6o6gnQscpaBS48FYZwQAfDOBHQ4E9D1PRPA5b4UAXq5vUMD5gFkpCBnABgBqGsSEGF8EQHwQA99o9X1VbCDs1oDR2B4yAHIKEFu2yo1sbheganxDIAwnogAeKCHnkuD/QbrDFJ+DQSABUTZ+9P1vbnXwIv1qtYzAMJ4IgLggR56JgbZ2G36Oolu1R8mCnWxA4SSygHIOgBMAyYzAMEqqxUERAA8WCaUuf5io+7vJIZY7y6pCn8MlQIvJp0AozY6XXEAurX1hPFBBGDfTABXBXIq0FedAMPAhek0rs7n+n4BZguam0qphs9hhc4RgC60hkQAxgsRgANrAnpq0Y6frD2cCeCqwEtzGTUTYOcLjGMqn1Thxdulhoz/LfpYbD+LjAPGBxGAffD+bLR66jEq7PFZ/JMRgUwTzgrAHP8zHThDgJc3q6r30x1WRdIwF8pYIwJwyDCAjZ+BO35gr8+pv3Qyqsb/jA6kZcD5/6V1EQDC4isyFBovRAD2oVJ31zrYKvlbE0ArgI2f3v98NqEEgKm/6P3nEMBPeHEQsVwBEEtorBi9wL0msJ2yeOfKVsPX59yIwFmnXBgzATH0l+HFrbap/bCXAtnuWuiIM3SsEAE4YiZgbbuuZgJCPmYCZgopXJrNotnuKB8AowrpUNS991dYzLlgqYcwPsgQ4IiZAC4Nbvp0BDIW4PJcFvlMQoUBV1WaMX9TikGFZ6DVoQUgkwDjhFgAh8Aem+HAdAR6o/tOGgKkkzFcns8iFgup4qF7lSbWd2hJnPVlm0zY+7c7jAXgCZGTMg6IBXAIvD+ZGYgpvP0mvbxxMY/Xrk+rIQEdgCubVViiAIMp1rapfAFiFI0HYgEcAvumSq2LLZ91AhgEdH0hr6L/6PGmM3FL5ReQ3s6l0TLRaFlIn1xTVfgeEAE4BLbXvWoLGzv+FgVxGMBy4Xaa8bayAJrtrhi7HmpNU1kBIonjgQjAYViWXcdvh/P3/k6oXfkWqFIASv6yC+lAtWmi3jLFBTAmiA/gmJmAnUrLV0hw//NOElAVACR93UELoCUWwLggAnAEbikv5vM/TSdeqrZUIRCxAIZh799si1k0LogAHIO9kq95qkXse5WWmgIUARiGDkDlAxANGAtEAI6AN2il3vW9JoAw3n233FQLgWQGYBg2floB9upIUYFXjQjAkdjjeDWN5zuIiIuJGmi2pA7AfrpdnldbBKT5v3pEAI7C8QHYdQKs043/z+ACBQ2ek+1yF3u13sQNA8IhZoA2kIwZ6jkIdQ5lGvCkmYBSC41mD5F0ZPQYggoFoCEW7hFslbvYrfRw7QImitlCFPeuxZFPG6g2evj8SQube5Od61EE4Bg4TuVqPiYK5Tr/UWEMgRr/iw1w+Pmpm6g0JssRaBjApZkofvp6GnMFAxu7bSyudyZeAAJgxJwvrBjMNOGj3qw8rFxjCLC/zMI60XCCgSZplWQoZGAqy3LvISTiBmJRox/0NcmIAJy0JqDOsl6jC4CqA1Cx6wBM0P39vdLqmsoPUFVWwGScpGiYqd5DSESD1WSC9decA6zrt60aszX6DMBe41QRhLrAU7m01cbabmdilkonYiHkMxFEo5Pf63sRATgB5vTnqj5z5HRizAFQm5ie7VWxttPBxl5nYnIETuUiKGbCasl3kBABOIFmh9mBuCage6JJz93MALS2XTvDSxRMqs0eStWeShIyCc7SC1NRFDIReApABwIRgJHG9G1sjeAIZK/PGAAOAYTjYcPnEGC3erKwvmoiYQPTOaZ8D6nZgCAhAjACdOqtbDGu3xohfLitjheOh+fq+XoLS5vtsa8VEIsYKKQjiAXMAUiC9xedA+V6B+u7TO55/HGc1uKsAa0A4WS2Sh2sbrfHfnVgPhNBMRdBNGDjfyICMAJMEMoS38fNW6sZAM4Y7MkagFFpd00sb7exU+FswPiKwOXZGGbyUVX9KWiIAIxA083vf4wJwPuXCUBWtqpjfTOPE6bJYUAT3623xrZeQDhs4PJsHMVsJBCx//sJ4J909rQ7phKARvvoBSxs9Jt7DSxvVL7vnzfRMCDo2XoT5Zo/Z+D35YyLR0OYykWRjAWzqQTzrzpj7PX9LWwoP4B19CKgctNeBCT4EtenKw0sb7VGjglg22cY7vcRijtbiCoBYLm3IBLMv+ocYDDQcVV+6QNgBiHOAgijQ+Fk4//zUsO2Akb4DBt+PMqgnPO9fQ3DwGvX0rg4E1NLgYNIQP+ss4eefU4FHiUAphMGXG2IAPil1uzhm+9qeLHZgjnilGAmFUE6wcCc87MCkvEQrl1IqACgoM3/u4gAjEi91VPz+71DhgDc1GhyjXsTrbasATiNM3Bxs4mvn1ftwKARPjOdS6gaDFyld15cKMYwHWDznwT3Lztj2p0eas3OoUErNP8Z/be8cfQQQTgelWDjaQXPVusjBQbNTaUwU0ie29Sc4Zj/CzPxwIX/ehEBGJFO11RBPq3OwZkAmv+M/19cLZ/DJdIDCufSRhOfPixhbbt14oxAIRPD/HRKFWE9r+Cf25dSKgdAUM1/LQSA6q0uoPs4Je46/81DZgK4jxaALAJ6OTjN+vmTMr54VlFDruNIxMK4eiGDYjZ+Lg30zuUULs0lAm3+k1DQGz9NRD7zEVFqcPrvY2qw71YrB8x8FgKt1FsyA/CSUFc3S23838+38fXzMjq9oxdhh8Mh3Lmax7WFLKJn3EgzyTDu38phYSoOI9AtJMACwHbOxRuphL2Ci86ieCyEWOT0fzJjARbXKwfGqL2eiXqji1ZH0oCfRdrwR0tVfPRgE89WakfGXfCaXp7L4s1b05jKn12pYcMA7l7N4O6VNFKJ8Mv0FxNBYAWAVy6bDGM2z2SehrqQmURYeXVP69ThmgDGAzCG3esAbLQZKsxw1lHShggn0eqY+PxJCR//cQur20dnY0ono3jv9Qu4c7WI6EsIu7fxT+VieP9eEZdmk+c6xTguBFYAePG4hvvqXLy/rZiN4tqF5Kmnjrqqp+8M9fS8N1kFaH27JjMAZwTPKYOCPvliC796sI61ncNzMfA63ryUx4fvXMK1+dxLTQkaatlvCO+9VsD92zmkk+GXGi5OCoEUAAo3c7gtTMcwX4z2txdzUdy+nFIBHqcRd4aqciqQc/7uDcltGzt1LMkagDOFfpb13RY+erCOf/73VSxt1tFjwIAHZdUlo/j5/Yv4q3ev4EIxdepeOxIJ4f7tPP7y7VnMTyXUd7faJtoqY1FwCZwAsBegqf/6tSTe+0EW6US4vy8VD+ONG1m8f6+AXCriew6ZNyXThLNgqDs25TYuAlrbljTgZw3PLYcA/+f3a/gfv1nC46UK2irQyhqar5+fTuOXP7uOv37vqooP8GMJGAYX/NDpV8A//HQBd65kEY0Y2Kt28Zs/7eLBt2WUqt2JSV6qXWEQ+wIaSMVDauUWEzfeupjAW7fS6tl7M9BZfGU2gf/8wRwWppL4ZrGKrT17lR9r1nOMf9KCFOYHXN6s4c3bJqKRMNpdO0KwesIaAN6oyXgYqQTXlXtuYctecppNcbtPPXYsnUI2rM5Bv6+y+H8L7Y6FZsdSkXaTLAJrOw189Okqditt/O37l3H/9gwKuTBC4UHvfetyAf/1b36ATCqGj36/iBfrZRW8dVQ8Ae+KcNhQ0YRv353CX70zi9euZdR55JTux59t49efbSMSBv7yRzm8dSuF9Nn5GseGiRcATu1dvxDDB6+lkUmEkE1HMFeIopiNKSXfD2cGbsynMFtI4Ed38ijXe6g3TXz9vIJf/3ETtebxnvw9RwDcmQCuZqvU2koIjv2dYQM/vDmND398CelkBJZl58RXOQYMSwlSJunvclDb7lxO4L/8fErd7KbznaZpKn/F4+U2vnzWRq05wQrQz7XQwm//tKGKtHy3VsPP7i/g6kIO6UQI4TCvaxh3rxaRScWVU/DjB4v44vGW8s/wGvHcuELMa5FKRHBjIYt3XpvC23eLuDgTBywTLzaq+PgPm/jNn7awvtNSksrzGQlZeONmAvHBiDIQTLwAsNOcyUVw/2ZCrdlm4EYoHFYXrmtaCFkm2xfClgHWow2ZJkKhsGps2VRMmRDtLtDpWfjky60T/716q6t6CC76iUbDqufnGoCTZgA4Nr04k8ZfvLWAQi4Gy2SJbPtBMWCfbRiW+h7erO4++8FGbakxcP99z1TWCjPV5NMhmGZPPTgl2TN7ShCabRMPXwRjcRKvJ8X5i6e7SgS+fLqrZgB+ev+img60q/VEcHU+h9liUonAs+U9bOzUlI9mt9JQ5yaT4vLemBNJmMDF2QQSUQONVgcPvtnGb/+0iS+elOwsRY41+HythV9/XkYqAdy6GFXWg71r8scFEy8AvBCbpS5+/7CukjcaIU75hexnI9RfN87XHA7wdWjfdnbmj5ZqKqDnJNhAHy7u4r//61PkMwnlD/j62faJMwD0GSxtVPEvD5aHLQBlBVCabGug34v395vD283Bdve1vW9wnGsBLK53EbTQBFpeXJXJqs2Pl8r4w8MtZf6/eXtWPabyKRUkdOtSHtfmMyqbE4O0ao02ut2eKumViBn28l6LiV5a+Lcvt/Dlkx188WQPi2t1taDLezUptE9XWvjd1zU02wmk4hZ2Sh00WiIArxw22hebHexUevb8vrL67Xl/m0H0nzeBhDrCGJiY7C3pCzgJ9iKPF0vY3GmosSfNS9YCPPlzlhKO1e3aPucjG7PnXf+N/Wy/PeT1YIM99nf2uYdQcFptS/1dQYRCTEGl8/XBtxv4zecruLaQx8J0WgUGMUSYBV0ZzMPpPVpXvV4PzT07ZoO5Gzd361jZquHJUgWrW3Y1p6MCjxib8MVTJi5pIxaxh35bpclf+TnxFgCvFwtN8vF9/XucCuTDD7yxqvWOeghnBy0d+mX4ePh8B4k48/dHkU5E1Ws6hjksZEgvLSQKR7PdVSXfKvWOcvyOGsBVqffUI0hMvAAIwlCcRqOjHoKmcQCCIIyOCIAgaIwIgCBojAiAIGiMCIAgaIwIgCBojAiAIGiMCIAgaIwIgCBojAiAIGiMCIAgaIwIgCBojAiAIGiMCIAgaIwIgCBojAiAIGiMCIAgaIwIgCBojAiAIGiM5AQ8J5j5d7YQwXwx4qlGbAxnJ2Za8iOf7azFziecWobuNsNzrJsDebDv4LGePMnu5zzbX78xhWSct4K9h1l13703j0I23k93zsIbV+az/b+PKdZvX87jw3cvD5JqejMTu9mOnSpFzov+60Hy4/6WweedbfY+93P73w+e+5mUnf1u9mS13QJK9R42dln9Kdh1/k6DUZy6KefkHGCRkvd/kMIv3kzbOeidRhvy1CMwQoP6BGp7//2+7UN1DNzjjjgmxKoIIVU26LAaCHa9BM97I4RiNqFq6sVjEfW+0exhs9RAvdlxGhGLlhiYLdrptu1aBJZKq80iKW59ArY29dpphEO1D9waB0M1D+xaCKrGgWd//z2LoHgqKHmPozANfZ+3RoL63KB2wqPlNj75qom1naNLhemKWADnWLGIFXsuz0ZV+TLV17Jx9ouUhAbFSpyGrxprKNQXg4Eo8LWngffFY9+x/e81+t/vNnr7825xlOFj+OytoZhKRnAtlfP0tG4vO+htefRsIYnpfOJAgxw0zOECJnYDdguYuEVPBpWQBoVP3OOcSkie7e73qepIngpKltUbKoxiP+xyaawZoYrGBKKWz9kiAnCO0BR3H+r9vm39h3ff0LM9FHCbpr3d6b1Z/0h93hkAeC2EocdgWGA/9u3z/L6h3+78x240xr6iJYMfxJKkPCpkWDD7Tcx+puHDbRQn2gXql1j80sE+d7hjD4tsS8P5xfY+59/oD2vcv9+wf1X/9zvfe+AcW0f/jYIIwLnBtsLa8iw8Sn+A+l/f/IYqVMFGY/fQltNDW0OvQyFz0IsbrGloP3t7ercE2sAS8Awj+j3/YOjg3T+wBjyvnc/0W0x/XD2wBIYe2G+eey0BT9kyx4z3mv9D5nq/5z+ktz9k/wGrwWM59K0Cx9JodVhXUXr/wxAL4JzgTffZ4wZWtruDMmVu2TJv+TJj2DHYfz7Mibfvc4d+/rjj+73o0f/ekMMRh5cl2//eaxkMO+TsY/pOucEHPdsOOvUGzkL3+7yOvaOevWXShvezAvR2Scb/hyFOQEHQGIkDEASNEQEQBI0RARAEjREBEASNEQEQBI0RARAEjREBEASNEQEQBI0RARAEjREBEASNEQEQBI0RARAEjREBEASNEQEQBI0RARAEjREBEASNEQEQBI0RARAEjREBEASNEQEQBI0RARAEjREBEASNEQEQBI0RARAEjREBEASNEQEQBI0RARAEjREBEASNEQEQBI0RARAEjREBEASNEQEQBI0RARAEjREBEASNEQEQBI0RARAEjREBEASNEQEQBI0RARAEjREBEASNEQEQBI0RARAEjREBEASNEQEQBI0RARAEjREBEAToy/8Hqx6BA+fB++sAAAAASUVORK5CYII=">
    <span class="badge"><span class="dot"></span>Maintenance in progress</span>
    <h1>We'll be back shortly</h1>
    <p>Miles Capital is temporarily unavailable while we carry out maintenance. This page will reload by itself as soon as we're back.</p>
    <button id="retry" type="button">Try again now</button>
    <div class="status" id="status" aria-live="polite"></div>
  </main>
<script>
  // Check every 30 s; reload once the site answers normally again.
  (function () {
    var EVERY = 30, left = EVERY, timer = null;
    var statusEl = document.getElementById("status");
    var btn = document.getElementById("retry");
    function check() {
      clearTimeout(timer);
      btn.disabled = true;
      statusEl.textContent = "Checking…";
      fetch(location.href, { method: "HEAD", cache: "no-store", credentials: "same-origin" })
        .then(function (r) { if (r.ok) { location.reload(); } else { wait(); } })
        .catch(wait);
    }
    function wait() {
      btn.disabled = false;
      left = EVERY;
      tick();
    }
    function tick() {
      statusEl.textContent = "Checking again in " + left + "s";
      if (left-- <= 0) { check(); return; }
      timer = setTimeout(tick, 1000);
    }
    btn.addEventListener("click", check);
    tick();
  })();
</script>
</body>
</html>
`;
// MAINTENANCE_HTML:END
