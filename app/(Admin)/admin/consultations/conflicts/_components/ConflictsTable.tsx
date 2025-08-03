import React from 'react'

interface Props {
  conflicts: any;
  selectedConflicts: any;
  handleViewDetails: any;
  handleSelectConflict: any;
  handleSelectAll: any;
  page: any;
  totalPages: any;
  totalCount: any;
  setPage: any;
  generatePageNumbers: any;
  PAGE_SIZE: any;
}

const ConflictsTable = ({ }: Props) => {
  return (
    <div>ConflictsTable</div>
  )
}

export default ConflictsTable