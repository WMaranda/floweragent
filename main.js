/* =========================================================
   main.js — wires Bloom.html together (+ Tweaks)
   ========================================================= */

/* ---- base palette (the "Blush" mood) ---- */
const PALETTES = {
  blush:  { o1:"#F6D8E7", o2:"#CE6F9C", i1:"#FBE7F1", i2:"#E7A3C6", core:"#F4C24E" },
  lilac:  { o1:"#E7DBF3", o2:"#9B7FC9", i1:"#F2EAF9", i2:"#C2A8E0", core:"#F2C24E" },
  peach:  { o1:"#FBE2CF", o2:"#E08A5B", i1:"#FDEEE0", i2:"#F0B488", core:"#F2C24E" },
  butter: { o1:"#FBEFC9", o2:"#E6B23C", i1:"#FDF6E2", i2:"#F2D275", core:"#E89A2B" },
  coral:  { o1:"#F9D6D2", o2:"#D96A66", i1:"#FCE8E6", i2:"#EFA09B", core:"#F4C24E" },
};

/* ---- MOODS: expressive whole-page palettes + atmosphere ---- */
const MOODS = {
  blush: {
    vars: { "--glow-1":"rgba(231,163,198,0.20)", "--glow-2":"rgba(94,122,87,0.16)",
            "--digital":"#4FA98C", "--digital-deep":"#2F7A63", "--digital-soft":"#BDE5D6",
            "--blush":"#E7A3C6", "--blush-deep":"#CE6F9C", "--blush-pale":"#F6D8E7" },
    palettes: PALETTES,
  },
  twilight: {
    vars: { "--glow-1":"rgba(150,120,200,0.22)", "--glow-2":"rgba(70,100,150,0.16)",
            "--digital":"#6E8FC9", "--digital-deep":"#46639C", "--digital-soft":"#CCD7EE",
            "--blush":"#C79BD0", "--blush-deep":"#9266A0", "--blush-pale":"#E6D6EC" },
    palettes: {
      blush:  { o1:"#E7D2EA", o2:"#9A6BA0", i1:"#F3E6F4", i2:"#C79CCB", core:"#D9A9C6" },
      lilac:  { o1:"#DCD8F2", o2:"#6E64B6", i1:"#ECE9F9", i2:"#A99FD9", core:"#BBA9E0" },
      peach:  { o1:"#D9D2E6", o2:"#7C6B95", i1:"#EAE4F0", i2:"#AA9BC0", core:"#C2A9D2" },
      coral:  { o1:"#E3C9D6", o2:"#94607C", i1:"#F0E1E8", i2:"#C295AA", core:"#CE91B0" },
      butter: { o1:"#E0DAE6", o2:"#928BA8", i1:"#EFEBF2", i2:"#BBB2CE", core:"#D9C0A0" },
    },
  },
  wildflower: {
    vars: { "--glow-1":"rgba(231,140,90,0.20)", "--glow-2":"rgba(209,79,138,0.16)",
            "--digital":"#4FA98C", "--digital-deep":"#2F7A63", "--digital-soft":"#BDE5D6",
            "--blush":"#ED7CA8", "--blush-deep":"#D14F8A", "--blush-pale":"#F9CFE0" },
    palettes: {
      blush:  { o1:"#F9CFE0", o2:"#D14F8A", i1:"#FDE4EF", i2:"#EE93BC", core:"#F4B83C" },
      lilac:  { o1:"#E7D3F5", o2:"#8E5FC6", i1:"#F3E7FB", i2:"#BD93E0", core:"#F2B83C" },
      peach:  { o1:"#FBD9BC", o2:"#E0743A", i1:"#FDEBDB", i2:"#F0A471", core:"#EE9A2B" },
      coral:  { o1:"#F9C9C3", o2:"#D8504A", i1:"#FCE0DD", i2:"#EE8E88", core:"#F4B83C" },
      butter: { o1:"#FBEBB0", o2:"#E5A82A", i1:"#FDF4D6", i2:"#F2C957", core:"#E0901F" },
    },
  },
  sage: {
    vars: { "--glow-1":"rgba(110,138,94,0.22)", "--glow-2":"rgba(94,130,115,0.16)",
            "--digital":"#5E9E7E", "--digital-deep":"#3E7458", "--digital-soft":"#C7E0D0",
            "--blush":"#9DB492", "--blush-deep":"#6E8A5E", "--blush-pale":"#DCE6CF" },
    palettes: {
      blush:  { o1:"#DCE6CF", o2:"#6E8A5E", i1:"#EAF0E0", i2:"#A7BE91", core:"#E2C77A" },
      lilac:  { o1:"#D6E4D9", o2:"#5E8273", i1:"#E7F0E9", i2:"#97B7A6", core:"#DFC783" },
      peach:  { o1:"#E4E6CC", o2:"#8A8B4F", i1:"#F0F1DF", i2:"#BFC089", core:"#DDBB6E" },
      coral:  { o1:"#D8E2C8", o2:"#62804A", i1:"#E9EFDD", i2:"#9DB680", core:"#E0C57A" },
      butter: { o1:"#E2EAD2", o2:"#7C9559", i1:"#EFF3E6", i2:"#B2C795", core:"#D9BE74" },
    },
  },
};

