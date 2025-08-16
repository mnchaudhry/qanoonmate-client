"use client"

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchAdminFaqs, createAdminFaq, updateAdminFaq, deleteAdminFaq, verifyAdminFaq, } from "@/store/reducers/faqSlice";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCircle, Edit2, PlusCircle } from "lucide-react";
import AddFaqModal from './_components/AddFaqModal';
import AlertModal from '@/components/alert-modal';
import { LawCategory } from '@/lib/enums';
import { Pagination } from '@/components/ui/pagination';
import { PageHeader } from '@/app/(Admin)/_components/PageHeader';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { enumToLabel } from '@/lib/utils'
import SearchBar from '@/components/SearchBar'

const PAGE_SIZE = 40;

const AdminFaqPage = () => {
  //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const { faqs, loading, currentPage: page, totalPages, totalCount: total } = useSelector((state: RootState) => state.faq);

  //////////////////////////////////////////////////// STATES ////////////////////////////////////////////////
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [modalInitialData, setModalInitialData] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [localPage, setLocalPage] = useState(1);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('latest');

  //////////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////
  useEffect(() => {
    dispatch(fetchAdminFaqs({
      page: localPage,
      limit: PAGE_SIZE,
      search: search || undefined,
      category: category !== 'all' ? category : undefined,
      sort: sort || undefined,
    }));
  }, [dispatch, localPage, search, category, sort]);

  // Reset page to 1 on search/category/sort change
  useEffect(() => { setLocalPage(1); }, [search, category, sort]);

  //////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////
  const openAddModal = () => {
    setEditId(null);
    setModalInitialData(null);
    setModalOpen(true);
  };

  const openEditModal = (faq: any) => {
    setEditId(faq._id);
    setModalInitialData(faq);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    await dispatch(deleteAdminFaq(deleteId));
    setDeleteLoading(false);
    setDeleteId(null);
    dispatch(fetchAdminFaqs({ page, limit: PAGE_SIZE, search: search || undefined, category: category !== 'all' ? category : undefined, sort: sort || undefined }));
  };

  const handleVerify = async (id: string) => {
    await dispatch(verifyAdminFaq(id));
    dispatch(fetchAdminFaqs({ page, limit: PAGE_SIZE, search: search || undefined, category: category !== 'all' ? category : undefined, sort: sort || undefined }));
  };

  const handleModalSubmit = async (form: any) => {
    if (editId) {
      await dispatch(updateAdminFaq({ id: editId, formData: form }));
    } else {
      await dispatch(createAdminFaq(form));
    }
    setModalOpen(false);
    setEditId(null);
    setModalInitialData(null);
    dispatch(fetchAdminFaqs({ page, limit: PAGE_SIZE, search: search || undefined, category: category !== 'all' ? category : undefined, sort: sort || undefined }));
  }

  //////////////////////////////////////////////////// RENDER /////////////////////////////////////////////
  return (
    <div className="space-y-6">
      <PageHeader
        title="FAQs"
        description="View and manage FAQs."
        actions={
          <Button onClick={openAddModal} className="flex gap-2">
            <PlusCircle size={18} /> Add FAQ
          </Button>
        }
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div className="flex gap-2 justify-between items-center w-full">
          <SearchBar
            placeholder="Search FAQs..."
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
      </div>
      {/* Modal */}
      <AddFaqModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={modalInitialData}
        loading={loading}
      />

      {/* Table */}
      <Table>
        <TableCaption>
          {loading
            ? "Loading FAQs..."
            : faqs.length
              ? `Showing ${faqs.length} of ${total || faqs.length} FAQs (Page ${page || 1} of ${totalPages || 1})`
              : "No FAQs found"}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Answer</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Urdu Q/A</TableHead>
            <TableHead>Related Laws</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faqs && faqs.map((faq) => (
            <TableRow key={faq._id}>
              <TableCell className="font-medium max-w-xs truncate">{faq.question}</TableCell>
              <TableCell className="max-w-xs truncate">{faq.answer}</TableCell>
              <TableCell>{faq.category || "-"}</TableCell>
              <TableCell>
                {faq.tags && faq.tags.length > 0
                  ? faq.tags.map((t: string) => (
                    <Badge key={t} variant="secondary" className="mr-1 mb-1 text-xs">
                      {t}
                    </Badge>
                  ))
                  : "-"}
              </TableCell>
              <TableCell>
                {(faq.urduTranslation?.question || faq.urduTranslation?.answer) ? (
                  <div>
                    <div className="text-xs text-muted-foreground">Q: {faq.urduTranslation?.question || '-'} </div>
                    <div className="text-xs text-muted-foreground">A: {faq.urduTranslation?.answer || '-'} </div>
                  </div>
                ) : "-"}
              </TableCell>
              <TableCell>
                {faq.relatedLaws && faq.relatedLaws.length > 0
                  ? faq.relatedLaws.map((law: string) => (
                    <Badge key={law} variant="outline" className="mr-1 mb-1 text-xs">
                      {law}
                    </Badge>
                  ))
                  : "-"}
              </TableCell>
              <TableCell>
                {faq.isApproved ? (
                  <Badge variant="secondary">Verified</Badge>
                ) : (
                  <Badge variant="outline">Pending</Badge>
                )}
              </TableCell>
              <TableCell>
                {faq.createdAt ? new Date(faq.createdAt).toLocaleDateString() : "-"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditModal(faq)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(faq._id!)}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                  {!faq.isApproved && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleVerify(faq._id!)}
                    >
                      <CheckCircle size={16} className="text-green-600" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        currentPage={localPage}
        onPageChange={setLocalPage}
        totalPages={totalPages || 1}
      />
      <AlertModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onSubmit={handleDelete}
        loading={deleteLoading}
        title="Delete FAQ"
        description="Are you sure you want to delete this FAQ? This action cannot be undone."
      />
    </div>
  );
};

export default AdminFaqPage;