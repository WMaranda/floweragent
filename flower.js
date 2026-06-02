/* =========================================================
   flower.js — builds geometric SVG flowers + openness control
   openness t: 0 = fully folded (bud), 1 = fully open
   ========================================================= */

/* Petal forms — the "Bloom shape" tweak swaps these across every flower */
const FORMS = {
  lotus: {
    oP: "M200 200 C 162 142 166 82 200 48 C 234 82 238 142 200 200 Z",
    iP: "M200 200 C 176 160 178 112 200 92 C 222 112 224 160 200 200 Z",
    oN: 11, iN: 8,
  },
  daisy: {
    oP: "M200 200 C 172 156 174 106 200 90 C 226 106 228 156 200 200 Z",
    iP: "M200 200 C 184 168 186 132 200 120 C 214 132 216 168 200 200 Z",
    oN: 18, iN: 11,
  },
  tulip: {
    oP: "M200 200 C 185 150 171 62 200 38 C 229 62 215 150 200 200 Z",
    iP: "M200 200 C 191 156 185 104 200 92 C 215 104 209 156 200 200 Z",
    oN: 6, iN: 4,
  },
};
let currentForm = FORMS.lotus;
function setFlowerForm(name) { currentForm = FORMS[name] || FORMS.lotus; }

const SEPAL = "M200 200 C 184 178 184 150 200 138 C 216 150 216 178 200 200 Z";

let __flowerSeq = 0;

function buildFlower(opts = {}) {
  const {
    outer = 11,
    inner = 8,
    palette = { o1: "#F6D8E7", o2: "#CE6F9C", i1: "#FBE7F1", i2: "#E7A3C6", core: "#F4C24E" },
  } = opts;
  const uid = "fl" + (++__flowerSeq);
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 400 400");
  svg.classList.add("flower-svg");

  svg.innerHTML = `
    <defs>
      <radialGradient id="${uid}-o" cx="50%" cy="78%" r="70%">
        <stop offset="0%" stop-color="${palette.o1}"/>
        <stop offset="100%" stop-color="${palette.o2}"/>
      </radialGradient>
      <radialGradient id="${uid}-i" cx="50%" cy="80%" r="68%">
        <stop offset="0%" stop-color="${palette.i1}"/>
        <stop offset="100%" stop-color="${palette.i2}"/>
      </radialGradient>
      <radialGradient id="${uid}-c" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#FCEAB0"/>
        <stop offset="100%" stop-color="${palette.core}"/>
      </radialGradient>
    </defs>
    <g class="fl-sepals"></g>
    <g class="fl-outer"></g>
    <g class="fl-inner"></g>
    <g class="fl-core">
      <circle cx="200" cy="200" r="26" fill="url(#${uid}-c)"/>
    </g>`;

  const sepals = svg.querySelector(".fl-sepals");
  const og = svg.querySelector(".fl-outer");
  const ig = svg.querySelector(".fl-inner");
  const core = svg.querySelector(".fl-core");

  // green sepals behind (botanical base, more visible when folded)
  for (let i = 0; i < 6; i++) {
    const p = document.createElementNS(svgNS, "path");
    p.setAttribute("d", SEPAL);
    p.setAttribute("fill", i % 2 ? "#5E7A57" : "#41573C");
    p.style.transformBox = "view-box";
    p.style.transformOrigin = "200px 200px";
    p.style.transform = `rotate(${i * 60 + 30}deg) scale(1.18)`;
    sepals.appendChild(p);
  }

  const makeRing = (g, count, d, fill, off) => {
    for (let i = 0; i < count; i++) {
      const p = document.createElementNS(svgNS, "path");
      p.setAttribute("d", d);
      p.setAttribute("fill", fill);
      p.setAttribute("stroke", "rgba(35,49,39,0.06)");
      p.setAttribute("stroke-width", "1");
      p.dataset.angle = (i * 360 / count + off).toFixed(2);
      p.style.transformBox = "view-box";
      p.style.transformOrigin = "200px 200px";
      p.style.transition = "transform var(--petal-dur, .5s) cubic-bezier(0.22,0.61,0.30,1)";
      g.appendChild(p);
    }
  };
  makeRing(og, currentForm.oN, currentForm.oP, `url(#${uid}-o)`, 0);
  makeRing(ig, currentForm.iN, currentForm.iP, `url(#${uid}-i)`, 360 / currentForm.oN / 2);

  // tiny stamens on the core
  for (let i = 0; i < 8; i++) {
    const a = i * 45 * Math.PI / 180;
    const dot = document.createElementNS(svgNS, "circle");
    dot.setAttribute("cx", 200 + Math.cos(a) * 13);
    dot.setAttribute("cy", 200 + Math.sin(a) * 13);
    dot.setAttribute("r", 2.4);
    dot.setAttribute("fill", "#B9892B");
    core.appendChild(dot);
  }
  core.style.transformBox = "view-box";
  core.style.transformOrigin = "200px 200px";
  core.style.transition = "transform var(--petal-dur, .5s) cubic-bezier(0.22,0.61,0.30,1)";

  svg.__setOpenness = (t) => setOpenness(svg, t);
  setOpenness(svg, opts.openness != null ? opts.openness : 1);
  return svg;
}

function setOpenness(svg, t) {
  t = Math.max(0, Math.min(1, t));
  svg.dataset.open = t.toFixed(3);
  const twist = (1 - t) * 9;
  svg.querySelectorAll(".fl-outer path").forEach((p) => {
    const a = parseFloat(p.dataset.angle) + twist;
    const sx = 0.50 + 0.50 * t;
    const sy = 0.46 + 0.54 * t;
    p.style.transform = `rotate(${a}deg) scale(${sx}, ${sy})`;
  });
  svg.querySelectorAll(".fl-inner path").forEach((p) => {
    const a = parseFloat(p.dataset.angle) - twist * 0.6;
    const sx = 0.62 + 0.38 * t;
    const sy = 0.55 + 0.45 * t;
    p.style.transform = `rotate(${a}deg) scale(${sx}, ${sy})`;
  });
  const core = svg.querySelector(".fl-core");
  if (core) core.style.transform = `scale(${1.28 - 0.28 * t})`;
}
