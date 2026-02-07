import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import CoursesDashboard from './pages/instructor/CoursesDashboard';
import CreateCourse from './pages/instructor/CreateCourse';
import EditCourse from './pages/instructor/EditCourse';
import MyCourses from './pages/learner/MyCourses';
import BrowseCourses from './pages/learner/BrowseCourses';
import CoursePlayer from './pages/learner/CoursePlayer';
import { Toaster } from 'react-hot-toast';

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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Layout />}>
          {/* Default Redirect */}
          <Route index element={<Navigate to="/browse" replace />} />

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

          <Route path="courses" element={<Navigate to="/browse" replace />} />

          {/* Instructor Routes */}
          <Route path="instructor/courses" element={
            <ProtectedRoute roles={['instructor', 'admin']}>
              <CoursesDashboard />
            </ProtectedRoute>
          } />
          <Route path="instructor/courses/new" element={
            <ProtectedRoute roles={['instructor', 'admin']}>
              <CreateCourse />
            </ProtectedRoute>
          } />
          <Route path="instructor/courses/:id/edit" element={
            <ProtectedRoute roles={['instructor', 'admin']}>
              <EditCourse />
            </ProtectedRoute>
          } />

        </Route>
      </Routes>
    </>
  );
}

export default App;
