import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "./app/AuthContext";
import { AppShell } from "./components/layout/AppShell";
import { FullScreenLoader } from "./components/ui/FullScreenLoader";
import { ROLES } from "./lib/constants";

const AdminPage = lazy(() => import("./pages/AdminPage").then((module) => ({ default: module.AdminPage })));
const DashboardPage = lazy(() => import("./pages/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const LoginPage = lazy(() => import("./pages/LoginPage").then((module) => ({ default: module.LoginPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage })));
const RecordsPage = lazy(() => import("./pages/RecordsPage").then((module) => ({ default: module.RecordsPage })));
const RegisterPage = lazy(() => import("./pages/RegisterPage").then((module) => ({ default: module.RegisterPage })));

function ProtectedRoute({ children, roles }) {
  const { authenticated, bootstrapping, user } = useAuth();

  if (bootstrapping) {
    return <FullScreenLoader label="Restoring your workspace" />;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles?.length && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function GuestRoute({ children }) {
  const { authenticated, bootstrapping } = useAuth();

  if (bootstrapping) {
    return <FullScreenLoader label="Preparing your portal" />;
  }

  if (authenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<FullScreenLoader label="Loading experience" />}>
        <Routes>
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="records" element={<RecordsPage />} />
            <Route
              path="admin"
              element={
                <ProtectedRoute roles={[ROLES.ADMIN]}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}
