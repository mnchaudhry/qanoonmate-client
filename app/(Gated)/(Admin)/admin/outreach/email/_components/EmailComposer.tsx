'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import TagInput from '@/components/ui/tag-input'

type TemplateType = 'custom' | 'waitlist_invite' | 'waitlist_joined' | 'beta_invite'
type Props = {
  onSend: (payload: { subject: string; template: TemplateType; html?: string; inviteLink?: string; to?: string[] }) => void
  sending?: boolean
}

export function EmailComposer({ onSend, sending }: Props) {

  ////////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////////
  const [subject, setSubject] = useState('')
  const [template, setTemplate] = useState<TemplateType>('custom')
  const [html, setHtml] = useState('')
  const [inviteLink, setInviteLink] = useState('')
  const [customRecipients, setCustomRecipients] = useState<string[]>([])

  ////////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////////
  return (
    <div className="bg-surface border !border-border rounded-lg p-4 grid gap-4">
      <div className="grid gap-2">
        <label className="text-sm">Subject</label>
        <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" />
      </div>
      <div className="grid gap-2">
        <label className="text-sm">Template</label>
        <select className="border rounded-md h-9 px-3 bg-background" value={template} onChange={e => setTemplate(e.target.value as any)}>
          <option value="custom">Custom (HTML)</option>
          <option value="waitlist_invite">Waitlist Invite</option>
          <option value="waitlist_joined">Waitlist Joined</option>
          <option value="beta_invite">Beta Invite</option>
        </select>
      </div>
      {template === 'waitlist_invite' && (
        <div className="grid gap-2">
          <label className="text-sm">Invite Link</label>
          <Input value={inviteLink} onChange={e => setInviteLink(e.target.value)} placeholder="https://..." />
        </div>
      )}
      {template === 'custom' && (
        <div className="grid gap-2">
          <label className="text-sm">HTML</label>
          <Textarea rows={10} value={html} onChange={e => setHtml(e.target.value)} placeholder="<p>Hello</p>" />
        </div>
      )}
      <div className="grid gap-2">
        <label className="text-sm">Explicit recipients (comma-separated)</label>
        <TagInput
          value={customRecipients}
          onChange={setCustomRecipients}
          placeholder="a@x.com, b@y.com"
        />
      </div>
      <div>
        <Button disabled={sending || !subject} onClick={() => {
          onSend({ subject, template, html: template === 'custom' ? html : undefined, inviteLink: (template === 'waitlist_invite' || template === 'beta_invite') ? inviteLink : undefined, to: customRecipients })
        }}>Send</Button>
      </div>
    </div>
  )
}


