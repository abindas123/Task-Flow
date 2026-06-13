import { Box, Container, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Loginform from "../../components/auth/Loginform";

function LoginPage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt:10, p:4, boxShadow:3, borderRadius:2}}>
        <Typography variant="h5"sx={{ mb:3}}>
          Login
        </Typography>

        <Loginform />

        <Typography sx={{mt:2}}>
          Dont have an account?{" "}
          <Link component={RouterLink} to="/signup">
            Sign up
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default LoginPage;