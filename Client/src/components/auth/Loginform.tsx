
import { Button, Stack, TextField, Alert } from "@mui/material";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { LOGIN_USER } from "../../graphql/mutations/authmutations";
import { useState} from "react";
import { useAuth } from "../../context/Authcontext";

function LoginForm() {
  const{login}=useAuth()
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const [loginUser, { loading, error }] =
  useMutation<LoginResponse, LoginVariables>(LOGIN_USER);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    const response = await loginUser({
      variables: {
        email,
        password,
      },
    });

    const token = response.data?.loginUser?.token;
    const user=response.data?.loginUser?.user;

    if (token&&user) {
     login(token,user)
      navigate("/workspaces");
    }
  }

  return (
    
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error.message}</Alert>}

        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Stack>
    </form>
    
  )
}


export default LoginForm;