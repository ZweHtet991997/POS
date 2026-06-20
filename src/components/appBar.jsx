import { Box, Typography, Button, Avatar, Badge, IconButton, Dialog, DialogContent, Fade } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Menu, MenuItem, Divider } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SettingsIcon from "@mui/icons-material/Settings";
import StoreIcon from "@mui/icons-material/Store";
import LogoutIcon from "@mui/icons-material/Logout";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { clearAuth, getUserRole, getRawToken, decodeJWT } from "../utils/authUtils";
import { _DecryptService } from "../services/cryptoService";

// Helper to get initials from name
function getInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function AppBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [time, setTime] = useState(new Date());
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const open = Boolean(anchorEl);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute user info only when token changes (memoized)
  const userInfo = useMemo(() => {
    const rawToken = getRawToken();
    const payload = rawToken ? decodeJWT(rawToken) : null;

    // Only log when payload actually changes (helpful for debugging)
    if (payload) {
      console.log("Decoded JWT Payload:", payload);
    }

    let extractedName = "";

    if (payload?.UserName) {
      try {
        const decrypted = _DecryptService(payload.UserName);
        if (decrypted && decrypted.trim() !== "") {
          extractedName = decrypted;
        } else {
          extractedName = `User ${payload.UserId || ""}`;
        }
      } catch (err) {
        console.warn("Decryption failed for UserName:", err);
        extractedName = `User ${payload.UserId || ""}`;
      }
    } else if (payload?.UserId) {
      extractedName = `User ${payload.UserId}`;
    } else {
      extractedName = "User";
    }

    const formattedName = extractedName.toString().replace(/\b\w/g, (c) => c.toUpperCase());

    let userEmail = "";
    if (payload?.Email) {
      try {
        userEmail = _DecryptService(payload.Email);
      } catch (err) {
        userEmail = "";
      }
    }

    const role = getUserRole() === "admin" ? "Admin" : "Cashier";

    return {
      name: formattedName,
      email: userEmail,
      initials: getInitials(formattedName),
      role: role,
    };
  }, []); // Empty dependency array means it runs once on mount and never again

  const formattedTime = time.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const routeTitles = {
    "/": "Dashboard",
    "/sale": "New Sale",
    "/products": "Products",
    "/categories": "Categories",
    "/sub-categories": "Sub-Categories",
    "/WH_management": "Warehouse Management",
    "/WH_transfer": "Warehouse Transfer",
    "/inventory": "Inventory",
    "/customers": "Customers",
    "/transactions": "Transactions",
    "/reports": "Reports",
    "/users": "Users",
    "/settings": "Settings",
  };

  const currentTitle = routeTitles[location.pathname] || "Dashboard";

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const confirmLogout = () => {
    setLogoutDialog(false);
    clearAuth();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Box
        sx={{
          height: 65,
          px: { xs: 2, sm: 3 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #e2e8f0",
          background: "#ffffff",
          position: "sticky",
          top: 0,
        }}
      >
        {/* LEFT: TITLE */}
        <Box>
          <Typography sx={{ fontSize: { xs: "1rem", sm: "1.2rem" }, fontWeight: 600 }}>
            {currentTitle}
          </Typography>
          <Typography sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" }, color: "#526073" }}>
            {formattedTime}
          </Typography>
        </Box>

        {/* RIGHT: ACTIONS */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
          {/* Sale Buttons */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              onClick={() => navigate("/sale?type=wholesale")}
              sx={{
                textTransform: "none",
                borderRadius: "7px",
                background: "#123e54",
                fontSize: { xs: "0.7rem", sm: "0.85rem" },
                px: { xs: 1.2, sm: 2 },
                py: { xs: 0.6, sm: 1 },
                minWidth: "auto",
              }}
            >
              Whole Sale
            </Button>
            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              onClick={() => navigate("/sale?type=retail")}
              sx={{
                textTransform: "none",
                borderRadius: "7px",
                background: "#0f766e",
                fontSize: { xs: "0.7rem", sm: "0.85rem" },
                px: { xs: 1.2, sm: 2 },
                py: { xs: 0.6, sm: 1 },
                minWidth: "auto",
              }}
            >
              Retail Sale
            </Button>
          </Box>

          {/* Notifications */}
          <IconButton>
            <Badge badgeContent={0} color="warning">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* User Avatar & Dropdown */}
          <Box
            onClick={handleClick}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.6, sm: 1 },
              cursor: "pointer",
            }}
          >
            <Avatar sx={{ bgcolor: "#14445d", width: 36, height: 36 }}>
              <Typography sx={{ fontSize: "0.90rem", fontWeight: 500 }}>
                {userInfo.initials}
              </Typography>
            </Avatar>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
                {userInfo.name}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "#25303f" }}>
                {userInfo.role}
              </Typography>
            </Box>
            <KeyboardArrowDownIcon sx={{ color: "#64748b" }} />
          </Box>
        </Box>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              borderRadius: "18px",
              minWidth: 205,
              mt: 1,
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
            },
          }}
        >
          {/* Header */}
          <Box sx={{ px: 2.8, py: 0.8 }}>
            <Typography sx={{ fontWeight: 600, fontSize: "1rem", color: "#1e293b" }}>
              {userInfo.name}
            </Typography>
            <Typography sx={{ fontSize: "0.85rem", color: "#64748b" }}>
              {userInfo.email}
            </Typography>
          </Box>

          <Divider sx={{ mx: 2.5 }} />

          <MenuItem
            onClick={handleClose}
            sx={{ px: 2.5, py: 1.5, gap: 1.5, fontSize: "0.95rem", color: "#1e293b" }}
          >
            <SettingsIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
            Profile Settings
          </MenuItem>

          <MenuItem
            onClick={handleClose}
            sx={{ px: 2.5, py: 1.5, gap: 1.5, fontSize: "0.95rem", color: "#1e293b" }}
          >
            <StoreIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
            Shop Settings
          </MenuItem>

          <Divider sx={{ mx: 2.5 }} />

          <MenuItem
            onClick={() => {
              handleClose();
              setLogoutDialog(true);
            }}
            sx={{ px: 2.5, py: 1.5, gap: 1.5, fontSize: "0.95rem", color: "#ef4444" }}
          >
            <LogoutIcon sx={{ color: "#ef4444", fontSize: 20 }} />
            Sign Out
          </MenuItem>
        </Menu>
      </Box>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialog}
        onClose={() => setLogoutDialog(false)}
        TransitionComponent={Fade}
        transitionDuration={250}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            width: 360,
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ height: 5, background: "linear-gradient(90deg, #ef4444, #f97316)" }} />
          <Box sx={{ px: 3.5, pt: 3.5, pb: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "16px",
                background: "rgba(239,68,68,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <WarningAmberRoundedIcon sx={{ fontSize: 30, color: "#ef4444" }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: "1.15rem", color: "#0f172a", mb: 0.8 }}>
              Sign out of POS?
            </Typography>
            <Typography sx={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.6 }}>
              You're about to sign out as{" "}
              <Box component="span" sx={{ fontWeight: 600, color: "#0f172a" }}>
                {userInfo.name}
              </Box>
              . Any unsaved changes will be lost.
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, mt: 3.5 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setLogoutDialog(false)}
                sx={{
                  borderRadius: "10px",
                  py: 1.2,
                  borderColor: "#e2e8f0",
                  color: "#64748b",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "0.9rem",
                  "&:hover": { borderColor: "#94a3b8", background: "#f8fafc" },
                }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={confirmLogout}
                startIcon={<LogoutIcon sx={{ fontSize: 17 }} />}
                sx={{
                  borderRadius: "10px",
                  py: 1.2,
                  background: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "0.9rem",
                  boxShadow: "0 4px 14px rgba(239,68,68,0.35)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
                    boxShadow: "0 6px 18px rgba(239,68,68,0.45)",
                  },
                }}
              >
                Yes, Sign Out
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}