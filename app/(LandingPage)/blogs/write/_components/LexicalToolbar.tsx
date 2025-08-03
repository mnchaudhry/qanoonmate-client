'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $createTextNode,
} from 'lexical'
import { TOGGLE_LINK_COMMAND } from '@lexical/link'
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import { $createListNode, ListNode } from '@lexical/list'
import { Button } from '@/components/ui/button'
import {
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Type,
  ChevronDown,
} from 'lucide-react'
import { useState, useEffect } from 'react'

const BLOCK_TYPES = [
  { label: 'Paragraph', value: 'paragraph' },
  { label: 'Heading 1', value: 'h1' },
  { label: 'Heading 2', value: 'h2' },
  { label: 'Quote', value: 'quote' },
  { label: 'Bullet List', value: 'bullet' },
  { label: 'Numbered List', value: 'number' },
]

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [blockType, setBlockType] = useState('paragraph')
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode()
          const parent = anchorNode.getTopLevelElementOrThrow()
          const type = parent.getType()

          if (type === 'heading') {
            const tag = (parent as any).getTag()
            setBlockType(tag === 'h1' ? 'h1' : tag === 'h2' ? 'h2' : 'paragraph')
          } else if (type === 'quote') {
            setBlockType('quote')
          } else if (type === 'list') {
            const listType = (parent as ListNode).getListType()
            setBlockType(listType === 'bullet' ? 'bullet' : 'number')
          } else {
            setBlockType('paragraph')
          }
        }
      })
    })
  }, [editor])

  const format = (type: 'bold' | 'italic' | 'underline') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, type)
  }

  const insertLink = () => {
    if (linkUrl.trim()) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl.trim())
      setLinkUrl('')
      setShowLinkInput(false)
    }
  }

  const handleBlockTypeChange = (type: string) => {
    setBlockType(type)
    setShowDropdown(false)

    editor.update(() => {
      const selection = $getSelection()

      if (!$isRangeSelection(selection)) return

      const anchorNode = selection.anchor.getNode()
      const topNode = anchorNode.getTopLevelElementOrThrow()
      const content = anchorNode.getTextContent()

      let newNode

      switch (type) {
        case 'h1':
        case 'h2':
          newNode = $createHeadingNode(type)
          break
        case 'quote':
          newNode = $createQuoteNode()
          break
        case 'bullet':
          newNode = $createListNode('bullet')
          break
        case 'number':
          newNode = $createListNode('number')
          break
        default:
          newNode = $createParagraphNode()
      }

      newNode.append($createTextNode(content))
      topNode.replace(newNode)

      // Move selection to the end of new node
      newNode.selectEnd()
    })
  }

  return (
    <div className="lexical-toolbar flex flex-wrap items-center gap-2 mb-4 bg-muted/40 rounded-lg px-2 py-2">
      {/* Block type dropdown */}
      <div className="relative">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="flex items-center gap-1"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <Type className="w-4 h-4" />
          <span>
            {BLOCK_TYPES.find((b) => b.value === blockType)?.label || 'Paragraph'}
          </span>
          <ChevronDown className="w-3 h-3" />
        </Button>

        {showDropdown && (
          <div className="absolute left-0 top-full z-10 bg-white border rounded shadow mt-1 min-w-[140px]">
            {BLOCK_TYPES.map((b) => (
              <button
                key={b.value}
                className={`block w-full text-left px-3 py-1 text-sm hover:bg-muted/60 ${
                  blockType === b.value ? 'bg-muted/80 font-semibold' : ''
                }`}
                onClick={() => handleBlockTypeChange(b.value)}
                type="button"
              >
                {b.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Formatting buttons */}
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => format('bold')}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => format('italic')}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => format('underline')}
        title="Underline (Ctrl+U)"
      >
        <Underline className="w-4 h-4" />
      </Button>

      {/* Link insert */}
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => setShowLinkInput(!showLinkInput)}
        title="Insert Link"
      >
        <LinkIcon className="w-4 h-4" />
      </Button>

      {showLinkInput && (
        <div className="flex gap-2 items-center ml-2">
          <input
            type="text"
            className="border rounded px-2 py-1 text-sm"
            placeholder="Link URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
          <Button type="button" size="sm" onClick={insertLink}>
            Insert
          </Button>
        </div>
      )}
    </div>
  )
}
