'use client'

import React, { useEffect, useState } from 'react'
import ViewConsultationModal from './_components/ViewConsultationModal'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { getConsultations, confirmConsultation, startConsultation, completeConsultation, markAsNoShow, cancelConsultation } from '@/store/reducers/consultationSlice'
import AlertModal from '@/components/alert-modal'
import { ConsultationsFilterActionBar, ConsultationsTable, ConsultationsSummaryStats } from './_components'
import { PageHeader } from '../../_components/PageHeader'
import { Consultation } from '@/store/types/api'
import AdminSkeleton from '@/components/skeletons/AdminPageSkeleton'

const PAGE_SIZE = 10;

const ConsultationsPage = () => {
  //////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const { consultations = [], isLoading, totalPages, totalCount } = useSelector((state: RootState) => state.consultation)

  //////////////////////////////////////////////// STATES ////////////////////////////////////////////////////////
  const [search, setSearch] = useState('')
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showBulkActionsDropdown, setShowBulkActionsDropdown] = useState(false)
  const [selectedConsultations, setSelectedConsultations] = useState<string[]>([])
  const [alertModal, setAlertModal] = useState<{ open: boolean; title: string; description: string; onConfirm: () => void; }>({ open: false, title: '', description: '', onConfirm: () => { } })

  //////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////////////
  useEffect(() => {
    dispatch(getConsultations({
      page,
      limit: PAGE_SIZE,
      // search: search || undefined,
      // status: filterStatus !== 'all' ? filterStatus : undefined,

    }))
  }, [dispatch, page, search, filterStatus])

  // Reset page to 1 on search/filter change
  useEffect(() => { setPage(1) }, [search, filterStatus])

  //////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////
  const handleView = (consultation: Consultation) => {
    setSelectedConsultation(consultation)
    setViewModalOpen(true)
  }

  const handleCloseViewModal = () => {
    setViewModalOpen(false)
    setSelectedConsultation(null)
  }

  const refreshConsultations = () => {
    dispatch(getConsultations({
      page,
      limit: PAGE_SIZE,
      // search: search || undefined,
      // status: filterStatus !== 'all' ? filterStatus : undefined,
    }))
  }

  const handleConfirm = async (id: string) => {
    setActionLoading(true)
    try {
      await dispatch(confirmConsultation(id)).unwrap()
      refreshConsultations()
      if (selectedConsultation && selectedConsultation._id === id) {
        setViewModalOpen(false)
        setSelectedConsultation(null)
      }
    } catch (error) {
      console.error('Error confirming consultation:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleStart = async (id: string, formData: any) => {
    setActionLoading(true)
    try {
      await dispatch(startConsultation({ id, formData })).unwrap()
      refreshConsultations()
      if (selectedConsultation && selectedConsultation._id === id) {
        setViewModalOpen(false)
        setSelectedConsultation(null)
      }
    } catch (error) {
      console.error('Error starting consultation:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleComplete = async (id: string, formData: any) => {
    setActionLoading(true)
    try {
      await dispatch(completeConsultation({ id, formData })).unwrap()
      refreshConsultations()
      if (selectedConsultation && selectedConsultation._id === id) {
        setViewModalOpen(false)
        setSelectedConsultation(null)
      }
    } catch (error) {
      console.error('Error completing consultation:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleNoShow = async (id: string) => {
    setAlertModal({
      open: true,
      title: 'Mark as No-Show',
      description: 'Are you sure you want to mark this consultation as no-show? This action cannot be undone.',
      onConfirm: async () => {
        setActionLoading(true)
        try {
          await dispatch(markAsNoShow(id)).unwrap()
          refreshConsultations()
          if (selectedConsultation && selectedConsultation._id === id) {
            setViewModalOpen(false)
            setSelectedConsultation(null)
          }
        } catch (error) {
          console.error('Error marking as no-show:', error)
        } finally {
          setActionLoading(false)
          setAlertModal({ ...alertModal, open: false })
        }
      }
    })
  }

  const handleCancel = async (id: string, formData: any) => {
    setActionLoading(true)
    try {
      await dispatch(cancelConsultation({ id, reason: formData.reason })).unwrap()
      refreshConsultations()
      if (selectedConsultation && selectedConsultation._id === id) {
        setViewModalOpen(false)
        setSelectedConsultation(null)
      }
    } catch (error) {
      console.error('Error cancelling consultation:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const generatePageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (page >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const handleExportCSV = () => {
    console.log('Export CSV')
  }

  const handleCalendarView = () => {
    console.log('Calendar View')
  }

  const handleBulkAction = (action: string) => {
    console.log('Bulk Action:', action, selectedConsultations)
  }

  const handleSelectConsultation = (consultationId: string) => {
    setSelectedConsultations(prev =>
      prev.includes(consultationId)
        ? prev.filter(id => id !== consultationId)
        : [...prev, consultationId]
    )
  }

  const handleSelectAll = () => {
    if (selectedConsultations.length === consultations.length) {
      setSelectedConsultations([])
    } else {
      setSelectedConsultations(consultations.map(c => c._id!))
    }
  }

  // Calculate statistics
  const completedCount = consultations.filter(c => c.status?.toLowerCase() === 'completed').length
  const cancelledCount = consultations.filter(c => c.status?.toLowerCase() === 'cancelled').length
  const disputedCount = consultations.filter(c => c.status?.toLowerCase() === 'disputed').length
  const missedCount = consultations.filter(c => ['no_show', 'missed'].includes(c.status?.toLowerCase() || '')).length
  const totalRevenue = consultations.reduce((sum, c) => sum + (c.fee || 0), 0)

  //////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
  return (
    <div className="space-y-6">
      <PageHeader
        title="Consultations Management"
        description="Manage and monitor all consultation sessions, schedules, and client interactions."
      />

      <ConsultationsFilterActionBar
        search={search}
        setSearch={setSearch}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        showStatusDropdown={showStatusDropdown}
        setShowStatusDropdown={setShowStatusDropdown}
        showBulkActionsDropdown={showBulkActionsDropdown}
        setShowBulkActionsDropdown={setShowBulkActionsDropdown}
        handleExportCSV={handleExportCSV}
        handleCalendarView={handleCalendarView}
        handleBulkAction={handleBulkAction}
        refreshConsultations={refreshConsultations}
      />

      {isLoading && (
        <AdminSkeleton showStats={true} statsCount={6} />
      )}

      {!isLoading && consultations.length > 0 ? (
        <ConsultationsTable
          consultations={consultations}
          selectedConsultations={selectedConsultations}
          handleView={handleView}
          handleSelectConsultation={handleSelectConsultation}
          handleSelectAll={handleSelectAll}
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          setPage={setPage}
          generatePageNumbers={generatePageNumbers}
          PAGE_SIZE={PAGE_SIZE}
        />
      ) : (
        !isLoading && (
          <div className="bg-card border !border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground">No consultations found.</p>
          </div>
        )
      )}

      <ConsultationsSummaryStats
        totalCount={totalCount}
        completedCount={completedCount}
        cancelledCount={cancelledCount}
        disputedCount={disputedCount}
        missedCount={missedCount}
        totalRevenue={totalRevenue}
      />

      <ViewConsultationModal
        open={viewModalOpen}
        onClose={handleCloseViewModal}
        consultation={selectedConsultation}
        onConfirm={handleConfirm}
        onStart={handleStart}
        onComplete={handleComplete}
        onNoShow={handleNoShow}
        onCancel={handleCancel}
        isActioning={actionLoading}
      />

      <AlertModal
        open={alertModal.open}
        onClose={() => setAlertModal({ ...alertModal, open: false })}
        onSubmit={alertModal.onConfirm}
        loading={actionLoading}
        title={alertModal.title}
        description={alertModal.description}
      />
    </div>
  )
}

export default ConsultationsPage