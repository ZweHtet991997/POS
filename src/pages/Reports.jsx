import React, { useState } from "react";
import {
  Box, Typography, Button, Card, Avatar,
  Table, TableBody, TableCell, TableHead, TableRow,
  LinearProgress, TextField, MenuItem
} from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import dayjs from "dayjs";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, LineChart, Line,
} from "recharts";

// ─── Data ──────────────────────────────────────────────────────────────────────

const PERIODS = ["Today", "This Week", "This Month", "Last Month"];

const KPI = [
  { icon: <MonetizationOnOutlinedIcon sx={{ fontSize: 20, color: "#6366f1" }} />, iconBg: "#eef2ff", label: "Total Revenue",   value: "9.1M MMK", badge: "+14.2%",          badgeBg: "#dcfce7", badgeColor: "#16a34a" },
  { icon: <ShoppingCartOutlinedIcon   sx={{ fontSize: 20, color: "#06b6d4" }} />, iconBg: "#e0f2fe", label: "Total Orders",    value: "603",      badge: "+8.7%",           badgeBg: "#dcfce7", badgeColor: "#16a34a" },
  { icon: <BarChartOutlinedIcon       sx={{ fontSize: 20, color: "#f59e0b" }} />, iconBg: "#fef3c7", label: "Avg Order Value", value: "15K MMK",  badge: "+5.3%",           badgeBg: "#dcfce7", badgeColor: "#16a34a" },
  { icon: <WarningAmberIcon           sx={{ fontSize: 20, color: "#ef4444" }} />, iconBg: "#fee2e2", label: "Low Stock Items", value: "7",        badge: "Needs restocking", badgeBg: "#fef9c3", badgeColor: "#ca8a04" },
];

const REVENUE_ORDERS = [
  { day: "Mon", Revenue: 980000,  Orders: 82,  date: "2026-05-01", customer: "Customer A" },
  { day: "Tue", Revenue: 1100000, Orders: 95,  date: "2026-05-02", customer: "Customer B" },
  { day: "Wed", Revenue: 870000,  Orders: 76,  date: "2026-05-03", customer: "Customer A" },
  { day: "Thu", Revenue: 1350000, Orders: 108, date: "2026-05-04", customer: "Customer C" },
  { day: "Fri", Revenue: 1520000, Orders: 122, date: "2026-05-05", customer: "Customer B" },
  { day: "Sat", Revenue: 1950000, Orders: 138, date: "2026-05-06", customer: "Customer A" },
  { day: "Sun", Revenue: 1250000, Orders: 102, date: "2026-05-07", customer: "Customer C" },
];

const ORDER_TREND = [
  { day: "Mon", Orders: 68,  date: "2026-05-01", customer: "Customer A" },
  { day: "Tue", Orders: 75,  date: "2026-05-02", customer: "Customer B" },
  { day: "Wed", Orders: 63,  date: "2026-05-03", customer: "Customer A" },
  { day: "Thu", Orders: 90,  date: "2026-05-04", customer: "Customer C" },
  { day: "Fri", Orders: 108, date: "2026-05-05", customer: "Customer B" },
  { day: "Sat", Orders: 138, date: "2026-05-06", customer: "Customer A" },
  { day: "Sun", Orders: 85,  date: "2026-05-07", customer: "Customer C" },
];

