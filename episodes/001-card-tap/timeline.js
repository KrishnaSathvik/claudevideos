// Direction of "The Tap Line" (Episode 001: What happens after you tap your card?).
// Film time = story time (no WARP). Narration placement and subtitles come from script.json and voice/out/dur.json;
// every fact on screen is in FACTS.md.
import { clamp, lerp, seg, ss, eio, eo, ei, back, monotone, hash } from '/core/lib.js';

const SCRIPT = await (await fetch('./script.json')).json();
const VDUR = await (await fetch('./voice/out/dur.json')).json();
const DUR = SCRIPT.dur;
const W = v => v * 100;
const RED = '#E3002B', GREEN = '#1E9E5A', PURPLE = '#5B3FA0', BLUE = '#5f88ad', GREY = '#4a4740';

// ------------------------------------------------------------------ subtitles (t0 = voice start; held >= max(1.8 s, speech + 0.6 s))
export const SUBS = SCRIPT.lines.map((l, i, A) => {
  const d = VDUR[l.id] || 1.5, next = A[i + 1] ? A[i + 1].t - .08 : DUR - .2;
  return { t0: l.t, t1: Math.min(next, Math.max(l.t + 1.8, l.t + d + .6)), text: l.sub };
});

// register a line of text for window.TEXTS (readcheck); alphabetic baseline, current font and alignment
function rt(c, R, id, s, x, y, size, a = 1, screen = false) {
  if (!R || !R.regW) return;
  const w = c.measureText(s).width, al = c.textAlign, x0 = al === 'center' ? x - w / 2 : al === 'right' ? x - w : x;
  if (screen) R.regS(id, s, x0, y - size * .9, x0 + w, y + size * .25, a); else R.regW(id, s, x0, y - size * .9, x0 + w, y + size * .25, a, 12);
}

// ------------------------------------------------------------------ growth phases (keys: [time, station] the tip passes)
const P = (path, a, b, keys, extra = {}) => ({ path, a, b, t0: 0, t1: 0, keys, ...extra });
const PHASES = [
  P('R', 'CHIP', 'ISS', [[3.95, 'CHIP'], [9.8, 'CHIP'], [13.9, 'OTC'], [17.7, 'TERM'], [19.1, 'AMT'], [20.5, 'ACQ'], [22.5, 'NET'], [23.9, 'LOOK'], [25.3, 'ISS']]),
  P('C1', 'ISS', 'DEC', [[28.6, 'ISS'], [29.4, 'Q1'], [33.8, 'Q1'], [34.5, 'DEC']]),
  P('C2', 'ISS', 'DEC', [[29.8, 'ISS'], [30.6, 'Q2'], [33.8, 'Q2'], [34.5, 'DEC']]),
  P('C3', 'ISS', 'DEC', [[31.3, 'ISS'], [32.1, 'Q3'], [33.8, 'Q3'], [34.5, 'DEC']]),
  P('C4', 'ISS', 'DEC', [[32.7, 'ISS'], [33.4, 'Q4'], [33.85, 'Q4'], [34.5, 'DEC']]),
  P('A', 'DEC', 'APR', [[36.3, 'DEC'], [37.1, 'ISS'], [37.9, 'NET'], [38.5, 'ACQ'], [39.1, 'TERM'], [39.6, 'APR']]),
  P('S', 'ISS', 'PAID', [[45.3, 'ISS'], [46.7, 'CLR'], [48.0, 'SET'], [49.4, 'PAID']]),
];
const T = { cut: 3.95, wake: 7.9, ride: 9.8, glide: 21.0, issuer: 26.2, race: 37.3, lock: 39.9, approved: 40.4, counter: 42.0, settle: 44.6, land: 49.4, rise: 52.6, endTitle: 53.2 };

// ------------------------------------------------------------------ helpers filled at init
let H = null;
const phaseIdx = key => H.PH.findIndex(o => o.path.key === key);
function phaseTip(i, t) { const o = H.PH[i]; const s = t <= o.t0 ? o.s0 : t >= o.t1 ? o.s1 : lerp(o.s0, o.s1, clamp(o.f(t))); return H.pointAt(o.path, s); }
function smoothTip(key, t, span = .4) { const i = phaseIdx(key); let x = 0, y = 0; for (let k = -4; k <= 4; k++) { const q = phaseTip(i, t + k * span / 4); x += q[0]; y += q[1]; } return [x / 9, y / 9]; }

