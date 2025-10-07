import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import OpenRoute from "./components/core/Auth/openRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Settings from "./components/core/Dashboard/Settings";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "./utils/constants";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
// import AddCourse from "./components/core/Dashboard/AddCourse";

function App() {

  const { user } = useSelector((state) => state.profile)

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flec flex-col font-inter">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="/about"
          element={

            <About />

          }
        />
        <Route path="/contact" element={<Contact />} />

        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="Settings" element={<Settings />} />
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                {/* <Route path="dashboard/cart" element={<Cart />} /> */}
                <Route path="enrolled-courses" element={<EnrolledCourses />} />
                <Route path="cart" element={<Cart />} />
              </>
            )
          }
          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                {/* <Route path="dashboard/instructor" element={<Instructor />} /> */}
                {/* <Route path="add-course" element={<AddCourse />} /> */}
                {/* <Route path="dashboard/my-courses" element={<MyCourses />} /> */}
                {/* <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} /> */}

              </>
            )
          }
          {/* Later you can add more dashboard pages here */}
          {/* <Route path="settings" element={<Settings />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
