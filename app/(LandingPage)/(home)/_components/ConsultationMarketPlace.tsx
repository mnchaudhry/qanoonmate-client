"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { Calendar, Phone, Video, Search, MapPin, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

import SectionHeading from './SectionHeading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination } from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import { Lawyer1 } from '@/constants/images'

type ConsultationType = 'Phone' | 'Video' | 'In-person'

type Lawyer = {
  id: number
  name: string
  expertise: string[]
  city: string
  rating: number
  available: boolean
  image: string
  consultationTypes: ConsultationType[]
}

const ALL_LAWYERS: Lawyer[] = [
  {
    id: 1,
    name: 'Sarah Khan',
    expertise: ['Corporate Law', 'M&A'],
    city: 'Karachi',
    rating: 4.7,
    available: true,
    image: Lawyer1,
    consultationTypes: ['Phone', 'Video', 'In-person'],
  },
  {
    id: 2,
    name: 'Ali Raza',
    expertise: ['Family Law', 'Custody'],
    city: 'Lahore',
    rating: 4.9,
    available: false,
    image: Lawyer1,
    consultationTypes: ['Video', 'In-person'],
  },
  {
    id: 3,
    name: 'Fatima Noor',
    expertise: ['Criminal Law', 'Bail'],
    city: 'Islamabad',
    rating: 4.8,
    available: true,
    image: Lawyer1,
    consultationTypes: ['Phone', 'Video'],
  },
  {
    id: 4,
    name: 'Zain Ahmed',
    expertise: ['Tax Law'],
    city: 'Karachi',
    rating: 4.5,
    available: true,
    image: Lawyer1,
    consultationTypes: ['Phone'],
  },
  {
    id: 5,
    name: 'Ayesha Siddiqui',
    expertise: ['Intellectual Property', 'Trademarks'],
    city: 'Lahore',
    rating: 4.6,
    available: true,
    image: Lawyer1,
    consultationTypes: ['Video', 'In-person'],
  },
  {
    id: 6,
    name: 'Hassan Javed',
    expertise: ['Property Law', 'Contracts'],
    city: 'Islamabad',
    rating: 4.2,
    available: false,
    image: Lawyer1,
    consultationTypes: ['Phone', 'In-person'],
  },
]

const CONSULTATION_TYPES: ConsultationType[] = ['Phone', 'Video', 'In-person']
const PRACTICE_AREAS = [
  'All',
  'Corporate Law',
  'Criminal Law',
  'Family Law',
  'Tax Law',
  'Intellectual Property',
  'Property Law',
]
const CITIES = ['All', 'Karachi', 'Lahore', 'Islamabad']

type SortKey = 'relevance' | 'rating'

const Consultations: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPractice, setSelectedPractice] = useState<string>('All')
  const [selectedCity, setSelectedCity] = useState<string>('All')
  const [selectedTypes, setSelectedTypes] = useState<Set<ConsultationType>>(new Set())
  const [minRating, setMinRating] = useState<number>(0)
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<SortKey>('relevance')
  const [page, setPage] = useState<number>(1)
  const pageSize = 9
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 450)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, selectedPractice, selectedCity, selectedTypes, minRating, onlyAvailable, sortBy])

  const filteredLawyers = useMemo(() => {
    let list = [...ALL_LAWYERS]

    // Text search across name, expertise, city
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.expertise.some(e => e.toLowerCase().includes(q))
      )
    }

    // Practice area
    if (selectedPractice !== 'All') {
      list = list.filter(l => l.expertise.some(e => e === selectedPractice))
    }

    // City
    if (selectedCity !== 'All') {
      list = list.filter(l => l.city === selectedCity)
    }

    // Consultation types (AND across selected)
    if (selectedTypes.size > 0) {
      list = list.filter(l => [...selectedTypes].every(t => l.consultationTypes.includes(t)))
    }

    // Rating
    if (minRating > 0) list = list.filter(l => l.rating >= minRating)

    // Availability toggle
    if (onlyAvailable) list = list.filter(l => l.available)

    // Sorting
    list.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        default:
          // relevance heuristic
          return Number(b.available) - Number(a.available)
      }
    })

    return list
  }, [searchQuery, selectedPractice, selectedCity, selectedTypes, minRating, onlyAvailable, sortBy])

  const totalPages = Math.ceil(filteredLawyers.length / pageSize) || 1
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredLawyers.slice(start, start + pageSize)
  }, [filteredLawyers, page])

  const toggleType = (type: ConsultationType) => {
    setSelectedTypes(prev => {
      const copy = new Set(prev)
      if (copy.has(type)) copy.delete(type)
      else copy.add(type)
      return copy
    })
  }

  return (
    <section className="bg-surface">
      <div className="container px-4 mx-auto max-w-7xl md:px-6">
        <SectionHeading
          title="Our Legal Experts"
          topTitle="Book a Consultation with Legal Experts"
          description="Find and book the right lawyer by expertise, location, availability and rating."
        />

        {/* Top controls */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xl">
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search lawyers, specialties, or locations"
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

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

            <div className="flex items-center gap-2">
              <FilterInline
                selectedPractice={selectedPractice}
                setSelectedPractice={setSelectedPractice}
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                selectedTypes={selectedTypes}
                toggleType={toggleType}
                minRating={minRating}
                setMinRating={setMinRating}
                onlyAvailable={onlyAvailable}
                setOnlyAvailable={setOnlyAvailable}
              />
            </div>
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
              {paginated.map((l) => (
                <LawyerCard key={l.id} lawyer={l} />
              ))}
            </div>
          )}

          {!isLoading && (
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </div>
      </div>
    </section>
  )
}