/* ---- MOTION: calm <-> lively pacing ---- */
const MOTION = {
  serene: { breathe: 10,  petal: "0.85s", orbit: "100s", phone: "9s" },
  gentle: { breathe: 7,   petal: "0.5s",  orbit: "60s",  phone: "6s" },
  lively: { breathe: 4.5, petal: "0.32s", orbit: "38s",  phone: "4s" },
};

const STATE_OPEN = { open: 1.0, half: 0.5, fold: 0.24, closed: 0.05 };

/* ---- current tweak state (seeded from persisted defaults) ---- */
const DEF = Object.assign({ mood: "blush", bloom: "lotus", motion: "gentle" }, window.TWEAKS || {});
const TW = { mood: DEF.mood, bloom: DEF.bloom, motion: DEF.motion };
function pal(name) { return (MOODS[TW.mood] || MOODS.blush).palettes[name] || PALETTES[name]; }

/* =========================================================
   Flower slot registry — lets us rebuild every flower when a
   tweak changes, without rebuilding the surrounding DOM.
   ========================================================= */
const slots = [];
function flowerInto(host, palette, openness, opts = {}) {
  const s = Object.assign({ host, palette, openness }, opts);
  slots.push(s);
  renderSlot(s);
  return s;
}
function renderSlot(s) {
  [...s.host.querySelectorAll(".flower-svg")].forEach((n) => n.remove());
  const f = buildFlower({ palette: pal(s.palette), openness: s.openness });
  s.host.appendChild(f);
  s.ref = f;
  if (s.onRender) s.onRender(s, f);
  return f;
}

/* ---- nav mark ---- */
flowerInto(document.getElementById("navMark"), "blush", 1);

/* ---- hero flower (idle, slowly opens on load) ---- */
const heroSlot = flowerInto(document.getElementById("heroFlower"), "blush", 0.2);
setTimeout(() => { heroSlot.openness = 1; heroSlot.ref.__setOpenness(1); }, 350);

/* ---- mini flowers in features + closing ---- */
document.querySelectorAll(".mini-flower").forEach((el) => {
  const st = el.dataset.mini || "open";
  if (st === "lock") {
    el.classList.add("mini-lock");
    el.innerHTML = `
      <svg class="mini-phone" viewBox="0 0 120 210" aria-hidden="true">
        <defs>
          <linearGradient id="phfade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#233127" stop-opacity="0"/>
            <stop offset="42%" stop-color="#233127" stop-opacity="0.22"/>
            <stop offset="100%" stop-color="#233127" stop-opacity="0.5"/>
          </linearGradient>
        </defs>
        <rect x="18" y="8" width="84" height="194" rx="20" fill="url(#phfade)"/>
        <rect x="46" y="24" width="28" height="6" rx="3" fill="#233127" opacity="0.18"/>
      </svg>`;
    flowerInto(el, "blush", STATE_OPEN.closed);
    return;
  }
  if (st === "meadow") {
    el.classList.add("mini-meadow");
    const cluster = [
      { p: "lilac", o: STATE_OPEN.fold, s: 42, x: 0,  y: 30, z: 1 },
      { p: "blush", o: STATE_OPEN.open, s: 58, x: 26, y: 4,  z: 3 },
      { p: "peach", o: STATE_OPEN.half, s: 44, x: 64, y: 26, z: 2 },
    ];
    cluster.forEach((c) => {
      const stem = document.createElement("span");
      stem.className = "mm-stem";
      stem.style.cssText = `left:${c.x}px;top:${c.y}px;width:${c.s}px;height:${c.s}px;z-index:${c.z}`;
      el.appendChild(stem);
      flowerInto(stem, c.p, c.o);
    });
    return;
  }
  flowerInto(el, "blush", STATE_OPEN[st]);
});

