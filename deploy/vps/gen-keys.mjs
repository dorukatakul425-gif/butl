// Generates the JWT secret and the anon / service_role keys for self-hosted Lovable Cloud (Supabase).
// Usage: node gen-keys.mjs  -> prints KEY=value lines.
import { createHmac, randomBytes } from "node:crypto";

const b64 = (v) => Buffer.from(typeof v === "string" ? v : JSON.stringify(v)).toString("base64url");
const secret = randomBytes(32).toString("hex");
const now = Math.floor(Date.now() / 1000);
const exp = now + 10 * 365 * 24 * 3600;
const sign = (role) => {
  const head = b64({ alg: "HS256", typ: "JWT" });
  const body = b64({ role, iss: "supabase", iat: now, exp });
  const sig = createHmac("sha256", secret).update(`${head}.${body}`).digest("base64url");
  return `${head}.${body}.${sig}`;
};
console.log(`JWT_SECRET=${secret}`);
console.log(`ANON_KEY=${sign("anon")}`);
console.log(`SERVICE_ROLE_KEY=${sign("service_role")}`);
