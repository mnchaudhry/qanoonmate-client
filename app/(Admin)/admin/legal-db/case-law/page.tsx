'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2, PlusCircle, Edit2, Download } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { fetchCaseLaws, deleteCaseLawThunk } from '@/store/reducers/caseLawSlice'
import { Input } from '@/components/ui/input'
import { LawCategory } from '@/lib/enums'
import AddCaseLawModal from './_components/AddCaseLawModal'
import AlertModal from '@/components/alert-modal'
import { Pagination } from '@/components/ui/pagination'
import { CaseLaw } from '@/store/types/api'
import { PageHeader } from '@/app/(Admin)/_components/PageHeader'

const PAGE_SIZE = 40;

const CaseLaws = () => {
  //////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { caseLaws = [], loading, currentPage, totalPages, totalCount: totalCaseLaws } = useSelector((state: RootState) => state.caseLaw)

  //////////////////////////////////////////////// STATES ////////////////////////////////////////////////////////
  const [search, setSearch] = useState('')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editCaseLaw, setEditCaseLaw] = useState<CaseLaw | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('latest')

  //////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////////////
  useEffect(() => {
    dispatch(fetchCaseLaws({
      page,
      limit: PAGE_SIZE,
      search: search || undefined,
      lawCategory: category !== 'all' ? category : undefined,
      sort: sort || undefined,
    }))
  }, [dispatch, page, search, category, sort])

  // Reset page to 1 on search/category/sort change
  useEffect(() => { setPage(1) }, [search, category, sort])

  //////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////
  const handleDelete = async () => {
    if (!deleteTargetId) return
    setDeleteLoading(true)
    try {
      await dispatch(deleteCaseLawThunk(deleteTargetId)).unwrap()
      dispatch(fetchCaseLaws({ page, limit: PAGE_SIZE, search: search || undefined, lawCategory: category !== 'all' ? category : undefined, sort: sort || undefined }))
      setDeleteModalOpen(false)
      setDeleteTargetId(null)
    } catch (error) {
      console.error('Error deleting case law:', error)
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
        title="Case Laws"
        description="Manage case laws and judgments."
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div className="flex gap-2 items-center flex-wrap">
          <Input
            placeholder="Search case laws..."
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
          Add Case Law
        </Button>
      </div>

      <AddCaseLawModal
        open={addModalOpen || !!editCaseLaw}
        onClose={() => { setAddModalOpen(false); setEditCaseLaw(null); }}
        caseLaw={editCaseLaw}
      />

      <AlertModal
        open={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setDeleteTargetId(null); }}
        onSubmit={handleDelete}
        loading={deleteLoading}
        title="Delete Case Law"
        description="Are you sure you want to delete this case law? This action cannot be undone."
      />

      <Table>
        <TableCaption>
          {loading
            ? 'Loading case laws...'
            : caseLaws.length
              ? `Showing ${caseLaws.length} of ${totalCaseLaws || caseLaws.length} case laws (Page ${currentPage || page} of ${totalPages || 1})`
              : 'No case laws found'}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Court</TableHead>
            <TableHead>Citation</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Law Category</TableHead>
            <TableHead>Date of Judgement</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {caseLaws.map((cl) => {
            if (!cl._id) return null
            return (
              <TableRow key={cl._id}>
                <TableCell className="font-medium">{cl.title || '-'}</TableCell>
                <TableCell>{cl.court || '-'}</TableCell>
                <TableCell>{cl.citation || '-'}</TableCell>
                <TableCell>{cl.year || '-'}</TableCell>
                <TableCell>{cl.lawCategory || '-'}</TableCell>
                <TableCell>{cl.dateOfJudgement ? new Date(cl.dateOfJudgement).toLocaleDateString() : '-'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setDeleteTargetId(cl._id!);
                        setDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditCaseLaw({
                        ...cl,
                        pdfUrl: cl.pdfUrl ?? '',
                        dateOfJudgement: cl.dateOfJudgement ? new Date(cl.dateOfJudgement).toISOString() : '',
                        lawCategory: cl.lawCategory ?? ''
                      })}
                    >
                      <Edit2 size={16} className="text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => cl.pdfUrl && window.open(cl.pdfUrl, '_blank')}
                      disabled={!cl.pdfUrl}
                    >
                      <Download size={16} className="text-green-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage || page}
        onPageChange={setPage}
        totalPages={totalPages || 1}
      />
    </div>
  )
}

export default CaseLaws
