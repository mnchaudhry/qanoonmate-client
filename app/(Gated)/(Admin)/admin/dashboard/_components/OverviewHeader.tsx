"use client"

export default function OverviewHeader() {
  const currentTime = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Platform Overview
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Dashboard ▸ Platform Overview
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm text-muted-foreground">
          Last Updated: {currentTime}
        </p>
      </div>
    </div>
  )
}
