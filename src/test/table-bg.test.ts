import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { TABLE_BGS, headerBtnSvg, isTableBg, tableBgName } from "@/lib/table-bg";

const sql = readFileSync("drizzle/migrations/0063_table_backgrounds.sql", "utf8");

describe("Masa fonu", () => {
  it("offers Standart plus the 13 ureyimsen backgrounds", () => {
    expect(TABLE_BGS).toHaveLength(14);
    expect(isTableBg("sakura_garden")).toBe(true);
    expect(isTableBg("hacked")).toBe(false);
    expect(tableBgName("royal_velvet")).toBe("Kral məxməri");
  });
  it("costs 500 crystals by default", () => {
    expect(sql).toMatch(/values \(true, 500\)/);
  });
  it("server accepts exactly the client list", () => {
    for (const [id] of TABLE_BGS) if (id) expect(sql).toContain(`'${id}'`);
  });
  it("standart background keeps the original header buttons", () => {
    expect(headerBtnSvg("", false)).toBeNull();
    expect(headerBtnSvg("space", true)).toMatch(/^data:image\/svg\+xml;base64,/);
  });
});