// ------------------------------------------------------------------ camera
const lz = (a, b, u) => Math.exp(lerp(Math.log(a), Math.log(b), u));
function mix(a, b, u) { return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: lz(a.z, b.z, u), tilt: lerp(a.tilt, b.tilt, u), head: lerp(a.head, b.head, u), ap: lerp(a.ap || 0, b.ap || 0, u), far: lerp(a.far || 5, b.far || 5, u) }; }
const MACRO = { x: -1500, y: -10, z: 2.6, tilt: 24, head: -10, ap: 16 };
const TITLE = { x: -1420, y: 250, z: .8, tilt: 9, head: 0, ap: 3 };
const SETV1 = { x: 650, y: 380, z: 1.05, tilt: 18, head: 2, ap: 6 }, SETV2 = { x: -150, y: 470, z: 1.0, tilt: 14, head: 0, ap: 4 };
const NEARCHIP = { x: -1390, y: 30, z: 1.6, tilt: 24, head: -6, ap: 14 };
const DIVE = { x: -1080, y: -10, z: 1.85, tilt: 60, head: -10, ap: 26 };
const ISSV = { x: 1390, y: 0, z: 1.22, tilt: 12, head: 0, ap: 4 };
const LOCK = { x: -760, y: 130, z: 1.3, tilt: 0, head: 0, ap: 0 };
const END = { x: 80, y: 120, z: .43, tilt: 20, head: 3, ap: 3, far: 7 };
function ride(t) {   // ride the request's pen tip, aim 1.5 G ahead
  const tp = smoothTip('R', t, .5), z = lerp(1.6, 1.45, ss(seg(t, 16.5, 19)));
  const c = { x: tp[0] + 150, y: tp[1] + 40, z, tilt: lerp(24, 21, ss(seg(t, 16.5, 19))), head: -6, ap: 14 };
  const dive = ss(seg(t, 14.7, 15.25)) * (1 - ss(seg(t, 16.0, 16.6)));
  return dive > 0 ? mix(c, DIVE, dive) : c;
}
const glide = t => ({ x: lerp(420, 820, ss(seg(t, 21.4, 25.5))), y: 120, z: 1.15, tilt: 18, head: 4, ap: 8 });
function race(t) { const tp = smoothTip('A', t, .7); return { x: tp[0] - 260, y: tp[1] + 70, z: .72, tilt: 26, head: -4, ap: 10 }; }
const HOLD = { x: -150, y: 640, z: 1.05, tilt: 16, head: 0, ap: 6 };
function follow(t) {   // follow the settlement tip with the aim led along its direction of travel, then hold on the band
  const u = Math.min(t, 49.6), a = smoothTip('S', u - .3, .6), b = smoothTip('S', u + .3, .6), d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, tp = smoothTip('S', u, .6);
  const f = { x: tp[0] + 130 * (b[0] - a[0]) / d, y: tp[1] + 130 * (b[1] - a[1]) / d + 40, z: 1.05, tilt: 20, head: 0, ap: 8 };
  return mix(f, HOLD, eio(seg(t, 49.4, 50.6)));
}
function camera(t) {
  if (t < T.cut) return MACRO;
  if (t < 8.6) return mix(MACRO, TITLE, eio(seg(t, 4.0, 5.3)));
  if (t < T.ride) return mix(TITLE, NEARCHIP, eio(seg(t, 8.6, 9.8)));
  if (t < T.glide) { const r = ride(t); return t < 10.6 ? mix(NEARCHIP, r, eio(seg(t, 9.8, 10.6))) : r; }
  if (t < T.issuer) return mix(ride(T.glide), glide(t), eio(seg(t, 21.0, 22.0)));
  const ISSZ = t => ({ ...ISSV, z: ISSV.z * (1 + .04 * seg(t, 27.4, T.race)) });
  if (t < T.race) return mix(glide(T.issuer), ISSZ(t), eio(seg(t, T.issuer, 27.4)));
  if (t < 39.4) return mix(ISSZ(T.race), race(t), eio(seg(t, T.race, 37.85)));
  if (t < T.settle) return mix(race(39.4), LOCK, eio(seg(t, 39.4, 40.2)));
  if (t < 46.2) { const u = eio(seg(t, 44.6, 45.8)), m = mix(LOCK, SETV1, u); m.tilt += 10 * Math.sin(Math.PI * u); return m; }
  if (t < T.rise) return mix(SETV1, SETV2, eio(seg(t, 46.2, 48.6)));
  const e = mix(SETV2, END, eio(seg(t, 52.6, 55.0))); e.z *= 1 - .03 * seg(t, 55, DUR); return e;
}

