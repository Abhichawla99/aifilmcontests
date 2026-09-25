/* Craft guides for filmmakers doing brand and commercial work, rendered by
   src/components/CraftGuidePage.tsx at /guide/<slug> (one static route per
   guide under src/app/guide/). Body text is markdown-lite: blank line = new
   paragraph, "- " lines = a list, ``` fences = a template block,
   [anchor](href) = a link. The first intro paragraph must carry no links.
   Facts dated September 24, 2026. */

export interface CraftGuideSection { h: string; body: string }
export interface CraftGuideFaq { q: string; a: string }
export interface CraftGuideLink { href: string; label: string }
export interface CraftGuide {
  title: string
  description: string
  keywords: string
  datePublished: string
  dateModified?: string
  intro: string
  sections: CraftGuideSection[]
  faqs: CraftGuideFaq[]
  related: CraftGuideLink[]
  relatedTitle?: string
}

export const CRAFT_GUIDE_ORDER: string[] = [
  "look-bible-for-ai-films",
  "mood-board-for-ai-film-without-copying",
  "ai-commercial-storyboard-and-shot-list",
  "consistent-characters-in-ai-film",
  "product-accuracy-in-ai-commercials",
  "first-frame-for-image-to-video",
  "ai-commercial-packshot-and-end-card",
  "ai-food-and-drink-commercials",
  "real-brands-in-ai-spec-ads",
  "how-to-price-ai-commercial-work"
]

