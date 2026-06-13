import { Box, Container, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import SignupForm from "../../components/auth/Registerform";

function SignupPage() {
  return (
    <Container maxWidth="sm">
  <Box
    sx={{
      mt: 10,
      p: 4,
      boxShadow: 3,
      borderRadius: 2,
    }}
  >
    <Typography variant="h5" sx={{ mb: 3 }}>
      Sign Up
    </Typography>

    <SignupForm />

    <Typography sx={{ mt: 2 }}>
      Already have an account?{" "}
      <Link component={RouterLink} to="/login">
        Login
      </Link>
    </Typography>
  </Box>
</Container>
  );
}

export default SignupPage;