import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import ClubDetailWrapper from "./pages/communityDetail/ClubDetailWrapper";
import ExploreWrapper from "./pages/explore/ExploreWrapper";
import Home from "./pages/Home";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/login/LoginPage";


export default function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<ExploreWrapper />} />
        <Route path="/club/:id" element={<ClubDetailWrapper />} />

        <Route
          path="/login"
          element={
            <LoginPage
              onClose={() => {}}
              onSignupClick={() => {}}
            />
          }
        />

        <Route
          path="/signup"
          element={
            <SignupPage
              onClose={() => {}}
              onLoginClick={() => {}}
            />
          }
        />
      </Routes>
    </>
  );
} 