export const CRAFT_GUIDES: Record<string, CraftGuide> = {
  "look-bible-for-ai-films": {
    "title": "How to Build a Look Bible for an AI Film or Commercial",
    "description": "A look bible fixes palette, light, lens, grain and format in words a model follows, so every AI shot cuts together. What goes in it, with a real kept prompt.",
    "keywords": "look bible AI film, AI film visual style guide, visual bible AI video, AI commercial look book, consistent style AI video, hex color palette prompt, film grain prompt, Midjourney sref, visual DNA brand",
    "datePublished": "2026-09-24",
    "intro": "A look bible is a short document that fixes how every shot of a film looks: the palette with hex codes, the light, the lens, the grain, the grade and the format. For an AI film or commercial, write it before you generate anything, in the same words you will paste into prompts, and test it on a strip of stills before production. Every shot then starts from the same instructions instead of from the model's defaults.\n\nFilm productions have long pitched a look before shooting it. StudioBinder, which makes production software, defines a lookbook as \"a collection of movie stills, photographs, or any other visuals that are compiled to illustrate a filmmaker's vision for a film.\" For AI work, a look bible goes one step further and turns those pictures into rules. In live action, the camera, the lenses and the crew carry the look from shot to shot. In AI production nothing carries over between generations unless you send it, so every shot starts from the model's defaults unless your words and references say otherwise.",
    "sections": [
      {
        "h": "What goes in it",
        "body": "Keep it to one page. Each line should be something you can paste into a prompt or check with an eyedropper.\n\n- Palette: Five to seven colors, each with a name, a hex code and where it lives in the frame, such as walls, wardrobe, sky or product.\n- Light: Direction, hard or soft, color temperature in Kelvin, time of day, how dark the shadow side falls, and which practical lamps are allowed in shot.\n- Lens and camera: One focal length per shot size (for example 35mm for wides, 85mm for faces, a 100mm macro for product), the aperture, camera height and the moves you allow.\n- Texture: How much grain and which film stock it imitates, how sharp, whether highlights bloom.\n- Format: Aspect ratio, frame rate and every delivery size.\n- Grade: Contrast, black level and the name of the LUT file you will apply in the edit.\n- World: Locations, era, wardrobe rules and props that recur.\n- Never list: What the model adds when the bible is silent, such as lens flares, a teal and orange grade, or stray signage text.\n\nFor the format lines, use the standards your delivery will be judged on. Netflix's list of standard display aspect ratios runs from 1.78 (16:9) and 1.85 to 2.39 and 2.40, while social placements want 9:16 for Reels and TikTok and 4:5 for the Facebook feed. The Digital Cinema Initiatives specification requires support for 24 frames per second, and Google's Veo 3.1 generates at 24 fps, so 24 is the safe choice for a film that may screen in a cinema."
      },
      {
        "h": "Write the lines the way a model reads them",
        "body": "The agency 100 Creatives kept count of what worked across its 2026 campaigns. The prompts behind kept images ran about 140 to 200 words on Google's Nano Banana models and about 300 on OpenAI's GPT Image. They opened with the subject and a pointer to the reference image, named the background with a hex color, described light as something falling on a surface, listed the palette as names plus hex codes, gave camera and lens one sentence, and put grain in a separate sentence of its own. That is a look bible, broken into prompt order.\n\nHere is one of those kept prompts, for a food ad on white, made on Nano Banana 2 (lightly edited: brand names removed).\n\n```\nThe product shown in the reference image sits perfectly centered on a white surface (#FFFFFF) surrounded by concentric rings of cocoa dust radiating outward like a bullseye target, created by a burst of powder frozen in perfect circular formation. Rich cocoa tones (#3E2015) grade outward to lighter cocoa dust brown (#B07D46) at the outermost ring. Sharp overhead flash renders every granule of cocoa powder in crystalline detail while casting a tight shadow directly beneath the brownie. The crumb texture of the brownie's top surface echoes the dusty rings below. Framed directly overhead at 50mm, f/8, focus even across the entire flat plane, composed as a perfect circle radiating from center. Heavy visible film grain throughout. Color grading references medium format Hasselblad digital, clinical sharpness, neutral whites, controlled warmth in the brown spectrum, pronounced grain, high contrast at center, saturation naturalistic and grounded in earth tones.\n```\n\nA person added the sentence \"Heavy visible film grain throughout.\" by hand. All ten kept images on that job asked for heavy film grain, and nine carried that exact sentence. Only 14 of the job's 120 prompts carried it, so 9 of those 14 became keepers, against 1 of the other 106. Because it was added by hand, it marks prompts someone was already working on closely, so it shows the value of a locked line more than the power of four words. The same lesson holds for a film. Once a look line works, paste it unchanged into every shot."
      },
      {
        "h": "Use style references with care",
        "body": "Reference images can carry a style faster than words, and they can carry too much. Midjourney, now on V8.2 by default, says its Style Reference \"doesn't copy objects or people, just the overall style,\" with a style weight (--sw) from 0 to 1000 and a default of 100. Runway's References take up to three images per generation, and its guide suggests adding an image of the style you want alongside your prompt. Kling's IMAGE 3.0 takes up to 10 reference images and says it \"can deeply deconstruct the core style of reference images.\" Google's Veo 3.1 reference images are for subjects, a person, character or product, and it lists no style type.\n\nUse style references to find the look, then write down what they gave you. A style code or a reference image is hard to version and easy to lose, while a sentence of palette, light and grain goes into every prompt and every tool. If the reference is someone else's image, read our guide to [using a mood board without copying it](/guide/mood-board-for-ai-film-without-copying) first."
      },
      {
        "h": "Test the bible on a strip of stills",
        "body": "Before production, render six stills that cover the range of the film: a wide, a close-up, a product or prop insert, a night or low-light shot, the brightest shot and the darkest shot. Lay them side by side at the same size. If one looks like it came from a different film, the bible is missing a line; add it and render the strip again.\n\nThen version it. Name the file with a number and a date, and write the version into your shot list, so a shot rendered on version 2 is not cut next to one from version 4. For a contest with a making-of or statement field, the bible also gives you a clear account of how you directed the look."
      },
      {
        "h": "Carry it through the edit and grade",
        "body": "Generation gets the shots close, and the edit and grade make them match. [ARRI describes a LUT](https://www.arri.com/en/learn-help/learn-help-camera-system/tools/lut-generator) as something that \"transforms a digital signal to adjust the sensitivity and gamma, and provide a color correct monitoring input.\" In practice, one LUT or one grade applied to every shot pulls separate generations toward the same contrast and color. Grade after the cut is locked, check skin and product colors against the hex values in the bible, and add grain in the grade as well as in the prompt so every shot shares one texture. [Our post-production guide](/guide/ai-film-post-production) covers the rest of the finishing chain."
      },
      {
        "h": "What juries notice",
        "body": "Contest juries score the thing a look bible protects. [The Runway AI Festival's rules](https://aif.runwayml.com/terms-film) score each criterion from 1 to 10, and its film track judges \"Cohesion of the narrative & artistic message\" while its advertising track judges \"Cohesion of the concept & artistic message.\" Higgsfield's festival rules judge visual craft on \"composition, cinematography, world-building, coherence of AI-generated imagery.\" Curious Refuge's 2026 Feel Good competition judged \"uniqueness, consistency, and overall impact,\" and the Reply AI Film Festival scores craftsmanship as \"overall quality of the production.\" A film whose shots look like they came from different films loses points on every one of those lines. Our guide to [how to win the Runway AI Film Festival](/guide/how-to-win-runway-ai-film-festival) goes through one jury's criteria in detail."
      },
      {
        "h": "How Overs writes a brand's look bible before it makes a photo",
        "body": "Overs works the way this page says to work. It writes the look down before any image exists. You give it one product photo and the brand's details, meaning its website, photos it already has and, if there is one, a brand guidelines PDF of up to 24 pages. It researches the brand and writes its visual DNA, the colors with hex codes, the light, lens, grain and styling, then runs art direction, casting and shot planning on top. Brand rules are applied last, so they have the final say, and you can watch every step.\n\nThe bible stays current. Brand Watch reads the brand's recent Instagram posts, on request at most once a month on the free plan, weekly on Pro and daily on Team, and every approval and rejection becomes brand memory for the next set.\n\nThe process comes from 100 Creatives, the agency Abhi Chawla founded, which used it to make hundreds of photos a week for hundreds of brands, and the brownie job above is one of its campaigns. Across four of them, 361 renders gave 45 keepers, about 8 tries per usable photo, which is $0.27 to $1.69 in AI fees per keeper at published prices of $0.034 to $0.211 a render. Abhi's own businesses make their images with Overs today. It makes stills, including key frames to animate, and writes a text motion prompt for each photo for Seedance or Veo. [Overs' guide to a brand's visual DNA](https://www.overs.studio/guides/what-is-visual-dna) includes a template.\n\nOvers is a sister product to AI Film Contests, from the same founder. The free plan covers 40 photos a month on your own OpenRouter key, with no markup from Overs. [Try Overs free at www.overs.studio](https://www.overs.studio) and read your brand's visual DNA before a single photo renders."
      }
    ],
    "faqs": [
      {
        "q": "What is a look bible for an AI film?",
        "a": "A look bible is a one-page document that fixes the visual rules of a film before production: palette with hex codes, light, lens, grain, grade, format and a list of things never to show. In AI filmmaking it doubles as a prompt library, because each line is written the way a model reads it and pasted unchanged into every shot, so separate generations cut together as one film."
      },
      {
        "q": "How do I keep the same visual style across AI video clips?",
        "a": "Write the style as fixed sentences and paste them into every prompt unchanged: the palette as names and hex codes, the light as something falling on a surface, one sentence for camera and lens, one for grain. Start each clip from a still that already matches the bible, then apply one LUT to every shot in the grade. Test the bible on six stills before you render video."
      },
      {
        "q": "Should I put hex codes in AI prompts?",
        "a": "Yes, as names plus hex codes, and treat them as hints. Image models do not read a hex value the way design software does, so check the result with an eyedropper and correct the grade in post. In the kept prompts from 100 Creatives' 2026 campaigns, backgrounds and palettes were named with hex codes, such as a white surface written as #FFFFFF."
      },
      {
        "q": "Can I use Midjourney style references for an AI film?",
        "a": "Yes, to find and hold a look. Midjourney V8.2 supports style references, style codes and moodboards, and its documentation says a style reference takes the overall style and leaves objects and people behind, with a style weight from 0 to 1000. Write down what the reference gave you as palette, light and grain sentences, because a sentence works in every tool while a style code works only in Midjourney."
      },
      {
        "q": "Can Overs make a look bible for my film?",
        "a": "Overs writes a brand's visual DNA, meaning colors with hex codes, light, lens, grain and styling, from a website, existing photos and an optional guidelines PDF, and uses it for every still it makes. It is built for product and campaign photos and does not make video, so for a brand spot, use its visual DNA as the starting point for the film's look bible."
      }
    ],
    "related": [
      {
        "href": "/contests/chroma-awards-season-2-2026",
        "label": "Chroma Awards Season 2: over $175,000 in cash prizes, closes December 31, 2026"
      },
      {
        "href": "/contests/pixlight-2026",
        "label": "PixLight 2026: $300,000 pool, closes October 9, 2026"
      },
      {
        "href": "/contests/ai-london-film-festival-2026",
        "label": "AI London Film Festival: theatrical screening in London, closes October 7, 2026"
      },
      {
        "href": "/categories/short-film",
        "label": "Every open AI short film contest"
      }
    ]
  },

  "mood-board-for-ai-film-without-copying": {
    "title": "How to Use a Mood Board for an AI Film Without Copying It",
    "description": "Image and video models copy reference pictures literally. How to turn a mood board into words, what the law and contest rules say, and how to keep a reference log.",
    "keywords": "mood board AI film, AI mood board without copying, style reference AI video, Midjourney sref copyright, reference images AI contest rules, is style copyrighted, AI film originality rules, mood board to prompt",
    "datePublished": "2026-09-24",
    "intro": "Use a mood board for an AI film by translating it into words before any image goes near a model: the light, the palette, the texture, the energy and the era, plus a short list of things from the board you must not reproduce. Feed reference images only for style, never someone else's photograph as the starting frame, and keep a log of where every board image came from. That keeps the feeling of the board and leaves the pictures behind.\n\nThis guide covers why models copy boards, what US and UK law protects, what contest rules and tool terms ask of you, how to turn a board into words and a ban list, how to use style references lightly, and how to keep a reference log.",
    "sections": [
      {
        "h": "Why models copy the board",
        "body": "An image model given a reference picture treats it as evidence of what you want, and the strongest evidence in a photograph is its content: the subject, the pose, the composition, even a watermark in the corner. Ask for \"the mood of this image\" and the result can come back as the image itself with small changes. In video it goes further, because an image-to-video model starts from whatever frame you give it.\n\nThat is a craft problem before it is a legal one. A film built from near-copies of other people's frames looks like a collage of its references instead of a world of its own."
      },
      {
        "h": "What the law protects, and what it leaves open",
        "body": "In the US, style is free and expression is not. The Copyright Act says protection never extends \"to any idea,\" and the US Copyright Office's [July 2024 report on digital replicas](https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-1-Digital-Replicas-Report.pdf) says copyright \"does not protect artistic style as a separate element of a work.\" The same report adds that the law \"may, however, provide a remedy\" when an output in someone's style \"ends up replicating not just the artist's style but protectible elements of a particular work.\" That is the line a mood board has to stay behind. The feel of a photographer's light is yours to use, and recreating one of their photographs, its particular composition and subject, is where the risk starts.\n\nThe Copyright Office's [January 2025 report on copyrightability](https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-2-Copyrightability-Report.pdf) matters for what you can own. It says \"prompts alone do not provide sufficient human control to make users of an AI system the authors of the output,\" but \"where a human inputs their own copyrightable work and that work is perceptible in the output, they will be the author\" of that portion. Using your own photographs and frames as references protects you twice. No one else's rights are in the frame, and your own expression is.\n\nIn the UK, [Getty Images v Stability AI](https://www.judiciary.uk/wp-content/uploads/2025/11/Getty-Images-v-Stability-AI.pdf), decided on November 4, 2025, was narrow. The court dismissed Getty's secondary infringement claim because the model \"does not store or reproduce any Copyright Works,\" and Getty won only narrow trademark points over old watermarks, findings the judge called \"both historic and extremely limited in scope.\" Getty had dropped its training and output claims before judgment. In the US, the artists' case Andersen v. Stability AI, in which Runway is also a defendant, has a jury trial set for September 20, 2027. The law on reference images is still moving, so build boards you would be comfortable defending."
      },
      {
        "h": "What contest rules ask for",
        "body": "Contest rules put the burden on you, and several go further than the law. The Runway AI Festival makes entrants \"solely responsible for obtaining\" all \"required rights, releases, consents, permissions, clearances, licenses\" and asks for \"a short, written description of the AI techniques used.\" Curious Refuge's 2026 horror rules say \"Your idea must be original and not connected to existing 3rd party Intellectual Property.\" Higgsfield disqualifies \"characters, franchises, brands, logos, music, or other third-party IP used without authorization,\" and after its deadline it makes each project's \"prompts, generation history, and all assets kept inside the project\" public, so your references may be seen. Reply's rules require teams to buy licenses for images and music and to submit a PDF describing their use of generative AI. [Golden Dunes Dubai](/contests/golden-dunes-dubai-2026) says \"The submitter must hold full rights to the film, including music, visuals and any AI-generated content.\"\n\nThe tools ask the same of you. Midjourney's terms require that \"you have all necessary rights and permissions to provide the Content\" you upload, and uploading grants Midjourney a license to reproduce it and prepare derivative works of it, a license you cannot give for someone else's photograph. Runway's terms say you must have \"all rights, licenses, and permissions needed to provide Your Content,\" and Google's generative AI policy bars content that \"Violates the rights of others, including privacy and intellectual property rights.\" Saving an image to a Pinterest board gives you no rights in it."
      },
      {
        "h": "Turn the board into words",
        "body": "Look at the board and write one line for each thing it tells you. Most boards say five things.\n\n- Light: Where it comes from, how hard it is, what time of day it feels like.\n- Palette: Four to six colors as names plus hex codes, sampled with an eyedropper from the board.\n- Texture: Grain, softness, halation, the surface of things.\n- Energy: Still or restless, the pace of the edit, how close the camera sits.\n- Era and world: The decade, the places, the wardrobe logic.\n\nThen write the ban list, the specific things from the board that must not appear: a recognizable subject, a person's face, a location that belongs to one photograph, a logo, lettering, a signature composition. Those lines go into every prompt, and the board itself stays out of the model."
      },
      {
        "h": "A board, translated",
        "body": "Here is the translation for a hypothetical board of eight images for a spec spot about a made-up coffee brand. The images stay on the wall, and this goes into the prompts.\n\n```\nLight: Low winter sun from frame left, hard, long shadows across the tables, warm practical lamps inside.\nPalette: Espresso #2B1B14, oat #E8DCC8, brass #B08D57, slate blue #4A5A6A, cream #F6F1E7.\nTexture: Fine 35mm grain, soft highlights with a little halation, no digital sharpening.\nEnergy: Unhurried. Locked-off frames or a slow dolly, people moving, camera still.\nEra and world: Present day, a small city cafe, worn wood, brushed steel, wool coats.\nNever: The corner cafe from image 3, the barista's face from image 5, any shop signage or lettering, the overhead cup composition from image 7.\n```\n\nThe ban list names specific images from the board, because those are the pictures a model would reproduce if you fed them in. Everything above it describes the light and the world, which belong to no single photograph."
      },
      {
        "h": "Use style references with a light touch",
        "body": "Style reference features exist for this job, and they still need a light hand. Midjourney says its Style Reference \"doesn't copy objects or people, just the overall style,\" and you can turn it down with a style weight below the default of 100. A style reference built from your own frames, your own photographs or licensed images keeps the feeling and leaves the content. The kind of reference to avoid is someone else's photograph used as an image prompt or as the first frame of an image-to-video shot, because a video model treats that picture as the start of the shot."
      },
      {
        "h": "Build the board from sources you can defend",
        "body": "The safest board is one you can show a festival or a client without flinching. Use your own photographs and frames, stills from your own earlier work, public-domain images, and stock you have licensed for reference use. Keep a simple log with each image's source and license, and note which ones went into a model as references and which stayed on the wall. Some festivals ask how a film was made, and the [We Are Human Festival](/guide/how-to-submit-to-we-are-human-festival-2026) requires an Ethics Notebook with every entry; a reference log answers those questions in a minute."
      },
      {
        "h": "How Overs reads a mood board",
        "body": "Overs treats a mood board the way this page recommends. You add up to twelve images and a note, and it reads the feeling of the board, the light, the mood and the energy, then applies that to your product in your brand's style instead of copying what is in the pictures. A dial decides whether the brand's own look or the board leads. Turn it toward the brand for a client who guards their look, and toward the board for a one-off campaign with its own world.\n\nOvers also studies the brand from its website, its photos and an optional guidelines PDF, writes the visual DNA with hex colors, light, lens and grain, and applies brand rules last. You see the shot plan and an estimated cost before anything renders, and you approve, change or reject every photo.\n\nThe process comes from 100 Creatives, the agency Abhi Chawla founded, which used it to make hundreds of photos a week for hundreds of brands. Across four of its 2026 campaigns, 361 renders gave 45 keepers, about 8 tries per usable photo, which is $0.27 to $1.69 in AI fees per keeper at published prices of $0.034 to $0.211 a render. Abhi's own businesses make their images with Overs today. It makes stills, and you animate them in your video tool, starting from the motion prompt Overs writes for each photo for Seedance or Veo. [Overs' guide to using a mood board with AI without copying it](https://www.overs.studio/guides/how-to-use-a-mood-board-with-ai) has a template for turning a board into words.\n\nOvers is a sister product to AI Film Contests, from the same founder. The free plan covers 40 photos a month on your own OpenRouter key, with no markup from Overs. [Try Overs free at www.overs.studio](https://www.overs.studio) and give it the board for your next spot."
      }
    ],
    "faqs": [
      {
        "q": "Can I use someone else's image in my AI mood board?",
        "a": "For inspiration on your wall, a board of other people's images is common. Feeding those images into a model is different, because the output can reproduce protected parts of a photograph, and many contests require you to hold the rights to everything in your film. Translate the board into words, use only your own or licensed images as model references, and keep a log of sources."
      },
      {
        "q": "Is a visual style protected by copyright?",
        "a": "Not on its own in the US. The Copyright Act excludes ideas from protection, and the US Copyright Office wrote in 2024 that copyright does not protect artistic style as a separate element of a work. The risk comes when an output copies protectible elements of a particular work, such as a specific photograph's composition and subject. Use a board for mood, light and palette, and keep particular images out of the model."
      },
      {
        "q": "How do I describe a mood board in a prompt?",
        "a": "Write one line each for light, palette, texture, energy and era, using concrete words: the direction and hardness of the light, colors as names plus hex codes, how much grain, how close the camera sits. Add a ban list of specific things from the board not to reproduce. Paste those lines unchanged into every prompt so every shot carries the same feeling."
      },
      {
        "q": "Does Overs copy my mood board?",
        "a": "No. Overs reads the feeling of a board of up to twelve images, the light, mood and energy, and applies it to your product in your brand's style instead of copying what is in the pictures. A dial decides whether the brand's own look or the board leads. It makes still images and does not make video."
      }
    ],
    "related": [
      {
        "href": "/contests/golden-dunes-dubai-2026",
        "label": "Golden Dunes Dubai: entrants must hold full rights to every element, closes October 15, 2026"
      },
      {
        "href": "/contests/curious-refuge-ai-horror-film-competition-2026",
        "label": "Curious Refuge AI Horror Film Competition: AI in every shot, closes October 9, 2026"
      },
      {
        "href": "/contests/chroma-awards-season-2-2026",
        "label": "Chroma Awards Season 2: free entry, closes December 31, 2026"
      },
      {
        "href": "/guide/ai-film-submission-tips",
        "label": "AI film submission tips"
      }
    ]
  },

  "ai-commercial-storyboard-and-shot-list": {
    "title": "Storyboards and Shot Lists for an AI Commercial",
    "description": "How to board and plan a 15 or 30-second AI commercial: shot counts, clip limits per tool, a copyable shot list, and a render budget before any video.",
    "keywords": "AI commercial storyboard, AI ad shot list, storyboard for AI video ad, 30 second commercial shot list, how many shots in a 30 second ad, animatic AI commercial, AI spec ad planning, AI video clip length limits",
    "datePublished": "2026-09-24",
    "intro": "Plan an AI commercial as a numbered shot list with a still for every shot. Fix the length first, choose a pace such as one cut every 2.5 seconds, and write down for each shot the duration, the framing, the action, the camera move, the references it needs and the tool that will make it. Board the spot with the real first frames, time them into an animatic, and render video only for shots whose stills are approved.\n\nThis guide covers the lengths contests and platforms allow, how many shots fit, how to board with real first frames, a copyable shot-list block, a worked 30-second example with a render budget, and the deliverables to plan from day one.",
    "sections": [
      {
        "h": "Start from the length you are allowed",
        "body": "Contest ad categories set hard limits, and they differ. [Runway's Big Ad Contest](https://runway.com/big-ad-contest/terms) took spots \"between 15 seconds and 30 seconds in length.\" [Atlanta AI Ad Fest](/contests/atlanta-ai-ad-fest-2026) asks for a primary film of 30 to 60 seconds, and the [Formula E Creators Challenge](/contests/formula-e-creators-challenge-2026) allows up to 60. The [AI Film Awards Bali](/contests/ai-film-awards-bali-2026) splits ads into social pieces under a minute, ads of one to three minutes and commercials under five, and [Golden Dunes Dubai](/contests/golden-dunes-dubai-2026) takes commercials under five minutes.\n\nPlatforms set the rest. [YouTube's bumper ads](https://support.google.com/google-ads/answer/2375464) last \"between 5 and 6 seconds,\" viewers can skip in-stream ads \"After 5 seconds,\" and non-skippable in-stream ads run 15 to 60 seconds depending on the campaign. In the UK, [Thinkbox](https://www.thinkbox.tv/how-to-use-tv/spots/tv-advertising-time-lengths) says \"The standard length of a TV ad is 30 seconds long and approximately half of all ads are 30 seconds.\" TikTok advises you to \"Prioritize your hook in the first 6 seconds.\" Pick the length first, because every other number on the shot list follows from it."
      },
      {
        "h": "How many shots fit",
        "body": "Divide the length by the pace you want. At one cut every 2.5 seconds, a 30-second spot is 12 shots and a 15-second cut is 6. At one every 2 seconds, it is 15 and 7 or 8. There is no fixed rule, so time a few commercials you admire with a stopwatch and choose a pace on purpose.\n\nThen check each shot against what the tools make in one generation. As of September 24, 2026, Runway Gen-4.5 makes clips of 2 to 10 seconds, Kling 3.0 3 to 15 seconds, Google's Veo 3.1 4, 6 or 8 seconds (8 only when you use reference images), Seedance 2.0 4 to 15 seconds and Seedance 2.5 up to 30. OpenAI removed Sora 2 from its API on September 24, 2026. Most commercial shots are shorter than one generation, which helps. Render a clip a little longer than the shot and trim the start and end in the edit."
      },
      {
        "h": "Board with the real first frames",
        "body": "In live action, a storyboard is a drawing of a shot someone will film later. In AI production the board can be the shot. Make each panel as the actual first frame, from your look bible and character sheet, at the delivery aspect ratio, so the approved board goes straight into image-to-video. A loose sketch hides the problems you most need to see early, such as a label the model cannot hold or a face that drifts in a wide.\n\nThen time the boards into an animatic, with each still held for its planned duration and cut to a scratch voiceover and temp music. Merriam-Webster defines an animatic as a preliminary sequence of shots, images or sketches \"viewed to determine its effectiveness before being finalized.\" Watch it at full length before you render a single clip. A spot that feels long as an animatic will feel long as video, and a shot you cut at this stage costs nothing."
      },
      {
        "h": "One block per shot",
        "body": "Write the shot list as one block per shot, in the order the spot plays. Every field answers a question someone will ask during production.\n\n```\nSHOT 03 | 0:05.0 to 0:07.5 | 2.5 s\nSize and angle: Close-up, eye level\nAction: A hand lifts the can off the counter\nCamera: Locked off, slight push in\nProduct: Label to camera, cold, beads of condensation\nLight: Key from the window, left, per look bible v2\nReferences: Character sheet v2, product front, look frame 01\nFirst frame: Still, approved yes/no\nMotion prompt: One line, motion only\nTool and clip: Image-to-video, 5 s clip, cut to 2.5 s\nBudget: 8 stills, 3 video tries\n```\n\nThe last two lines matter most in AI work. The tool line tells you whether the shot fits one generation, and the budget line tells you, before you start, what the shot will cost. Keep every block in one shared document and update the first-frame and budget lines as shots are approved, so anyone on the job can see what is done and what is left."
      },
      {
        "h": "A worked example: 30 seconds, 12 shots",
        "body": "Here is a hypothetical 30-second spot for a made-up canned sparkling tea, the kind of fictional product Runway's contest asked for, planned at 2.5 seconds a shot.\n\n- Shot 1, 0:00 to 0:02.5. Wide, a kitchen at dawn, light across the counter, the can at frame left.\n- Shot 2, 0:02.5 to 0:05. Close-up, condensation forms on the can.\n- Shot 3, 0:05 to 0:07.5. Close-up, a hand lifts the can off the counter.\n- Shot 4, 0:07.5 to 0:10. Insert, the tab opens with a burst of mist.\n- Shot 5, 0:10 to 0:12.5. Medium, she drinks, eyes closed.\n- Shot 6, 0:12.5 to 0:15. Wide, she steps out onto a balcony.\n- Shot 7, 0:15 to 0:17.5. Close-up, the city wakes and windows light up.\n- Shot 8, 0:17.5 to 0:20. Medium, a friend waves from the street.\n- Shot 9, 0:20 to 0:22.5. Insert, a second can handed down.\n- Shot 10, 0:22.5 to 0:25. Two-shot, both laugh.\n- Shot 11, 0:25 to 0:27.5. Packshot, the can on the balcony rail, a clean plate.\n- Shot 12, 0:27.5 to 0:30. End card, logo and line set in the edit.\n\nThe budget follows from the list. Eleven generated shots need eleven approved first frames, and at the 8 tries per usable image that the agency 100 Creatives averaged across its 2026 campaigns, that is 88 stills, about $5.90 on Google's Nano Banana 2 at $0.067 each. Three video tries per shot at about five seconds each is 33 clips and 165 seconds of video, about $19.80 on Veo 3.1 Fast at 1080p ($0.12 a second) or $66 on Veo 3.1 with audio ($0.40 a second). The end card is a still in the edit and costs nothing to generate.\n\nThe model fees are small. The list earns its keep by showing which shots are hard before you start, here the hand on the can, the burst of mist and two faces in one frame."
      },
      {
        "h": "Plan the deliverables on day one",
        "body": "Decide every size before you frame shot 1. A 16:9 master with the action in the center third crops cleanly to 9:16 and to 4:5 or 1:1, and a frame composed to its edges does not. Instagram Reels ads are 9:16, the Facebook feed takes 4:5 and TikTok recommends 9:16, and Meta asks you to keep the top 14%, the bottom 35% and 6% on each side of a Reels ad clear of text and logos. Plan a 6-second cut too, since YouTube bumpers run 5 to 6 seconds. If the brand also wants stills, add them to the list now, since they can come from the same approved frames. Our guides to [the packshot and end card](/guide/ai-commercial-packshot-and-end-card) and to [pricing AI commercial work](/guide/how-to-price-ai-commercial-work) cover the last seconds and quoting every size."
      },
      {
        "h": "Plan the stills in Overs, then animate them",
        "body": "Overs does the planning this page describes, for stills. Its ten steps run in order like a real shoot: research, brand rules, visual style, art direction, product analysis, casting, shot planning, prompt writing, a quality check and the render. You say what the set is for (store page, feed ads, editorial, hero, banner, billboard) and choose 5, 8, 10 or 12 photos, and the plan covers each use, with every photo getting only the reference pictures it needs.\n\nNothing is charged until you approve. You see the shot plan and an estimated cost first, and for worn products you approve the character sheet before any scene. Then you approve, change or reject each photo, and Overs writes a text motion prompt per photo for Seedance or Veo, which turns an approved still set into the first frames of your spot. Overs does not make the video itself.\n\n100 Creatives, the agency Abhi Chawla founded, built its 2026 campaigns on canvases with three zones, inputs, a locked set of AI roles with fixed instructions and a fan-out of about ten shots, and Overs grew out of that process. Across four of those campaigns, 361 renders gave 45 keepers, about 8 tries per usable photo, which is $0.27 to $1.69 in AI fees per keeper at published prices of $0.034 to $0.211 a render. Abhi's own businesses make their images with Overs today. [Overs' shot list template for an AI campaign](https://www.overs.studio/guides/ai-campaign-shot-list-template) has a filled ten-shot set sized for each placement.\n\nOvers is a sister product to AI Film Contests, from the same founder. The free plan covers 40 photos a month on your own OpenRouter key, with no markup from Overs. [Try Overs free at www.overs.studio](https://www.overs.studio) and see the plan and the cost before a single frame renders."
      }
    ],
    "faqs": [
      {
        "q": "How many shots are in a 30-second AI commercial?",
        "a": "It depends on the pace you choose. At one cut every 2.5 seconds a 30-second spot has 12 shots, and at one every 2 seconds it has 15. Check each shot against what your tool makes in one generation, such as 2 to 10 seconds on Runway Gen-4.5 or 4, 6 or 8 seconds on Veo 3.1, and render slightly longer than the shot so you can trim."
      },
      {
        "q": "What is the difference between a storyboard and a shot list?",
        "a": "A storyboard shows each shot as a picture, in order, so everyone can see the spot before it exists. A shot list describes each shot in words and numbers: duration, framing, action, camera move, references, tool and budget. For an AI commercial you need both, and the best boards are the real first frames you will animate, so the two documents describe the same shots."
      },
      {
        "q": "What is an animatic, and do I need one for an AI commercial?",
        "a": "An animatic is the storyboard timed out as video, each frame held for its planned length over a scratch voiceover and music. Merriam-Webster defines it as a preliminary sequence viewed to determine its effectiveness before being finalized. For an AI spot it is the cheapest test you have. If it drags as an animatic it will drag as video, and cutting a shot at this stage costs nothing."
      },
      {
        "q": "How long can one AI video clip be?",
        "a": "As of September 24, 2026, Runway Gen-4.5 makes clips of 2 to 10 seconds, Kling 3.0 3 to 15 seconds, Google Veo 3.1 4, 6 or 8 seconds, Seedance 2.0 4 to 15 seconds and Seedance 2.5 up to 30 seconds. OpenAI removed Sora 2 from its API on September 24, 2026. Most commercial shots are shorter than one generation, so render a little long and trim."
      },
      {
        "q": "Can my storyboard frames become the first frames of the video?",
        "a": "Yes, and in AI production they should. Make each board panel as a finished still at the delivery aspect ratio, from your look bible and character sheet, and approve it. The approved panel then goes into image-to-video as the first frame. Check your contest's rules if the stills come from a different tool than the video."
      }
    ],
    "related": [
      {
        "href": "/contests/formula-e-creators-challenge-2026",
        "label": "Formula E Creators Challenge: up to 60 seconds, free, closes September 30, 2026"
      },
      {
        "href": "/contests/atlanta-ai-ad-fest-2026",
        "label": "Atlanta AI Ad Fest: $2,500 in cash prizes, closes October 25, 2026"
      },
      {
        "href": "/contests/ai-film-awards-bali-2026",
        "label": "AI Film Awards Bali: Ads and Commercials category, closes October 20, 2026"
      },
      {
        "href": "/topics/ai-commercial-and-advertising-contests-2026",
        "label": "Every AI advertising contest open in 2026"
      }
    ]
  },

  "consistent-characters-in-ai-film": {
    "title": "How to Keep a Character Consistent Across AI Film Shots",
    "description": "Faces drift between AI video shots because every clip redraws the person. Cast in stills, approve a character sheet, and start every shot from it.",
    "keywords": "consistent character AI video, AI character consistency, character sheet AI film, same character every shot AI, Kling Elements, Veo 3.1 ingredients to video, Runway References, Seedance 2.0 reference images, AI film continuity, character drift AI video",
    "datePublished": "2026-09-24",
    "intro": "A character stays the same across AI film shots when you cast them once, in stills, and start every shot from that casting. Build a character sheet, approve it, send it as the first reference in every generation, and repeat one description of the person word for word. When a face drifts, check those three things first.\n\nDrift costs more in a film than in a single image. Cut at one shot every four seconds, a three-minute short holds 45 shots, and each one is a fresh chance for your lead to come back as their sibling. Viewers read that as a continuity error, the same way they would in live action. In brand work it is worse, because the person in the spot has to match the person in the campaign stills. This guide covers the film side, including what each video tool offers for a recurring character as of September 2026, how to plan shots around a character sheet, what contests say about real faces, and how many tries to budget.",
    "sections": [
      {
        "h": "Why faces drift between shots",
        "body": "Every generation draws the person again. Nothing carries over from the last clip unless you send it: a reference image, a saved character or element, or a frame to start from. A text description leaves room, and the model fills that room differently each time. The jaw comes back a little wider, the eyes a little closer, the parting on the other side.\n\nVideo adds three problems that stills do not have. A clip shows the face from angles your references may not cover, so a head turn forces the model to invent the side it never saw. Wide shots leave only a few pixels of face to match. And light changes across a scene alter how skin tone and features read, even when the shape of the face holds. A character who looks right in a lit close-up can drift in the next wide shot at dusk."
      },
      {
        "h": "What each video tool gives you for a recurring character",
        "body": "Every major video tool now has a way to carry a character between generations, and they differ in what they take. As of September 24, 2026:\n\n- [Kling builds an Element](https://kling.ai/quickstart/klingai-element-library-3-user-guide) from two to four images, or from one 3 to 8 second video, of a single character. Kling VIDEO 3.0 can bind up to three extra elements alongside start and end frames.\n- Google Veo 3.1 has Ingredients to video, which takes \"up to three asset images of a single person, character, or product\" and makes 8-second clips. It works in the Gemini API and Vertex AI, and in Flow on the Fast and Lite models but not on Quality.\n- ByteDance's Seedance 2.0 accepts up to nine images, three videos and three audio files as references, and its successor Seedance 2.5 takes up to 30 images for reference-to-video.\n- Runway's References feature, in its image tool, takes up to three reference images per generation. Its Gen-4.5 video model works from text or a first frame, so the character reaches the clip through the still you animate.\n- Midjourney V8.2 takes up to four reference images, replacing its older Omni Reference and Character Reference.\n- Higgsfield's Soul ID asks for at least 20 photos of one person.\n- OpenAI removed Sora 2 and its Videos API from the API on September 24, 2026, with no replacement named.\n\nThe vendors disagree about what a good reference looks like, and that changes how you use a character sheet. Kling recommends \"a front-facing image for higher consistency.\" [Luma's reference guide](https://lumalabs.ai/learning-hub/keep-character-product-consistency-in-luma-reference-guide) says to \"Show only one angle per image\" and \"Do not combine multiple angles into one sheet.\" ByteDance's Seedance 2.0 guide says \"using a headshot + full-body photo is sufficient. Using multi-view character images is not recommended,\" while Seedance 2.5 accepts multi-view images. Google's Flow asks for references \"on a plain or segmented background,\" and Runway's guide asks for \"Natural, even lighting\" and a \"Neutral subject expression.\"\n\nSo keep the character sheet as the master record and cut it into what each tool wants to receive: a clean front-facing headshot, a full-body shot, and single-angle crops, each on a plain background."
      },
      {
        "h": "Cast in stills with a character sheet",
        "body": "Before any scene, make one image of the character from several angles: front, three-quarter, side and back at full length, plus close-ups of the face, on a plain background in soft, even light, wearing the exact costume. End the prompt with \"no words on the image\", because sheets tend to come back with labels printed across them. Approve it, save it with a name and a version number, and treat it as the casting decision it is.\n\nMake one sheet per costume. If the character changes jackets in act two, that is a second sheet, built from the first, with the new jacket.\n\nThe agency 100 Creatives counted what this step takes on a 2026 surf apparel job, one model across studio, cliff and ocean scenes. The character sheet took 20 attempts. The first attempt had the longest prompt and four reference images; later attempts went up to eight references. The kept sheet, attempt 20, used five references and a four-line prompt. Fewer, better-chosen references and a short prompt beat the long versions."
      },
      {
        "h": "Start every shot from the sheet",
        "body": "The sheet only works if every shot draws on it. Image-to-video gives you the most control. Make each shot's first frame as a still from the sheet, check the face at full size, then animate that frame with a prompt that describes motion only. A 1K still on Google's Nano Banana 2 costs $0.067; an 8-second Veo 3.1 clip at 1080p costs $3.20 at Google's published $0.40 a second. A face you reject at the still stage never reaches the edit. [Our guide to clean first frames](/guide/first-frame-for-image-to-video) covers the frame itself.\n\nThen lock whatever is not changing. Give the character a name and one description sentence covering age, build, skin tone, hair and face shape, and paste that sentence into every prompt unchanged. Change only what the shot needs: framing, pose, action. When a scene continues across clips, go back to the sheet for the next shot's first frame instead of extending from the last frame of the previous clip, because small changes add up when each clip starts from the one before.\n\nPlan coverage around what the model can hold. Close-ups and medium shots give it more face to match than wides do. A turn that shows the back of the head needs a back view on the sheet. Cutting on action is safer than asking one clip to carry a full turn."
      },
      {
        "h": "Real faces, likeness and contest rules",
        "body": "If your lead is a real person, the rules come from three directions. Several tools restrict real faces. Google's Veo guidelines say it \"Rejects requests to generate a photorealistic representation of a prominent person,\" and ByteDance's Seedance documentation says the models \"do not support direct uploads of reference images or videos containing real human faces,\" offering preset digital characters and authorized portrait assets instead.\n\nThe contests ask for consent. The [Formula E Creators Challenge](/contests/formula-e-creators-challenge-2026) requires written consent for \"the name, image, voice or likeness (including any AI-generated likeness) of a real person.\" [Curious Refuge's 2026 horror rules](https://curiousrefuge.com/2026-ai-horror-film-contest-rules) say \"You may not use the likeness of existing actors or people without their consent\" and bar the likeness of any famous person currently living. And festivals point you to the law: Runway's AI Festival terms require compliance with \"any applicable digital replicas/deepfakes and data protection laws.\"\n\nThe simple route for a contest film is a fictional character, built from scratch and approved as a sheet. If you cast a real actor, get their written consent for AI use, name the project in it, and keep it with your files."
      },
      {
        "h": "Budget the tries before you spend on video",
        "body": "Holding one person steady across scenes costs tries. Across four 2026 campaigns at 100 Creatives, 361 renders produced 45 usable images, about 8 per keeper. Surf apparel on one model across studio, cliff and ocean scenes took the most, 13.6 renders per keeper (163 for 12), while gummy supplement ads took 3.2 (38 for 12).\n\nUse those numbers to plan. As an example, if your lead appears in 30 shots and you make each first frame as a still, 8 to 14 tries per usable frame means 240 to 420 stills before a single clip renders. Stills cost cents each, and every face you fix at the still stage is a video render you do not pay for twice. Contest deadlines make this sharper. [Curious Refuge's AI Horror Film Competition](/contests/curious-refuge-ai-horror-film-competition-2026), which closes October 9, 2026, caps films at three minutes and requires AI in every shot, so every shot is a chance for drift."
      },
      {
        "h": "Where Overs fits: the character sheet, made and approved first",
        "body": "Overs, an AI tool for product and campaign photos, is built around the step this page keeps coming back to. For any product that is worn or held, it makes the character sheet first: one model, several angles and close-ups, wearing the exact product, on a plain background. You approve the sheet, and every later photo with a person uses that same model. Approved sheets go into a talent library, so the face from one campaign can come back for the next.\n\nEach photo gets only the reference pictures it needs, in order, with the sheet first for any shot with a person, and if a reference the plan calls for does not exist, Overs skips it instead of guessing with the wrong picture. You see the shot plan and an estimated cost before anything renders, and nothing is charged until you say yes.\n\nOvers makes stills, which is the right split for a film. Approve the character in stills, then animate the frames in your video tool, starting from the text motion prompt Overs writes for each photo for a model such as Seedance or Veo. The method comes from 100 Creatives, the agency Abhi Chawla founded, which used it to make hundreds of photos a week for hundreds of brands, and the surf job above is one of its campaigns. At its average of about 8 tries per usable photo, published prices of $0.034 to $0.211 a render come to $0.27 to $1.69 in AI fees per keeper. Abhi's own businesses make their images with Overs today, and he credits it for their growth. [Overs' guide to keeping the same model in every photo](https://www.overs.studio/guides/how-to-keep-the-same-model-in-ai-photos) has the kept sheet prompt and a drift fix table.\n\nOvers is a sister product to AI Film Contests, from the same founder. The free plan gives you 40 photos a month. You connect your own OpenRouter key and pay the model a few cents a photo, and Overs adds no markup. [Try Overs free at www.overs.studio](https://www.overs.studio) and cast your lead before your next deadline."
      }
    ],
    "faqs": [
      {
        "q": "What is a character sheet in AI filmmaking?",
        "a": "A character sheet is one image of one character from several angles, usually front, three-quarter, side and back, with face close-ups, on a plain background and in the exact costume. You approve it before any scene is made, then send it as the first reference in every shot so the model has the same face and clothes to copy each time. Make a new sheet for each costume change."
      },
      {
        "q": "Why does my AI character change in wide shots?",
        "a": "In a wide shot the face covers only a few pixels, so the model has little to match and fills the gap with its own guess. Frame tighter where the face matters, add a face close-up from the sheet as a second reference, and keep the light on skin neutral. If the face still drifts, go back to the sheet and render the shot fresh instead of editing the drifted frame."
      },
      {
        "q": "Which AI video tools support character reference images?",
        "a": "As of September 24, 2026, Kling builds Elements from two to four images or a short video, Google's Veo 3.1 takes up to three images through Ingredients to video and makes 8-second clips, Seedance 2.0 takes up to nine images and Seedance 2.5 up to 30, Midjourney V8.2 takes up to four reference images, and Runway takes up to three References in its image tool before image-to-video. OpenAI removed Sora 2 from its API on September 24, 2026."
      },
      {
        "q": "Can I use a real actor's face in an AI film for a contest?",
        "a": "Only with the person's written consent, and only if the contest allows it. Many AI film contests require you to own or clear every element of the film, and some tools restrict uploads of real people. For a cast member who agreed, keep the signed consent with your project files. For anyone else, create a fictional character and build the sheet from scratch."
      },
      {
        "q": "Does Overs make video?",
        "a": "No. Overs makes still images, including the character sheet and campaign photos with the same model in each. It can write a text motion prompt for each photo for a video model such as Seedance or Veo, and you make the clip in that tool."
      }
    ],
    "related": [
      {
        "href": "/contests/pixlight-2026",
        "label": "PixLight 2026: $300,000 pool for genre pilots and scripts, closes October 9, 2026"
      },
      {
        "href": "/contests/curious-refuge-ai-horror-film-competition-2026",
        "label": "Curious Refuge AI Horror Film Competition: $12,000, AI in every shot, closes October 9, 2026"
      },
      {
        "href": "/contests/chroma-awards-season-2-2026",
        "label": "Chroma Awards Season 2: over $175,000 in cash prizes, closes December 31, 2026"
      },
      {
        "href": "/categories/short-film",
        "label": "Every open AI short film contest"
      }
    ]
  },

  "product-accuracy-in-ai-commercials": {
    "title": "How to Keep the Product Accurate in an AI Commercial",
    "description": "AI video redraws the product in every frame, so labels drift and logos melt. The reference set, the stills-first workflow and the checks that keep a spot accurate.",
    "keywords": "product accuracy AI commercial, AI video product consistency, AI ad label distortion, keep product same AI video, AI spec ad product, product reference images AI video, AI commercial logo warping, brand accuracy AI ad contest",
    "datePublished": "2026-09-24",
    "intro": "A product stays accurate in an AI commercial when you treat it as the one thing the model may not invent. Photograph the real product from every side, write its spec down in words, approve every product shot as a still before it moves, choose camera moves that keep the label facing the lens, and put the real logo and label back in the edit where the model cannot hold them. Then check every frame against the real thing.\n\nThis guide covers why products change in AI video, what contest juries and advertising law expect, how to build a reference set and a written spec, the stills-first workflow, fixing labels in the edit, and a final frame-by-frame check.",
    "sections": [
      {
        "h": "Why products change in AI video",
        "body": "A video model keeps no copy of your product. It generates every frame from what the first frame, the references and the prompt suggest, so anything the model is unsure about can change: the curve of a bottle, the color of a cap, the number of gummies in a hand. Small text suffers first. Letters on a label become shapes that look like letters, and a logo can soften or morph as the camera moves.\n\nThree things make it worse. A turn that shows a side of the pack the model never saw forces it to invent that side. Reflective and transparent surfaces, glass, foil and liquids, change with every move of the light. And hands that hold the product press into it, cover the label and drag it out of shape."
      },
      {
        "h": "Why it matters to juries and clients",
        "body": "In a contest, the product is part of the score. [Atlanta AI Ad Fest](/contests/atlanta-ai-ad-fest-2026) weights entries 40% idea, 30% craft, 20% brand and 10% impact, asks of the brand score \"Does it make the brand matter?\", and warns that \"Technical novelty alone does not win.\" The [Formula E Creators Challenge](/contests/formula-e-creators-challenge-2026) requires elements of its GEN4 Asset Kit on screen for at least 4 seconds, so the car in your film has to match the car in the kit. Golden Dunes' 2025 listing judged its Best AI-Commercial category on \"creativity, visual execution, brand alignment, and innovative use of AI technology.\"\n\nFor paid work, accuracy is a legal matter. In [FTC v. Colgate-Palmolive](https://www.govinfo.gov/content/pkg/USREPORTS-380/pdf/USREPORTS-380-374.pdf) (1965), the US Supreme Court held that \"It is a material deceptive practice to convey to television viewers the false impression that they are seeing an actual test, experiment or demonstration\" when they are not. In 1970 the FTC acted against Campbell Soup and its agency over ads with \"clear glass marbles which prevent the solid ingredients (garnish) from sinking to the bottom\" of the bowl. In March 2026 the UK's Advertising Standards Authority [upheld 22 complaints](https://www.asa.org.uk/rulings/uab-commercecore-g25-1321974-uab-commercecore.html) about ads for a robot dog toy whose footage of \"real and/or AI-generated puppies\" gave \"the impression that the product was highly realistic.\" And in the EU, the AI Act's transparency duty for deepfakes, whose definition covers content that resembles existing \"objects\" as well as people, has applied since August 2, 2026.\n\nAn AI label does not rescue an inaccurate product. The UK's Committee of Advertising Practice [wrote in May 2025](https://www.asa.org.uk/news/disclosure-of-ai-in-advertising-striking-the-balance-between-creativity-and-responsibility.html) that \"disclosure alone is very unlikely to mitigate the harm caused by a fundamentally misleading message.\" Stylize the world around the product as much as you like, and show the product as it is."
      },
      {
        "h": "Build the reference set before any prompt",
        "body": "Photograph the real product yourself, even for a spec spot. Shoot the front, the back, both sides, a three-quarter view, the top, a straight-on close-up of the label and one shot in a hand for scale, in soft, even light on a plain background, with the phone at 2x zoom so wide-angle distortion does not stretch the pack.\n\nThen write the spec as words the model can follow and you can check against: the exact label text, letter for letter; the colors as names plus hex codes; the materials and finishes; the proportions (\"the can is about twice as tall as it is wide\"); and a short list of what must never change. Paste the product sentence into every prompt unchanged, the same way you would a character description.\n\nThe video tools can carry that reference set into the shot. Runway's product ad recipe takes \"One to ten reference images of the product\" and treats the first as the primary reference. Google's Veo 3.1 takes \"up to three images of a single person, character, or product.\" Kling 3.0 Omni takes up to seven images or elements when no video is attached, and ByteDance's Seedance 2.0 and 2.5 take up to 9 and 30 reference images. Higgsfield says its product video generator holds \"the exact shape, label, and color frame to frame\" from one to three references. Treat all of these as vendor claims and check the output yourself."
      },
      {
        "h": "Approve the product as a still, then move it gently",
        "body": "Make each product shot's [first frame](/guide/first-frame-for-image-to-video) as a still and check it at full size against the real pack before it becomes video. A wrong label caught on a still costs a re-render measured in cents. The same mistake caught in a finished clip costs the clip, and on a deadline it can end up in the film.\n\nChoose moves that keep the label facing camera. Push-ins, slow slides and light sweeps across a static product hold up better than spins, because a spin shows sides the model has to invent. Keep product clips short, and let hands touch the product at the edges, not across the label. The agency 100 Creatives saw the spread in its own 2026 numbers. Gummy supplement ads took 3.2 renders per usable image, while surf apparel worn by one model across studio, cliff and ocean scenes took 13.6."
      },
      {
        "h": "One product shot, start to finish",
        "body": "Here is one shot worked through for a hypothetical supplement jar in a 30-second spot, a four-second push in on the jar standing on a bathroom shelf.\n\n- References: The front of the jar, a straight-on crop of the label and one three-quarter view, sent in that order.\n- Product sentence: The exact label text, the lid color as a name and hex code, the jar's proportions, and \"the label never changes.\"\n- First frame: A 16:9 still with the label facing camera and large enough to read, approved at full size against the real jar.\n- Motion prompt: A slow push in, the jar stays still, the label stays facing camera and unchanged, steam from a mug drifts behind it.\n- Tries: Three video renders, the best one trimmed to four seconds.\n- Fix: If the label softens in the last second, cut earlier or track the real label artwork over it.\n\nThat is six decisions for four seconds of film, and each one costs less to get right at the still stage than in the edit."
      },
      {
        "h": "Put the real label back in the edit",
        "body": "When the model cannot hold the label, stop asking it to. Track the label or logo from the brand's real artwork onto the product in the edit, or cut to a real photograph for the moment the label must read. Match the colors to the hex values with an eyedropper during the grade, since a model reads a hex code only as a rough hint.\n\nCheck the contest rules before you composite. Some contests require AI in every shot, and some require all video to come from one tool, so a tracked label may need a line in your submission notes."
      },
      {
        "h": "The final check, frame by frame",
        "body": "- Read every visible word on the pack, letter by letter, at 100%.\n- Compare logo shape and position with the brand's own artwork.\n- Check the cap, lid, seal and any small parts against the photos.\n- Check colors against the hex values with an eyedropper.\n- Count what should be counted: pieces, cans in a pack, gummies in a hand.\n- Check proportions in wide shots, where products tend to stretch.\n- Check the hands: fingers, grip, and whether they cover or deform the label."
      },
      {
        "h": "Where Overs fits: product-exact stills before any motion",
        "body": "Overs is built for the half of this problem that happens before motion. Its ten steps include a product analysis before any shot is planned, and each shot gets reference slots. The plan names which reference pictures a photo needs, in order, and sends only those. If the plan calls for a view you never supplied, such as the back of the pack, Overs skips that reference instead of guessing with the wrong picture.\n\nReview is where accuracy gets enforced. On Pro and Team plans, a reviewer checks each photo against the references before you see it and can retry on its own up to a limit you set. You approve, ask for changes or reject with a reason, and those decisions become brand memory for the next set. When exactness matters most, pick GPT Image 2.5 Sunburst, the slowest model Overs offers and the most exact at keeping a product identical while the scene changes.\n\nOvers was built on the process 100 Creatives, the agency Abhi Chawla founded, used to make hundreds of photos a week for hundreds of brands. Across four of its 2026 campaigns, 361 renders gave 45 keepers, about 8 tries per usable photo, and the gummy supplement ads needed only 3.2. Abhi's own businesses make their images with Overs today. It makes stills and writes a motion prompt per photo for Seedance or Veo, so approved product frames go straight into your video tool. [Overs' guide to why AI changes your product](https://www.overs.studio/guides/why-ai-changes-your-product) lists seven fixes in order.\n\nOvers is a sister product to AI Film Contests, from the same founder. You see the shot plan and the estimated cost before anything renders, and the free plan covers 40 photos a month on your own OpenRouter key, with no markup. [Try Overs free at www.overs.studio](https://www.overs.studio) with the product from your next spec spot."
      }
    ],
    "faqs": [
      {
        "q": "Why does my product change in AI video?",
        "a": "The model generates the product in every frame from the first frame, the references and the prompt, so any detail it is unsure about can drift. Label text, small logos, reflective surfaces and sides the model never saw change most. Approve each product shot as a still, keep the label facing camera, use short clips and gentle moves, and composite the real label in the edit when needed."
      },
      {
        "q": "How many reference photos of the product do I need?",
        "a": "Enough to show every side the camera will see: front, back, both sides, three-quarter, top and a straight-on label close-up, plus one in a hand for scale. Send each shot only the references it needs, in a clear order, because extra pictures give the model more to mix up. Shoot them yourself in soft, even light rather than reusing compressed web images."
      },
      {
        "q": "Can an AI commercial make the product look better than it is?",
        "a": "Not in paid advertising. The FTC treats an ad as deceptive if it is likely to mislead a reasonable consumer, and the Supreme Court's 1965 Colgate-Palmolive decision applied that to mock-ups shown as real demonstrations. In the UK, the ASA upheld complaints in 2026 about AI-assisted footage that exaggerated a toy, and the CAP says disclosing AI use is very unlikely to fix a misleading message. Stylize the scene, and keep the product true."
      },
      {
        "q": "Can I fix a warped label after generation?",
        "a": "Yes. Track the real label or logo artwork onto the product in the edit, or cut to a real photograph for the moment the label must read. Check first that your contest allows compositing, since some require AI in every shot or all video from one tool, and mention the composite in your submission notes if the rules ask how the film was made."
      }
    ],
    "related": [
      {
        "href": "/contests/formula-e-creators-challenge-2026",
        "label": "Formula E Creators Challenge: brand asset kit on screen for 4 seconds, closes September 30, 2026"
      },
      {
        "href": "/contests/atlanta-ai-ad-fest-2026",
        "label": "Atlanta AI Ad Fest: judged 20% on brand, closes October 25, 2026"
      },
      {
        "href": "/contests/korea-ai-cinema-festival-2026",
        "label": "Korea AI Cinema Festival: Best AI Commercial Film, closes October 31, 2026"
      },
      {
        "href": "/topics/ai-commercial-and-advertising-contests-2026",
        "label": "Every AI advertising contest open in 2026"
      }
    ]
  },

  "first-frame-for-image-to-video": {
    "title": "How to Make a Clean First Frame for Image-to-Video",
    "description": "The first frame decides the shot in Seedance, Veo, Kling and Runway. Input rules per tool, a ten-point frame check, and how to write the motion prompt.",
    "keywords": "first frame image to video, image to video best practices, start frame AI video, Seedance first frame, Veo 3.1 first and last frame, Kling start end frame, Runway image to video prompt, motion prompt image to video",
    "datePublished": "2026-09-24",
    "intro": "In image-to-video, the still you upload becomes the start of the shot, so every choice in it carries into every frame: the face, the product, the light, the palette and the composition. A clean first frame matches the output's aspect ratio and resolution, has no text or logos baked in, is sharp, leaves room for the motion, and already matches the film's look. Then the text prompt only has to describe what moves.\n\nThis guide collects each major tool's rules for input images as of September 24, 2026, a ten-point check for the frame itself, what the vendors say to put in the motion prompt, and when a last frame helps.",
    "sections": [
      {
        "h": "What the first frame decides",
        "body": "A video model reads the image as the answer to most of your questions. It keeps the composition, the light, the colors, the wardrobe and the product, and it invents the motion and anything the camera reveals. Every flaw in the still, a sixth finger, a warped label, a face that is slightly off, becomes a moving flaw in every frame after it. Fixing a still costs cents. Fixing a clip means paying for the clip again.\n\nThat is why image-to-video gives you so much control over an AI film or commercial. You approve the shot as a still, where problems are cheap to see and fix, and spend on video only for frames you already like."
      },
      {
        "h": "What each tool accepts as a first frame",
        "body": "The rules differ more than you would expect, so check them before you size the frame. As of September 24, 2026:\n\n- Runway Gen-4.5 accepts JPEG, PNG and WebP but not GIF, in aspect ratios from 1:2 to 2:1, and crops anything else from the center. \"Your input image acts as the first frame.\" Clips run 2 to 10 seconds.\n- Kling 3.0 takes JPG or PNG up to 50 MB, at least 300 pixels on a side, from 1:2.5 to 2.5:1, for clips of 3 to 15 seconds up to 4K. It supports start and end frames, but not an end frame on its own.\n- Google Veo 3.1 takes JPEG or PNG up to 20 MB and \"uses the input image as the initial frame,\" with an optional last frame. Other sizes \"may be resized or centrally cropped,\" and Google advises 720p or higher at 16:9 or 9:16. Clips are 4, 6 or 8 seconds, and 1080p and 4K come only at 8. Gemini Omni Flash, now Google's default video model in the Gemini API, decides how to use an image unless you tag it as the first frame.\n- Seedance on [BytePlus ModelArk](https://docs.byteplus.com/en/docs/ModelArk/2298881) accepts JPEG, PNG, WebP, BMP, TIFF and GIF under 30 MB, 300 to 6,000 pixels on a side, in ratios between 0.4 and 2.5, and center-crops a mismatch. Seedance 2.0 makes 4 to 15 second clips and Seedance 2.5 up to 30.\n- Luma Ray3.2 takes start and end frames in JPEG, PNG or WebP up to 50 MB and 8,000 pixels, for 5 or 10 second clips up to 1080p; start and end frames do not work with 10-second clips.\n- MiniMax's Hailuo API takes one first frame, one last frame and up to nine reference images, each up to 30 MB.\n- OpenAI removed Sora 2 and its Videos API from the API on September 24, 2026.\n\nThe vendors also name two failure modes. Runway's guide warns that in image-to-video, \"Visual artifacts, such as blurry hands or faces, may be intensified.\" ByteDance warns that when input and output sizes do not match, Seedance 2.0 can show \"abrupt changes such as image stretching and compression.\" Both are problems you fix in the still, before you pay for the clip."
      },
      {
        "h": "Ten checks before you upload",
        "body": "- Match the aspect ratio of the output. Crop the still yourself to 16:9, 9:16 or whatever you will deliver, so the tool never crops or pads it for you.\n- Match or beat the output resolution. A frame smaller than the video gives the model less detail to keep.\n- Keep text, logos, captions and watermarks out of the frame. Small type warps as soon as the camera or subject moves; set type and place logos in the edit.\n- Make it sharp. No motion blur, no heavy compression, no upscaling artifacts; export PNG or a high-quality JPG.\n- Leave room for the move. Frame a little wider than the final crop if the camera will push in, and leave space on the side the subject will walk or turn toward.\n- Choose a pose that can start moving. Weight on one foot, a hand mid-gesture, a head about to turn. A peak moment has nowhere to go.\n- Get hands right or keep them out. The model will move whatever hands are in the frame, extra fingers included.\n- Give the light a clear direction the clip can continue, and leave lens flares for the edit.\n- For products, turn the label to camera, keep it large enough to read, and include a contact shadow so the product sits on something.\n- Check the frame against your [look bible](/guide/look-bible-for-ai-films), so shot 7 cuts next to shot 6."
      },
      {
        "h": "Prompt for the motion",
        "body": "The vendors give the same advice in different words. [Google's Veo guidance](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/best-practice) says \"Focus your prompt on the motion you want to see,\" warns against trying to \"Re-describe the character, the background, or the lighting depicted in the image,\" and says to \"Prompt for camera movement, subject animation, and environmental changes.\" Runway's guide says \"Effective image to video prompts focus almost exclusively on motion\" and offers a pattern, \"The camera [motion description] as the subject [action].\" BytePlus sums up Seedance prompts as \"subject + motion, background + motion, camera + motion.\" Kling warns that \"A description that significantly deviates from the image may cause a camera cut or transition.\" Google's guide also tells you to avoid quotation marks in the prompt.\n\nA prompt for a five-second product shot might read like this example.\n\n```\nCamera: Slow push in at eye level, no cuts.\nSubject: She lifts the can from the counter and pauses before drinking.\nProduct: The label stays facing camera and unchanged. The logo does not move or morph.\nEnvironment: The curtain behind her stirs slightly. The window light stays constant.\nPace: Slow and even. The move ends at a medium close-up.\n```\n\nOne camera move and one action per clip is a good rule. If a shot needs two moves, make two clips and cut between them."
      },
      {
        "h": "When to add a last frame",
        "body": "A last frame tells the model where the shot must end. It helps most for reveals and transformations: a closed box that ends open, a product that ends in a hand, a push in that ends on the clean plate for the end card. Veo 3.1, Kling 3.0, Luma Ray3.2 and MiniMax's Hailuo accept one. Runway's Gen-4.5 does not, and handles keyframes in a separate Animate Frames app.\n\nMake both frames from the same look bible and the same light, so the model animates a move and not a change of scene, and keep the distance between them small enough to cross in the clip length you chose. Kling will not generate from an end frame alone, and Luma does not allow start and end frames on 10-second clips."
      },
      {
        "h": "Check the contest rules on stills",
        "body": "Tool-locked contests do not all treat stills the same way. The [Formula E Creators Challenge](/contests/formula-e-creators-challenge-2026), which closes September 30, 2026, requires 100% of the video to be generated with Google models, but [its rules](https://gen4challenge.com) also say \"Stills or audio may use any tool.\" Other contests require the whole piece to come from one platform, and Runway's Big Ad Contest rules required entries to \"Be created using tools available within the Runway platform.\" Read the rule for your contest before you make first frames in a different tool, and say which tools made the stills in your submission notes. For festivals that take work from specific tools, see our lists for [Seedance users](/topics/best-ai-film-festivals-for-seedance-users) and [Veo users](/topics/best-ai-film-festivals-for-veo-users)."
      },
      {
        "h": "Make the frames in Overs, animate them anywhere",
        "body": "Overs makes exactly the kind of still this page asks for. It studies the brand, casts a model when the product is worn or held, plans the shots, and gives each photo only the reference pictures it needs. You choose the image model that makes the final photos. Nano Banana 2 is the default and holds products steady across a batch, GPT Image 2.5 Sunburst is the slowest and most exact at keeping a product identical while the scene changes, and GPT Image 2 is often better at text, fabric and bright studio light.\n\nTwo features line up with the first-frame rules above. Overs sets headlines, sublines and buttons in a separate typography step and keeps the clean version, so you always have a text-free frame to animate. And it writes a text motion prompt for each photo for Seedance or Veo, which you take with the frame to your video tool, since Overs does not make video.\n\nThe numbers make the case for fixing frames before motion. Across 361 real renders from four 2026 campaigns by 100 Creatives, the agency Abhi Chawla founded, it took about 8 tries to get a usable photo. At published prices of $0.034 to $0.211 a render, that is $0.27 to $1.69 in AI fees per usable frame, before you spend a cent on video. [Overs' guide to making AI product photos look real](https://www.overs.studio/guides/how-to-make-ai-product-photos-look-real) covers the ten tells that also ruin a first frame.\n\nOvers is a sister product to AI Film Contests, from the same founder, and Abhi's own businesses make their images with it. You see the shot plan and an estimated cost before anything renders, and the free plan covers 40 photos a month on your own OpenRouter key, with no markup from Overs. [Try Overs free at www.overs.studio](https://www.overs.studio) and build your next spot from frames you have already approved."
      }
    ],
    "faqs": [
      {
        "q": "What makes a good first frame for image-to-video?",
        "a": "A good first frame is sharp, at or above the output resolution, in the same aspect ratio as the video, free of text and logos, and composed with room for the motion you plan. Hands should be correct or out of frame, the light should have a clear direction, and a product's label should face camera. It should also match the film's look, so the shot cuts with its neighbors."
      },
      {
        "q": "Should the prompt describe the image when I use image-to-video?",
        "a": "Describe the motion. The image already tells the model what is in the scene, so spend the prompt on the camera move, the subject's action, the pace and what must stay still, such as a product label. Google, Runway, ByteDance and Kling all say this in their own guides, and Kling warns that a prompt that strays far from the image can cause an unwanted cut."
      },
      {
        "q": "What aspect ratio should the first frame be?",
        "a": "The same as the video you want. Runway Gen-4.5 accepts 1:2 to 2:1 and crops anything else from the center, Kling 3.0 accepts 1:2.5 to 2.5:1, Seedance accepts ratios between 0.4 and 2.5 and center-crops a mismatch, and Google says Veo inputs of other sizes may be resized or cropped, advising 16:9 or 9:16 at 720p or higher. Crop the still yourself so no tool decides the framing for you."
      },
      {
        "q": "Can I make first frames in one tool and animate them in another?",
        "a": "Usually yes, but check your contest's rules first. The Formula E Creators Challenge requires all video to come from Google models while allowing stills from any tool. Other contests require every part of an entry to come from their own platform. Say which tools made the stills and which made the video in your submission."
      }
    ],
    "related": [
      {
        "href": "/contests/formula-e-creators-challenge-2026",
        "label": "Formula E Creators Challenge: video from Google models, stills from any tool, closes September 30, 2026"
      },
      {
        "href": "/topics/best-ai-film-festivals-for-seedance-users",
        "label": "Best AI film festivals for Seedance users"
      },
      {
        "href": "/topics/best-ai-film-festivals-for-veo-users",
        "label": "Best AI film festivals for Veo users"
      },
      {
        "href": "/tools/kling",
        "label": "Kling AI contests"
      }
    ]
  },

  "ai-commercial-packshot-and-end-card": {
    "title": "The Packshot and End Card of an AI Commercial",
    "description": "The last seconds of an AI spot are where products warp and logos melt. How to build the packshot and end card as controlled stills, with text rules and sizes.",
    "keywords": "packshot AI commercial, end card video ad, AI ad end frame, logo lockup video ad, pack shot commercial length, AI commercial logo distortion, end card safe zones, super hold time Clearcast",
    "datePublished": "2026-09-24",
    "intro": "The packshot is the shot of the product, usually near the end of a commercial, and the end card is the frame that follows or overlaps it with the logo, the line and the call to action. In an AI commercial, build both as stills you control, with a clean, approved product image that moves gently at most, and type and logo set in the edit from real artwork. Leave them to the model and the spot can end on a warped logo.\n\nThis guide covers what the last seconds have to do, why they fail in AI spots, how to build the packshot and the end card as layers you control, the text and safe-zone rules that apply, and how ad contests weigh the brand.",
    "sections": [
      {
        "h": "What the last seconds have to do",
        "body": "The Cambridge Business English Dictionary defines a pack shot as \"a photograph or short piece of film showing a product and its package in a way that can be used to advertise the product.\" In a commercial it usually lands near the end, with or right before the end card, which carries the logo, the line, the call to action and any legal text.\n\nThe platforms want the brand early as well. [Google's ABCD guidance](https://www.thinkwithgoogle.com/intl/en-emea/future-of-marketing/creativity/youtube-video-ad-best-practices/) for YouTube ads says \"Brand early, often, and richly\" and lists \"product shots, pack shots, in situ branding\" among the ways to do it. Meta's guidance for Instagram video ads says \"Feature your brand and key message within the first 3 seconds.\" The packshot you build for the end is often the frame you cut into the opening too, so it has to hold up at any point in the spot."
      },
      {
        "h": "Why AI spots fail at the end",
        "body": "The end is where a generated commercial is most likely to show its seams. The product is large in frame and held on screen long enough to study. The logo and the line are text, which models draw as shapes. And the end is the moment the viewer is asked to remember a brand, so a warped letter costs more there than anywhere else in the spot.\n\nThe usual failures are easy to spot. The pack changes shape during a slow push in, the logo softens as the light moves, the line of copy wobbles, or a 9:16 cut crops the product and buries the logo under the platform's buttons."
      },
      {
        "h": "Build the packshot as a still you control",
        "body": "Make the packshot from the best still you have of the product, either a real photograph or an AI image you have approved against the real pack. Then decide how much it should move. A held frame with a slow digital push in the edit, a light sweep, or a small parallax move from a layered still will read as intentional and keep every letter sharp. If you want generated motion, animate the approved still in a short clip, with the prompt telling the model the product and label do not change, and check it frame by frame.\n\nMatch the packshot's light to the shot before it, or cut to it on a beat of the music, so the change from a generated scene to a clean product frame reads as a choice.\n\nKeep the product clean in the plate. Put no text, logo or legal line into the image you generate or animate. Those go on top in the edit, from the brand's real files, so they cannot warp and can be changed per market without a re-render."
      },
      {
        "h": "Set the end card in the edit",
        "body": "Build the end card as layers: the clean plate, the logo from the brand's vector artwork, the line, the call to action, and any legal or spec-ad line. Give it enough time on screen to be read.\n\nFor UK broadcast the standard is written down. The [BCAP guidance on superimposed text](https://www.asa.org.uk/static/uploaded/c658b5c6-d6a3-47f0-a2b878416e141216.pdf) that Clearcast applies says supers \"should be held for a duration calculated at the rate of 5 words per second,\" plus a recognition period of 2 seconds for nine words or fewer and 3 seconds for ten or more. A company name, brand name or logo does not count toward the words. On HD, the preferred minimum text height is 30 lines, or 26 on an opaque block. Even if your spot never airs in the UK, those numbers make a sound floor for any end card. An eight-word line needs 1.6 seconds of reading plus 2 seconds to be noticed, 3.6 seconds in all.\n\nOn phones, the app covers part of the frame. Meta's Ads Guide for Reels asks you to leave \"at least 14% of the top, 35% of the bottom, and 6% on each side of your asset free from text, logos\" and other key elements. TikTok sets its safe zone by format and caption length and publishes templates instead of one number."
      },
      {
        "h": "The last five seconds, worked through",
        "body": "Take the end of a hypothetical 30-second spot for a made-up cold brew: a packshot from 0:25 to 0:27.5 and an end card from 0:27.5 to 0:30, with the line \"Cold brew, brewed slow. Find it today.\" The line has seven words. Under the UK hold-time formula, seven words need 1.4 seconds of reading plus 2 seconds of recognition, 3.4 seconds in all, and the end card as boarded gets only 2.5. The fix is to bring the line in over the packshot at 0:26, so it holds for four seconds, and let the logo, which does not count toward the words, arrive with the end card.\n\nThen check the frame at every size. In the 9:16 cut the product sits in the center third, the line sits above Meta's bottom 35% so captions and buttons do not cover it, and the logo clears the top 14%. In a 6-second bumper there is no room for a slow reveal, so the product and the logo come in early.\n\n- The product on screen is the approved still, held or moved gently.\n- The logo comes from vector artwork and is never generated.\n- The line stays on screen long enough for its word count.\n- Legal and spec-ad lines are readable at phone size.\n- Every size is checked against its platform's safe zone."
      },
      {
        "h": "Make every size from one master",
        "body": "Make one master and derive the rest. Frame the packshot for 16:9 with the product in the center third, so a 9:16 crop keeps it, and check the vertical version against Meta's safe zones before you place the logo. [YouTube's bumper ads](https://support.google.com/google-ads/answer/2375464) last \"between 5 and 6 seconds,\" and viewers can skip in-stream ads \"After 5 seconds,\" so a short cut needs the brand inside its first five. Keep the clean plate, the logo file and the line as separate layers, and each new size becomes a re-layout instead of a re-render."
      },
      {
        "h": "What contest juries see last",
        "body": "Ad contests score the brand directly. [Atlanta AI Ad Fest](/contests/atlanta-ai-ad-fest-2026), which closes October 25, 2026, scores entries 40% on idea, 30% on craft, 20% on brand and 10% on impact. Its brand question is \"Does it make the brand matter?\", and its rules add that \"Technical novelty alone does not win.\" The Formula E Creators Challenge requires elements of its GEN4 Asset Kit to be on screen for at least 4 seconds, which in practice means a planned product moment. And the [Hollywood AI Short Film Awards](/contests/hollywood-ai-short-film-awards-2027) lists a Best Branded Commercial award for its 2027 edition.\n\nFor a spec spot about a real brand you do not work for, the end card is also where the honesty line goes: \"Spec ad. Not made for, affiliated with or endorsed by [brand].\" Our guide to [real brands in AI spec ads](/guide/real-brands-in-ai-spec-ads) covers when that is enough and when it is not."
      },
      {
        "h": "Make the packshot and end card stills in Overs",
        "body": "The end of a spot should be a still you control, and that is what Overs makes. It plans the set for the uses you name, including hero, banner and billboard, so the packshot frame, the end card and the campaign stills a brand wants next to the spot come out of one plan with one look. Each photo gets only the reference pictures it needs, and brand rules are applied last.\n\nType is a separate step, which is how an end card should be built. Overs sets a headline, a subline and a button onto a finished photo and keeps the clean version, so you get a text-free plate to animate and a finished card to check against. For sign-off it exports a client review file, one HTML file, and the client's decisions come back into Overs.\n\nOvers was built on the process 100 Creatives, the agency Abhi Chawla founded, used to make hundreds of photos a week for hundreds of brands. Across four of its 2026 campaigns it took about 8 tries per usable photo, which is $0.27 to $1.69 in AI fees per keeper at published prices of $0.034 to $0.211 a render. Abhi's own businesses make their images with Overs today. It makes stills and writes a motion prompt per photo for Seedance or Veo. [Overs' guide to getting text right in AI images](https://www.overs.studio/guides/how-to-get-text-right-in-ai-images) explains the two-pass method of rendering clean and then setting the type.\n\nOvers is a sister product to AI Film Contests, from the same founder. You see the plan and the estimated cost before anything renders, and the free plan covers 40 photos a month on your own OpenRouter key, with no markup from Overs. [Try Overs free at www.overs.studio](https://www.overs.studio) and build your next end card from a clean plate."
      }
    ],
    "faqs": [
      {
        "q": "What is a packshot in a commercial?",
        "a": "A packshot is the shot of the product itself, usually with its packaging and label, placed near the end of a commercial so viewers remember what to look for in a shop. It is often combined with the end card, the frame that carries the logo, the line and the call to action. The Cambridge Business English Dictionary defines it as a photograph or short piece of film that shows a product and its package in a way that can be used to advertise it."
      },
      {
        "q": "Should I generate the logo in an AI commercial?",
        "a": "No. Models draw logos as shapes, and a logo that softens or changes as the camera moves is one of the clearest signs of an AI spot. Keep the generated or animated plate free of text and logos, then place the logo from the brand's vector artwork in the edit, where it stays sharp and can be swapped per market."
      },
      {
        "q": "How long should an end card stay on screen?",
        "a": "Long enough to read. The UK broadcast guidance that Clearcast applies holds supers at five words per second, plus 2 seconds for lines of nine words or fewer and 3 seconds for ten or more, not counting the brand name or logo. An eight-word line therefore needs about 3.6 seconds. Online there is no fixed rule, but the same arithmetic keeps an end card readable on a phone."
      },
      {
        "q": "Can the packshot be a real photo in an AI commercial?",
        "a": "For client work, yes, and a real photograph is the surest way to get every letter of the label right. For a contest, check the rules first. Some require AI in every shot and some require all video to come from a single tool, in which case an approved AI still of the product, animated gently or held, is the safer choice."
      }
    ],
    "related": [
      {
        "href": "/contests/atlanta-ai-ad-fest-2026",
        "label": "Atlanta AI Ad Fest: judged 20% on brand, closes October 25, 2026"
      },
      {
        "href": "/contests/golden-dunes-dubai-2026",
        "label": "Golden Dunes Dubai: Best AI Commercial under five minutes, closes October 15, 2026"
      },
      {
        "href": "/contests/hollywood-ai-short-film-awards-2027",
        "label": "Hollywood AI Short Film Awards: Best Branded Commercial, closes January 11, 2027"
      },
      {
        "href": "/cinematic-ads",
        "label": "Cinematic AI advertising: tools, competitions and studios"
      }
    ]
  },

  "ai-food-and-drink-commercials": {
    "title": "How to Make an AI Food or Drink Commercial",
    "description": "What AI gets right and wrong in food and drink spots, what 120 real renders taught about texture and grain, and the rules on food images and alcohol casting.",
    "keywords": "AI food commercial, AI drink commercial, AI beverage ad, AI food video ad, AI pour shot, condensation AI video, Coca-Cola AI ad, alcohol ad age rule AI, food styling advertising rules",
    "datePublished": "2026-09-24",
    "intro": "An AI food or drink commercial works when the stills are right before anything moves. Make three approved frames first, the hero pack, a texture close-up and the action moment such as a pour or a break, then animate them in short clips with prompts that name the motion and keep the label still. AI is strong on crumbs, steam, gloss and condensation and weak on portions, liquid physics, hands and label text, so plan the shots around that.\n\nThis guide covers what happened when Coca-Cola and McDonald's put AI holiday ads on air, what AI does well and badly with food and drink, how to build and animate the hero stills, the rules on food images and alcohol casting, and where to enter a food or drink spot.",
    "sections": [
      {
        "h": "What happened when big brands tried it",
        "body": "Coca-Cola's AI-made holiday ads in November 2024 came from three AI studios, Secret Level, Silverside AI and Wild Card, \"using four different generative AI models,\" [NBC News reported](https://www.nbcnews.com/tech/innovation/coca-cola-causes-controversy-ai-made-ad-rcna180665), and Forbes named Leonardo, Luma and Runway, with Kling brought in near the end of production. Critics online called the result soulless, NBC reported. Coca-Cola said it \"crafted films through a collaboration of human storytellers and the power of generative AI.\" A year later the company ran another AI holiday ad, made with Secret Level, which the Hollywood Reporter described as featuring \"just animals\" and AFP noted \"avoids close-ups of humans.\" Coca-Cola's Pratik Thakar said \"this year the craftsmanship is ten times better.\"\n\nMcDonald's Netherlands went the other way. Its 45-second AI Christmas ad, made by TBWA\\Neboko and The Sweetshop, went up on YouTube on December 6, 2025 and came down on December 9 after a backlash, [the BBC reported](https://www.bbc.com/news/articles/czdgrnvp082o), and McDonald's called it \"an important learning.\"\n\nFor a filmmaker, the useful detail is what Coca-Cola changed in its second year. It dropped close-ups of people and built the spot around animals."
      },
      {
        "h": "What AI does well and badly with food and drink",
        "body": "Image and video models are good at surface: the wet shine on a brownie, crumbs in the air, steam, frost and beads of condensation on a can, the grain of a cut loaf. Those details sell food, and they are cheap to try again.\n\nThey are weak where food has to obey rules. Portions change size between shots. Liquids pour at the wrong speed, split into two streams or fill a glass that never overflows. Hands holding a fork or a can grow extra fingers or merge with the pack. Label text, the most important thing in a packaged-food spot, drifts into shapes that look like letters. Plan the edit so the camera lingers on surfaces and cuts away before physics has to be right.\n\nThe numbers from 100 Creatives' 2026 campaigns show the cost of food realism. Brownie food ads with motion took 120 renders for 10 keepers, 12 per usable image, against 3.2 for gummy supplement ads and about 8 across all four campaigns. Budget for that before promising a client a delivery date."
      },
      {
        "h": "Build the hero stills first",
        "body": "Three frames carry most food spots: the hero (the pack or the plated product, clean and sharp), the texture close-up (the crumb, the fizz, the drip), and the action frame (the pour, the bite, the break). Make them as stills, approve them, and only then animate.\n\nWrite each still the way the kept prompts on the brownie job were written: the product and a pointer to the reference image first, the background as a hex color, the light as something falling on a surface, one sentence of lens, and grain in its own sentence. Here is one of them, for a dark, high-contrast ad on Nano Banana 2 (lightly edited: brand names removed).\n\n```\nThe product shown in the reference image sits as two brownies stacked with a third tumbling downward, crumbs and cocoa dust frozen in suspension like a constellation of chocolate stardust against a pitch-black void (#000000). Hard direct flash carves ultra-sharp shadows beneath each piece, revealing wet fudgy shine across the top surface in deep chocolate tones (#2A1610). Faint particles of cocoa powder drift outward catching subtle cyan highlights (#42C0FB) that rim the edges with an otherworldly glow. The surfaces gleam with moisture, every crack and crater rendered in exacting detail. Shot at 90mm, f/4, focus locked on the middle brownie's glossy peak, framed as a tight vertical stack filling the center. Color science references Kodak Ektar 100, high contrast, saturated midtones, heavy visible film grain structure, deep blacks crushed to pure absence, with controlled saturation letting the warm chocolate browns dominate while cyan accents remain restrained and surreal.\n```\n\nAll ten kept images on that job asked for heavy film grain, and nine carried the same hand-added sentence, \"Heavy visible film grain throughout.\" Grain breaks up the too-smooth surfaces that can give AI food away, and it gives separate shots one texture. Once a line like that works, paste it into every prompt unchanged."
      },
      {
        "h": "Animate in short clips",
        "body": "Give each clip one job. A slow push in on the texture frame, a pour that starts in frame and ends in frame, a hand that lifts the can and stops. Name the direction and the speed in the prompt, say what must not move, and keep clips short enough that the model does not have to keep liquid behaving for long. If the label is in frame, tell the model it stays facing camera and unchanged, and check it frame by frame in the edit.\n\nWhere a pour will not behave, cut it. A close-up of the glass filling, then a cut to the full glass, reads as a pour to the viewer and never asks the model to handle the whole arc."
      },
      {
        "h": "The rules on food images and alcohol ads",
        "body": "A food ad has to show the food you sell. The FTC's Policy Statement on Deception notes that \"Section 12 specifically prohibits false ads likely to induce the purchase of food, drugs, devices or cosmetics.\" The classic case is Campbell Soup in 1970, when the FTC acted against the company and its agency over \"clear glass marbles which prevent the solid ingredients (garnish) from sinking to the bottom\" of the bowl. In the UK, the ASA ruled against Parsley Box in 2019 because side dishes on the plate gave \"the impression that they could expect them to be included in the meals they received,\" and a \"Serving suggestion\" line did not save the ad. In a US lawsuit, Coleman v. Burger King, the plaintiffs allege the chain's ads show burgers \"approximately 35% larger in size\" than the real ones; a federal court refused to dismiss the case in 2023 and 2025 and denied class certification in November 2025. AI makes it easy to plump a burger, so keep portions, fillings and what comes in the box true to the product.\n\nAlcohol adds casting rules. The UK's [CAP Code](https://www.asa.org.uk/type/non_broadcast/code_section/18.html) says \"People shown drinking or playing a significant role must neither be nor seem to be under 25,\" a test of appearance that reads directly onto an AI cast. In the US, the Beer Institute's code says models \"should be at least 25 years old, substantiated by proper identification, and reasonably appear to be of legal drinking age,\" and the Distilled Spirits Council's code sets the same 25-year minimum. Neither US code mentions AI-generated people, since both are written for models and actors a brand employs, so cast AI drinkers who clearly look over 25. For a holiday spot, one more line matters. The Beer Institute code says ads \"should not depict Santa Claus,\" and the spirits code lists him among content that appeals to people under the legal drinking age."
      },
      {
        "h": "Where to enter a food or drink spot",
        "body": "Food and drink spots fit the ad categories on the current calendar. [Atlanta AI Ad Fest](/contests/atlanta-ai-ad-fest-2026), which closes October 25, 2026, has a Best Product Advertising award described as \"Product or offer made desirable without sacrificing idea or taste,\" though every entry must answer one of its four brand briefs. [Golden Dunes Dubai](/contests/golden-dunes-dubai-2026) (October 15) runs Best AI Commercial for spots under five minutes, the [Korea AI Cinema Festival](/contests/korea-ai-cinema-festival-2026) (October 31) has Best AI Commercial Film, and the [Hollywood AI Short Film Awards](/contests/hollywood-ai-short-film-awards-2027) (January 11, 2027) lists a Best Branded Commercial award. For a holiday drink or dessert film, Curious Refuge's [AI Holiday Film Competition](/contests/curious-refuge-holiday-2026) (December 6) pays $7,500 or more in cash and requires Epidemic Sound for music. Check each contest's rules on real brands first; our guide to [real brands in AI spec ads](/guide/real-brands-in-ai-spec-ads) covers the traps."
      },
      {
        "h": "Where Overs fits: the hero stills and the label",
        "body": "Overs is built for consumer, fashion and packaged-goods brands, and it grew out of the process 100 Creatives, the agency Abhi Chawla founded, used to make hundreds of photos a week for hundreds of brands. The brownie job above is one of that agency's 2026 campaigns. You give Overs one product photo and the brand's details. It writes the brand's visual DNA, plans the shots and gives each photo only the reference pictures it needs, so every shot works from the right pictures of the pack. Nano Banana 2, its default image model, is good at keeping a product accurate across a batch, and brand rules are applied last so they have the final say.\n\nUse it for the three stills a food spot hangs on, the hero, the texture close-up and the pour frame, and approve them as one set before any motion. You see the shot plan and an estimated cost before anything renders. Overs writes a text motion prompt for each photo, for Seedance or Veo, and you make the clips in that tool. The agency's numbers set honest expectations. Across four 2026 campaigns, 361 renders gave 45 keepers, about 8 tries per usable photo, and food with motion took 12. At $0.034 to $0.211 a render, a usable still costs $0.27 to $1.69 in AI fees at 8 tries. Abhi's own businesses make their images with Overs today.\n\nOvers is a sister product to AI Film Contests, from the same founder. [Overs' guide to AI food photography](https://www.overs.studio/guides/ai-food-photography) covers portions, physics and the rules on food images in more depth. The free plan covers 40 photos a month on your own OpenRouter key, with no markup from Overs. [Try Overs free at www.overs.studio](https://www.overs.studio) and make the hero stills for your next food spot."
      }
    ],
    "faqs": [
      {
        "q": "Can AI make a realistic food commercial?",
        "a": "Yes for texture and mood, with care for physics. Current image and video models render crumbs, steam, gloss and condensation well, and struggle with portions that change size, pours that break the laws of liquid, hands and label text. Make the hero, texture and action frames as approved stills first, animate them in short clips, and cut away before a pour has to be perfect."
      },
      {
        "q": "Can an AI drink ad show people drinking?",
        "a": "Yes, under the same rules as any alcohol ad. The UK's CAP Code says people shown drinking or playing a significant role must neither be nor seem to be under 25, and that test of appearance applies to an AI person as much as an actor. The US Beer Institute and Distilled Spirits Council codes require models of at least 25, and both steer alcohol ads away from Santa Claus. Cast AI drinkers who clearly look over 25."
      },
      {
        "q": "Should I add film grain to an AI food ad?",
        "a": "It is worth testing. Grain breaks up the too-smooth surfaces that can make AI food look generated, and it gives separate shots a shared texture. On 100 Creatives' 2026 brownie job, all ten kept images asked for heavy film grain, and nine carried the same sentence, \"Heavy visible film grain throughout.\" If you use it, put it in the prompt for every still and match it in the grade so every clip agrees."
      },
      {
        "q": "How many renders does an AI food ad take?",
        "a": "More than simpler product ads. On 100 Creatives' 2026 campaigns, brownie food ads with motion took 120 renders for 10 usable images, 12 per keeper, against 3.2 for gummy supplement ads and about 8 on average across four campaigns. Plan for 10 or more tries per usable food still before you promise a delivery date."
      }
    ],
    "related": [
      {
        "href": "/contests/curious-refuge-holiday-2026",
        "label": "Curious Refuge AI Holiday Film Competition: $7,500+ in cash, closes December 6, 2026"
      },
      {
        "href": "/contests/atlanta-ai-ad-fest-2026",
        "label": "Atlanta AI Ad Fest: $2,500 in cash prizes, closes October 25, 2026"
      },
      {
        "href": "/contests/golden-dunes-dubai-2026",
        "label": "Golden Dunes Dubai: Best AI Commercial, closes October 15, 2026"
      },
      {
        "href": "/categories/commercial",
        "label": "Every open AI commercial contest"
      }
    ]
  },

  "real-brands-in-ai-spec-ads": {
    "title": "Can You Use a Real Brand in an AI Spec Ad?",
    "description": "Contest rules, trademark basics and safer options for AI spec ads that feature real brands, with the exact rules from Runway, Formula E, Luma and Cannes Lions.",
    "keywords": "spec ad real brand, AI spec ad trademark, can I use a brand logo in a spec ad, AI ad contest brand rules, Runway Big Ad Contest real brands, Cannes Lions spec ads, spec commercial disclaimer, AI commercial trademark law",
    "datePublished": "2026-09-24",
    "intro": "You can make an AI spec ad for a real brand to practice or to pitch that brand in private. Publishing it, entering it in a contest or using it to sell your services is where the risk starts, because the brand's name, logo and packaging are its trademarks. Some AI ad contests ban real brands outright, and others accept only the brands they name. The ones that feature a real brand give you the brief and the assets, and that is your permission.\n\nThis guide sets out what the contest rules say as of September 24, 2026, the trademark basics behind them, and the safer ways to get brand work onto your reel. It is general information, not legal advice; for a specific ad, ask a lawyer where you live.",
    "sections": [
      {
        "h": "What AI ad contests say about real brands",
        "body": "Read the rules before you pick a product. The AI ad contests of 2026 handle real brands in four ways.\n\nRunway's contest bans them. [Runway's Big Ad Contest rules](https://runway.com/big-ad-contest/terms) say an entry must \"Not depict, reference, or include the name, logo, trademark, trade dress, or other intellectual property of any real-world brand, company, or commercial product.\" Both 2026 editions, in March and in July, ran on made-up products, and the second edition's seven fictional briefs each came with a product image and logo to use.\n\nFormula E and Atlanta AI Ad Fest hand you one real brand, and only that one. The [Formula E Creators Challenge](/contests/formula-e-creators-challenge-2026), presented by Bionic Awards and Google Cloud, asks for a film of up to 60 seconds about Formula E's GEN4 car and requires that \"Elements from the GEN4 Asset Kit must be on screen for at least 4 seconds.\" It also says you own the film as a creative work \"but not any Formula E material (like the GEN4 Asset Kit) used within it.\" [Atlanta AI Ad Fest](/contests/atlanta-ai-ad-fest-2026) asks for a 30 to 60 second film for one of four Brand Exclusive Tracks, and its rules, updated August 5, 2026, say \"Entries created for brands outside the four official AIAF 2026 Brand Exclusive Tracks are not eligible for competition judging.\" Read the next line too: \"Copyright in each submitted film is owned jointly by Atlanta AI Ad Fest (AIAF) and the brand party featured within the work.\" Curious Refuge ran its 2024 advertising competition the same way, with entries limited to brands named in its rules.\n\nLuma made itself the client. Luma's $1 million Dream Brief asked creatives to make commercials \"for Luma itself,\" and Luma's announcement says why: \"In line with Cannes Lions' rules, Luma AI will provide a brief to ensure the work is legitimate and created for a real client.\" Luma also paid for media so the finalists' ads ran publicly within the eligibility period Cannes requires.\n\nFestivals with a general ad category leave the rights to you. The rules of [Golden Dunes Dubai](/contests/golden-dunes-dubai-2026), which runs a Best AI Commercial award, say \"The submitter must hold full rights to the film, including music, visuals and any AI-generated content.\" A logo you have no license for is one of those rights you do not hold."
      },
      {
        "h": "Why award shows care: real work for real clients",
        "body": "Cannes Lions, advertising's biggest award show, puts the rule in writing. Its eligibility rules require work \"created within the context of a normal paying contract and genuine brief from a brand,\" signed off by a senior executive at the brand, and state that \"The entry is not speculative or conceptual advertising.\" The 2026 rules also say \"You must indicate if AI has been used in the work or the entry materials and for what purpose.\" The LIONS integrity standards warn that breaking the rules \"may result in disqualification, withdrawal of awards, exclusion from our Juries or even a ban from future Festivals.\"\n\nSo a spec ad for a real brand is a portfolio piece or a private pitch. It becomes an award entry only when a brand, or a contest acting for one, supplies the brief."
      },
      {
        "h": "Trademark basics for a spec ad",
        "body": "In the United States, three parts of the Lanham Act come up. Infringement under [15 U.S.C. 1114](https://www.law.cornell.edu/uscode/text/15/1114) covers using a registered mark \"in connection with the sale, offering for sale, distribution, or advertising of any goods or services\" in a way that is \"likely to cause confusion.\" False endorsement under [15 U.S.C. 1125(a)](https://www.law.cornell.edu/uscode/text/15/1125) covers suggesting the brand's \"sponsorship, or approval\" of your work. Dilution under section 1125(c) protects famous marks \"regardless of the presence or absence of actual or likely confusion,\" but lists \"Any noncommercial use of a mark\" among its exclusions.\n\nWhether a use is commercial matters under all three. A spot you send only to the brand, and never use to sell anything, is a different thing from the same spot in a paid contest entry, on a reel that sells your services, or run as an ad.\n\nTwo cases mark the edges. New Kids on the Block v. News America Publishing (9th Cir. 1992) allows using a brand's name to refer to the brand, but only if \"the user must do nothing that would, in conjunction with the mark, suggest sponsorship or endorsement by the trademark holder.\" A spec ad styled as the brand's own campaign does exactly that. And a near-copy of a real brand is not a safe fictional one. In Jack Daniel's Properties v. VIP Products (2023), the Supreme Court held unanimously that when a mark is used \"as a designation of source for the infringer's own goods, the Rogers test does not apply,\" so a parody brand gets no special First Amendment screen.\n\nThe UK and the EU work the same way in outline. Section 10 of the UK Trade Marks Act 1994 and Article 9 of the EU trade mark regulation both list using a sign in advertising among the acts an owner can stop, where the other conditions, such as a likelihood of confusion, are met."
      },
      {
        "h": "Real people in a real brand's ad",
        "body": "A real face brings a second set of rights, and AI ads now have rules of their own. Runway's contest rules also bar \"the likeness, voice, or image of any real, identifiable individual without documented written consent.\" Tennessee's ELVIS Act, in force since July 1, 2024, says \"Every individual has a property right in the use of that individual's name, photograph, voice, or likeness in any medium in any manner.\"\n\nNew York covers the opposite case, an AI person who looks like nobody. A law signed on December 11, 2025 (Chapter 617) requires an advertiser to \"conspicuously disclose\" a synthetic performer in an ad, meaning a digital human \"not recognizable as any identifiable natural performer,\" with civil penalties of $1,000 for a first violation and $5,000 for each one after. It takes effect 180 days after it became law. For a paid AI spot that will run in New York, plan the disclosure with the client from the start."
      },
      {
        "h": "Safer ways to get brand work on your reel",
        "body": "- Invent the brand. A fictional product with its own name, logo and pack gives you everything a real one would on the reel, with no trademark in the frame. It is also what Runway's contest asked for.\n- Enter the brand-brief contests. Formula E's asset kit and Atlanta's brand tracks come with permission built in, and a finalist placing is a real brand credit.\n- Pitch privately. Send the spot to the brand's marketing team as an unlisted link, say plainly that it is unsolicited spec work, and do not run it as an ad, monetize it or enter it anywhere.\n- Ask a small brand. A local coffee roaster or a new skincare line may say yes to a free spec spot in exchange for using it on your reel. Get the yes in writing (an email is fine) and say where the spot will appear.\n- Shoot the product yourself. Buy it and photograph it for your references instead of lifting the brand's own product photos, which carry their own copyright.\n\nIf you publish a spec ad at all, label it on the end card and in the description: \"Spec ad. Not made for, affiliated with or endorsed by [brand].\" A label shows good faith. It does not give you a license, and it will not fix a spot that looks like the brand's own campaign."
      },
      {
        "h": "Where Overs fits once you have permission",
        "body": "Overs is for brand work you are cleared to do, such as a client's product or a brief that supplies the product. You give it one photo of the product and the brand's own material, its website, its photos and an optional brand guidelines PDF of up to 24 pages. It studies the brand and applies the brand rules last, so they have the final say over every photo.\n\nIt also keeps the paper trail that rules like these ask for. Every photo in an Overs export carries a record of the prompt, the model and the reference pictures behind it, and in a shared workspace Overs records who decided on each photo, with a reason for every rejection. When a contest or a client asks how an image was made, you have the answer on file. Overs makes stills and writes a motion prompt per photo for Seedance or Veo; the video is made in your video tool.\n\nOvers was built on the process 100 Creatives, the agency Abhi Chawla founded, used to make hundreds of photos a week for hundreds of brands, and Abhi's own businesses make their images with it today. Across four of the agency's 2026 campaigns it took about 8 tries per usable photo, which is $0.27 to $1.69 in AI fees per keeper at published prices of $0.034 to $0.211 a render. [Overs' guide to logos and trademarks in AI images](https://www.overs.studio/guides/logos-and-trademarks-in-ai-images) covers placing your own logo from the real file and keeping other brands' marks out.\n\nOvers is a sister product to AI Film Contests, from the same founder. You see the plan and an estimated cost before anything renders, and the free plan covers 40 photos a month on your own OpenRouter key, with no markup from Overs. [Try Overs free at www.overs.studio](https://www.overs.studio) on the product from your next cleared brief."
      }
    ],
    "faqs": [
      {
        "q": "Can I use a real brand's logo in an AI spec ad?",
        "a": "For practice or a private pitch sent to the brand, spec ads with real logos are common. Publishing it, running it as an ad or entering it in a contest is riskier, because the logo is the brand's trademark and many contests ban real brands. Runway's Big Ad Contest rules forbid the name, logo, trademark or trade dress of any real-world brand. Contests like the Formula E Creators Challenge supply the brand's assets instead, which is permission."
      },
      {
        "q": "Can I enter a spec ad for a real brand in Cannes Lions?",
        "a": "No, not as unsolicited spec work. The Cannes Lions integrity standards say every entry should represent real work, created for real clients, with real results, and violations can lead to disqualification or a ban. Luma's 2026 Dream Brief handled this by making Luma the client and supplying the brief, so work entered for a Gold Lion was legitimate client work."
      },
      {
        "q": "Is a spec ad noncommercial use of a trademark?",
        "a": "It depends on how you use it. US dilution law excludes \"Any noncommercial use of a mark,\" and a spot sent privately to the brand and never used to sell anything is easier to defend than one that is not. The same spot entered in a paid contest, used to sell your services or run as an ad looks more commercial, and infringement and false endorsement claims turn on confusion and implied sponsorship, which a label does not settle. This is general information, not legal advice."
      },
      {
        "q": "How should I label a spec ad?",
        "a": "Put a plain line on the end card and in the video description, such as \"Spec ad. Not made for, affiliated with or endorsed by [brand].\" Do not run it through paid ads, do not use the brand's hashtags as if it were official, and take it down if the brand asks. The label shows good faith, but it is not a license to use the brand's trademarks."
      },
      {
        "q": "Which AI ad contests give you a real brand to work with?",
        "a": "As of September 24, 2026, the Formula E Creators Challenge (closes September 30) supplies a GEN4 Asset Kit that must be on screen for at least 4 seconds, and Atlanta AI Ad Fest (closes October 25) runs four Brand Exclusive Tracks with briefs and brand guidelines. Check each contest's page on AI Film Contests for the current deadline and rules."
      }
    ],
    "related": [
      {
        "href": "/contests/formula-e-creators-challenge-2026",
        "label": "Formula E Creators Challenge: a real brand brief with an asset kit, closes September 30, 2026"
      },
      {
        "href": "/contests/atlanta-ai-ad-fest-2026",
        "label": "Atlanta AI Ad Fest: four Brand Exclusive Tracks, closes October 25, 2026"
      },
      {
        "href": "/contests/gossip-goblin-showrunner-competition-2026",
        "label": "Gossip Goblin x Showrunner: $20,000, set in the Gossip Goblin universe, closes December 15, 2026"
      },
      {
        "href": "/cinematic-ads",
        "label": "Cinematic AI advertising: tools, competitions and studios"
      }
    ]
  },

  "how-to-price-ai-commercial-work": {
    "title": "How to Price AI Commercial Work: Stills Plus Video",
    "description": "What an AI spot and its stills cost to make, from per-second video prices to renders per keeper, and how to quote a brand for the work, the rounds and the usage.",
    "keywords": "how to price AI commercial, AI video pricing for clients, AI ad pricing freelancer, AI commercial quote, AI video cost per second, Veo 3.1 price per second, usage rights AI commercial, AI stills and video package price",
    "datePublished": "2026-09-24",
    "intro": "Price AI commercial work in three layers: the model fees you pay to make it, the hours you spend directing, reviewing and finishing it, and the rights the brand gets to use it. The model fees are the smallest layer and the easiest to calculate, so calculate them exactly, pass them through or build them in, and put your price on the time and the usage. A brand that asks for a spot usually also needs stills for feeds, the store and banners, so quote the two together.\n\nThis guide lays out the published prices of the main video and image models as of September 24, 2026, how many tries to budget per usable shot, a worked example for a 30-second spot plus ten stills, and how to price the time, the review rounds and the usage on top. The prices change often, so check each provider's page on the day you quote.",
    "sections": [
      {
        "h": "What the machines cost, per second and per image",
        "body": "Video models charge by the second of finished output, and the price moves with resolution and with audio. As published on September 24, 2026:\n\n- Google Veo 3.1, on the [Gemini API pricing page](https://ai.google.dev/gemini-api/docs/pricing): $0.40 a second at 720p or 1080p and $0.60 at 4K, with audio. Veo 3.1 Fast costs $0.10, $0.12 and $0.30 a second at the same sizes, and Veo 3.1 Lite $0.05 at 720p and $0.08 at 1080p.\n- Runway: Gen-4.5 uses 12 credits a second and Gen-4 Turbo 5. [Runway's API pricing](https://docs.dev.runwayml.com/guides/pricing/) sells credits at $0.01 each, which makes Gen-4.5 $0.12 a second. The monthly plans start at $15 for 625 credits.\n- Kling 3.0, on [Kling's API](https://kling.ai/dev/pricing): $0.084 a second at 720p, $0.112 at 1080p and $0.42 at 4K without audio, bought in packages that start at $700 for 5,000 units.\n- ByteDance Seedance 2.0, on [BytePlus ModelArk](https://docs.byteplus.com/en/docs/ModelArk/1544106): BytePlus's own examples price a 5-second clip at $0.76 at 720p, $1.87 at 1080p and $3.89 at 4K, about $0.15, $0.37 and $0.78 a second.\n- [OpenAI removed Sora 2](https://developers.openai.com/api/docs/deprecations) and its Videos API from the API on September 24, 2026, after notifying developers in March, so leave it out of new API-based quotes.\n\nStills are priced per image. Google's Nano Banana 2 costs $0.067 at 1K and $0.101 at 2K, and Nano Banana Pro $0.134 at 1K or 2K and $0.24 at 4K. OpenAI's GPT Image 2 costs $0.211 for a 1024 by 1024 image at high quality, $0.053 at medium and $0.006 at low."
      },
      {
        "h": "Budget for every try",
        "body": "The published price is per generation, and you will not keep every generation. The agency 100 Creatives counted this across four of its 2026 campaigns: 361 image renders produced 45 usable images, about 8 per keeper, with a range from 3.2 renders per keeper on gummy supplement ads to 13.6 on a surf apparel job with one model across three locations. Food ads with motion took 12.\n\nVideo has the same problem at a higher price per try. Build your own ratio from your last job, then multiply. If each shot takes three video tries of about five seconds, a 12-shot spot is 36 clips, or 180 seconds of generated video for 30 seconds on screen. The multiplier moves the budget more than the price per second does."
      },
      {
        "h": "A worked example: a 30-second spot and ten stills",
        "body": "Here is the arithmetic for a hypothetical job: a 30-second spot of 12 shots, plus ten campaign stills, priced at the rates above. The assumptions are 8 tries per usable still (the 100 Creatives average), a still first frame for every shot, and three video tries of about five seconds per shot.\n\n- Stills: 12 first frames plus 10 campaign stills, at 8 tries each, is 176 image renders. That is $11.79 on Nano Banana 2 at 1K, or $37.14 on GPT Image 2 at high quality.\n- Video: 36 clips of about five seconds is 180 seconds. That is $20.16 on Kling 3.0 at 1080p without audio, $21.60 on Veo 3.1 Fast at 1080p, or $72.00 on Veo 3.1 at 1080p with audio.\n- Total model fees: about $32 at the low end (Nano Banana 2 plus Kling 3.0) to about $109 at the high end (GPT Image 2 plus Veo 3.1).\n\nNow price the time the same way. The [US Bureau of Labor Statistics](https://www.bls.gov/ooh/media-and-communication/film-and-video-editors-and-camera-operators.htm) puts the 2025 median pay for film and video editors and camera operators at $36.10 an hour. That is what employers pay staff. Even at that rate, five eight-hour days of directing, reviewing, editing and finishing come to $1,444, and the model fees are 2 to 8 percent of it. Build the quote on the time."
      },
      {
        "h": "Price the time and the usage",
        "body": "Price the work as a day rate or a project fee, broken into stages the client will recognize. Pre-production covers the treatment, the [look bible](/guide/look-bible-for-ai-films), the boards and the casting sheet; then come generation and review, the edit, sound and grade, and delivery in every size. Count review rounds in the quote. AI makes one more version cheap to render and expensive to direct, so include two rounds and price extra rounds at your day rate.\n\nThen price the rights separately. Photographers have long split the fee for making work from the fee for using it. The UK's Association of Photographers (AOP) [describes a base usage rate](https://www.the-aop.org/information/usage-calculator/explanation-of-b-u-r) that covers one country for one year in two media, or for two years in one medium, with licences of at least six months, extra territories priced as a share of the base (additional use in the US at 150% of it), and a base that \"should never be less than the negotiated daily shoot-fee or day-rate.\" The same logic fits an AI spot. A year of paid TV and online use is worth more than one organic social post, even though the files are identical.\n\nPut AI in the contract too. The UK advertising bodies IPA and ISBA, in their [principles for generative AI in advertising](https://www.isba.org.uk/article/isba-and-ipa-launch-industry-principles-use-generative-ai-advertising), say neither agency nor client \"should include AI-generated content in materials provided to the other without the other's agreement.\" For the finished ads, the IAB's AI Transparency and Disclosure Framework of January 15, 2026 says \"Disclosure is required only when AI materially affects authenticity, identity, or representation in ways that could mislead consumers.\" Write down which tools you will use, what the client may do with the outputs, and who labels the ads where a platform or a law requires it."
      },
      {
        "h": "List every deliverable, because each one is work",
        "body": "A brand rarely wants one file. A contest like [Atlanta AI Ad Fest](/contests/atlanta-ai-ad-fest-2026) needs one 30 to 60 second film, but a client job usually means a 16:9 master, a 9:16 cut for Reels, Shorts and TikTok, a 1:1 or 4:5 cut for feeds, a 6-second bumper, and a set of stills in the sizes of the store, the feed and the banners. Each cut is a new edit with its own framing and its own end card, and each still size can need its own crop or a new render. Write every file into the quote with its size and length, so a request for \"a few more versions\" becomes a change order. Our guides to [storyboards and shot lists](/guide/ai-commercial-storyboard-and-shot-list) and to [the packshot and end card](/guide/ai-commercial-packshot-and-end-card) show how to plan those sizes from day one."
      },
      {
        "h": "What to put in the quote",
        "body": "```\n1. Pre-production: treatment, look bible, storyboard, casting sheet (fixed fee)\n2. Stills: N finished photos in listed sizes, 2 review rounds (fee per set)\n3. Video: 1 x 30 s master, 16:9, plus 9:16 and 1:1 cutdowns (fee)\n4. Edit, sound, grade and delivery (fee or day rate)\n5. Review rounds included: 2; extra rounds at [day rate]\n6. Model fees: estimated at $[X], billed at cost with receipts, capped at $[Y]\n7. Usage: [media], [territory], [term]; renewal at [price]\n8. AI disclosure: tools used, and who labels the ads where platforms require it\n9. Kill fee: [percent] if cancelled after pre-production\n```\n\nThe model fee line does two jobs. It shows the brand that the machines are not where the money goes, and a cap protects you if a shot takes 14 tries instead of 8."
      },
      {
        "h": "Where Overs fits: price the stills line from the plan",
        "body": "Overs makes the stills half of a quote easy to price, because it shows the shot plan and an estimated cost before anything renders. The estimate counts one render per photo, so multiply it by your own tries per keeper. You pay for the AI through your own OpenRouter key, and Overs adds no markup (OpenRouter charges 5.5% when you buy credits by card, with a $0.80 minimum). The free plan covers 40 photos a month, and Pro at $29 a month and Team at $99 both include unlimited photos.\n\nHere is a 30-photo set with 10 on-model shots, priced three ways on September 24, 2026. A studio at soona's published prices comes to $2,026, and a hired crew for one day to $13,790 before usage fees, both from [Overs' guide to what a product photo shoot costs](https://www.overs.studio/guides/how-much-does-a-product-photo-shoot-cost). On Overs Pro, with about $0.20 of planning per run over three runs, the set costs about $36 at 3 tries a photo on Nano Banana 2 (90 renders at $0.067), about $46 at 8 tries, and about $118 at 14 tries on GPT Image 2 at high quality (420 renders at $0.211). That leaves out the hours spent choosing, about 240 images to pick 30 at 8 tries each, and some shots still belong on a real set.\n\nOvers grew out of the process 100 Creatives, the agency Abhi Chawla founded, used to make hundreds of photos a week for hundreds of brands, and Abhi's own businesses make their images with it today. Clients review through one HTML file, and their decisions come back into Overs. It makes stills only and writes a motion prompt per photo for Seedance or Veo.\n\nOvers is a sister product to AI Film Contests, from the same founder. [Try Overs free at www.overs.studio](https://www.overs.studio) and put a real stills number in your next quote."
      }
    ],
    "faqs": [
      {
        "q": "How much should I charge for an AI commercial?",
        "a": "Charge for your time, your judgment and the usage the brand buys. Work out your model fees first, because they are small and easy to prove, then add the days of directing, reviewing, editing and sound at your day rate, plus a usage fee tied to media, territory and term. A spot that took 40 video generations to get 12 keepers took the same directing time whether the renders cost $10 or $100."
      },
      {
        "q": "How much does it cost to generate a 30-second AI commercial?",
        "a": "In model fees, tens of dollars. At September 24, 2026 prices, a hypothetical 12-shot spot with a still first frame per shot, ten extra stills, 8 tries per usable still and three video tries of about five seconds per shot costs about $32 on Nano Banana 2 and Kling 3.0, or about $109 on GPT Image 2 and Veo 3.1 at 1080p with audio. The time to direct, review, edit and finish the spot costs far more than the generations."
      },
      {
        "q": "Should model fees be billed separately?",
        "a": "It is cleaner to estimate them, cap them and bill them at cost with receipts, or to build them into a fixed fee if the client prefers one number. Either way, write the estimate down. Model fees change with the tool, the resolution and the number of tries, so a cap protects you from a shot that takes three times the tries you planned."
      },
      {
        "q": "Do I need to tell the client I used AI?",
        "a": "Yes. The UK's IPA and ISBA principles for generative AI in advertising say neither agency nor client should include AI-generated content in materials given to the other without the other's agreement. Name the tools and what they made in the proposal and the contract, and agree who labels the finished ads. For consumers, the IAB's 2026 framework asks for disclosure when AI materially affects authenticity, identity or representation in a way that could mislead."
      }
    ],
    "related": [
      {
        "href": "/cinematic-ads",
        "label": "Cinematic AI advertising: tools, competitions and studios"
      },
      {
        "href": "/contests/atlanta-ai-ad-fest-2026",
        "label": "Atlanta AI Ad Fest: $2,500 in cash prizes, closes October 25, 2026"
      },
      {
        "href": "/contests/hollywood-ai-short-film-awards-2027",
        "label": "Hollywood AI Short Film Awards: Best Branded Commercial, closes January 11, 2027"
      },
      {
        "href": "/categories/commercial",
        "label": "Every open AI commercial contest"
      }
    ]
  },

}
