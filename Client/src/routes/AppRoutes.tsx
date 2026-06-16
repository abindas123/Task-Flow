import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import ProtectedRoute from "./ProtectedRoutes";

import WorkspaceListPage from "../pages/workspace/workspcelist";
import ProjectListPage from "../pages/project/projectlist";
import ProjectDetailPage from "../pages/project/projectdetails";
import TaskDetailPage from "../pages/task/taskdetail";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/workspaces"
          element={
            <ProtectedRoute>
              <WorkspaceListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workspaces/:workspaceId/projects"
          element={
            <ProtectedRoute>
              <ProjectListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workspaces/:workspaceId/projects/:projectId"
          element={
            <ProtectedRoute>
              <ProjectDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workspaces/:workspaceId/projects/:projectId/tasks/:taskId"
          element={
            <ProtectedRoute>
              <TaskDetailPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;