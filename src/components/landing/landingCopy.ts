/** All landing copy in one reviewable file. Concrete, no fluff. */

export const COPY = {
  nav: { start: 'Start building', links: [['team', 'Team'], ['flow', 'How it works'], ['workspace', 'Workspace'], ['honest', 'Honesty']] as const },
  hero: {
    sub: 'You talk to a Manager. The Manager brings in specialist agents, and the team plans, builds, reviews, previews and ships your product.',
    primary: 'Start building',
    secondary: 'Explore the workspace',
  },
  showcase: {
    title: 'Watch one sentence become a ride app.',
    sub: 'A founder and an engineer build the same app: one stays in the chat, the other reads every file.',
  },
  team: {
    title: 'A Manager up front. Specialists when the work calls for them.',
    note: 'Specialists join only when the Manager routes work to them. Nobody idles in the chat.',
    list: [
      { id: 'frontend', name: 'Frontend', owns: 'Interface, layout and interaction.', says: 'Heatmap built. Cells fill as streaks land.' },
      { id: 'backend', name: 'Backend', owns: 'APIs, data and auth.', says: 'Streaks persist. The weekly rollup returns seven days.' },
      { id: 'ai-ml', name: 'AI / ML', owns: 'Model calls, prompts and retrieval.', says: 'Tip generator is wired to the streak data.' },
      { id: 'qa', name: 'QA', owns: 'Tests, edge cases and regressions.', says: 'An empty week shows a blank grid. Fix it before shipping?' },
      { id: 'devops', name: 'DevOps', owns: 'Build, infrastructure and deploy.', says: 'Build is green. The deploy target is ready.' },
    ],
  },
  flow: {
    title: 'From a sentence to a live URL.',
    steps: [
      { label: 'Describe', desc: 'Say what you want in plain language. No tickets, no specs.', art: '"Client portal: invoices, files, messages"' },
      { label: 'Plan', desc: 'The Manager turns it into steps, specialists and scope. You approve it.', art: '5 steps · Frontend, Backend, QA' },
      { label: 'Build', desc: 'Specialists work in parallel and narrate in chat. If one needs a decision, the build pauses for you.', art: 'FE 70% · BE 45% · QA 20%' },
      { label: 'Ship', desc: 'Preview it, read the code, commit to GitHub and deploy to a URL.', art: 'a3f9c1 · portal-v2.shipbuds.app' },
    ],
    pause: 'Pauses only if it needs you',
  },
  workspace: {
    title: 'Everything stays in one workspace.',
    tabs: [
      { id: 'preview', label: 'Preview', desc: 'Desktop, tablet and mobile views update as the team builds.' },
      { id: 'canvas', label: 'Canvas', desc: 'Turn a screenshot into editable regions. Frontend keeps the code in sync.' },
      { id: 'ship', label: 'Ship', desc: 'Commit, push and deploy. Simulated in this build, so you can review the whole path.' },
    ],
  },
  honest: {
    title: 'What this build does, and what it does not.',
    items: [
      { t: 'State stays in this browser', d: 'Projects, conversations, builds and previews are saved in localStorage. There is no account server.' },
      { t: 'Integrations are simulated', d: 'GitHub and Deploy are labelled simulated wherever they appear. No real account is touched.' },
      { t: 'External media opens outside', d: 'Third-party media opens in a new tab. Nothing is embedded or scraped.' },
      { t: 'No hidden model calls', d: 'This client makes no model, backend or sandbox calls. Replies are scripted.' },
    ],
    nonClaims: 'No SOC 2. No encryption guarantees. No zero-retention promise. Not implemented, so not claimed.',
  },
  final: { title: 'Your next product starts with a conversation.', primary: 'Start building', secondary: 'Explore the workspace' },
  footer: { brand: 'Shipbuds', by: 'Pranav Jha', credit: 'Faces by BoopFace, CX ArtLab, MIT.' },
} as const