/* ============ TRY: battery <-> flower ============ */
const demoSlot = flowerInto(document.getElementById("demoFlower"), "blush", 1);
let demoF = demoSlot.ref;
const battery = document.getElementById("battery");
const els = {
  pct: document.getElementById("batteryPct"),
  name: document.getElementById("tryStateName"),
  sub: document.getElementById("tryStateSub"),
  phone: document.getElementById("roPhone"),
  phoneSub: document.getElementById("roPhoneSub"),
  phoneIcon: document.getElementById("roPhoneIcon"),
  notif: document.getElementById("roNotif"),
  notifSub: document.getElementById("roNotifSub"),
  notifIcon: document.getElementById("roNotifIcon"),
  timerRow: document.getElementById("timerRow"),
  whitelistRow: document.getElementById("whitelistRow"),
  timer: document.getElementById("roTimer"),
  timerSub: document.getElementById("roTimerSub"),
  timerIcon: document.getElementById("roTimerIcon"),
  white: document.getElementById("roWhite"),
  whiteSub: document.getElementById("roWhiteSub"),
  whiteIcon: document.getElementById("roWhiteIcon"),
};

function renderBattery(v) {
  v = +v;
  demoSlot.openness = v / 100;
  demoF.__setOpenness(v / 100);
  els.pct.textContent = v + "%";
  battery.style.setProperty("--fill", v + "%");

  let name, sub, nameColor, phone, phoneSub, phoneIcon, notif, notifSub, notifIcon, showQuiet;
  if (v >= 66) {
    name = "Open"; sub = "You're available for people"; nameColor = "var(--blush-deep)";
    phone = "Phone unlocked"; phoneSub = "Resting in the stand, within reach"; phoneIcon = "";
    notif = "Notifications on"; notifSub = "Messages come through as usual"; notifIcon = "";
    showQuiet = false;
  } else if (v >= 33) {
    name = "Half-open"; sub = "Selective — gentle, slower replies"; nameColor = "var(--ink)";
    phone = "Phone resting in the stand"; phoneSub = "There if you need it, out of the way"; phoneIcon = "";
    notif = "Notifications softened"; notifSub = "Batched and delivered quietly"; notifIcon = "teal";
    showQuiet = false;
  } else {
    name = "Folded"; sub = "You're resting — the meadow understands"; nameColor = "var(--moss)";
    phone = "Phone locked in the flower"; phoneSub = "A physical pause from the screen"; phoneIcon = "teal";
    notif = "Notifications muted"; notifSub = "Quiet for the timer you set below"; notifIcon = "warn";
    showQuiet = true;
  }
  els.name.textContent = name; els.name.style.color = nameColor;
  els.sub.textContent = sub;
  els.phone.textContent = phone; els.phoneSub.textContent = phoneSub;
  els.phoneIcon.className = "ro-icon " + phoneIcon;
  els.notif.textContent = notif; els.notifSub.textContent = notifSub;
  els.notifIcon.className = "ro-icon " + notifIcon;

  els.timerRow.classList.toggle("row-muted", !showQuiet);
  els.whitelistRow.classList.toggle("row-muted", !showQuiet);
  if (showQuiet) {
    els.timerIcon.className = "ro-icon teal";
    els.timer.textContent = "Unreachable for";
    els.timerSub.textContent = "Petals reopen automatically when it ends";
    els.whiteIcon.className = "ro-icon teal";
    els.white.textContent = "Emergency contacts can still reach you";
    els.whiteSub.textContent = "2 people whitelisted · Mum, Sam";
  } else {
    els.timerIcon.className = "ro-icon";
    els.timer.textContent = "No quiet timer running";
    els.timerSub.textContent = "Fold the petals to set one";
    els.whiteIcon.className = "ro-icon";
    els.white.textContent = "Emergency whitelist ready";
    els.whiteSub.textContent = "2 people · Mum, Sam — used only when you fold";
  }
}

battery.addEventListener("input", (e) => renderBattery(e.target.value));
document.querySelectorAll(".chip-btn").forEach((b) => {
  b.addEventListener("click", () => {
    const target = +b.dataset.set;
    battery.value = target;
    renderBattery(target);
  });
});
document.querySelectorAll("#timerPick button").forEach((b) => {
  b.addEventListener("click", () => {
    document.querySelectorAll("#timerPick button").forEach((x) => x.classList.remove("on"));
    b.classList.add("on");
  });
});
renderBattery(100);

