import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Banner from "./Components/Homepage/Banner";
import AboutUs from "./Components/Homepage/AboutUs";
import Effects from "./Components/Homepage/Effect";
import ActionSlider from "./Components/Homepage/Slider";
import StatsSection from "./Components/Homepage/Stats";
import Tutorial from "./Components/Homepage/Tutorial";
import FAQSection from "./Components/Homepage/FAQ";
import Faq from "./Components/FAQ/Faq";
import About from "./Components/About/About";
import Data from "./Components/Data/Data";
import Gallery from "./Components/Gallery/Gallery";
import Members from "./Components/Members/Members";
import Shop from "./Components/Shop/Shop";
import Research from "./Components/Research/Research";
import Login from "./Components/Admin/Login";
import Signup from "./Components/Admin/Register";
import CompleteProfile from "./Components/Auth/CompleteProfile";
import TimelinePage from "./Components/Admin/Dashboard/Pages/TimelinePage";
import StatsPage from "./Components/Admin/Dashboard/Pages/StatsPage";
import GalleryPage from "./Components/Admin/Dashboard/Pages/GalleryPage";
import MembersPage from "./Components/Admin/Dashboard/Pages/MembersPage";
import DashboardPage from "./Components/Admin/Dashboard/Pages/DashboardPage";
import AdminResearch from "./Components/Admin/Dashboard/Pages/AdminResearch";
import ApplicationsPage from "./Components/Admin/Dashboard/Pages/ApplicationsPage";
import DonationNotifyPage from "./Components/Admin/Dashboard/Pages/DonationNotifyPage";
import Apply from "./Components/Apply/Apply";
import Donate from "./Components/Donate/Donate";
import NotFound from "./Components/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminErrorBoundary from "./Components/Admin/AdminErrorBoundary";
import { useAuth } from "./contexts/AuthContext";
import PublicLayout from "./layouts/PublicLayout";
import AdminDashboard from "./Components/Admin/Dashboard/Dashboard";

function App() {
  const { session, isAdmin, profileComplete } = useAuth();

  return (
    <>
      <Routes>
        {/* Auth */}
        <Route
          path="/login"
          element={
            session ? (
              <Navigate
                to={profileComplete ? (isAdmin ? "/admin" : "/") : "/complete-profile"}
                replace
              />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/complete-profile"
          element={
            <ProtectedRoute requireProfile={false}>
              <CompleteProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            session ? (
              <Navigate
                to={profileComplete ? (isAdmin ? "/admin" : "/") : "/complete-profile"}
                replace
              />
            ) : (
              <Signup />
            )
          }
        />

        {/* Public pages */}
        <Route element={<PublicLayout />}>
          <Route
            path="/"
            element={
              <>
                <Banner />
                <AboutUs />
                <Effects />
                <ActionSlider />
                <StatsSection />
                <Tutorial />
                <FAQSection />
              </>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/data" element={<Data />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/faqs" element={<Faq />} />
          <Route path="/members" element={<Members />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/research" element={<Research />} />
        </Route>

        {/* Legacy admin redirects */}
        <Route
          path="/admin/dashboard"
          element={<Navigate to="/admin" replace />}
        />
        <Route
          path="/admin/dashboard/dashboard"
          element={<Navigate to="/admin" replace />}
        />
        <Route
          path="/admin/dashboard/timeline"
          element={<Navigate to="/admin/timeline" replace />}
        />
        <Route
          path="/admin/dashboard/stats"
          element={<Navigate to="/admin/stats" replace />}
        />
        <Route
          path="/admin/dashboard/gallery"
          element={<Navigate to="/admin/gallery" replace />}
        />
        <Route
          path="/admin/dashboard/members"
          element={<Navigate to="/admin/members" replace />}
        />
        <Route
          path="/admin/dashboard/research"
          element={<Navigate to="/admin/research" replace />}
        />

        {/* Admin dashboard (SINGLE protected layout) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminErrorBoundary>
                <AdminDashboard />
              </AdminErrorBoundary>
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="research" element={<AdminResearch />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="donation-notify" element={<DonationNotifyPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