const TOP_PRODUCTS = [
  { rank: 1, name: "Mama Noodles Chicken",     category: "Food",          sold: "1,248", revenue: "2.5M MMK", top: true,  date: "2026-05-01", customer: "Customer A" },
  { rank: 2, name: "Coca-Cola 330ml Can",      category: "Beverage",      sold: "980",   revenue: "1.6M MMK", top: true,  date: "2026-05-02", customer: "Customer B" },
  { rank: 3, name: "Myanmar Beer 640ml",       category: "Beverage",      sold: "756",   revenue: "3.8M MMK", top: true,  date: "2026-05-03", customer: "Customer A" },
  { rank: 4, name: "Sunflower Cooking Oil 1L", category: "Food",          sold: "640",   revenue: "5.4M MMK",            date: "2026-05-04", customer: "Customer C" },
  { rank: 5, name: "Lay's Classic 75g",        category: "Snacks",        sold: "590",   revenue: "1.2M MMK",            date: "2026-05-05", customer: "Customer B" },
  { rank: 6, name: "Masafi Mineral Water",     category: "Beverage",      sold: "520",   revenue: "416K MMK",            date: "2026-05-06", customer: "Customer A" },
  { rank: 7, name: "Colgate Toothpaste 150g",  category: "Personal Care", sold: "480",   revenue: "1.7M MMK",            date: "2026-05-07", customer: "Customer C" },
  { rank: 8, name: "Green Tea 500ml",          category: "Beverage",      sold: "460",   revenue: "552K MMK",            date: "2026-05-01", customer: "Customer A" },
];

const PAYMENTS = [
  { name: "Cash",     amount: "4.8M MMK", pct: 42, color: "#1e293b" },
  { name: "KBZPay",  amount: "3.3M MMK", pct: 28, color: "#22c55e" },
  { name: "Wave Pay",amount: "2.1M MMK", pct: 18, color: "#f59e0b" },
  { name: "Card",    amount: "980K MMK", pct: 9,  color: "#60a5fa" },
  { name: "Other",   amount: "346K MMK", pct: 3,  color: "#94a3b8" },
];

const LOW_STOCK = [
  { name: "Pocky Chocolate Sticks",     category: "Snacks",    min: 20, stock: 3,  crit: true,  date: "2026-05-01", customer: "Customer A" },
  { name: "Surf Excel Detergent 500g",  category: "Household", min: 30, stock: 5,  crit: true,  date: "2026-05-02", customer: "Customer B" },
  { name: "Shwe Pu Zun Condensed Milk", category: "Dairy",     min: 25, stock: 8,  crit: false, date: "2026-05-03", customer: "Customer A" },
  { name: "Myanmar Beer 640ml",         category: "Beverage",  min: 50, stock: 12, crit: false, date: "2026-05-04", customer: "Customer C" },
  { name: "Lucky Star Canned Tuna",     category: "Food",      min: 40, stock: 15, crit: false, date: "2026-05-05", customer: "Customer B" },
];

