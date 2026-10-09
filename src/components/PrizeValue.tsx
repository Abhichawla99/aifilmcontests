// ── The prize, set as what it actually is ──────────────────────────────────
// Every prize was printed at clamp(20px, 2.4vw, 26px) in the category tint —
// the display setting this page otherwise keeps for "22 days left". It suits
// "€10,000 Grand Prix". It does not suit "Best Filmmaker, Best Ai, Best Short
// Film, Best Ai Fantasy Film and Best Fashion Film awards plus PR/publication
// placement (no cash prize published)": 147 characters arriving as two lines of
// shouted sentence case. Of the 91 open contests carrying prize text today, 65
// name no money amount at all and only 15 are short enough to read as a figure,
// so the headline treatment was wrong for five in six of them.
//
// The setting now follows the value, the way SpecRow below already does it for
// the rail. Nothing is extracted, reordered or dropped: the string is always
// printed whole.
const PRIZE_IS_A_FIGURE = 32

// Deliberately conservative. A trailing dot is excluded so a sentence-final
// "$300." does not swallow its full stop, and the K/M/million/lakh/crore suffix
// is only taken when it is a whole word. The digits must end on a digit, so
// the comma in "up to ₹50,00,000, subject to government support" stays in the
// sentence instead of being picked out with the figure. A trailing "+" is
// kept, because "$25K+" means something different from "$25K".
const MONEY = /(?:US\$|A\$|CA\$|NZ\$|S\$|HK\$|R\$|[$\u00A3\u20AC\u20B9\u00A5\u20BD\u20A9])\s?\d(?:[\d,]*\d)?(?:\.\d{1,2})?(?:\s?(?:[KkMm]|million|lakh|crore)\b)?\+?/g

// The money inside a sentence, picked out in the tint and in the figure face,
// so it is still scannable at a glance without the page promoting one number to
// a headline it does not deserve — several of these prizes list three.
function PrizeFigures({ text, color }: { text: string; color: string }) {
  const parts: React.ReactNode[] = []
  let last = 0
  for (const m of Array.from(text.matchAll(MONEY))) {
    const at = m.index ?? 0
    if (at > last) parts.push(text.slice(last, at))
    parts.push(
      <span key={at} style={{
        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, color,
        fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em',
      }}>
        {m[0]}
      </span>
    )
    last = at + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}

export default function PrizeValue({ text, color, gap }: { text: string; color: string; gap: number }) {
  const value = (text || '').trim()
  if (!value) return null
  // `match` with a /g regex returns every hit and leaves no lastIndex behind,
  // unlike `test`.
  const figures = value.match(MONEY)

  // "€10,000 Grand Prix" — short, and the figure is the whole point of it.
  if (figures && value.length <= PRIZE_IS_A_FIGURE) {
    return (
      <div style={{
        fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(20px, 2.4vw, 26px)',
        fontWeight: 700, color, lineHeight: 1.25, letterSpacing: '-0.02em',
        marginBottom: gap, fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </div>
    )
  }

  // A sentence, set to be read: full ink rather than the tint, one notch above
  // the body copy around it so the section still answers its own label, and
  // held to a measure so a 149-character prize does not run the full column.
  return (
    <p style={{
      fontSize: 16.5, color: '#1B1916', lineHeight: 1.62, fontWeight: 500,
      letterSpacing: '-0.005em', marginBottom: gap, maxWidth: '58ch',
      fontVariantNumeric: 'tabular-nums',
    }}>
      {figures ? <PrizeFigures text={value} color={color} /> : value}
    </p>
  )
}