/* ============ MEADOW ============ */
const FRIENDS = [
  { name: "Maja",  palette: "blush",  state: "open",   msg: "Petals wide open. Happy to chat, study together, or just hang.", meta: "opened 40 min ago" },
  { name: "Theo",  palette: "lilac",  state: "fold",   msg: "Winding down for the night. Quiet for the next hour or so.", meta: "folding · 1h timer" },
  { name: "Noor",  palette: "peach",  state: "half",   msg: "Half-open. Around, but low on energy — keep it light.", meta: "selective" },
  { name: "Ravi",  palette: "coral",  state: "open",   msg: "Open and looking for company this evening.", meta: "opened 12 min ago" },
  { name: "Lena",  palette: "butter", state: "closed", msg: "Resting. On 'me time' — will reach out when she's ready.", meta: "me time · 2h left" },
  { name: "Sam",   palette: "blush",  state: "half",   msg: "Petals half-folded. Slow replies today, nothing personal.", meta: "selective" },
  { name: "Iris",  palette: "lilac",  state: "open",   msg: "Bright and open. Good time to make plans.", meta: "opened 5 min ago" },
  { name: "Kai",   palette: "peach",  state: "fold",   msg: "Just folded in. Notifications muted for a short while.", meta: "folding · 2h timer" },
  { name: "Mira",  palette: "coral",  state: "closed", msg: "Closed and recharging after a heavy day.", meta: "resting" },
  { name: "Otto",  palette: "butter", state: "open",   msg: "Open for a spontaneous coffee or call.", meta: "opened 1 h ago" },
];
const STATE_LABEL = { open: "open", half: "selective", fold: "winding down", closed: "resting" };
const field = document.getElementById("meadowField");
FRIENDS.forEach((fr, i) => {
  const cell = document.createElement("div");
  cell.className = "meadow-cell";
  const holder = document.createElement("div");
  holder.className = "mf";
  cell.appendChild(holder);
  const nm = document.createElement("div");
  nm.className = "meadow-name"; nm.textContent = fr.name;
  const stt = document.createElement("div");
  stt.className = "meadow-status"; stt.textContent = STATE_LABEL[fr.state];
  const tip = document.createElement("div");
  tip.className = "meadow-tip";
  tip.innerHTML = `<b>${fr.name}</b>${fr.msg}<div class="t-meta">${fr.meta}</div>`;
  cell.append(nm, stt, tip);
  field.appendChild(cell);
  flowerInto(holder, fr.palette, STATE_OPEN[fr.state], {
    i,
    onRender: (s, f) => {
      const base = MOTION[TW.motion].breathe - 1;
      f.style.animation = `breathe ${base + (s.i % 4)}s ease-in-out ${s.i * 0.3}s infinite`;
    },
  });
});