// ------------------------------------------------------------------ the printed sheet
const SHEET = [-1950, -650, 2150, 880];
const REGIONS = [   // [x centre (G), name, gloss]
  [-15.3, 'YOUR POCKET', 'the card'], [-6.95, 'THE CAFÉ', 'the merchant'], [-0.5, "THE CAFÉ'S BANK", 'the acquirer'],
  [5.5, 'CARD NETWORK', 'routes between banks'], [13.8, 'YOUR BANK', 'the issuer'],
];
const regionA = t => t < 7.7 ? 1 : (t > 21.0 && t < 25.6) || (t > 25.6 && t < 36.4) || t > T.rise ? 1 : 0;   // registered (read) only in held shots
function furniture(c, t, view, K) {
  const { F, INK, MUTED } = K;
  c.save(); c.textBaseline = 'alphabetic';
  // region dividers: dotted ink, and the "later" rule above the settlement band
  c.strokeStyle = 'rgba(27,28,30,.22)'; c.lineWidth = 3; c.setLineDash([10, 12]);
  for (const x of [-3.5, 2.5, 8.5]) { c.beginPath(); c.moveTo(W(x), W(-6.1)); c.lineTo(W(x), W(4.5)); c.stroke(); }
  c.beginPath(); c.moveTo(W(-12.0), W(4.8)); c.lineTo(W(20.6), W(4.8)); c.stroke(); c.setLineDash([]);
  // region names
  for (const [x, name, gloss] of REGIONS) {
    c.textAlign = 'center'; c.fillStyle = INK; c.font = F(800, 55); c.fillText(name, W(x), W(-5.15)); rt(c, K, 'rg-' + name, name, W(x), W(-5.15), 55, regionA(t));
    c.font = F(600, 30); c.fillStyle = GREY; c.fillText(gloss, W(x), W(-4.72)); rt(c, K, 'rg-' + name + '-g', gloss, W(x), W(-4.72), 30, regionA(t));
  }
  const la = seg(t, 45.0, 45.6); c.save(); c.globalAlpha = la; c.beginPath(); c.rect(W(-10.1), W(5.2), W(2.6) * eo(la), W(1.1)); c.clip();
  c.textAlign = 'left'; c.fillStyle = INK; c.font = F(800, 42); c.fillText('LATER', W(-10.0), W(5.75)); rt(c, K, 'later', 'LATER', W(-10.0), W(5.75), 42, t > 46 ? 1 : 0);
  c.font = F(600, 26); c.fillStyle = GREY; c.fillText('days, not seconds', W(-10.0), W(6.1)); rt(c, K, 'later-g', 'days, not seconds', W(-10.0), W(6.1), 26, t > 46 ? 1 : 0); c.restore();
  // cartouche (south-west corner): the film's title is the map's name
  const x0 = W(-18.8), y0 = W(6.2);
  c.fillStyle = INK; c.fillRect(x0, y0, 110, 11);
  c.font = F(800, 72); c.fillText('THE TAP LINE', x0, y0 + 88); rt(c, K, 'title', 'THE TAP LINE', x0, y0 + 88, 72);
  c.font = F(600, 33); c.fillText('What happens after you tap your card?', x0, y0 + 136); rt(c, K, 'title-q', 'What happens after you tap your card?', x0, y0 + 136, 33);
  c.font = F(500, 24); c.fillStyle = MUTED; c.fillText('Simplified · not to scale', x0, y0 + 176); rt(c, K, 'title-note', 'Simplified · not to scale', x0, y0 + 176, 24);
  c.restore();
  endTitle(c, t, K);
}
function endTitle(c, t, K) {
  if (t < T.endTitle) return; const { F, INK, MUTED } = K;
  const x = W(12.8), y = W(6.9), k = t - T.endTitle, u = eo(clamp(k / .5));
  c.save(); c.beginPath(); c.rect(x - 30, y - 120, 900 * u + 30, 320); c.clip();
  c.fillStyle = RED; c.fillRect(x, y - 92, 12, 200);
  c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.fillStyle = INK; const a = u > .99 ? 1 : 0;
  c.font = F(800, 108); c.fillText('One tap.', x + 40, y); rt(c, K, 'end-1', 'One tap.', x + 40, y, 108, a);
  c.font = F(700, 74); c.fillText('Two journeys.', x + 40, y + 86); rt(c, K, 'end-2', 'Two journeys.', x + 40, y + 86, 74, a);
  c.restore();
}
function waterLabels(c, t, view, { F }) {
  c.save(); c.fillStyle = BLUE; c.textBaseline = 'middle'; c.textAlign = 'center';
  for (const y of [-2.9, 2.9]) { c.save(); c.translate(W(-11.0), W(y)); c.rotate(-Math.PI / 2); c.font = F(700, 23); c.fillText('AIR GAP', 0, -12); c.font = F(600, 18); c.fillText('under 4 cm', 0, 12); c.restore(); }
  c.restore();
}

