const euroWhole = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const euroCents = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const number = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });

/** 1600 → « 1 600 € » ; 246.8 → « 246,80 € ». */
export function formatEuro(value: number) {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? euroWhole.format(rounded) : euroCents.format(rounded);
}

export function formatNumber(value: number) {
  return number.format(value);
}
