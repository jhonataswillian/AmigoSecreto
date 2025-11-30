import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { AuthPage } from "./pages/AuthPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { GroupsPage } from "./pages/GroupsPage";
import { GroupDashboardPage } from "./pages/GroupDashboardPage";
import { JoinGroupPage } from "./pages/JoinGroupPage";

import { ProfilePage } from "./pages/ProfilePage";
import { MyWishlistPage } from "./pages/MyWishlistPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { DonatePage } from "./pages/DonatePage";
import { ErrorPage } from "./pages/ErrorPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AutoLogout } from "./components/auth/AutoLogout";
import { useAuthStore } from "./store/useAuthStore";
import { useNotificationStore } from "./store/useNotificationStore";

import { ToastProvider } from "./components/ui/Toast";

function App() {
  const { initialize, user } = useAuthStore();
  const {
    fetchNotifications,
    subscribeToNotifications,
    unsubscribeFromNotifications,
  } = useNotificationStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      subscribeToNotifications();
    }

    return () => {
      unsubscribeFromNotifications();
    };
  }, [
    user,
    fetchNotifications,
    subscribeToNotifications,
    unsubscribeFromNotifications,
  ]);

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/invite/:code" element={<JoinGroupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Error Pages */}
          <Route path="/400" element={<ErrorPage code={400} />} />
          <Route path="/401" element={<ErrorPage code={401} />} />
          <Route path="/403" element={<ErrorPage code={403} />} />
          <Route path="/404" element={<ErrorPage code={404} />} />
          <Route path="/500" element={<ErrorPage code={500} />} />
          <Route path="*" element={<ErrorPage code={404} />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AutoLogout>
                  <Layout />
                </AutoLogout>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/groups" replace />} />
            <Route path="groups" element={<GroupsPage />} />
            <Route path="groups/:id" element={<GroupDashboardPage />} />
            <Route path="wishlist" element={<MyWishlistPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="donate" element={<DonatePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
