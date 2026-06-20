import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  Chip,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckBoxIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import CashIcon from "@mui/icons-material/MonetizationOnOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import WifiOutlinedIcon from "@mui/icons-material/WifiOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ── Data ────────────────────────────────────────────────────────────────────

const salesData7 = [
  { day: "Mon", value: 1000000 },
  { day: "Tue", value: 1080000 },
  { day: "Wed", value: 950000 },
  { day: "Thu", value: 1450000 },
  { day: "Fri", value: 1520000 },
  { day: "Sat", value: 2000000 },
  { day: "Sun", value: 1280000 },
];

const salesData30 = [
  { day: "W1", value: 6800000 },
  { day: "W2", value: 7500000 },
  { day: "W3", value: 9100000 },
  { day: "W4", value: 8400000 },
];

const topProducts = [
  { rank: 1, name: "Mama Noodles (Box)", sold: 148, revenue: "296K MMK", pct: 92, gold: true },
  { rank: 2, name: "Coca-Cola 330ml", sold: 132, revenue: "211K MMK", pct: 81, gold: false },
  { rank: 3, name: "Myanmar Beer 640ml", sold: 118, revenue: "590K MMK", pct: 72, bronze: true },
  { rank: 4, name: "Lay's Chips Original", sold: 96, revenue: "192K MMK", pct: 59, gold: false },
  { rank: 5, name: "Shwe Pu Zun Condensed Milk", sold: 84, revenue: "168K MMK", pct: 52, gold: false },
];

const lowStockItems = [
  { name: "Surf Excel Detergent 500g", remaining: 5, min: 10 },
  { name: "Pocky Chocolate Sticks", remaining: 3, min: 10 },
  { name: "Shwe Pu Zun Condensed Milk", remaining: 8, min: 15 },
];

const transactions = [
  { id: "INV-2026-00891", customer: "Daw Aye Aye", cashier: "Ko Zaw", amount: "45,500", method: "Cash", methodIcon: "cash", status: "Paid", time: "14:32" },
  { id: "INV-2026-00890", customer: "Walk-in Customer", cashier: "Ma Thida", amount: "12,800", method: "KBZPay", methodIcon: "phone", status: "Paid", time: "14:15" },
  { id: "INV-2026-00889", customer: "U Kyaw Zin", cashier: "Ko Zaw", amount: "78,200", method: "Wave Pay", methodIcon: "wifi", status: "Paid", time: "13:58" },
  { id: "INV-2026-00888", customer: "Ma Su Su", cashier: "Ma Thida", amount: "23,400", method: "Cash", methodIcon: "cash", status: "Pending", time: "13:41" },
  { id: "INV-2026-00887", customer: "Ko Naing Lin", cashier: "Ko Zaw", amount: "156,000", method: "Card", methodIcon: "card", status: "Paid", time: "13:20" },
];

// ── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, iconBg, iconColor, label, value, unit, badge, badgeColor, change }) {
  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: "#fff",
        borderRadius: "16px",
        border: "1px solid #eef1f5",
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        minWidth: 0,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "12px",
            bgcolor: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Typography sx={{ fontSize: "0.82rem", color: "#7a8fa6", fontWeight: 500 }}>
          {label}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.6, mt: 0.5 }}>
        <Typography sx={{ fontSize: "1.6rem", fontWeight: 700, color: "#1a2e3b", lineHeight: 1.1 }}>
          {value}
        </Typography>
        {unit && (
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#7a8fa6" }}>
            {unit}
          </Typography>
        )}
      </Box>

      {change && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, mt: 0.3 }}>
          <ArrowUpwardIcon sx={{ fontSize: "0.75rem", color: "#22c55e" }} />
          <Typography sx={{ fontSize: "0.75rem", color: "#22c55e", fontWeight: 500 }}>
            {change}
          </Typography>
        </Box>
      )}

      {badge && (
        <Box sx={{ mt: 0.5 }}>
          <Chip
            icon={<WarningAmberIcon sx={{ fontSize: "0.75rem !important", color: `${badgeColor} !important` }} />}
            label="Needs attention"
            size="small"
            sx={{
              bgcolor: "#fef9ec",
              color: badgeColor,
              fontSize: "0.7rem",
              fontWeight: 600,
              height: 24,
              border: `1px solid ${badgeColor}33`,
              "& .MuiChip-label": { px: 0.8 },
            }}
          />
        </Box>
      )}
    </Box>
  );
}

