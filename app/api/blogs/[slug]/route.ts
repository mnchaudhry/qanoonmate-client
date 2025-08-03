import { NextRequest, NextResponse } from 'next/server'
import { blogs as seedBlogs } from '@/constants'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
    const response = await fetch(`${backendUrl}/api/blogs/get-blog/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('authorization') && {
          'Authorization': request.headers.get('authorization')!
        })
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      // Try to find a blog in the local seed
      const fallback = seedBlogs.find((b) => b.slug === slug)
      if (fallback) {
        return NextResponse.json({ data: fallback })
      }
      return NextResponse.json(
        { error: data.message || 'Blog not found' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    // On error, try to find a blog in the local seed
    const { slug } = await params
    const fallback = seedBlogs.find((b) => b.slug === slug)
    if (fallback) {
      return NextResponse.json({ data: fallback })
    }
    console.error('Error fetching blog:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 