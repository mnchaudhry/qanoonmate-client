"use client"
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import EditorJS, { type OutputData } from "@editorjs/editorjs"
import Header from "@editorjs/header"
import List from "@editorjs/list"
import Quote from "@editorjs/quote"
import CodeTool from "@editorjs/code"
import Table from "@editorjs/table"
import InlineCode from "@editorjs/inline-code"
import ImageTool from "@editorjs/image"
import Marker from "@editorjs/marker"

type Props = {
  data?: OutputData
  onChange?: (data: OutputData) => void
  onUploadFeatured?: (file: File) => Promise<void> | void
}

export type EditorHandle = {
  getData: () => Promise<OutputData>
  clear: () => void
}

const Editor = forwardRef<EditorHandle, Props>(({ data, onChange, onUploadFeatured }, ref) => {

  //////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////
  const holderId = useRef(`editorjs-${Math.random().toString(36).slice(2)}`).current
  const instanceRef = useRef<EditorJS | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)
  const isInitializedRef = useRef(false)

  //////////////////////////////////////////////// EFFECTS ///////////////////////////////////////////
  useImperativeHandle(ref, () => ({
    getData: async () => {
      if (!instanceRef.current) return { time: Date.now(), blocks: [] }
      const d = await instanceRef.current.save()
      return d
    },
    clear: () => {
      instanceRef.current?.clear()
    },
  }), [])

  //////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////
  useEffect(() => {
    if (isInitializedRef.current) return
    
    let isMounted = true
    const init = async () => {
      // Ensure holder element exists and is clean
      const holderElement = document.getElementById(holderId)
      if (!holderElement) return
      
      // Clear any existing content
      holderElement.innerHTML = ''
      
      const editor = new EditorJS({
        holder: holderId,
        data: data?.blocks?.length ? data : { time: Date.now(), blocks: [] },
        autofocus: true,
        placeholder: "Start writing...",
        // onChange: async () => {
        //   if (!isMounted) return
        //   const d = await editor.save()
        //   onChange?.(d)
        // },
        // tools: {
        //   header: {
        //     class: Header as any,
        //     inlineToolbar: ["bold", "italic", "marker", "inlineCode"],
        //     config: { levels: [1, 2, 3], defaultLevel: 2 },
        //   },
        //   list: { class: List as any, inlineToolbar: true },
        //   quote: { class: Quote, inlineToolbar: true },
        //   code: { class: CodeTool },
        //   inlineCode: { class: InlineCode },
        //   table: { class: Table as any, inlineToolbar: true },
        //   marker: { class: Marker },
        //   image: {
        //     class: ImageTool as any,
        //     config: {
        //       uploader: {
        //         uploadByFile: async (file: File) => {
        //           try {
        //             if (onUploadFeatured) await onUploadFeatured(file)
        //           } catch { }
        //           const fd = new FormData(); fd.append("image", file)
        //           const res = await fetch("/api/blogs/upload-featured-image", { method: "POST", body: fd })
        //           const json = await res.json()
        //           const url = json?.data?.url || json?.url
        //           return { success: 1, file: { url } }
        //         },
        //         uploadByUrl: async (url: string) => ({ success: 1, file: { url } }),
        //       },
        //     },
        //   },
        //   delimiter: {
        //     class: class Delimiter {
        //       static get toolbox() { return { title: "Separator", icon: "<div style=\"font-size:18px\">—</div>" } }
        //       render() { const el = document.createElement("div"); el.className = "my-6 h-px bg-border"; return el }
        //       save() { return {} }
        //     } as any,
        //   },
        //   callout: {
        //     class: class Callout {
        //       private wrapper: HTMLDivElement
        //       private input: HTMLDivElement
        //       constructor({ data }: any) {
        //         this.wrapper = document.createElement("div")
        //         this.wrapper.className = "border border-border rounded-lg p-4 bg-surface"
        //         this.input = document.createElement("div")
        //         this.input.contentEditable = "true"
        //         this.input.className = "outline-none text-sm"
        //         this.input.dataset.placeholder = "Callout"
        //         this.input.innerHTML = data?.text || ""
        //         this.wrapper.appendChild(this.input)
        //       }
        //       static get toolbox() { return { title: "Callout", icon: "<span>💡</span>" } }
        //       render() { return this.wrapper }
        //       save() { return { text: this.input.innerHTML } }
        //     } as any,
        //   },
        // },
      })
      instanceRef.current = editor
      isInitializedRef.current = true

      // try {
      //   const mod = await import("editorjs-drag-drop")
      //   const DragDrop = (mod as any).default || (mod as any)
      //   new DragDrop(editor)
      // } catch { }

      // const dropZone = document.getElementById(holderId)
      // if (dropZone) {
      //   const onDragOver = (e: DragEvent) => { e.preventDefault() }
      //   const onDrop = async (e: DragEvent) => {
      //     e.preventDefault()
      //     const files = Array.from(e.dataTransfer?.files || [])
      //     for (const f of files) {
      //       if (f.type.startsWith("image/")) {
      //         const fd = new FormData(); fd.append("image", f)
      //         const res = await fetch("/api/blogs/upload-featured-image", { method: "POST", body: fd })
      //         const json = await res.json()
      //         const url = json?.data?.url || json?.url
      //         if (url) instanceRef.current?.blocks.insert("image", { file: { url } } as any)
      //       }
      //     }
      //   }
      //   dropZone.addEventListener("dragover", onDragOver as any)
      //   dropZone.addEventListener("drop", onDrop as any)
      //   cleanupRef.current = () => {
      //     dropZone.removeEventListener("dragover", onDragOver as any)
      //     dropZone.removeEventListener("drop", onDrop as any)
      //   }
      // }
    }
    init()
    return () => {
      isMounted = false
      try { cleanupRef.current?.() } catch { }
      try {
        const inst: any = instanceRef.current
        if (inst && typeof inst.destroy === 'function') {
          inst.destroy()
        } else if (inst && typeof inst.clear === 'function') {
          inst.clear()
        }
      } catch { }
      instanceRef.current = null
      isInitializedRef.current = false
    }
  }, [])



  //////////////////////////////////////////////// RENDER ///////////////////////////////////////////
  return (
    <div className="min-h-[50vh]">
      <div id={holderId} className="px-0 md:px-0 py-2" />
    </div>
  )
})

Editor.displayName = "Editor"
export default Editor
 