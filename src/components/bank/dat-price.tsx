import datCoin from "@/assets/dat-coin.png";

/** Shows a price string with the platform currency word ("OK") replaced by the DAT coin icon. */
export function DatPrice({ text }: { text: string }) {
  const parts = text.split(/\bOK\b/);
  return <span className="dat-price">{parts.map((p, i) => <span key={i}>{p.trim()}{i < parts.length - 1 && <img src={datCoin} alt="DAT" className="dat-price__coin" width={20} height={20} />}</span>)}</span>;
}
