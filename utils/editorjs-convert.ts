import type { OutputData } from "@editorjs/editorjs"

export function editorDataToMarkdown(data: OutputData): string {
  if (!data?.blocks?.length) return ""
  const lines: string[] = []
  for (const block of data.blocks) {
    switch (block.type) {
      case "header": {
        const level = Math.min(3, block.data?.level || 2)
        lines.push(`${"#".repeat(level)} ${block.data?.text || ""}`)
        break
      }
      case "paragraph":
        lines.push((block.data?.text || "").replace(/<br\s*\/?>/g, "\n"))
        break
      case "list": {
        const style = block.data?.style === "ordered" ? "ol" : "ul"
        const items: string[] = block.data?.items || []
        items.forEach((item: string, i: number) => {
          lines.push(style === "ol" ? `${i + 1}. ${item}` : `- ${item}`)
        })
        break
      }
      case "quote":
        lines.push(`> ${block.data?.text || ""}`)
        break
      case "code":
        lines.push("```\n" + (block.data?.code || "") + "\n```")
        break
      case "table": {
        const content: string[][] = block.data?.content || []
        if (content.length) {
          const header = content[0]
          const sep = header.map(() => "---")
          lines.push(`| ${header.join(" | ")} |`)
          lines.push(`| ${sep.join(" | ")} |`)
          for (let r = 1; r < content.length; r++) {
            lines.push(`| ${content[r].join(" | ")} |`)
          }
        }
        break
      }
      case "image": {
        const url = block.data?.file?.url || block.data?.url
        if (url) lines.push(`![image](${url})`)
        break
      }
      case "delimiter":
        lines.push("\n---\n")
        break
      case "callout":
        lines.push(`> 💡 ${(block.data?.text || "").replace(/<[^>]+>/g, "")}`)
        break
      default:
        break
    }
    lines.push("")
  }
  return lines.join("\n").trim()
}

export function editorDataToHTML(data: OutputData): string {
  if (!data?.blocks?.length) return ""
  const chunks: string[] = []
  for (const block of data.blocks) {
    switch (block.type) {
      case "header": {
        const level = Math.min(3, block.data?.level || 2)
        chunks.push(`<h${level}>${block.data?.text || ""}</h${level}>`)
        break
      }
      case "paragraph":
        chunks.push(`<p>${block.data?.text || ""}</p>`) 
        break
      case "list": {
        const ordered = block.data?.style === "ordered"
        const tag = ordered ? "ol" : "ul"
        const items: string[] = block.data?.items || []
        chunks.push(`<${tag}>${items.map((i) => `<li>${i}</li>`).join("")}</${tag}>`)
        break
      }
      case "quote":
        chunks.push(`<blockquote>${block.data?.text || ""}</blockquote>`)
        break
      case "code":
        chunks.push(`<pre><code>${escapeHtml(block.data?.code || "")}</code></pre>`)
        break
      case "table": {
        const content: string[][] = block.data?.content || []
        if (content.length) {
          const head = content[0]
          const body = content.slice(1)
          chunks.push(
            `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${body
              .map((row) => `<tr>${row.map((c) => `<td>${c}</td>`).join("")}</tr>`) 
              .join("")}</tbody></table>`
          )
        }
        break
      }
      case "image": {
        const url = block.data?.file?.url || block.data?.url
        if (url) chunks.push(`<img src="${url}" alt="image" />`)
        break
      }
      case "delimiter":
        chunks.push(`<hr />`)
        break
      case "callout":
        chunks.push(`<div class="border border-border rounded-lg p-4 bg-surface">${block.data?.text || ""}</div>`)
        break
      default:
        break
    }
  }
  return chunks.join("\n")
}

export function markdownToEditorData(md: string): OutputData {
  // Minimal parser for common elements; for richer cases use a dedicated lib
  const blocks: any[] = []
  const lines = md.split(/\r?\n/)
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (/^###\s+/.test(line)) { blocks.push({ type: "header", data: { text: line.replace(/^###\s+/, ""), level: 3 } }); i++; continue }
    if (/^##\s+/.test(line)) { blocks.push({ type: "header", data: { text: line.replace(/^##\s+/, ""), level: 2 } }); i++; continue }
    if (/^#\s+/.test(line))  { blocks.push({ type: "header", data: { text: line.replace(/^#\s+/, ""), level: 1 } }); i++; continue }
    if (/^>\s+/.test(line))  { blocks.push({ type: "quote", data: { text: line.replace(/^>\s+/, "") } }); i++; continue }
    if (/^```/.test(line)) {
      let code = ""; i++
      while (i < lines.length && !/^```/.test(lines[i])) { code += lines[i] + "\n"; i++ }
      i++
      blocks.push({ type: "code", data: { code: code.replace(/\n$/, "") } })
      continue
    }
    if (/^\|/.test(line)) {
      // naive table parse until empty line
      const table: string[][] = []
      while (i < lines.length && /^\|/.test(lines[i])) {
        const row = lines[i].replace(/^\||\|$/g, "").split("|").map((c) => c.trim())
        // skip separator row with ---
        if (!row.every((c) => /^-+$/.test(c))) table.push(row)
        i++
      }
      blocks.push({ type: "table", data: { content: table } })
      continue
    }
    if (/^(\d+)\.\s+/.test(line) || /^-\s+/.test(line)) {
      const style = /(\d+)\.\s+/.test(line) ? "ordered" : "unordered"
      const items: string[] = []
      while (i < lines.length && (/^(\d+)\.\s+/.test(lines[i]) || /^-\s+/.test(lines[i]))) {
        items.push(lines[i].replace(/^(\d+)\.\s+|^-\s+/, ""))
        i++
      }
      blocks.push({ type: "list", data: { style, items } })
      continue
    }
    if (/^---$/.test(line)) { blocks.push({ type: "delimiter", data: {} }); i++; continue }
    if (line.trim() === "") { i++; continue }
    // paragraph
    let para = line
    i++
    while (i < lines.length && lines[i].trim() !== "") { para += " " + lines[i]; i++ }
    blocks.push({ type: "paragraph", data: { text: para } })
  }
  return { time: Date.now(), blocks }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>\"]+/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string))
}


