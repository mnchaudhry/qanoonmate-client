'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table'
import { Trash2, PlusCircle, Edit2 } from 'lucide-react'
import { Download } from 'lucide-react'
import AddActModal from './_components/AddActModal'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { getActs, deleteAct } from '@/store/reducers/actSlice'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { LawCategory } from '@/lib/enums'
import AlertModal from '@/components/alert-modal'
import { PageHeader } from '../../../_components/PageHeader'
import AdminSkeleton from '@/components/skeletons/AdminPageSkeleton'
import { Pagination } from '@/components/ui/pagination'

const PAGE_SIZE = 40;

const Acts = () => {
  //////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { acts = [], isLoading, currentPage, totalPages, totalCount: totalActs } = useSelector((state: RootState) => state.act)

  //////////////////////////////////////////////// STATES ////////////////////////////////////////////////////////
  const [search, setSearch] = useState('')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editAct, setEditAct] = useState<any | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('latest')

  //////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////////////
  useEffect(() => {
    dispatch(getActs({
      page,
      limit: PAGE_SIZE,
      search: search || undefined,
      category: category !== 'all' ? category : undefined,
      // sort: sort || undefined,
    }))
  }, [dispatch, page, search, category, sort])

  // Reset page to 1 on search/category/sort change
  useEffect(() => { setPage(1) }, [search, category, sort])

  // Log acts with missing _id
  useEffect(() => {
    const actsWithoutId = acts.filter((act) => !act._id)
    if (actsWithoutId.length > 0) {
      console.warn('Some acts are missing _id:', actsWithoutId)
    }
  }, [acts])

  //////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////
  const handleDelete = async () => {
    if (!deleteTargetId) return
    setDeleteLoading(true)
    try {
      await dispatch(deleteAct(deleteTargetId)).unwrap()
      dispatch(getActs({ page, limit: PAGE_SIZE, search: search || undefined, category: category !== 'all' ? category : undefined }))
      setDeleteModalOpen(false)
      setDeleteTargetId(null)
    } catch (error) {
      console.error('Error deleting act:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  const getLawCategoryLabel = (key: string): string => {
    const entry = Object.entries(LawCategory).find(([, value]) => value === key)
    if (!entry) return key
    return entry[0]
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  //////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
  return (
    <div className="space-y-6">
      <PageHeader
        title="Acts & Laws"
        description="Manage legal acts, statutes, and legislative documents."
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div className="flex gap-2 items-center flex-wrap">
          <Input
            placeholder="Search acts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 text-xs rounded-full border ${category === 'all' ? 'border-foreground text-foreground' : 'border-muted text-muted-foreground'} hover:border-foreground hover:text-foreground transition`}
              onClick={() => setCategory('all')}
            >
              All
            </button>
            {Object.values(LawCategory).map(cat => (
              <button
                key={cat}
                className={`px-3 py-1 text-xs rounded-full border ${category === cat ? 'border-foreground text-foreground' : 'border-muted text-muted-foreground'} hover:border-foreground hover:text-foreground transition`}
                onClick={() => setCategory(category === cat ? 'all' : cat)}
              >
                {getLawCategoryLabel(cat)}
              </button>
            ))}
          </div>
          <select
            className="px-3 py-2 rounded-md border border-input bg-background text-foreground"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="alphabetical">Alphabetical (A-Z)</option>
          </select>
        </div>
        <Button
          onClick={() => setAddModalOpen(true)}
          className="flex gap-2"
        >
          <PlusCircle size={18} />
          Add Act
        </Button>
      </div>

      <AddActModal
        open={addModalOpen || !!editAct}
        onClose={() => { setAddModalOpen(false); setEditAct(null); }}
        act={editAct}
        onActSaved={() => dispatch(getActs({ page, limit: PAGE_SIZE, search: search || undefined, category: category !== 'all' ? category : undefined }))}
      />

              {isLoading ? (
          <AdminSkeleton tableRows={8} />
        ) : (
          <Table>
            <TableCaption>
              {acts.length
                ? `Showing ${acts.length} of ${totalActs} acts (Page ${currentPage} of ${totalPages})`
                : 'No acts found'}
            </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Law Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {acts.map((act) => {
            if (!act._id) return null

            return (
              <TableRow key={act._id}>
                <TableCell className="font-medium">{act.name || '-'}</TableCell>
                <TableCell className="max-w-xs truncate">{act.description || '-'}</TableCell>
                <TableCell className="max-w-xs truncate">{act.slug || '-'}</TableCell>
                <TableCell>{act.year || '-'}</TableCell>
                <TableCell>
                  {act.category ? (
                    <Badge variant="secondary">
                      {getLawCategoryLabel(act.category)}
                    </Badge>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {act.createdAt
                    ? new Date(act.createdAt).toLocaleDateString()
                    : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditAct(act)}
                    >
                      <Edit2 size={16} className="text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => act.pdfUrl && window.open(act.pdfUrl, '_blank')}
                      disabled={!act.pdfUrl}
                    >
                      <Download size={16} className="text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setDeleteTargetId(act._id!);
                        setDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      )}
      
      {!isLoading && (
        <Pagination
          currentPage={page}
          onPageChange={setPage}
          totalPages={totalPages}
        />
      )}
      <AlertModal
        open={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setDeleteTargetId(null); }}
        onSubmit={handleDelete}
        loading={deleteLoading}
        title="Delete Act"
        description="Are you sure you want to delete this act? This action cannot be undone."
      />
    </div>
  )
}

export default Acts
