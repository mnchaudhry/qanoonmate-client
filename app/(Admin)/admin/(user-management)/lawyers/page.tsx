'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table'
import { PlusCircle, Edit2, Eye, CheckCircle } from 'lucide-react'
import AddLawyerModal from './_components/AddLawyerModal'
import ViewLawyerModal from './_components/ViewLawyerModal'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { getLawyers } from '@/store/reducers/lawyerSlice'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader } from '../../../_components/PageHeader'
import { Lawyer } from '@/store/types/lawyer.types'
import { AccountStatus, ConsultationMode } from '@/lib/enums'
import SearchBar from '@/components/SearchBar'
import { AdminSkeleton } from '@/components/skeletons'

const PAGE_SIZE = 20;

const LawyersPage = () => {
  ////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { lawyers = [], isLoading, totalPages, totalCount } = useSelector((state: RootState) => state.lawyer)

  ////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
  const [search, setSearch] = useState('')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null)
  const [editLawyer, setEditLawyer] = useState<Lawyer | null>(null)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [disableLoading, setDisableLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [filterSpecialization, setFilterSpecialization] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterVerified, setFilterVerified] = useState('all')
  const [sort, setSort] = useState('latest')

  ////////////////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////////////////////////
  useEffect(() => {
    dispatch(getLawyers({
      page,
      limit: PAGE_SIZE,
      search: search || undefined,
      // specialization: filterSpecialization !== 'all' ? filterSpecialization : undefined,
      // status: filterStatus !== 'all' ? filterStatus : undefined,
      // verified: filterVerified !== 'all' ? filterVerified === 'verified' : undefined,
      sort: sort || undefined,
    }))
  }, [dispatch, page, search, filterSpecialization, filterStatus, filterVerified, sort])

  // Reset page to 1 on search/filter/sort change
  useEffect(() => { setPage(1) }, [search, filterSpecialization, filterStatus, filterVerified, sort])

  ////////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////////
  const handleEdit = (lawyer: Lawyer) => {
    setEditLawyer(lawyer)
    setAddModalOpen(true)
  }

  const handleAdd = () => {
    setEditLawyer(null)
    setAddModalOpen(true)
  }

  const handleModalClose = () => {
    setAddModalOpen(false)
    setEditLawyer(null)
  }

  const handleLawyerSaved = () => {
    dispatch(getLawyers({
      page,
      limit: PAGE_SIZE,
      search: search || undefined,
      // specialization: filterSpecialization !== 'all' ? filterSpecialization : undefined,
      // status: filterStatus !== 'all' ? filterStatus : undefined,
      // verified: filterVerified !== 'all' ? filterVerified === 'verified' : undefined,
      sort: sort || undefined,
    }))
  }

  const handleView = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer)
    setViewModalOpen(true)
  }

  const handleCloseViewModal = () => {
    setViewModalOpen(false)
    setSelectedLawyer(null)
  }

  const handleVerify = async (id: string) => {
    setVerifyLoading(true)
    try {
      // await dispatch(verifyLawyer(id)).unwrap()
      // Refresh lawyers list
      dispatch(getLawyers({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        // specialization: filterSpecialization !== 'all' ? filterSpecialization : undefined,
        // status: filterStatus !== 'all' ? filterStatus : undefined,
        // verified: filterVerified !== 'all' ? filterVerified === 'verified' : undefined,
        sort: sort || undefined,
      }))
      // Close modal if lawyer was being viewed
      if (selectedLawyer && selectedLawyer._id === id) {
        setViewModalOpen(false)
        setSelectedLawyer(null)
      }
    } catch (error) {
      console.error('Error verifying lawyer:', error)
    } finally {
      setVerifyLoading(false)
    }
  }

  const handleDisable = async (id: string) => {
    setDisableLoading(true)
    try {
      // await dispatch(disableLawyer(id)).unwrap()
      // Refresh lawyers list
      dispatch(getLawyers({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        // specialization: filterSpecialization !== 'all' ? filterSpecialization : undefined,
        // status: filterStatus !== 'all' ? filterStatus : undefined,
        // verified: filterVerified !== 'all' ? filterVerified === 'verified' : undefined,
        sort: sort || undefined,
      }))
      // Close modal if lawyer was being viewed
      if (selectedLawyer && selectedLawyer._id === id) {
        setViewModalOpen(false)
        setSelectedLawyer(null)
      }
    } catch (error) {
      console.error('Error disabling lawyer:', error)
    } finally {
      setDisableLoading(false)
    }
  }

  const getStatusBadge = (lawyer: Lawyer) => {
    if (lawyer.accountStatus === AccountStatus.ACTIVE) {
      return <Badge variant="default">Active</Badge>
    }
    return <Badge variant="destructive">Inactive</Badge>
  }

  //////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
  return (
    <>
      <AddLawyerModal
        open={addModalOpen}
        onClose={handleModalClose}
        lawyer={editLawyer}
        onLawyerSaved={handleLawyerSaved}
      />

      <ViewLawyerModal
        open={viewModalOpen}
        onClose={handleCloseViewModal}
        lawyer={selectedLawyer}
        onVerify={handleVerify}
        onDisable={handleDisable}
        isVerifying={verifyLoading}
        isDisabling={disableLoading}
      />

      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Lawyers Management"
          description={`Manage registered lawyers (${totalCount} total)`}
          actions={
            <Button onClick={handleAdd}>
              <PlusCircle className="h-4 w-4" />
              Add New Lawyer
            </Button>
          }
        />

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 mt-6">
          <div className="flex gap-2 items-center flex-wrap">
            <SearchBar
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              containerClassName="mb-0 mx-0"
              className="max-w-xs"
            />

            <Select value={filterSpecialization} onValueChange={setFilterSpecialization}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                <SelectItem value="Criminal Law">Criminal Law</SelectItem>
                <SelectItem value="Civil Law">Civil Law</SelectItem>
                <SelectItem value="Family Law">Family Law</SelectItem>
                <SelectItem value="Corporate Law">Corporate Law</SelectItem>
                <SelectItem value="Property Law">Property Law</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterVerified} onValueChange={setFilterVerified}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="experience">Experience</SelectItem>
              <SelectItem value="fee">Fee (Low to High)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <AdminSkeleton />
        )}

        {/* Lawyers Table */}
        {!isLoading && lawyers.length > 0 ? (
          <div className="bg-white rounded-lg border">
            <Table>
              <TableCaption>
                Showing {lawyers.length} of {totalCount} lawyers
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lawyers.map((lawyer) => (
                  <TableRow key={lawyer._id}>
                    <TableCell className="font-medium">
                      {lawyer.firstname} {lawyer.lastname}
                    </TableCell>
                    <TableCell>{lawyer.email}</TableCell>
                    <TableCell>{lawyer.phone}</TableCell>
                    <TableCell>
                      {lawyer.location?.city}, {lawyer.location?.province}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {lawyer.specializations?.slice(0, 2).map((spec, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                        {lawyer.specializations?.length && lawyer.specializations?.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{lawyer.specializations?.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{lawyer.experience} years</TableCell>
                    <TableCell>PKR {lawyer.settings?.consultation?.fees?.find(f => f.mode === ConsultationMode.VIDEO_CALL)?.amount || 3000}</TableCell>
                    <TableCell>{getStatusBadge(lawyer)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(lawyer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!lawyer.identityVerified && (
                          <Button
                            size="sm"
                            onClick={() => handleVerify(lawyer._id!)}
                            disabled={verifyLoading}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(lawyer)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          !isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No lawyers found.</p>
              <Button onClick={handleAdd} className="mt-4">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add First Lawyer
              </Button>
            </div>
          )
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default LawyersPage
