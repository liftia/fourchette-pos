export function euros(cents: number): string {
  const sign = cents < 0 ? '-' : ''
  const absolute = Math.abs(cents)
  const whole = String(Math.floor(absolute / 100)).replace(/\B(?=(\d{3})+$)/g, ' ')
  const decimals = String(absolute % 100).padStart(2, '0')
  return `${sign}${whole},${decimals} €`
}

export function quantity(n: number, dish: string): string {
  return `${n} × ${dish}`
}
