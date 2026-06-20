import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Checkbox,
  FormControlLabel,
  useMediaQuery,
  InputAdornment,
  IconButton,
  Tab,
  Tabs,
  Dialog,
  DialogContent,
  Fade,
  Alert,
  CircularProgress,
} from "@mui/material";
import { FlashOn as FlashOnIcon } from "@mui/icons-material";
import ShieldIcon                  from "@mui/icons-material/Shield";
import BarChartIcon                from "@mui/icons-material/BarChart";
import LaptopIcon                  from "@mui/icons-material/Laptop";
import AdminPanelSettingsIcon      from "@mui/icons-material/AdminPanelSettings";
import PointOfSaleIcon             from "@mui/icons-material/PointOfSale";
import EmailOutlinedIcon           from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon            from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon      from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon   from "@mui/icons-material/VisibilityOffOutlined";
import LoginIcon                   from "@mui/icons-material/Login";
import { useNavigate }             from "react-router-dom";
import logo                        from "../assets/logo.png";
import { _EncryptService }         from "../services/cryptoService";
import { decodeJWT }               from "../utils/authUtils";
import { API_V1_BASE_URL }         from "../api/config";

/* ─────────────────────── constants ─────────────────────── */
const LOGIN_URL = `${API_V1_BASE_URL}/login`;

const features = [
  { icon: <FlashOnIcon  sx={{ fontSize: 18 }} />, label: "Ultra-fast cashier checkout flow",    color: "#fbbf24" },
  { icon: <ShieldIcon   sx={{ fontSize: 18 }} />, label: "Secure role-based access control",    color: "#34d399" },
  { icon: <BarChartIcon sx={{ fontSize: 18 }} />, label: "Real-time sales & inventory insights", color: "#818cf8" },
  { icon: <LaptopIcon   sx={{ fontSize: 18 }} />, label: "Works on desktop & tablet",            color: "#38bdf8" },
];

const GREEN  = "#0a7c5c";
const GREEN2 = "#10b981";

