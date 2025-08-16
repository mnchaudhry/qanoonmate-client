"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const ClientPage = () => {

  const router = useRouter();

  useEffect(() => {
    router.push('/client/dashboard')
  }, [router])

  return (
    <div>ClientPage</div>
  )
}

export default ClientPage