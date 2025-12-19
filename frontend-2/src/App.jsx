import { Routes, Route, Navigate } from 'react-router-dom';
import { Providers } from '@/Providers';
import { AuthProvider } from '@/context/AuthContext';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { ErrorBoundary } from '@/components/common';

// Auth pages
import RegisterSchool from '@/pages/auth/RegisterSchool';
import Login from '@/pages/auth/Login';
import RegisterStaff from '@/pages/auth/RegisterStaff';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';

// Student & Parent Pages
import StudentList from '@/pages/students/StudentList';
import ParentList from '@/pages/parents/ParentList';
import LinkStudentToParent from '@/pages/parents/LinkStudentToParent';
import CreateParent from '@/pages/parents/CreateParent';
import ParentDashboard from '@/pages/dashboard/ParentDashboard';
import ChildDashboard from '@/pages/dashboard/ChildDashboard';
import TeacherDashboard from '@/pages/dashboard/TeacherDashboard';
import BulkUploadPage from '@/pages/admin/BulkUploadPage';


// Academic Pages
import Classes from '@/pages/academic/Classes';
import Subjects from '@/pages/academic/Subjects';
import Timetable from '@/pages/academic/Timetable';

// Attendance Pages
import MarkAttendance from '@/pages/attendance/MarkAttendance';
import AttendanceReport from '@/pages/attendance/AttendanceReport';

// Exam Pages
import ExamList from '@/pages/exams/ExamList';
import CreateExam from '@/pages/exams/CreateExam';
import ExamResults from '@/pages/exams/ExamResults';
import ReportCard from '@/pages/exams/ReportCard';

// Finance Pages
import FeeStructure from '@/pages/finance/FeeStructure';
import FeeCollection from '@/pages/finance/FeeCollection';
import Payroll from '@/pages/finance/Payroll';

// Leave Pages
import LeaveApplication from '@/pages/leaves/LeaveApplication';

// Other Pages
import Notifications from '@/pages/Notifications';

function App() {
  return (
    <Providers>
      <AuthProvider>
        <ErrorBoundary>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register-staff" element={<RegisterStaff />} />
            {/* register-school is usually protected or secret, but putting it public for now if requested, else keeping it protected as per current code */}

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <MainLayout />
              }
            >
              <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="register-school" element={<ProtectedRoute><RegisterSchool /></ProtectedRoute>} />
              {/* Academic Routes */}
              <Route path="academic/classes" element={<ProtectedRoute><Classes /></ProtectedRoute>} />
              <Route path="academic/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
              <Route path="academic/timetable" element={<ProtectedRoute><Timetable /></ProtectedRoute>} />

              {/* Student & Parent Management (Admin) */}
              <Route path="students" element={<ProtectedRoute><StudentList /></ProtectedRoute>} />
              <Route path="parents" element={<ProtectedRoute><ParentList /></ProtectedRoute>} />
              <Route path="parents/:parentId/link-students" element={<ProtectedRoute><LinkStudentToParent /></ProtectedRoute>} />
              <Route path="register-parent" element={<ProtectedRoute><CreateParent /></ProtectedRoute>} />
              <Route path="admin/bulk-upload/:type" element={<ProtectedRoute><BulkUploadPage /></ProtectedRoute>} />

              {/* Parent Routes */}
              <Route path="parent-dashboard" element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>} />
              <Route path="parent/child/:studentId" element={<ProtectedRoute><ChildDashboard /></ProtectedRoute>} />

              {/* Teacher Routes */}
              <Route path="teacher-dashboard" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />

              {/* Attendance Routes */}
              <Route path="attendance/mark" element={<ProtectedRoute><MarkAttendance /></ProtectedRoute>} />
              <Route path="attendance/report" element={<ProtectedRoute><AttendanceReport /></ProtectedRoute>} />

              {/* Exam Routes */}
              <Route path="exams" element={<ProtectedRoute><ExamList /></ProtectedRoute>} />
              <Route path="exams/new" element={<ProtectedRoute><CreateExam /></ProtectedRoute>} />
              <Route path="exams/results" element={<ProtectedRoute><ExamResults /></ProtectedRoute>} />
              <Route path="exams/reports" element={<ProtectedRoute><ReportCard /></ProtectedRoute>} />

              {/* Finance Routes */}
              <Route path="finance/fees" element={<ProtectedRoute><FeeStructure /></ProtectedRoute>} />
              <Route path="finance/collection" element={<ProtectedRoute><FeeCollection /></ProtectedRoute>} />
              <Route path="finance/payroll" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />

              {/* Other Routes */}
              <Route path="notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="leaves/apply" element={<ProtectedRoute><LeaveApplication /></ProtectedRoute>} />


              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>

            {/* Catch all */}
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </Providers>
  );
}

export default App;



