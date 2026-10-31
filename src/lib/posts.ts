export interface PostSection {
  heading: string
  paragraphs: string[]
}

export interface PostSource {
  label: string
  href: string
}

export interface PostItem {
  slug: string
  title: string
  excerpt: string
  image?: string
  publishedAt: string
  updatedAt: string
  readingTime: string
  sourceUrl: string
  sourceLinks?: PostSource[]
  sections: PostSection[]
  words: string[]
}

export const posts: PostItem[] = [
  {
    slug: 'how-a-tech-company-accidentally-becomes-political',
    title: 'How a Tech Company Accidentally Becomes Political',
    excerpt: 'Facebook’s growth turned product decisions into questions of power, governance, and accountability across borders.',
    publishedAt: '2026-09-13',
    updatedAt: '2026-09-13',
    readingTime: '8 min read',
    sourceUrl: 'https://uhdam.medium.com/how-a-tech-company-accidentally-becomes-political-9a2cffd10d9a?sk=bb4b99f52d24167486589e3741cbc81b',
    sourceLinks: [
      { label: 'Medium', href: 'https://uhdam.medium.com/how-a-tech-company-accidentally-becomes-political-9a2cffd10d9a?sk=bb4b99f52d24167486589e3741cbc81b' },
      { label: 'Substack', href: 'https://uhwriter.substack.com/p/when-a-company-starts-acting-like' },
    ],
    sections: [
      {
        heading: 'The product came first',
        paragraphs: [
          'There’s a small moment near the beginning of Sarah Wynn-Williams’s time at Facebook that I kept thinking about after finishing Careless People.',
          'She spends months trying to convince Facebook that it needs someone thinking about international politics. She eventually gets hired into public policy, and her new boss, Marne Levine, tells her: “I’m still not even sure this is a job.”',
          'Facebook already had hundreds of millions of users at the time. Wynn-Williams joins believing Facebook and governments will eventually have to work out the “rules of the road” around elections, privacy, speech, taxation, and requests from law enforcement.',
          'Mark Zuckerberg, according to her account, isn’t particularly interested in any of this at first. When the prime minister of New Zealand visits Facebook, she is surprised to discover that Zuckerberg has little interest in meeting him. His focus is the product.',
          'A few years later, Facebook employees are preparing Zuckerberg for meetings with presidents. The company is fighting governments over WhatsApp and trying to work out what it would take to operate in China. At APEC in 2016, Zuckerberg is sitting between presidents and prime ministers.',
          'It’s an odd progression when you put the two moments next to each other. Facebook grew large enough that politics became part of running the product.',
        ],
      },
      {
        heading: 'Politics arrived anyway',
        paragraphs: [
          'Politics feels fairly remote when you’re running an early technology company. You’re trying to get people to use what you’ve built. You’re fixing things. You’re thinking about competitors and growth. Government affairs sound like the sort of department a bank might have.',
          'Then enough people start using your product and the digital boundaries start getting messy. Friends and families rely on it to communicate. News travels through it. Businesses use it to find customers. Activists organise there. Politicians start campaigning on it. A decision made inside the product team can suddenly have consequences far beyond the product.',
          'Governments began asking Facebook for user information while courts issued orders involving content and accounts. Each country brought its own laws and ideas about acceptable speech, which meant Facebook could no longer avoid making political choices simply by claiming to be a technology company. It needed people who could decide how to respond and when to push back.',
          'That pressure gradually changed the company. Facebook expanded its policy operations while also developing relationships with political leaders. What began as a way of responding to governments became a more complicated relationship because governments were increasingly dealing with a company that had direct access to huge parts of their population.',
          'After WhatsApp was blocked in Brazil, Wynn-Williams writes that Zuckerberg used Facebook to ask Brazilians to “make your voice heard” and contact their government. The block had come from the court rather than the president, which reportedly left the president’s office dealing with complaints about a decision it had not made.',
          'The interesting part is what Zuckerberg was able to do in the first place. Facebook could disagree with something happening inside a country, speak directly to millions of people there, and encourage them to pressure their own political institutions. For governments, building that kind of relationship with people takes years.',
        ],
      },
      {
        heading: 'The power is different',
        paragraphs: [
          'Comparing Facebook with a government only works if you’re careful about what kind of power is being referred to. Facebook’s influence came from systems sitting between people and the information trying to reach them.',
          'A politician can hold a press conference and a government agency can release an important statement, but none of that guarantees attention. Platforms like Facebook increasingly helped determine which stories travelled, which posts gathered views, or which information disappeared into the feed.',
          'That influence came from the way the product worked. Content that generated more reactions tended to travel further, and people quickly learned to adapt. Publishers changed the kinds of headlines they wrote. Politicians learned which messages performed well. Activists and campaigners figured out what the platform rewarded.',
          'Changing a recommendation system might be discussed internally as an update to ranking or engagement while, outside the company, it can affect what millions of people end up seeing and talking about.',
          'Countries were making decisions about whether Facebook could operate within their borders. Facebook executives were meeting heads of state and asking governments to intervene on the company’s behalf. Meanwhile, millions of people increasingly relied on Facebook and WhatsApp for everyday communication and business, which meant blocking the services could have consequences well beyond the company itself.',
          'By that point, describing Facebook as simply another website no longer captured what it had become.',
        ],
      },
      {
        heading: 'Someone still has to decide the rules',
        paragraphs: [
          'Once a privately owned space contains a few billion people, it develops a governance problem of its own. Wynn-Williams describes some of the work that went into Facebook’s early Community Standards. Teams inside the company had already been making decisions about acceptable content. Eventually Facebook needed a clearer set of rules and a way to apply them consistently.',
          'Those rules covered questions that are surprisingly difficult once you start trying to answer them for the entire world. What qualifies as hate speech in one country might be treated as political speech somewhere else. A group considered legitimate by one government can be considered a terrorist organisation by another. Something can violate local law while remaining acceptable under Facebook’s own policies.',
          'Facebook had to choose. Over time, platforms have to build systems that write rules, remove content, suspend accounts, and create ways for users to appeal decisions. Calling this a legal system would be a stretch, but it is a form of private rulemaking over a space where a huge amount of public life now happens.',
          'In 2025, Meta announced that it would end third-party fact checking in the United States, move toward Community Notes, loosen restrictions around content, and change how political material appeared across its services. You can agree with those decisions or hate them. Either way, an internal decision at one company altered the rules of spaces used by hundreds of millions of people.',
          'Facebook owns the platform, so no election was required to make this decision. A social network is easy to treat as an ordinary consumer product when people use it to post holiday photos. The description fits less comfortably once the same network becomes part of elections, political movements, news distribution, or communication during a crisis.',
          'Facebook ended up governing a space it had created.',
        ],
      },
      {
        heading: 'I don’t think we have a clean answer',
        paragraphs: [
          'Governments have spent centuries accumulating restraints on their own power: constitutions, courts, elections. They do not always work particularly well, but the basic idea is familiar. Power needs some way of being challenged.',
          'Companies have restraints too. Regulators can intervene. Courts can rule against them. Boards and shareholders have authority. Employees sometimes push back from inside. Journalists expose things companies keep private. Facebook discovered repeatedly that governments still have teeth.',
          'The part I find unresolved is what happens in the space between those interventions. If someone dislikes a government’s decisions, there are political mechanisms available for that. But if they dislike Instagram’s rules, they can stop using Instagram. That becomes harder when WhatsApp is where your family talks, Facebook is how customers find your small business, or your network sits on Instagram.',
          'The company went from barely knowing whether international public policy deserved a full-time employee to having its executives sit across from presidents and argue about elections, censorship, internet access, and national laws. And that happened quickly.',
          'Facebook probably will not be the last company to go through it. AI companies are the obvious ones to watch now. If AI assistants become one of the main ways people search for information, study, and work, the companies operating those systems will inherit decisions that currently look like technical or product questions.',
          'Which sources should an assistant trust? What should it refuse to answer? Should its behaviour change when it crosses a border? What happens when a government wants access to it or asks the company to change what it says?',
          'I don’t know what the right governance model for that looks like, but Facebook’s history suggests that waiting until these questions feel urgent may already be too late. The scale came first. The politics followed.',
        ],
      },
    ],
    words: [
      'facebook', 'platform', 'government', 'politics', 'power', 'governance', 'ai',
      'product', 'policy', 'community standards', 'whatsapp', 'meta', 'public life',
    ],
  },
  {
    slug: 'ugly-truth-luxury-brands-ai-content',
    title: "Ugly Truth Luxury Brands Won't Say About AI Content",
    excerpt: 'Luxury brands care less about the AI-versus-traditional-tools debate than they do about standards, taste, and brand codes.',
    publishedAt: '2026-01-17',
    updatedAt: '2026-01-17',
    readingTime: '3 min read',
    sourceUrl: 'https://medium.com/@uhdam/ugly-truth-luxury-brands-wont-say-about-ai-content-01f5cbb1b286',
    sections: [
      {
        heading: 'The debate is louder outside the brand room',
        paragraphs: [
          'AI content invites an endless argument about authenticity, effort, and whether a prompt can carry the same weight as traditional craft. Those questions matter to the people making the work. Inside a brand, the decision is usually more direct: does the result meet the standard?',
          'A luxury brief is built around mood, precision, and the codes that make a brand recognisable. The brief is not really about proving loyalty to a particular tool. It is about protecting the feeling the customer is meant to have.',
        ],
      },
      {
        heading: 'Luxury optimises for finish, not process',
        paragraphs: [
          'Luxury is not sold through a production timeline. It is sold through control: the confidence that every visual, word, and detail belongs to the same world. When an AI-assisted image achieves that level of control, the toolchain becomes secondary to the finish.',
          'That does not mean craft disappears. It means the invisible parts of craft become more important. A background can be generated quickly, but knowing whether it weakens the mood, misses the brand codes, or feels generic is still a human judgment.',
        ],
      },
      {
        heading: 'More output raises the bar for taste',
        paragraphs: [
          'AI makes variations cheap. That is useful only when someone can recognise the one worth keeping. More options do not create a stronger campaign by themselves; they create more opportunities to choose something forgettable.',
          'The people responsible for a brand still need to set the standard, reject weak work, and hold the final output together. AI can make a poor decision faster just as easily as it can accelerate a good one.',
        ],
      },
      {
        heading: 'Tools change. The responsibility does not.',
        paragraphs: [
          'The most useful way to think about AI in luxury is as another production tool. It can expand what a small team can explore, but it cannot supply taste, accountability, or an understanding of why an image belongs to a particular brand.',
          'The lasting question is not whether a piece was made with AI. It is whether the people responsible for it protected the output, the feeling, and the codes that make the brand worth believing in.',
        ],
      },
    ],
    words: [
      'luxury', 'brand', 'standard', 'taste', 'output', 'control', 'feeling', 'finish',
      'process', 'tool', 'creative', 'production', 'guardian', 'judgment', 'speed',
      'quality', 'emotional', 'code', 'belief', 'memory', 'traditional', 'generated',
    ],
  },
  {
    slug: 'quiet-death-saas-pricing-power',
    title: 'The Quiet Death of SaaS Pricing Power',
    excerpt: 'AI is not only changing what SaaS products can do. It is changing the leverage customers bring to every renewal conversation.',
    publishedAt: '2026-07-16',
    updatedAt: '2026-07-16',
    readingTime: '5 min read',
    sourceUrl: 'https://medium.com/@uhdam/the-quiet-death-of-saas-pricing-power-88c2ee33f7a0',
    sections: [
      {
        heading: 'The new question at renewal',
        paragraphs: [
          'The old SaaS renewal conversation was mostly about value, switching costs, and the inconvenience of changing a workflow that already works. AI has introduced a sharper question: how difficult would it be to build the essential part of this product ourselves?',
          'The answer does not need to be “easy” for pricing power to change. A credible internal alternative gives buyers leverage. It turns a familiar annual increase into a negotiation about whether the product is truly worth the premium.',
        ],
      },
      {
        heading: 'Feature velocity is not a moat',
        paragraphs: [
          'AI lowers the cost of turning a reasonable product idea into a working feature set. Incumbents benefit from that speed, but so do challengers and internal teams. Shipping faster is useful; it is not the same thing as becoming harder to replace.',
          'The vulnerable products are not necessarily bad products. Many have real customers and useful workflows. The problem is that some of their value was always a mix of product quality and the friction of doing anything else. As the friction falls, the second part weakens.',
        ],
      },
      {
        heading: 'Seat-based revenue has a hidden dependency',
        paragraphs: [
          'A large part of SaaS revenue is tied to the number of people at a customer who need access. When customers automate work or reduce headcount, fewer people can mean fewer seats. That is not a sales objection a better account manager can solve; it is a change in the customer’s operating model.',
          'Founders should look beyond historical churn curves. If the economics of the customer change, the assumptions underneath expansion and renewal can change with them.',
        ],
      },
      {
        heading: 'Treat it as a repricing problem',
        paragraphs: [
          'The useful response is not panic or a generic AI feature checklist. It is an honest review of where the product creates durable value: proprietary data, trusted workflow ownership, domain expertise, reliability, or outcomes that are difficult to reproduce.',
          'A business that relies on inertia should assume inertia has an expiry date. A business that solves a painful, specific problem better than an internal team can should make that advantage obvious in the product, the pricing, and every customer conversation.',
        ],
      },
    ],
    words: [
      'saas', 'pricing', 'renewal', 'margin', 'moat', 'automation', 'ai', 'product',
      'software', 'founder', 'customer', 'seat', 'churn', 'retention', 'strategy',
      'competition', 'workflow', 'value', 'internal', 'build', 'leverage',
    ],
  },
]

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug)
}
