import React, { useState } from "react";
import {
  Box, Typography, Button, TextField, InputAdornment,
  Card, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Chip, Select, MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

// ── Helpers ───────────────────────────────────────────────────────────────────
const LOW_THRESHOLD = 20;
const today   = () => new Date().toISOString().slice(0, 10);
const fmtDate = (d) => new Date(d).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
const stockBadge = (qty) =>
  qty === 0         ? { label: "Empty", bg: "#fee2e2", color: "#dc2626" }
  : qty <= LOW_THRESHOLD ? { label: "Low",   bg: "#fff7ed", color: "#ea580c" }
  :                        { label: "OK",    bg: "#dcfce7", color: "#16a34a" };

// ── Seed Data ─────────────────────────────────────────────────────────────────
// stock is a map: { warehouseName: qty, ... }
const INITIAL_PRODUCTS = [
  { id:1,  name:"Mama Noodles Chicken",      sku:"MN-CHK-001",  subcategory:"Instant Noodles", category:"Food & Grocery",  stock:{ A:240, B:0   } },
  { id:2,  name:"Coca-Cola 330ml Can",        sku:"CC-330-002",  subcategory:"Soft Drinks",     category:"Beverages",       stock:{ A:180, B:0   } },
  { id:3,  name:"Myanmar Beer 640ml",         sku:"MB-640-003",  subcategory:"Soft Drinks",     category:"Beverages",       stock:{ A:0,   B:96  } },
  { id:4,  name:"Lay's Classic 75g",          sku:"LYS-CLS-004", subcategory:"Chips",           category:"Snacks",          stock:{ A:150, B:0   } },
  { id:5,  name:"Shwe Pu Zun Condensed Milk", sku:"SPZ-CM-005",  subcategory:"Condensed Milk",  category:"Dairy Products",  stock:{ A:8,   B:0   } },
  { id:6,  name:"Sunflower Cooking Oil 1L",   sku:"SFO-1L-006",  subcategory:"Cooking Oil",     category:"Food & Grocery",  stock:{ A:0,   B:64  } },
  { id:7,  name:"Colgate Toothpaste 150g",    sku:"CGT-150-007", subcategory:"Toothpaste",      category:"Personal Care",   stock:{ A:72,  B:0   } },
  { id:8,  name:"Surf Excel Detergent 500g",  sku:"SFX-500-008", subcategory:"Detergent",       category:"Household",       stock:{ A:5,   B:0   } },
  { id:9,  name:"Lucky Star Canned Tuna",     sku:"LST-TNA-009", subcategory:"Canned Food",     category:"Food & Grocery",  stock:{ A:110, B:0   } },
  { id:10, name:"Pocky Chocolate Sticks",     sku:"PCK-CHC-010", subcategory:"Biscuits",        category:"Snacks",          stock:{ A:3,   B:0   } },
  { id:11, name:"Green Tea 500ml",            sku:"GT-500-011",  subcategory:"Tea",             category:"Beverages",       stock:{ A:200, B:0   } },
  { id:12, name:"Masafi Mineral Water 600ml", sku:"MSF-600-012", subcategory:"Water",           category:"Beverages",       stock:{ A:300, B:0   } },
];

const INITIAL_ARRIVALS = [
  { id:1, productId:1,  productName:"Mama Noodles Chicken",      warehouses:[{ name:"A", qty:100 }],           date:"2026-05-08", note:"Regular restock"             },
  { id:2, productId:3,  productName:"Myanmar Beer 640ml",         warehouses:[{ name:"B", qty:96  }],           date:"2026-05-09", note:"New shipment from supplier"   },
  { id:3, productId:5,  productName:"Shwe Pu Zun Condensed Milk", warehouses:[{ name:"A", qty:50  },{ name:"B", qty:20 }], date:"2026-05-10", note:"Split delivery"  },
  { id:4, productId:8,  productName:"Surf Excel Detergent 500g",  warehouses:[{ name:"A", qty:30  }],           date:"2026-05-10", note:""                            },
];

let _arrId = 5;

// ── Arrival Dialog ────────────────────────────────────────────────────────────
function ArrivalDialog({ open, products, warehouses, onSave, onClose }) {
  const blankForm = () => ({ productId:"", date:today(), note:"", selections:{} });
  const [form, setForm] = useState(blankForm());

  React.useEffect(() => { if (open) { setForm(blankForm()); } }, [open]);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleWarehouse = (wh) => {
    setForm(f => {
      const sel = { ...f.selections };
      if (sel[wh] !== undefined) { delete sel[wh]; }
      else { sel[wh] = ""; }
      return { ...f, selections: sel };
    });
  };

  // Update qty for a specific warehouse
  const setWhQty = (wh, val) => {
    setForm(f => ({ ...f, selections: { ...f.selections, [wh]: val } }));
  };

  const selectedEntries = Object.entries(form.selections).filter(([, qty]) => parseInt(qty) > 0);
  const canSave = form.productId && selectedEntries.length > 0;

  const handleSave = () => {
    if (!canSave) return;
    const product = products.find(p => p.id === parseInt(form.productId));
    onSave({
      productId:   parseInt(form.productId),
      productName: product.name,
      warehouses:  selectedEntries.map(([name, qty]) => ({ name, qty: parseInt(qty) })),
      date:        form.date,
      note:        form.note,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight:700, fontSize:16, color:"#1e293b", pb:1.5, borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        Record Stock Arrival
        <IconButton size="small" onClick={onClose} sx={{ color:"#94a3b8" }}><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt:2.5, display:"flex", flexDirection:"column", gap:2 }}>

        {/* Product */}
        <Box>
          <Typography sx={{ fontSize:13, fontWeight:600, color:"#374151", mb:0.5 }}>Product *</Typography>
          <Select fullWidth size="small" value={form.productId} onChange={e => setField("productId", e.target.value)}
            displayEmpty sx={{ borderRadius:2, "& .MuiOutlinedInput-notchedOutline":{ borderColor:"#e2e8f0" } }}>
            <MenuItem value="" disabled><Typography sx={{ color:"#94a3b8", fontSize:13 }}>Select a product</Typography></MenuItem>
            {products.map(p => (
              <MenuItem key={p.id} value={p.id}><Typography sx={{ fontSize:13 }}>{p.name}</Typography></MenuItem>
            ))}
          </Select>
        </Box>

        {/* Warehouses — multi-select, each with its own qty field */}
        <Box>
          <Typography sx={{ fontSize:13, fontWeight:600, color:"#374151", mb:1 }}>
            Warehouses * <Box component="span" sx={{ fontSize:11, color:"#94a3b8", fontWeight:400 }}>(select one or more)</Box>
          </Typography>

          <Box sx={{ display:"flex", flexDirection:"column", gap:1 }}>
            {warehouses.map(wh => {
              const selected = form.selections[wh] !== undefined;
              return (
                <Box key={wh} sx={{ display:"flex", alignItems:"center", gap:1 }}>
                  {/* Toggle button */}
                  <Button onClick={() => toggleWarehouse(wh)} size="small"
                    sx={{
                      minWidth:110, py:0.7, borderRadius:2, textTransform:"none", fontSize:13, fontWeight:600,
                      border:"1px solid", boxShadow:"none", flexShrink:0,
                      bgcolor: selected ? "#1e293b" : "transparent",
                      color:   selected ? "#fff"    : "#475569",
                      borderColor: selected ? "#1e293b" : "#e2e8f0",
                      "&:hover":{ bgcolor: selected ? "#0f172a" : "#f8fafc", boxShadow:"none" },
                    }}>
                    Warehouse {wh}
                  </Button>

                  {/* Qty field — only visible when selected */}
                  {selected && (
                    <TextField size="small" type="number" placeholder="Qty"
                      value={form.selections[wh]}
                      onChange={e => setWhQty(wh, e.target.value)}
                      inputProps={{ min:1 }}
                      sx={{ flex:1, "& .MuiOutlinedInput-root":{ borderRadius:2, "& fieldset":{ borderColor:"#e2e8f0" } } }}
                    />
                  )}
                </Box>
              );
            })}

          </Box>
        </Box>

        {/* Arrival Date */}
        <Box>
          <Typography sx={{ fontSize:13, fontWeight:600, color:"#374151", mb:0.5 }}>Arrival Date *</Typography>
          <TextField fullWidth size="small" type="date" value={form.date} onChange={e => setField("date", e.target.value)}
            sx={{ "& .MuiOutlinedInput-root":{ borderRadius:2, "& fieldset":{ borderColor:"#e2e8f0" } } }} />
        </Box>

        {/* Note */}
        <Box>
          <Typography sx={{ fontSize:13, fontWeight:600, color:"#374151", mb:0.5 }}>Note (optional)</Typography>
          <TextField fullWidth size="small" placeholder="e.g. Regular restock, Supplier shipment..."
            value={form.note} onChange={e => setField("note", e.target.value)}
            sx={{ "& .MuiOutlinedInput-root":{ borderRadius:2, "& fieldset":{ borderColor:"#e2e8f0" } } }} />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px:3, py:2, borderTop:"1px solid #f1f5f9", gap:1 }}>
        <Button onClick={onClose} variant="outlined"
          sx={{ borderRadius:2, textTransform:"none", fontWeight:600, color:"#64748b", borderColor:"#e2e8f0" }}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={!canSave}
          sx={{ borderRadius:2, textTransform:"none", fontWeight:600, bgcolor:"#1e293b", "&:hover":{ bgcolor:"#0f172a" }, "&.Mui-disabled":{ bgcolor:"#e2e8f0" } }}>
          Record Arrival
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Delete Dialog ─────────────────────────────────────────────────────────────
function DeleteDialog({ open, item, onConfirm, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx:{ borderRadius:3 } }}>
      <DialogTitle sx={{ fontWeight:700, fontSize:16, color:"#1e293b", pb:1.5, borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        Delete Record
        <IconButton size="small" onClick={onClose} sx={{ color:"#94a3b8" }}><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt:2.5 }}>
        <Typography sx={{ color:"#475569", lineHeight:1.7, fontSize:14 }}>
          Delete arrival record for <Box component="span" sx={{ fontWeight:700, color:"#1e293b" }}>"{item?.productName}"</Box>? This cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px:3, py:2, borderTop:"1px solid #f1f5f9", gap:1 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius:2, textTransform:"none", fontWeight:600, color:"#64748b", borderColor:"#e2e8f0" }}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" sx={{ borderRadius:2, textTransform:"none", fontWeight:600, bgcolor:"#ef4444", "&:hover":{ bgcolor:"#dc2626" } }}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Inventory() {
  const [products, setProducts]   = useState(INITIAL_PRODUCTS);
  const [arrivals, setArrivals]   = useState(INITIAL_ARRIVALS);
  const [warehouses, setWarehouses] = useState(["A", "B"]); // dynamic list
  const [search, setSearch]       = useState("");
  const [whFilter, setWhFilter]   = useState("All");
  const [arrivalOpen, setArrivalOpen] = useState(false);
  const [delItem, setDelItem]     = useState(null);
  const [tab, setTab]             = useState("stock");

  // Add new warehouse to the global list
  const handleAddWarehouse = (name) => {
    if (!warehouses.includes(name)) {
      setWarehouses(w => [...w, name]);
      // Add new warehouse key to every product with 0 stock
      setProducts(ps => ps.map(p => ({ ...p, stock: { ...p.stock, [name]: 0 } })));
    }
  };

  // Save arrival — update product stock accordingly
  const handleSaveArrival = (data) => {
    setArrivals(arr => [{ ...data, id: _arrId++ }, ...arr]);
    setProducts(ps => ps.map(p => {
      if (p.id !== data.productId) return p;
      const newStock = { ...p.stock };
      data.warehouses.forEach(({ name, qty }) => {
        newStock[name] = (newStock[name] || 0) + qty;
      });
      return { ...p, stock: newStock };
    }));
  };

  const handleDelete = () => { setArrivals(arr => arr.filter(a => a.id !== delItem.id)); setDelItem(null); };

  // Stats
  const totalStock = (p) => warehouses.reduce((s, w) => s + (p.stock[w] || 0), 0);
  const whTotals   = warehouses.map(w => ({ w, total: products.reduce((s, p) => s + (p.stock[w] || 0), 0) }));
  const lowItems   = products.filter(p => totalStock(p) <= LOW_THRESHOLD).length;

  // Filtered products
  const visibleProducts = products.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    const matchWh = whFilter === "All" ? true : (p.stock[whFilter] || 0) > 0;
    return matchSearch && matchWh;
  });

  // Filtered arrivals
  const visibleArrivals = arrivals
    .filter(a => a.productName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Box sx={{ p:"28px 32px 48px", bgcolor:"#f0f4f8", minHeight:"100%", boxSizing:"border-box" }}>

      {/* Header */}
      <Box sx={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", mb:3 }}>
        <Box>
          <Typography sx={{ fontSize:20, fontWeight:800, color:"#1e293b" }}>Inventory</Typography>
          <Typography sx={{ fontSize:13, color:"#94a3b8", mt:0.5 }}>{products.length} products · {warehouses.length} warehouses</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setArrivalOpen(true)}
          sx={{ bgcolor:"#1e293b", borderRadius:2.5, textTransform:"none", fontWeight:600, fontSize:13, px:2.5, py:1.1, boxShadow:"none", "&:hover":{ bgcolor:"#0f172a", boxShadow:"none" } }}>
          Record Arrival
        </Button>
      </Box>

      {/* Stats — dynamic: one card per warehouse + total products + low stock */}
      <Box sx={{ display:"grid", gridTemplateColumns:`repeat(${2 + warehouses.length}, 1fr)`, gap:2, mb:3 }}>
        <Box sx={{ bgcolor:"#fff", border:"1px solid #e8ecf0", borderRadius:3, p:"18px 20px", display:"flex", alignItems:"center", gap:2 }}>
          <Box sx={{ width:44, height:44, borderRadius:"50%", bgcolor:"#e3f2fd", color:"#2196f3", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <InventoryOutlinedIcon />
          </Box>
          <Box>
            <Typography sx={{ fontSize:26, fontWeight:800, color:"#1e293b", lineHeight:1 }}>{products.length}</Typography>
            <Typography sx={{ fontSize:12, color:"#94a3b8", mt:0.4, fontWeight:500 }}>Total Products</Typography>
          </Box>
        </Box>

        {whTotals.map(({ w, total }) => (
          <Box key={w} sx={{ bgcolor:"#fff", border:"1px solid #e8ecf0", borderRadius:3, p:"18px 20px", display:"flex", alignItems:"center", gap:2 }}>
            <Box sx={{ width:44, height:44, borderRadius:"50%", bgcolor:"#e8f5e9", color:"#4caf50", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <WarehouseOutlinedIcon />
            </Box>
            <Box>
              <Typography sx={{ fontSize:26, fontWeight:800, color:"#1e293b", lineHeight:1 }}>{total}</Typography>
              <Typography sx={{ fontSize:12, color:"#94a3b8", mt:0.4, fontWeight:500 }}>Warehouse {w}</Typography>
            </Box>
          </Box>
        ))}

        <Box sx={{ bgcolor:"#fff", border:"1px solid #e8ecf0", borderRadius:3, p:"18px 20px", display:"flex", alignItems:"center", gap:2 }}>
          <Box sx={{ width:44, height:44, borderRadius:"50%", bgcolor:"#fff3e0", color:"#f97316", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <WarningAmberOutlinedIcon />
          </Box>
          <Box>
            <Typography sx={{ fontSize:26, fontWeight:800, color:"#1e293b", lineHeight:1 }}>{lowItems}</Typography>
            <Typography sx={{ fontSize:12, color:"#94a3b8", mt:0.4, fontWeight:500 }}>Low Stock Items</Typography>
          </Box>
        </Box>
      </Box>

      {/* Search + Warehouse filter + Tab toggle */}
      <Box sx={{ display:"flex", alignItems:"center", gap:1.5, mb:2.5, flexWrap:"wrap" }}>
        <TextField size="small" placeholder="Search by name or SKU..." value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{ startAdornment:<InputAdornment position="start"><SearchIcon sx={{ fontSize:18, color:"#94a3b8" }} /></InputAdornment> }}
          sx={{ width:280, bgcolor:"#fff", "& .MuiOutlinedInput-root":{ borderRadius:2, "& fieldset":{ borderColor:"#e2e8f0" }, "&:hover fieldset":{ borderColor:"#cbd5e1" } } }}
        />

        {tab === "stock" && (
          <Box sx={{ display:"flex", gap:0.5 }}>
            {["All", ...warehouses].map(f => (
              <Button key={f} size="small" onClick={() => setWhFilter(f)}
                sx={{
                  px:1.8, py:0.7, borderRadius:2, textTransform:"none", fontSize:13,
                  fontWeight: whFilter === f ? 600 : 400,
                  bgcolor: whFilter === f ? "#1e293b" : "#fff",
                  color:   whFilter === f ? "#fff"    : "#64748b",
                  border:"1px solid", borderColor: whFilter === f ? "#1e293b" : "#e2e8f0",
                  boxShadow:"none", "&:hover":{ bgcolor: whFilter === f ? "#0f172a" : "#f8fafc", boxShadow:"none" },
                }}>
                {f === "All" ? "All Warehouses" : `Warehouse ${f}`}
              </Button>
            ))}
          </Box>
        )}

        <Box sx={{ ml:"auto", display:"flex", bgcolor:"#fff", border:"1px solid #e2e8f0", borderRadius:2, overflow:"hidden" }}>
          {[
            { key:"stock",    label:"Stock Levels",    icon:<InventoryOutlinedIcon sx={{ fontSize:16 }} /> },
            { key:"arrivals", label:"Arrival History", icon:<LocalShippingOutlinedIcon sx={{ fontSize:16 }} /> },
          ].map(t => (
            <Button key={t.key} size="small" startIcon={t.icon} onClick={() => setTab(t.key)}
              sx={{
                px:2, py:0.8, borderRadius:0, textTransform:"none", fontSize:12.5, fontWeight:600,
                bgcolor: tab === t.key ? "#1e293b" : "transparent",
                color:   tab === t.key ? "#fff"    : "#64748b",
                boxShadow:"none", "&:hover":{ bgcolor: tab === t.key ? "#0f172a" : "#f8fafc", boxShadow:"none" },
              }}>{t.label}</Button>
          ))}
        </Box>
      </Box>

      {/* ── STOCK LEVELS TAB ─────────────────────────────────────── */}
      {tab === "stock" && (
        <Box sx={{ bgcolor:"#fff", border:"1px solid #e8ecf0", borderRadius:3, overflow:"hidden" }}>
          {/* Dynamic header: Product | SKU | Category | one col per warehouse | Total | Actions */}
          <Box sx={{ display:"grid", gridTemplateColumns:`2fr 1.2fr 1.2fr ${warehouses.map(() => "1fr").join(" ")} 1fr 80px`, px:2.5, py:1.5, borderBottom:"1px solid #f1f5f9", bgcolor:"#f8fafc" }}>
            {["Product", "SKU", "Category", ...warehouses.map(w => `WH ${w}`), "Total", "Actions"].map(h => (
              <Typography key={h} sx={{ fontSize:12, fontWeight:700, color:"#94a3b8", letterSpacing:"0.04em", textTransform:"uppercase" }}>{h}</Typography>
            ))}
          </Box>

          {visibleProducts.length === 0 ? (
            <Box sx={{ textAlign:"center", py:6 }}><Typography sx={{ color:"#94a3b8", fontSize:14 }}>No products found.</Typography></Box>
          ) : visibleProducts.map((p, i) => (
            <Box key={p.id} sx={{ display:"grid", gridTemplateColumns:`2fr 1.2fr 1.2fr ${warehouses.map(() => "1fr").join(" ")} 1fr 80px`, px:2.5, py:1.8, borderBottom: i < visibleProducts.length-1 ? "1px solid #f8fafc" : "none", alignItems:"center", "&:hover":{ bgcolor:"#fafbfc" } }}>
              <Box sx={{ display:"flex", alignItems:"center", gap:1.5 }}>
                <Box sx={{ width:36, height:36, borderRadius:1.5, bgcolor:"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <InventoryOutlinedIcon sx={{ fontSize:18, color:"#cbd5e1" }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize:13, fontWeight:700, color:"#1e293b" }}>{p.name}</Typography>
                  <Typography sx={{ fontSize:11, color:"#94a3b8" }}>{p.subcategory}</Typography>
                </Box>
              </Box>
              <Typography sx={{ fontSize:12.5, color:"#64748b", fontFamily:"monospace" }}>{p.sku}</Typography>
              <Chip label={p.category} size="small" sx={{ fontSize:11, fontWeight:600, bgcolor:"#f0f4f8", color:"#475569", height:22, width:"fit-content" }} />
              {warehouses.map(w => {
                const qty = p.stock[w] || 0;
                const b   = stockBadge(qty);
                return (
                  <Box key={w}>
                    <Typography sx={{ fontSize:14, fontWeight:700, color:"#1e293b" }}>{qty}</Typography>
                    <Chip label={b.label} size="small" sx={{ fontSize:10, fontWeight:700, bgcolor:b.bg, color:b.color, height:18, mt:0.3 }} />
                  </Box>
                );
              })}
              <Typography sx={{ fontSize:14, fontWeight:800, color:"#1e293b" }}>{totalStock(p)}</Typography>
              <Box sx={{ display:"flex", gap:0.5 }}>
                <IconButton size="small" onClick={() => setArrivalOpen(true)}
                  sx={{ color:"#94a3b8", bgcolor:"#f5f7fa", borderRadius:1.5, p:0.6, "&:hover":{ color:"#1e88e5", bgcolor:"#e3f2fd" } }}>
                  <AddIcon sx={{ fontSize:15 }} />
                </IconButton>
                <IconButton size="small"
                  sx={{ color:"#94a3b8", bgcolor:"#f5f7fa", borderRadius:1.5, p:0.6, "&:hover":{ color:"#ef4444", bgcolor:"#fce4ec" } }}>
                  <DeleteOutlineIcon sx={{ fontSize:15 }} />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* ── ARRIVAL HISTORY TAB ──────────────────────────────────── */}
      {tab === "arrivals" && (
        <Box sx={{ bgcolor:"#fff", border:"1px solid #e8ecf0", borderRadius:3, overflow:"hidden" }}>
          <Box sx={{ display:"grid", gridTemplateColumns:"2fr 1.5fr 1fr 1fr 2fr 60px", px:2.5, py:1.5, borderBottom:"1px solid #f1f5f9", bgcolor:"#f8fafc" }}>
            {["Product", "Warehouses", "Total Qty", "Date", "Note", ""].map(h => (
              <Typography key={h} sx={{ fontSize:12, fontWeight:700, color:"#94a3b8", letterSpacing:"0.04em", textTransform:"uppercase" }}>{h}</Typography>
            ))}
          </Box>

          {visibleArrivals.length === 0 ? (
            <Box sx={{ textAlign:"center", py:6 }}><Typography sx={{ color:"#94a3b8", fontSize:14 }}>No arrival records found.</Typography></Box>
          ) : visibleArrivals.map((a, i) => (
            <Box key={a.id} sx={{ display:"grid", gridTemplateColumns:"2fr 1.5fr 1fr 1fr 2fr 60px", px:2.5, py:1.8, borderBottom: i < visibleArrivals.length-1 ? "1px solid #f8fafc" : "none", alignItems:"center", "&:hover":{ bgcolor:"#fafbfc" } }}>
              <Box sx={{ display:"flex", alignItems:"center", gap:1.5 }}>
                <Box sx={{ width:36, height:36, borderRadius:"50%", bgcolor:"#e8f5e9", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <LocalShippingOutlinedIcon sx={{ fontSize:18, color:"#4caf50" }} />
                </Box>
                <Typography sx={{ fontSize:13, fontWeight:700, color:"#1e293b" }}>{a.productName}</Typography>
              </Box>
              {/* Multi-warehouse chips */}
              <Box sx={{ display:"flex", flexWrap:"wrap", gap:0.5 }}>
                {a.warehouses.map(({ name, qty }) => (
                  <Chip key={name} label={`WH ${name}: +${qty}`} size="small"
                    sx={{ fontSize:11, fontWeight:700, bgcolor:"#e8f5e9", color:"#16a34a", height:22 }} />
                ))}
              </Box>
              <Typography sx={{ fontSize:14, fontWeight:800, color:"#1e293b" }}>
                +{a.warehouses.reduce((s, w) => s + w.qty, 0)}
              </Typography>
              <Box sx={{ display:"flex", alignItems:"center", gap:0.5 }}>
                <CalendarTodayOutlinedIcon sx={{ fontSize:13, color:"#94a3b8" }} />
                <Typography sx={{ fontSize:12.5, color:"#475569" }}>{fmtDate(a.date)}</Typography>
              </Box>
              <Typography sx={{ fontSize:12, color:"#94a3b8", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>
                {a.note || "—"}
              </Typography>
              <IconButton size="small" onClick={() => setDelItem(a)}
                sx={{ color:"#94a3b8", bgcolor:"#f5f7fa", borderRadius:1.5, p:0.6, "&:hover":{ color:"#ef4444", bgcolor:"#fce4ec" } }}>
                <DeleteOutlineIcon sx={{ fontSize:15 }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      <ArrivalDialog open={arrivalOpen} products={products} warehouses={warehouses}
        onSave={handleSaveArrival} onClose={() => setArrivalOpen(false)} />
      <DeleteDialog open={!!delItem} item={delItem} onConfirm={handleDelete} onClose={() => setDelItem(null)} />
    </Box>
  );
}