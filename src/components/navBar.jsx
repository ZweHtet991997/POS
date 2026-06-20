import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  Fade,
  Button,
} from "@mui/material";

import {
  Dashboard,
  PointOfSale,
  Inventory2,
  Category,
  Storage,
  People,
  ReceiptLong,
  BarChart,
  Settings,
} from "@mui/icons-material";

import ListAltIcon                  from "@mui/icons-material/ListAlt";
import ExpandLess                   from "@mui/icons-material/ExpandLess";
import ExpandMore                   from "@mui/icons-material/ExpandMore";
import LogoutIcon                   from "@mui/icons-material/Logout";
import WarningAmberRoundedIcon      from "@mui/icons-material/WarningAmberRounded";
import KeyboardDoubleArrowLeftIcon  from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

import { Collapse }              from "@mui/material";
import { useState, useMemo }     from "react";
import { useNavigate, useLocation } from "react-router-dom";

import logo from "../assets/logo.png";
import { clearAuth, getUserRole, decodeJWT, getRawToken } from "../utils/authUtils";

/* ── initials helper ── */
function getInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

/* ── menu definition ── */
const ALL_MENU_ITEMS = [
  { text: "Dashboard",   path: "/dashboard",   icon: <Dashboard   fontSize="small" />, adminOnly: true  },
  { text: "New Sale",    path: "/sale", navigateTo: "/sale?type=retail", icon: <PointOfSale fontSize="small" />, adminOnly: false },
  { text: "Products",    path: "/products",     icon: <Inventory2  fontSize="small" />, adminOnly: true  },
  { text: "Customers",   path: "/customers",    icon: <People      fontSize="small" />, adminOnly: true  },
  {
    text: "Categories",
    icon: <Category fontSize="small" />,
    adminOnly: true,
    children: [
      { text: "Categories",     path: "/categories"     },
      { text: "Sub-Categories", path: "/sub-categories" },
    ],
  },
  {
    text: "Warehouse",
    icon: <Storage fontSize="small" />,
    adminOnly: true,
    children: [
      { text: "Warehouse Management", path: "/WH_management" },
      { text: "Warehouse Transfer",   path: "/WH_transfer"   },
    ],
  },
  { text: "Inventory",    path: "/inventory",    icon: <ListAltIcon fontSize="small" />, adminOnly: true },
  { text: "Transactions", path: "/transactions", icon: <ReceiptLong fontSize="small" />, adminOnly: true },
  { text: "Reports",      path: "/reports",      icon: <BarChart    fontSize="small" />, adminOnly: true },
  { text: "Users",        path: "/users",         icon: <People     fontSize="small" />, adminOnly: true },
  { text: "Settings",     path: "/settings",     icon: <Settings    fontSize="small" />, adminOnly: true },
];

