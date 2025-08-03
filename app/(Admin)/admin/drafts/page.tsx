"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trash2, UploadCloud, ExternalLink, Download } from 'lucide-react'
import UploadDraftModal from './UploadDrafts'
import SearchBar from './SearchBar'
import { toast } from 'sonner'
import { getDrafts, deleteDraft } from '@/store/api/index'
import { Badge } from '@/components/ui/badge'

interface Draft {
  _id: string
  title: string
  slug: string
  description?: string
  category?: string
  tags?: string[]
  fileUrl: string
  format: 'pdf' | 'docx'
  isFree: boolean
  createdAt: string
}

const Drafts = () => {
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [page, setPage] = useState(1)

  const fetchDrafts = useCallback(async () => {
    setLoading(true)
    try {
      const response = await getDrafts({ page: page, limit: 20 })
      if (response.data?.success) {
        // setDrafts(response.data.data || [])
      } else {
        throw new Error(response.data?.message || 'Failed to fetch drafts')
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch drafts")
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchDrafts()
  }, [page, fetchDrafts])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this draft?")) return
    try {
      const response = await deleteDraft(id)
      if (response.data?.success) {
        setDrafts(prev => prev.filter(d => d._id !== id))
        toast.success("Draft deleted successfully")
      } else {
        throw new Error(response.data?.message || 'Failed to delete draft')
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete draft")
    }
  }

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url)
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

  const filteredDrafts = drafts.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.description?.toLowerCase().includes(search.toLowerCase()) ||
    d.category?.toLowerCase().includes(search.toLowerCase()) ||
    d.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <SearchBar value={search} onChange={e => setSearch(e.target.value)} />
        <Button onClick={() => setUploadModalOpen(true)} className="flex gap-2">
          <UploadCloud size={18} />
          Upload Draft
        </Button>
      </div>

      <UploadDraftModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={fetchDrafts}
      />

      <Table>
        <TableCaption>{loading ? "Loading drafts..." : filteredDrafts.length ? "List of uploaded drafts" : "No drafts found"}</TableCaption>
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
              <TableCell>{new Date(draft.createdAt).toLocaleDateString()}</TableCell>
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
                    onClick={() => handleDelete(draft._id)}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
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
          disabled={filteredDrafts.length < 20}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default Drafts