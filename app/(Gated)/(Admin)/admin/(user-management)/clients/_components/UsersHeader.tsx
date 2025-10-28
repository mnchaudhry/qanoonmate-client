"use client"

export default function UsersHeader() {
  return (
    <div className="bg-surface border !border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            All Users
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            View, search, and manage all registered users on the platform.
          </p>
        </div>
        <div className="flex items-center text-muted-foreground">
          <span className="text-sm">▽</span>
        </div>
      </div>
    </div>
  )
}
