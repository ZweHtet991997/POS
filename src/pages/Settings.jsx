import React, { useState } from "react";
import {
  Box, Typography, Button, TextField, InputAdornment,
} from "@mui/material";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

// Total products in the system (same seed as NewSale/Categories)
const TOTAL_PRODUCTS = 12;
const PRODUCTS = [
  { name: "Mama Noodles Chicken",     stock: 240 },
  { name: "Coca-Cola 330ml Can",      stock: 180 },
  { name: "Myanmar Beer 640ml",       stock: 96  },
  { name: "Lay's Classic 75g",        stock: 150 },
  { name: "Shwe Pu Zun Condensed",    stock: 8   },
  { name: "Sunflower Cooking Oil 1L", stock: 64  },
  { name: "Colgate Toothpaste 150g",  stock: 72  },
  { name: "Surf Excel Detergent",     stock: 5   },
  { name: "Lucky Star Canned Tuna",   stock: 110 },
  { name: "Pocky Chocolate Sticks",   stock: 3   },
  { name: "Green Tea 500ml",          stock: 200 },
  { name: "Masafi Mineral Water",     stock: 300 },
];

export default function Settings() {
  const [lsQty, setLsQty] = useState("");
  const [saved, setSaved] = useState(null); // null | { threshold, lowCount }

  const handleSave = () => {
    const threshold = parseInt(lsQty) || 0;
    const lowCount  = PRODUCTS.filter(p => p.stock <= threshold).length;
    setSaved({ threshold, lowCount });
    alert(
      `Settings saved!\n\n` +
      `Low Stock Threshold: ${threshold} units\n` +
      `Total Products in system: ${TOTAL_PRODUCTS}\n` +
      `Products at or below threshold: ${lowCount}`
    );
  };

  const isValid = lsQty !== "" && parseInt(lsQty) >= 0;

  return (
    <Box sx={{ p: "28px 32px 48px", bgcolor: "#f0f4f8", minHeight: "100%", boxSizing: "border-box" }}>

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#1e293b" }}>Settings</Typography>
        <Typography sx={{ fontSize: 13, color: "#94a3b8", mt: 0.5 }}>Manage system preferences</Typography>
      </Box>

      {/* Card */}
      <Box sx={{
        bgcolor: "#fff",
        border: "1px solid #e8ecf0",
        borderRadius: 3,
        p: "28px 32px",
        maxWidth: 520,
      }}>
        {/* Section title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 0.8 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <WarningAmberOutlinedIcon sx={{ fontSize: 20, color: "#f97316" }} />
          </Box>
          <Typography sx={{ fontSize: 15, fontWeight: 800, color: "#1e293b" }}>
            Low Stock Threshold
          </Typography>
        </Box>
        <Typography sx={{ fontSize: 13, color: "#64748b", mb: 3, lineHeight: 1.6 }}>
          Set the minimum quantity at which a product is flagged as low stock.
          Any product with stock at or below this number will trigger a low stock alert.
        </Typography>

        {/* Input */}
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#374151", mb: 0.6 }}>
          Low Stock Quantity
        </Typography>
        <TextField
          fullWidth
          size="small"
          type="number"
          placeholder="Enter Amount"
          value={lsQty}
          onChange={e => { setLsQty(e.target.value); setSaved(null); }}
          inputProps={{ min: 0 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <WarningAmberOutlinedIcon sx={{ fontSize: 17, color: "#f97316" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 1.5,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "& fieldset": { borderColor: "#e2e8f0" },
              "&:hover fieldset": { borderColor: "#cbd5e1" },
              "&.Mui-focused fieldset": { borderColor: "#f97316" },
            },
          }}
        />

        {/* Live preview */}
        {isValid && (
          <Box sx={{ bgcolor: "#f8fafc", border: "1px solid #e8ecf0", borderRadius: 2, px: 2, py: 1.5, mb: 2.5 }}>
            <Typography sx={{ fontSize: 12.5, color: "#64748b" }}>
              With threshold set to <Box component="span" sx={{ fontWeight: 700, color: "#1e293b" }}>{lsQty} units</Box>:
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: "#64748b", mt: 0.4 }}>
              • Total products in system:{" "}
              <Box component="span" sx={{ fontWeight: 700, color: "#1e293b" }}>{TOTAL_PRODUCTS}</Box>
            </Typography>
            <Typography sx={{ fontSize: 12.5, mt: 0.4 }}>
              • Products flagged as low stock:{" "}
              <Box component="span" sx={{ fontWeight: 700, color: PRODUCTS.filter(p => p.stock <= parseInt(lsQty)).length > 0 ? "#ef4444" : "#16a34a" }}>
                {PRODUCTS.filter(p => p.stock <= parseInt(lsQty)).length}
              </Box>
            </Typography>
          </Box>
        )}

        {/* Save button */}
        <Button
          fullWidth
          variant="contained"
          startIcon={<SaveOutlinedIcon />}
          disabled={!isValid}
          onClick={handleSave}
          sx={{
            bgcolor: "#1e293b",
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 700,
            fontSize: 14,
            py: 1.2,
            boxShadow: "none",
            "&:hover": { bgcolor: "#0f172a", boxShadow: "none" },
            "&.Mui-disabled": { bgcolor: "#e2e8f0", color: "#94a3b8" },
          }}
        >
          Save Settings
        </Button>

        {/* Success feedback */}
        {saved && (
          <Box sx={{ mt: 2, bgcolor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 2, px: 2, py: 1.5 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#16a34a", mb: 0.3 }}>✓ Settings saved</Typography>
            <Typography sx={{ fontSize: 12.5, color: "#15803d" }}>
              Threshold: {saved.threshold} units · {saved.lowCount} product{saved.lowCount !== 1 ? "s" : ""} flagged as low stock
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}