/* ════════════════════════════════════════════ */
export default function NavBar() {
  const [collapsed,     setCollapsed]     = useState(false);
  const [openMenus,     setOpenMenus]     = useState({});
  const [logoutDialog,  setLogoutDialog]  = useState(false);   // ← new

  const navigate = useNavigate();
  const location = useLocation();

  /* auth info */
  const role    = getUserRole();
  const isAdmin = role === "admin";

  const userInfo = useMemo(() => {
    const raw = getRawToken();
    if (!raw) return { name: "User", role: role ?? "cashier", initials: "US" };
    const payload   = decodeJWT(raw);
    const name      = payload?.name || payload?.username || payload?.email || "User";
    const display   = payload?.name || payload?.username || name;
    const roleLabel = isAdmin ? "Administrator" : "Cashier";
    return { name: display, role: roleLabel, initials: getInitials(display) };
  }, [isAdmin, role]);

  const menuItems = useMemo(
    () => ALL_MENU_ITEMS.filter((item) => isAdmin || !item.adminOnly),
    [isAdmin]
  );

  /* logout handlers */
  const confirmLogout = () => {
    setLogoutDialog(false);
    clearAuth();
    navigate("/login", { replace: true });
  };

  /* ── render ── */
  return (
    <>
      <Box
        sx={{
          width: collapsed ? 70 : 242,
          minWidth: collapsed ? 70 : 242,
          transition: "width 0.3s ease, min-width 0.3s ease",
          height: "100vh",
          background: "linear-gradient(180deg, #0d2b3e 0%, #0f3347 60%, #0d2f42 100%)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          boxShadow: "1px 0 12px rgba(0,0,0,0.3)",
          position: "sticky",
          top: 0, left: 0,
          zIndex: 1200,
          overflowY: "auto",
        }}
      >
        {/* ══ HEADER ══ */}
        <Box
          sx={{
            display: "flex",
            flexDirection: collapsed ? "column" : "row",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            px: collapsed ? 1 : 2,
            py: 1,
            minHeight: 49,
            borderBottom: "1.3px solid rgba(255,255,255,0.07)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexDirection: collapsed ? "column" : "row" }}>
            <Avatar
              src={logo}
              sx={{ width: 38, height: 38, bgcolor: "#1a3f55", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: "10px" }}
            />
            {!collapsed && (
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.02em", lineHeight: 1.2, color: "#fff" }}>
                  KBS IMPEX
                </Typography>
                <Typography sx={{ fontSize: "0.72rem", color: "#22c55e", fontWeight: 550, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  POS System
                </Typography>
              </Box>
            )}
          </Box>
          <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ color: "#94a3b8", mt: collapsed ? 0.8 : 0 }}>
            {collapsed ? <KeyboardDoubleArrowRightIcon /> : <KeyboardDoubleArrowLeftIcon />}
          </IconButton>
        </Box>

        {/* ══ MENU ══ */}
        <List sx={{ mt: collapsed ? 0 : 0.5, px: collapsed ? 0.75 : 1, flexGrow: 1, overflowY: "auto", overflowX: "hidden", "&::-webkit-scrollbar": { width: 0 } }}>
          {menuItems.map((item, index) => {
            const isParent      = !!item.children;
            const isOpen        = openMenus[item.text];
            const isActive      = !isParent && location.pathname === item.path;
            const isParentActive = isParent && item.children.some((c) => location.pathname === c.path);

            return (
              <Box key={index}>
                <Tooltip title={collapsed ? item.text : ""} placement="right" arrow>
                  <ListItemButton
                    onClick={() => {
                      if (isParent) {
                        setOpenMenus((prev) => ({ ...prev, [item.text]: !prev[item.text] }));
                      } else {
                        navigate(item.navigateTo ?? item.path);
                      }
                    }}
                    sx={{
                      mb: 0.3, borderRadius: "10px",
                      background: isActive || isParentActive
                        ? "linear-gradient(135deg, #2a7c6f 0%, #236b5e 100%)" : "transparent",
                      "&:hover": {
                        background: isActive || isParentActive
                          ? "linear-gradient(135deg, #2a7c6f 0%, #236b5e 100%)" : "rgba(255,255,255,0.06)",
                      },
                      px: collapsed ? 0 : 1.5, py: 0.85,
                      justifyContent: collapsed ? "center" : "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: collapsed ? 0 : 1.5 }}>
                      <ListItemIcon sx={{ color: "rgba(255,255,255,0.6)", minWidth: 0, justifyContent: "center" }}>
                        {item.icon}
                      </ListItemIcon>
                      {!collapsed && (
                        <ListItemText
                          primary={item.text}
                          primaryTypographyProps={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}
                        />
                      )}
                    </Box>
                    {!collapsed && isParent && (isOpen ? <ExpandLess /> : <ExpandMore />)}
                  </ListItemButton>
                </Tooltip>

                {isParent && (
                  <Collapse in={isOpen && !collapsed} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children.map((sub, subIndex) => {
                        const subActive = location.pathname === sub.path;
                        return (
                          <ListItemButton
                            key={subIndex}
                            onClick={() => navigate(sub.path)}
                            sx={{
                              pl: 4, py: 0.6, borderRadius: "8px",
                              background: subActive ? "rgba(34,197,94,0.15)" : "transparent",
                              "&:hover": { background: "rgba(255,255,255,0.06)" },
                            }}
                          >
                            <ListItemText
                              primary={sub.text}
                              primaryTypographyProps={{ fontSize: "0.8rem", color: subActive ? "#22c55e" : "rgba(255,255,255,0.55)" }}
                            />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </List>

        {/* ══ USER + LOGOUT ══ */}
        <Box
          sx={{
            px: collapsed ? 1 : 1.5, py: 1.5,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Avatar sx={{ bgcolor: "#1f6f5f", width: 36, height: 36, fontSize: "0.8rem", fontWeight: 700, flexShrink: 0 }}>
              {userInfo.initials}
            </Avatar>
            {!collapsed && (
              <Box>
                <Typography sx={{ fontSize: "0.89rem", fontWeight: 600, color: "rgba(255,255,255,0.9)", lineHeight: 1.3, whiteSpace: "nowrap" }}>
                  {userInfo.name}
                </Typography>
                <Typography sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap" }}>
                  {userInfo.role}
                </Typography>
              </Box>
            )}
          </Box>

          <Tooltip title="Logout" placement={collapsed ? "right" : "top"} arrow>
            <IconButton
              onClick={() => setLogoutDialog(true)}
              sx={{
                color: "rgba(255,255,255,0.35)", p: 0.8, borderRadius: "8px",
                "&:hover": { color: "#f87171", background: "rgba(248,113,113,0.12)" },
                transition: "color 0.2s, background 0.2s",
              }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* ══════════════════════════════════════
          LOGOUT CONFIRMATION DIALOG
      ══════════════════════════════════════ */}
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
          {/* top accent bar */}
          <Box sx={{ height: 5, background: "linear-gradient(90deg, #ef4444, #f97316)" }} />

          <Box sx={{ px: 3.5, pt: 3.5, pb: 3 }}>
            {/* icon */}
            <Box
              sx={{
                width: 56, height: 56, borderRadius: "16px",
                background: "rgba(239,68,68,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                mb: 2,
              }}
            >
              <WarningAmberRoundedIcon sx={{ fontSize: 30, color: "#ef4444" }} />
            </Box>

            {/* text */}
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

            {/* buttons */}
            <Box sx={{ display: "flex", gap: 1.5, mt: 3.5 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setLogoutDialog(false)}
                sx={{
                  borderRadius: "10px", py: 1.2,
                  borderColor: "#e2e8f0", color: "#64748b",
                  fontWeight: 600, textTransform: "none", fontSize: "0.9rem",
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
                  borderRadius: "10px", py: 1.2,
                  background: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
                  fontWeight: 600, textTransform: "none", fontSize: "0.9rem",
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
