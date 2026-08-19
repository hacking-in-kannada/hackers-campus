# Hackers Campus UI/UX Specification

## 1. Learn Page

**Navigation:** Roadmap | Paths | Modules | Walkthroughs

### Roadmap
- Dark grid/circuit-style background.
- Connected nodes with progress indicators instead of a plain vertical line.
- Cards show progress %, completed status, number of modules, estimated time, and a "Continue" button on hover.

### Paths
- Look like career/skill tracks rather than ordinary course cards (e.g., Penetration Tester, SOC Analyst, Web Pentester).
- Show module count, lab count, difficulty, and progress.

### Modules
- Card-library layout for individual skills.
- Category filtering (e.g., Linux, Windows, AD) is essential as the platform grows.

### Walkthroughs
- Guided-practical section.
- Clear distinction: Roadmap (order), Paths (career track), Modules (specific topic), Walkthroughs (guided practical exercises).

### Inside a Module
- Three clear levels: Learn → Module → Room.
- Module overview page: Difficulty, duration, room count, XP, and overall progress in the hero.
- Two-column layout below the hero: Module Content (list of rooms) and Module Info.
- Visual states: Completed (green check), In Progress (progress circle), Not Started (empty circle), Locked (prerequisite required).

### Room Page
- Simpler header: Title, short description, tags, stats, Save, and Start/Continue.

### Inside the Room
- Learning workspace with a persistent left task sidebar for easy navigation.
- Dedicated "Lab Environment" panel for machine controls (Status, Target IP, Time Left, Extend, Stop).
- "Start Practical Lab" prompt for isolated environments.

### Questions
- Support multiple styles: Knowledge Check (multiple choice, text) and Practical Challenge (flag submission).

---

## 2. Practice Page

**Structure:** Dashboard | Learn | Practice | CTF

### Overview
- Large dark hero with a cleaner progress area showing Challenges Completed (Easy, Medium, Hard).
- Search and filters (Category, Difficulty, Status, Sort).

### Challenge Sections
- **Quick Challenges:** Short exercises testing one specific skill.
- **Recommended for You:** Based on learning progress.
- **Hard Challenges:** Multi-stage challenges testing combinations of skills.

### Inside the Challenge
- Compact Lab Control Center (Attack Machine & Target Machine status, IP, time left).
- Scenario description and Objectives checklist.
- Collapsible tasks, visually distinct from Learn rooms.

---

## 3. Profile & Settings

### Profile Navigation
Overview | Completed | Skills | Badges | Certificates | Activity

- **Profile Dropdown:** Profile, Manage Account, Dark Mode, Sound Effects, Badges, Log Out.
- **Header:** Three-column structure (Avatar/Info, Global Rank/Badges, Level/XP). Emphasize learning and practical achievement over social features.

### Profile Tabs
- **Overview:** Dashboard showing learning progress, practice progress, recent achievements, and recent activity.
- **Completed:** List of completed content with dates and XP earned.
- **Skills:** Radar chart using cybersecurity domains (Web Security, Network, Active Directory, Linux, Forensics, Cloud Security) based on completed content.
- **Badges:** Earned and locked badges with progress indicators.
- **Certificates:** Platform-issued certificates.
- **Activity:** GitHub-style yearly heatmap counting meaningful activities.

### Manage Account
- **Profile:** Change photo, display name, username, bio, country.
- **Security:** Email, Password, 2FA (Authenticator App), Active Sessions.
- **Notifications:** Learning reminders, challenge updates, new modules/labs, achievements, security alerts.
- **Privacy:** Toggles for public profile visibility (completed content, badges, activity, skills, rank).
- **Preferences:** Language, Default Lab Connection (Browser vs. VPN/Local), Timezone.
- **Danger Zone:** Delete Account.

---

## 4. Admin Panel

### Main Layout
- Fixed left sidebar: Dashboard, Content (Rooms, Challenges, Modules, Paths, Walkthroughs), Lab Management (Machines, Images, Sessions), Users, Badges, Certificates, Analytics, Settings.

### Challenge Builder (Multi-step)
1. **Basics:** Title, slug, description, category, difficulty, time, type, images, tags.
2. **Content:** Scenario title, introduction (rich text), learning objectives, prerequisites, skills tested.
3. **Task Builder:** Drag-and-drop tasks, configure unlock rules and completion criteria.
4. **Lab Environment:** Docker/VM/Network, attacker machine specs, target machine specs, network configuration, isolation & reset policies.
5. **Questions:** Text, multiple-choice, flag, hints with XP costs.
6. **Scoring:** Base XP, task XP, completion bonuses, difficulty multipliers, badge rewards.
7. **Access:** Visibility, free/premium, prerequisites, schedule, write-up rules.
8. **Preview:** Test lab instance before publishing.
9. **Publish:** Checklist and version control.

### Content Engine
- A single reusable room/challenge engine underneath for modules, paths, walkthroughs, practice challenges, and CTF challenges, managed through different settings and presentation layers.
