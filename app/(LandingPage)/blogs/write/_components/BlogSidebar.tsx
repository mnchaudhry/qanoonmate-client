import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"
import Image from "next/image"
import { Trash2, UploadCloud, Loader2 } from "lucide-react"
import { uploadFeaturedImage } from "@/store/api/index"
import { toast } from "react-hot-toast"
import React, { useRef, useState } from "react"
import { LawCategory } from "@/lib/enums"

interface BlogSidebarProps {
  category: LawCategory
  setCategory: (v: LawCategory) => void
  featuredImage: string | null
  setFeaturedImage: (v: string | null) => void
  imageFile: File | null
  setImageFile: (f: File | null) => void
  LawCategory: any
}

export default function BlogSidebar({
  category,
  setCategory,
  featuredImage,
  setFeaturedImage,
  setImageFile,
  LawCategory,
}: BlogSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("image", file)
      formData.append("fileName", file.name)

      const response = await uploadFeaturedImage(formData)
      const imageUrl = response?.data?.data?.url
      if (imageUrl) {
        setFeaturedImage(imageUrl)
        setImageFile(file)
        toast.success("Image uploaded!")
      } else {
        toast.error(response?.data?.message || "Image upload failed")
      }
    } catch {
      toast.error("Image upload failed")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveImage = () => {
    setFeaturedImage(null)
    setImageFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-4 border border-muted/20">
        <label className="font-medium mb-2 block">Featured Image</label>
        {featuredImage ? (
          <div className="relative w-full h-40 mb-2">
            <Image
              src={featuredImage}
              alt="Featured"
              fill
              className="object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemoveImage}
            >
              <Trash2 className="w-4 h-4 mr-1" /> Remove Image
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              id="featured-image-upload"
            />
            <Button
              variant="outline"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.value = ""
                  fileInputRef.current.click()
                }
              }}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <UploadCloud className="w-4 h-4 mr-1" />
              )}
              Upload Image
            </Button>
          </div>
        )}
      </div>
      <div className="bg-white rounded-2xl shadow-md p-4 border border-muted/20">
        <label className="font-medium mb-2 block">Category</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full">
            {category || "▼ Select a category"}
          </SelectTrigger>
          <SelectContent>
            {Object.keys(LawCategory).map((key) => (
              <SelectItem key={key} value={LawCategory[key]}>
                {LawCategory[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="bg-white rounded-2xl shadow-md p-4 border border-muted/20">
        <label className="font-medium mb-2 block">Blog Guidelines</label>
        <ul className="list-disc ml-4 text-sm space-y-1 text-muted-foreground">
          <li>Be clear and concise</li>
          <li>Use legal references</li>
          <li>Give examples</li>
          <li>Avoid sensitive data</li>
          <li>Proofread before post</li>
        </ul>
      </div>
    </>
  )
}
