export function formatNumber(val: number): string {
  return new Intl.NumberFormat('en-US').format(val);
}

export function formatCurrencyBillion(val: number): string {
  return `$${val.toFixed(2)}B`;
}

export function formatMassKg(val: number): string {
  return `${formatNumber(val)} KG`;
}

export function formatPercent(val: number): string {
  return `${Math.round(val)}%`;
}

export function formatMissionTime(secondsElapsed: number): string {
  const days = Math.floor(secondsElapsed / 86400);
  const hours = Math.floor((secondsElapsed % 86400) / 3600);
  const minutes = Math.floor((secondsElapsed % 3600) / 60);
  const secs = secondsElapsed % 60;
  return `T+${String(days).padStart(3, '0')}d ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