// ------------------------------------------------------------------ printed callouts and marks
function callout(c, K, id, x, y, color, big, line, note, a0, a1, t) {   // bar, heavy figure, one line, a grey note; wipes on from the bar
  const a = seg(t, a0, a0 + .5) * (1 - seg(t, a1, a1 + .4)); if (a <= 0) return; const { F, INK } = K;
  const u = eo(seg(t, a0, a0 + .5)), wdt = 1000;
  c.save(); c.globalAlpha = clamp(a * 1.5); c.beginPath(); c.rect(x - 20, y - 110, wdt * u + 20, 320); c.clip();
  c.fillStyle = 'rgba(244,240,231,.94)'; c.shadowColor = 'rgba(0,0,0,.14)'; c.shadowBlur = 16; c.shadowOffsetY = 5;
  c.font = F(800, 58); const w1 = c.measureText(big).width; c.font = F(700, 34); const w2 = c.measureText(line).width; c.font = F(500, 24); const w3 = c.measureText(note).width;
  c.beginPath(); c.roundRect(x - 14, y - 76, Math.max(w1, w2, w3) + 62, 196, 10); c.fill(); c.shadowColor = 'transparent';
  c.fillStyle = color; c.fillRect(x, y - 58, 10, 160);
  const ra = u > .99 ? c.globalAlpha : 0; c.textAlign = 'left'; c.textBaseline = 'alphabetic';
  c.fillStyle = color === GREEN ? GREEN : INK; c.font = F(800, 58); c.fillText(big, x + 30, y); rt(c, K, id, big, x + 30, y, 58, ra);
  c.fillStyle = INK; c.font = F(700, 34); c.fillText(line, x + 30, y + 50); rt(c, K, id + '-l', line, x + 30, y + 50, 34, ra);
  c.fillStyle = '#5a5650'; c.font = F(500, 24); c.fillText(note, x + 30, y + 90); rt(c, K, id + '-n', note, x + 30, y + 90, 24, ra);
  c.restore();
}
function radioField(c, t) {   // the reader's field reaching across the air gap to wake the chip
  const a = seg(t, 7.6, 8.2) * (1 - seg(t, 13.0, 13.8)); if (a <= 0) return;
  const [ox, oy] = [W(-8.5), W(-0.1)];
  c.save(); c.lineCap = 'round';
  for (let k = 0; k < 6; k++) {
    const ph = ((t - 7.6) / 1.6 + k / 6) % 1, r = W(.6 + 7.4 * ph);
    c.globalAlpha = a * (1 - ph) * .55; c.strokeStyle = BLUE; c.lineWidth = 5;
    c.beginPath(); c.arc(ox, oy, r, Math.PI * .86, Math.PI * 1.14); c.stroke();
  }
  // the chip answers: a pulse at the first stop
  const ch = H.SNODE.CHIP, p = ((t - 8.6) % 1.1) / 1.1;
  if (t > 8.6) { c.globalAlpha = a * (1 - p) * .7; c.strokeStyle = RED; c.lineWidth = 4; c.beginPath(); c.arc(ch.cx, ch.cy, 14 + 46 * p, 0, 7); c.stroke(); }
  c.restore();
}
function terminus(c, t, K) {   // the answer's end: a white ring with an ink outline, on the beat after the silence
  const n = H.SNODE.APR; if (t < 39.6) return; const r = back(seg(t, 39.6, 39.85), 3);
  c.save(); c.translate(n.cx, n.cy); c.scale(r, r);
  if (t < 40.9) { const v = seg(t, 39.6, 40.9); c.globalAlpha = (1 - v) * .7; c.strokeStyle = GREEN; c.lineWidth = 5; c.beginPath(); c.arc(0, 0, 20 + 120 * eo(v), 0, 7); c.stroke(); c.globalAlpha = 1; }
  c.beginPath(); c.arc(0, 0, 15, 0, 7); c.fillStyle = '#fff'; c.fill(); c.lineWidth = 6; c.strokeStyle = K.INK; c.stroke();
  c.restore();
}
function annotations(c, t, view, K) {
  radioField(c, t);
  callout(c, K, 'cap', W(3.0), W(1.55), RED, '65,000+', 'messages a second', "Visa's published capacity", 21.9, 25.7, t);
  terminus(c, t, K);
  callout(c, K, 'apr', W(-7.75), W(2.75), GREEN, 'APPROVED', 'back within seconds', "the issuer's answer, on the terminal", T.approved - .05, 45.2, t);
  callout(c, K, 'days', W(0.3), W(7.25), PURPLE, '1–3', 'business days later', 'the money actually moves', 48.4, DUR + 1, t);
}

