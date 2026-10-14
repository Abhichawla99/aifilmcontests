export const TOOLS: Record<string, {
  name: string
  tagline: string
  description: string
  keywords: string
  matchTerms: string[] // terms to match in ai_tools_allowed
}> = {
  'runway': {
    name: 'Runway',
    tagline: 'Film contests that use or require Runway ML',
    description: 'Runway is the most active AI film platform in competition. They run the AI Film Festival ($135K prize pool at Lincoln Center), the Gen:48 48-hour challenge, and the Hundred Film Fund ($5K–$1M per project). They also sponsor and screen at other major festivals.',
    keywords: 'Runway AI film contest, Runway ML competition, Runway Gen-4 film festival, Runway film fund 2026',
    matchTerms: ['runway'],
  },
  'kling': {
    name: 'Kling AI',
    tagline: 'Film contests accepting or requiring Kling AI',
    description: 'Kling AI (by Kuaishou) runs the NextGen Creative Contest — 4,600+ entries from 122 countries, $42K+ prizes, jury of Oscar winners, screenings at Tokyo International Film Festival. Their 2026 edition is expected mid-year.',
    keywords: 'Kling AI film contest, Kling AI competition 2026, Kuaishou AI film festival, Kling NextGen contest',
    matchTerms: ['kling'],
  },
  'luma': {
    name: 'Luma AI',
    tagline: 'Film contests that use or require Luma AI',
    description: 'Luma AI partnered with creative studio DE-YAN for the Dream Brief — a $1,000,000 contest for commercials that win a Cannes Lions Gold Lion. The biggest AI film prize ever announced. Judged by Nike, HBO Max, and Wieden+Kennedy.',
    keywords: 'Luma AI contest, Luma Dream Brief competition, Luma Dream Machine film festival 2026',
    matchTerms: ['luma'],
  },
  'hailuo': {
    name: 'Hailuo AI',
    tagline: 'Film contests that use or require Hailuo AI (MiniMax)',
    description: 'Hailuo AI (by MiniMax) powers the WSXA × Hailuo AI Film Competition — themed around Anti-War and Climate Resilience. Finalists are screened at WSXA Amsterdam and ARFF Berlin. Requires 50%+ Hailuo AI usage.',
    keywords: 'Hailuo AI film contest, MiniMax AI competition, Hailuo film festival 2026, WSXA Hailuo',
    matchTerms: ['hailuo', 'minimax'],
  },
  'pika': {
    name: 'Pika',
    tagline: 'Film contests that use or require Pika',
    description: 'Pika is one of the leading generative video tools accepted across most open AI film competitions. Many contests allow any AI tools — including Pika — for character animation, motion generation, and video-to-video work.',
    keywords: 'Pika AI film contest, Pika video competition 2026, Pika film festival',
    matchTerms: ['pika'],
  },
  'sora': {
    name: 'Sora',
    tagline: 'Film contests that use or require OpenAI Sora',
    description: 'OpenAI Sora is accepted across most open AI film competitions. As access expands, expect more Sora-specific categories. Currently most contests with "any AI tools" policies accept Sora-generated footage.',
    keywords: 'Sora AI film contest, OpenAI Sora competition 2026, Sora film festival',
    matchTerms: ['sora', 'openai'],
  },
  'midjourney': {
    name: 'MidJourney',
    tagline: 'AI film contests compatible with MidJourney',
    description: 'MidJourney is the leading AI image generation tool and is widely used in AI film production for concept art, storyboarding, and key frame generation. While not a video tool itself, MidJourney images are frequently used as reference frames for video generation tools like Runway and Kling.',
    keywords: 'MidJourney film contest, MidJourney AI competition 2026',
    matchTerms: ['midjourney', 'mid journey'],
  },
  'stable-diffusion': {
    name: 'Stable Diffusion',
    tagline: 'AI film contests compatible with Stable Diffusion',
    description: 'Stable Diffusion and its variants (SDXL, ComfyUI workflows) are used extensively in AI film production for image generation, img2img transformation, and ControlNet-guided video frames. Open source and highly customizable.',
    keywords: 'Stable Diffusion film contest, Stable Diffusion AI competition 2026',
    matchTerms: ['stable diffusion', 'comfyui', 'sdxl'],
  },
  'heygen': {
    name: 'HeyGen',
    tagline: 'AI film contests compatible with HeyGen',
    description: 'HeyGen specializes in AI avatar and talking head video generation — useful for documentary-style AI films, interview recreations, and narrative films featuring consistent human characters.',
    keywords: 'HeyGen film contest, HeyGen AI competition 2026',
    matchTerms: ['heygen', 'hey gen'],
  },
  'adobe-firefly': {
    name: 'Adobe Firefly',
    tagline: 'AI film contests compatible with Adobe Firefly',
    description: "Adobe Firefly's generative fill, text-to-image, and video generation capabilities are increasingly used in professional AI film production, particularly for compositing and visual effects work in Adobe Premiere Pro and After Effects.",
    keywords: 'Adobe Firefly film contest, Firefly AI competition 2026',
    matchTerms: ['firefly', 'adobe ai', 'adobe firefly'],
  },
  'elevenlabs': {
    name: 'ElevenLabs',
    tagline: 'AI film contests using ElevenLabs voice and audio',
    description: 'ElevenLabs produces the most convincing AI voiceover available. Its voices are standard in competition-level AI film production. Many winning AI films rely on ElevenLabs for narration, character voices, and sound design elements.',
    keywords: 'ElevenLabs film contest, ElevenLabs AI voice competition 2026',
    matchTerms: ['elevenlabs', 'eleven labs'],
  },
  'capcut': {
    name: 'CapCut',
    tagline: 'AI film contests compatible with CapCut',
    description: "CapCut's AI generation features — including text-to-video, AI effects, and smart editing tools — are used primarily for short-form AI film content. Particularly relevant for competitions that accept social-media formatted entries.",
    keywords: 'CapCut AI film contest, CapCut video competition 2026',
    matchTerms: ['capcut', 'cap cut'],
  },
  'topaz': {
    name: 'Topaz Video AI',
    tagline: 'AI film contests using Topaz for upscaling and enhancement',
    description: 'Topaz Video AI is used in virtually every professional AI film production for upscaling, frame interpolation, and noise reduction. It transforms 1080p AI-generated footage into 4K delivery quality, and removes the artifacts and flickering that generation tools sometimes produce.',
    keywords: 'Topaz Video AI film, AI video upscaling competition 2026',
    matchTerms: ['topaz'],
  },
  'invideo': {
    name: 'InVideo AI',
    tagline: 'AI film contests compatible with InVideo AI',
    description: 'InVideo AI offers a text-to-video generation system with a focus on accessible, script-driven production. Used for documentary-style and informational AI films where narrative clarity is prioritized.',
    keywords: 'InVideo AI film contest, InVideo AI competition 2026',
    matchTerms: ['invideo', 'in video'],
  },
}
