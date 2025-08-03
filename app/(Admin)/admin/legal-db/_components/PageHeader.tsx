import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  description?: string
  actionLabel?: string
  onActionClick?: () => void
}

export const PageHeader = ({ title, description, actionLabel, onActionClick }: PageHeaderProps) => {
  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actionLabel && onActionClick && (
        <Button onClick={onActionClick}>{actionLabel}</Button>
      )}
    </div>
  )
}
