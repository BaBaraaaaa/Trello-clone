import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  TextField,
  Button,
  Divider,
  Stack,
  Paper,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [saveMessage, setSaveMessage] = useState("");

  const handleEditClick = () => {
    setIsEditing(true);
    setSaveMessage("");
  };

  const handleSaveClick = () => {
    // Simulate save - replace with actual API call
    setIsEditing(false);
    setSaveMessage("Thông tin đã được cập nhật thành công!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
    setSaveMessage("");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      {/* Header */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: "linear-gradient(135deg, rgba(2, 106, 167, 0.1) 0%, rgba(90, 172, 68, 0.1) 100%)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar
            src={user?.avatar}
            sx={{ 
              width: 80, 
              height: 80,
              border: "4px solid",
              borderColor: "primary.main",
              fontSize: "2rem",
              fontWeight: 700,
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Hồ sơ cá nhân
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Quản lý thông tin tài khoản của bạn
            </Typography>
          </Box>
          {!isEditing ? (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEditClick}
              sx={{ minWidth: 120 }}
            >
              Chỉnh sửa
            </Button>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveClick}
                color="success"
              >
                Lưu
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancelClick}
                color="error"
              >
                Hủy
              </Button>
            </Stack>
          )}
        </Stack>
      </Paper>

      {/* Success Message */}
      {saveMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {saveMessage}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
        {/* Personal Information */}
        <Box sx={{ flex: 2 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Thông tin cá nhân
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Stack spacing={3}>
                {/* Name Field */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PersonIcon fontSize="small" />
                    Họ và tên
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      variant="outlined"
                      placeholder="Nhập họ và tên"
                    />
                  ) : (
                    <Typography variant="body1" sx={{ p: 1.5, bgcolor: "background.default", borderRadius: 1 }}>
                      {user?.name || "Chưa cập nhật"}
                    </Typography>
                  )}
                </Box>

                {/* Email Field */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <EmailIcon fontSize="small" />
                    Email
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      variant="outlined"
                      placeholder="Nhập địa chỉ email"
                    />
                  ) : (
                    <Typography variant="body1" sx={{ p: 1.5, bgcolor: "background.default", borderRadius: 1 }}>
                      {user?.email || "Chưa cập nhật"}
                    </Typography>
                  )}
                </Box>

                {/* Member Since */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarIcon fontSize="small" />
                    Thành viên từ
                  </Typography>
                  <Typography variant="body1" sx={{ p: 1.5, bgcolor: "background.default", borderRadius: 1 }}>
                    {new Date().toLocaleDateString("vi-VN")}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Statistics */}
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Thống kê hoạt động
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Stack spacing={2}>
                <Box sx={{ textAlign: "center", p: 2, bgcolor: "primary.main", color: "white", borderRadius: 2 }}>
                  <Typography variant="h4" fontWeight={700}>
                    5
                  </Typography>
                  <Typography variant="body2">
                    Boards đã tạo
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "center", p: 2, bgcolor: "secondary.main", color: "white", borderRadius: 2 }}>
                  <Typography variant="h4" fontWeight={700}>
                    23
                  </Typography>
                  <Typography variant="body2">
                    Cards hoàn thành
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "center", p: 2, bgcolor: "info.main", color: "white", borderRadius: 2 }}>
                  <Typography variant="h4" fontWeight={700}>
                    12
                  </Typography>
                  <Typography variant="body2">
                    Ngày hoạt động
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;