// ─── Shared card style (matches Categories) ────────────────────────────────────
const cardSx = {
  bgcolor: "#fff",
  border: "1px solid #e8ecf0",
  borderRadius: 3,
  boxShadow: "none",
  transition: "box-shadow 0.2s",
  "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.07)" },
};

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function Reports() {
  const [dateRange, setDateRange] = useState([dayjs().subtract(7, "day"), dayjs()]);
  const [customer, setCustomer] = useState("All");

  // Helper to check if a date string is in the selected range
  const isInRange = (dateStr) => {
    const d = dayjs(dateStr);
    return d.isAfter(dateRange[0].startOf("day")) && d.isBefore(dateRange[1].endOf("day"));
  };

  // Filtered data
  const filteredRevenue = REVENUE_ORDERS.filter(d =>
    isInRange(d.date) && (customer === "All" || d.customer === customer)
  );

  const filteredTrend = ORDER_TREND.filter(d =>
    isInRange(d.date) && (customer === "All" || d.customer === customer)
  );

  const filteredProducts = TOP_PRODUCTS.filter(p =>
    isInRange(p.date) && (customer === "All" || p.customer === customer)
  );

  const filteredLowStock = LOW_STOCK.filter(p =>
    isInRange(p.date) && (customer === "All" || p.customer === customer)
  );

  // KPI dynamic values
  const totalRevenue = filteredRevenue.reduce((a, b) => a + b.Revenue, 0);
  const totalOrders = filteredRevenue.reduce((a, b) => a + b.Orders, 0);

  return (
    <Box sx={{ p: "28px 32px 48px", bgcolor: "#f0f4f8", minHeight: "100%", boxSizing: "border-box" }}>

      {/* ── Header ── */}
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#1e293b" }}>Reports & Analytics</Typography>
          <Typography sx={{ fontSize: 13, color: "#94a3b8", mt: 0.5 }}>Business performance overview</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              type="date"
              size="small"
              value={dateRange[0]?.format("YYYY-MM-DD")}
              onChange={(e) =>
                setDateRange([dayjs(e.target.value), dateRange[1]])
              }
              sx={{
                bgcolor: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": { fontSize: 13 }
              }}
            />

            <TextField
              type="date"
              size="small"
              value={dateRange[1]?.format("YYYY-MM-DD")}
              onChange={(e) =>
                setDateRange([dateRange[0], dayjs(e.target.value)])
              }
              sx={{
                bgcolor: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": { fontSize: 13 }
              }}
            />
          </Box>
          <TextField
            select
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            size="small"
            sx={{
              minWidth: 140,
              bgcolor: "#fff",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                fontSize: 13,
                borderRadius: 2
              }
            }}
          >
            {["All", "Customer A", "Customer B", "Customer C"].map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>
          <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />}
            sx={{
              borderRadius: 2.5, textTransform: "none", fontWeight: 600, fontSize: 13,
              px: 2, py: 0.85, borderColor: "#e8ecf0", color: "#64748b",
              boxShadow: "none", bgcolor: "#fff",
              "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc", boxShadow: "none" },
            }}>
            Export
          </Button>
        </Box>
      </Box>

      {/* ── KPI Cards ── */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, mb: 3 }}>
        {/* Dynamic KPI: Only Total Revenue and Total Orders are updated */}
        <Card elevation={0} sx={cardSx}>
          <Box sx={{ p: "20px 22px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MonetizationOnOutlinedIcon sx={{ fontSize: 20, color: "#6366f1" }} />
              </Box>
              <Box sx={{ fontSize: 12, fontWeight: 700, color: "#16a34a", bgcolor: "#dcfce7", borderRadius: 1.5, px: 1, py: 0.3, lineHeight: 1.6 }}>
                +14.2%
              </Box>
            </Box>
            <Typography sx={{ fontSize: 26, fontWeight: 800, color: "#1e293b", lineHeight: 1 }}>
              {(totalRevenue / 1000000).toFixed(1)}M MMK
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: "#94a3b8", mt: 0.7, fontWeight: 500 }}>Total Revenue</Typography>
          </Box>
        </Card>
        <Card elevation={0} sx={cardSx}>
          <Box sx={{ p: "20px 22px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShoppingCartOutlinedIcon sx={{ fontSize: 20, color: "#06b6d4" }} />
              </Box>
              <Box sx={{ fontSize: 12, fontWeight: 700, color: "#16a34a", bgcolor: "#dcfce7", borderRadius: 1.5, px: 1, py: 0.3, lineHeight: 1.6 }}>
                +8.7%
              </Box>
            </Box>
            <Typography sx={{ fontSize: 26, fontWeight: 800, color: "#1e293b", lineHeight: 1 }}>
              {totalOrders}
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: "#94a3b8", mt: 0.7, fontWeight: 500 }}>Total Orders</Typography>
          </Box>
        </Card>
        {/* The other two KPI cards remain static */}
        <Card elevation={0} sx={cardSx}>
          <Box sx={{ p: "20px 22px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BarChartOutlinedIcon sx={{ fontSize: 20, color: "#f59e0b" }} />
              </Box>
              <Box sx={{ fontSize: 12, fontWeight: 700, color: "#16a34a", bgcolor: "#dcfce7", borderRadius: 1.5, px: 1, py: 0.3, lineHeight: 1.6 }}>
                +5.3%
              </Box>
            </Box>
            <Typography sx={{ fontSize: 26, fontWeight: 800, color: "#1e293b", lineHeight: 1 }}>15K MMK</Typography>
            <Typography sx={{ fontSize: 12.5, color: "#94a3b8", mt: 0.7, fontWeight: 500 }}>Avg Order Value</Typography>
          </Box>
        </Card>
        <Card elevation={0} sx={cardSx}>
          <Box sx={{ p: "20px 22px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <WarningAmberIcon sx={{ fontSize: 20, color: "#ef4444" }} />
              </Box>
              <Box sx={{ fontSize: 12, fontWeight: 700, color: "#ca8a04", bgcolor: "#fef9c3", borderRadius: 1.5, px: 1, py: 0.3, lineHeight: 1.6 }}>
                Needs restocking
              </Box>
            </Box>
            <Typography sx={{ fontSize: 26, fontWeight: 800, color: "#1e293b", lineHeight: 1 }}>7</Typography>
            <Typography sx={{ fontSize: 12.5, color: "#94a3b8", mt: 0.7, fontWeight: 500 }}>Low Stock Items</Typography>
          </Box>
        </Card>
      </Box>

      {/* ── Revenue & Orders Chart + Payment Methods ── */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 2, mb: 3 }}>
        <Card elevation={0} sx={cardSx}>
          <Box sx={{ p: "20px 22px 14px" }}>
            <Typography sx={{ fontSize: 14.5, fontWeight: 800, color: "#1e293b", mb: 2.5 }}>
              Revenue & Orders — {dateRange[0]?.format("DD MMM")} - {dateRange[1]?.format("DD MMM")}
            </Typography>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={filteredRevenue} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis yAxisId="r" orientation="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickFormatter={v => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${v / 1000}K`} />
                <YAxis yAxisId="o" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #e8ecf0", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", fontSize: 12 }}
                  formatter={(val, name) => name === "Revenue" ? [`${(val / 1000000).toFixed(2)}M MMK`, name] : [val, name]}
                />
                <Legend iconType="square" iconSize={9} wrapperStyle={{ fontSize: 12.5, paddingTop: 14, color: "#64748b" }} />
                <Bar yAxisId="r" dataKey="Revenue" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar yAxisId="o" dataKey="Orders"  fill="#22c55e" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        <Card elevation={0} sx={cardSx}>
          <Box sx={{ p: "20px 22px" }}>
            <Typography sx={{ fontSize: 14.5, fontWeight: 800, color: "#1e293b", mb: 2.5 }}>Payment Methods</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
              {PAYMENTS.map(pm => (
                <Box key={pm.name}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
                    <Typography sx={{ fontSize: 13, color: "#334155", fontWeight: 600 }}>{pm.name}</Typography>
                    <Box sx={{ display: "flex", gap: 1.5 }}>
                      <Typography sx={{ fontSize: 12.5, color: "#64748b" }}>{pm.amount}</Typography>
                      <Typography sx={{ fontSize: 12.5, fontWeight: 800, color: "#1e293b", minWidth: 28, textAlign: "right" }}>{pm.pct}%</Typography>
                    </Box>
                  </Box>
                  <LinearProgress variant="determinate" value={pm.pct}
                    sx={{ height: 6, borderRadius: 3, bgcolor: "#f1f5f9", "& .MuiLinearProgress-bar": { bgcolor: pm.color, borderRadius: 3 } }}
                  />
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 2.5, pt: 2, borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Total Collected</Typography>
              <Typography sx={{ fontSize: 13.5, fontWeight: 800, color: "#1e293b" }}>11.5M MMK</Typography>
            </Box>
          </Box>
        </Card>
      </Box>

      {/* ── Top Products + Low Stock ── */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 2, mb: 3 }}>
        <Card elevation={0} sx={cardSx}>
          <Box sx={{ p: "20px 22px 12px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography sx={{ fontSize: 14.5, fontWeight: 800, color: "#1e293b" }}>Top Selling Products</Typography>
              <Typography sx={{ fontSize: 12.5, color: "#94a3b8" }}>{dateRange[0]?.format("DD MMM")} - {dateRange[1]?.format("DD MMM")}</Typography>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ "& th": { fontSize: 12, fontWeight: 600, color: "#94a3b8", borderBottom: "1px solid #f1f5f9", pb: 1.2, pt: 0 } }}>
                  <TableCell sx={{ width: 36, pl: 0 }}>#</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Sold</TableCell>
                  <TableCell align="right" sx={{ pr: 0 }}>Revenue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <Typography sx={{ fontSize: 13, color: "#94a3b8", py: 3 }}>
                    No data for selected filter
                  </Typography>
                ) : (
                  filteredProducts.map(p => (
                    <TableRow key={p.rank} sx={{ "& td": { borderBottom: "1px solid #f8fafc", py: 1.3 }, "&:last-child td": { border: "none" } }}>
                      <TableCell sx={{ pl: 0 }}>
                        <Avatar sx={{ width: 26, height: 26, fontSize: 12, fontWeight: 700, bgcolor: p.top ? "#1e293b" : "#f1f5f9", color: p.top ? "#fff" : "#64748b" }}>
                          {p.rank}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{p.name}</Typography>
                        <Typography sx={{ fontSize: 11.5, color: "#94a3b8" }}>{p.category}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontSize: 13, color: "#475569" }}>{p.sold}</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 0 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{p.revenue}</Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Box>
        </Card>

        <Card elevation={0} sx={cardSx}>
          <Box sx={{ p: "20px 22px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography sx={{ fontSize: 14.5, fontWeight: 800, color: "#1e293b" }}>Low Stock Alert</Typography>
              <Box sx={{ fontSize: 12, fontWeight: 700, color: "#ef4444", bgcolor: "#fee2e2", borderRadius: 1.5, px: 1.2, py: 0.3, lineHeight: 1.6 }}>
                5 Items
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {filteredLowStock.length === 0 ? (
                <Typography sx={{ fontSize: 13, color: "#94a3b8", py: 3 }}>
                  No data for selected filter
                </Typography>
              ) : (
                filteredLowStock.map((item, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", py: 1.4, borderBottom: i < filteredLowStock.length - 1 ? "1px solid #f8fafc" : "none" }}>
                    <Box sx={{
                      width: 36, height: 36, borderRadius: 2, mr: 1.5, flexShrink: 0,
                      bgcolor: item.crit ? "#fee2e2" : "#fef9c3",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <ReportProblemOutlinedIcon sx={{ fontSize: 17, color: item.crit ? "#ef4444" : "#f59e0b" }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#1e293b", lineHeight: 1.3 }}>{item.name}</Typography>
                      <Typography sx={{ fontSize: 11.5, color: "#94a3b8" }}>{item.category} • Min: {item.min}</Typography>
                    </Box>
                    <Box sx={{ textAlign: "right", ml: 1 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 800, color: item.crit ? "#ef4444" : "#f59e0b", lineHeight: 1.2 }}>{item.stock}</Typography>
                      <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>units</Typography>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
            <Button fullWidth variant="contained" disableElevation
              sx={{
                mt: 2, bgcolor: "#1e293b", borderRadius: 2.5, textTransform: "none",
                fontWeight: 600, fontSize: 13, py: 1.1, boxShadow: "none",
                "&:hover": { bgcolor: "#0f172a", boxShadow: "none" },
              }}>
              Restock All Items
            </Button>
          </Box>
        </Card>
      </Box>

      {/* ── Order Trend ── */}
      <Card elevation={0} sx={cardSx}>
        <Box sx={{ p: "20px 22px 14px" }}>
          <Typography sx={{ fontSize: 14.5, fontWeight: 800, color: "#1e293b", mb: 2.5 }}>
            Order Trend — {dateRange[0]?.format("DD MMM")} - {dateRange[1]?.format("DD MMM")}
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={filteredTrend} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} ticks={[0, 35, 70, 105, 140]} domain={[0, 160]} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e8ecf0", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", fontSize: 12 }} />
              <Line type="monotone" dataKey="Orders" stroke="#22c55e" strokeWidth={2.5}
                dot={{ r: 4.5, fill: "#22c55e", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Card>

    </Box>
  );
}