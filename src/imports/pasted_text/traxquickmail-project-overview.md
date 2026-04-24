🧭 Project Overview

Design a complete, end-to-end SaaS email marketing platform called TraxQuickMail. The product is a powerful, modern tool for marketers, growth teams, and businesses to create, automate, schedule, and analyse email campaigns. The design should feel like a premium B2B SaaS — confident, data-forward, and clean — inspired by the refined quality of tools like Linear, Notion, and Resend, but with its own bold identity.


🎯 Brand & Aesthetic Direction
Personality: Confident, fast, precise, intelligent
Tone: Professional but not corporate. Energetic but not playful.
Visual Style: Dark-mode-first with an electric accent system. Think deep navy/charcoal base #0D0F14, crisp whites for content, and a signature electric teal #00D4AA as the primary action color. Secondary accent: warm amber #F5A623 for alerts and highlights.
Typography:

Display / Headings: Clash Display or Cabinet Grotesk — geometric, bold
Body / UI: DM Sans or Geist — clean and highly legible
Monospace (for code/API snippets): JetBrains Mono

Logo Concept: "Trax" in bold display type + a stylised arrow/lightning bolt path suggesting speed and delivery.

🗂️ Screens to Design (Full Flow)
Design each screen in 1440px desktop + 375px mobile responsive variants.

1. 🏠 Dashboard (Home)

Top KPI cards: Total Sent, Open Rate, Click Rate, Unsubscribes, Revenue Attributed
Sparkline mini-charts on each card
Recent Campaigns table with status badges (Sent, Scheduled, Draft, Paused)
Audience growth chart (line graph, last 30/60/90 days toggle)
Quick-action floating button: "+ New Campaign"
Left sidebar nav with icons + labels: Dashboard, Campaigns, Automations, Audience, Templates, Scheduler, Analytics, Settings


2. 📧 Campaign Builder (3-step wizard)
Step 1 — Setup

Campaign name, subject line, preview text
From name + email selector (with verified sender domains)
Reply-to field
Tags/labels for organisation

Step 2 — Design

Drag-and-drop email builder canvas (block-based)
Left panel: Content blocks (Text, Image, Button, Divider, Social Links, Video Thumbnail, Countdown Timer, Dynamic Personalisation tokens)
Right panel: Style inspector (font, colour, spacing, border, background)
Top toolbar: Desktop/Mobile preview toggle, Undo/Redo, Send Test, Save Draft
Template picker drawer (slide-in from right)

Step 3 — Review & Send

Preview email on device mockup
Audience selector: Segment picker with subscriber count
Send options: Send Now / Schedule / A/B Test toggle
Pre-send checklist (subject line, spam score, broken links, unsubscribe link status)
Confirm & Launch CTA button


3. ⚡ Automation Builder (Visual Flow Editor)

Full-canvas drag-and-drop node editor (like a flowchart)
Node types:

Triggers: Subscribed to list, Opens email, Clicks link, Tag added, Date-based, Custom event
Actions: Send Email, Add Tag, Remove Tag, Update Contact Field, Notify Team, Wait/Delay, Split (A/B), Move to List
Conditions: If/Else branching, Filter by segment


Each node: colour-coded by type, collapsible detail panel
Mini-map in bottom-right corner
Sidebar: Automation name, status toggle (Active/Paused), stats (enrolled, completed, conversion rate)
Zoom in/out controls
Templates for common flows: Welcome Series, Abandoned Cart, Re-engagement, Drip Sequence


4. 📅 Scheduler / Calendar View

Full calendar (month/week/day toggle)
Campaign events shown as colour-coded pills on calendar dates
Right panel: Upcoming sends list with time, segment, and status
Click on a date → quick-schedule drawer slides in
Timezone selector at top right
"Best Time to Send" AI suggestion badge on time picker


5. 👥 Audience / Contacts

Contacts table: Avatar, Name, Email, Tags, List, Last Activity, Open Rate, Status
Inline filters + advanced filter builder (Add filter → field → operator → value)
Bulk actions bar (appears when rows selected): Add Tag, Move List, Export, Delete
Segment builder panel (slide-in): Create dynamic segments with condition rules (AND/OR logic)
Contact detail drawer (click a row): Full contact profile — activity timeline, email history, tags, custom fields, engagement score


