import React, { useState } from 'react'
import { ArrowRight, Star, MessageSquare, Heart, Share2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'



const BlogCard = ({ blog }: { blog: any }) => {

  ////////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////////
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(blog.likes)
  const [isLiking, setIsLiking] = useState(false)

  ////////////////////////////////////////////////////////// HANDLERS /////////////////////////////////////////////////////////////
  const handleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like blogs')
      return
    }

    setIsLiking(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs/like-blog/${blog._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${user.token}`
        }
      })

      if (response.ok) {
        setIsLiked(!isLiked)
        setLikeCount((prev: any) => isLiked ? prev - 1 : prev + 1)
        toast.success(isLiked ? 'Removed from likes' : 'Added to likes')
      } else {
        toast.error('Failed to like blog')
      }
    } catch (error) {
      console.error('Error liking blog:', error)
      toast.error('An error occurred')
    } finally {
      setIsLiking(false)
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/blogs/${blog.slug}`
    try {
      if (navigator.share) {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: url
        })
      } else {
        await navigator.clipboard.writeText(url)
        toast.success('Link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
      toast.error('Failed to share')
    }
  }

  ////////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////
  return (
    <div className="group overflow-hidden rounded-2xl border border-muted/30 shadow-sm bg-white transition hover:shadow-md flex flex-col">
      {/* Image */}
      <div className="relative w-full h-48 sm:h-64 overflow-hidden">
        <Image
          src={blog.featuredImage || '/default-blog-image.jpg'}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {blog.tags?.[0] && (
          <div className="absolute top-4 left-4">
            <span className="text-xs text-green-700 bg-green-100 font-medium px-3 py-1 rounded-full">
              {blog.tags?.[0]}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col justify-between flex-grow">
        {/* Title */}
        <h3 className="text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition line-clamp-2 mb-2">
          {blog.title}
        </h3>

        {/* Summary */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{blog.excerpt}</p>

        {/* Author and Date */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs md:text-sm text-muted-foreground flex items-center gap-2">
            <span>{blog.author?.name || `${blog.author?.firstname || ''} ${blog.author?.lastname || ''}`.trim() || 'QanoonMate Team'}</span>
            <span>•</span>
            <span>{blog.createdAt}</span>
          </div>
          <Link href={`/blogs/${blog.slug}`} className='inline-flex items-center gap-1'>
            <span className="text-primary hover:underline text-sm font-medium">Read More</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-muted/30">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-2 text-sm transition-colors ${isLiked
                ? 'text-red-500'
                : 'text-muted-foreground hover:text-red-500'
                }`}
            >
              <Heart
                size={16}
                className={isLiked ? 'fill-current' : ''}
              />
              <span>{likeCount}</span>
            </button>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MessageSquare size={16} />
              <span>{blog.comments?.length || 0}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Star size={16} className="text-yellow-500" />
              <span>4.5</span>
            </div>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default BlogCard
