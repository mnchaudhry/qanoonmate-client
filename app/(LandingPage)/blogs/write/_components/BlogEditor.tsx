import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Eye, Save, CheckCircle, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { ToolbarPlugin } from "./LexicalToolbar"
import "./lexical.css"
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
import { $generateHtmlFromNodes } from "@lexical/html";

interface BlogEditorProps {
  title: string
  setTitle: (v: string) => void
  summary: string
  setSummary: (v: string) => void
  summaryLimit: number
  content: string
  setContent: (v: string) => void
  previewMode: boolean
  setPreviewMode: (v: boolean) => void
}

const initialConfig = {
  namespace: "BlogEditor",
  theme: {
    paragraph: "editor-paragraph",
  },
  nodes: [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    // Add other custom nodes if needed
  ],
  onError(error: Error) {
    throw error
  },
}

export default function BlogEditor({
  title,
  setTitle,
  summary,
  setSummary,
  summaryLimit,
  content,
  setContent,
  previewMode,
  setPreviewMode,
}: BlogEditorProps) {
  const [loading, setLoading] = useState(false)

  const handleSaveDraft = () => {
    localStorage.setItem("blogDraft", JSON.stringify({ title, summary, content }))
    toast.success("Draft saved locally")
  }

  const handlePublish = async () => {
    if (!title || !summary || !content) {
      toast.error("Please fill all required fields")
      return
    }
    setLoading(true)
    try {
      // await createBlog({ title, summary, content })
      toast.success("Blog published!")
      setTitle("")
      setSummary("")
      setContent("")
    } catch {
      toast.error("Failed to publish blog")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">Write Your Blog</h1>
        <span className="text-muted-foreground">Share your legal insights with the community.</span>
      </div>
      <div className="flex gap-2 mb-6">
        <Button variant="outline" onClick={() => setPreviewMode(!previewMode)} disabled={loading}>
          <Eye className="w-4 h-4 mr-1" /> {previewMode ? "Edit" : "Preview"}
        </Button>
        <Button variant="outline" onClick={handleSaveDraft} disabled={loading}>
          <Save className="w-4 h-4 mr-1" /> Save Draft
        </Button>
        <Button onClick={handlePublish} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <CheckCircle className="w-4 h-4 mr-1" />}
          Publish
        </Button>
      </div>
      {!previewMode ? (
        <>
          <div className="mb-4">
            <label className="font-medium mb-1 block">Blog Title</label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter your blog title..."
              maxLength={120}
            />
          </div>
          <div className="mb-4">
            <label className="font-medium mb-1 block">Summary</label>
            <Textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="Write a brief summary (max 300 chars)..."
              maxLength={summaryLimit}
              rows={3}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {summary.length}/{summaryLimit} characters used
            </div>
          </div>
          <div className="mb-4">
            <label className="font-medium mb-1 block">Blog Content</label>
            <LexicalComposer initialConfig={initialConfig}>
              <ToolbarPlugin />
              {/* <RichTextPlugin
                contentEditable={<ContentEditable className="editor-content" />}
                placeholder={<div className="editor-placeholder">Start writing your blog here...</div>}
              /> */}
              <HistoryPlugin />
              <OnChangePlugin
                onChange={editorState => {
                  editorState.read(() => {
                    // @ts-expect-error - $generateHtmlFromNodes is not typed
                    const htmlString = $generateHtmlFromNodes(editorState, null);
                    setContent(htmlString);
                  });
                }}
              />
            </LexicalComposer>
          </div>
        </>
      ) : (
        <div className="prose max-w-none">
          <h2>{title}</h2>
          <p className="text-muted-foreground">{summary}</p>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      )}
    </>
  )
}