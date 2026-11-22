/* The client-getting series: three guides for filmmakers who want paid brand
   work, made with DialSheet, the site's calling partner. They are craft
   guides (same shape, same page, src/components/CraftGuidePage.tsx) kept in
   their own file so the DialSheet numbers come from src/lib/dialsheet.ts
   instead of being typed into prose.

   Rules for this file:
   - Body text is the craft guides' markdown-lite. A template block (``` fence)
     must not contain a blank line, because paragraphs split on blank lines.
   - The first intro paragraph carries no links.
   - The sums in "The sums, with made-up numbers" are an example and say so.
     Never replace them with a claimed result.
   - DialSheet links: brand-name anchor only, three at most per guide. */

import type { CraftGuide } from './craft-guides'
import {
  ABHI, DIALSHEET, DIALSHEET_FACTS_READ, DIALSHEET_PATH, LINE_PRICE_LINE, dialsheetHref,
} from '@/lib/dialsheet'

const F = '```'
const SYSTEM = '/guide/how-ai-filmmakers-get-commercial-clients'
const SCRIPT = '/guide/cold-call-script-for-ai-video-work'
const CADENCE = '/guide/follow-up-cadence-after-pitching-a-brand'
const FREE_PLAN = `one person, a list of up to ${DIALSHEET.freeLeads} leads and ${DIALSHEET.freeCallsPerMonth} calls a month`

export const CLIENT_GUIDE_ORDER: string[] = [
  'how-ai-filmmakers-get-commercial-clients',
  'cold-call-script-for-ai-video-work',
  'follow-up-cadence-after-pitching-a-brand',
]

