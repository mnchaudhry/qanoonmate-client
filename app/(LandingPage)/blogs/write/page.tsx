"use client"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import TagInput from "@/components/ui/tag-input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Eye, EyeOff, Save, Send, Upload, Import, FileDown, Image as ImageIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { createBlog } from "@/store/api"
import type { APIResponse } from "@/store/types/api"
import { editorDataToMarkdown, editorDataToHTML, markdownToEditorData } from "@/utils/editorjs-convert"

const Editor = dynamic(() => import("./_components/Editor"), { ssr: false })

import type { OutputData as EditorData } from "@editorjs/editorjs"

const AUTOSAVE_KEY = "qanoonmate_blog_autosave_v1"

function debounce<T extends (...args: any[]) => void>(fn: T, wait = 1000) {
  let t: any
  return (...args: Parameters<T>) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), wait)
  }
}

function estimateReadingTimeFromData(data: EditorData): number {
  const text = data?.blocks?.map((b: any) => {
    if (!b) return ""
    if (b.type === "paragraph") return b.data?.text || ""
    if (b.type === "header") return b.data?.text || ""
    if (b.type === "list") return (b.data?.items || []).join(" ")
    if (b.type === "quote") return b.data?.text || ""
    if (b.type === "code") return b.data?.code || ""
    return ""
  }).join(" ") || ""
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

const WriteBlogPage: React.FC = () => {

  //////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////
  const router = useRouter()

  //////////////////////////////////////////////// STATES ///////////////////////////////////////////
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [featuredImage, setFeaturedImage] = useState<string | undefined>(undefined)
  const [data, setData] = useState<EditorData>({ time: Date.now(), blocks: [] })
  const [preview, setPreview] = useState<"editor" | "preview-html" | "preview-md">("editor")
  const [isSaving, setIsSaving] = useState(false)
  const editorRef = useRef<{ getData: () => Promise<EditorData>; clear: () => void } | null>(null)

  //////////////////////////////////////////////// EFFECTS ///////////////////////////////////////////
  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY)
      if (raw) {
        const saved = JSON.parse(raw)
        setTitle(saved.title || "")
        setCategory(saved.category || "")
        setTags(saved.tags || [])
        setFeaturedImage(saved.featuredImage)
        if (saved.data) setData(saved.data)
      }
    } catch { }
  }, [])
  const doAutosave = useMemo(() => debounce(async () => {
    try {
      const editorData = editorRef.current ? await editorRef.current.getData() : data
      const payload = { title, category, tags, featuredImage, data: editorData }
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(payload))
    } catch { }
  }, 1200), [title, category, tags, featuredImage, data])

  useEffect(() => {
    doAutosave()
  }, [title, category, tags, featuredImage, data, doAutosave])

  //////////////////////////////////////////////// HANDLERS ///////////////////////////////////////////
  const onChangeEditor = useCallback((d: EditorData) => {
    setData(d)
  }, [])

  const onUploadFeatured = async (file: File) => {
    try {
      const fd = new FormData()
      fd.append("image", file)
      const res = await fetch("/api/blogs/upload-featured-image", { method: "POST", body: fd })
      const json: APIResponse<{ url: string }> = await res.json()
      if (!res.ok) throw new Error(json?.message || "Upload failed")
      const url = (json as any)?.data?.url || (json as any)?.url
      setFeaturedImage(url)
      toast.success("Featured image uploaded")
    } catch (e: any) {
      toast.error(e?.message || "Failed to upload image")
    }
  }

  const exportMarkdown = async () => {
    const d = editorRef.current ? await editorRef.current.getData() : data
    const md = editorDataToMarkdown(d)
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${(title || "untitled").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importMarkdown = async (file: File) => {
    const text = await file.text()
    const d = markdownToEditorData(text)
    setData(d)
  }

  const computeExcerpt = (d: EditorData) => {
    const plain = editorDataToMarkdown(d)
    return plain.replace(/[#>*`\-\d\.\!\[\]\(\)]/g, "").split("\n").join(" ").trim().slice(0, 240)
  }

  const onSave = async (status: "draft" | "published") => {
    try {
      setIsSaving(true)
      const d = editorRef.current ? await editorRef.current.getData() : data
      if (!title.trim()) throw new Error("Title is required")
      if (!d.blocks?.length) throw new Error("Content is empty")
      const slug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      const readingTime = estimateReadingTimeFromData(d)
      const payload = {
        title,
        slug,
        content: JSON.stringify(d),
        excerpt: computeExcerpt(d),
        category: category || "general",
        tags,
        featuredImage,
        status,
        readingTime,
      }
      const { data: resp } = await createBlog(payload as any)
      if ((resp as any)?.success) {
        toast.success(status === "published" ? "Blog published" : "Draft saved")
        localStorage.removeItem(AUTOSAVE_KEY)
        router.push("/blogs")
      } else {
        throw new Error((resp as any)?.message || "Failed to save")
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to save")
    } finally {
      setIsSaving(false)
    }
  }

  //////////////////////////////////////////////// PREVIEWS ///////////////////////////////////////////
  const htmlPreview = useMemo(() => editorDataToHTML(data), [data])
  const mdPreview = useMemo(() => editorDataToMarkdown(data), [data])

  //////////////////////////////////////////////// RENDER ///////////////////////////////////////////
  return (
    <section className="min-h-screen bg-background">
      <div className="w-full bg-background sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Input
            aria-label="Blog title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 text-2xl font-semibold bg-background"
          />
          <div className="hidden md:flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" onClick={() => setPreview(prev => prev === "editor" ? "preview-html" : "editor")} aria-label="Toggle HTML preview">
                    {preview === "editor" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle preview</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" onClick={exportMarkdown} aria-label="Export Markdown">
                    <FileDown className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export Markdown</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <label className="inline-flex">
              <input type="file" accept="text/markdown,.md" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) importMarkdown(f) }} />
              <Button variant="ghost" aria-label="Import Markdown" asChild>
                <span><Import className="h-4 w-4" /></span>
              </Button>
            </label>
            <Button variant="ghost" disabled={isSaving} onClick={() => onSave("draft")} aria-label="Save draft">
              <Save className="h-4 w-4 mr-2" /> Save draft
            </Button>
            <Button className="bg-primary text-primary-foreground" disabled={isSaving} onClick={() => onSave("published")} aria-label="Publish">
              <Send className="h-4 w-4 mr-2" /> Publish
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 border border-border">
          <div className="p-0">
            {preview === "editor" && (
              <Editor
                ref={editorRef as any}
                data={data}
                onChange={onChangeEditor}
                onUploadFeatured={onUploadFeatured}
              />
            )}
            {preview === "preview-html" && (
              <div className="prose max-w-none prose-headings:scroll-mt-24 prose-p:text-foreground prose-li:text-foreground" dangerouslySetInnerHTML={{ __html: htmlPreview }} />
            )}
            {preview === "preview-md" && (
              <pre className="whitespace-pre-wrap text-sm p-4 bg-secondary/40 rounded-md">{mdPreview}</pre>
            )}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <div className="rounded-lg p-2">
              <p className="text-sm text-muted-foreground mb-2">Category</p>
              <Input
                aria-label="Category"
                placeholder="e.g., Legal Updates"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent"
              />
            </div>
            <div className="rounded-lg p-2">
              <p className="text-sm text-muted-foreground mb-2">Tags</p>
              <TagInput value={tags} onChange={setTags} placeholder="Add tags" />
            </div>
            <div className="rounded-lg p-2">
              <p className="text-sm text-muted-foreground mb-2">Featured Image</p>
              <div className="flex items-center gap-2">
                <label className="inline-flex">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onUploadFeatured(f) }} />
                  <Button variant="ghost" aria-label="Upload featured image">
                    <Upload className="h-4 w-4 mr-2" /> Upload
                  </Button>
                </label>
                {featuredImage && (
                  <a href={featuredImage} target="_blank" rel="noreferrer" className="text-primary text-sm inline-flex items-center gap-1">
                    <ImageIcon className="h-4 w-4" /> View
                  </a>
                )}
              </div>
            </div>
            <div className="flex md:hidden items-center gap-2">
              <Button variant="ghost" onClick={() => setPreview(prev => prev === "editor" ? "preview-html" : "editor")} aria-label="Toggle preview">
                {preview === "editor" ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />} {preview === "editor" ? "Preview" : "Editor"}
              </Button>
              <Button variant="ghost" disabled={isSaving} onClick={() => onSave("draft")} aria-label="Save draft">
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
              <Button className="bg-primary text-primary-foreground" disabled={isSaving} onClick={() => onSave("published")} aria-label="Publish">
                <Send className="h-4 w-4 mr-2" /> Publish
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WriteBlogPage