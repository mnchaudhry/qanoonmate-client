"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Trash2, UploadCloud, ExternalLink, Download } from 'lucide-react'
import UploadDraftModal from './UploadDrafts'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/app/(Gated)/(Admin)/_components/PageHeader'
import AdminSkeleton from '@/components/skeletons/AdminPageSkeleton'
import SearchBar from '@/components/SearchBar'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { getDrafts as fetchDrafts, deleteDraft as removeDraft } from '@/store/reducers/draftSlice'

const PAGE_SIZE = 20

const Drafts = () => {

  //////////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { drafts, isLoading, totalPages } = useSelector((s: RootState) => s.draft)

  //////////////////////////////////////////////////////// STATES ////////////////////////////////////////////////////////
  const [search, setSearch] = useState("")
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('all')

  //////////////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////////////////
  const getDrafts = useCallback(() => {
    dispatch(fetchDrafts({ page, limit: PAGE_SIZE, search: search || undefined, category: category === 'all' ? undefined : category }))
      .unwrap()
      .catch((e: any) => toast.error(e?.message || 'Failed to fetch drafts'))
  }, [category, dispatch, page, search])

  useEffect(() => {
    getDrafts()
  }, [page, category, search, getDrafts])

  //////////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////////
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this draft?")) return
    try {
      await dispatch(removeDraft(id)).unwrap()
      toast.success("Draft deleted successfully")
      getDrafts()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete draft")
    }
  }

  const handleDownload = async (url: string) => {
    try {
      const response = await getDrafts()
      // @ts-expect-error - response is a void function
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = url.split('/').pop() || 'draft'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(downloadUrl)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Failed to download draft:", error)
      toast.error("Failed to download draft")
    }
  }

  //////////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////////
  const filteredDrafts = drafts.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    (d.description || '').toLowerCase().includes(search.toLowerCase()) ||
    (d.category || '').toLowerCase().includes(search.toLowerCase()) ||
    (d.tags || []).some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  )

  //////////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////////
  return (
    <div className="space-y-6">
      <PageHeader
        title="Drafts"
        description="View and manage drafts."
        actions={<Button onClick={() => setUploadModalOpen(true)} className="flex gap-2">
          <UploadCloud size={18} />
          Upload Draft
        </Button>}
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <SearchBar
          value={search}
          onChange={e => setSearch(e.target.value)}
          containerClassName='mx-0 mb-0 w-1/3'
        />

        <div className="flex gap-4">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="min-w-[160px] bg-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="agreement">Agreement</SelectItem>
              <SelectItem value="petition">Petition</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <UploadDraftModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={getDrafts}
      />

      {isLoading ? (
        <AdminSkeleton tableRows={6} />
      ) : (
        <Table>
          <TableCaption>{filteredDrafts.length ? "List of uploaded drafts" : "No drafts found"}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Access</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrafts.map(draft => (
              <TableRow key={draft._id}>
                <TableCell className="font-medium">{draft.title}</TableCell>
                <TableCell className="max-w-xs truncate">{draft.description || "-"}</TableCell>
                <TableCell>
                  {draft.category ? (
                    <Badge variant="secondary">{draft.category}</Badge>
                  ) : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {draft.tags?.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{draft.format}</TableCell>
                <TableCell>
                  <Badge variant={draft.isFree ? "default" : "secondary"}>
                    {draft.isFree ? "Free" : "Paid"}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(draft.createdAt || '').toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(draft.fileUrl, '_blank')}
                    >
                      <ExternalLink size={16} className="text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(draft.fileUrl)}
                    >
                      <Download size={16} className="text-green-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(draft._id || '')}
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {!isLoading && (
        <div className="flex justify-end mt-4 gap-4">
          <Button
            variant="outline"
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage(prev => prev + 1)}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

export default Drafts