export const CLIENT_GUIDE_DATA: Record<string, CraftGuide> = {
  'how-ai-filmmakers-get-commercial-clients': {
    title: 'How AI Filmmakers Get Commercial Clients: A Weekly Outreach System',
    description: 'A weekly system for landing paid brand work with AI video: pick one kind of brand, make one spec piece, build a list of 50, then email, call and follow up. With an email template, example sums and a calling routine.',
    keywords: 'how to get clients for AI video, AI filmmaker clients, AI commercial clients, get brand work AI filmmaker, cold calling for video production, outreach for AI video freelancers, AI video studio new business',
    datePublished: '2026-11-22',
    author: ABHI,
    intro: `A contest win gets your film seen. Paid work comes from a brand that has a product to sell and a person whose job is to make ads for it. That person will probably never see your festival laurels, so you have to reach them yourself. This guide is a system you can run every week: pick one kind of brand, make one spec piece for it, build a list of 50 companies, then email, call and follow up until each one says yes, no or later.\n\nIt is the first of three guides we made with DialSheet, the power dialer AI Film Contests has [teamed up with](${DIALSHEET_PATH}). The other two give you [the call script](${SCRIPT}) and [the follow-up cadence](${CADENCE}).`,
    sections: [
      {
        h: '1. Pick one kind of brand',
        body: `Choose a category narrow enough that one piece of work speaks to all of it: skincare brands that sell online, craft breweries, regional furniture makers, supplement companies. A marketing manager at a skincare brand cares that you have made a skincare ad. Your car spot tells her nothing.\n\nPick a category where:\n\n- the product photographs well and changes often, so they need new ads all year\n- the companies are big enough to pay and small enough that one person decides\n- you can find a phone number and the name of whoever runs marketing\n\nStay with one category for a month before you judge it. If you switch every week you never learn what that kind of buyer asks.`,
      },
      {
        h: '2. Make one spec piece for that category',
        body: `Make a 15 to 30 second spot for a product in that category, to the standard you would deliver to a client. One finished piece does more than a reel of contest clips, because the buyer can picture her own product in it. If you use a real brand's product, read [Can you use a real brand in an AI spec ad?](/guide/real-brands-in-ai-spec-ads) first and label the piece as spec work.\n\nGet the product right. A label that warps or a logo that drifts is the first thing a brand person sees, and [How to keep the product accurate in an AI commercial](/guide/product-accuracy-in-ai-commercials) covers the method.\n\nPut the piece on one page with nothing else on it: the film, two lines on how it was made, your name, your email and your phone number. That page is the only link you will send.`,
      },
      {
        h: '3. Build a list of 50',
        body: `Open a spreadsheet with these columns: company, website, contact name, job title, phone, email, the product you would make an ad for, and notes.\n\nFill it from the brands' own sites and their LinkedIn company pages. The About or Press page often names the marketing lead. At a small company the right contact is usually the founder, the head of marketing or the brand manager. At a bigger one, look for whoever runs paid social or creative.\n\nFifty companies is enough for a week. In the notes column write one true, specific line for each: the product they launched last month, or the ad of theirs you would remake. You will say that line out loud on the call.`,
      },
      {
        h: '4. Email in the morning, call the same afternoon',
        body: `Send a short email with the link in the morning and call in the afternoon. The email gives the call a reason ("I sent you a 20-second spot this morning") and the call gets the email opened.\n\n${F}\nSubject: a 20-second spot for [product]\nHi [name], I make AI commercials for [category] brands. I made a 20-second spec spot for a product like [product]: [link]\nIf it's useful, I can make one for your next launch. I'll try you by phone this afternoon.\n[your name], [phone]\n${F}\n\nIt is tempting to stop at the email. A call gets you an answer the same day, even when the answer is no, and a no is useful because it takes that company off your list. [The call script](${SCRIPT}) has the words for the opener, the ask and the four answers you will hear most.`,
      },
      {
        h: '5. The sums, with made-up numbers',
        body: `Here is how a week adds up. These numbers are an example, and yours will differ.\n\n- You dial 50 companies. Suppose 12 pick up.\n- Of those 12 conversations, suppose 2 agree to a 15-minute meeting to look at the piece.\n- Of every 4 meetings, suppose 1 turns into a paid test job.\n\nOn those assumptions, two weeks of calling leads to one paid job. Price that job the way [How to price AI commercial work](/guide/how-to-price-ai-commercial-work) lays out, and compare it with the eight or so hours the calling took.\n\nCount your own dials, conversations, meetings and jobs every week. After a month you will know which step loses people, and that is the step to work on.`,
      },
      {
        h: '6. What to dial with',
        body: `For the first 50 calls, a phone and the spreadsheet are enough. After that, the slow part is everything between calls: finding the next row, typing the number, writing the note, remembering who said "call me Thursday".\n\nA power dialer takes that over. You upload the spreadsheet, click once, and it calls down the list, moving to the next number when you finish a call and keeping your notes on each lead. We teamed up with [DialSheet](${dialsheetHref('guide-clients')}) for this series because its free plan fits a filmmaker's volume: ${FREE_PLAN}, calling from your browser. You import the CSV you already built.\n\nThe software is free on that plan, and the calls run on a phone line you bring or buy. You can connect your own Twilio account and pay Twilio's rates, which DialSheet lists as about $${DIALSHEET.twilioPerMinuteUsd} a minute for US calls and about $${DIALSHEET.twilioNumberUsd} a month for a number. Or you can take a DialSheet line in the US or Canada, which puts a local number, ${DIALSHEET.lineMinutes.toLocaleString('en-US')} minutes a month and the paid plan on one bill: ${LINE_PRICE_LINE}. Those prices were read on ${DIALSHEET_FACTS_READ}, and [our DialSheet page](${DIALSHEET_PATH}) has the rest.`,
      },
      {
        h: '7. Know the calling rules where you dial',
        body: `Calling a business on its published number to offer a business service is ordinary sales practice, and it is regulated. The rules differ by country. The US has the Telephone Consumer Protection Act and the National Do Not Call Registry, Canada has the National Do Not Call List and the Unsolicited Telecommunications Rules, and the UK has the Telephone Preference Service and its corporate list.\n\nRead the rules for the country you are calling into before your first session. Keep your own do-not-call list, and take a company off your list the first time they ask. DialSheet checks every dial against a do-not-call list you keep in it. Following the law is still your job. This guide is not legal advice.`,
      },
      {
        h: '8. Run it every week',
        body: `Block two calling sessions a week of about two hours each. On Monday, refresh the list and send the emails. Call on Monday and Wednesday afternoons. On Friday, do the follow-ups from [the cadence](${CADENCE}), count the week's numbers, and add new companies to replace the ones that said no.\n\nKeep entering contests while you do this. A new selection or award is a good reason to call a brand back, and the [closing soon list](/contests/closing-soon) shows what you can still enter this month.`,
      },
    ],
    faqs: [
      {
        q: 'Do brands hire AI filmmakers who contact them cold?',
        a: 'Some do, and you find out which by asking. A brand that needs new ads every month has a standing problem, and a finished spec piece for its own category is a concrete answer to it. Expect most calls to end in no or not now.',
      },
      {
        q: 'How many calls should I make a week?',
        a: 'Start with 50 dials a week across two sessions. That is enough to learn the script and count your numbers without taking over your production time.',
      },
      {
        q: 'Should I email or call?',
        a: 'Do both on the same day. Send the piece by email in the morning and call in the afternoon, so the call has something to refer to.',
      },
      {
        q: 'Do I need a dialer to start?',
        a: `No. A phone and a spreadsheet work for the first 50 calls. A dialer is worth adding when you call a list every week and lose time between calls. DialSheet's free plan covers ${FREE_PLAN}.`,
      },
      {
        q: 'Is it legal to cold call a business?',
        a: 'The rules differ by country, and many countries treat calls to businesses differently from calls to consumers. Check the telemarketing rules for the country you are calling into, keep a do-not-call list and stop when someone asks you to. This guide is not legal advice.',
      },
    ],
    relatedTitle: 'Keep going',
    related: [
      { href: SCRIPT, label: 'A cold call script for pitching AI video work to a brand' },
      { href: CADENCE, label: 'The follow-up cadence after you pitch a brand' },
      { href: DIALSHEET_PATH, label: 'AI Film Contests and DialSheet: what the team-up is' },
      { href: '/guide/how-to-price-ai-commercial-work', label: 'How to price AI commercial work' },
      { href: '/contests/closing-soon', label: 'Contests closing soon' },
    ],
  },

  'cold-call-script-for-ai-video-work': {
    title: 'A Cold Call Script for Pitching AI Video Work to a Brand',
    description: 'A word-for-word cold call script for filmmakers pitching AI commercial work: the opener, the two-sentence pitch, the ask, the voicemail, and what to say to the four answers brands give most.',
    keywords: 'cold call script video production, cold call script for filmmakers, pitch AI video to brands, AI commercial pitch script, video production sales script, voicemail script video production, how to pitch a brand by phone',
    datePublished: '2026-11-22',
    author: ABHI,
    intro: `A cold call to a brand has one job, which is to book a 15-minute meeting where you show the spec piece. Selling the project, quoting a price and explaining the models all wait for that meeting. This script runs under two minutes: an opener, a two-sentence pitch, one question and the ask, then what to say to the four answers you will hear most.\n\nRead it aloud ten times before your first dial and change any line that doesn't sound like you. It is the second of three guides we made with [DialSheet](${DIALSHEET_PATH}), after [the weekly outreach system](${SYSTEM}) and before [the follow-up cadence](${CADENCE}).`,
    sections: [
      {
        h: 'Before you dial: one true line per company',
        body: `Each row of your list needs one specific line about that company: a product they launched, an ad of theirs you watched, a shop they opened. Thirty seconds on their site or their Instagram is enough. Without that line, you sound like every other vendor who phoned that day.\n\nHave the spec piece open in one tab, your calendar in another and the list in front of you. Close the edit. You can't listen to a brand manager and scrub a timeline at once.`,
      },
      {
        h: 'The opener',
        body: `Say who you are, show that you know who they are, and ask for half a minute.\n\n${F}\nHi [name], it's [your name]. I'm a filmmaker, and I'm calling about [company]'s [product]. I know I'm calling out of the blue. Do you have 30 seconds for why?\n${F}\n\nThirty seconds is a small thing to say yes to. If they say they're busy, ask when to call back, write the time down, and call at that time.`,
      },
      {
        h: 'The pitch, in two sentences',
        body: `${F}\nI make short commercials for [category] brands using AI video, which means a finished 20-second spot in days and without a shoot. I made one for a product like yours and emailed you the link this morning.\n${F}\n\nStop there. The silence after a pitch feels longer than it is, and whatever they say next tells you which part of the script comes next.`,
      },
      {
        h: 'One question',
        body: `If they are still with you, ask one question about how they make ads now.\n\n${F}\nHow are you making your product videos at the moment? In-house, an agency, or freelancers?\n${F}\n\nListen to the whole answer and write it in your notes. A brand with an agency on retainer needs a different follow-up from a founder who films on her phone.`,
      },
      {
        h: 'The ask',
        body: `${F}\nI'd like to show you the spot and hear what you have launching next. Could we do 15 minutes on a video call, Thursday at 10 or Friday at 2?\n${F}\n\nOffer two specific times. "Sometime next week" invites "send me an email", and two times invite a choice between them. When they pick one, send the calendar invite while you are still on the phone, and tell them you have.`,
      },
      {
        h: 'The four answers you will hear',
        body: `"Send me an email." You already did, so say so and keep the meeting open.\n\n${F}\nI sent it this morning, subject line "a 20-second spot for [product]". It takes 20 seconds to watch. Can I call you Thursday once you've seen it?\n${F}\n\n"We already have an agency." Agree with them and describe the work that sits beside an agency.\n\n${F}\nThat makes sense, and I'm not looking to replace them. What I make is the pieces a retainer usually doesn't cover: the launch that's next week, six cutdowns for social. Would it be worth seeing one?\n${F}\n\n"We don't use AI." Ask what the worry is before you answer it. It is usually the look of the product, the legal position or how customers will react.\n\n${F}\nFair enough. Is it the look, the legal side, or how customers might take it?\n${F}\n\nIf it's the look, ask them to judge the piece you sent. If it's legal, tell them your contract names the AI tools you use and the usage they are buying. [How to price AI commercial work](/guide/how-to-price-ai-commercial-work) covers those contract lines.\n\n"We have no budget." Take it at face value and ask about timing.\n\n${F}\nUnderstood. When does next quarter's budget get set? I'll send a new piece before then and call you that week.\n${F}\n\nPut that date in your follow-up list and keep it.`,
      },
      {
        h: 'The voicemail',
        body: `Many dials end in voicemail. Leave one, under 20 seconds, and say your name and number twice.\n\n${F}\nHi [name], this is [your name] on [phone number]. I'm a filmmaker, and I made a 20-second spot for a product like [product]. It's in your inbox, subject line "a 20-second spot for [product]". Again, [your name], [phone number].\n${F}`,
      },
      {
        h: 'When the main line answers',
        body: `Be plain about who you want and why.\n\n${F}\nHi, it's [your name]. Could you put me through to [name] in marketing? It's about the commercial I sent over this morning.\n${F}\n\nIf they ask you to email instead, ask for the right address and the best time to call back, and thank them by name. You will probably speak to the same person next week.`,
      },
      {
        h: 'Keep the script where you can see it',
        body: `Print the script or keep it on the other half of your screen. If you call from [DialSheet](${dialsheetHref('guide-script')}), it shows your saved call script beside the dialer, so the words are next to the lead you are calling.\n\nAfter every call, write three things: what they said, what you promised, and the date of the next touch. [The follow-up cadence](${CADENCE}) tells you what that next touch should be.`,
      },
    ],
    faqs: [
      {
        q: 'How long should a cold call to a brand be?',
        a: 'Under two minutes for the first call. Its only job is to book 15 minutes.',
      },
      {
        q: 'What if I freeze on the call?',
        a: 'Read the opener word for word. The script exists so you never have to think of the next line, and it gets easier after the first session.',
      },
      {
        q: 'What is the best time to call a brand?',
        a: "Count pickups by hour for your own list and call in the hours that work. Dial in the brand's time zone, not yours.",
      },
      {
        q: 'Should I say the work is made with AI?',
        a: 'Yes, in the pitch. A brand that will not use AI video saves you both a meeting by saying so, and a curious one now has a reason to watch.',
      },
      {
        q: 'What do I send after the call?',
        a: `The calendar invite if they agreed to meet, or the link again with one line about what you discussed. [The follow-up cadence](${CADENCE}) has the full sequence.`,
      },
    ],
    relatedTitle: 'Keep going',
    related: [
      { href: SYSTEM, label: 'How AI filmmakers get commercial clients: the weekly system' },
      { href: CADENCE, label: 'The follow-up cadence after you pitch a brand' },
      { href: DIALSHEET_PATH, label: 'AI Film Contests and DialSheet: what the team-up is' },
      { href: '/guide/real-brands-in-ai-spec-ads', label: 'Can you use a real brand in an AI spec ad?' },
    ],
  },

  'follow-up-cadence-after-pitching-a-brand': {
    title: 'The Follow-Up Cadence After You Pitch a Brand: Seven Touches in Fourteen Days',
    description: 'A 14-day follow-up cadence for filmmakers pitching AI commercial work: seven touches by phone and email, the words for each, when to stop, and how to keep track of a hundred open follow-ups.',
    keywords: 'follow up after pitching a brand, follow-up cadence freelancer, video production follow up email, how many times to follow up with a client, sales cadence for creatives, follow up email template filmmaker',
    datePublished: '2026-11-22',
    author: ABHI,
    intro: `One call and one email rarely get an answer, because the person you pitched has a launch, a boss and an inbox. A cadence is a schedule of follow-ups that you decide once and then run the same way for every brand. This one is seven touches over fourteen days, by phone and by email, and it ends with a message that asks for a clear yes, no or later.\n\nIt is the third of three guides we made with [DialSheet](${DIALSHEET_PATH}). Start with [the weekly outreach system](${SYSTEM}) and [the call script](${SCRIPT}) if you have not made the first call yet.`,
    sections: [
      {
        h: 'The schedule',
        body: `- Day 1: email the spec piece in the morning, call in the afternoon, and leave a voicemail if nobody answers\n- Day 3: call again, without a voicemail\n- Day 6: email one new thing\n- Day 9: call, and leave a voicemail that mentions the new thing\n- Day 12: email about timing\n- Day 14: send the closing email\n\nIf a day lands on a weekend, move it to Monday. Stop the moment you get an answer of any kind.`,
      },
      {
        h: 'What each touch says',
        body: `The day 3 call is one line, and then you are back in [the script](${SCRIPT}).\n\n${F}\nHi [name], [your name] again, the filmmaker who sent the 20-second spot for [product]. Did you get a chance to watch it?\n${F}\n\nThe day 6 email carries something they have not seen: a vertical cut, one extra still, or a different end card.\n\n${F}\nSubject: [product], vertical cut\nHi [name], I cut the spot to 9:16 for Reels and TikTok: [link]\nSame offer as before: 15 minutes to show you how I'd make one for your next launch.\n[your name], [phone]\n${F}\n\nThe day 9 voicemail points at that email.\n\n${F}\nHi [name], this is [your name] on [phone number]. I sent a vertical cut of the [product] spot on [day]. I'll try you once more this week. Again, [your name], [phone number].\n${F}\n\nThe day 12 email gives them a date to react to.\n\n${F}\nSubject: before [launch or season]\nHi [name], if you have anything launching before [date], I can turn a spot around in [number] days from a product photo. Worth 15 minutes this week?\n[your name], [phone]\n${F}\n\nThe day 14 email asks for a decision.\n\n${F}\nSubject: closing the loop\nHi [name], I've tried you a few times and I don't want to keep filling your inbox. Should I check back next quarter, or take you off my list?\n[your name]\n${F}\n\nThat last one is easy to answer in a word, which is why it is worth sending. Whatever they reply, do what they say.`,
      },
      {
        h: 'Every touch adds something',
        body: `A follow-up that says "checking in" gives the reader nothing to respond to. Each touch above carries one new thing: a second cut, a date, or a question they can answer in a word.\n\nKeep the new thing small enough that it takes you minutes to make. A vertical crop, one extra still and a different end card all count.`,
      },
      {
        h: 'When to stop, and when to come back',
        body: `A yes moves to scheduling. A no comes off the list for good, and a request to stop calling goes on your do-not-call list that day. "Not now" gets a date: ask when to try again, put it in your tracker, and start a shorter cadence then with a new piece.\n\nAfter day 14 with no reply, wait 90 days. A new contest selection, a new spec piece for their category and a launch on their side are all good reasons to start again.`,
      },
      {
        h: 'Keeping track of a hundred open follow-ups',
        body: `With 50 new companies a week on a 14-day cadence, you can have a hundred companies mid-cadence at once. Nobody holds that in their head. Add three columns to your spreadsheet (last touch, next touch, next touch date) and sort by date every morning.\n\nA dialer with a CRM does that sorting for you. In [DialSheet](${dialsheetHref('guide-cadence')}), each lead has tasks and callback reminders, so tomorrow's calls are waiting in a list when you sit down. Its paid plan adds sequences that mix email, call and task steps and stop when the lead replies. The free plan covers ${FREE_PLAN}, and [our DialSheet page](${DIALSHEET_PATH}) explains the plans.`,
      },
      {
        h: 'Count what the cadence does',
        body: `Each week, note which touch got the reply. After a month you will see where your answers come from. If nothing ever comes from day 12, cut it. If the day 3 call books most of your meetings, protect that hour. Treat this schedule as a first draft and let your own numbers rewrite it.`,
      },
    ],
    faqs: [
      {
        q: 'How many times should I follow up with a brand?',
        a: 'Seven touches over fourteen days, then stop and wait 90 days unless they answer sooner. Change the count once you have a month of your own numbers.',
      },
      {
        q: 'Is it rude to keep calling?',
        a: 'Following up on a specific offer, on a published business line, is ordinary. Make sure each touch adds something, stop when asked, and follow the calling rules for the country you are dialing.',
      },
      {
        q: 'What if they reply "not interested"?',
        a: 'Thank them, take them off the list, and do not contact them again unless they reach out.',
      },
      {
        q: 'Should follow-ups be calls or emails?',
        a: 'Alternate. A call gets a live answer, and an email carries the link and gives them something to forward to a colleague.',
      },
      {
        q: 'When do I send a new spec piece?',
        a: 'When you restart a cadence after 90 days, or when a brand tells you about a specific launch. One piece per category is enough for first contact.',
      },
    ],
    relatedTitle: 'Keep going',
    related: [
      { href: SYSTEM, label: 'How AI filmmakers get commercial clients: the weekly system' },
      { href: SCRIPT, label: 'A cold call script for pitching AI video work to a brand' },
      { href: DIALSHEET_PATH, label: 'AI Film Contests and DialSheet: what the team-up is' },
      { href: '/guide/how-to-price-ai-commercial-work', label: 'How to price AI commercial work' },
    ],
  },
}
