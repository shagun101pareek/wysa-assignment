import {
  AppBar,
  Toolbar,
  Box,
  Avatar,
  Stack,
  IconButton,
  Badge,
} from "@mui/material";

import Text from "./Text";

import LayersIcon from "@mui/icons-material/Layers";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function Navbar() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "white",
        color: "#111827",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <Toolbar
        sx={{
          maxWidth: "1200px",
          width: "100%",
          mx: "auto",
          py: 1.5,
          px: { xs: 2, md: 0 },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{
              bgcolor: "#8B5CF6",
              width: 40,
              height: 40,
            }}
          >
            <LayersIcon sx={{ fontSize: 22 }} />
          </Avatar>

          <Text component="h1" className="navbar-brand">
            Wellness Forms
          </Text>
        </Stack>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton size="small" sx={{ color: "#6B7280" }}>
            <Badge
              variant="dot"
              overlap="circular"
              sx={{
                "& .MuiBadge-badge": {
                  bgcolor: "#EF4444",
                  width: 8,
                  height: 8,
                  minWidth: 8,
                  borderRadius: "50%",
                  border: "2px solid white",
                  top: 4,
                  right: 4,
                },
              }}
            >
              <NotificationsNoneOutlinedIcon />
            </Badge>
          </IconButton>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box textAlign="right" sx={{ display: { xs: "none", sm: "block" } }}>
              <Text className="navbar-user-name">
                Alex Rivers
              </Text>
              <Text className="navbar-user-role">
                Patient Portal
              </Text>
            </Box>

            <Avatar
              sx={{
                bgcolor: "#F3F0FF",
                color: "#8B5CF6",
                width: 40,
                height: 40,
              }}
            >
              <PersonOutlineOutlinedIcon />
            </Avatar>

            <KeyboardArrowDownIcon sx={{ color: "#9CA3AF", fontSize: 20 }} />
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
