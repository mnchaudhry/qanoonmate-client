'use client'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { getUsers, setCurrentPage } from '@/store/reducers/userSlice'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { enumToLabel } from '@/lib/utils'
import { Pagination } from '@/components/ui/pagination'

type Props = {
  search: string
  role?: string
  status?: string
  releaseChannel?: string
  sortBy?: string
  onSelectionChange?: (emails: string[]) => void
}

const PAGE_SIZE = 20

export function UsersPickTable({ search, role, status, releaseChannel, sortBy, onSelectionChange }: Props) {

  ////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { users, meta } = useSelector((s: RootState) => s.user)
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  ////////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////////

  const currentPage = meta?.currentPage || 1

  useEffect(() => {
    dispatch(getUsers({
      page: currentPage,
      limit: PAGE_SIZE,
      search: search || undefined,
      role: role || undefined,
      accountStatus: status || undefined,
      releaseChannel: releaseChannel || undefined,
      sortBy: sortBy || undefined,
      sortOrder: sortBy === 'createdAt' ? 'desc' : 'asc'
    }))
  }, [dispatch, currentPage, search, role, status, releaseChannel, sortBy])

  useEffect(() => {
    const emails = users.filter(u => selected[u._id]).map(u => u.email).filter(Boolean)
    onSelectionChange?.(emails)
  }, [selected, users, onSelectionChange])

  const allOnPageSelected = useMemo(() => users.every(u => selected[u._id]), [users, selected])

  const toggleAll = (checked: boolean) => {
    const map = { ...selected }
    users.forEach(u => { map[u._id] = checked })
    setSelected(map)
  }

  const toggleOne = (id: string) => {
    setSelected(prev => ({ ...prev, [id]: !prev[id] }))
  }

  ////////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox checked={allOnPageSelected} onCheckedChange={(v) => toggleAll(Boolean(v))} />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role & Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(u => (
            <TableRow key={u._id}>
              <TableCell><Checkbox checked={!!selected[u._id]} onCheckedChange={() => toggleOne(u._id)} /></TableCell>
              <TableCell>{u.firstname} {u.lastname}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.phone}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Badge variant="outline">{enumToLabel(u.role)}</Badge>
                  <Badge variant="outline">{enumToLabel(u.accountStatus)}</Badge>
                  <Badge variant="outline">{enumToLabel(u.releaseChannel)}</Badge>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {
        meta.totalPages > 1 && (
          <Pagination
            currentPage={meta.currentPage}
            totalPages={meta.totalPages}
            onPageChange={page => dispatch(setCurrentPage(page))}
          />
        )
      }
    </div>
  )
}


