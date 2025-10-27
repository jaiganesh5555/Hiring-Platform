import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './Components/navbar'
import Home from './pages/home'
import CandidatesPage from './pages/candidates'
import CandidateDetailPage from './pages/CandidateDetail'
import CandidateKanbanPage from './pages/CandidateKanban'

import JobsPage from './pages/jobs'
import JobDetailPage from './pages/JobDetail'
import DataDebugPage from './pages/DataDebug'
import AssessmentsPage from './pages/AssessmentsPage'
import './App.css'

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      <BrowserRouter>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/jobs' element={<JobsPage/>}/>
            <Route path='/jobs/:jobId' element={<JobDetailPage/>}/>
            <Route path='/candidates' element={<CandidatesPage/>}/>
            <Route path='/candidates/:id' element={<CandidateDetailPage/>}/>
            <Route path='/candidates/kanban' element={<CandidateKanbanPage/>}/>
            <Route path='/assessments/:jobId/new' element={<AssessmentsPage/>}/>
            <Route path='/assessments/:jobId/:assessmentId' element={<AssessmentsPage/>}/>
            <Route path='/debug' element={<DataDebugPage/>}/>
          </Routes>
        </div>
      </BrowserRouter>  
   </>
  )
}

export default App
