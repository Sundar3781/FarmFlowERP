# Farm Management ERP System - Design Guidelines

## Design Approach: Modern Enterprise System

**Selected Framework**: Inspired by Linear and Notion's clean productivity aesthetics combined with Material Design's enterprise patterns, creating a modern farm management interface that balances data density with visual appeal.

**Core Principle**: Information-first design with strategic visual enhancements. Every element serves farm operational efficiency while maintaining professional polish.

---

## Typography System

**Primary Font**: Inter (Google Fonts)
- Headlines/Module Titles: 24px/600 weight
- Section Headers: 18px/600 weight  
- Body Text: 14px/400 weight
- Table Data/Forms: 13px/400 weight
- Labels/Captions: 12px/500 weight

**Secondary Font**: Roboto Mono (for numerical data, IDs, dates)
- Numerical Data: 14px/500 weight
- Code/IDs: 12px/400 weight

---

## Layout & Spacing System

**Tailwind Units**: Use spacing scale of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-4 to p-6
- Section gaps: gap-4 to gap-8
- Card spacing: p-6 to p-8
- Form field spacing: gap-4
- Module containers: px-6 py-8

**Grid System**:
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Module content: grid-cols-1 lg:grid-cols-3 (sidebar + main content)
- Data tables: full-width with horizontal scroll on mobile
- Form layouts: max-w-4xl with two-column on desktop

---

## Component Library

### Navigation Architecture

**Top Bar** (h-16, fixed):
- Farm logo/name (left)
- Global search bar (center, max-w-md)
- Language toggle (EN/TA), notifications, user profile (right)
- Subtle bottom border

**Sidebar** (w-64, fixed left):
- Module navigation with icons (Dashboard, Attendance, Cultivation, Inventory, Equipment, Livestock, Finance)
- Active state with left border accent
- Collapsible sub-menus for nested features
- Role-based visibility controls

### Dashboard Components

**KPI Cards** (grid layout):
- Large metric number (32px/700)
- Descriptive label below
- Small trend indicator (arrow + percentage)
- Icon in top-right corner
- Subtle gradient background per module
- Rounded corners (rounded-lg)

**Module Cards**:
- Quick action cards with icon, title, description
- Hover state with subtle elevation
- Direct navigation to module sections

**Data Visualization**:
- Bar charts for cost comparisons
- Line graphs for trends (milk yield, attendance)
- Pie charts for inventory distribution
- Compact table summaries with "View All" links

### Forms & Inputs

**Input Fields**:
- Standard height h-10
- Border with focus ring
- Label above (12px/500, mb-2)
- Placeholder text in muted tone
- Helper text below when needed
- Error states with red border + message

**Form Layouts**:
- Two-column for related fields (Name + ID, Date + Time)
- Single column for long text areas
- Grouped sections with subtle dividers
- Action buttons right-aligned at bottom

**Dropdowns/Selects**:
- Custom styled to match input fields
- Search functionality for long lists (varieties, animals)
- Multi-select with tag chips for categories

### Data Tables

**Table Structure**:
- Zebra striping (subtle alternate row background)
- Fixed header on scroll
- Sortable columns (arrow indicators)
- Row actions (edit, delete) in last column
- Pagination at bottom (10/20/50 rows options)
- Responsive: cards on mobile, table on desktop

**Table Features**:
- Bulk selection checkboxes
- Filter dropdowns per column
- Export button (CSV/Excel) in top-right
- Search within table data

### Module-Specific Components

**Attendance Board**:
- Grid of employee cards with photo placeholder
- Status badges (Present/Absent/Late)
- Biometric capture modal with camera simulation
- Daily/Weekly/Monthly view toggle

**Plot Management**:
- Plot cards with thumbnail image placeholders
- Key metrics overlay (area, days, cost)
- Tabbed details view (Overview/Costs/Activities)
- Timeline view for activities

**Inventory Cards**:
- Stock level progress bars
- Alert badges for low stock (red)
- Quick action buttons (Add Stock, Use Stock)
- Category filtering sidebar

**Livestock Registry**:
- Animal cards with image placeholder
- Health status indicator (green/yellow/red dot)
- Expandable details panel
- Milk yield entry quick form

**Financial Module**:
- Chart of accounts tree view
- Transaction table with debit/credit columns
- Report generation forms with date pickers
- Balance sheet with collapsible sections

### Modals & Overlays

**Modal Design**:
- Centered with backdrop blur
- Max-width based on content (max-w-2xl standard)
- Header with title + close button
- Content area with scrolling
- Footer with Cancel/Submit buttons
- Slide-in animation

**Toast Notifications**:
- Top-right positioning
- Success (green), Error (red), Info (blue), Warning (yellow)
- Auto-dismiss after 4 seconds
- Progress bar indicator

### Buttons & Actions

**Primary Actions**: Solid background, white text, rounded-md, px-6 py-2
**Secondary Actions**: Outline style, border-2
**Destructive Actions**: Red variant for delete operations
**Icon Buttons**: Square (h-10 w-10) with centered icon

**Button Groups**: 
- Grouped with dividing border
- Toggle states for view switching (Individual/Consolidated)

---

## Visual Elements

**Icons**: Heroicons (via CDN)
- 20px for inline/buttons
- 24px for cards/headers
- Consistent outline style throughout

**Shadows**:
- Cards: shadow-sm
- Elevated elements: shadow-md
- Modals: shadow-xl
- No shadows on flat data tables

**Borders**:
- Subtle borders (border-gray-200 equivalent)
- Rounded corners: rounded-lg for cards, rounded-md for inputs
- Dividers between sections (border-t)

**Gradients** (module differentiation):
- Dashboard: Subtle blue-purple gradient
- Cultivation: Green-teal gradient
- Livestock: Orange-amber gradient
- Finance: Indigo-blue gradient
- Applied as background with low opacity overlay

---

## Responsive Behavior

**Mobile** (< 768px):
- Hamburger menu for sidebar
- Stacked KPI cards (single column)
- Tables convert to card lists
- Bottom navigation for key actions

**Tablet** (768px - 1024px):
- 2-column KPI grid
- Condensed sidebar with icons only
- Tables with horizontal scroll

**Desktop** (> 1024px):
- Full sidebar expanded
- 4-column KPI grid
- Multi-column forms
- Side-by-side data views

---

## Accessibility

- Focus indicators on all interactive elements
- ARIA labels for icon-only buttons
- Keyboard navigation support (Tab, Enter, Escape)
- Color contrast minimum 4.5:1
- Form validation with clear error messages
- Screen reader announcements for dynamic content

---

## Images

No hero images required for this application. Use placeholder images for:
- Employee profile photos (circular, 48px diameter)
- Livestock animal photos (rectangular cards, 200x150px)
- Plot/field thumbnails (landscape, 320x180px)

All placeholder images should have subtle border and muted background with centered icon indicator.