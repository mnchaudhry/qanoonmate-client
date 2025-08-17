import { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export const PageHeader = ({ title, description, actions }: PageHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {description && <p className="text-muted-foreground mt-1">{description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {actions}
        </div>
      </div>
    </div>
  )
}
