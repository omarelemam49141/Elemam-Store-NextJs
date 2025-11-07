import { Loader2 } from "lucide-react"

type LoadingStateProps = {
  label?: string
  className?: string
}

export function LoadingState({ label = "Loading...", className }: LoadingStateProps) {
  return (
    <div className={`flex items-center justify-center gap-3 py-10 text-muted-foreground ${className ?? ""}`}>
      <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
      <span className="text-sm font-medium" role="status">
        {label}
      </span>
    </div>
  )
}

