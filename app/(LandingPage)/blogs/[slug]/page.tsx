"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BlogDetails from "../_components/BlogDetails";
import AuthorInfo from "../_components/AuthorInfo";
import EngagementBar from "../_components/EngagementBar";
import CommentsSection from "../_components/CommentsSection";
import Breadcrumb from "@/components/Breadcrumb";
import { Blog } from "@/store/types/api";

export default function BlogDetailPage() {

  const { slug } = useParams();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/blogs/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setBlog(data.data || data); // handle both {data: blog} and blog
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background pt-16 pb-24">
        <div className="max-w-3xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-72 bg-muted rounded-xl mb-6"></div>
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  if (error) {
    return (
      <main className="min-h-screen bg-background pt-16 pb-24">
        <div className="max-w-3xl mx-auto px-4 text-center py-20">
          <div className="mb-6">
            <div className="text-6xl mb-4">📄</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Unable to Load Blog</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }
  if (!blog) {
    return (
      <main className="min-h-screen bg-background pt-16 pb-24">
        <div className="max-w-3xl mx-auto px-4 text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Blog Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link 
            href="/blogs" 
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-block"
          >
            Browse All Blogs
          </Link>
        </div>
      </main>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blogs', href: '/blogs' },
    { label: blog.title, href: `/blogs/${blog.slug}`, current: true }
  ];

  return (
    <main className="min-h-screen bg-background pt-16 pb-24">
      <div className="max-w-4xl mx-auto px-4">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />
        <BlogDetails blog={blog} />
        <AuthorInfo author={blog.author} createdAt={blog.createdAt} />
        <EngagementBar blog={blog} />
        <CommentsSection blogId={blog._id} comments={blog.comments || []} />
      </div>
    </main>
  );
} 