6. 🎨 Template Library

Grid layout of email templates with live preview thumbnails
Filter by category: Welcome, Promotional, Transactional, Newsletter, Re-engagement, Event
Search bar
Each card: Template name, category badge, "Use Template" + "Preview" on hover
Blank template card as first option
"My Templates" tab vs "Gallery" tab


7. 📊 Analytics & Reports

Global stats overview: Sends, Deliveries, Opens, Clicks, Bounces, Unsubscribes (with trend vs previous period)
Campaign performance table: sortable columns, sparklines per row
Engagement funnel chart (Sent → Delivered → Opened → Clicked → Converted)
Heatmap: Email click map showing which links were clicked most
Geo map: Opens by country
Device breakdown: Donut chart (Desktop / Mobile / Tablet)
Time-of-day heatmap grid (when do users open emails)
Export report button (PDF / CSV)


8. ⚙️ Settings
Sub-pages:

Account — Name, timezone, language, avatar upload
Sending Domains — Add and verify custom sending domains + DKIM/SPF status indicators
API & Integrations — API key management, webhook URLs, integration cards (Zapier, Shopify, WordPress, HubSpot, Slack)
Team — Invite members, role management (Admin, Editor, Viewer), active sessions
Billing — Current plan, usage meter, invoice history, upgrade CTA
Notifications — Toggle notifications per event type


9. 🔑 Auth Screens

Sign Up — Email + password, Google OAuth, terms checkbox
Log In — Clean, minimal, brand-forward
Onboarding flow (3 steps): Import contacts → Connect sending domain → Create first campaign


🧩 Design System to Build
Create a full component library:
CategoryComponentsButtonsPrimary, Secondary, Ghost, Destructive, Icon-only, Loading stateInputsText, Email, Password, Textarea, Dropdown, Multi-select, Toggle, Checkbox, RadioCardsStat card, Campaign card, Template card, Contact cardBadgesStatus (Sent, Draft, Scheduled, Paused, Active), Tag badgeChartsLine, Bar, Donut, Funnel, HeatmapNavigationSidebar (collapsed + expanded), Top nav, Breadcrumbs, TabsModals & DrawersConfirmation modal, Side drawer (contact, template, schedule)Empty StatesNo campaigns, No contacts, No automations (with illustrated icons)NotificationsToast (success, error, warning, info), Banner alertsData TablesSortable headers, Row selection, Pagination, Bulk action bar

📐 Layout & Spacing System

Base unit: 4px
Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px
Border radius: 6px (inputs), 10px (cards), 16px (modals), 999px (badges/pills)
Shadows: Subtle layered box shadows for dark UI depth
Grid: 12-column, 24px gutter, 80px side margins (desktop)


🌗 Theme Variants
Design both:

Dark Mode (primary) — #0D0F14 base, #1A1D24 cards, #00D4AA accent
Light Mode (secondary) — #F7F8FA base, #FFFFFF cards, #007A63 accent


✅ Deliverables Expected

 All screens designed at 1440px (desktop) and 375px (mobile)
 Full design system / component library frame
 Auto-layout used throughout for responsive flexibility
 Prototype connections between key flows (Dashboard → Campaign Builder → Scheduler)
 Hover, Active, Focus, Disabled states for all interactive elements
 Realistic dummy data throughout (no Lorem Ipsum in final screens)
 Icons: Use Phosphor Icons or Lucide Icons (consistent set throughout)



Design Inspiration References: Linear (clean dashboard), Klaviyo (email marketing flows), Resend (developer aesthetic), Loops.so (modern email SaaS), Framer (drag-and-drop canvas)


Copy this entire prompt directly into your Figma AI plugin, a design brief doc, or share it with your designer. It covers every screen, component, and design decision needed to build TraxQuickMail end-to-end. Want me to also generate a visual UI mockup or a React prototype of any specific screen?