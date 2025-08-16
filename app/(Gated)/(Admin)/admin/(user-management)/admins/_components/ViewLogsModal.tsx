'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { getUserLogs } from '@/store/reducers/userSlice'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ViewLogsModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
}

export default function ViewLogsModal({ open, onOpenChange }: ViewLogsModalProps) {

  /////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { currentUser } = useSelector((s: RootState) => s.user)

  /////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////////
  const [logs, setLogs] = useState<any[]>([])

  /////////////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////////////////////
  useEffect(() => {
    const load = async () => {
      if (open && currentUser?._id) {
        const res: any = await dispatch(getUserLogs(currentUser._id))
        const items = res?.payload?.data?.logs || []
        setLogs(items)
      }
    }
    load()
  }, [open, currentUser?._id, dispatch])

  /////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////////
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border border-border max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">User Logs</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-2">
          <div className="space-y-2 text-sm">
            {logs.length === 0 ? (
              <div className="text-muted-foreground">No logs found.</div>
            ) : (
              logs.map((l, idx) => (
                <div key={idx} className="flex items-center justify-between border border-border rounded-md p-2 bg-background">
                  <div className="text-foreground capitalize">{l.type}</div>
                  <div className="text-muted-foreground">{new Date(l.at).toLocaleString()}</div>
                  <div className="text-muted-foreground">{l.by}</div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}


