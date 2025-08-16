"use client"

import React, { Dispatch, SetStateAction } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload } from 'lucide-react'
import SearchBar from '@/components/SearchBar'

interface DocumentsToolbarProps {
  searchQuery: string
  setSearchQuery: Dispatch<SetStateAction<string>>
  typeFilter: string
  setTypeFilter: (filter: string) => void
  onUploadClick: () => void
}

const DocumentsToolbar: React.FC<DocumentsToolbarProps> = ({ searchQuery, setSearchQuery, typeFilter, setTypeFilter, onUploadClick }) => {

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full">
      <SearchBar
        placeholder="Search Documents..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        containerClassName="max-w-md w-full mb-0 mx-0"
      />

      <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full justify-end items-end">
        <Select value={typeFilter} onValueChange={setTypeFilter} >
          <SelectTrigger className="w-40 h-[42px] ">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="fir">FIR</SelectItem>
            <SelectItem value="notice">Notice</SelectItem>
            <SelectItem value="agreement">Agreement</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={onUploadClick}
          className=''
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>

    </div>
  )
}

export default DocumentsToolbar
