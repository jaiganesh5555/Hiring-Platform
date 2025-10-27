# TalentFlow - HR Hiring Platform

A comprehensive React application for managing the entire hiring process, including jobs, candidates, and assessments.

## 🚀 Features

### 📋 Jobs Management
- **Pagination & Filtering**: Browse jobs with server-like pagination and filter by title, status, and tags
- **Create/Edit Jobs**: Modal-based job creation with validation (title required, unique slug)
- **Archive/Unarchive**: Toggle job status between active and archived
- **Drag-and-Drop Reordering**: Reorder jobs with optimistic updates and automatic rollback on failure
- **Deep Linking**: Direct access to jobs via `/jobs/:jobId`

### 👥 Candidates Management
- **Virtualized List**: Handle 1000+ candidates efficiently with @tanstack/react-virtual
- **Client-Side Search**: Search by candidate name or email
- **Server-Like Filtering**: Filter by current stage (applied, screening, interview, assessment, offer, hired, rejected)
- **Candidate Profile**: View detailed timeline of status changes at `/candidates/:id`
- **Kanban Board**: Drag-and-drop candidates between stages with visual feedback
- **Notes with @Mentions**: Add notes and mention team members (suggestions from local list)

### 📝 Assessments
- **Assessment Builder**: Create job-specific assessments with sections and questions
- **Question Types**: 
  - Single choice
  - Multiple choice
  - Short text
  - Long text
  - Numeric (with range validation)
  - File upload (stub)
- **Live Preview**: Real-time preview pane showing fillable form
- **Form Validation**: Required fields, numeric ranges, max length
- **Conditional Questions**: Show/hide questions based on previous answers (e.g., show Q3 only if Q1 === "Yes")
- **Local Persistence**: Builder state and responses saved in localStorage

## 💻 Technology Stack

- **React 19** with TypeScript
- **React Router DOM** for navigation
- **React DnD** with HTML5 Backend for drag-and-drop
- **@tanstack/react-virtual** for virtualized lists
- **Tailwind CSS** for styling
- **date-fns** for date formatting
- **Vite** for build tooling

## 🎯 Getting Started

### Installation

\`\`\`powershell
cd frontend
npm install
\`\`\`

### Development

\`\`\`powershell
npm run dev
\`\`\`

The application will start on `http://localhost:5173` (or next available port).

### First Run

On first load, the application will automatically seed:
- ✅ 15 sample jobs (mix of active and archived)
- ✅ 1000 sample candidates across all stages
- ✅ Complete status history for each candidate
- ✅ Empty assessments (create as needed per job)

All data is stored in browser localStorage for persistence across sessions.

## 📁 Project Structure

\`\`\`
frontend/src/
├── Components/
│   ├── Logo.tsx                      # Application logo component
│   ├── navbar.tsx                    # Main navigation bar
│   ├── Jobs/
│   │   ├── JobCard.tsx              # Draggable job card with DnD
│   │   ├── JobModal.tsx             # Create/edit job modal with validation
│   │   └── JobFilters.tsx           # Job filtering component
│   └── Assessments/
│       ├── AssessmentBuilder.tsx    # Assessment creation interface
│       └── AssessmentPreview.tsx    # Live form preview with validation
├── pages/
│   ├── home.tsx                     # Dashboard with stats
│   ├── jobs.tsx                     # Jobs list with pagination
│   ├── JobDetail.tsx                # Single job detail view
│   ├── candidates.tsx               # Virtualized candidates list
│   ├── CandidateDetail.tsx          # Candidate profile with timeline
│   ├── CandidateKanban.tsx          # Kanban board view
│   └── assignments.tsx              # Assessment builder page
├── types/
│   └── index.ts                     # TypeScript type definitions
├── utils/
│   ├── api.ts                       # localStorage API layer
│   ├── seedData.ts                  # IndexedDB seed data generators
│   └── init.ts                      # Database initialization
└── App.tsx                          # Main app with routes
\`\`\`

## 🔗 Routing

| Route | Description |
|-------|-------------|
| `/` | Home dashboard with stats |
| `/jobs` | Jobs list with filters & pagination |
| `/jobs/:jobId` | Job details (deep link support) |
| `/candidates` | Virtualized candidates list |
| `/candidates/:id` | Candidate profile with timeline |
| `/candidates/kanban` | Kanban pipeline view |
| `/assessments/:jobId` | Assessment builder for job |
| `/about` | About page |
| `/dashboard` | Dashboard page |

## ✨ Core Implementation Details

### Jobs Board - Drag & Drop with Rollback

\`\`\`typescript
const handleReorder = (dragIndex, hoverIndex) => {
  // Optimistic UI update
  setJobs(newJobs);
  setIsDragging(true);
  
  try {
    jobsAPI.reorder(newJobs.map(j => j.id));
  } catch (error) {
    // Automatic rollback on failure
    loadJobs();
  } finally {
    setIsDragging(false);
  }
};
\`\`\`

### Candidates - Virtualized List

\`\`\`typescript
const rowVirtualizer = useVirtualizer({
  count: candidates.length,  // 1000+
  getScrollElement: () => parentRef.current,
  estimateSize: () => 80,
  overscan: 10  // Render 10 extra rows for smooth scrolling
});
\`\`\`

### Assessments - Conditional Logic

\`\`\`typescript
// Show question only if dependency condition is met
const shouldShowQuestion = (question) => {
  if (!question.conditional) return true;
  
  const dependsOnValue = answers[question.conditional.dependsOn];
  if (question.conditional.operator === 'equals') {
    return dependsOnValue === question.conditional.value;
  }
  return true;
};
\`\`\`

## 🎨 UI/UX Features

- **Sticky Navbar**: Always visible at top with shadow
- **Optimistic Updates**: Immediate UI feedback with automatic rollback
- **Loading States**: Skeleton screens and loading indicators
- **Error Handling**: Inline validation errors
- **Responsive Design**: Works on desktop and mobile
- **Smooth Animations**: Transitions and hover effects throughout

## 💾 Data Persistence

All data stored in browser localStorage:

| Key | Description |
|-----|-------------|
| `jobs` | All job postings with order |
| `candidates` | All candidate data with history |
| `assessments` | Assessment structures |
| `assessmentResponses` | Candidate submissions |

**To reset data**: Clear browser localStorage or delete specific keys in DevTools.

## 🏗️ Building for Production

\`\`\`powershell
npm run build
\`\`\`

Output in `frontend/dist/` directory.

## 📊 Sample Data

### Jobs
- 15 pre-seeded jobs
- Various tech roles (Frontend, Backend, Full Stack, etc.)
- Mix of active and archived status
- Tagged appropriately (Engineering, Remote, Full-time)

### Candidates
- 1000 pre-seeded candidates
- Distributed across all stages
- Complete status history for each
- Realistic names and emails

## 🚧 Future Enhancements

- [ ] Authentication & user roles
- [ ] Real backend API integration
- [ ] Email notifications for status changes
- [ ] Calendar integration for interviews
- [ ] Analytics & reporting dashboard
- [ ] Export to CSV/PDF
- [ ] Advanced search with filters
- [ ] Bulk actions
- [ ] Interview scheduling
- [ ] Offer letter templates

## 📝 License

MIT