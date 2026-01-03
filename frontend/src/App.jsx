import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Navigate } from "react-router-dom";

//Navbar
import Navbar from "./Components/Navbar";

//Homepage
import Banner from "./Components/Homepage/Banner";
import AboutUs from "./Components/Homepage/AboutUs";
import Effects from "./Components/Homepage/Effect";
import ActionSlider from "./Components/Homepage/Slider";
import StatsSection from "./Components/Homepage/Stats";
import Tutorial from "./Components/Homepage/Tutorial";
import MerchStore from "./Components/Homepage/Merch";
import FAQSection from "./Components/Homepage/FAQ";
//FAQ page
import Faq from "./Components/FAQ/Faq";
//About page
import About from "./Components/About/About";
//Data page
import Data from "./Components/Data/Data";
//Galler page
import Gallery from "./Components/Gallery/Gallery";
//Members page
import Members from "./Components/Members/Members";
//Shop page
import Shop from "./Components/Shop/Shop";
//Research page
import Research from "./Components/Research/Research";
//Footer
import Footer from "./Components/Footer";
//Admin Login
import Login from "./Components/Admin/Login";
//Admin Registration
import Signup from "./Components/Admin/Register";
//Admin DashBoard
import AdminDashboard from "./Components/Admin/Dashboard/Dashboard";
import DataPage from "./Components/Admin/Dashboard/Pages/DataPage";
import GalleryPage from "./Components/Admin/Dashboard/Pages/GalleryPage";
import MembersPage from "./Components/Admin/Dashboard/Pages/MembersPage";
import DashboardPage from "./Components/Admin/Dashboard/Pages/DashboardPage";

//Donate Page
import DonationStepper from "./Components/Donation/Donate";

//404 Not Found Page
import NotFound from "./Components/NotFound";

//Protected Routes
import ProtectedRoute from "./Context/ProtectedRoute";
import { AuthContext } from "./Context/AuthContext";
import { useContext } from "react";
function App() {
  const { auth, loading } = useContext(AuthContext);
  const location = useLocation();
  return (
    <>
      {!location.pathname.startsWith("/admin/dashboard") && <Navbar />}
      <Routes>
        <Route
          path="/login"
          element={
            auth ? (
              <Navigate to="/admin/dashboard/dashboard" replace />
            ) : (
              <Login />
            )
          }
        />
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
        <Route path="/donate" element={<DonationStepper />} />
        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard/dashboard" />}
        />
        <Route
          path="/admin/dashboard"
          element={<Navigate to="/admin/dashboard/dashboard" />}
        />
        import {Navigate} from "react-router-dom"; // This redirects /admin and
        /admin/dashboard to /admin/dashboard/dashboard
        <Route
          path="/admin"
          element={
            <ProtectedRoute auth={auth} loading={loading}>
              <Navigate to="/admin/dashboard/dashboard" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute auth={auth} loading={loading}>
              <Navigate to="/admin/dashboard/dashboard" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/"
          element={
            <ProtectedRoute auth={auth} loading={loading}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="data" element={<DataPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="/research" element={<Research />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!location.pathname.startsWith("/admin/dashboard") && <Footer />}
    </>
  );
}

export default App;
