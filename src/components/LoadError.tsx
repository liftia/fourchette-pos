import { Button } from '@/components/ui/button'

type Props = {
  message: string
  onRetry: () => void
}

export function LoadError({ message, onRetry }: Props) {
  return (
    <div role="status" className="flex flex-col items-start gap-3">
      <p>{message}</p>
      <Button variant="outline" onClick={onRetry}>
        Réessayer
      </Button>
    </div>
  )
}
