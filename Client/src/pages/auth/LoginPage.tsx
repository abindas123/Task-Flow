import {
  Box,
  Chip,
  Container,
  Divider,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { Link as RouterLink } from "react-router-dom";
import LoginForm from "../../components/auth/Loginform";

function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              minHeight: { md: 620 },
            }}
          >
            <Box
              sx={{
                flex: 1,
                p: { xs: 4, md: 6 },
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Stack sx={{ gap: 3 }}>
                <Chip
                  label="Full-stack project demo"
                  sx={{
                    alignSelf: "flex-start",
                    bgcolor: "primary.contrastText",
                    color: "primary.main",
                    fontWeight: 700,
                  }}
                />

                <Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      mb: 2,
                    }}
                  >
                    Task Flow
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      lineHeight: 1.4,
                      opacity: 0.95,
                    }}
                  >
                    Project management platform for teams.
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    fontSize: "1.05rem",
                    lineHeight: 1.8,
                    opacity: 0.9,
                    maxWidth: 520,
                  }}
                >
                  Build workspaces, projects, tasks, comments, dependencies,
                  and activity logs using React, TypeScript, GraphQL, Node.js,
                  and PostgreSQL.
                </Typography>

                <Stack
                  direction="row"
                  sx={{
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Chip label="React" />
                  <Chip label="TypeScript" />
                  <Chip label="GraphQL" />
                  <Chip label="PostgreSQL" />
                  <Chip label="Task Dependencies" />
                </Stack>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "rgba(255,255,255,0.12)",
                    color: "primary.contrastText",
                    border: "1px solid rgba(255,255,255,0.25)",
                  }}
                >
                  <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                    Recruiter demo account
                  </Typography>

                  <Typography sx={{ opacity: 0.9, fontSize: "0.95rem" }}>
                    Use the demo button on the right to enter a pre-filled
                    workspace with projects, tasks, comments, dependencies, and
                    activity logs.
                  </Typography>
                </Paper>
              </Stack>
            </Box>

            <Box
              sx={{
                width: { xs: "100%", md: 460 },
                p: { xs: 4, md: 5 },
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    mb: 1,
                  }}
                >
                  Welcome back
                </Typography>

                <Typography
                  sx={{
                    color: "text.secondary",
                    mb: 3,
                    lineHeight: 1.7,
                  }}
                >
                  Login to manage workspaces, projects, tasks, comments, and
                  dependencies.
                </Typography>

                <LoginForm />

                <Divider sx={{ my: 3 }} />

                <Typography
                  sx={{
                    color: "text.secondary",
                    textAlign: "center",
                  }}
                >
                  Don&apos;t have an account?{" "}
                  <Link
                    component={RouterLink}
                    to="/signup"
                    sx={{ fontWeight: 700 }}
                  >
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginPage;