import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Layout } from "./components/Layout";
import BookingPage from "./pages/BookingPage";
import LoginPage from "./pages/LoginPage";
import ModeSelectPage from "./pages/ModeSelectPage";
import ProfilePage from "./pages/ProfilePage";
import RequirementsPage from "./pages/RequirementsPage";
import ReviewPage from "./pages/ReviewPage";
import SwipePage from "./pages/SwipePage";
import TutorsPage from "./pages/TutorsPage";
import UnlockPage from "./pages/UnlockPage";

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Login (default route — no bottom nav)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

// Index redirect to login
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
});

// Layout route — wraps all app screens with bottom tab bar
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

// Mode selection
const modeSelectRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/mode-select",
  component: ModeSelectPage,
});

// Requirements form
const requirementsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/requirements",
  component: RequirementsPage,
});

// Tutor listing
const tutorsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/tutors",
  component: TutorsPage,
});

// Swipe interface
const swipeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/swipe",
  component: SwipePage,
});

// Unlock contact (dynamic tutorId)
const unlockRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/unlock/$tutorId",
  component: UnlockPage,
});

// Booking (dynamic tutorId)
const bookingRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/booking/$tutorId",
  component: BookingPage,
});

// Booking list (no tutorId)
const bookingListRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/booking",
  component: BookingPage,
});

// Review (dynamic tutorId)
const reviewRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/review/$tutorId",
  component: ReviewPage,
});

// Profile
const profileRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/profile",
  component: ProfilePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  layoutRoute.addChildren([
    modeSelectRoute,
    requirementsRoute,
    tutorsRoute,
    swipeRoute,
    unlockRoute,
    bookingRoute,
    bookingListRoute,
    reviewRoute,
    profileRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
