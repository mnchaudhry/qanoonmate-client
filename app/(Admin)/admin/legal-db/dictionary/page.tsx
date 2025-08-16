"use client"

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchAdminDictionaryTerms, createAdminDictionaryTerm, updateAdminDictionaryTerm, deleteAdminDictionaryTerm, verifyAdminDictionaryTerm, } from "@/store/reducers/dictionarySlice";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, PlusCircle, CheckCircle, Edit2 } from "lucide-react";
import AddDictionaryTermModal from './_components/AddDictionaryTermModal';
import AlertModal from '@/components/alert-modal';
import { Pagination } from '@/components/ui/pagination';
import { LawCategory } from '@/lib/enums';
import { PageHeader } from '@/app/(Admin)/_components/PageHeader';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { enumToLabel } from '@/lib/utils'
import SearchBar from '@/components/SearchBar'

const LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const PAGE_SIZE = 20;

const AdminDictionaryPage = () => {
  //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const { terms, loading, currentPage: totalPages, totalCount: total } = useSelector((state: RootState) => state.dictionary);

  //////////////////////////////////////////////////// STATES ////////////////////////////////////////////////
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [modalInitialData, setModalInitialData] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [localPage, setLocalPage] = useState(1);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState("latest");
  const [letter, setLetter] = useState<string>("");

  //////////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////
  useEffect(() => {
    dispatch(fetchAdminDictionaryTerms({
      search: search ? search : undefined,
      page: localPage,
      limit: PAGE_SIZE,
      sort: sort === "alphabetical" ? "alphabetical" : undefined,
      letter: letter || undefined,
      category: category !== 'all' ? category : undefined,
    }));
  }, [dispatch, search, localPage, sort, letter, category]);

  // Reset page to 1 when filters/search/letter change
  useEffect(() => { setLocalPage(1); }, [search, sort, letter, category]);

  //////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////
  const openAddModal = () => {
    setEditId(null);
    setModalInitialData(null);
    setModalOpen(true);
  };

  const openEditModal = (term: any) => {
    setEditId(term._id);
    setModalInitialData(term);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    await dispatch(deleteAdminDictionaryTerm(deleteId));
    setDeleteLoading(false);
    setDeleteId(null);
    dispatch(fetchAdminDictionaryTerms({ search, page: localPage, limit: PAGE_SIZE, sort, letter, category }));
  };

  const handleVerify = async (id: string) => {
    await dispatch(verifyAdminDictionaryTerm(id));
    dispatch(fetchAdminDictionaryTerms({ search, page: localPage, limit: PAGE_SIZE, sort, letter, category }));
  };

  const handleModalSubmit = async (form: any) => {
    if (editId) {
      await dispatch(updateAdminDictionaryTerm({ id: editId, formData: form }));
    } else {
      await dispatch(createAdminDictionaryTerm(form));
    }
    setModalOpen(false);
    setEditId(null);
    setModalInitialData(null);
    dispatch(fetchAdminDictionaryTerms({ search, page: localPage, limit: PAGE_SIZE, sort, letter, category }));
  };

  //////////////////////////////////////////////////// RENDER /////////////////////////////////////////////
  return (
    <div className="space-y-6">

      <PageHeader
        title="Dictionary"
        description="View and manage dictionary terms."
        actions={
          <Button onClick={openAddModal} className="flex gap-2">
            <PlusCircle size={18} /> Add Dictionary Term
          </Button>
        }
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div className="flex gap-2 justify-between items-center w-full">
          <SearchBar
            placeholder="Search dictionary..."
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

            <Select value={letter || ''} onValueChange={setLetter}>
              <SelectTrigger className="min-w-[100px] bg-white">
                <SelectValue placeholder="Letter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {LETTERS.map(l => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        </div>
      </div>

      {/* Modal */}
      <AddDictionaryTermModal
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
            ? "Loading terms..."
            : terms.length
              ? `Showing ${terms.length} of ${total} terms`
              : "No terms found"}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Term</TableHead>
            <TableHead>Formal Definition</TableHead>
            <TableHead>Common Explanation</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Urdu</TableHead>
            <TableHead>Usage Example</TableHead>
            <TableHead>Related Terms</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {terms && terms.map((term) => (
            <TableRow key={term._id}>
              <TableCell className="font-medium">{term.term}</TableCell>
              <TableCell className="max-w-xs truncate">{term.formalDefinition}</TableCell>
              <TableCell className="max-w-xs truncate">{term.commonExplanation}</TableCell>
              <TableCell>{term.category || "-"}</TableCell>
              <TableCell>{term.urduTranslation || "-"}</TableCell>
              <TableCell className="max-w-xs truncate">{term.usageExample || "-"}</TableCell>
              <TableCell>
                {term.relatedTerms && term.relatedTerms.length > 0
                  ? term.relatedTerms.map((t) => (
                    <Badge key={t} variant="secondary" className="mr-1 mb-1 text-xs">
                      {t}
                    </Badge>
                  ))
                  : "-"}
              </TableCell>
              <TableCell>
                {term.isApproved ? (
                  <Badge variant="secondary">Verified</Badge>
                ) : (
                  <Badge variant="outline">Pending</Badge>
                )}
              </TableCell>
              <TableCell>
                {term.createdAt ? new Date(term.createdAt).toLocaleDateString() : "-"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditModal(term)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(term._id!)}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                  {!term.isApproved && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleVerify(term._id!)}
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
        title="Delete Term"
        description="Are you sure you want to delete this term? This action cannot be undone."
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onSubmit={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
};

export default AdminDictionaryPage;