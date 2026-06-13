import { useState } from "react";
import { Button, Stack, TextField, Alert } from "@mui/material";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { REGISTER_USER } from "../../graphql/mutations/authmutations";


type RegisterResponse = {
  registerUser: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
};

type RegisterVariables = {
  name: string;
  email: string;
  password: string;
};

function SignupForm() {
  const navigate = useNavigate();
  

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [registerUserMutation, { loading, error }] =
    useMutation<RegisterResponse, RegisterVariables>(REGISTER_USER);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    const response = await registerUserMutation({
      variables: {
        name,
        email,
        password,
      },
    });

    

    if (response.data?.registerUser) {
    
      navigate("/login");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error.message}</Alert>}

        <TextField
          label="Name"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
      </Stack>
    </form>
  );
}

export default SignupForm;