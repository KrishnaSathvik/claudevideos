// The Tap Line: one contactless card payment drawn as a metro schematic (a metaphor map, not a real network).
// Units: G = 1 grid step = 100 world units; x grows east, y grows south. Every segment is 0/45/90 degrees.
// Stations: id: [x, y, term, plain-English gloss, tier]  (tier 1 hub, 2 interchange, 3 named stop).
// The engine prints the first text in ink and the second in grey below it.
// Lines: R request (out), A answer (back, parallel to R), C1-C4 the issuer's four checks, S settlement (days later).
(function () {
const G = 100;
const ST = {
  CHIP: [-15.0, 0, 'Chip', 'powered by the reader', 3],
  OTC:  [-13.0, 0, 'One-time code', 'used once', 3],
  TERM: [-8.5, 0, 'Terminal', "the café's card reader", 2],
  AMT:  [-5.6, 0, '$4.75 + card number', 'the request', 3],
  ACQ:  [-0.8, 0, 'Acquirer', "the café's bank", 1],
  NET:  [5.0, 0, 'Card network', 'between banks', 1],
  LOOK: [7.4, 0, 'Card-number lookup', 'which bank issued it?', 3],
  ISS:  [10.0, 0, 'Issuer', 'your bank', 1],
  Q1:   [14.0, -3.0, 'Is the code real?', 'the one-time code', 3],
  Q2:   [14.0, -1.3, 'Is the card open?', 'not lost, stolen or closed', 3],
  Q3:   [14.0, 1.3, 'Money or credit?', 'balance or limit', 3],
  Q4:   [14.0, 3.0, 'Fraud risk?', 'a risk score', 3],
  DEC:  [17.2, 0, 'Decision', 'yes or no', 1],
  APR:  [-8.5, 2.2, 'Approved', 'shown on the terminal', 3],
  CLR:  [5.0, 6.0, 'Clearing', "the day's purchases, batched", 3],
  SET:  [0.0, 6.0, 'Settlement', 'banks move the money', 3],
  PAID: [-6.0, 6.0, 'Café paid', '$4.75, less fees', 3],
};
const LINES = [
  { id: 'R', color: '#E3002B', bullet: 'R', route: [['CHIP', 0, -0.1], ['OTC', 0, -0.1], ['TERM', 0, -0.1], ['AMT', 0, -0.1], ['ACQ', 0, -0.1], ['NET', 0, -0.1], ['LOOK', 0, -0.1], ['ISS', 0, -0.1]] },
  { id: 'A', color: '#1E9E5A', bullet: 'A', route: [['DEC', 0, 0.1], ['ISS', 0, 0.1], ['NET', 0, 0.1], ['ACQ', 0, 0.1], ['TERM', 0, 0.1], 'APR'] },
  // the four checks leave the issuer as one bundle, fan out (outer lines first), and fall back into the decision
  { id: 'C1', color: '#F2B705', bullet: '1', mode: 'light', route: [['ISS', 0.2, -0.5], [11.0, -0.5], [13.5, -3.0], 'Q1', [14.5, -3.0], [17.0, -0.5], ['DEC', 0, -0.5]] },
  { id: 'C2', color: '#8E6BBF', bullet: '2', mode: 'light', route: [['ISS', 0.2, -0.3], [11.5, -0.3], [12.5, -1.3], 'Q2', [15.5, -1.3], [16.5, -0.3], ['DEC', 0, -0.3]] },
  { id: 'C3', color: '#1AA7C4', bullet: '3', mode: 'light', route: [['ISS', 0.2, 0.3], [11.5, 0.3], [12.5, 1.3], 'Q3', [15.5, 1.3], [16.5, 0.3], ['DEC', 0, 0.3]] },
  { id: 'C4', color: '#EF7A1A', bullet: '4', mode: 'light', route: [['ISS', 0.2, 0.5], [11.0, 0.5], [13.5, 3.0], 'Q4', [14.5, 3.0], [17.0, 0.5], ['DEC', 0, 0.5]] },
  { id: 'S', color: '#5B3FA0', bullet: 'S', route: [['ISS', 0, 0.4], [10.0, 6.0], 'CLR', 'SET', 'PAID'] },
];

function pt(it) {
  if (typeof it === 'string') { const s = ST[it]; if (!s) throw new Error('no station ' + it); return [s[0], s[1]]; }
  if (typeof it[0] === 'string') { const s = ST[it[0]]; if (!s) throw new Error('no station ' + it[0]); return [s[0] + it[1], s[1] + it[2]]; }
  return [it[0], it[1]];
}
const sid = it => typeof it === 'string' ? it : (typeof it[0] === 'string' ? it[0] : null);
// between two points not on one of the 8 directions, insert a bend: straight first then diagonal (or '/' for diagonal first)
function expand(route) {
  const out = [], ids = []; let diagFirst = false;
  for (const it of route) {
    if (it === '/') { diagFirst = true; continue; }
    const p = pt(it);
    if (out.length) {
      const a = out[out.length - 1], dx = p[0] - a[0], dy = p[1] - a[1], ax = Math.abs(dx), ay = Math.abs(dy);
      if (ax > 1e-6 && ay > 1e-6 && Math.abs(ax - ay) > 1e-6) {
        const d = Math.min(ax, ay), sx = Math.sign(dx), sy = Math.sign(dy);
        out.push(diagFirst ? [a[0] + sx * d, a[1] + sy * d] : [p[0] - sx * d, p[1] - sy * d]); ids.push(null);
      }
    }
    out.push(p); ids.push(sid(it)); diagFirst = false;
  }
  return { pts: out, ids };
}
// the air gap between card and reader, drawn as a narrow strait the request tunnels under
const WATER = [
  { id: 'airgap', line: [[-11.0, -4.6], [-11.0, 4.6]], outer: 0.82, inner: 0.76, tunnel: true },
];
const LINKS = [];
window.NET = { G, ST, LINES, WATER, LINKS, pt, sid, expand };
})();