function MethodIcon({ type }) {
  const sx = { fontSize: "0.9rem", color: "#7a8fa6" };
  if (type === "cash") return <CashIcon sx={sx} />;
  if (type === "phone") return <PhoneAndroidOutlinedIcon sx={sx} />;
  if (type === "wifi") return <WifiOutlinedIcon sx={sx} />;
  if (type === "card") return <CreditCardOutlinedIcon sx={sx} />;
  return null;
}

function StatusChip({ status }) {
  const map = {
    Paid: { color: "#16a34a", bg: "#f0fdf4" },
    Pending: { color: "#d97706", bg: "#fffbeb" },
    Cancelled: { color: "#dc2626", bg: "#fef2f2" },
  };
  const s = map[status] || map.Paid;
  return (
    <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: s.color }}>
      {status}
    </Typography>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const [chartRange, setChartRange] = useState("7");
  const navigate = useNavigate();
  const chartData = chartRange === "7" ? salesData7 : salesData30;

  const formatY = (v) => {
    if (v >= 1000000) return `${v / 1000000}M`;
    if (v >= 1000) return `${v / 1000}k`;
    return v;
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Box sx={{ p: 3, overflowY: "auto", height: "100%", bgcolor: "#f5f7fa" }}>

      {/* ── Header ── */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box>
          <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a2e3b" }}>
            {greeting()}, Ko Zaw 👋
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", color: "#7a8fa6", mt: 0.3 }}>
            Sunday, 29 March 2026 • Here's what's happening at your shop today
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            endIcon={<KeyboardArrowDownIcon />}
            variant="outlined"
            size="small"
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              borderColor: "#dde3ec",
              color: "#1a2e3b",
              fontWeight: 500,
              fontSize: "0.82rem",
              px: 1.8,
              "&:hover": { borderColor: "#bbc5d4", bgcolor: "#f8fafc" },
            }}
          >
            Today
          </Button>
          <Button
            startIcon={<FileDownloadOutlinedIcon />}
            variant="outlined"
            size="small"
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              borderColor: "#dde3ec",
              color: "#1a2e3b",
              fontWeight: 500,
              fontSize: "0.82rem",
              px: 1.8,
              "&:hover": { borderColor: "#bbc5d4", bgcolor: "#f8fafc" },
            }}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* ── Stat Cards ── */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <StatCard
          icon={<CashIcon sx={{ fontSize: "1.2rem", color: "#16a34a" }} />}
          iconBg="#f0fdf4"
          label="Today's Revenue"
          value="1,245,500"
          unit="MMK"
          change="+12.5% vs yesterday"
        />
        <StatCard
          icon={<CheckBoxIcon sx={{ fontSize: "1.2rem", color: "#0ea5e9" }} />}
          iconBg="#f0f9ff"
          label="Total Orders"
          value="87"
          change="+8.3% vs yesterday"
        />
        <StatCard
          icon={<InventoryIcon sx={{ fontSize: "1.2rem", color: "#6366f1" }} />}
          iconBg="#f5f3ff"
          label="Items Sold"
          value="312"
          change="+5.1% vs yesterday"
        />
        <StatCard
          icon={<WarningAmberIcon sx={{ fontSize: "1.2rem", color: "#f59e0b" }} />}
          iconBg="#fffbeb"
          label="Low Stock Alerts"
          value="7"
          badge
          badgeColor="#f59e0b"
        />
      </Box>

      {/* ── Charts Row ── */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>

        {/* Sales Overview */}
        <Box
          sx={{
            flex: 1.1,
            bgcolor: "#fff",
            borderRadius: "16px",
            border: "1px solid #eef1f5",
            p: 2.5,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Box>
              <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#1a2e3b" }}>
                Sales Overview
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "#7a8fa6", mt: 0.2 }}>
                Last 7 days • 603 orders •{" "}
                <span style={{ color: "#16a34a", fontWeight: 600 }}>9.10M MMK</span>
              </Typography>
            </Box>
            <ButtonGroup size="small" sx={{ border: "1px solid #eef1f5", borderRadius: "10px", overflow: "hidden" }}>
              {["7", "30"].map((r) => (
                <Button
                  key={r}
                  onClick={() => setChartRange(r)}
                  disableElevation
                  sx={{
                    textTransform: "none",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    px: 2,
                    py: 0.6,
                    border: "none !important",
                    bgcolor: chartRange === r ? "#1a2e3b" : "transparent",
                    color: chartRange === r ? "#fff" : "#7a8fa6",
                    borderRadius: "0 !important",
                    "&:hover": {
                      bgcolor: chartRange === r ? "#1a2e3b" : "#f5f7fa",
                    },
                  }}
                >
                  {r} Days
                </Button>
              ))}
            </ButtonGroup>
          </Box>

          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9aacbd" }}
              />
              <YAxis
                tickFormatter={formatY}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9aacbd" }}
                width={44}
              />
              <Tooltip
                formatter={(v) => [`${(v / 1000).toFixed(0)}k MMK`, "Revenue"]}
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #eef1f5",
                  fontSize: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#16a34a"
                strokeWidth={2.5}
                fill="url(#salesGrad)"
                dot={{ r: 3, fill: "#16a34a", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#16a34a" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        {/* Top Selling Products */}
        <Box
          sx={{
            flex: 0.9,
            bgcolor: "#fff",
            borderRadius: "16px",
            border: "1px solid #eef1f5",
            p: 2.5,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#1a2e3b" }}>
              Top Selling Products
            </Typography>
            <Typography sx={{ fontSize: "0.78rem", color: "#16a34a", fontWeight: 600, cursor: "pointer" }}>
              View All
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.8, flex: 1 }}>
            {topProducts.map((p) => (
              <Box key={p.rank}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      sx={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: p.rank === 1 ? "#f59e0b" : p.rank === 3 ? "#f59e0b" : "#9aacbd",
                        minWidth: 22,
                      }}
                    >
                      #{p.rank}
                    </Typography>
                    <Typography sx={{ fontSize: "0.82rem", fontWeight: 500, color: "#1a2e3b" }}>
                      {p.name}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography sx={{ fontSize: "0.75rem", color: "#7a8fa6" }}>{p.sold} sold</Typography>
                    <Typography sx={{ fontSize: "0.7rem", color: "#9aacbd" }}>{p.revenue}</Typography>
                  </Box>
                </Box>
                <Box sx={{ height: 5, bgcolor: "#f0f4f8", borderRadius: 99, overflow: "hidden" }}>
                  <Box
                    sx={{
                      height: "100%",
                      width: `${p.pct}%`,
                      bgcolor: "#16a34a",
                      borderRadius: 99,
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, pt: 1.5, borderTop: "1px solid #eef1f5" }}>
            <Typography sx={{ fontSize: "0.72rem", color: "#9aacbd" }}>Based on today's sales</Typography>
            <Typography sx={{ fontSize: "0.72rem", color: "#9aacbd" }}>578 units total</Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Bottom Row ── */}
      <Box sx={{ display: "flex", gap: 2 }}>

        {/* Quick Actions */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "#fff",
            borderRadius: "16px",
            border: "1px solid #eef1f5",
            p: 2.5,
          }}
        >
          <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#1a2e3b", mb: 2 }}>
            Quick Actions
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
            {[
              { label: "New Sale", sub: "Start cashier mode", icon: <PointOfSaleIcon sx={{ fontSize: "1.6rem" }} />, primary: true, path: "/sale?type=retail" },
              { label: "Add Product", sub: "Register new item", icon: <AddBoxOutlinedIcon sx={{ fontSize: "1.6rem" }} />, primary: false, path: "/products" },
              { label: "Stock In", sub: "Receive inventory", icon: <LayersOutlinedIcon sx={{ fontSize: "1.6rem" }} />, primary: false, path: "/inventory" },
              { label: "View Reports", sub: "Sales analytics", icon: <BarChartOutlinedIcon sx={{ fontSize: "1.6rem" }} />, primary: false, path: "/reports" },
            ].map((a) => (
              <Box
                key={a.label}
                onClick={() => navigate(a.path)}
                sx={{
                  borderRadius: "14px",
                  border: a.primary ? "none" : "1px solid #eef1f5",
                  bgcolor: a.primary ? "#16a34a" : "#fff",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.8,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: a.primary ? "#15803d" : "#f8fafc",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <Box sx={{ color: a.primary ? "rgba(255,255,255,0.9)" : "#7a8fa6" }}>{a.icon}</Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: a.primary ? "#fff" : "#1a2e3b" }}>
                    {a.label}
                  </Typography>
                  <Typography sx={{ fontSize: "0.72rem", color: a.primary ? "rgba(255,255,255,0.75)" : "#9aacbd" }}>
                    {a.sub}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Low Stock Alerts */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "#fff",
            borderRadius: "16px",
            border: "1px solid #eef1f5",
            p: 2.5,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#1a2e3b" }}>
              Low Stock Alerts
            </Typography>
            <Box
              sx={{
                bgcolor: "#fef9ec",
                border: "1px solid #fde68a",
                borderRadius: "50%",
                width: 26,
                height: 26,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#f59e0b" }}>7</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {lowStockItems.map((item) => (
              <Box
                key={item.name}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.5,
                  bgcolor: "#fffbeb",
                  borderRadius: "12px",
                  border: "1px solid #fde68a33",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                  <WarningAmberIcon sx={{ fontSize: "1rem", color: "#f59e0b" }} />
                  <Box>
                    <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#1a2e3b" }}>
                      {item.name}
                    </Typography>
                    <Typography sx={{ fontSize: "0.7rem", color: "#9aacbd" }}>
                      {item.remaining} remaining • min {item.min}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: "#16a34a",
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Restock
                </Typography>
              </Box>
            ))}
          </Box>

          <Typography
            sx={{
              fontSize: "0.78rem",
              color: "#f59e0b",
              fontWeight: 600,
              mt: 2,
              cursor: "pointer",
              textAlign: "center",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            View all 7 low stock items →
          </Typography>
        </Box>
      </Box>

      {/* ── Recent Transactions ── */}
      <Box
        sx={{
          mt: 2,
          bgcolor: "#fff",
          borderRadius: "16px",
          border: "1px solid #eef1f5",
          p: 2.5,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#1a2e3b" }}>
            Recent Transactions
          </Typography>
          <Typography sx={{ fontSize: "0.78rem", color: "#16a34a", fontWeight: 600, cursor: "pointer" }}>
            View All
          </Typography>
        </Box>

        {/* Table header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1.8fr 1.2fr 1fr 1fr 1fr 0.8fr 0.6fr",
            px: 1,
            pb: 1,
            borderBottom: "1px solid #eef1f5",
          }}
        >
          {["Invoice", "Customer", "Cashier", "Amount", "Method", "Status", "Time"].map((h) => (
            <Typography key={h} sx={{ fontSize: "0.72rem", fontWeight: 600, color: "#9aacbd", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {h}
            </Typography>
          ))}
        </Box>

        {/* Rows */}
        {transactions.map((tx, i) => (
          <Box
            key={tx.id}
            sx={{
              display: "grid",
              gridTemplateColumns: "1.8fr 1.2fr 1fr 1fr 1fr 0.8fr 0.6fr",
              px: 1,
              py: 1.4,
              alignItems: "center",
              borderBottom: i < transactions.length - 1 ? "1px solid #f5f7fa" : "none",
              "&:hover": { bgcolor: "#f8fafc" },
              borderRadius: "8px",
              transition: "background 0.15s",
            }}
          >
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#16a34a" }}>{tx.id}</Typography>
            <Typography sx={{ fontSize: "0.82rem", color: "#1a2e3b" }}>{tx.customer}</Typography>
            <Typography sx={{ fontSize: "0.82rem", color: "#7a8fa6" }}>{tx.cashier}</Typography>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.4 }}>
              <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#1a2e3b" }}>{tx.amount}</Typography>
              <Typography sx={{ fontSize: "0.68rem", color: "#9aacbd" }}>MMK</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
              <MethodIcon type={tx.methodIcon} />
              <Typography sx={{ fontSize: "0.82rem", color: "#7a8fa6" }}>{tx.method}</Typography>
            </Box>
            <StatusChip status={tx.status} />
            <Typography sx={{ fontSize: "0.78rem", color: "#9aacbd" }}>{tx.time}</Typography>
          </Box>
        ))}
      </Box>

    </Box>
  );
}
