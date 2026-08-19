# Hackers Campus — Platform Architecture & Updates Log

> **Context & Architecture Reference Document**  
> *Last Updated: August 2026*

---

## 🚀 Overview & Design Vision
Hackers Campus has been upgraded into a modern, professional, standard TryHackMe-style cybersecurity education platform featuring a dark navy palette (`#090E17`, `#0E1624`, `#111A28`), vibrant emerald accenting (`#22C55E`), unified modern typography (`Inter` and `JetBrains Mono`), segmented visual progress meters, and dedicated interactive room workspaces.

---

## 🛠️ Key Platform Features & Modules

### 1. 🎯 Practice & Target Challenges (`/practice`)
- **Visual Progress Hero HUD**: Segmented completion meter tracking solves across tiers (e.g. *15 / 523 Challenges*), Easy/Medium/Hard badges, and 3D wireframe cyber vector art.
- **Featured Target Banner**: Spotlight card for AI Threat Modelling & exploitation labs with live AttackBox launcher.
- **Interactive Search & Multi-Filter System**: Filter by Type, Sort by, Difficulty, Status, and Subscription.
- **Challenge Cards**: Signal strength difficulty bars, solver counts, XP rewards, room avatars, and favorite bookmark toggles.

### 2. 🎮 Interactive Room & Challenge Workspaces (`/practice/[slug]` & `/learn/rooms/[slug]`)
- **Full TryHackMe Header Bar** (`RoomHeader.tsx`):
  - Breadcrumb navigation (`Practice > [Challenge]` or `Learn > [Module] > [Room]`).
  - Target machine status HUD (IP, hostname, state, duration).
  - Action Toolbar: `Start AttackBox`, `Save Room`, `Recommend` counter, `Connectivity` lab profile, `Share your achievement`, and `Options ▾`.
  - Full-width lime green progress bar (`Room completed: XX%`).
- **Multi-View Tabs**:
  - `📋 Tasks`: Interactive step-by-step accordion with command copy boxes, "You'll need to..." checklist cards, "Why you're doing this" collapsible tips, answer input fields `___{______}`, and instant **Check** feedback buttons with +XP rewards.
  - `📈 Chart` (`RoomChartView.tsx`): Real-time solve curve line chart over time.
  - `🏆 Scoreboard` (`RoomScoreboardView.tsx`): Ranked leaderboard with user avatars, solve durations, and XP.
  - `✍️ Write-ups` (`RoomWriteupsView.tsx`): Community solutions and verified write-ups.

### 3. 📚 Learning Center — Paths & Modules
- **Learning Paths** (`/learn/paths` & `/learn`):
  - Cyber compass hero HUD with career track filters (`Red Team`, `Blue Team`, `Cloud`, `Web`).
  - Featured *Junior Penetration Tester* career path hero.
  - 8 career pathway cards with segmented stage meters and prerequisite details.
- **Modules Library** (`/learn/modules`):
  - 3D matrix cube hero HUD with category filter chips (`Active Directory`, `Web Security`, `Linux Hardening`, etc.).
  - 12 modular room curriculum cards with estimated duration and skill badges.
- **Module Overview (Inside Module)** (`/learn/modules/[slug]`):
  - Dark hero with custom shattered 3D vector logo (e.g. Windows/Active Directory).
  - 2-column layout: Ordered room list with blue/green circular completion checkmarks + link icons.
  - Sidebar with *Next Steps* and *What are modules?* contextual cards.
- **Roadmap Overview** (`/learn/roadmap`):
  - Stage-by-stage learning progression roadmap.

### 4. 👤 User Profile & Credentials (`/profile`)
- **Profile Command Hero HUD**:
  - Avatar with level ring, VIP Pro badge, `@pavanreddyx7`, display name, bio, location, join date.
  - Platform rank card (`#1,284` Top 1%) and 7-day streak indicator.
  - 32-notch segmented visual XP progress bar (`2,450 / 3,000 XP` to next level).
- **Profile Tabs**:
  - `Overview`: Key metrics, recent solve history, dominant domain competency preview.
  - `Completed Solves`: Searchable, filterable activity log table.
  - `Skills Matrix`: Multi-axis spider radar chart + individual skill percentage mastery bars.
  - `Badges`: Tiered badge matrix (`Legendary`, `Epic`, `Rare`) with unlocked/locked filtering.
  - `Certificates`: Verified credentials with modal viewer, PDF download, and credential sharing.
  - `Activity Heatmap`: 365-day color-coded activity matrix.

---

## 🎨 Design System & Typography

- **Global Typography**:
  - Primary Sans: `Inter`, system-ui, sans-serif
  - Monospace: `JetBrains Mono`, `Fira Code`, monospace
  - Configured globally in `apps/web/app/globals.css` and `apps/web/tailwind.config.ts`.
- **Color Palette**:
  - Background Canvas: `#090E17`
  - Panels: `#111A28` / `#0E1624`
  - Borders: `#1E293B` / `#1C273A`
  - Primary Accent: `#22C55E` (Emerald Green)
  - Secondary Accent: `#38BDF8` (Sky Blue)
  - Muted Text: `#94A3B8` / `#64748B`

---

## 📁 File Structure Reference

```
apps/web/
├── app/
│   ├── layout.tsx                                 # Root layout with Navbar & Footer
│   ├── globals.css                                # Global design tokens & Inter font
│   ├── page.tsx                                   # Mission Control Dashboard
│   ├── learn/
│   │   ├── layout.tsx                             # Learn sub-navigation layout
│   │   ├── page.tsx                               # Direct render of Learning Paths
│   │   ├── paths/page.tsx                         # Career Learning Paths hub
│   │   ├── modules/
│   │   │   ├── page.tsx                           # Modules curriculum catalog
│   │   │   ├── [slug]/page.tsx                    # Module Overview (Inside Module)
│   │   │   └── active-directory-security/page.tsx # Forwarder to ModuleDetailPage
│   │   ├── rooms/
│   │   │   ├── [slug]/page.tsx                    # TryHackMe Room Workspace (Inside Room)
│   │   │   └── kerberos-fundamentals/page.tsx     # Forwarder to Room Workspace
│   │   └── roadmap/page.tsx                       # Progression Roadmap
│   ├── practice/
│   │   ├── page.tsx                               # Practice / Challenges hub
│   │   └── [slug]/page.tsx                        # Practice Room Workspace
│   ├── profile/page.tsx                           # User Profile with Skills Radar & Certs
│   └── settings/page.tsx                          # Account & Security Settings
├── components/
│   ├── layout/Navbar.tsx                          # Global top navigation bar
│   ├── layout/Footer.tsx                          # Platform footer
│   ├── practice/
│   │   ├── PracticeHero.tsx                       # Practice segmented progress HUD
│   │   ├── RecommendedTargetBanner.tsx            # Featured AI room banner
│   │   └── ChallengeCard.tsx                      # Practice challenge cards
│   └── room/
│       ├── RoomHeader.tsx                         # TryHackMe Room Header with AttackBox
│       ├── TaskAccordion.tsx                      # Task Accordion with flag check
│       ├── RoomChartView.tsx                      # Solve curve line chart
│       └── RoomScoreboardView.tsx                 # Scoreboard & Write-ups tabs
```
