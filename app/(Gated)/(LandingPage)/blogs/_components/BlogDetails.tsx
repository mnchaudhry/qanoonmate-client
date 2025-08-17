import Image from "next/image";
import React from "react";

interface BlogDetailsProps {
  blog: {
    title: string;
    summary?: string;
    excerpt?: string;
    content: string;
    featuredImage?: string;
    category?: string;
    createdAt?: string;
    readingTime?: number;
  };
}

export default function BlogDetails({ blog }: BlogDetailsProps) {
  return (
    <article className="prose prose-lg max-w-none mx-auto bg-white rounded-2xl shadow-md p-8 mb-8 border border-muted/20">
      {blog.featuredImage && (
        <Image
          src={blog.featuredImage}
          alt={blog.title}
          width={800}
          height={600}
          className="w-full h-72 object-cover rounded-xl mb-6 border"
        />
      )}
      <h1 className="font-extrabold text-4xl mb-4 leading-tight text-gray-900">
        {blog.title}
      </h1>
      {(blog.summary || blog.excerpt) && (
        <p className="text-xl text-gray-600 mb-6 font-light italic border-l-4 border-primary pl-4">
          {blog.summary || blog.excerpt}
        </p>
      )}
      <div className="flex items-center gap-4 text-muted-foreground text-sm mb-6">
        {blog.category && (
          <span className="px-3 py-1 bg-primary/10 rounded-full text-primary font-medium">
            {blog.category}
          </span>
        )}
        {blog.createdAt && (
          <span className="flex items-center gap-1">
            📅 {new Date(blog.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        )}
        {blog.readingTime && (
          <span className="flex items-center gap-1">
            ⏱️ {blog.readingTime} min read
          </span>
        )}
      </div>
      <section className="mt-8 prose prose-lg prose-primary max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
    </article>
  );
} 