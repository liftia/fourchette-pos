import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { LoadError } from '../components/LoadError.tsx'
import { call, sentence } from '../lib/api.ts'
import type { Method } from '../lib/api.ts'
import { euros, quantity } from '../lib/format.ts'
import { CATEGORIES, lineLabel } from '../lib/labels.ts'
import { useData } from '../lib/useData.ts'
import { useLock } from '../lib/useLock.ts'
import type { Dish, Order as OrderData } from '../types.ts'

type Props = {
  orderId: number | null
  report: (message: string | null) => void
}

export function Order({ orderId, report }: Props) {
  const url = orderId === null ? null : `/api/orders/${orderId}`
  const { data: command, error, reload } = useData<OrderData>(url)
  const { data: menu, error: menuError, reload: reloadMenu } = useData<Dish[]>('/api/menu')
  const { busy, guard } = useLock()
  const [dishId, setDishId] = useState<number | null>(null)
  const [count, setCount] = useState('1')
  const [note, setNote] = useState('')
  const [allergies, setAllergies] = useState('')
  const [editingLine, setEditingLine] = useState<number | null>(null)
  const [editingNote, setEditingNote] = useState('')

  const receivedAllergies = command === null ? '' : command.allergies.join(', ')
  useEffect(() => setAllergies(receivedAllergies), [receivedAllergies])

  if (orderId === null) {
    return <p>Aucune commande sélectionnée. Choisissez une table sur le plan de salle.</p>
  }
  if (error !== null) return <LoadError message={error} onRetry={reload} />
  if (menuError !== null) return <LoadError message={menuError} onRetry={reloadMenu} />
  if (command === null || menu === null) return null

  async function act(method: Method, path: string, body?: unknown): Promise<boolean> {
    let succeeded = false
    await guard(async () => {
      try {
        await call<unknown>(method, `${url}${path}`, body)
        report(null)
        succeeded = true
      } catch (e) {
        report(sentence(e))
      }
      await reload()
    })
    return succeeded
  }

  async function add() {
    if (dishId === null) return
    const added = await act('POST', '/lines', { dishId, quantity: Number(count), note })
    if (added) {
      setDishId(null)
      setCount('1')
      setNote('')
    }
  }

  async function saveNote(lineId: number) {
    if (await act('PATCH', `/lines/${lineId}`, { note: editingNote })) setEditingLine(null)
  }

  function saveAllergies() {
    const list = allergies
      .split(',')
      .map((value) => value.trim())
      .filter((value) => value !== '')
    return act('PUT', '/allergies', { allergies: list })
  }

  const chosenDish = menu.find((dish) => dish.id === dishId)
  const hasDrafts = command.lines.some((line) => line.status === 'draft')

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Carte</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {CATEGORIES.map(({ key, title }) => (
            <section key={key}>
              <h3 className="font-heading after:bg-foreground mb-1.5 flex items-center gap-2.5 text-[15px] font-bold tracking-[0.12em] uppercase after:h-0.5 after:flex-1">
                {title}
              </h3>
              <ul className="flex flex-col gap-1.5">
                {menu
                  .filter((dish) => dish.category === key)
                  .map((dish) => (
                    <li key={dish.id}>
                      <Button
                        variant={dish.id === dishId ? 'default' : 'outline'}
                        className="h-auto min-h-11 w-full justify-between gap-3 px-3 py-1.5 font-semibold whitespace-normal data-[variant=default]:pl-5 data-[variant=default]:shadow-[inset_8px_0_0_var(--accent)]"
                        onClick={() => setDishId(dish.id)}
                      >
                        <span className="text-left">{dish.name}</span>
                        <span className="font-mono font-bold whitespace-nowrap">{euros(dish.priceCents)}</span>
                      </Button>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Table {command.table}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="allergies">Allergies de la table</Label>
                <Input
                  id="allergies"
                  value={allergies}
                  placeholder="arachide, lait"
                  onChange={(e) => setAllergies(e.target.value)}
                />
              </div>
              <Button variant="outline" disabled={busy} onClick={saveAllergies}>
                Enregistrer
              </Button>
            </div>

            <form
              className="bg-muted flex flex-col gap-2.5 rounded-lg border-2 p-3"
              onSubmit={(e) => {
                e.preventDefault()
                void add()
              }}
            >
              <p className="text-lg font-bold">
                {chosenDish === undefined ? 'Choisissez un plat sur la carte.' : chosenDish.name}
              </p>
              <div className="flex items-end gap-2">
                <div className="w-24">
                  <Label htmlFor="quantity">Quantité</Label>
                  <Input
                    id="quantity"
                    type="number"
                    className="font-mono"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="note">Note</Label>
                  <Input id="note" value={note} onChange={(e) => setNote(e.target.value)} />
                </div>
                <Button type="submit" disabled={chosenDish === undefined || busy}>
                  Ajouter
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lignes</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {command.lines.length === 0 && <p>Aucune ligne. La carte n'attend que vous.</p>}
            <ul className="flex flex-col gap-2">
              {command.lines.map((line) => (
                <li
                  key={line.id}
                  className={cn(
                    'flex flex-col items-start gap-2 rounded-lg border-2 p-3',
                    line.status === 'draft' && 'border-dashed',
                    line.status === 'cancelled' && 'hatched',
                  )}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className={cn('text-lg font-bold', line.status === 'cancelled' && 'line-through decoration-2')}>
                      {quantity(line.quantity, line.dish)}
                    </span>
                    <Badge variant={line.status === 'draft' ? 'dashed' : 'default'}>{lineLabel(line)}</Badge>
                  </div>
                  {line.note !== null && <p className="bg-accent px-2 py-px font-bold">{line.note}</p>}
                  {line.status !== 'cancelled' && editingLine !== line.id && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingLine(line.id)
                          setEditingNote(line.note ?? '')
                        }}
                      >
                        Modifier la note
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={busy}
                        onClick={() => act('DELETE', `/lines/${line.id}`)}
                      >
                        Annuler la ligne
                      </Button>
                    </div>
                  )}
                  {editingLine === line.id && (
                    <div className="flex gap-2">
                      <Input
                        aria-label="Nouvelle note"
                        value={editingNote}
                        onChange={(e) => setEditingNote(e.target.value)}
                      />
                      <Button size="sm" disabled={busy} onClick={() => saveNote(line.id)}>
                        Enregistrer la note
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingLine(null)}>
                        Abandonner
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <Button size="lg" disabled={!hasDrafts || busy} onClick={() => act('POST', '/send')}>
              Envoyer en cuisine
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
