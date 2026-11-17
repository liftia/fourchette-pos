import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bill } from './screens/Bill.tsx'
import { Dispatches } from './screens/Dispatches.tsx'
import { FloorPlan } from './screens/FloorPlan.tsx'
import { Order } from './screens/Order.tsx'

export type Tab = 'floor' | 'order' | 'bill' | 'dispatches'

const TABS: { key: Tab; label: string }[] = [
  { key: 'floor', label: 'Plan de salle' },
  { key: 'order', label: 'Commande' },
  { key: 'bill', label: 'Addition' },
  { key: 'dispatches', label: 'Envois' },
]

function isTab(value: string): value is Tab {
  return TABS.some((tab) => tab.key === value)
}

export function App() {
  const [tab, setTab] = useState<Tab>('floor')
  const [orderId, setOrderId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  function openOrder(id: number) {
    setOrderId(id)
    setTab('order')
  }

  function closeOrder() {
    setOrderId(null)
    setTab('floor')
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 p-6">
      <header className="flex items-center gap-3.5 border-b-4 pb-3.5">
        <svg viewBox="0 0 48 48" aria-hidden="true" className="size-11">
          <rect width="48" height="48" className="fill-primary" />
          <path d="M15 8v13a9 9 0 0 0 7 8.8V40h4V29.8A9 9 0 0 0 33 21V8h-4v12h-3V8h-4v12h-3V8z" className="fill-accent" />
        </svg>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">Fourchette & Cie — Caisse</h1>
      </header>
      <Alert role="note">
        <AlertDescription className="text-foreground font-semibold">
          Données fictives de formation. Toute ressemblance avec un restaurant rentable serait fortuite.
        </AlertDescription>
      </Alert>
      {error !== null && (
        <Alert variant="destructive" role="alert" className="flex items-center justify-between gap-4">
          <AlertTitle className="text-xl font-bold">{error}</AlertTitle>
          <AlertDescription>
            <Button variant="outline" size="sm" onClick={() => setError(null)}>
              Fermer
            </Button>
          </AlertDescription>
        </Alert>
      )}
      <Tabs value={tab} onValueChange={(value) => isTab(value) && setTab(value)} className="flex-1 gap-4">
        <TabsList>
          {TABS.map(({ key, label }) => (
            <TabsTrigger key={key} value={key}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="floor">
          <FloorPlan onOrder={openOrder} report={setError} />
        </TabsContent>
        <TabsContent value="order">
          <Order orderId={orderId} report={setError} />
        </TabsContent>
        <TabsContent value="bill">
          <Bill orderId={orderId} onPaid={closeOrder} report={setError} />
        </TabsContent>
        <TabsContent value="dispatches">
          <Dispatches />
        </TabsContent>
      </Tabs>
      <footer className="border-t-2 pt-3 text-[15px] font-semibold">
        Fourchette & Cie — Solutions de restauration à taille humaine
      </footer>
    </div>
  )
}
