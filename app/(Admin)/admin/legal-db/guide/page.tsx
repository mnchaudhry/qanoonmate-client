"use client"

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { getAdminGuides, createAdminGuide, updateAdminGuide, deleteAdminGuide, verifyAdminGuide, } from '@/store/reducers/guideSlice';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCircle, Edit2, PlusCircle } from "lucide-react";
import AddGuideModal from './_components/AddGuideModal';
import AlertModal from '@/components/alert-modal';
import { LawCategory } from '@/lib/enums';
import { Pagination } from '@/components/ui/pagination';
import { PageHeader } from '@/app/(Admin)/_components/PageHeader';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { enumToLabel } from '@/lib/utils'
import SearchBar from '@/components/SearchBar'

const PAGE_SIZE = 40;

const AdminGuidePage = () => {
  //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const { guides, currentPage: totalPages } = useSelector((state: RootState) => state.guide);

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
  const [loading, setLoading] = useState(false);

  //////////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////
  useEffect(() => {
    setLoading(true);
    dispatch(getAdminGuides({
      page: localPage,
      limit: PAGE_SIZE,
      search: search || undefined,
      category: category !== 'all' ? category : undefined,
      sort: sort || undefined,
    }))
      .finally(() => setLoading(false));
  }, [dispatch, localPage, search, category, sort]);
  useEffect(() => { setLocalPage(1); }, [search, category, sort]);

  //////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////
  const openAddModal = () => {
    setEditId(null);
    setModalInitialData(null);
    setModalOpen(true);
  };

  const openEditModal = (guide: any) => {
    setEditId(guide._id);
    setModalInitialData(guide);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    await dispatch(deleteAdminGuide(deleteId));
    setDeleteLoading(false);
    setDeleteId(null);
    dispatch(getAdminGuides({ search }));
  };

  const handleVerify = async (id: string) => {
    await dispatch(verifyAdminGuide({ id }));
    dispatch(getAdminGuides({ search }));
  };

  const handleModalSubmit = async (form: any) => {
    if (editId) {
      await dispatch(updateAdminGuide({ id: editId, formData: form }));
    } else {
      await dispatch(createAdminGuide(form));
    }
    setModalOpen(false);
    setEditId(null);
    setModalInitialData(null);
    dispatch(getAdminGuides({ search }));
  };

  console.log('guides', guides)
  //////////////////////////////////////////////////// RENDER /////////////////////////////////////////////
  return (
    <div className="space-y-6">

      <PageHeader
        title="Guides"
        description="View and manage guides."
        actions={
          <Button onClick={openAddModal} className="flex gap-2">
            <PlusCircle size={18} /> Add Guide
          </Button>
        }
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div className="flex gap-2 justify-between items-center w-full">
          <SearchBar
            placeholder="Search acts..."
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

      <AddGuideModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={modalInitialData}
        loading={loading}
      />

      <Table>
        <TableCaption>
          {loading
            ? "Loading Guides..."
            : guides.length > 0
              ? "List of Guides in the database"
              : "No Guides found"}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Overview</TableHead>
            <TableHead>Steps</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Jurisdiction</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guides && guides.map((guide) => (
            <TableRow key={guide._id}>
              <TableCell className="font-medium max-w-xs truncate">{guide.title}</TableCell>
              <TableCell className="max-w-xs truncate">{guide.overview}</TableCell>
              <TableCell>
                {guide.steps && guide.steps.length > 0
                  ? guide.steps.map((s: any, idx: number) => (
                    <Badge key={idx} variant="secondary" className="mr-1 mb-1 text-xs">
                      {s.stepTitle}
                    </Badge>
                  ))
                  : "-"}
              </TableCell>
              <TableCell>{guide.category || "-"}</TableCell>
              <TableCell>{guide.jurisdiction || "-"}</TableCell>
              <TableCell>
                {guide.isApproved ? (
                  <Badge variant="secondary">Verified</Badge>
                ) : (
                  <Badge variant="outline">Pending</Badge>
                )}
              </TableCell>
              <TableCell>
                {guide.createdAt ? new Date(guide.createdAt).toLocaleDateString() : "-"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditModal(guide)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(guide._id!)}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                  {!guide.isApproved && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleVerify(guide._id!)}
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
        title="Delete Guide"
        description="Are you sure you want to delete this Guide? This action cannot be undone."
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onSubmit={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
};

export default AdminGuidePage;