import { createBrowserRouter } from "react-router";
import Root from "./screens/Root";
import Splash from "./screens/Splash";
import Onboarding from "./screens/Onboarding";
import Signup from "./screens/Signup";
import Login from "./screens/Login";
import ForgotPassword from "./screens/ForgotPassword";
import Home from "./screens/Home";
import Camera from "./screens/Camera";
import Analyzing from "./screens/Analyzing";
import Results from "./screens/Results";
import Advice from "./screens/Advice";
import Map from "./screens/Map";
import History from "./screens/History";
import ScanDetail from "./screens/ScanDetail";
import Profile from "./screens/Profile";
import EditProfile from "./screens/EditProfile";
import Settings from "./screens/Settings";
import Notifications from "./screens/Notifications";
import About from "./screens/About";
import Timeline from "./screens/Timeline";
import WeatherCorrelation from "./screens/WeatherCorrelation";
import SkincareRoutine from "./screens/SkincareRoutine";
import Heatmap from "./screens/Heatmap";
import FamilyProfiles from "./screens/FamilyProfiles";
import BodyMap from "./screens/BodyMap";
import SkinTypeQuiz from "./screens/SkinTypeQuiz";
import AIChat from "./screens/AIChat";
import Languages from "./screens/Languages";
import AROverlay from "./screens/AROverlay";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Splash },
      { path: "onboarding", Component: Onboarding },
      { path: "signup", Component: Signup },
      { path: "login", Component: Login },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "home", Component: Home },
      { path: "camera", Component: Camera },
      { path: "analyzing", Component: Analyzing },
      { path: "results/:scanId", Component: Results },
      { path: "advice/:scanId", Component: Advice },
      { path: "map", Component: Map },
      { path: "history", Component: History },
      { path: "scan/:scanId", Component: ScanDetail },
      { path: "profile", Component: Profile },
      { path: "edit-profile", Component: EditProfile },
      { path: "settings", Component: Settings },
      { path: "notifications", Component: Notifications },
      { path: "about", Component: About },
      { path: "timeline", Component: Timeline },
      { path: "weather", Component: WeatherCorrelation },
      { path: "routine", Component: SkincareRoutine },
      { path: "heatmap", Component: Heatmap },
      { path: "family", Component: FamilyProfiles },
      { path: "body-map", Component: BodyMap },
      { path: "skin-quiz", Component: SkinTypeQuiz },
      { path: "ai-chat", Component: AIChat },
      { path: "languages", Component: Languages },
      { path: "ar-overlay", Component: AROverlay },
    ],
  },
]);
