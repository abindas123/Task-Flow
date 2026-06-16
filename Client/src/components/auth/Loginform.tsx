import { useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";

import { LOGIN_USER } from "../../graphql/mutations/authmutations";
import { useAuth } from "../../context/Authcontext";

const DEMO_EMAIL = "demo@taskflow.com";
const DEMO_PASSWORD = "Demo@123";

type LoginResponse = {
  loginUser: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
};

type LoginVariables = {
  email: string;
  password: string;
};

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [localError, setLocalError] = useState("");

  const [loginUser, { loading, error }] =
    useMutation<LoginResponse, LoginVariables>(LOGIN_USER);

  async function loginWithCredentials(loginEmail: string, loginPassword: string) {
    setLocalError("");

    try {
      const response = await loginUser({
        variables: {
          email: loginEmail,
          password: loginPassword,
        },
      });

      const token = response.data?.loginUser?.token;
      const user = response.data?.loginUser?.user;

      if (!token || !user) {
        setLocalError("Login failed. Please check your credentials.");
        return;
      }

      login(token, user);
      navigate("/workspaces");
    } catch {
      setLocalError("Login failed. Please try again.");
    }
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim()) {
      setLocalError("Email is required.");
      return;
    }

    if (!password.trim()) {
      setLocalError("Password is required.");
      return;
    }

    await loginWithCredentials(email.trim(), password);
  }

  async function handleDemoLogin() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);

    await loginWithCredentials(DEMO_EMAIL, DEMO_PASSWORD);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack sx={{ gap: 2 }}>
        {localError && <Alert severity="warning">{localError}</Alert>}

        {error && (
          <Alert severity="error">
            Login failed. {error.message}
          </Alert>
        )}

        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          autoComplete="email"
          placeholder="demo@taskflow.com"
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          autoComplete="current-password"
          placeholder="Demo@123"
        />

        <Button
          variant="contained"
          type="submit"
          disabled={loading}
          sx={{
            py: 1.2,
            fontWeight: 700,
          }}
        >
          {loading ? <CircularProgress size={22} /> : "Login"}
        </Button>

        <Button
          variant="outlined"
          type="button"
          disabled={loading}
          onClick={handleDemoLogin}
          sx={{
            py: 1.2,
            fontWeight: 700,
          }}
        >
          {loading ? "Opening demo..." : "Try Demo Account"}
        </Button>

        <Typography
          sx={{
            color: "text.secondary",
            fontSize: "0.85rem",
            textAlign: "center",
          }}
        >
          Demo: demo@taskflow.com / Demo@123
        </Typography>
      </Stack>
    </form>
  );
}

export default LoginForm;