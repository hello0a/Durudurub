import { Toaster } from "sonner";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import { ExplorePage } from "./pages/explore/ExplorePage";
import ExploreWrapper from "./pages/explore/ExploreWrapper";
import ClubDetailWrapper from "./pages/communityDetail/ClubDetailWrapper";


export default function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<ExploreWrapper />} />
        <Route path="/club/:id" element={<ClubDetailWrapper />} />
      </Routes>
    </>
  );
}