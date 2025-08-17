import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { inviteWaitlistEntryThunk, updateWaitlistEntryThunk, deleteWaitlistEntryThunk, setCurrentPage } from '@/store/reducers/waitlistSlice'
import { WaitlistEntry } from '@/store/types/api'
import toast from 'react-hot-toast'
import { Table, TableCell, TableBody, TableHeader, TableRow, TableHead } from '@/components/ui/table'
import { Pagination } from '@/components/ui/pagination'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, UserPlus, CheckCircle, Trash2 } from 'lucide-react'

const WaitlistTable = () => {

    ////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////
    const dispatch = useDispatch<AppDispatch>()
    const { list, meta } = useSelector((state: RootState) => state.waitlist)

    ////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////////
    const invite = (id: string) => {
        dispatch(inviteWaitlistEntryThunk(id))
    }

    const markJoined = (id: string) => {
        dispatch(updateWaitlistEntryThunk({ id, update: { status: 'joined' } }))
    }

    const deleteEntry = (id: string) => {
        dispatch(deleteWaitlistEntryThunk(id))
        toast.success('Waitlist entry deleted')
    }

    ////////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {list.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                No waitlist entries found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        list.map((e: WaitlistEntry) => (
                            <TableRow key={e._id}>
                                <TableCell>{e.name || '-'}</TableCell>
                                <TableCell>{e.email}</TableCell>
                                <TableCell className="capitalize">{e.status || 'pending'}</TableCell>
                                <TableCell>{new Date(e.createdAt as any).toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="min-w-[180px]">
                                            <DropdownMenuItem onClick={() => invite(e._id)}>
                                                <UserPlus className="h-4 w-4 mr-2" /> Invite
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => markJoined(e._id)}>
                                                <CheckCircle className="h-4 w-4 mr-2" /> Mark joined
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => deleteEntry(e._id)} className="text-destructive focus:text-destructive">
                                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {
                meta.totalPages > 1 && (
                    <Pagination
                        currentPage={meta.currentPage}
                        totalPages={meta.totalPages}
                        onPageChange={(p) => dispatch(setCurrentPage(p))}
                    />
                )
            }
        </>
    )
}

export default WaitlistTable