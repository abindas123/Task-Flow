import type { ReactNode } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import WorkspacesIcon from "@mui/icons-material/Workspaces";

import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

type Props = {
  children: ReactNode;
};

function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TaskAltIcon />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.1,
                  }}
                >
                  Task Flow
                </Typography>

                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.75rem",
                  }}
                >
                  Project Management
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                gap: 1,
              }}
            >
              <Button
                startIcon={<WorkspacesIcon />}
                onClick={() => navigate("/workspaces")}
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                  fontWeight: 700,
                }}
              >
                Workspaces
              </Button>

              <Stack
                direction="row"
                sx={{
                  alignItems: "center",
                  gap: 1,
                  display: { xs: "none", md: "flex" },
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "primary.main",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </Avatar>

                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      lineHeight: 1.1,
                    }}
                  >
                    {user?.name || "Demo User"}
                  </Typography>

                  <Typography
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.75rem",
                    }}
                  >
                    {user?.email}
                  </Typography>
                </Box>
              </Stack>

              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  fontWeight: 700,
                }}
              >
                Logout
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Box
        component="main"
        sx={{
          py: 4,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default ProtectedRoute;