function FilterInline(props: {
  selectedPractice: string
  setSelectedPractice: (v: string) => void
  selectedCity: string
  setSelectedCity: (v: string) => void
  selectedTypes: Set<ConsultationType>
  toggleType: (t: ConsultationType) => void
  minRating: number
  setMinRating: (v: number) => void
  onlyAvailable: boolean
  setOnlyAvailable: (v: boolean) => void
}) {
  const {
    selectedPractice,
    setSelectedPractice,
    selectedCity,
    setSelectedCity,
    selectedTypes,
    toggleType,
    minRating,
    setMinRating,
    onlyAvailable,
    setOnlyAvailable,
  } = props

  return (
    <div className="w-full md:w-auto flex flex-col md:flex-row gap-3 md:items-center">
      <Select value={selectedPractice} onValueChange={setSelectedPractice}>
        <SelectTrigger className="min-w-[160px]">
          <SelectValue placeholder="Practice area" />
        </SelectTrigger>
        <SelectContent>
          {PRACTICE_AREAS.map(area => (
            <SelectItem key={area} value={area}>{area}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedCity} onValueChange={setSelectedCity}>
        <SelectTrigger className="min-w-[140px]">
          <SelectValue placeholder="City" />
        </SelectTrigger>
        <SelectContent>
          {CITIES.map(c => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
    </div>
  )
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const empty = Math.max(0, 5 - Math.ceil(rating))
  const hasHalf = rating % 1 >= 0.5 && full + empty < 5
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f-${i}`} className="h-4 w-4 text-accent" fill="currentColor" />
      ))}
      {hasHalf && (
        <Star className="h-4 w-4 text-accent/60" fill="currentColor" />
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e-${i}`} className="h-4 w-4 text-muted-foreground" />
      ))}
    </div>
  )
}

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

function LawyerCard({ lawyer }: { lawyer: Lawyer }) {
  const {
    name,
    expertise,
    city,
    rating,
    available,
    image,
    consultationTypes,
  } = lawyer

    return (
    <div className={cn(
      'group bg-neutral rounded-xl border overflow-hidden hover:shadow-lg transition',
    )}>
      <div className="relative h-48">
        <Image src={image} alt={name} fill className="object-cover" />
        <div className="absolute top-3 left-3 flex gap-2">
          {consultationTypes.map(t => (
            <Badge key={t} variant="secondary" className="backdrop-blur bg-secondary/80">
              {t}
            </Badge>
          ))}
        </div>
        <div className="absolute top-3 right-3">
          <Badge className={cn(available ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground')}>
            {available ? 'Available' : 'Unavailable'}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{name}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {expertise.map((e) => (
                <Badge key={e} variant="outline" className="text-xs">
                  {e}
                </Badge>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> {city}
            </div>
          </div>
          <div className="text-right">
            <Stars rating={rating} />
            <p className="text-xs text-muted-foreground mt-1">{rating.toFixed(1)} / 5</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <Link href="#">
            <Button variant="outline">View Profile</Button>
          </Link>
          <Button disabled={!available} className="">
            {available ? 'Book Now' : 'Unavailable'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Consultations