/* ============ SCENARIOS ============ */
const SCENARIOS = [
  {
    state: "closed", palette: "lilac", tag: "Petals folded",
    name: "Tini", role: "University student",
    quote: "I just need to be quiet for a while - without having to explain it.",
    context: "Home after a long day of group work and constant conversation. Socially drained, and with no energy to message anyone back.",
    flower: "She rests her phone in the stand and the flower slowly closes its petals. Her close friends see she needs rest - no message or social-media update required.",
    feel: "Calming, non-judgmental, and far less stressful than replying.",
  },
  {
    state: "open", palette: "coral", tag: "Petals open",
    name: "Wojciech", role: "Studies from home",
    quote: "I've got energy tonight. I'd love company, just not a dozen separate chats.",
    context: "A whole day spent studying alone. By evening he feels energetic and open to people, without wanting to check apps or text everyone individually.",
    flower: "He places his phone in the stand and opens the petals to an active, available state. Friends in the meadow can see he's up for studying together or something spontaneous.",
    feel: "Natural, playful, socially light - far less demanding than texting.",
  },
  {
    state: "fold", palette: "blush", tag: "Me time · 2h",
    name: "Elsa", role: "Full-time work · new to meditation",
    quote: "Every buzz pulls me back in. I need a real pause before I can be there for anyone.",
    context: "Exhausted after work and wanting to meditate, but messages keep popping up and the constant glancing leaves her stressed and overwhelmed.",
    flower: "She sets 'me time' for two hours. The flower closes, then slowly reopens across the window. Friends read the state and hold off, knowing she'll reach out when she's ready.",
    feel: "Subtle and reflective rather than controlling. Grounding, never intrusive.",
  },
  {
    state: "closed", palette: "peach", tag: "Petals folded",
    name: "Julian", role: "Quietly carries a lot",
    quote: "Some days I can't find the words for how drained I am, and I worry about letting people down.",
    context: "Often struggles to tell friends about emotional exhaustion, afraid of disappointing them by going quiet or saying the wrong thing.",
    flower: "He rests his phone and folds the petals. The flower communicates his reduced social energy on its own - friends interpret the state passively and with empathy.",
    feel: "Emotionally safe. Understanding without confrontation, and far less pressure.",
  },
];
const TAG_TONE = {
  closed: { bg: "rgba(94,122,87,0.14)", fg: "var(--moss-deep)" },
  open:   { bg: "var(--blush-pale)",   fg: "var(--blush-deep)" },
  fold:   { bg: "rgba(79,169,140,0.16)", fg: "var(--digital-deep)" },
  half:   { bg: "var(--blush-pale)",   fg: "var(--blush-deep)" },
};
const scnGrid = document.getElementById("scnGrid");
SCENARIOS.forEach((s, i) => {
  const col = document.createElement("article");
  col.className = "scn-col reveal";
  col.style.transitionDelay = (i * 0.06) + "s";
  const tone = TAG_TONE[s.state];
  col.innerHTML = `
    <div class="scn-flower"></div>
    <div class="scn-persona">
      <h3 class="scn-name">${s.name}</h3>
      <span class="scn-role">${s.role}</span>
    </div>
    <span class="scn-state-tag" style="background:${tone.bg};color:${tone.fg}">${s.tag}</span>
    <p class="scn-quote">${s.quote}</p>
    <div class="scn-block"><span class="scn-label">The situation</span><p>${s.context}</p></div>
    <div class="scn-block"><span class="scn-label">What Bloom does</span><p>${s.flower}</p></div>
    <div class="scn-block scn-feel"><span class="scn-label">How it should feel</span><p>${s.feel}</p></div>`;
  scnGrid.appendChild(col);
  flowerInto(col.querySelector(".scn-flower"), s.palette, STATE_OPEN[s.state]);
});

/* ============ TWEAKS ============ */
function applyMoodAndMotion() {
  const root = document.documentElement.style;
  const m = MOODS[TW.mood] || MOODS.blush;
  Object.entries(m.vars).forEach(([k, v]) => root.setProperty(k, v));
  const mo = MOTION[TW.motion] || MOTION.gentle;
  root.setProperty("--breathe-dur", mo.breathe + "s");
  root.setProperty("--petal-dur", mo.petal);
  root.setProperty("--orbit-dur", mo.orbit);
  root.setProperty("--phone-dur", mo.phone);
}
function applyTweaks() {
  applyMoodAndMotion();
  setFlowerForm(TW.bloom);
  slots.forEach(renderSlot);
  demoF = demoSlot.ref;
  heroSlot.ref.__setOpenness(heroSlot.openness);
}
// seed CSS vars + form immediately so first paint matches defaults
applyMoodAndMotion();
setFlowerForm(TW.bloom);
slots.forEach(renderSlot); // re-render with the seeded form (initial build used lotus before form was set)
demoF = demoSlot.ref;

/* ---- Tweaks panel wiring (host protocol) ---- */
const panel = document.getElementById("tweaksPanel");
function syncPanel() {
  panel.querySelectorAll(".tw-seg").forEach((seg) => {
    const key = seg.dataset.tw;
    seg.querySelectorAll("button").forEach((b) =>
      b.classList.toggle("on", b.dataset.val === TW[key]));
  });
}
panel.querySelectorAll(".tw-seg button").forEach((b) => {
  b.addEventListener("click", () => {
    const key = b.closest(".tw-seg").dataset.tw;
    if (TW[key] === b.dataset.val) return;
    TW[key] = b.dataset.val;
    syncPanel();
    applyTweaks();
    renderBattery(+battery.value);
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [key]: b.dataset.val } }, "*");
  });
});
syncPanel();

window.addEventListener("message", (e) => {
  const t = e.data && e.data.type;
  if (t === "__activate_edit_mode") panel.hidden = false;
  else if (t === "__deactivate_edit_mode") panel.hidden = true;
});
document.getElementById("twClose").addEventListener("click", () => {
  panel.hidden = true;
  window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
});
window.parent.postMessage({ type: "__edit_mode_available" }, "*");

/* ============ entrance stagger (pure CSS, optional flourish) ============ */
document.documentElement.classList.add("js");
