"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const ClientPage = () => {

  const router = useRouter();

  useEffect(() => {
    router.push('/client/dashboard')
  }, [router])

  return (
    <div></div>
  )
}

export default ClientPage