import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { GroupsPage } from "./pages/GroupsPage";
import { GroupDashboardPage } from "./pages/GroupDashboardPage";
import { DrawRevealPage } from "./pages/DrawRevealPage";
import { WishlistPage } from "./pages/WishlistPage";
import { ProfilePage } from "./pages/ProfilePage";
import { MyWishlistPage } from "./pages/MyWishlistPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/groups/:id" element={<GroupDashboardPage />} />
            <Route path="/groups/:id/reveal" element={<DrawRevealPage />} />
            <Route
              path="/groups/:groupId/wishlist/:participantId"
              element={<WishlistPage />}
            />
            <Route path="/wishlist" element={<MyWishlistPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="/" element={<Navigate to="/groups" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