// ------------------------------------------------------------------ vehicles on finished track (the closing view)
function trains(c, t, { PATHS, train }) {
  const run = seg(t, 53.5, 54.3); if (run <= 0) return;
  for (const key of ['R', 'A', 'S']) {
    const path = PATHS[key], n = Math.max(1, Math.floor(path.total / 400)), gap = path.total / n;
    for (let k = 0; k < n; k++) { let s = (k * gap + hash(path.total + k) * gap + (t - 53.5) * 200) % path.total; if (s < 30 || s > path.total - 30) continue; train(c, path, s, path.color, run); }
  }
}

// ------------------------------------------------------------------ overlay (screen space, 1920x1080)
function opening(c, t, F, R) {
  // close-up of a café card reader: a card taps, four lights, the beep, APPROVED; the camera pushes into the glowing tap zone
  const push = 1 + .07 * ss(seg(t, 0, 3.3)) + 2.6 * ei(seg(t, 3.35, 3.95)), cx = 960, cy = 640;
  const bg = c.createRadialGradient(960, 520, 0, 960, 540, 1100); bg.addColorStop(0, '#2a2725'); bg.addColorStop(1, '#0d0c0b'); c.fillStyle = bg; c.fillRect(0, 0, 1920, 1080);
  c.save(); c.translate(cx, cy); c.scale(push, push); c.translate(-cx, -cy);
  // the reader
  c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 60; c.shadowOffsetY = 30;
  const bd = c.createLinearGradient(0, 120, 0, 1000); bd.addColorStop(0, '#34373c'); bd.addColorStop(1, '#1b1d20');
  c.fillStyle = bd; c.beginPath(); c.roundRect(600, 110, 720, 900, 60); c.fill(); c.shadowColor = 'transparent';
  c.strokeStyle = 'rgba(255,255,255,.08)'; c.lineWidth = 3; c.stroke();
  // four status lights
  for (let k = 0; k < 4; k++) { const on = t > .75 + k * .2 ? 1 : 0, x = 870 + k * 60;
    c.beginPath(); c.arc(x, 165, 11, 0, 7); c.fillStyle = on ? '#3ddc84' : '#3a3d41'; c.fill();
    if (on) { const g = c.createRadialGradient(x, 165, 0, x, 165, 40); g.addColorStop(0, 'rgba(61,220,132,.5)'); g.addColorStop(1, 'rgba(61,220,132,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, 165, 40, 0, 7); c.fill(); } }
  // screen
  c.fillStyle = '#101915'; c.beginPath(); c.roundRect(670, 210, 580, 250, 18); c.fill();
  c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.fillStyle = '#d8efe2'; c.font = F(800, 120);
  c.fillText('$4.75', 960, 345); if (t < 3.78) rt(c, R, 'op-amt', '$4.75', 960, 345, 120, 1, true);
  if (t > 1.7) { c.fillStyle = '#3ddc84'; c.font = F(800, 64); c.fillText('APPROVED', 960, 425); if (t < 3.78) rt(c, R, 'op-apr', 'APPROVED', 960, 425, 64, 1, true); }
  // tap zone: a glowing ring the card meets
  const glow = .35 + .65 * seg(t, .5, .7) * (1 - .5 * seg(t, 1.0, 1.8)) + 2 * seg(t, 3.4, 3.95);
  const tz = c.createRadialGradient(960, 700, 0, 960, 700, 220); tz.addColorStop(0, `rgba(255,252,245,${clamp(.5 * glow)})`); tz.addColorStop(.45, `rgba(255,240,225,${clamp(.18 * glow)})`); tz.addColorStop(1, 'rgba(255,240,225,0)');
  c.fillStyle = tz; c.beginPath(); c.arc(960, 700, 220, 0, 7); c.fill();
  c.strokeStyle = `rgba(255,255,255,${clamp(.25 + .5 * glow)})`; c.lineWidth = 10; c.beginPath(); c.arc(960, 700, 70, 0, 7); c.stroke();
  for (let k = 0; k < 3; k++) { const v = seg(t, .5 + k * .18, 1.4 + k * .18); if (v <= 0 || v >= 1) continue; c.globalAlpha = (1 - v) * .8; c.lineWidth = 6; c.beginPath(); c.arc(960, 700, 70 + 260 * eo(v), 0, 7); c.stroke(); c.globalAlpha = 1; }
  c.restore();
  // the card: slides in, taps, lifts away
  const inU = eo(seg(t, 0, .48)), outU = ei(seg(t, 1.55, 2.15)), tap = Math.exp(-Math.pow((t - .52) / .08, 2));
  if (outU < 1) {
    const x = lerp(1900, 1010, inU) + 900 * outU, y = lerp(1250, 700, inU) + 500 * outU, sc = 1 - .04 * tap;
    c.save(); c.translate(x, y); c.rotate(lerp(.35, -.12, inU) + .3 * outU); c.scale(sc, sc);
    c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 50 - 30 * tap; c.shadowOffsetY = 34 - 20 * tap;
    const cg = c.createLinearGradient(-280, -175, 280, 175); cg.addColorStop(0, '#203a6b'); cg.addColorStop(1, '#0f1c38');
    c.fillStyle = cg; c.beginPath(); c.roundRect(-280, -175, 560, 350, 28); c.fill(); c.shadowColor = 'transparent';
    const gd = c.createLinearGradient(-200, -60, -110, 10); gd.addColorStop(0, '#e9cf86'); gd.addColorStop(1, '#b8954a');
    c.fillStyle = gd; c.beginPath(); c.roundRect(-210, -70, 100, 78, 12); c.fill();
    c.strokeStyle = 'rgba(80,60,20,.5)'; c.lineWidth = 2; for (const yy of [-44, -18]) { c.beginPath(); c.moveTo(-210, yy); c.lineTo(-110, yy); c.stroke(); }
    c.fillStyle = 'rgba(255,255,255,.55)'; c.font = F(600, 30); c.textAlign = 'left'; c.fillText('••••  ••••  ••••  4417', -210, 90);
    c.restore();
  }
  const fl = seg(t, 3.6, 3.95); if (fl > 0) { c.fillStyle = `rgba(255,252,245,${ei(fl)})`; c.fillRect(0, 0, 1920, 1080); }
}
function matchFlash(c, t, b, toScreen) {   // the white of the tap zone collapses into the chip's red stop
  const k = t - T.cut; if (k < 0 || k > .6) return;
  const n = H.SNODE.CHIP, q = toScreen(b, n.cx, n.cy); if (!q) return;
  const u = eo(clamp(k / .55)), Rr = lerp(1500, 18, u);
  const g = c.createRadialGradient(q[0], q[1], 0, q[0], q[1], Rr);
  g.addColorStop(0, `rgba(255,255,255,${1 - u * .6})`); g.addColorStop(.25, `rgba(255,${lerp(250, 80, u)},${lerp(245, 90, u)},${.9 * (1 - u)})`); g.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = g; c.fillRect(0, 0, 1920, 1080);
  if (k < .12) { c.fillStyle = `rgba(255,252,245,${1 - k / .12})`; c.fillRect(0, 0, 1920, 1080); }
}
// the counter: one row, MONEY MOVED; drums land only on $0.00 (authorization) and $4.75 (settled); they spin in between
function drum(c, x, y, w, h, pos, F, blur = 0) {
  c.save(); c.beginPath(); c.roundRect(x, y, w, h, 5); c.clip();
  const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#9c968a'); g.addColorStop(.18, '#efe9dc'); g.addColorStop(.5, '#faf6ee'); g.addColorStop(.82, '#efe9dc'); g.addColorStop(1, '#9c968a');
  c.fillStyle = g; c.fillRect(x, y, w, h);
  const d = Math.floor(pos) % 10, f = pos - Math.floor(pos);
  c.font = F(800, h * .7); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#1b1c1e';
  const n = blur > 0 ? 7 : 1;
  for (let k = 0; k < n; k++) { const off = n > 1 ? (k / (n - 1) - .5) * blur * h * .9 : 0; c.globalAlpha = n > 1 ? .26 : 1;
    for (const dd of [-1, 0, 1, 2]) c.fillText(String((d + dd + 10) % 10), x + w / 2, y + h / 2 + (dd - f) * h + 2 + off); }
  c.globalAlpha = 1;
  const sh = c.createLinearGradient(0, y, 0, y + h); sh.addColorStop(0, 'rgba(0,0,0,.35)'); sh.addColorStop(.25, 'rgba(0,0,0,0)'); sh.addColorStop(.75, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,0,.35)'); c.fillStyle = sh; c.fillRect(x, y, w, h);
  c.restore();
}
const SPIN = [45.3, T.land];
function moneyCells(t) {
  const target = t > SPIN[0] ? [4, 7, 5] : [0, 0, 0];
  if (!(t > SPIN[0] && t < SPIN[1])) return target.map(p => ({ pos: p, blur: 0 }));
  const rem = SPIN[1] - t, wake = seg(t, SPIN[0], SPIN[0] + .5);
  return target.map((p, i) => { const rate = [4, 11, 19][i] * wake, g = rem < 1.2 ? Math.pow(rem / 1.2, 2) * 1.2 : rem;
    return { pos: ((p - rate * g) % 10 + 10) % 10, blur: clamp(rate * (rem < 1.2 ? 2 * rem / 1.2 : 1) / 6) }; });
}
function counter(c, t, F, R) {
  const vis = seg(t, T.counter, T.counter + .4); if (vis <= 0) return;
  const x = 46 - 30 * (1 - eo(vis)), y = 40, w = 600, h = 112;
  const pulse = t < 45.3 ? .5 + .5 * Math.cos((t - T.counter) * 5.2) : 0;
  c.save(); c.globalAlpha = vis;
  c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 18; c.shadowOffsetY = 6;
  c.beginPath(); c.roundRect(x, y, w, h, 14); const pg = c.createLinearGradient(0, y, 0, y + h); pg.addColorStop(0, '#2a2d31'); pg.addColorStop(1, '#17191c'); c.fillStyle = pg; c.fill();
  c.shadowColor = 'transparent'; c.lineWidth = 1.5 + 3 * pulse * vis; c.strokeStyle = `rgba(227,0,43,${.12 + .6 * pulse})`; c.stroke();
  for (const [sx, sy] of [[x + 12, y + 12], [x + w - 12, y + 12], [x + 12, y + h - 12], [x + w - 12, y + h - 12]]) { c.beginPath(); c.arc(sx, sy, 3.2, 0, 7); c.fillStyle = '#8b8577'; c.fill(); }
  c.fillStyle = '#efe8d8'; c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.font = F(700, 26); c.fillText('MONEY MOVED', x + 30, y + 50); rt(c, R, 'odo', 'MONEY MOVED', x + 30, y + 50, 26, vis, true);
  c.font = F(500, 18); c.fillStyle = '#aaa395'; c.fillText('out of your account', x + 30, y + 80); rt(c, R, 'odo-g', 'out of your account', x + 30, y + 80, 18, vis, true);
  const cells = moneyCells(t), spin = cells[0].blur > 0; let cx = x + w - 30 - 3 * 42 - 12;
  c.fillStyle = '#efe8d8'; c.font = F(800, 40); c.textAlign = 'right'; c.fillText('$', cx - 10, y + 72);
  const v0 = cx;
  cells.forEach((q, i) => { drum(c, cx, y + 24, 38, 64, q.pos, F, q.blur); cx += 42; if (i === 0) { c.fillStyle = '#efe8d8'; c.beginPath(); c.arc(cx + 5, y + 80, 3.6, 0, 7); c.fill(); cx += 12; } });
  if (!spin && R && R.regS) R.regS('odo-v-' + (t >= SPIN[1] ? 'b' : 'a'), t >= SPIN[1] ? '$4.75' : '$0.00', v0 - 40, y + 24, cx, y + 88, vis);
  c.restore();
}
function subtitles(c, t, F) {
  const s = SUBS.find(q => t >= q.t0 && t < q.t1); if (!s) return;
  const a = seg(t, s.t0, s.t0 + .12) * (1 - seg(t, s.t1 - .12, s.t1)), lines = s.text.split('\n');
  c.save(); c.globalAlpha = a; c.font = F(600, 36); c.textAlign = 'center'; c.textBaseline = 'alphabetic';
  const w = Math.max(...lines.map(l => c.measureText(l).width)), lh = 46, h = lines.length * lh + 22, y0 = 1046 - h;
  c.fillStyle = 'rgba(242,238,229,.9)'; c.beginPath(); c.roundRect(960 - w / 2 - 26, y0, w + 52, h, 12); c.fill();
  c.fillStyle = '#1b1c1e'; lines.forEach((l, i) => c.fillText(l, 960, y0 + 46 + i * lh));
  c.restore();
}
function overlay(c, t, O) { const { b, toScreen, F } = O;
  if (t < T.cut) opening(c, t, F, O); else { matchFlash(c, t, b, toScreen); counter(c, t, F, O); }
  subtitles(c, t, F);
}

// ------------------------------------------------------------------ labels per shot, and cues for the score
const LBL = t => t < 7.7 ? [] : t < 13.9 ? ['CHIP', 'OTC'] : t < T.glide ? ['CHIP', 'OTC', 'ACQ'] : t < T.issuer ? ['ACQ', 'NET', 'LOOK', 'ISS']
  : t < T.race ? ['NET', 'LOOK', 'ISS', 'Q1', 'Q2', 'Q3', 'Q4', 'DEC'] : t < T.lock ? [] : t < T.settle ? ['CHIP', 'OTC', 'TERM', 'AMT', 'ACQ'] : t < T.rise ? ['CLR', 'SET', 'PAID'] : ['ACQ', 'NET', 'ISS', 'DEC'];
const CUES = [
  { t: .5, type: 'tap' }, { t: .75, type: 'leds' }, { t: 1.7, type: 'beep' }, { t: 1.55, type: 'cardout' }, { t: 3.35, type: 'push' }, { t: T.cut, type: 'cut' },
  { t: 4.2, type: 'title' }, { t: 7.6, type: 'wake' }, { t: 9.8, type: 'ride' }, { t: 14.8, type: 'dive' }, { t: 16.1, type: 'surface' },
  { t: T.glide, type: 'glide' }, { t: 21.9, type: 'callout' }, { t: T.issuer, type: 'issuer' }, { t: 34.0, type: 'converge' },
  { t: T.race, type: 'race' }, { t: 39.6, type: 'terminus' }, { t: T.approved, type: 'approved' }, { t: T.counter, type: 'counter' },
  { t: T.settle, type: 'glide2' }, { t: 45.3, type: 'spin' }, { t: 48.4, type: 'days' }, { t: T.land, type: 'land' },
  { t: T.rise, type: 'rise' }, { t: T.endTitle, type: 'endtitle' }, { t: 53.5, type: 'trains' },
];
// a falling interchange lands with an ink shock ring and rings in the colours of (at most three of) the lines that met
function dropRing(c, n, k2, { capsule, INK }) {
  if (k2 < 0) return;
  if (k2 < .9) { const v = k2 / .9, cols = [...new Set([...n.pts].sort((p, q) => p.tl - q.tl).map(p => H.LINE[p.line].color))].slice(0, 3);
    c.save(); c.globalAlpha *= (1 - v) * .75; c.lineWidth = 7; c.strokeStyle = INK; c.beginPath(); c.arc(n.cx, n.cy, 30 + 230 * eo(v), 0, 7); c.stroke();
    cols.forEach((col, i) => { c.lineWidth = 5; c.strokeStyle = col; c.beginPath(); c.arc(n.cx, n.cy, 26 + (170 - 45 * i) * eo(clamp(v * (1.15 + .15 * i))), 0, 7); c.stroke(); });
    c.restore(); }
  capsule(c, n, 1 + .18 * Math.exp(-k2 * 14) * Math.cos(k2 * 40), 7);
}
export const DATA = {
  dropRing,
  DUR, SHEET, PHASES, camera, furniture, waterLabels, annotations, overlay, trains,
  drops: { ISS: true, DEC: true }, noRoundel: ['C1', 'C2', 'C3', 'C4'], roundelPos: { R: [-15.8, -0.1], A: [18.1, 0.95], S: [9.45, 1.4] },
  labelOnly: LBL, forceLabel: (n, t) => LBL(t).includes(n.id) ? 1 : 0, hubLabelScale: z => clamp(Math.pow(1.0 / z, .7), 1, 1.9),
  LABEL_PREF: { CHIP: 'n', OTC: 'n', TERM: 'n', AMT: 'n', ACQ: 'n', NET: 'n', LOOK: 'n', ISS: 'nw', DEC: 'e', Q1: 'n', Q2: 'n', Q3: 's', Q4: 's', CLR: 'n', SET: 'n', PAID: 's', APR: 'w' },
  tunnelOnly: t => t < T.cut, cues: CUES,
  init(h) { H = h; },
};
