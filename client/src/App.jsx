import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateTask from "./pages/CreateTask";
import MyTasks from "./pages/MyTasks";
import MyAcceptedTasks from "./pages/MyAcceptedTasks";
import ExploreTasks from "./pages/ExploreTasks";
import EditTask from "./pages/EditTask";
import TaskDetails from "./pages/TaskDetails";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Leaderboard from "./pages/Leaderboard";
import SubmitWork from "./pages/SubmitWork";

import PrivateRoute from "./components/auth/PrivateRoute";

function App() {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC ROUTES
      ===================================================== */}

      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Register />}
      />

      {/* =====================================================
          DASHBOARD
      ===================================================== */}

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* =====================================================
          TASK ROUTES
      ===================================================== */}

      <Route
        path="/create-task"
        element={
          <PrivateRoute>
            <CreateTask />
          </PrivateRoute>
        }
      />

      <Route
        path="/my-tasks"
        element={
          <PrivateRoute>
            <MyTasks />
          </PrivateRoute>
        }
      />

      <Route
        path="/my-accepted-tasks"
        element={
          <PrivateRoute>
            <MyAcceptedTasks />
          </PrivateRoute>
        }
      />

      <Route
        path="/explore"
        element={
          <PrivateRoute>
            <ExploreTasks />
          </PrivateRoute>
        }
      />

      <Route
        path="/task/:id"
        element={
          <PrivateRoute>
            <TaskDetails />
          </PrivateRoute>
        }
      />

      <Route
        path="/edit-task/:id"
        element={
          <PrivateRoute>
            <EditTask />
          </PrivateRoute>
        }
      />

      <Route
        path="/submit-work/:id"
        element={
          <PrivateRoute>
            <SubmitWork />
          </PrivateRoute>
        }
      />

      {/* =====================================================
          PROFILE ROUTES
      ===================================================== */}

      {/* Logged-in user's own profile */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      {/* View another user's profile */}
      <Route
        path="/profile/:id"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      {/* =====================================================
          MESSAGES
      ===================================================== */}

      <Route
        path="/messages"
        element={
          <PrivateRoute>
            <Messages />
          </PrivateRoute>
        }
      />

      {/* =====================================================
          NOTIFICATIONS
      ===================================================== */}

      <Route
        path="/notifications"
        element={
          <PrivateRoute>
            <Notifications />
          </PrivateRoute>
        }
      />

      {/* =====================================================
          LEADERBOARD
      ===================================================== */}

      <Route
        path="/leaderboard"
        element={
          <PrivateRoute>
            <Leaderboard />
          </PrivateRoute>
        }
      />

      {/* =====================================================
          FALLBACK
      ===================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;