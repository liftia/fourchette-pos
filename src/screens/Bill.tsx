import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LoadError } from '../components/LoadError.tsx'
import { call, sentence } from '../lib/api.ts'
import { euros } from '../lib/format.ts'
import { useData } from '../lib/useData.ts'
import { useLock } from '../lib/useLock.ts'
import type { Bill as BillData } from '../types.ts'

type Props = {
  orderId: number | null
  onPaid: () => void
  report: (message: string | null) => void
}

export function Bill({ orderId, onPaid, report }: Props) {
  const url = orderId === null ? null : `/api/orders/${orderId}`
  const { data: slip, error, reload } = useData<BillData>(url === null ? null : `${url}/bill`)
  const { busy, guard } = useLock()

  if (orderId === null) {
    return <p>Aucune commande sélectionnée. Choisissez une table sur le plan de salle.</p>
  }
  if (error !== null) return <LoadError message={error} onRetry={reload} />
  if (slip === null) return null

  function pay() {
    return guard(async () => {
      try {
        await call<unknown>('POST', `${url}/pay`)
        report(null)
        onPaid()
      } catch (e) {
        report(sentence(e))
      }
    })
  }

  return (
    <div className="flex max-w-3xl flex-col gap-5">
      <div className="slip bg-card border-2 border-b-0 px-5 pt-2 pb-8">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Libellé</TableHead>
            <TableHead className="w-28 text-right">Quantité</TableHead>
            <TableHead className="w-44 text-right">Montant</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {slip.lines.map((line, index) => (
            <TableRow key={index} className={line.amount < 0 ? 'bg-accent hover:bg-accent border-solid' : undefined}>
              <TableCell>{line.label}</TableCell>
              <TableCell className="text-right font-mono font-bold">{line.quantity}</TableCell>
              <TableCell className="text-right font-mono font-bold">{euros(line.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right font-mono text-3xl font-bold">{euros(slip.total)}</TableCell>
          </TableRow>
        </TableFooter>
        </Table>
      </div>
      <Button size="lg" className="min-w-56 self-end" disabled={busy} onClick={pay}>
        Encaisser
      </Button>
    </div>
  )
}
