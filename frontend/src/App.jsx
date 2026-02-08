import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Layout from './components/Layout';
import InstructorLayout from './components/InstructorLayout';
import CoursesDashboard from './pages/instructor/CoursesDashboard';
import CreateCourse from './pages/instructor/CreateCourse';
import EditCourse from './pages/instructor/EditCourse';
import ReportingDashboard from './pages/instructor/ReportingDashboard';
import MyCourses from './pages/learner/MyCourses';
import BrowseCourses from './pages/learner/BrowseCourses';
import CoursePlayer from './pages/learner/CoursePlayer';
import { Toaster } from 'react-hot-toast';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />; // Unauthorized
  }

  return children;
};

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          {/* Learner Routes */}
          <Route path="browse" element={
            <ProtectedRoute roles={['learner', 'instructor', 'admin']}>
              <BrowseCourses />
            </ProtectedRoute>
          } />

          <Route path="my-courses" element={
            <ProtectedRoute roles={['learner', 'instructor', 'admin']}>
              <MyCourses />
            </ProtectedRoute>
          } />

          <Route path="courses/:id" element={
            <ProtectedRoute roles={['learner', 'instructor', 'admin']}>
              <CoursePlayer />
            </ProtectedRoute>
          } />

          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route
            path="/admin/instructors"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

        </Route>

        {/* Instructor Routes with InstructorLayout */}
        <Route path="/instructor" element={<InstructorLayout />}>
          <Route path="courses" element={
            <ProtectedRoute roles={['instructor', 'admin']}>
              <CoursesDashboard />
            </ProtectedRoute>
          } />
          <Route path="courses/new" element={
            <ProtectedRoute roles={['instructor', 'admin']}>
              <CreateCourse />
            </ProtectedRoute>
          } />
          <Route path="courses/:id/edit" element={
            <ProtectedRoute roles={['instructor', 'admin']}>
              <EditCourse />
            </ProtectedRoute>
          } />
          <Route path="reporting" element={
            <ProtectedRoute roles={['instructor', 'admin']}>
              <ReportingDashboard />
            </ProtectedRoute>
          } />
        </Route>

      </Routes>
    </>
  );
}

export default App;
