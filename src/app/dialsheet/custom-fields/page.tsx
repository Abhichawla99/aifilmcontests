import type { Metadata } from 'next'
import {
  DialsheetArticle, DialsheetLink, DsP, FeatureList, InlineLink, dialsheetMetadata,
  type DsFaq, type DsSection, type Feature,
} from '@/components/DialsheetPartner'
import { answerPath } from '@/lib/dialsheet'

/* Custom fields, as they work in the product on November 22, 2026: Pro only,
   six types, 30 fields, managed by team admins, kept from a CSV column by
   choice, shown on the lead page and in Power Dial, and readable through the
   API and MCP as custom_fields. Recheck the types and the limit against
   DialSheet before changing them. */

const SLUG = 'custom-fields'
const TITLE = 'Custom Fields in DialSheet: Keep the Columns Your List Came With'
const STANDFIRST = 'DialSheet has custom fields on Pro. A team admin can add up to 30 fields in six types, a spreadsheet column with no home can be kept as a field during import, and the fields sit beside the lead while the rep dials.'

export const metadata: Metadata = dialsheetMetadata(SLUG, TITLE, STANDFIRST)

const MAX_FIELDS = 30
const TYPES: Feature[] = [
  { name: 'Text', text: 'A territory, a product line, anything short.' },
  { name: 'Number', text: 'Deal size, headcount, units.' },
  { name: 'Date', text: 'A renewal date or a last order.' },
  { name: 'Link', text: 'A listing, a CRM record, a map.' },
  { name: 'Yes / no', text: 'Decision maker? Has budget?' },
  { name: 'Pick one', text: 'Industry, lead source, tier. Up to 50 options.' },
]

const sections: DsSection[] = [
  {
    h: 'The six field types',
    body: (
      <>
        <DsP>
          A team admin adds and edits fields under Settings, Custom fields. An account can have up to {MAX_FIELDS}.
        </DsP>
        <FeatureList items={TYPES} />
      </>
    ),
  },
  {
    h: 'Importing a list with extra columns',
    body: (
      <>
        <DsP>
          Most lists carry columns a dialer has no slot for: policy type, square footage, last purchase, the SDR who
          sourced the lead. When you import a CSV, DialSheet matches the columns it knows, such as name, company,
          phone numbers, email, tags and notes.
        </DsP>
        <DsP>
          A column it has no home for is set to &quot;Don&apos;t import this column&quot;, with a &quot;Keep it&quot;
          option beside it that turns the column into a custom field. Nothing is created unless you choose it. On your
          next import, a column that matches a field you already have maps to it by name.
        </DsP>
      </>
    ),
  },
  {
    h: 'Where the rep sees them',
    body: (
      <DsP>
        Custom fields show on the lead page and under the contact in Power Dial. During a call, Power Dial lists only
        the fields that have a value, so an empty field never takes up space, and the rep can fill or change a value
        without leaving the dialer.
      </DsP>
    ),
  },
  {
    h: 'Reading them from other tools',
    body: (
      <DsP>
        The REST API and <InlineLink href={answerPath('mcp-server')}>the MCP server</InlineLink> both carry custom
        fields, so a script or an AI assistant can read them and set them along with the rest of the lead.
      </DsP>
    ),
  },
  {
    h: 'What to know before you rely on them',
    body: (
      <>
        <DsP>
          Custom fields are a Pro feature, and only team admins can create or change a field. Reps fill in the values.
        </DsP>
        <DsP>
          Decide your fields before the first big import. Thirty is plenty for a calling list, and a field nobody
          reads on a call is one more thing on the screen. Start a Pro seat at{' '}
          <DialsheetLink placement="custom-fields-body" /> to set them up.
        </DsP>
      </>
    ),
  },
]

const faqs: DsFaq[] = [
  {
    q: 'Does DialSheet have custom fields?',
    a: `Yes, on Pro. A team admin can add up to ${MAX_FIELDS} custom fields in six types: text, number, date, link, yes or no, and pick one.`,
  },
  {
    q: 'Can I import custom columns from a CSV?',
    a: 'Yes. A column DialSheet has no slot for can be kept as a custom field during import by choosing "Keep it" on that column. Columns are not turned into fields unless you choose it.',
  },
  {
    q: 'Do reps see custom fields while they dial?',
    a: 'Yes. Power Dial lists the custom fields that have a value under the contact, and the rep can edit them there.',
  },
  {
    q: 'Are custom fields on the free plan?',
    a: 'No. Custom fields are part of Pro.',
  },
  {
    q: 'Can I read custom fields through the API?',
    a: 'Yes. The REST API and the MCP server both read and write custom fields on a lead.',
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
      placement="custom-fields"
      related={['mcp-server', 'for-appointment-setting-agencies', 'call-transcription-and-ai-summaries']}
    />
  )
}
