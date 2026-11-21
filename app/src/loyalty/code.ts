// Demo: kod zależy od klienta i bieżącej minuty. W etapie 2 zastąpi go kod podpisany przez API.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

export function loyaltyCode(customerId: string, nowMs: number): string {
  const minute = Math.floor(nowMs / 60000);
  const a = fnv1a(`${customerId}:${minute}`);
  const b = fnv1a(`${minute}:${customerId}:x`);
  let out = '';
  for (let i = 0; i < 8; i++) {
    const src = i < 4 ? a : b;
    out += ALPHABET[(src >>> (i % 4) * 5) % ALPHABET.length];
    if (i === 3) out += '-';
  }
  return out;
}

export function secondsToRefresh(nowMs: number): number {
  return Math.max(1, Math.ceil((60000 - (nowMs % 60000)) / 1000));
}
