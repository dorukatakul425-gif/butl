import { describe, expect, it } from "vitest";
import { createHmac } from "node:crypto";
import { validateInitData, telegramEmail } from "@/lib/telegram-auth";

const TOKEN = "123456:ABC-DEF-test-token";
const hmac = (key: string | Buffer, data: string) => createHmac("sha256", key).update(data).digest();

function buildInitData(user: object, authDate: number, token = TOKEN): string {
  const params = new URLSearchParams({
    auth_date: String(authDate),
    query_id: "AAtest",
    user: JSON.stringify(user),
  });
  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");
  const secret = createHmac("sha256", "WebAppData").update(token).digest();
  const hash = createHmac("sha256", secret).update(dataCheckString).digest("hex");
  params.set("hash", hash);
  return params.toString();
}

const USER = { id: 42, first_name: "Elvin", username: "elvin" };
const NOW = 1_800_000_000;

describe("validateInitData", () => {
  it("accepts a correctly signed payload", () => {
    const parsed = validateInitData(buildInitData(USER, NOW - 60), TOKEN, hmac, NOW);
    expect(parsed?.user.id).toBe(42);
    expect(parsed?.user.first_name).toBe("Elvin");
  });

  it("rejects a tampered payload", () => {
    const data = buildInitData(USER, NOW - 60).replace("Elvin", "Hacker");
    expect(validateInitData(data, TOKEN, hmac, NOW)).toBeNull();
  });

  it("rejects a wrong bot token", () => {
    const data = buildInitData(USER, NOW - 60, "999:wrong");
    expect(validateInitData(data, TOKEN, hmac, NOW)).toBeNull();
  });

  it("rejects stale auth_date", () => {
    const data = buildInitData(USER, NOW - 90000);
    expect(validateInitData(data, TOKEN, hmac, NOW)).toBeNull();
  });

  it("rejects missing user", () => {
    const params = new URLSearchParams({ auth_date: String(NOW) });
    const dcs = `auth_date=${NOW}`;
    const secret = createHmac("sha256", "WebAppData").update(TOKEN).digest();
    params.set("hash", createHmac("sha256", secret).update(dcs).digest("hex"));
    expect(validateInitData(params.toString(), TOKEN, hmac, NOW)).toBeNull();
  });
});

describe("telegramEmail", () => {
  it("maps a Telegram id to the local email", () => {
    expect(telegramEmail(42)).toBe("tg_42@butl.local");
  });
});
