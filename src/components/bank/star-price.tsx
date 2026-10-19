/** Stars fiyatı: Ciliz Telegram bankasındaki gibi yıldız ikonu + miktar. */
export function StarPrice({ amount }: { amount: number }) {
  return (
    <span className="dat-price">
      <span>
        <span className="bank__currency-icon bank__currency-icon--star" aria-hidden="true" />
        {amount}
      </span>
    </span>
  );
}
