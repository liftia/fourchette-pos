export type Category = 'starter' | 'main' | 'dessert' | 'drink'

export type Dish = { id: number; name: string; category: Category; priceCents: number }

export type Table = { number: number; seats: number; orderId: number | null }

export type LineStatus = 'draft' | 'sent' | 'cancelled'

export type OrderLine = {
  id: number
  dishId: number
  dish: string
  quantity: number
  note: string | null
  status: LineStatus
  dispatch: number | null
}

export type Order = {
  id: number
  table: number
  status: 'open' | 'paid'
  allergies: string[]
  lines: OrderLine[]
}

export type Dispatch = { number: number; table: number; orderId: number; lines: number }

export type BillLine = { label: string; quantity: number; amount: number }

export type Bill = { lines: BillLine[]; total: number }
