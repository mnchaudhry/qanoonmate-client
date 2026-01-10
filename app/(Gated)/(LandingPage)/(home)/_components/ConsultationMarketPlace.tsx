"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { ArrowRight, MapPin, Star } from 'lucide-react'
import Link from 'next/link'

import SectionHeading from './SectionHeading'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn, enumToLabel } from '@/lib/utils'
import * as api from '@/store/api'
import type { ILawyer } from '@/store/types/lawyer.types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import SearchBar from '@/components/SearchBar'
import { AccountStatus, LawCategory, PakistanCities } from '@/lib/enums'

type SortKey = 'relevance' | 'rating'

const Consultations: React.FC = () => {

  /////////////////////////////////////////////////////// STATE /////////////////////////////////////////////////////////
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPractice, setSelectedPractice] = useState<string>('All')
  const [selectedCity, setSelectedCity] = useState<string>('All')
  const [sortBy, setSortBy] = useState<SortKey>('relevance')
  const [page, setPage] = useState<number>(1)
  const pageSize = 9
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [allLawyers, setAllLawyers] = useState<ILawyer[]>([])

  /////////////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////////////
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.getAllLawyers({ page: 1, limit: 100, accountStatus: AccountStatus.ACTIVE })
        const list = data.data?.lawyers || []
        setAllLawyers(list)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, selectedPractice, selectedCity, sortBy])

  /////////////////////////////////////////////////////// MEMOIZED FUNCTIONS /////////////////////////////////////////////////////////
  const filteredLawyers = useMemo(() => {
    let list = [...allLawyers]

    // Text search across name, expertise, city
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(l =>
        l.fullName.toLowerCase().includes(q) ||
        l.firstname.toLowerCase().includes(q) ||
        l.lastname.toLowerCase().includes(q) ||
        l.location.city?.toLowerCase().includes(q) ||
        l.primarySpecialization?.toLowerCase().includes(q) ||
        l.specializations?.some(e => e.toLowerCase().includes(q))
      )
    }

    // Practice area
    if (selectedPractice !== 'All') {
      list = list.filter(l => l.specializations?.some(e => e === selectedPractice))
    }

    // City
    if (selectedCity !== 'All') {
      list = list.filter(l => l.location.city === selectedCity)
    }

    // Sorting
    list.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b?.avgRating || 0) - (a?.avgRating || 0)
        default:
          // relevance heuristic
          return 0
      }
    })

    return list
  }, [allLawyers, searchQuery, selectedPractice, selectedCity, sortBy])

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredLawyers.slice(start, start + pageSize)
  }, [filteredLawyers, page])


  /////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////
  return (
    <section className="">
      <div className="container px-4 mx-auto max-w-7xl md:px-6">
        <SectionHeading
          title="Our Legal Experts"
          topTitle="Book a Consultation with Legal Experts"
          description="Find and book the right lawyer by expertise, location, availability and rating."
        />

        {/* Top controls */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lawyers, specialties, or locations"
            containerClassName='mx-0 mb-0 w-full md:w-1/2'
          />

          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
              <SelectTrigger className="min-w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPractice} onValueChange={setSelectedPractice}>
              <SelectTrigger className="min-w-[160px] bg-white">
                <SelectValue placeholder="Practice area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {Object.values(LawCategory).map(area => (
                  <SelectItem key={area} value={area}>{enumToLabel(area)}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="min-w-[140px] bg-white hidden md:block ">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Cities</SelectItem>
                {Object.values(PakistanCities).map(c => (
                  <SelectItem key={c} value={c}>{enumToLabel(c)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No lawyers match your filters. Try adjusting them.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {paginated.map((l, index) => (
                <LawyerCard key={index} lawyer={l} />
              ))}
            </div>
          )}

          {!isLoading && (
            <Link href="/lawyers" className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="w-full">
                View All Lawyers
              </Button>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

/////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////
function Stars({ rating }: { rating: number }) {

  // Calculate number of full, half, and empty stars
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {/* Full stars */}
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f-${i}`} className="h-4 w-4 text-accent" fill="#2F9E53" />
      ))}

      {/* Half star (if applicable) */}
      {hasHalf && (
        <Star className="h-4 w-4 text-accent/60" fill="#2F9E53" />
      )}

      {/* Empty stars */}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e-${i}`} className="h-4 w-4 text-muted-foreground" />
      ))}
    </div>
  );
}


/////////////////////////////////////////////////////// COMPONENTS /////////////////////////////////////////////////////////
function CardSkeleton() {
  return (
    <div className="animate-pulse bg-neutral rounded-xl border p-4">
      <div className="h-40 bg-muted rounded-lg" />
      <div className="mt-4 h-4 bg-muted rounded w-2/3" />
      <div className="mt-2 h-3 bg-muted rounded w-1/2" />
      <div className="mt-6 h-9 bg-muted rounded" />
    </div>
  )
}

function LawyerCard({ lawyer }: { lawyer: ILawyer }) {

  return (
    <div className={cn(
      'group rounded-lg border bg-card shadow-sm hover:shadow-md transition overflow-hidden'
    )}>
      {/* Top Section */}
      <div className="relative bg-primary-50 p-4 flex flex-col items-center">
        <div className="flex items-start gap-4 w-full">
          {/* Avatar + Availability */}
          <div className="flex flex-col items-center gap-2">
            <Avatar className='h-24 w-24 ring-2 ring-background shadow-sm'>
              <AvatarImage src={lawyer.profilePicture} alt={lawyer.fullName} />
              <AvatarFallback className='uppercase text-base font-medium'>
                {lawyer?.firstname?.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground truncate">{lawyer.firstname} {lawyer.lastname}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {enumToLabel(lawyer.location.city || 'N/A')}
            </p>

            {/* Rating */}
            <div className="mt-1 flex flex-col items-start">
              <Stars rating={lawyer.avgRating!} />
              <p className="text-[11px] text-muted-foreground">{lawyer.avgRating?.toFixed(1)} / 5</p>
            </div>

          </div>
        </div>

      </div>

      {/* Expertise */}
      <div className="px-4 py-3 border-t">
        <div className="flex flex-wrap gap-1">
          {lawyer.specializations?.map(e => (
            <Badge key={e} variant="outline" className="text-[11px] px-2 py-0.5">
              {enumToLabel(e)}
            </Badge>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t flex gap-2">
        <Link href={`/lawyers/${lawyer?.username}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">View Profile</Button>
        </Link>
        <Button size="sm" className="flex-1">
          Book Now
        </Button>
      </div>
    </div>
  )
}



export default Consultations
