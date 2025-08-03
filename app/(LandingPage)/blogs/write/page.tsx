"use client"

import React, { useState } from "react"
import BlogEditor from "./_components/BlogEditor"
import BlogSidebar from "./_components/BlogSidebar"
import { LawCategory } from "@/lib/enums"

export default function WriteBlogPage() {
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState<LawCategory>(LawCategory.GENERAL_LAWS)
  const [featuredImage, setFeaturedImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const summaryLimit = 300

  return (
    <main className="min-h-screen mt-16 bg-background">
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row gap-8">
          <section className="flex-1 md:w-2/3 bg-white rounded-2xl shadow-md p-6 border border-muted/20">
            <BlogEditor
              title={title}
              setTitle={setTitle}
              summary={summary}
              setSummary={setSummary}
              summaryLimit={summaryLimit}
              content={content}
              setContent={setContent}
              previewMode={previewMode}
              setPreviewMode={setPreviewMode}
            />
          </section>
          <aside className="md:w-1/3 flex flex-col gap-6">
            <BlogSidebar
              category={category}
              setCategory={setCategory}
              featuredImage={featuredImage}
              setFeaturedImage={setFeaturedImage}
              imageFile={imageFile}
              setImageFile={setImageFile}
              LawCategory={LawCategory}
            />
          </aside>
        </div>
      </div>
    </main>
  )
}