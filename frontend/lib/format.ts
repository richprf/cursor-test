const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/**
 * Grouped Persian digits. `en-US` grouping is used first because it is stable
 * across runtimes, which keeps server and client markup identical.
 */
export function toPersianNumber(value: number): string {
  return value
    .toLocaleString('en-US')
    .replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)])
    .replace(/,/g, '٬');
}

export function formatToman(value: number): string {
  return `${toPersianNumber(Math.round(value))} تومان`;
}
