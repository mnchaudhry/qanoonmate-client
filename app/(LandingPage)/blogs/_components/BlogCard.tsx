import React, { useState } from 'react'
import { ArrowRight, Star, MessageSquare, Heart, Share2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

type BlogCardProps = {
  id: string
  title: string
  summary: string
  date: string
  tag?: string
  imageUrl: string
  slug: string
  author: string
  likes: number
  comments: number
}

const BlogCard = ({ id, title, summary, date, tag, imageUrl, slug, author, likes, comments }: BlogCardProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(likes)
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like blogs')
      return
    }

    setIsLiking(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/blogs/like-blog/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${user.token}`
        }
      })

      if (response.ok) {
        setIsLiked(!isLiked)
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
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
    const url = `${window.location.origin}/blogs/${slug}`
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: summary,
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

  return (
    <div className="group overflow-hidden rounded-2xl border border-muted/30 shadow-sm bg-white transition hover:shadow-md flex flex-col">
      {/* Image */}
      <div className="relative w-full h-48 md:h-96 overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {tag && (
          <div className="absolute top-4 left-4">
            <span className="text-xs text-green-700 bg-green-100 font-medium px-3 py-1 rounded-full">
              {tag}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col justify-between flex-grow">
        {/* Title */}
        <h3 className="text-lg font-semibold text-primary-900 group-hover:text-green-700 transition line-clamp-2 mb-2">
          {title}
        </h3>

        {/* Summary */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{summary}</p>

        {/* Author and Date */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span>{author}</span>
            <span>•</span>
            <span>{date}</span>
          </div>
          <Link href={`/blogs/${slug}`} className='inline-flex items-center gap-1'>
            <span className="text-primary-dark hover:underline text-sm">Read More</span>
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
              <span>{comments}</span>
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
