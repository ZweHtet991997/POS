import { useState } from "react";
import {
  Box, Typography, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, InputAdornment, Dialog, DialogTitle,
  DialogContent, DialogActions, Paper, Chip, IconButton,
  Snackbar, Alert, Table, TableHead, TableBody, TableRow, TableCell,
  Stepper, Step, StepLabel, useMediaQuery, useTheme, Grid,
} from "@mui/material";
import SearchIcon        from "@mui/icons-material/Search";
import CloseIcon         from "@mui/icons-material/Close";
import WarehouseIcon     from "@mui/icons-material/Warehouse";
import InventoryIcon     from "@mui/icons-material/Inventory2Outlined";
import SwapHorizIcon     from "@mui/icons-material/SwapHoriz";
import ArrowForwardIcon  from "@mui/icons-material/ArrowForward";
import CheckCircleIcon   from "@mui/icons-material/CheckCircle";
import AccessTimeIcon    from "@mui/icons-material/AccessTime";
import CheckIcon         from "@mui/icons-material/Check";

/* ── palette ── */
const C = {
  navy:   "#1f3a5f",
  teal:   "#0d9488",
  tealBg: "#f0fdfa",
  tealBd: "#99f6e4",
  bg:     "#f9fafb",
  border: "#e5e7eb",
  border2:"#e2e8f0",
  text:   "#111827",
  sub:    "#6b7280",
  muted:  "#9ca3af",
  low:    { bg:"#fef3c7", text:"#d97706" },
  ok:     { bg:"#dcfce7", text:"#15803d" },
  blue:   { bg:"#eff6ff", text:"#1d4ed8", bd:"#bfdbfe" },
};

const fmt   = (n) => Number(n).toLocaleString();
const tsNow = () => new Date().toLocaleString("en-GB", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });

/* ── shared MUI style shorthands ── */
const tfSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2, fontSize: 14,
    "&:hover fieldset": { borderColor: C.teal },
    "&.Mui-focused fieldset": { borderColor: C.teal },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: C.teal },
};
const primaryBtnSx = {
  bgcolor: C.navy, borderRadius: 2, textTransform:"none", fontWeight:600, fontSize:14, px:3,
  boxShadow:"none", "&:hover":{ bgcolor:"#16304f", boxShadow:"none" },
};
const outlineBtnSx = {
  borderRadius:2, textTransform:"none", fontWeight:600, fontSize:14,
  borderColor:C.border2, color:"#475569", "&:hover":{ borderColor:"#cbd5e1", bgcolor:"transparent" },
};

const SEED_PRODUCTS = [
  { id:1, name:"Mama Noodles Chicken",       sku:"MN-CHK-001",  category:"Food",          unit:"Pack",   warehouse:"Warehouse A", qty:240 },
  { id:2, name:"Coca-Cola 330ml Can",        sku:"CC-330-002",  category:"Beverage",      unit:"Can",    warehouse:"Warehouse A", qty:180 },
  { id:3, name:"Myanmar Beer 640ml",         sku:"MB-640-003",  category:"Beverage",      unit:"Bottle", warehouse:"Warehouse B", qty:96  },
  { id:4, name:"Lay's Classic 75g",          sku:"LYS-CLS-004", category:"Snacks",        unit:"Pack",   warehouse:"Warehouse A", qty:150 },
  { id:5, name:"Shwe Pu Zun Condensed Milk", sku:"SPZ-CM-005",  category:"Dairy",         unit:"Can",    warehouse:"Warehouse B", qty:8   },
  { id:6, name:"Sunflower Cooking Oil 1L",   sku:"SFO-1L-006",  category:"Food",          unit:"Bottle", warehouse:"Warehouse A", qty:64  },
  { id:7, name:"Colgate Toothpaste 150g",    sku:"CLG-TP-007",  category:"Personal Care", unit:"Tube",   warehouse:"Warehouse B", qty:72  },
];

const ALL_WAREHOUSES = ["Warehouse A", "Warehouse B"];
let _txnId = 1001;

