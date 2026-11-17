import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LoadError } from '../components/LoadError.tsx'
import { useData } from '../lib/useData.ts'
import type { Dispatch } from '../types.ts'

export function Dispatches() {
  const { data: tickets, error, reload } = useData<Dispatch[]>('/api/dispatches')

  if (error !== null) return <LoadError message={error} onRetry={reload} />
  if (tickets === null) return null

  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <Button variant="outline" className="self-start" onClick={reload}>
        Rafraîchir
      </Button>
      {tickets.length === 0 ? (
        <p>Aucun envoi. La cuisine profite du calme.</p>
      ) : (
        <div className="bg-card rounded-lg border-2 px-4 pt-1 pb-2">
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Envoi</TableHead>
              <TableHead>Table</TableHead>
              <TableHead className="text-right">Lignes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.number}>
                <TableCell className="font-mono font-bold">n° {ticket.number}</TableCell>
                <TableCell>Table {ticket.table}</TableCell>
                <TableCell className="text-right font-mono font-bold">{ticket.lines}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
