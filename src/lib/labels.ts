import type { Category, OrderLine } from '../types.ts'

export const CATEGORIES: { key: Category; title: string }[] = [
  { key: 'starter', title: 'Entrées' },
  { key: 'main', title: 'Plats' },
  { key: 'dessert', title: 'Desserts' },
  { key: 'drink', title: 'Boissons' },
]

export function lineLabel(line: OrderLine): string {
  if (line.status === 'draft') return 'Brouillon'
  if (line.status === 'cancelled') return 'Annulée'
  return `Envoyée n° ${line.dispatch}`
}