/* ══════════════════════════════════════════════════════════
   WAREHOUSE DROPDOWN FIELD (reusable inside modal)
══════════════════════════════════════════════════════════ */
function WhSelect({ label, value, onChange, warehouses, exclude, inventory, error }) {
  const stats = value
    ? `${inventory.filter(r => r.warehouse===value).length} products • ${fmt(inventory.filter(r=>r.warehouse===value).reduce((a,r)=>a+r.qty,0))} units`
    : null;

  return (
    <Box>
      <FormControl fullWidth size="small" error={error} sx={tfSx}>
        <InputLabel>{label}</InputLabel>
        <Select
          label={label}
          value={value}
          onChange={e => onChange(e.target.value)}
          startAdornment={<InputAdornment position="start"><WarehouseIcon sx={{ fontSize:16, color:C.muted, mr:0.5 }} /></InputAdornment>}
        >
          <MenuItem value=""><em>— Select warehouse —</em></MenuItem>
          {warehouses.map(w => (
            <MenuItem key={w} value={w}>{w}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {stats && <Typography fontSize={12} color={C.muted} mt={0.5} pl={0.5}>{stats}</Typography>}
    </Box>
  );
}

/* ══════════════════════════════════════════════════════════
   TRANSFER MODAL — 3-step Dialog
══════════════════════════════════════════════════════════ */
function TransferDialog({ open, inventory, warehouses, onConfirm, onClose }) {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [step,    setStep]    = useState(0);   // 0,1,2
  const [from,    setFrom]    = useState("");
  const [to,      setTo]      = useState("");
  const [selProds, setSelProds] = useState([]);
  const [qtyMap, setQtyMap] = useState({});
  const [search,  setSearch]  = useState("");
  const [err,     setErr]     = useState("");

  const reset = () => { setStep(0); setFrom(""); setTo(""); setSelProds([]); setQtyMap({}); setSearch(""); setErr(""); };

  const handleClose = () => { reset(); onClose(); };

  const isSameWarehouse = !!from && !!to && from === to;
  const available = inventory.filter(r =>
    r.warehouse === from && r.qty > 0 &&
    (r.name.toLowerCase().includes(search.toLowerCase()) || r.sku.toLowerCase().includes(search.toLowerCase()))
  );

  /* navigation */
  const goStep1 = () => {
    if (!from)       { setErr("Please select a source warehouse."); return; }
    if (!to)         { setErr("Please select a destination warehouse."); return; }
    if (from === to) {
      setErr("Cannot transfer to the same warehouse.");
      return;
    }
    setErr(""); setSearch(""); setStep(1);
  };

  const goStep2 = () => {
    if (selProds.length === 0) { setErr("Please select at least one product."); return; }
    setErr(""); setStep(2);
  };

  const handleConfirm = () => {
    const transfers = selProds.map(p => {
      const q = Number(qtyMap[p.id]);
      return { product: p, qty: q };
    });

    for (let t of transfers) {
      if (!t.qty || isNaN(t.qty) || t.qty <= 0) {
        setErr("Enter valid quantities for all products.");
        return;
      }
      if (t.qty > t.product.qty) {
        // setErr(`Quantity exceeds available stock for ${t.product.name}`);
        setErr("One or more quantities exceed available stock.");
        return;
      }
    }

    transfers.forEach(t => {
      onConfirm({ from, to, product: t.product, qty: t.qty });
    });
    handleClose();
  };

  /* ── Route badge shown in steps 1 & 2 ── */
  const RouteBadge = () => (
    <Box sx={{ display:"flex", alignItems:"center", gap:1, p:1.2, borderRadius:2, bgcolor:"#f8fafc", border:`1px solid ${C.border}`, flexWrap:"wrap" }}>
      <Chip label={from} size="small" sx={{ bgcolor:C.blue.bg, color:C.blue.text, fontWeight:700, border:`1px solid ${C.blue.bd}` }} />
      <ArrowForwardIcon sx={{ fontSize:16, color:C.muted }} />
      <Chip label={to} size="small" sx={{ bgcolor:C.tealBg, color:C.teal, fontWeight:700, border:`1px solid ${C.tealBd}` }} />
      <Button size="small" onClick={() => { setStep(0); setSelProd(null); setErr(""); }}
        sx={{ ml:"auto", fontSize:12, fontWeight:600, color:C.sub, textTransform:"none", p:0, minWidth:0, "&:hover":{ bgcolor:"transparent", color:C.text } }}>
        Change
      </Button>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      fullScreen={isMobile}
      PaperProps={{ sx:{ borderRadius: isMobile ? 0 : 3 } }}
    >
      <DialogTitle sx={{ display:"flex", alignItems:"center", justifyContent:"space-between", pb:1, fontWeight:700, fontSize:16, color:C.text }}>
        <Box sx={{ display:"flex", alignItems:"center", gap:1 }}>
          <Box sx={{ width:32, height:32, borderRadius:1.5, bgcolor:C.blue.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <SwapHorizIcon sx={{ fontSize:18, color:C.blue.text }} />
          </Box>
          Transfer Product
        </Box>
        <IconButton onClick={handleClose} size="small"><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>

      {/* MUI Stepper */}
      <Box sx={{ px:3, pb:1, borderBottom:`1px solid #f1f5f9` }}>
        <Stepper activeStep={step} alternativeLabel={!isMobile}>
          {["Select Warehouses","Select Product","Set Quantity"].map((label, i) => (
            <Step key={label} completed={step > i}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    "&.Mui-active":    { color: C.navy },
                    "&.Mui-completed": { color: C.teal },
                  }
                }}
              >
                <Typography fontSize={12} fontWeight={step >= i ? 600 : 400} color={step >= i ? C.text : C.muted}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ display:"flex", flexDirection:"column", gap:2, pt:2.5 }}>

        {/* ─── STEP 0: pick warehouses ─── */}
        {step === 0 && (
          <>
            <Typography fontSize={13} color={C.sub}>
              Select the source and destination warehouse for this transfer.
            </Typography>

            <WhSelect
              label="Transfer From"
              value={from}
              onChange={v => { setFrom(v); setErr(""); }}
              warehouses={warehouses}
              inventory={inventory}
              error={!!err && !from}
            />

            {/* Arrow divider */}
            <Box sx={{ display:"flex", alignItems:"center", gap:1.5 }}>
              <Box sx={{ flex:1, height:1, bgcolor:C.border }} />
              <Box sx={{ width:36, height:36, borderRadius:"50%", bgcolor: from&&to ? C.teal : "#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", border:`1.5px solid ${from&&to ? C.teal : C.border}`, transition:"all 0.2s" }}>
                <ArrowForwardIcon sx={{ fontSize:16, color: from&&to ? "#fff" : C.muted }} />
              </Box>
              <Box sx={{ flex:1, height:1, bgcolor:C.border }} />
            </Box>

            <WhSelect
              label="Transfer To"
              value={to}
              onChange={v => { setTo(v); setErr(""); }}
              warehouses={warehouses}
              inventory={inventory}
              error={!!err && !to}
            />

            {/* Route preview */}
            {from && to && (
              <Box
                sx={{
                  display:"flex",
                  alignItems:"center",
                  gap:1.5,
                  p:1.5,
                  borderRadius:2,
                  bgcolor: isSameWarehouse ? "#fef2f2" : C.tealBg,
                  border: `1px solid ${isSameWarehouse ? "#fecaca" : C.tealBd}`,
                }}
              >
                <Chip label={from} size="small" sx={{ bgcolor:C.blue.bg, color:C.blue.text, fontWeight:700, border:`1px solid ${C.blue.bd}` }} />
                <ArrowForwardIcon sx={{ fontSize:16, color:C.muted }} />
                <Chip label={to}   size="small" sx={{ bgcolor:"#ccfbf1",  color:C.teal,      fontWeight:700, border:`1px solid ${C.tealBd}` }} />
                <Typography
                  fontSize={12}
                  color={isSameWarehouse ? "#b91c1c" : C.sub}
                  sx={{ ml:"auto", fontWeight:600 }}
                >
                  {isSameWarehouse ? "Invalid route" : "Transfer route confirmed"}
                </Typography>
              </Box>
            )}

            {(err || isSameWarehouse) && (
              <Typography fontSize={12} color="error">
                {isSameWarehouse ? "Cannot transfer to the same warehouse." : err}
              </Typography>
            )}
          </>
        )}

        {/* ─── STEP 1: pick product ─── */}
        {step === 1 && (
          <>
            <RouteBadge />

            <Typography fontSize={13} color={C.sub}>
              Choose a product from <strong>{from}</strong> to transfer.
            </Typography>

            <TextField
              size="small" placeholder="Search product name or SKU…"
              value={search} onChange={e => { setSearch(e.target.value); setErr(""); }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize:18, color:C.muted }} /></InputAdornment> }}
              sx={tfSx} fullWidth autoFocus
            />

            <Box sx={{ maxHeight:280, overflowY:"auto", display:"flex", flexDirection:"column", gap:0.8 }}>
              {available.length === 0
                ? <Typography sx={{ textAlign:"center", color:C.muted, fontSize:13, my:3 }}>
                    {inventory.filter(r=>r.warehouse===from).length===0
                      ? `No products in ${from}.`
                      : "No products match your search."}
                  </Typography>
                : available.map(r => {
                    const active = selProds.some(p => p.id === r.id);
                    const isLow  = r.qty < 10;
                    return (
                      <Box
                        key={r.id}
                        onClick={() => {
                          setSelProds(prev => {
                            const exists = prev.find(p => p.id === r.id);
                            if (exists) return prev.filter(p => p.id !== r.id);
                            return [...prev, r];
                          });
                          setErr("");
                        }}
                        sx={{
                          display:"flex", alignItems:"center", gap:1.5, p:1.5,
                          borderRadius:2, cursor:"pointer",
                          border: `1.5px solid ${active ? C.teal : C.border}`,
                          bgcolor: active ? C.tealBg : "#fff",
                          transition:"all 0.15s",
                          "&:hover": { borderColor: C.teal, bgcolor: C.tealBg },
                        }}
                      >
                        <Box sx={{ width:36, height:36, borderRadius:1.5, bgcolor: active ? "#ccfbf1" : "#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <InventoryIcon sx={{ fontSize:16, color: active ? C.teal : C.muted }} />
                        </Box>
                        <Box sx={{ flex:1, minWidth:0 }}>
                          <Typography fontWeight={600} fontSize={14} color={C.text} noWrap>{r.name}</Typography>
                          <Typography fontSize={12} color={C.muted}>{r.sku} • {r.category}</Typography>
                        </Box>
                        <Box sx={{ textAlign:"right", flexShrink:0 }}>
                          <Typography fontWeight={700} fontSize={14} color={C.text}>{fmt(r.qty)}</Typography>
                          <Chip label={`${r.unit}${isLow?" · Low":""}`} size="small"
                            sx={{ fontSize:10, fontWeight:700, height:18, bgcolor: isLow ? C.low.bg : C.ok.bg, color: isLow ? C.low.text : C.ok.text }} />
                        </Box>
                        <Box sx={{ width:22, height:22, borderRadius:"50%", bgcolor: active ? C.teal : "#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, ml:0.5 }}>
                          {active && <CheckIcon sx={{ fontSize:13, color:"#fff" }} />}
                        </Box>
                      </Box>
                    );
                  })
              }
            </Box>
            {err && <Typography fontSize={12} color="error">{err}</Typography>}
          </>
        )}

        {/* ─── STEP 2: set quantity ─── */}
        {step === 2 && selProds.length > 0 && (
          <>
            <RouteBadge />
            {selProds.map(p => {
              const value = qtyMap[p.id] || "";
              return (
                <Box key={p.id} sx={{ p:1.5, border:"1px solid #e5e7eb", borderRadius:2, mb:2 }}>
                  <Typography fontWeight={600}>{p.name}</Typography>
                  <Typography fontSize={12} color={C.sub}>
                    Available: {fmt(p.qty)} {p.unit}
                  </Typography>
                  <TextField
                    size="small"
                    type="number"
                    fullWidth
                    placeholder="Enter quantity"
                    value={value}
                    onChange={(e) => {
                      setQtyMap(prev => ({
                        ...prev,
                        [p.id]: e.target.value
                      }));
                      setErr("");  
                    }}
                    error = {Number(value) > p.qty}
                    helperText={
                      Number(value) > p.qty
                      ? `Exceeds available stock (${fmt(p.qty)} ${p.unit})`
                      : ""
                    }
                    sx={{ mt:1 }}
                  />
                </Box>
              );
            })}
            {err && <Typography fontSize={12} color="error">{err}</Typography>}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px:3, py:2, gap:1 }}>
        {step === 0 && (
          <>
            <Button onClick={handleClose} variant="outlined" sx={outlineBtnSx}>Cancel</Button>
            <Button
              onClick={goStep1}
              variant="contained"
              sx={primaryBtnSx}
              disabled={!from || !to || isSameWarehouse}
            >
              Next →
            </Button>
          </>
        )}
        {step === 1 && (<><Button onClick={() => { setStep(0); setErr(""); }} variant="outlined" sx={outlineBtnSx}>← Back</Button><Button onClick={goStep2} variant="contained" sx={primaryBtnSx}>Next →</Button></>)}
        {step === 2 && (
          <>
            <Button onClick={() => { setStep(1); setErr(""); }} variant="outlined" sx={outlineBtnSx}>← Back</Button>

            {/* <Button onClick={handleConfirm} variant="contained" startIcon={<SwapHorizIcon />}
              sx={{ ...primaryBtnSx, bgcolor:C.teal, "&:hover":{ bgcolor:"#0b7a70" } }}>
              Confirm Transfer
            </Button> */}

            <Button
              onClick={handleConfirm}
              variant="contained"
              startIcon={<SwapHorizIcon />}
              disabled={selProds.some(p => {
                const q = Number(qtyMap[p.id]);
                return !q || q <= 0 || q > p.qty;
              })}
              sx={{
                ...primaryBtnSx,
                bgcolor: C.teal,
                "&:hover": { bgcolor:"#0b7a70" }
              }}
            >
              Confirm Transfer
            </Button>

          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
export default function WH_Transfer() {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [inventory, setInventory] = useState(
    SEED_PRODUCTS.map(p => ({ id:p.id, name:p.name, sku:p.sku, category:p.category, unit:p.unit, warehouse:p.warehouse, qty:p.qty }))
  );
  const [history,   setHistory]   = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [toast,     setToast]     = useState(null);
  const [search,    setSearch]    = useState("");
  const [whFilter,  setWhFilter]  = useState("All");

  const doTransfer = ({ from, to, product, qty }) => {
    setInventory(inv => {
      const next = [...inv];
      const si = next.findIndex(r => r.id===product.id && r.warehouse===from);
      if (si !== -1) next[si] = { ...next[si], qty: next[si].qty - qty };
      const di = next.findIndex(r => r.id===product.id && r.warehouse===to);
      if (di !== -1) next[di] = { ...next[di], qty: next[di].qty + qty };
      else next.push({ id:product.id, name:product.name, sku:product.sku, category:product.category, unit:product.unit, warehouse:to, qty });
      return next;
    });
    setHistory(h => [{ txnId:`TXN-${_txnId++}`, from, to, name:product.name, sku:product.sku, unit:product.unit, qty, ts:tsNow() }, ...h]);
    setToast(`Transferred ${fmt(qty)} ${product.unit} of "${product.name}" → ${to}`);
  };

  const filteredStock = inventory.filter(r =>
    (r.name.toLowerCase().includes(search.toLowerCase()) || r.sku.toLowerCase().includes(search.toLowerCase())) &&
    (whFilter === "All" || r.warehouse === whFilter)
  );

  const summary = ALL_WAREHOUSES.map(wh => ({
    wh,
    count: inventory.filter(r=>r.warehouse===wh).length,
    total: inventory.filter(r=>r.warehouse===wh).reduce((a,r)=>a+r.qty,0),
  }));

  return (
    <Box sx={{ p:{ xs:2, sm:3, md:4 }, bgcolor:C.bg, minHeight:"100vh" }}>

      {/* ── Header ── */}
      <Box sx={{ display:"flex", flexDirection:{ xs:"column", sm:"row" }, alignItems:{ xs:"flex-start", sm:"center" }, justifyContent:"space-between", gap:2, mb:3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color={C.text}>Warehouse Transfer</Typography>
          <Typography fontSize={14} color={C.sub} mt={0.5}>
            {history.length} transfer{history.length!==1?"s":""} completed • {fmt(inventory.reduce((a,r)=>a+r.qty,0))} total units
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SwapHorizIcon />}
          onClick={() => setShowModal(true)}
          fullWidth={isMobile}
          sx={primaryBtnSx}
        >
          Transfer Product
        </Button>
      </Box>

      {/* ── Stat Cards ── */}
      <Grid container spacing={2} sx={{ mb:3 }}>
        {summary.map(({ wh, count, total }) => (
          <Grid item xs={12} sm={6} md={4} key={wh}>
            <Paper elevation={0} sx={{ p:2.5, borderRadius:3, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:2 }}>
              <Box sx={{ width:46, height:46, borderRadius:2, bgcolor:C.tealBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <WarehouseIcon sx={{ color:C.teal, fontSize:22 }} />
              </Box>
              <Box>
                <Typography fontSize={20} fontWeight={700} color={C.text}>
                  {fmt(total)} <Typography component="span" fontSize={12} fontWeight={400} color={C.muted}>units</Typography>
                </Typography>
                <Typography fontSize={13} color={C.sub}>{wh} • {count} products</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={0} sx={{ p:2.5, borderRadius:3, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:2 }}>
            <Box sx={{ width:46, height:46, borderRadius:2, bgcolor:"#eff6ff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <AccessTimeIcon sx={{ color:"#3b82f6", fontSize:22 }} />
            </Box>
            <Box>
              <Typography fontSize={20} fontWeight={700} color={C.text}>{history.length}</Typography>
              <Typography fontSize={13} color={C.sub}>Transfers Today</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* ── Current Stock Table ── */}
      <Paper elevation={0} sx={{ borderRadius:3, border:`1px solid ${C.border}`, overflow:"hidden", mb:2.5 }}>
        <Box sx={{ display:"flex", flexDirection:{ xs:"column", sm:"row" }, alignItems:{ sm:"center" }, justifyContent:"space-between", gap:1.5, p:2, borderBottom:`1px solid ${C.border}` }}>
          <Box>
            <Typography fontWeight={700} fontSize={15} color={C.text} component="span">Current Stock by Warehouse</Typography>
            <Typography fontSize={13} color={C.muted} component="span" sx={{ ml:1 }}>{filteredStock.length} records</Typography>
          </Box>
          <Box sx={{ display:"flex", gap:1.5, flexDirection:{ xs:"column", sm:"row" } }}>
            <TextField
              size="small" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
              InputProps={{ startAdornment:<InputAdornment position="start"><SearchIcon sx={{ fontSize:18, color:C.muted }} /></InputAdornment> }}
              sx={{ ...tfSx, minWidth:{ sm:200 } }}
            />
            <FormControl size="small" sx={{ minWidth:{ xs:"100%", sm:160 }, ...tfSx }}>
              <InputLabel>Warehouse</InputLabel>
              <Select label="Warehouse" value={whFilter} onChange={e => setWhFilter(e.target.value)}>
                <MenuItem value="All">All Warehouses</MenuItem>
                {ALL_WAREHOUSES.map(w => <MenuItem key={w} value={w}>{w}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ overflowX:"auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor:"#f9fafb" }}>
                {["Product","SKU","Category","Warehouse","Qty","Stock Level"].map(h => (
                  <TableCell key={h} sx={{ fontSize:13, fontWeight:600, color:C.sub, borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap",
                    display: h==="SKU" && isMobile ? "none" : "table-cell" }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStock.length === 0
                ? <TableRow><TableCell colSpan={6} sx={{ textAlign:"center", py:4, color:C.muted, fontSize:14 }}>No records found.</TableCell></TableRow>
                : filteredStock.map(r => {
                    const low = r.qty < 10;
                    return (
                      <TableRow key={`${r.id}-${r.warehouse}`} hover sx={{ "&:last-child td":{ border:0 } }}>
                        <TableCell sx={{ fontWeight:600, color:C.text }}>{r.name}</TableCell>
                        <TableCell sx={{ color:C.sub, fontSize:13, display: isMobile ? "none" : "table-cell" }}>{r.sku}</TableCell>
                        <TableCell>
                          <Chip label={r.category} size="small" sx={{ fontSize:12, fontWeight:500, bgcolor:"#f3f4f6", color:"#374151", border:`1px solid ${C.border}` }} />
                        </TableCell>
                        <TableCell>
                          <Chip label={r.warehouse} size="small" sx={{ fontSize:12, fontWeight:600, bgcolor:C.blue.bg, color:C.blue.text, border:`1px solid ${C.blue.bd}` }} />
                        </TableCell>
                        <TableCell sx={{ fontWeight:700, fontSize:15, color:C.text }}>{fmt(r.qty)}</TableCell>
                        <TableCell>
                          <Chip label={low?"Low":"OK"} size="small"
                            sx={{ fontSize:11, fontWeight:700, bgcolor: low ? C.low.bg : C.ok.bg, color: low ? C.low.text : C.ok.text }} />
                        </TableCell>
                      </TableRow>
                    );
                  })
              }
            </TableBody>
          </Table>
        </Box>
      </Paper>

      {/* ── Transfer History ── */}
      <Paper elevation={0} sx={{ borderRadius:3, border:`1px solid ${C.border}`, overflow:"hidden" }}>
        <Box sx={{ display:"flex", alignItems:"center", gap:1, p:2, borderBottom:`1px solid ${C.border}` }}>
          <AccessTimeIcon sx={{ fontSize:16, color:C.sub }} />
          <Typography fontWeight={700} fontSize={15} color={C.text}>Transfer History</Typography>
          <Typography fontSize={13} color={C.muted}>({history.length} records)</Typography>
        </Box>

        {history.length === 0
          ? (
            <Box sx={{ p:6, textAlign:"center" }}>
              <Box sx={{ width:52, height:52, borderRadius:2, bgcolor:"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", mx:"auto", mb:1.5 }}>
                <SwapHorizIcon sx={{ color:C.muted, fontSize:24 }} />
              </Box>
              <Typography fontSize={14} color={C.muted}>
                No transfers yet. Click <strong>Transfer Product</strong> to get started.
              </Typography>
            </Box>
          )
          : (
            <Box sx={{ overflowX:"auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor:"#f9fafb" }}>
                    {["Txn ID","Product","From","To","Qty","Date / Time","Status"].map(h => (
                      <TableCell key={h} sx={{ fontSize:13, fontWeight:600, color:C.sub, borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap",
                        display: (h==="Date / Time") && isMobile ? "none" : "table-cell" }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map(tx => (
                    <TableRow key={tx.txnId} hover sx={{ "&:last-child td":{ border:0 } }}>
                      <TableCell sx={{ fontWeight:600, color:C.blue.text, fontSize:13 }}>{tx.txnId}</TableCell>
                      <TableCell>
                        <Typography fontWeight={600} fontSize={13} color={C.text}>{tx.name}</Typography>
                        <Typography fontSize={11} color={C.muted}>{tx.sku}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={tx.from} size="small" sx={{ fontSize:12, fontWeight:600, bgcolor:C.blue.bg, color:C.blue.text, border:`1px solid ${C.blue.bd}` }} />
                      </TableCell>
                      <TableCell>
                        <Chip label={tx.to} size="small" sx={{ fontSize:12, fontWeight:600, bgcolor:C.tealBg, color:C.teal, border:`1px solid ${C.tealBd}` }} />
                      </TableCell>
                      <TableCell sx={{ fontWeight:700 }}>
                        {fmt(tx.qty)} <Typography component="span" fontSize={11} color={C.muted} fontWeight={400}>{tx.unit}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize:13, color:C.sub, display: isMobile ? "none" : "table-cell" }}>{tx.ts}</TableCell>
                      <TableCell>
                        <Chip
                          icon={<CheckCircleIcon sx={{ fontSize:"14px !important", color:"#15803d !important" }} />}
                          label="Completed"
                          size="small"
                          sx={{ fontSize:12, fontWeight:600, bgcolor:C.ok.bg, color:C.ok.text }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )
        }
      </Paper>

      {/* ── Transfer Dialog ── */}
      <TransferDialog
        open={showModal}
        inventory={inventory}
        warehouses={ALL_WAREHOUSES}
        onConfirm={doTransfer}
        onClose={() => setShowModal(false)}
      />

      {/* ── Snackbar Toast ── */}
      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical:"bottom", horizontal:"center" }}
      >
        <Alert onClose={() => setToast(null)} severity="success" variant="filled" sx={{ borderRadius:2, bgcolor:"#0f172a" }}>
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
}
