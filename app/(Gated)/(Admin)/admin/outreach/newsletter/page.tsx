'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { PageHeader } from '../../../_components/PageHeader'
import { AppDispatch, RootState } from '@/store/store'
import { fetchNewsletterSubscribers, setNewsletterPage, setNewsletterParams, updateNewsletterSubscriber, deleteNewsletterSubscriber } from '@/store/reducers/newsletterSlice'
import NewsletterFilters from './_components/NewsletterFilters'
import NewsletterTable from './_components/NewsletterTable'
import { Pagination } from '@/components/ui/pagination'

function useDebounced<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => { const t = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(t) }, [value, delay])
  return debounced
}

export default function AdminNewsletterPage() {

  //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { list, meta, params } = useSelector((s: RootState) => s.newsletter)

  //////////////////////////////////////////////////// STATES ////////////////////////////////////////////////////
  const [search, setSearch] = useState<string>(searchParams.get('search') || '')
  const [status, setStatus] = useState<string>(searchParams.get('status') || '')
  const [source, setSource] = useState<string>(searchParams.get('source') || '')
  const [dateFrom, setDateFrom] = useState<Date | null>(searchParams.get('dateFrom') ? new Date(String(searchParams.get('dateFrom'))) : null)
  const [dateTo, setDateTo] = useState<Date | null>(searchParams.get('dateTo') ? new Date(String(searchParams.get('dateTo'))) : null)
  const debouncedSearch = useDebounced(search, 500)

  //////////////////////////////////////////////////// EFFECTS ////////////////////////////////////////////////////
  useEffect(() => {
    const page = Number(searchParams.get('page') || '1')
    const limit = Number(searchParams.get('limit') || '10')
    const statusQ = (searchParams.get('status') || undefined) as any
    const searchQ = searchParams.get('search') || undefined
    const sourceQ = (searchParams.get('source') || undefined) as string | undefined
    dispatch(setNewsletterParams({ page, limit, status: statusQ, search: searchQ, source: sourceQ }))
  }, [dispatch, searchParams])

  useEffect(() => {
    const sp = new URLSearchParams()
    if (params.page) sp.set('page', String(params.page))
    if (params.limit) sp.set('limit', String(params.limit))
    if (status) sp.set('status', status)
    if (source) sp.set('source', source)
    if (dateFrom) sp.set('dateFrom', dateFrom.toISOString())
    if (dateTo) sp.set('dateTo', dateTo.toISOString())
    if (debouncedSearch) sp.set('search', debouncedSearch)
    router.replace(`${pathname}?${sp.toString()}`)
    dispatch(fetchNewsletterSubscribers({ ...params, search: debouncedSearch || undefined, status: (status || undefined) as any, source: source || undefined, dateFrom: dateFrom ? dateFrom.toISOString() : undefined, dateTo: dateTo ? dateTo.toISOString() : undefined }))
  }, [dispatch, router, pathname, params, status, source, dateFrom, dateTo, debouncedSearch])

  //////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////
  const markUnsubscribed = (id: string) => {
    dispatch(updateNewsletterSubscriber({ id, update: { status: 'unsubscribed' } }))
  }
  const markSubscribed = (id: string) => {
    dispatch(updateNewsletterSubscriber({ id, update: { status: 'subscribed' } }))
  }
  const deleteSubscriber = (id: string) => {
    dispatch(deleteNewsletterSubscriber(id))
  }

  //////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
  return (
    <div className="space-y-6">

      <PageHeader title="Newsletter Subscribers" description="Manage newsletter subscribers." />

      <NewsletterFilters
        search={search}
        status={status}
        source={source}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onChange={(n) => {
          if (n.search !== undefined) setSearch(n.search)
          if (n.status !== undefined) setStatus(n.status)
          if (n.source !== undefined) setSource(n.source)
          if (n.dateFrom !== undefined) setDateFrom(n.dateFrom || null)
          if (n.dateTo !== undefined) setDateTo(n.dateTo || null)
          dispatch(setNewsletterParams({ page: 1 }))
        }}
        onReset={() => { setSearch(''); setStatus(''); setSource(''); setDateFrom(null); setDateTo(null); dispatch(setNewsletterParams({ page: 1 })); }}
      />

      <NewsletterTable
        items={list}
        onMarkSubscribed={markSubscribed}
        onMarkUnsubscribed={markUnsubscribed}
        onDelete={deleteSubscriber}
      />

      {meta.totalPages > 1 && (
        <Pagination currentPage={meta.currentPage} totalPages={meta.totalPages} onPageChange={(p) => dispatch(setNewsletterPage(p))} />
      )}

    </div>
  )
}


