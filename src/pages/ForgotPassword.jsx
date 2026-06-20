import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  useMediaQuery,
  InputAdornment,
} from "@mui/material";
import { FlashOn as FlashOnIcon } from "@mui/icons-material";
import ShieldIcon        from "@mui/icons-material/Shield";
import BarChartIcon      from "@mui/icons-material/BarChart";
import LaptopIcon        from "@mui/icons-material/Laptop";
import ArrowBackIcon     from "@mui/icons-material/ArrowBack";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SendIcon          from "@mui/icons-material/Send";
import CheckCircleIcon   from "@mui/icons-material/CheckCircle";
import { useNavigate }   from "react-router-dom";
import logo from "../assets/logo.png";
import api  from "../api/axios";

const features = [
  { icon: <FlashOnIcon  sx={{ fontSize: 18 }} />, label: "Ultra-fast cashier checkout flow",     color: "#fbbf24" },
  { icon: <ShieldIcon   sx={{ fontSize: 18 }} />, label: "Secure role-based access control",     color: "#34d399" },
  { icon: <BarChartIcon sx={{ fontSize: 18 }} />, label: "Real-time sales & inventory insights", color: "#818cf8" },
  { icon: <LaptopIcon   sx={{ fontSize: 18 }} />, label: "Works on desktop & tablet",             color: "#38bdf8" },
];

const GREEN  = "#0a7c5c";
const GREEN2 = "#10b981";

export default function ForgotPassword() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  const isMobile = useMediaQuery("(max-width:900px)");
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
                "0%,100%": { transform: "translateY(0)"     },
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
              fontWeight: 700,
              fontSize: "1.9rem",
              color: "#fff",
              letterSpacing: "-.02em",
              mb: .4,
            }}>
              OneBurma POS
            </Typography>

            <Typography sx={{
              fontSize: ".72rem",
              fontWeight: 600,
              letterSpacing: ".18em",
              textTransform: "uppercase",
              color: GREEN2,
              mb: 3.5,
            }}>
              Smart Business Platform
            </Typography>

            {/* Features */}
            <Box sx={{ textAlign: "left" }}>
              {features.map((f, i) => (
                <Box key={i} sx={{
                  display: "flex", alignItems: "center", gap: 1.5,
                  py: 1,
                  borderBottom: "1px solid rgba(255,255,255,.05)",
                  "@keyframes fadeUp": {
                    from: { opacity: 0, transform: "translateY(10px)" },
                    to:   { opacity: 1, transform: "translateY(0)" },
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
            fontSize: ".7rem", color: "rgba(120,160,190,.4)",
            textAlign: "center", letterSpacing: ".02em",
          }}>
            OneBurma POS v1.0 &bull; Secure Business Platform<br />
            Designed for Myanmar Retail Businesses
          </Typography>
        </Box>
      )}

      {/* ══════════════ RIGHT PANEL ══════════════ */}
      <Box
        sx={{
          flex: 1,
          background: "#f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, sm: 6 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 460,
            borderRadius: "24px",
            p: { xs: "2.5rem 2rem", sm: "3.5rem 3.5rem" },
            boxShadow: "0 4px 40px rgba(0,0,0,.07), 0 1px 4px rgba(0,0,0,.04)",
            "@keyframes cardIn": {
              from: { opacity: 0, transform: "translateY(20px)" },
              to:   { opacity: 1, transform: "translateY(0)" },
            },
            animation: "cardIn .5s cubic-bezier(.22,1,.36,1) both",
          }}
        >
          {/* Back link */}
          <Box
            onClick={() => navigate("/")}
            sx={{
              display: "inline-flex", alignItems: "center", gap: .6,
              color: "#64748b", fontSize: ".85rem", fontWeight: 500,
              cursor: "pointer", mb: 3,
              transition: "color .2s",
              "&:hover": { color: GREEN },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} />
            Back to Sign In
          </Box>

          {sent ? (
            /* ── SUCCESS STATE ── */
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Box sx={{
                width: 64, height: 64, borderRadius: "50%",
                background: "rgba(16,185,129,.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                mx: "auto", mb: 2.5,
              }}>
                <CheckCircleIcon sx={{ fontSize: 34, color: GREEN2 }} />
              </Box>
              <Typography sx={{
                fontFamily: "'Sora',sans-serif", fontWeight: 700,
                fontSize: "1.5rem", color: "#0f172a", mb: 1,
              }}>
                Check your email
              </Typography>
              <Typography sx={{ fontSize: ".9rem", color: "#64748b", mb: 3, lineHeight: 1.6 }}>
                We've sent password reset instructions to<br />
                <strong style={{ color: "#0f172a" }}>{email}</strong>
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/")}
                sx={{
                  py: 1.4, borderRadius: "12px",
                  borderColor: "#dde5ef", color: "#475569",
                  fontWeight: 600, textTransform: "none",
                  "&:hover": { borderColor: GREEN, color: GREEN, background: "rgba(16,185,129,.04)" },
                }}
              >
                Back to Sign In
              </Button>
            </Box>
          ) : (
            /* ── FORM STATE ── */
            <>
              {/* Key icon */}
              <Box sx={{
                width: 52, height: 52, borderRadius: "14px",
                background: "rgba(16,185,129,.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                mb: 2.5,
              }}>
                {/* key emoji style icon */}
                <Typography sx={{ fontSize: "1.5rem", lineHeight: 1 }}>🔑</Typography>
              </Box>

              <Typography sx={{
                fontFamily: "'Sora',sans-serif", fontWeight: 700,
                fontSize: "1.65rem", color: "#0f172a", mb: .5,
              }}>
                Forgot Password?
              </Typography>
              <Typography sx={{ fontSize: ".9rem", color: "#94a3b8", mb: 3, lineHeight: 1.6 }}>
                Enter your email and we'll send you reset instructions.
              </Typography>

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Typography sx={{ fontSize: ".8rem", fontWeight: 500, color: "#334155", mb: .5 }}>
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@oneburma.com"
                  required
                  sx={inputSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ fontSize: 17, color: "#94a3b8" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {error && (
                  <Typography sx={{ fontSize: ".8rem", color: "#ef4444", mt: 1 }}>
                    {error}
                  </Typography>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  startIcon={<SendIcon />}
                  sx={{
                    mt: 2.5,
                    py: 1.5,
                    borderRadius: "12px",
                    background: `linear-gradient(135deg, ${GREEN} 0%, #0d9e72 100%)`,
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 600,
                    fontSize: ".92rem",
                    textTransform: "none",
                    letterSpacing: ".01em",
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
                  {loading ? "Sending…" : "Send Reset Link"}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    background: "#f8fafc",
    fontSize: ".9rem",
    "& fieldset": { borderColor: "#dde5ef" },
    "&:hover fieldset":        { borderColor: "#94a3b8" },
    "&.Mui-focused fieldset":  { borderColor: "#10b981", borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#10b981" },
};