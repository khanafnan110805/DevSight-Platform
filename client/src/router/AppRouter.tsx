import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { AppShell } from '@/components/layout/AppShell/AppShell';
import { PublicLayout } from '@/components/layout/PublicLayout/PublicLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Spinner } from '@/components/atoms/Spinner/Spinner';
import {
  ProfileSettings,
  AppearanceSettings,
  PrivacySettings,
  AccountSettings,
} from '@/pages/Settings/SettingsPage';

// Lazy-loaded route components
const HomePage = lazy(() => import('@/pages/Home/HomePage'));
const AuthPage = lazy(() => import('@/pages/Auth/AuthPage'));
const AuthCallbackPage = lazy(() => import('@/pages/Auth/AuthCallbackPage'));
const DashboardPage = lazy(() => import('@/pages/Dashboard/DashboardPage'));
const RepositoriesPage = lazy(() => import('@/pages/Repositories/RepositoriesPage'));
const InsightsPage = lazy(() => import('@/pages/Insights/InsightsPage'));
const PortfolioPage = lazy(() => import('@/pages/Portfolio/PortfolioPage'));
const SettingsPage = lazy(() => import('@/pages/Settings/SettingsPage'));
const PublicProfilePage = lazy(() => import('@/pages/PublicProfile/PublicProfilePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage'));

const SuspenseFallback = () => (
  <div className="flex-1 flex items-center justify-center min-h-[60vh]">
    <Spinner size="lg" />
  </div>
);

export const AppRouter = () => (
  <Suspense fallback={<SuspenseFallback />}>
    <Routes>
      {/* ── Public marketing routes ─────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
      </Route>

      {/* ── Auth routes (no layout) ──────────────────────── */}
      <Route path={ROUTES.AUTH_LOGIN} element={<AuthPage />} />
      <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallbackPage />} />

      {/* ── Public profile (no auth needed) ─────────────── */}
      <Route path={ROUTES.PUBLIC_PROFILE} element={<PublicProfilePage />} />

      {/* ── Protected dashboard routes ────────────────────── */}
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.REPOSITORIES} element={<RepositoriesPage />} />
        <Route path={ROUTES.INSIGHTS} element={<InsightsPage />} />
        <Route path={ROUTES.PORTFOLIO} element={<PortfolioPage />} />

        {/* Settings with nested routes */}
        <Route path={ROUTES.SETTINGS} element={<SettingsPage />}>
          <Route index element={<Navigate to="/settings/profile" replace />} />
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="appearance" element={<AppearanceSettings />} />
          <Route path="privacy" element={<PrivacySettings />} />
          <Route path="account" element={<AccountSettings />} />
        </Route>
      </Route>

      {/* ── Fallback ─────────────────────────────────────── */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  </Suspense>
);
