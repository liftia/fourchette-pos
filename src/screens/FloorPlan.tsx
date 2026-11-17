import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { LoadError } from '../components/LoadError.tsx'
import { call, sentence } from '../lib/api.ts'
import { useData } from '../lib/useData.ts'
import { useLock } from '../lib/useLock.ts'
import type { Order, Table } from '../types.ts'

type Props = {
  onOrder: (orderId: number) => void
  report: (message: string | null) => void
}

export function FloorPlan({ onOrder, report }: Props) {
  const { data: tables, error, reload } = useData<Table[]>('/api/tables')
  const { busy, guard } = useLock()

  async function choose(table: Table) {
    if (table.orderId !== null) {
      report(null)
      onOrder(table.orderId)
      return
    }
    await guard(async () => {
      try {
        const order = await call<Order>('POST', '/api/orders', { table: table.number })
        report(null)
        onOrder(order.id)
      } catch (e) {
        report(sentence(e))
        await reload()
      }
    })
  }

  if (error !== null) return <LoadError message={error} onRetry={reload} />
  if (tables === null) return null

  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {tables.map((table) => (
        <li key={table.number}>
          <button
            type="button"
            disabled={busy}
            onClick={() => choose(table)}
            className={cn(
              'hover:bg-accent flex min-h-42 w-full flex-col items-start gap-1.5 rounded-lg border-2 p-5 text-left',
              table.orderId === null ? 'bg-card border-dashed' : 'bg-accent',
            )}
          >
            <span className="font-heading text-4xl font-extrabold tracking-tight">Table {table.number}</span>
            <span className="mb-auto text-lg font-semibold">{table.seats} couverts</span>
            <Badge variant={table.orderId === null ? 'dashed' : 'default'}>
              {table.orderId === null ? 'Libre' : 'Occupée'}
            </Badge>
          </button>
        </li>
      ))}
    </ul>
  )
}
