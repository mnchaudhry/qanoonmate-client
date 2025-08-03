"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const LegalKnowledgeBase = () => {

    const router = useRouter();

    useEffect(() => {
        router.push('/knowledgebase/acts')
    }, [router])

    return null
}

export default LegalKnowledgeBase