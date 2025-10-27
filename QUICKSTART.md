# Quick Start Guide - TalentFlow

## 🚀 Running the Application

The application is currently running at: **http://localhost:5173/**

## 📝 First Steps

### 1. Home Page
- When you first visit the home page, sample data will be automatically seeded
- You'll see a green success message confirming the data was loaded
- View dashboard stats showing:
  - Total jobs and active jobs
  - Total candidates and new applications

### 2. Jobs Management

**Navigate to: `/jobs`**

#### Features to Try:
- **View Jobs**: See paginated list of all jobs (10 per page)
- **Filter Jobs**: 
  - Search by title
  - Filter by status (Active/Archived/All)
  - Filter by tags
- **Create Job**: Click "+ Create Job" button
  - Title is required
  - Slug auto-generates but can be customized
  - Add tags, description, and set status
- **Edit Job**: Click "Edit" on any job card
- **Archive/Unarchive**: Toggle job status
- **Reorder Jobs**: Drag jobs up or down to reorder (optimistic updates!)
- **View Job Details**: Click on job title for deep-linked detail view

### 3. Candidates Management

**Navigate to: `/candidates`**

#### Features to Try:
- **Virtualized List**: Scroll through 1000+ candidates smoothly
- **Search**: Type name or email to filter instantly
- **Filter by Stage**: Select stage from dropdown
- **View Profile**: Click any candidate to see:
  - Full timeline of status changes
  - Add notes with @mentions (try typing @john, @jane, etc.)
  - Complete candidate information

#### Kanban Board View
**Navigate to: `/candidates/kanban`**
- Drag candidates between stages
- Visual columns for each stage
- Real-time updates

### 4. Assessments

**Navigate to: `/jobs/:jobId` → Click "Manage Assessment"**

#### Assessment Builder:
1. **Add Sections**: Click "+ Add Section"
2. **Add Questions**: Click "+ Add Question" in any section
3. **Question Types Available**:
   - Short Text
   - Long Text
   - Single Choice (radio buttons)
   - Multiple Choice (checkboxes)
   - Numeric (with min/max range)
   - File Upload (stub)

4. **Configure Questions**:
   - Set label and help text
   - Mark as required
   - Add validation rules (min/max for numeric)
   - Add options for choice questions
   - Set conditional logic (show question based on another answer)

5. **Live Preview**: Toggle "Preview" to see form as candidates will see it
   - Test validation
   - Test conditional logic
   - Try submitting

## 🎯 Use Cases to Test

### Use Case 1: Hiring Workflow
1. Go to Jobs → Click on a job
2. Click "Manage Assessment"
3. Create a multi-section assessment with various question types
4. Preview the form
5. Go to Candidates → View candidates for that job
6. Open candidate kanban board
7. Drag a candidate through the stages

### Use Case 2: Candidate Tracking
1. Go to Candidates list
2. Search for a specific name
3. Click to view candidate profile
4. Review timeline of status changes
5. Add a note mentioning @john
6. Return to kanban board
7. Move candidate to next stage
8. Check profile again to see updated timeline

### Use Case 3: Jobs Reordering
1. Go to Jobs page
2. Drag jobs to reorder them
3. Refresh page to see order persists
4. Try filtering → still maintains order
5. Archive a job
6. Filter to show only archived jobs

## 🔧 Technical Features Demonstrated

### Optimistic UI Updates
- Drag jobs to reorder
- Watch immediate feedback
- Changes saved automatically
- Auto-rollback if save fails

### Virtualization
- Scroll candidates list
- Notice smooth performance with 1000+ items
- Only visible items are rendered

### Form Validation
- Try submitting assessment without required fields
- See inline error messages
- Test numeric ranges
- Test conditional questions

### Deep Linking
- Copy URL from any job detail page
- Paste in new tab → goes directly to that job
- Same works for candidate profiles

## 💾 Data Management

### Data is Stored in Browser localStorage

To **reset all data**:
1. Open browser DevTools (F12)
2. Go to Application tab
3. Click "Clear site data" or manually delete:
   - `jobs`
   - `candidates`
   - `assessments`
   - `assessmentResponses`

To **re-seed data**:
- Clear localStorage
- Reload home page
- Data will auto-seed again

## 🐛 Known Limitations

1. **File Upload**: Stub only (shows file name but doesn't actually upload)
2. **@Mentions**: Shows local list, no autocomplete dropdown
3. **Email Notifications**: Not implemented
4. **Authentication**: No user system (hardcoded "Current User")
5. **Data**: All stored in localStorage (no backend)

## 📊 Sample Data Stats

- **15 Jobs**: Mix of active and archived
- **1000 Candidates**: Distributed across all stages
- **Each Candidate**: Has complete status history
- **0 Assessments**: Create as needed per job

## 🎨 UI Tips

- **Hover Effects**: Most elements have hover states
- **Transitions**: Smooth animations throughout
- **Responsive**: Try resizing browser
- **Sticky Navbar**: Always visible at top
- **Loading States**: Shown when appropriate

## 🚀 Next Steps

1. Explore all three main sections (Jobs, Candidates, Assessments)
2. Try drag-and-drop features in both Jobs and Kanban
3. Create a complete assessment with conditional logic
4. Test the virtualized list performance
5. Add notes to candidates with @mentions
6. Review the candidate timeline feature

Enjoy exploring TalentFlow! 🎉
