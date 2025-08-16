'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2, PlusCircle, Edit2, Download } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { fetchCaseLaws, deleteCaseLawThunk } from '@/store/reducers/caseLawSlice'
import { LawCategory } from '@/lib/enums'
import AddCaseLawModal from './_components/AddCaseLawModal'
import AlertModal from '@/components/alert-modal'
import { Pagination } from '@/components/ui/pagination'
import { CaseLaw } from '@/store/types/api'
import { PageHeader } from '@/app/(Admin)/_components/PageHeader'
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from '@/components/ui/select'
import { enumToLabel } from '@/lib/utils'
import SearchBar from '@/components/SearchBar'

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


  //////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
  return (
    <div className="space-y-6">
      <PageHeader
        title="Case Laws"
        description="Manage case laws and judgments."
        actions={
          <Button
            onClick={() => setAddModalOpen(true)}
            className="flex gap-2"
          >
            <PlusCircle size={18} />
            Add Case Law
          </Button>
        }
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <SearchBar
          placeholder="Search case laws..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          containerClassName='mx-0 mb-0 w-1/3'
        />


        <div className="flex gap-4">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="min-w-[160px] bg-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.values(LawCategory).map(area => (
                <SelectItem key={area} value={area}>{enumToLabel(area)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="min-w-[160px] bg-white">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="alphabetical">Alphabetical (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
