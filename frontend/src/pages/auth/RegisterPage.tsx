import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
  Container,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  // Redux auth state
  const { register, isLoading, error: authError } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    // Validation
    if (!name.trim()) {
      setLocalError("Vui lòng nhập tên");
      return;
    }

    if (!email.trim()) {
      setLocalError("Vui lòng nhập email");
      return;
    }

    if (password.length < 6) {
      setLocalError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Mật khẩu xác nhận không khớp");
      return;
    }

  // Call Redux register

    try {
      await register(name, email, password, name);
      navigate("/");
    } catch {
      // error from auth slice
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ py: 4 }}
      >
        {/* Logo/Title */}
        <Typography
          variant="h3"
          component="h1"
          sx={{
            mb: 4,
            fontWeight: "bold",
            color: "primary.main",
            textAlign: "center",
          }}
        >
          Trello Clone
        </Typography>

        <Card
          sx={{
            width: "100%",
            maxWidth: 400,
            boxShadow: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom textAlign="center">
              Đăng ký
            </Typography>

            {(localError || authError) && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {localError || authError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Tên của bạn"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                required
                autoComplete="name"
                autoFocus
                disabled={isLoading}
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                autoComplete="email"
                disabled={isLoading}
              />

              <TextField
                fullWidth
                label="Mật khẩu"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                autoComplete="new-password"
                disabled={isLoading}
                helperText="Tối thiểu 6 ký tự"
              />

              <TextField
                fullWidth
                label="Xác nhận mật khẩu"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
                required
                autoComplete="new-password"
                disabled={isLoading}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                {isLoading ? "Đang đăng ký..." : "Đăng ký"}
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  hoặc
                </Typography>
              </Divider>

              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Đã có tài khoản?{" "}
                  <Link
                    to="/auth/login"
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Đăng nhập
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default RegisterPage;