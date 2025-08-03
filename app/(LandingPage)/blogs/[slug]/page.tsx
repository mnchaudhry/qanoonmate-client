"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogDetails from "../_components/BlogDetails";
import AuthorInfo from "../_components/AuthorInfo";
import EngagementBar from "../_components/EngagementBar";
import CommentsSection from "../_components/CommentsSection";
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
      <div className="container mx-auto py-20 text-center text-muted-foreground">
        Loading blog...
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto py-20 text-center text-destructive">
        {error}
      </div>
    );
  }
  if (!blog) {
    return (
      <div className="container mx-auto py-20 text-center text-muted-foreground">
        Blog not found.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-16 pb-24">
      <div className="max-w-3xl mx-auto px-4">
        <BlogDetails blog={blog} />
        <AuthorInfo author={blog.author} createdAt={blog.createdAt} />
        <EngagementBar blog={blog} />
        <CommentsSection blogId={blog._id} comments={blog.comments || []} />
      </div>
    </main>
  );
} 