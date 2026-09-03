/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright 2026 sabas0ba */

/*
 * saba-sea.js — 海と魚の optional component (saba-sea.css と組で使う)。
 * body の data-sea / data-sea-style / data-fish を読み、背景と帯の DOM を生成して魚を動かす。
 * 外部依存なし。画像は使わず、魚は grid 文字列 (pixel)、文字列 (ascii)、SVG path (線画 / 塗り) から描く。
 * window.sabaSea.setup() で属性の変更を反映できる。
 */
(() => {
  "use strict";

  // ---- 魚の定義。pixel grid は頭が左向き ----
  const PIXEL = {
    saba: { w: 26, h: 10, frames: [[
      "........BBBBBBBBB.........", "......BBSBBSBBSBBBB.......", ".....BSBBSBBSBBSBBBB......", "....BLLBLLBLLBLLBLLBB..F..",
      "...BLELLLLLLLLLLLLLLBBFF..", "..BLLLLLLLLLLLLLLLLLLLFFF.", "...BLLLLLLLLLLLLLLLLBBFF..", "....BLLLLLLLLLLLLLLBB..F..",
      ".....BBLLLLLLLLLLBB.......", ".......BBBBBBBBBB........."], [
      "........BBBBBBBBB.........", "......BBSBBSBBSBBBB.......", ".....BSBBSBBSBBSBBBB......", "....BLLBLLBLLBLLBLLBB.....",
      "...BLELLLLLLLLLLLLLLBBF...", "..BLLLLLLLLLLLLLLLLLLLFFF.", "...BLLLLLLLLLLLLLLLLBBFFF.", "....BLLLLLLLLLLLLLLBB..FF.",
      ".....BBLLLLLLLLLLBB.......", ".......BBBBBBBBBB........."]],
      pal: [{ B: "#2b4a5e", S: "#12242f", L: "#d6e2e8", E: "#101418", F: "#4e7a90" }, { B: "#4f7f99", S: "#213a4a", L: "#c7d9e2", E: "#0a0d10", F: "#6f9fb6" }] },
    kingyo: { w: 26, h: 10, frames: [[
      "........RRRRRRR...........", "......RRRRRRRRRRR....TT...", "....RRWRRRRRRRRRRR..TTT...", "...RREWRRRRRRRRRRR.TTTT...",
      "..RRRRRWWWRRRRRRRRTTTT....", "..RRWWWWWWWWWRRRRRTTT.....", "...RWWWWWWWWWRRRRRTTTT....", "....RWWWWWWWRRRRR..TTTT...",
      "......RRRRRRRRR.....TTT...", "........RRRRR........TT..."], [
      "........RRRRRRR...........", "......RRRRRRRRRRR.........", "....RRWRRRRRRRRRRR........", "...RREWRRRRRRRRRRR..TT....",
      "..RRRRRWWWRRRRRRRRTTTT....", "..RRWWWWWWWWWRRRRRTTTTT...", "...RWWWWWWWWWRRRRRTTTTTT..", "....RWWWWWWWRRRRR.TTTTT...",
      "......RRRRRRRRR....TTTT...", "........RRRRR.......TT...."]],
      pal: [{ R: "#df552f", W: "#fbf3ec", E: "#1a1214", T: "#f29b6e" }, { R: "#ef6b43", W: "#f7e9e0", E: "#1a1214", T: "#f6b08a" }] },
    medaka: { w: 12, h: 5, frames: [["..BBBBBB....", ".BEBBBBBBB.F", "BBBBBBBBBBFF", ".BBBBBBBBB.F", "..BBBBBB...."], ["..BBBBBB....", ".BEBBBBBBB..", "BBBBBBBBBBFF", ".BBBBBBBBBFF", "..BBBBBB...."]],
      pal: [{ B: "#c9a24a", E: "#221a10", F: "#e0c27a" }, { B: "#e2bd63", E: "#221a10", F: "#f0d48f" }] },
    fugu: { w: 18, h: 13, frames: [[
      "....S.SSSS.S......", ".....BBBBBB.......", "...SBBBBBBBBS.....", "..BBBBBBBBBBBB....", ".SBBEBBBBBBBBBS...", ".BBBBBBBBBBBBBBT..", ".BBBBBBBBBBBBBTTT.",
      ".BBBWWWWWWWBBBBT..", ".SBBWWWWWWWWBBS...", "..BBWWWWWWWBBB....", "...SBBBBBBBBS.....", ".....BBBBBB.......", "....S.SSSS.S......"], [
      "....S.SSSS.S......", ".....BBBBBB.......", "...SBBBBBBBBS.....", "..BBBBBBBBBBBB....", ".SBBEBBBBBBBBBS...", ".BBBBBBBBBBBBBB...", ".BBBBBBBBBBBBBTT..",
      ".BBBWWWWWWWBBBBTT.", ".SBBWWWWWWWWBBS.T.", "..BBWWWWWWWBBB....", "...SBBBBBBBBS.....", ".....BBBBBB.......", "....S.SSSS.S......"]],
      pal: [{ B: "#c9a97a", W: "#f3e6cc", S: "#7a6a4a", E: "#1a1410", T: "#a88c5e" }, { B: "#d8b98a", W: "#f6ead2", S: "#8f7d5a", E: "#1a1410", T: "#b89c6e" }] },
    kurage: { w: 12, h: 11, frames: [[
      "...JJJJJJ...", ".JJJJJJJJJJ.", "JJJJJJJJJJJJ", "JJJJJJJJJJJJ", ".JJJJJJJJJJ.", "..J.J..J.J..", "..T.T..T.T..", "..T.T..T.T..", "...T.TT.T...", "...T.TT.T...", "....T..T...."], [
      "...JJJJJJ...", ".JJJJJJJJJJ.", "JJJJJJJJJJJJ", ".JJJJJJJJJJ.", "..JJJJJJJJ..", "..J.J..J.J..", ".T..T..T..T.", ".T..T..T..T.", "..T.T..T.T..", "..T.T..T.T..", "...T....T..."]],
      pal: [{ J: "#b9a6e6", T: "#cbbdee" }, { J: "#a893e0", T: "#bfaeea" }] },
    tai: { w: 26, h: 10, frames: [[
      "........DD.DD.DD..........", "......BBBBBBBBBBBB........", "....BBBBBBBBBBBBBBB.......", "...BBEBBBBBBBBBBBBBB......", "..BBBBBBBBBBBBBBBBBBB..F..",
      ".BBBBBBBBBBBBBBBBBBBBBFF..", ".BLLLLLLLLLLLLLLLLLBBFFF..", "..BLLLLLLLLLLLLLLLBB..F...", "...BLLLLLLLLLLLLLBB.......", ".....BBBBBBBBBBBB........."], [
      "........DD.DD.DD..........", "......BBBBBBBBBBBB........", "....BBBBBBBBBBBBBBB.......", "...BBEBBBBBBBBBBBBBB......", "..BBBBBBBBBBBBBBBBBBB.....",
      ".BBBBBBBBBBBBBBBBBBBBBF...", ".BLLLLLLLLLLLLLLLLLBBFFF..", "..BLLLLLLLLLLLLLLLBB.FFF..", "...BLLLLLLLLLLLLLBB...F...", ".....BBBBBBBBBBBB........."]],
      pal: [{ B: "#e0705f", L: "#f6d9cf", D: "#b2453a", E: "#1a1010", F: "#c85a4c" }, { B: "#ee7f6c", L: "#f8e2d9", D: "#c4564a", E: "#1a1010", F: "#d66c5c" }] },
    ika: { w: 26, h: 8, frames: [[
      "....MMMMMMMMMMMM..........", "..MMMMMMMMMMMMMMMM.T......", ".MMMMMMMMMMMMMMMMM.TTTTT..", "MMMMMMMMMMMMMEMMMMTTTTTTT.",
      "MMMMMMMMMMMMMMMMMMTTTTTTTT", ".MMMMMMMMMMMMMMMMMTTTTTTT.", "..MMMMMMMMMMMMMMMM.TTTTT..", "....MMMMMMMMMMMM...T......"], [
      "....MMMMMMMMMMMM..........", "..MMMMMMMMMMMMMMMM........", ".MMMMMMMMMMMMMMMMM.TTTT...", "MMMMMMMMMMMMMEMMMMTTTTTTT.",
      "MMMMMMMMMMMMMMMMMMTTTTTTTT", ".MMMMMMMMMMMMMMMMMTTTTTTT.", "..MMMMMMMMMMMMMMMM.TTTT...", "....MMMMMMMMMMMM.........."]],
      pal: [{ M: "#e9d7e3", T: "#d9c2d4", E: "#2a1a26" }, { M: "#e4cddd", T: "#cdb3c6", E: "#2a1a26" }] },
  };
  // ascii: [左向き frame0, frame1, 右向き frame0, frame1]
  const ASCII = {
    saba: ["<°)))><", "<°)))>≺", "><(((°>", "≻<(((°>"],
    kingyo: ["<o))))>{{", "<o))))>{[", "}}<((((o>", "]}<((((o>"],
    medaka: ["<°)<", "<°)≺", ">(°>", ">(°≻"],
    fugu: ["*<(°o°)>*", "*<(°o°)>*", "*<(°o°)>*", "*<(°o°)>*"],
    kurage: [" (___) \n /|||\\ ", " (___) \n \\|||/ ", " (___) \n /|||\\ ", " (___) \n \\|||/ "],
    tai: ["<°]]]]]><", "<°]]]]]>≺", "><[[[[[°>", "≻<[[[[[°>"],
    ika: ["<:=======", "<:======-", "=======:>", "-======:>"],
  };
  // SVG (viewBox 0 0 64 32、頭は左向き)。線画と塗りで共有する
  const VEC = {
    saba: { body: "M4 16Q20 3 44 8Q52 10 56 16Q52 22 44 24Q20 29 4 16Z", tail: "M54 16L63 5L61 16L63 27Z", eye: [12, 14, 2], extra: "M18 8q8-2 16 0M22 12q8-2 16 0M20 10q8 1 14 0", fill: "#6d8fa6", fill2: "#2b4a5e" },
    kingyo: { body: "M6 16Q16 4 30 6Q44 8 44 16Q44 24 30 26Q16 28 6 16Z", tail: "M42 16Q52 4 63 2Q56 12 58 16Q56 20 63 30Q52 28 42 16Z", eye: [14, 14, 2.5], extra: "M22 7Q28 0 34 6", fill: "#e8613a", fill2: "#f7b58f" },
    medaka: { body: "M12 16Q22 10 38 12Q46 14 48 16Q46 18 38 20Q22 22 12 16Z", tail: "M47 16L55 11L55 21Z", eye: [18, 15, 1.5], extra: "", fill: "#d9b45a", fill2: "#e9cf85" },
    fugu: { body: "M8 16Q10 4 30 4Q50 4 52 16Q50 28 30 28Q10 28 8 16Z", tail: "M51 16L61 10L61 22Z", eye: [18, 12, 2.5], extra: "M14 6l-3-4M30 3l0-4M46 6l3-4M14 26l-3 4M30 29l0 4M46 26l3 4M24 20q6 3 12 0", fill: "#c9a97a", fill2: "#f3e6cc" },
    kurage: { body: "M12 18Q12 3 32 3Q52 3 52 18Z", tail: "", eye: [0, 0, 0], extra: "M16 18q3 8-1 13M24 18q2 8 0 13M32 18q-2 8 0 13M40 18q-2 8 0 13M48 18q-3 8 1 13", fill: "#b9a6e6", fill2: "#d3c6f0" },
    tai: { body: "M6 16Q14 2 34 4Q50 6 54 16Q50 26 34 28Q14 30 6 16Z", tail: "M52 16L63 6L61 16L63 26Z", eye: [14, 13, 2.5], extra: "M16 6L26 0L42 2L48 8", fill: "#e0705f", fill2: "#f6d9cf" },
    ika: { body: "M2 16Q8 6 30 8L42 8Q40 16 42 24L30 24Q8 26 2 16Z", tail: "", eye: [36, 14, 2.5], extra: "M42 12q10-2 18-6M42 15q12 0 20-2M42 18q12 0 20 2M42 21q10 2 18 6M2 16Q10 2 26 8M2 16Q10 30 26 24", fill: "#e9d7e3", fill2: "#f7eef4" },
  };
  // 種ごとの動き: 速さ、上下の漂い、匹数、後ろ向きに泳ぐか、固有の反応
  const MOVE = {
    saba: { speed: 1, bob: 0, count: 1, back: false, react: "leap" },
    kingyo: { speed: 0.65, bob: 0.15, count: 1, back: false, react: "leap" },
    medaka: { speed: 1.4, bob: 0.2, count: 3, back: false, react: "leap" },
    fugu: { speed: 0.4, bob: 0.1, count: 1, back: false, react: "puff" },
    kurage: { speed: 0.25, bob: 0.6, count: 2, back: false, react: "pulse" },
    tai: { speed: 0.8, bob: 0.05, count: 1, back: false, react: "leap" },
    ika: { speed: 0.7, bob: 0.1, count: 1, back: true, react: "ink" },
  };
  const RENDER = { pixel: "pixel", ascii: "ascii", mono: "line", modern: "flat", calm: "line", pop: "flat", blueprint: "line" };

  const body = document.body;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDark = () => {
    const t = document.documentElement.dataset.theme;
    return t === "dark" || (t !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  let tank = null;
  let fishes = [];
  let last = 0;
  let running = false;

  function svgMarkup(kind, mode) {
    const v = VEC[kind];
    const [ex, ey, er] = v.eye;
    const eye = er ? `<circle cx="${ex}" cy="${ey}" r="${er}" fill="${mode === "line" ? "currentColor" : "#1a1416"}"/>` : "";
    if (mode === "line") {
      return `<svg viewBox="0 0 64 32" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${v.body}"/><path class="tail" d="${v.tail}"/><path d="${v.extra}"/></g>${eye}</svg>`;
    }
    const highlight = er ? `<circle cx="${ex - 0.8}" cy="${ey - 0.8}" r="${er * 0.35}" fill="#fff"/>` : "";
    return `<svg viewBox="0 0 64 32" aria-hidden="true"><path class="tail" d="${v.tail}" fill="${v.fill2}"/><path d="${v.body}" fill="${v.fill}"/><path d="${v.extra}" fill="none" stroke="${v.fill2}" stroke-width="1.6" stroke-linecap="round"/>${eye}${highlight}</svg>`;
  }

  function renderMode() {
    return RENDER[body.dataset.seaStyle] || "pixel";
  }

  function draw(f) {
    if (f.canvas) {
      const p = PIXEL[f.kind];
      const pal = p.pal[isDark() ? 1 : 0];
      const c = f.canvas.getContext("2d");
      c.clearRect(0, 0, p.w, p.h);
      p.frames[f.frame].forEach((row, y) => {
        [...row].forEach((ch, x) => {
          if (pal[ch]) { c.fillStyle = pal[ch]; c.fillRect(x, y, 1, 1); }
        });
      });
    } else if (f.pre) {
      f.pre.textContent = ASCII[f.kind][(f.dir > 0 ? 2 : 0) + f.frame];
    }
  }

  function makeFish(kind, i) {
    const mv = MOVE[kind];
    const el = document.createElement("button");
    el.type = "button";
    el.className = "saba-fish";
    el.tabIndex = -1;
    el.setAttribute("aria-hidden", "true");
    const mode = renderMode();
    let canvas = null;
    let pre = null;
    if (mode === "pixel") {
      const p = PIXEL[kind];
      canvas = document.createElement("canvas");
      canvas.width = p.w; canvas.height = p.h;
      const scale = p.w > 20 ? 4 : 3;
      canvas.style.width = p.w * scale + "px";
      canvas.style.height = p.h * scale + "px";
      el.appendChild(canvas);
    } else if (mode === "ascii") {
      pre = document.createElement("pre");
      el.appendChild(pre);
    } else {
      el.innerHTML = svgMarkup(kind, mode);
    }
    tank.appendChild(el);
    const f = { el, canvas, pre, kind, mv, x: 60 + i * 90, y: i * 12, dir: 1, frame: 0, t: i * 300, rest: 0, dash: 0, phase: i * 2 };
    el.addEventListener("click", () => react(f, true));
    el.addEventListener("mouseenter", () => { f.rest = performance.now() + 800; });
    draw(f);
    return f;
  }

  const width = (f) => f.el.offsetWidth || 60;
  const speedFactor = () => parseFloat(getComputedStyle(body).getPropertyValue("--saba-sea-speed")) || 1;

  function spawn(className, left, extra) {
    const s = document.createElement("span");
    s.className = className;
    s.style.left = left + "px";
    if (extra) extra(s);
    tank.appendChild(s);
    return s;
  }
  function bubbles(x, n) {
    for (let i = 0; i < n; i++) {
      const b = spawn("saba-tank__bubble", x + Math.random() * 40, (s) => { s.style.animationDelay = i * 90 + "ms"; });
      setTimeout(() => b.remove(), 1900);
    }
  }
  function flash(f, cls, ms) {
    f.el.classList.remove(cls);
    void f.el.offsetWidth;
    f.el.classList.add(cls);
    setTimeout(() => f.el.classList.remove(cls), ms);
  }
  function leap(f) {
    if (reducedMotion) return;
    flash(f, "is-jump", 1000);
    for (let i = 0; i < 5; i++) {
      const d = spawn("saba-tank__drop", f.x + width(f) / 2, (s) => {
        s.style.setProperty("--dx", (Math.random() - 0.5) * 60 + "px");
        s.style.animationDelay = i * 40 + 300 + "ms";
      });
      setTimeout(() => d.remove(), 1200);
    }
  }
  function special(f) {
    if (f.mv.react === "puff") { flash(f, "is-puff", 1300); f.rest = performance.now() + 1300; return true; }
    if (f.mv.react === "pulse") { flash(f, "is-pulse", 900); f.y = Math.max(-10, f.y - 10); setTimeout(() => { f.y += 10; }, 900); return true; }
    if (f.mv.react === "ink") {
      const b = spawn("saba-tank__ink", f.x + (f.dir > 0 ? -10 : width(f) - 30), (s) => { s.style.top = "1.4rem"; });
      setTimeout(() => b.remove(), 1700);
      f.dir = -f.dir; f.dash = performance.now() + 700;
      return true;
    }
    return false;
  }
  // 反応はランダム: 飛び出し / dash と気泡 / 向きを変える。固有の反応を持つ種はそれを優先する
  function react(f, strong) {
    if (reducedMotion) { f.dir = -f.dir; return; }
    const r = Math.random();
    if (f.mv.react !== "leap" && (strong || r < 0.5)) { special(f); return; }
    if (r < 0.35 || (strong && r < 0.5)) leap(f);
    else if (r < 0.7) { f.dir = -f.dir; f.dash = performance.now() + 700; bubbles(f.x + 20, 4); }
    else { f.dir = -f.dir; f.rest = performance.now() + 500; }
  }

  function step(now) {
    if (!running) return;
    const dt = Math.min(32, now - last);
    last = now;
    const sp = speedFactor();
    for (const f of fishes) {
      if (!reducedMotion && now > f.rest) {
        const v = 0.9 * f.mv.speed * sp * (f.dash > now ? 4 : 1);
        f.x += v * f.dir * dt / 16;
        f.t += dt;
        const limit = tank.clientWidth - width(f);
        if (f.x > limit) { f.x = limit; f.dir = -1; }
        if (f.x < 0) { f.x = 0; f.dir = 1; }
        const frame = Math.floor(f.t / (f.dash > now ? 90 : 260)) % 2;
        if (frame !== f.frame) { f.frame = frame; draw(f); }
        if (Math.random() < 0.0015) f.rest = now + 800 + Math.random() * 1500;
        if (Math.random() < 0.0004 && f.mv.react === "leap") leap(f);
      }
      const bob = Math.sin(now / 900 + f.phase) * f.mv.bob * 14;
      // 頭が左向きの sprite なので右へ進むときに反転する。イカは後ろ向きに泳ぐので逆。ascii は文字列を差し替えるので反転しない
      const face = f.pre ? 1 : ((f.dir > 0) !== f.mv.back ? -1 : 1);
      f.el.style.setProperty("--x", f.x + "px");
      f.el.style.setProperty("--face", face);
      f.el.style.top = 1.2 + (f.y + bob) / 16 + "rem";
    }
    requestAnimationFrame(step);
  }

  let lastHover = 0;
  function onHover(e) {
    if (performance.now() - lastHover < 1200 || !fishes.length) return;
    lastHover = performance.now();
    const f = fishes[Math.floor(Math.random() * fishes.length)];
    const px = e.clientX - tank.getBoundingClientRect().left;
    // 近い魚は驚き、遠い魚は pointer の方を向く
    if (Math.abs(px - f.x - width(f) / 2) < 120) react(f, false);
    else f.dir = px > f.x ? 1 : -1;
  }
  function onTap(e) {
    if (e.target.closest && e.target.closest(".saba-fish")) return;
    const f = fishes[Math.floor(Math.random() * fishes.length)];
    if (f) react(f, true);
  }

  function ensureDom() {
    if (!document.querySelector(".saba-sea-bg")) {
      const bg = document.createElement("div");
      bg.className = "saba-sea-bg";
      bg.setAttribute("aria-hidden", "true");
      body.prepend(bg);
    }
    if (!tank) {
      tank = document.createElement("div");
      tank.className = "saba-tank";
      tank.setAttribute("aria-hidden", "true");
      tank.innerHTML = '<div class="saba-tank__surface"></div><i class="saba-tank__weed"></i><i class="saba-tank__weed"></i><i class="saba-tank__weed"></i>';
      body.appendChild(tank);
      tank.addEventListener("mousemove", onHover, { passive: true });
      tank.addEventListener("touchstart", () => { const f = fishes[Math.floor(Math.random() * fishes.length)]; if (f) react(f, true); }, { passive: true });
      tank.addEventListener("click", onTap);
    }
  }

  function setup() {
    if (!body.dataset.sea) { running = false; return; }
    ensureDom();
    tank.querySelectorAll(".saba-fish").forEach((e) => e.remove());
    fishes = [];
    const kind = body.dataset.fish || "none";
    if (kind !== "none" && MOVE[kind]) {
      for (let i = 0; i < MOVE[kind].count; i++) fishes.push(makeFish(kind, i));
    }
    if (!running) { running = true; requestAnimationFrame(step); }
  }
  const redraw = () => fishes.forEach(draw);

  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", redraw);
  new MutationObserver(redraw).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  window.sabaSea = { setup, redraw };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup, { once: true });
  else setup();
})();