/* ═══════════════════════════════════════════════════════════ */
export default function Login() {
  const [role,         setRole]         = useState(0);   // 0 = Admin tab, 1 = Cashier tab
  const [email,        setEmail]        = useState("zwehtet144@gmail.com");
  const [password,     setPassword]     = useState("SAdmin@123");
  const [remember,     setRemember]     = useState(false);
  const [showPwd,      setShowPwd]      = useState(false);
  const [openContact,  setOpenContact]  = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  const isMobile = useMediaQuery("(max-width:900px)");
  const navigate  = useNavigate();

  /* ─── submit ─── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(LOGIN_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Login failed. Please check your credentials.");
      }

      // ── Extract token (handle common API response shapes) ──
      const token =
        data?.token        ||
        data?.access_token ||
        data?.data?.token  ||
        data?.data?.access_token;

      if (!token) {
        throw new Error("No token received from server.");
      }

      // ── Decode JWT payload to read the role ──
      const payload  = decodeJWT(token);
      const rawRole  = (
        payload?.role      ||
        payload?.Role      ||
        payload?.user_role ||
        payload?.userRole  ||
        ""
      ).toLowerCase();

      const userRole = rawRole === "cashier" ? "cashier" : "admin";

      // ── Encrypt token before persisting ──
      const encryptedToken = _EncryptService(token);

      // ── Persist in sessionStorage ──
      sessionStorage.setItem("pos_token", encryptedToken);
      sessionStorage.setItem("pos_role",  userRole);

      // ── Optionally persist email for "Remember me" ──
      if (remember) {
        localStorage.setItem("pos_remembered_email", email);
      } else {
        localStorage.removeItem("pos_remembered_email");
      }

      // ── Route based on role ──
      if (userRole === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/sale?type=retail");
      }

    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────── render ─────────────────────── */
  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%", overflow: "hidden" }}>

      {/* ══════════════ LEFT PANEL ══════════════ */}
      {!isMobile && (
        <Box
          sx={{
            flex: "0 0 45%",
            background: "linear-gradient(160deg, #071320 0%, #0b1f30 60%, #0d2a20 100%)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            px: 6,
            overflow: "hidden",
          }}
        >
          {/* glow orb */}
          <Box sx={{
            position: "absolute", top: -140, left: -140,
            width: 480, height: 480, borderRadius: "50%",
            background: "radial-gradient(circle,rgba(16,185,129,.18) 0%,transparent 70%)",
            "@keyframes pulse": {
              "0%,100%": { transform: "scale(1)",   opacity: .8 },
              "50%":      { transform: "scale(1.1)", opacity: 1  },
            },
            animation: "pulse 6s ease-in-out infinite",
          }} />

          {/* content */}
          <Box sx={{ position: "relative", zIndex: 1, textAlign: "center", width: "100%", maxWidth: 360 }}>
            {/* Logo */}
            <Box sx={{
              "@keyframes float": {
                "0%,100%": { transform: "translateY(0)"      },
                "50%":      { transform: "translateY(-10px)" },
              },
              animation: "float 4s ease-in-out infinite",
              mb: 0.8,
            }}>
              <img
                src={logo}
                alt="OneBurma POS Logo"
                style={{ width: 130, height: 130, objectFit: "contain", filter: "drop-shadow(0 0 22px rgba(16,185,129,.55))" }}
              />
            </Box>

            <Typography sx={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700, fontSize: "1.9rem", color: "#fff",
              letterSpacing: "-.02em", mb: .4,
            }}>
              KBS IMPEX POS
            </Typography>

            <Typography sx={{
              fontSize: ".72rem", fontWeight: 600, letterSpacing: ".18em",
              textTransform: "uppercase", color: GREEN2, mb: 3.5,
            }}>
              Smart Business Platform
            </Typography>

            {/* Features list */}
            <Box sx={{ textAlign: "left" }}>
              {features.map((f, i) => (
                <Box key={i} sx={{
                  display: "flex", alignItems: "center", gap: 1.5,
                  py: 1, borderBottom: "1px solid rgba(255,255,255,.05)",
                  "@keyframes fadeUp": {
                    from: { opacity: 0, transform: "translateY(10px)" },
                    to:   { opacity: 1, transform: "translateY(0)"    },
                  },
                  animation: `fadeUp .5s ease ${i * .1 + .1}s both`,
                }}>
                  <Box sx={{
                    width: 34, height: 34, borderRadius: "10px", flexShrink: 0,
                    background: `${f.color}1a`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: f.color,
                  }}>
                    {f.icon}
                  </Box>
                  <Typography sx={{ color: "#7a9ab8", fontSize: ".88rem" }}>
                    {f.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* footer */}
          <Typography sx={{
            position: "absolute", bottom: 20,
            fontSize: "20", color: "rgba(120,160,190,.4)",
            textAlign: "center", letterSpacing: ".02em",
          }}>
             Version 1.0.0
          </Typography>
        </Box>
      )}

      {/* ══════════════ RIGHT PANEL ══════════════ */}
      <Box sx={{
        flex: 1, background: "#f1f5f9",
        display: "flex", alignItems: "center", justifyContent: "center",
        p: { xs: 3, sm: 6 },
      }}>
        <Paper
          elevation={0}
          sx={{
            width: "100%", maxWidth: 460,
            borderRadius: "24px",
            p: { xs: "2.5rem 2rem", sm: "3.5rem 3.5rem" },
            boxShadow: "0 4px 40px rgba(0,0,0,.07), 0 1px 4px rgba(0,0,0,.04)",
            "@keyframes cardIn": {
              from: { opacity: 0, transform: "translateY(20px)" },
              to:   { opacity: 1, transform: "translateY(0)"    },
            },
            animation: "cardIn .5s cubic-bezier(.22,1,.36,1) both",
          }}
        >
          {/* Mobile logo */}
          {isMobile && (
            <Box sx={{ textAlign: "center", mb: 2.5 }}>
              <img src={logo} alt="OneBurma POS" style={{ width: 64, height: 64, objectFit: "contain" }} />
            </Box>
          )}

          <Typography variant="h4" sx={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, color: "#0f172a", mb: .6 }}>
            Welcome Back
          </Typography>
          <Typography sx={{ fontSize: ".92rem", color: "#94a3b8", mb: 3.5 }}>
            Sign in to your account to continue
          </Typography>

          {/* Role tabs */}
          <Tabs
            value={role}
            onChange={(_, v) => { setRole(v); setError(""); }}
            variant="fullWidth"
            sx={{
              mb: 3.5, background: "#f1f5f9", borderRadius: "12px", p: "4px",
              minHeight: "unset",
              "& .MuiTabs-indicator": { display: "none" },
              "& .MuiTab-root": {
                minHeight: 44, borderRadius: "9px", fontSize: ".85rem",
                fontWeight: 500, textTransform: "none", color: "#64748b", transition: "all .2s",
              },
              "& .Mui-selected": {
                background: "#fff", color: "#0f172a !important",
                boxShadow: "0 1px 6px rgba(0,0,0,.1)",
              },
            }}
          >
            <Tab icon={<AdminPanelSettingsIcon sx={{ fontSize: 17 }} />} iconPosition="start" label="Admin / Manager" />
            <Tab icon={<PointOfSaleIcon        sx={{ fontSize: 17 }} />} iconPosition="start" label="Cashier" />
          </Tabs>

          {/* Error alert */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2.5, borderRadius: "10px", fontSize: ".85rem" }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 0 ? "admin@oneburma.com" : "cashier@oneburma.com"}
              required
              disabled={loading}
              sx={inputSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ fontSize: 17, color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
              sx={{ ...inputSx, mt: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ fontSize: 17, color: "#94a3b8" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPwd(p => !p)} edge="end" disabled={loading}>
                      {showPwd
                        ? <VisibilityOffOutlinedIcon sx={{ fontSize: 17, color: "#94a3b8" }} />
                        : <VisibilityOutlinedIcon   sx={{ fontSize: 17, color: "#94a3b8" }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2.5, mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    disabled={loading}
                    sx={{ color: "#cbd5e1", "&.Mui-checked": { color: GREEN } }}
                  />
                }
                label={<Typography sx={{ fontSize: ".84rem", color: "#64748b" }}>Remember me</Typography>}
              />
              {/* <Typography
                component="span"
                onClick={() => navigate("/forgot-password")}
                sx={{
                  fontSize: ".84rem", color: GREEN, fontWeight: 500,
                  cursor: "pointer", "&:hover": { color: GREEN2 },
                }}
              >
                Forgot password?
              </Typography> */}
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={17} color="inherit" /> : <LoginIcon />}
              sx={{
                py: 1.6, borderRadius: "12px",
                background: `linear-gradient(135deg, ${GREEN} 0%, #0d9e72 100%)`,
                fontFamily: "'Sora', sans-serif", fontWeight: 600,
                fontSize: ".95rem", textTransform: "none", letterSpacing: ".01em",
                boxShadow: "0 4px 16px rgba(10,124,92,.35)",
                transition: "all .2s",
                "&:hover": {
                  background: `linear-gradient(135deg, #0d9e72 0%, ${GREEN2} 100%)`,
                  boxShadow: "0 6px 22px rgba(10,124,92,.45)",
                  transform: "translateY(-1px)",
                },
                "&:active": { transform: "translateY(0)" },
                "&.Mui-disabled": { opacity: .7, color: "#fff" },
              }}
            >
              {loading
                ? "Signing in…"
                : role === 0 ? "Sign In as Admin" : "Sign In as Cashier"}
            </Button>
          </Box>

          {/* <Typography sx={{ textAlign: "center", mt: 3, fontSize: ".85rem", color: "#94a3b8" }}>
            Having trouble signing in?{" "}
            <Typography
              component="span"
              onClick={() => setOpenContact(true)}
              sx={{
                color: GREEN, fontWeight: 500, cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Contact support
            </Typography>
          </Typography> */}

          {/* ── Contact Support Dialog ── */}
          <Dialog
            open={openContact}
            onClose={() => setOpenContact(false)}
            fullWidth maxWidth="xs"
            TransitionComponent={Fade}
            PaperProps={{
              sx: {
                borderRadius: "24px", overflow: "hidden",
                background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                boxShadow: "0 30px 80px rgba(0,0,0,.2)",
              },
            }}
          >
            <Box sx={{
              background: "linear-gradient(135deg, #0a7c5c 0%, #10b981 100%)",
              px: 3, py: 2.2, display: "flex", alignItems: "center", gap: 1.5,
            }}>
              <Box sx={{
                width: 38, height: 38, borderRadius: "12px",
                background: "rgba(255,255,255,.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(6px)",
              }}>
                <EmailOutlinedIcon sx={{ color: "#fff", fontSize: 20 }} />
              </Box>
              <Box>
                <Typography sx={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#fff", fontSize: "1rem" }}>
                  Contact Support
                </Typography>
                <Typography sx={{ fontSize: ".72rem", color: "rgba(255,255,255,.75)" }}>
                  We're here to help you
                </Typography>
              </Box>
            </Box>

            <DialogContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: ".85rem", color: "#64748b", mb: 2.2 }}>
                Describe your issue and our team will respond shortly.
              </Typography>

              <TextField
                fullWidth label="Your Email" size="small" sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ fontSize: 17, color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth label="Message" multiline rows={4} size="small"
                sx={{ ...inputSx, mt: 2 }}
                placeholder="Explain your issue…"
              />

              <Box sx={{ mt: 2.8 }}>
                <Button
                  fullWidth variant="contained"
                  sx={{
                    py: 1.4, borderRadius: "12px",
                    background: "linear-gradient(135deg, #0a7c5c 0%, #10b981 100%)",
                    fontWeight: 600, fontSize: ".9rem", textTransform: "none",
                    letterSpacing: ".01em", boxShadow: "0 6px 20px rgba(16,185,129,.35)",
                    transition: "all .2s",
                    "&:hover": { transform: "translateY(-1px)", boxShadow: "0 10px 28px rgba(16,185,129,.45)" },
                  }}
                >
                  Send Message
                </Button>

                <Button
                  fullWidth onClick={() => setOpenContact(false)}
                  sx={{
                    mt: 1.2, fontSize: ".85rem", textTransform: "none", color: "#64748b",
                    "&:hover": { background: "transparent", color: "#0f172a" },
                  }}
                >
                  Cancel
                </Button>
              </Box>

              <Box sx={{ mt: 2.5, pt: 2, borderTop: "1px solid #e2e8f0", textAlign: "center" }}>
                <Typography sx={{ fontSize: ".75rem", color: "#94a3b8" }}>
                  Support typically replies within 24 hours
                </Typography>
                <Typography sx={{ fontSize: ".75rem", color: "#94a3b8" }}>
                  Version beta 1.0.5 &bull; OneBurma POS
                </Typography>
              </Box>
            </DialogContent>
          </Dialog>
        </Paper>
      </Box>
    </Box>
  );
}

/* ── shared TextField styles ── */
const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px", background: "#f8fafc", fontSize: ".92rem",
    "& input": { py: "13px" },
    "& fieldset": { borderColor: "#dde5ef" },
    "&:hover fieldset":       { borderColor: "#94a3b8" },
    "&.Mui-focused fieldset": { borderColor: "#10b981", borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root":             { fontSize: ".88rem" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#10b981" },
};
