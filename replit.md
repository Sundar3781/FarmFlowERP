# Farm Management ERP System

## Project Overview

A comprehensive Farm Management ERP System designed to streamline all aspects of agricultural operations, from attendance tracking to financial management. Built with modern web technologies and professional-grade UI/UX.

## Tech Stack

- **Frontend**: React 18 + TypeScript, Vite
- **Backend**: Express.js + TypeScript
- **Styling**: Tailwind CSS + Shadcn UI components
- **State Management**: TanStack Query (React Query v5)
- **Routing**: Wouter
- **Data Storage**: In-memory storage (MemStorage)
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Form Validation**: React Hook Form + Zod

## Architecture

### Design System

- **Primary Font**: Inter (sans-serif) - Used for all UI text
- **Monospace Font**: Roboto Mono - Used for numerical data, IDs, dates
- **Color Scheme**: 
  - Primary: Green (#16a34a) - Agricultural theme
  - Sidebar: Neutral gray tones
  - Module-specific accents (purple for attendance, orange for inventory, etc.)
- **Component Library**: Shadcn UI with custom styling

### Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Shadcn UI components
│   │   │   ├── app-sidebar.tsx  # Main navigation sidebar
│   │   │   ├── kpi-card.tsx     # Dashboard KPI cards
│   │   │   └── language-toggle.tsx
│   │   ├── lib/
│   │   │   ├── auth-context.tsx      # Authentication context
│   │   │   ├── language-context.tsx  # Multi-language support
│   │   │   ├── queryClient.ts        # TanStack Query config
│   │   │   └── utils.ts
│   │   ├── pages/
│   │   │   ├── login.tsx             # Authentication page
│   │   │   ├── dashboard.tsx         # Executive dashboard
│   │   │   ├── attendance.tsx        # Attendance management
│   │   │   ├── cultivation.tsx       # Plot & crop management
│   │   │   ├── inventory.tsx         # Stock management
│   │   │   ├── equipment.tsx         # Equipment & vehicles
│   │   │   ├── livestock.tsx         # Animal management
│   │   │   └── finance.tsx           # Financial accounting
│   │   ├── App.tsx                   # Main app with routing
│   │   └── index.css                 # Global styles
├── server/
│   ├── index.ts                      # Express server
│   ├── routes.ts                     # API routes
│   └── storage.ts                    # In-memory storage
└── shared/
    └── schema.ts                     # Shared TypeScript schemas
```

## Features

### 1. User Authentication & Role-Based Access

- **Demo Accounts**:
  - Admin: `admin` / `admin` (Full access)
  - Manager: `manager` / `manager` (Most modules)
  - Operator: `user` / `user` (Limited access)
- **Role-based permissions** for module access
- **Session persistence** with localStorage

### 2. Executive Dashboard

- **Real-time KPIs**: Total plots, employees, animals, inventory alerts
- **Financial Overview**: Monthly revenue and expenses with trends
- **Visual Charts**:
  - Weekly attendance bar chart
  - Monthly financial trends line chart
- **Low Stock Alerts**: Critical inventory items
- **Upcoming Tasks**: Maintenance, fertilizer schedules, reports

### 3. Attendance & Work Management

- **Biometric Attendance Simulation**: Visual capture interface
- **Daily Attendance Tracking**: Check-in/out times, work hours
- **Status Badges**: Present, Absent, Late, Half-Day
- **Multiple Views**: Daily, Weekly, Monthly reports
- **Employee Search**: Quick filter by name or role
- **Attendance Statistics**: Attendance rate, average work hours

### 4. Cultivation & Fertilizer Management

- **Multi-Plot Management**: 
  - Individual and consolidated views
  - Plot-wise cost tracking
  - Days after planting calculation
- **Cost Breakdown**:
  - Total cost, cost per plant
  - Incurred vs pending costs
  - Custom cost entries by category
- **Fertilizer Scheduling**: Plot-wise and crop-wise schedules
- **Activity Logging**: Track all plot activities with dates
- **Plot Details**: Area, plant density, variety, location

### 5. Inventory Management

- **Stock Tracking**: Current stock vs reorder levels
- **Auto Alerts**: Critical and low stock indicators
- **Stock Movements**: IN/OUT transactions with history
- **Category Filtering**: Fertilizer, Pesticide, Seeds, Equipment, Fuel
- **Location-wise Inventory**: Track items by storage location
- **Reorder Suggestions**: Based on stock levels
- **Visual Progress Bars**: Stock status visualization

### 6. Equipment & Vehicle Maintenance

- **Equipment Registry**: Tractors, sprayers, pumps, vehicles, tools
- **Maintenance Scheduling**: 
  - Last service date
  - Next service due (with 7-day alerts)
  - Service history tracking
- **Fuel Consumption Logs**: Quantity, cost, operator tracking
- **Status Management**: Operational, Under Maintenance, Broken
- **Service Alerts**: Color-coded warnings for due maintenance

### 7. Livestock Management

- **Animal Registry**: 
  - Cows, buffaloes, horses, dogs, chickens, etc.
  - Tag numbers, breeds, dates of birth
  - Health status indicators
- **Milk Yield Recording**:
  - Morning and evening yields
  - Daily totals and quality ratings
  - Historical tracking per animal
- **Health Records**: Vaccinations, treatments, checkups
- **Sales Management**: Track animal sales and buyers
- **Age Calculation**: Automatic age from date of birth

### 8. Financial Management

- **Chart of Accounts**: 
  - Asset, Liability, Equity, Revenue, Expense accounts
  - Account codes and balances
  - Hierarchical structure support
- **Journal Entries**: 
  - Double-entry bookkeeping
  - Debit/credit lines
  - Reference numbers and descriptions
- **Petty Cash Register**: 
  - Daily cash transactions
  - Category tracking (Travel, Office, Labour, Misc)
  - Income/Expense classification
- **Financial Reports**:
  - Trial Balance
  - Profit & Loss Statement
  - Balance Sheet

### 9. Multi-Language Support

- **English/Tamil Toggle**: Seamless language switching
- **Persistent Preference**: Saved in localStorage
- **Comprehensive Translation**: All navigation and common terms
- **Visual Toggle Button**: Accessible from header

## Data Models

### Key Entities

- **Users**: Authentication, roles, contact information
- **Attendance Records**: Daily tracking with work hours
- **Work Schedules**: Task assignments and completion
- **Plots**: Cultivation areas with planting details
- **Plot Activities**: Fertigation, irrigation, weeding logs
- **Cultivation Costs**: Detailed expense tracking
- **Fertilizer Schedules**: Application planning
- **Inventory Items**: Stock levels, reorder points, locations
- **Inventory Movements**: Stock IN/OUT transactions
- **Equipment**: Registration, status, service dates
- **Maintenance Records**: Service history
- **Fuel Logs**: Consumption tracking
- **Animals**: Livestock registry with health status
- **Milk Yields**: Daily production records
- **Health Records**: Vaccinations and treatments
- **Animal Sales**: Sales history
- **Accounts**: Chart of accounts
- **Journal Entries**: Financial transactions
- **Petty Cash**: Daily cash management
- **Audit Logs**: System activity tracking

## API Endpoints (To Be Implemented)

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Dashboard
- `GET /api/dashboard/stats` - Overall statistics

### Attendance
- `GET /api/attendance?date=YYYY-MM-DD` - Daily records
- `POST /api/attendance` - Record attendance
- `GET /api/work-schedules` - Get work schedules

### Cultivation
- `GET /api/plots` - List all plots
- `POST /api/plots` - Create new plot
- `GET /api/plots/:id` - Get plot details
- `POST /api/plot-activities` - Log activity
- `POST /api/cultivation-costs` - Add cost
- `GET /api/fertilizer-schedules` - Get schedules

### Inventory
- `GET /api/inventory` - List all items
- `POST /api/inventory` - Add new item
- `POST /api/inventory-movements` - Record movement
- `GET /api/inventory/alerts` - Low stock alerts

### Equipment
- `GET /api/equipment` - List all equipment
- `POST /api/equipment` - Register equipment
- `POST /api/maintenance-records` - Log maintenance
- `GET /api/fuel-logs` - Get fuel consumption

### Livestock
- `GET /api/animals` - List all animals
- `POST /api/animals` - Register animal
- `POST /api/milk-yields` - Record milk yield
- `POST /api/health-records` - Add health record
- `POST /api/animal-sales` - Record sale

### Finance
- `GET /api/accounts` - Chart of accounts
- `POST /api/accounts` - Create account
- `POST /api/journal-entries` - Create entry
- `GET /api/petty-cash` - Petty cash register
- `POST /api/petty-cash` - Add petty cash entry
- `GET /api/reports/trial-balance` - Generate trial balance
- `GET /api/reports/pl-statement` - Generate P&L
- `GET /api/reports/balance-sheet` - Generate balance sheet

## Development Status

### ✅ Completed (Task 1: Frontend)
- All data schemas defined
- Complete UI component library
- All 7 module pages implemented
- Authentication flow with demo accounts
- Multi-language support (EN/TA)
- Responsive design
- Professional design system

### 🔄 In Progress
- Task 2: Backend implementation
- Task 3: Integration & testing

## Demo Credentials

- **Admin**: `admin` / `admin`
- **Manager**: `manager` / `manager`
- **Operator**: `user` / `user`

## Design Guidelines

See `design_guidelines.md` for comprehensive UI/UX standards including:
- Typography system (Inter + Roboto Mono)
- Layout & spacing rules
- Component patterns
- Module-specific components
- Responsive behavior
- Accessibility standards

## Running the Project

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Open browser to displayed URL
4. Login with demo credentials
5. Explore all 7 modules

## Key Technologies Used

- **Shadcn UI**: Comprehensive component library
- **TanStack Query**: Server state management
- **React Hook Form**: Form handling with Zod validation
- **Recharts**: Data visualization
- **Lucide React**: Icon library
- **Wouter**: Lightweight routing
- **date-fns**: Date manipulation

## Future Enhancements (Not in MVP)

- PostgreSQL database for persistence
- Real-time notifications
- PDF report generation
- Mobile app version
- Advanced analytics and trends
- Batch operations
- Data export/import functionality
- Email notifications
- SMS alerts for critical events
