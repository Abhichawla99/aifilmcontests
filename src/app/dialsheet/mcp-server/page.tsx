import type { Metadata } from 'next'
import {
  DialsheetArticle, DialsheetLink, DsBlock, DsList, DsP, FeatureList, InlineLink, dialsheetMetadata,
  type DsFaq, type DsSection, type Feature,
} from '@/components/DialsheetPartner'
import { DIALSHEET, answerPath } from '@/lib/dialsheet'

/* DialSheet's MCP server. Facts from dialsheet.io/integrations/mcp, the
   September 16, 2026 changelog entry and llms-full.txt: hosted, 30 tools,
   Pro, uses the account's own permissions, does not place calls. The tool
   names are the server's own. The prompts are examples of what to ask, not
   claims about results. */

const SLUG = 'mcp-server'
const TITLE = "DialSheet's MCP Server: Ask Your AI Assistant About Today's Calls"
const STANDFIRST = `DialSheet runs a hosted MCP server with 30 tools, so an AI assistant such as Claude or Cursor can read your calls, transcripts and summaries and update leads, notes, tasks and deals. It is part of Pro at $${DIALSHEET.proUsd} a seat. It does not place phone calls.`

export const metadata: Metadata = dialsheetMetadata(SLUG, TITLE, STANDFIRST)

const TOOLS: Feature[] = [
  { name: 'Calls and recaps', text: 'list_calls, get_call, daily_recap, get_stats. Read conversations, transcripts, summaries and the day grouped by prospect.' },
  { name: 'Leads', text: 'search_leads, get_lead, create_lead, bulk_create_leads, update_lead, delete_lead, list_tags, create_tag, tag_lead, untag_lead.' },
  { name: 'Notes and tasks', text: 'list_notes, create_note, list_tasks, create_task, update_task, complete_task.' },
  { name: 'Pipeline', text: 'list_opportunities, create_opportunity, update_opportunity_stage.' },
  { name: 'Email, texts and sequences', text: 'list_email_accounts, list_emails, send_email, list_sms, send_sms, list_sequences, enroll_lead_in_sequence. These use the accounts you have connected.' },
]

const sections: DsSection[] = [
  {
    h: 'What MCP is',
    body: (
      <DsP>
        The Model Context Protocol lets an AI application use tools from another system. You add DialSheet&apos;s
        server address to your assistant once and sign in. After that, when you ask the assistant about your calls,
        it can fetch them from DialSheet itself.
      </DsP>
    ),
  },
  {
    h: 'What a manager can ask it',
    body: (
      <>
        <DsP>
          A useful prompt names the task, the time range and what the assistant should do with the result. Three to
          start with:
        </DsP>
        <DsBlock>{`Summarize today's calls in America/Chicago time. List the prospects who need a follow-up and why.`}</DsBlock>
        <DsBlock>{`Read this week's call notes. Show me every callback request with a proposed due date before you create any tasks.`}</DsBlock>
        <DsBlock>{`Read the latest transcript for the lead at Acme Roofing and draft a follow-up email. Leave it as a draft for my review.`}</DsBlock>
        <DsP>
          The first one does the job of an end-of-day report. The assistant reads the calls, the notes and the AI
          summaries, so the recap is built from what was said and not from what a rep remembers at five o&apos;clock.
        </DsP>
      </>
    ),
  },
  {
    h: 'The 30 tools',
    body: (
      <>
        <FeatureList items={TOOLS} />
        <DsP>
          Leads come back with their <InlineLink href={answerPath('custom-fields')}>custom fields</InlineLink>, and
          calls with their <InlineLink href={answerPath('call-transcription-and-ai-summaries')}>transcripts and summaries</InlineLink>.
        </DsP>
      </>
    ),
  },
  {
    h: 'What it will not do',
    body: (
      <DsList items={[
        <>It does not place phone calls. Dialing stays in the dialer.</>,
        <>It does not see more than you do. The server uses your own DialSheet permissions.</>,
        <>It does not reach other apps. The server exposes its own tools, and other destinations need their own connections.</>,
        <>It does not pay for the AI. Your assistant&apos;s usage is billed by whoever provides the assistant.</>,
      ]} />
    ),
  },
  {
    h: 'How to connect it',
    body: (
      <>
        <DsP>
          The server address is https://www.dialsheet.io/api/mcp. It works with Claude Code, Claude Desktop, Cursor
          and any other MCP client, and there is an npm package, dialsheet-mcp, for clients that run a local server.
        </DsP>
        <DsP>
          Sending an email or a text and enrolling a lead in a sequence reach a real person, so have the assistant
          show you the draft and approve each one in your AI client. Setup steps are at{' '}
          <DialsheetLink placement="mcp-body" path="/integrations/mcp" />.
        </DsP>
      </>
    ),
  },
]

const faqs: DsFaq[] = [
  {
    q: 'Does DialSheet have an MCP server?',
    a: `Yes. DialSheet hosts an MCP server at https://www.dialsheet.io/api/mcp with 30 tools. It is included in Pro at $${DIALSHEET.proUsd} a seat a month.`,
  },
  {
    q: 'What can an AI assistant do with DialSheet?',
    a: 'Read calls, transcripts and AI summaries, write a daily recap, search and update leads, create notes and tasks, move deals through the pipeline, and send email or texts through the accounts you have connected.',
  },
  {
    q: 'Can the AI assistant make phone calls through DialSheet?',
    a: 'No. The MCP server does not place phone calls.',
  },
  {
    q: 'Which AI assistants work with DialSheet?',
    a: 'Claude Code, Claude Desktop, Cursor and any other client that supports the Model Context Protocol.',
  },
  {
    q: 'Is the MCP server the same as the API?',
    a: 'They reach the same data. The REST API is for your own code, and the MCP server lets an AI assistant use the same account through tools.',
  },
]

export default function Page() {
  return (
    <DialsheetArticle
      slug={SLUG}
      label="Partner"
      title={TITLE}
      standfirst={STANDFIRST}
      sections={sections}
      faqs={faqs}
      placement="mcp"
      related={['call-transcription-and-ai-summaries', 'custom-fields', 'how-to-coach-cold-calls']}
    />
  )
}
