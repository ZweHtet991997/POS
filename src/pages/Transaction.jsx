import { useState } from "react";
import logo from "../assets/logo.png";
import {
  Autocomplete, Avatar, Box, Button, Chip, Dialog, DialogContent, Divider,
  FormControl, IconButton, InputAdornment, MenuItem, Paper, Select,
  Stack, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TextField, Tooltip, Typography,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as EyeIcon,
  AttachMoney as CashIcon,
  PhoneAndroid as PhoneIcon,
  CreditCard as CardIcon,
  FileDownload as ExportIcon,
  Print as PrintIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as ClockIcon,
  Cancel as XCircleIcon,
  PaidOutlined as RevenueIcon,
  PersonOutline as PersonIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  Store as StoreIcon,
  ShoppingCart as CartIcon,
  Add as AddIcon,
  Delete as TrashIcon,
  DeleteOutline as DeleteIcon,
} from "@mui/icons-material";

/* ════════════════════════════════════════
   STATIC DATA
   ════════════════════════════════════════ */
const SEED = [
  { id:1, invoice:"INV-2026-00891", customer:"Daw Aye Aye",      cashier:"Ko Zaw",   items:4, total:21850,  method:"Cash",     status:"Paid",      date:"2026-04-01 14:32", saleType:"Retail"    },
  { id:2, invoice:"INV-2026-00890", customer:"Walk-in Customer", cashier:"Ma Thida", items:3, total:9450,   method:"KBZPay",   status:"Paid",      date:"2026-03-29 14:15", saleType:"Retail"    },
  { id:3, invoice:"INV-2026-00889", customer:"U Kyaw Zin",       cashier:"Ko Zaw",   items:3, total:58900,  method:"Wave Pay", status:"Paid",      date:"2026-03-29 13:58", saleType:"Wholesale" },
  { id:4, invoice:"INV-2026-00888", customer:"Ma Su Su",         cashier:"Ma Thida", items:2, total:13000,  method:"Cash",     status:"Pending",   date:"2026-03-29 13:41", saleType:"Retail"    },
  { id:5, invoice:"INV-2026-00887", customer:"Ko Naing Lin",     cashier:"Ko Zaw",   items:3, total:150670, method:"Card",     status:"Paid",      date:"2026-03-29 13:20", saleType:"Wholesale" },
  { id:6, invoice:"INV-2026-00886", customer:"Walk-in Customer", cashier:"Ma Thida", items:2, total:5200,   method:"Cash",     status:"Cancelled", date:"2026-03-29 13:05", saleType:"Retail"    },
  { id:7, invoice:"INV-2026-00885", customer:"Daw Khin Khin",    cashier:"Ko Zaw",   items:2, total:20520,  method:"KBZPay",   status:"Paid",      date:"2026-03-28 17:45", saleType:"Retail"    },
  { id:8, invoice:"INV-2026-00884", customer:"U Tin Maung",      cashier:"Ko Lin",   items:2, total:31920,  method:"Wave Pay", status:"Refunded",  date:"2026-03-28 16:20", saleType:"Wholesale" },
];

// productId must match the `id` field in NewSale's PRODUCTS array so it can pre-load the cart.
// name/price/unit are kept for display in the read-only receipt dialog.
const DETAIL_ITEMS = {
  "INV-2026-00891": [
    { productId:1, name:"Mama Noodles Chicken",     qty:2, price:2000, unit:"Pack",   subtotal:4000  },
    { productId:2, name:"Coca-Cola 330ml Can",      qty:1, price:1600, unit:"Can",    subtotal:1600  },
    { productId:4, name:"Lay's Classic 75g",        qty:1, price:2000, unit:"Pack",   subtotal:2000  },
    { productId:6, name:"Sunflower Cooking Oil 1L", qty:2, price:8500, unit:"Bottle", subtotal:17000 },
  ],
  "INV-2026-00890": [
    { productId:5, name:"Shwe Pu Zun Condensed",    qty:1, price:2000, unit:"Tin",  subtotal:2000 },
    { productId:7, name:"Colgate Toothpaste 150g",  qty:2, price:3500, unit:"Tube", subtotal:7000 },
    { productId:4, name:"Lay's Classic 75g",        qty:1, price:2000, unit:"Pack", subtotal:2000 },
  ],
  "INV-2026-00889": [
    { productId:6,  name:"Sunflower Cooking Oil 1L", qty:3, price:8500, unit:"Bottle", subtotal:25500 },
    { productId:9,  name:"Lucky Star Canned Tuna",   qty:4, price:3000, unit:"Can",    subtotal:12000 },
    { productId:8,  name:"Surf Excel Detergent",     qty:5, price:4200, unit:"Pack",   subtotal:21000 },
  ],
  "INV-2026-00888": [
    { productId:3,  name:"Myanmar Beer 640ml",       qty:1, price:5000, unit:"Bottle", subtotal:5000  },
    { productId:11, name:"Green Tea 500ml",          qty:4, price:2000, unit:"Bottle", subtotal:8000  },
  ],
  "INV-2026-00887": [
    { productId:6,  name:"Sunflower Cooking Oil 1L", qty:5, price:8500, unit:"Bottle", subtotal:42500 },
    { productId:9,  name:"Lucky Star Canned Tuna",   qty:10, price:3000, unit:"Can",   subtotal:30000 },
    { productId:8,  name:"Surf Excel Detergent",     qty:20, price:4200, unit:"Pack",  subtotal:84000 },
  ],
  "INV-2026-00886": [
    { productId:12, name:"Masafi Mineral Water",     qty:3, price:800,  unit:"Bottle", subtotal:2400  },
    { productId:11, name:"Green Tea 500ml",          qty:2, price:1200, unit:"Bottle", subtotal:2400  },
  ],
  "INV-2026-00885": [
    { productId:1,  name:"Mama Noodles Chicken",     qty:3, price:2000, unit:"Pack",   subtotal:6000  },
    { productId:10, name:"Pocky Chocolate Sticks",   qty:4, price:1800, unit:"Box",    subtotal:7200  },
  ],
  "INV-2026-00884": [
    { productId:3,  name:"Myanmar Beer 640ml",       qty:4, price:5000, unit:"Bottle", subtotal:20000 },
    { productId:2,  name:"Coca-Cola 330ml Can",      qty:3, price:1600, unit:"Can",    subtotal:4800  },
  ],
};

const fmt = (n) => Number(n).toLocaleString();

const STATUS_COLORS = {
  Paid:      { bg:"#dcfce7", color:"#15803d" },
  Pending:   { bg:"#fef9c3", color:"#a16207" },
  Cancelled: { bg:"#f1f5f9", color:"#475569" },
  Refunded:  { bg:"#fce7f3", color:"#be185d" },
};

const SALE_TYPE_STYLES = {
  Retail:    { bg:"#eff6ff", color:"#1d4ed8", icon:<CartIcon sx={{ fontSize:12 }} /> },
  Wholesale: { bg:"#f0fdf4", color:"#15803d", icon:<StoreIcon sx={{ fontSize:12 }} /> },
};

const METHOD_ICON = {
  Cash:       <CashIcon sx={{ fontSize:16 }} />,
  KBZPay:     <PhoneIcon sx={{ fontSize:16 }} />,
  "Wave Pay": <PhoneIcon sx={{ fontSize:16 }} />,
  Card:       <CardIcon sx={{ fontSize:16 }} />,
};

const UNIQUE_CUSTOMERS = ["All", ...Array.from(new Set(SEED.map((t) => t.customer)))];

/* ════════════════════════════════════════
   PRODUCT MASTER LIST (for search dropdown)
   ════════════════════════════════════════ */
const PRODUCT_LIST = [
  { id:1,  name:"Mama Noodles Chicken",     price:2000, unit:"Pack"   },
  { id:2,  name:"Coca-Cola 330ml Can",      price:1600, unit:"Can"    },
  { id:3,  name:"Myanmar Beer 640ml",       price:5000, unit:"Bottle" },
  { id:4,  name:"Lay's Classic 75g",        price:2000, unit:"Pack"   },
  { id:5,  name:"Shwe Pu Zun Condensed",    price:2000, unit:"Tin"    },
  { id:6,  name:"Sunflower Cooking Oil 1L", price:8500, unit:"Bottle" },
  { id:7,  name:"Colgate Toothpaste 150g",  price:3500, unit:"Tube"   },
  { id:8,  name:"Surf Excel Detergent",     price:4200, unit:"Pack"   },
  { id:9,  name:"Lucky Star Canned Tuna",   price:3000, unit:"Can"    },
  { id:10, name:"Pocky Chocolate Sticks",   price:1800, unit:"Box"    },
  { id:11, name:"Green Tea 500ml",          price:1200, unit:"Bottle" },
  { id:12, name:"Masafi Mineral Water",     price:800,  unit:"Bottle" },
];

let _rowId = 1000;
const nextRowId = () => ++_rowId;


/* ════════════════════════════════════════
   StatCard
   ════════════════════════════════════════ */
function StatCard({ icon, iconBg, iconColor, value, label }) {
  return (
    <Paper elevation={0} sx={{
      flex:1, display:"flex", alignItems:"center", gap:2,
      p:2.5, borderRadius:3, border:"1px solid", borderColor:"divider",
    }}>
      <Avatar sx={{ width:48, height:48, borderRadius:2.5, bgcolor:iconBg, color:iconColor }}>
        {icon}
      </Avatar>
      <Box>
        <Typography fontWeight={700} fontSize={20} color="text.primary" lineHeight={1.2}>{value}</Typography>
        <Typography fontSize={13} color="text.secondary" mt={0.3}>{label}</Typography>
      </Box>
    </Paper>
  );
}

/* ════════════════════════════════════════
   DashDivider
   ════════════════════════════════════════ */
function DashDivider() {
  return <Divider sx={{ borderStyle:"dashed", borderColor:"grey.300", my:1.5 }} />;
}

/* ════════════════════════════════════════
   SlipDialog  — READ-ONLY receipt viewer (eye icon)
   ════════════════════════════════════════ */
function SlipDialog({ tx, onClose }) {
  if (!tx) return null;

  const items      = DETAIL_ITEMS[tx.invoice] || [];
  const subtotal   = items.length > 0 ? items.reduce((s, r) => s + r.subtotal, 0) : tx.total;
  const discount   = items.length > 0 ? Math.round(subtotal * 0.05) : 0;
  const grandTotal = subtotal - discount;
  const sc      = STATUS_COLORS[tx.status]      || STATUS_COLORS.Paid;
  const stStyle = SALE_TYPE_STYLES[tx.saleType] || SALE_TYPE_STYLES.Retail;

  return (
    <Dialog open={!!tx} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx:{ borderRadius:4, overflow:"hidden" } }}>
      <DialogContent sx={{ p:0 }}>
        <Box sx={{ bgcolor:"#1f3a5f", px:3, pt:3.5, pb:3, textAlign:"center" }}>
          <Box component="img" src={logo} alt="KBS IMPEX"
            sx={{ width:72, height:72, borderRadius:3, objectFit:"contain", mx:"auto", mb:1.5, display:"block", bgcolor:"#2d5282", p:0.5 }} />
          <Typography fontWeight={700} fontSize={18} color="#fff">KBS IMPEX</Typography>
        </Box>
        <Box sx={{ px:3, pt:2.5, pb:1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography fontSize={12} color="text.disabled" mb={0.3}>Invoice</Typography>
              <Typography fontWeight={700} fontSize={15} color="text.primary">{tx.invoice}</Typography>
            </Box>
            <Stack direction="row" spacing={0.8} alignItems="center" mt={0.3}>
              <Chip icon={stStyle.icon} label={tx.saleType} size="small"
                sx={{ fontSize:11, fontWeight:700, bgcolor:stStyle.bg, color:stStyle.color, "& .MuiChip-icon":{ color:"inherit" } }} />
              <Chip label={tx.status} size="small"
                sx={{ fontSize:12, fontWeight:700, bgcolor:sc.bg, color:sc.color }} />
            </Stack>
          </Stack>
          <Stack direction="row" mb={0.5}>
            <Box sx={{ flex:1 }}>
              <Typography fontSize={12} color="text.disabled">Date</Typography>
              <Typography fontSize={13} fontWeight={600} color="text.primary" mt={0.2}>{tx.date}</Typography>
            </Box>
            <Box sx={{ flex:1 }}>
              <Typography fontSize={12} color="text.disabled">Cashier</Typography>
              <Typography fontSize={13} fontWeight={600} color="text.primary" mt={0.2}>{tx.cashier}</Typography>
            </Box>
          </Stack>
          <Stack direction="row" mt={1.5} mb={0.5}>
            <Box sx={{ flex:1 }}>
              <Typography fontSize={12} color="text.disabled">Customer</Typography>
              <Typography fontSize={13} fontWeight={600} color="text.primary" mt={0.2}>{tx.customer}</Typography>
            </Box>
            <Box sx={{ flex:1 }}>
              <Typography fontSize={12} color="text.disabled">Payment</Typography>
              <Typography fontSize={13} fontWeight={600} color="text.primary" mt={0.2}>{tx.method}</Typography>
            </Box>
          </Stack>
          <DashDivider />
          <Stack direction="row" alignItems="center" mb={1} spacing={0.5}>
            <Typography fontSize={12} fontWeight={600} color="text.secondary" sx={{ flex:1 }}>Item</Typography>
            <Typography fontSize={12} fontWeight={600} color="text.secondary" sx={{ width:40, textAlign:"center" }}>Qty</Typography>
            <Typography fontSize={12} fontWeight={600} color="text.secondary" sx={{ width:72, textAlign:"right" }}>Price</Typography>
            <Typography fontSize={12} fontWeight={600} color="text.secondary" sx={{ width:72, textAlign:"right" }}>Total</Typography>
          </Stack>
          {items.length === 0 ? (
            <Typography fontSize={13} color="text.disabled" py={1}>No item details available.</Typography>
          ) : (
            <Stack spacing={1.4}>
              {items.map((it, idx) => (
                <Stack key={idx} direction="row" alignItems="center" spacing={0.5}>
                  <Typography fontSize={13} color="text.primary" noWrap sx={{ flex:1 }}>{it.name}</Typography>
                  <Typography fontSize={13} color="text.secondary" sx={{ width:40, textAlign:"center" }}>{it.qty}</Typography>
                  <Typography fontSize={13} color="text.secondary" sx={{ width:72, textAlign:"right" }}>{fmt(it.price)}</Typography>
                  <Typography fontSize={13} fontWeight={700} color="text.primary" sx={{ width:72, textAlign:"right" }}>{fmt(it.subtotal)}</Typography>
                </Stack>
              ))}
            </Stack>
          )}
          <DashDivider />
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography fontSize={13} color="text.secondary">Subtotal</Typography>
              <Typography fontSize={13} color="text.secondary">{fmt(subtotal)} MMK</Typography>
            </Stack>
            {discount > 0 && (
              <Stack direction="row" justifyContent="space-between">
                <Typography fontSize={13} color="#16a34a">Discount (5%)</Typography>
                <Typography fontSize={13} color="#16a34a">- {fmt(discount)} MMK</Typography>
              </Stack>
            )}
            <Stack direction="row" justifyContent="space-between" alignItems="center" pt={0.5}>
              <Typography fontSize={14} fontWeight={700} color="text.primary">Grand Total</Typography>
              <Typography fontSize={15} fontWeight={800} color="text.primary">{fmt(grandTotal)} MMK</Typography>
            </Stack>
          </Stack>
          <DashDivider />
          <Stack alignItems="center" py={1}>
            <Typography fontSize={12} color="text.disabled" lineHeight={1.8}>Thank you for shopping with us!</Typography>
            <Typography fontSize={12} color="text.disabled">Powered by KBS IMPEX</Typography>
          </Stack>
          <DashDivider />
        </Box>
        <Stack direction="row" spacing={1} sx={{ px:3, pb:3, pt:0.5 }}>
          <Button fullWidth variant="outlined" onClick={onClose}
            sx={{ borderColor:"divider", color:"text.secondary", fontWeight:600, textTransform:"none", borderRadius:2.5, py:1.3, "&:hover":{ borderColor:"grey.400", bgcolor:"grey.50" } }}>
            Close
          </Button>
          <Button fullWidth variant="contained" startIcon={<PrintIcon />} onClick={() => window.print()}
            sx={{ bgcolor:"#1f3a5f", fontWeight:600, textTransform:"none", borderRadius:2.5, py:1.3, "&:hover":{ bgcolor:"#162d4a" } }}>
            Print
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

/* ════════════════════════════════════════
   EditDialog — EDITABLE slip (edit button)
   Product name = searchable Autocomplete.
   Qty / Price = inline editable TextField.
   ════════════════════════════════════════ */
function EditDialog({ tx, onClose }) {
  const rawItems = tx ? (DETAIL_ITEMS[tx.invoice] || []) : [];

  const [rows, setRows]   = useState(() => rawItems.map((r) => ({ ...r, _id: nextRowId() })));
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  if (!tx) return null;

  const sc      = STATUS_COLORS[tx.status]      || STATUS_COLORS.Paid;
  const stStyle = SALE_TYPE_STYLES[tx.saleType] || SALE_TYPE_STYLES.Retail;
  const subtotal   = rows.reduce((s, r) => s + r.subtotal, 0);
  const discount   = rows.length > 0 ? Math.round(subtotal * 0.05) : 0;
  const grandTotal = subtotal - discount;

  const updateRow = (id, field, val) => {
    setDirty(true); setSaved(false);
    setRows(prev => prev.map(r => {
      if (r._id !== id) return r;
      const updated = { ...r, [field]: val };
      updated.subtotal = Math.round((updated.qty || 0) * (updated.price || 0));
      return updated;
    }));
  };

  const selectProduct = (id, product) => {
    if (!product) return;
    setDirty(true); setSaved(false);
    setRows(prev => prev.map(r => {
      if (r._id !== id) return r;
      const updated = { ...r, productId: product.id, name: product.name, price: product.price, unit: product.unit };
      updated.subtotal = Math.round(updated.qty * updated.price);
      return updated;
    }));
  };

  const deleteRow = (id) => { setDirty(true); setSaved(false); setRows(prev => prev.filter(r => r._id !== id)); };

  const addRow = () => {
    setDirty(true); setSaved(false);
    setRows(prev => [...prev, { _id: nextRowId(), productId: null, name: "", qty: 1, price: 0, unit: "", subtotal: 0 }]);
  };

  const handleSave = () => { setSaved(true); setDirty(false); };

  return (
    <Dialog open={!!tx} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx:{ borderRadius:4, overflow:"hidden" } }}>
      <DialogContent sx={{ p:0 }}>

        {/* Header */}
        <Box sx={{ bgcolor:"#1f3a5f", px:3, pt:3.5, pb:3, textAlign:"center" }}>
          <Box component="img" src={logo} alt="KBS IMPEX"
            sx={{ width:72, height:72, borderRadius:3, objectFit:"contain", mx:"auto", mb:1.5, display:"block", bgcolor:"#2d5282", p:0.5 }} />
          <Typography fontWeight={700} fontSize={18} color="#fff">KBS IMPEX</Typography>
        </Box>

        <Box sx={{ px:3, pt:2.5, pb:1 }}>

          {/* Invoice + badges */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography fontSize={12} color="text.disabled" mb={0.3}>Invoice</Typography>
              <Typography fontWeight={700} fontSize={15} color="text.primary">{tx.invoice}</Typography>
            </Box>
            <Stack direction="row" spacing={0.8} alignItems="center" mt={0.3}>
              <Chip icon={stStyle.icon} label={tx.saleType} size="small"
                sx={{ fontSize:11, fontWeight:700, bgcolor:stStyle.bg, color:stStyle.color, "& .MuiChip-icon":{ color:"inherit" } }} />
              <Chip label={tx.status} size="small"
                sx={{ fontSize:12, fontWeight:700, bgcolor:sc.bg, color:sc.color }} />
            </Stack>
          </Stack>

          {/* Meta */}
          <Stack direction="row" mb={0.5}>
            <Box sx={{ flex:1 }}>
              <Typography fontSize={12} color="text.disabled">Date</Typography>
              <Typography fontSize={13} fontWeight={600} color="text.primary" mt={0.2}>{tx.date}</Typography>
            </Box>
            <Box sx={{ flex:1 }}>
              <Typography fontSize={12} color="text.disabled">Cashier</Typography>
              <Typography fontSize={13} fontWeight={600} color="text.primary" mt={0.2}>{tx.cashier}</Typography>
            </Box>
          </Stack>
          <Stack direction="row" mt={1.5} mb={0.5}>
            <Box sx={{ flex:1 }}>
              <Typography fontSize={12} color="text.disabled">Customer</Typography>
              <Typography fontSize={13} fontWeight={600} color="text.primary" mt={0.2}>{tx.customer}</Typography>
            </Box>
            <Box sx={{ flex:1 }}>
              <Typography fontSize={12} color="text.disabled">Payment</Typography>
              <Typography fontSize={13} fontWeight={600} color="text.primary" mt={0.2}>{tx.method}</Typography>
            </Box>
          </Stack>

          <DashDivider />

          <Typography fontSize={11} color="text.disabled" mb={1} fontStyle="italic">
            Search product · edit qty/price · trash to delete · + to add row
          </Typography>

          {/* Column headers */}
          <Stack direction="row" alignItems="center" mb={1} spacing={0.5}>
            <Typography fontSize={11} fontWeight={600} color="text.secondary" sx={{ flex:1 }}>Item</Typography>
            <Typography fontSize={11} fontWeight={600} color="text.secondary" sx={{ width:36, textAlign:"center" }}>Qty</Typography>
            <Typography fontSize={11} fontWeight={600} color="text.secondary" sx={{ width:68, textAlign:"right" }}>Price</Typography>
            <Typography fontSize={11} fontWeight={600} color="text.secondary" sx={{ width:68, textAlign:"right" }}>Total</Typography>
            <Box sx={{ width:26 }} />
          </Stack>

          {/* Editable rows */}
          {rows.length === 0 ? (
            <Typography fontSize={13} color="text.disabled" py={1}>No items. Click + Add Item.</Typography>
          ) : (
            <Stack spacing={1.2}>
              {rows.map((row) => (
                <Stack key={row._id} direction="row" alignItems="center" spacing={0.5}>
                  <Autocomplete
                    options={PRODUCT_LIST}
                    getOptionLabel={(o) => o.name}
                    value={PRODUCT_LIST.find(p => p.id === row.productId) || null}
                    onChange={(_, val) => selectProduct(row._id, val)}
                    size="small"
                    disableClearable
                    sx={{ flex:1 }}
                    renderInput={(params) => (
                      <TextField {...params}
                        placeholder={row.name || "Search product..."}
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": { borderRadius:1.5, fontSize:12, bgcolor:"#f8fafc",
                            "& fieldset":{ borderColor:"#e2e8f0" }, "&:hover fieldset":{ borderColor:"#94a3b8" } },
                          "& input": { fontSize:12, p:"3px 4px !important" },
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props} sx={{ fontSize:13, py:"6px !important" }}>
                        <Stack>
                          <Typography fontSize={12} fontWeight={600}>{option.name}</Typography>
                          <Typography fontSize={11} color="text.disabled">{fmt(option.price)} MMK / {option.unit}</Typography>
                        </Stack>
                      </Box>
                    )}
                    noOptionsText={<Typography fontSize={12}>No products found</Typography>}
                  />
                  <TextField size="small" type="number" value={row.qty}
                    onChange={(e) => updateRow(row._id, "qty", Math.max(1, parseInt(e.target.value) || 1))}
                    sx={{ width:36,
                      "& .MuiOutlinedInput-root":{ borderRadius:1.5, bgcolor:"#f8fafc", "& fieldset":{ borderColor:"#e2e8f0" } },
                      "& input":{ fontSize:12, textAlign:"center", p:"4px 2px", MozAppearance:"textfield" },
                      "& input::-webkit-outer-spin-button":{ display:"none" },
                      "& input::-webkit-inner-spin-button":{ display:"none" },
                    }}
                  />
                  <TextField size="small" type="number" value={row.price}
                    onChange={(e) => updateRow(row._id, "price", parseFloat(e.target.value) || 0)}
                    sx={{ width:68,
                      "& .MuiOutlinedInput-root":{ borderRadius:1.5, bgcolor:"#f8fafc", "& fieldset":{ borderColor:"#e2e8f0" } },
                      "& input":{ fontSize:12, textAlign:"right", p:"4px 6px", MozAppearance:"textfield" },
                      "& input::-webkit-outer-spin-button":{ display:"none" },
                      "& input::-webkit-inner-spin-button":{ display:"none" },
                    }}
                  />
                  <Typography fontSize={12} fontWeight={700} color="text.primary"
                    sx={{ width:68, textAlign:"right", flexShrink:0 }}>
                    {fmt(row.subtotal)}
                  </Typography>
                  <Tooltip title="Remove" arrow>
                    <IconButton size="small" onClick={() => deleteRow(row._id)}
                      sx={{ width:26, height:26, flexShrink:0, color:"grey.400",
                        "&:hover":{ color:"error.main", bgcolor:"#fef2f2" }, transition:"all 0.15s" }}>
                      <TrashIcon sx={{ fontSize:14 }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              ))}
            </Stack>
          )}

          <Button fullWidth startIcon={<AddIcon />} onClick={addRow} variant="outlined" size="small"
            sx={{ mt:1.5, borderStyle:"dashed", borderColor:"grey.300", color:"text.secondary",
              fontWeight:600, textTransform:"none", borderRadius:2, fontSize:12, py:0.7,
              "&:hover":{ borderColor:"primary.main", color:"primary.main", bgcolor:"#f0f7ff" } }}>
            Add Item
          </Button>

          <DashDivider />

          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography fontSize={13} color="text.secondary">Subtotal</Typography>
              <Typography fontSize={13} color="text.secondary">{fmt(subtotal)} MMK</Typography>
            </Stack>
            {discount > 0 && (
              <Stack direction="row" justifyContent="space-between">
                <Typography fontSize={13} color="#16a34a">Discount (5%)</Typography>
                <Typography fontSize={13} color="#16a34a">- {fmt(discount)} MMK</Typography>
              </Stack>
            )}
            <Stack direction="row" justifyContent="space-between" alignItems="center" pt={0.5}>
              <Typography fontSize={14} fontWeight={700} color="text.primary">Grand Total</Typography>
              <Typography fontSize={15} fontWeight={800} color="text.primary">{fmt(grandTotal)} MMK</Typography>
            </Stack>
          </Stack>

          <DashDivider />

          <Stack alignItems="center" py={1}>
            <Typography fontSize={12} color="text.disabled" lineHeight={1.8}>Thank you for shopping with us!</Typography>
            <Typography fontSize={12} color="text.disabled">Powered by KBS IMPEX</Typography>
          </Stack>

          <DashDivider />
        </Box>

        <Stack direction="row" spacing={1} sx={{ px:3, pb:3, pt:0.5 }}>
          <Button fullWidth variant="outlined" onClick={onClose}
            sx={{ borderColor:"divider", color:"text.secondary", fontWeight:600, textTransform:"none", borderRadius:2.5, py:1.3,
              "&:hover":{ borderColor:"grey.400", bgcolor:"grey.50" } }}>
            Close
          </Button>
          <Button fullWidth variant="outlined" onClick={handleSave} disabled={!dirty}
            sx={{ borderColor: dirty ? "#16a34a" : "divider", color: dirty ? "#16a34a" : "text.disabled",
              fontWeight:600, textTransform:"none", borderRadius:2.5, py:1.3,
              "&:hover":{ borderColor:"#15803d", bgcolor:"#f0fdf4" },
              "&.Mui-disabled":{ borderColor:"divider", color:"text.disabled" }, transition:"all 0.2s" }}>
            {saved ? "Saved ✓" : "Save"}
          </Button>
          <Button fullWidth variant="contained" startIcon={<PrintIcon />} onClick={() => window.print()}
            sx={{ bgcolor:"#1f3a5f", fontWeight:600, textTransform:"none", borderRadius:2.5, py:1.3, "&:hover":{ bgcolor:"#162d4a" } }}>
            Print
          </Button>
        </Stack>

      </DialogContent>
    </Dialog>
  );
}

/* ════════════════════════════════════════
   Transactions — main page
   ════════════════════════════════════════ */
export default function Transactions() {
  const [search,         setSearch]      = useState("");
  const [statusFilter,   setStatus]      = useState("All");
  const [methodFilter,   setMethod]      = useState("All");
  const [customerFilter, setCustomer]    = useState("All");
  const [saleTypeFilter, setSaleType]    = useState("All");
  const [dateFrom,       setDateFrom]    = useState("");
  const [dateTo,         setDateTo]      = useState("");
  const [slipTx,         setSlipTx]      = useState(null); // eye → read-only
  const [deletedIds,     setDeletedIds]  = useState([]);
  const [editTx,         setEditTx]      = useState(null); // edit → editable dialog

  const clearDateFilter = () => { setDateFrom(""); setDateTo(""); };

  /* ── Open editable slip dialog ── */
  const handleEditInPOS = (tx) => setEditTx(tx);

  /* ── Stats ─────────────────────────────────────────────────── */
  const totalRevenue   = SEED.filter((t) => t.status === "Paid").reduce((s, t) => s + t.total, 0);
  const paidCount      = SEED.filter((t) => t.status === "Paid").length;
  const pendingCount   = SEED.filter((t) => t.status === "Pending").length;
  const cancelRefCount = SEED.filter((t) => t.status === "Cancelled" || t.status === "Refunded").length;

  /* ── Filter ─────────────────────────────────────────────────── */
  const visible = SEED.filter((t) => !deletedIds.includes(t.id)).filter((t) => {
    const q       = search.toLowerCase();
    const matchQ  = t.invoice.toLowerCase().includes(q) || t.customer.toLowerCase().includes(q) || t.cashier.toLowerCase().includes(q);
    const matchS  = statusFilter   === "All" || t.status   === statusFilter;
    const matchM  = methodFilter   === "All" || t.method   === methodFilter;
    const matchC  = customerFilter === "All" || t.customer === customerFilter;
    const matchST = saleTypeFilter === "All" || t.saleType === saleTypeFilter;
    const txDate  = t.date.split(" ")[0];
    const matchFrom = !dateFrom || txDate >= dateFrom;
    const matchTo   = !dateTo   || txDate <= dateTo;
    return matchQ && matchS && matchM && matchC && matchST && matchFrom && matchTo;
  });

  const selSx = {
    borderRadius: 2, fontSize: 14, fontWeight: 500,
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d1d5db" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9ca3af" },
  };

  const hasDateFilter = dateFrom || dateTo;

  return (
    <Box sx={{ bgcolor:"grey.50", minHeight:"100vh", fontFamily:"'DM Sans','Segoe UI',sans-serif", p:"28px 32px 48px" }}>

      {/* ── Page header ── */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="text.primary">Transactions</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>{SEED.length} total transactions today</Typography>
        </Box>
        <Button variant="outlined" startIcon={<ExportIcon />}
          sx={{ borderColor:"divider", color:"text.secondary", fontWeight:600, textTransform:"none", borderRadius:2.5, px:2.5, py:1.1, "&:hover":{ borderColor:"grey.400", bgcolor:"grey.50" } }}>
          Export
        </Button>
      </Stack>

      {/* ── Stat cards ── */}
      <Stack direction="row" spacing={2} mb={3}>
        <StatCard iconBg="#eff6ff" iconColor="#1f3a5f" icon={<RevenueIcon />}  value={`${fmt(totalRevenue)} MMK`} label="Total Revenue" />
        <StatCard iconBg="#f0fdf4" iconColor="#16a34a" icon={<CheckCircleIcon />} value={paidCount}      label="Paid" />
        <StatCard iconBg="#fffbeb" iconColor="#d97706" icon={<ClockIcon />}    value={pendingCount}   label="Pending" />
        <StatCard iconBg="#fef2f2" iconColor="#dc2626" icon={<XCircleIcon />}  value={cancelRefCount} label="Cancelled / Refunded" />
      </Stack>

      {/* ── Filter bar ── */}
      <Paper elevation={0} sx={{ display:"flex", gap:1.5, alignItems:"center", flexWrap:"wrap", p:2, borderRadius:3, border:"1px solid", borderColor:"divider", mb:2.5 }}>

        <TextField size="small" placeholder="Search invoice, customer, cashier..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment:(<InputAdornment position="start"><SearchIcon sx={{ fontSize:18, color:"text.disabled" }} /></InputAdornment>) }}
          sx={{ flex:"1 1 220px", "& .MuiOutlinedInput-root":{ borderRadius:2.5, fontSize:14, bgcolor:"#fff" } }}
        />

        <FormControl size="small" sx={{ minWidth:140, flexShrink:0 }}>
          <Select value={statusFilter} onChange={(e) => setStatus(e.target.value)} sx={{ ...selSx, bgcolor:"#fff" }} displayEmpty>
            <MenuItem value="All">All Status</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
            <MenuItem value="Refunded">Refunded</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth:140, flexShrink:0 }}>
          <Select value={methodFilter} onChange={(e) => setMethod(e.target.value)} sx={{ ...selSx, bgcolor:"#fff" }} displayEmpty>
            <MenuItem value="All">All Methods</MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="KBZPay">KBZPay</MenuItem>
            <MenuItem value="Wave Pay">Wave Pay</MenuItem>
            <MenuItem value="Card">Card</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth:140, flexShrink:0 }}>
          <Select value={saleTypeFilter} onChange={(e) => setSaleType(e.target.value)} sx={{ ...selSx, bgcolor:"#fff" }} displayEmpty>
            <MenuItem value="All">All Types</MenuItem>
            <MenuItem value="Retail">Retail</MenuItem>
            <MenuItem value="Wholesale">Wholesale</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth:160, flexShrink:0 }}>
          <Select value={customerFilter} onChange={(e) => setCustomer(e.target.value)} sx={{ ...selSx, bgcolor:"#fff" }} displayEmpty
            startAdornment={<InputAdornment position="start" sx={{ ml:0.5, mr:-0.5 }}><PersonIcon sx={{ fontSize:16, color:customerFilter !== "All" ? "#1f3a5f" : "text.disabled" }} /></InputAdornment>}>
            {UNIQUE_CUSTOMERS.map((c) => (<MenuItem key={c} value={c}>{c === "All" ? "All Customers" : c}</MenuItem>))}
          </Select>
        </FormControl>

        <TextField size="small" type="date" label="From" value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          slotProps={{ inputLabel:{ shrink:true }, htmlInput:{ max: dateTo || undefined } }}
          sx={{ minWidth:150, flexShrink:0, "& .MuiOutlinedInput-root":{ borderRadius:2, fontSize:13, bgcolor:"#fff" }, "& .MuiOutlinedInput-notchedOutline":{ borderColor:"#d1d5db" }, "&:hover .MuiOutlinedInput-notchedOutline":{ borderColor:"#9ca3af" } }}
        />

        <TextField size="small" type="date" label="To" value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          slotProps={{ inputLabel:{ shrink:true }, htmlInput:{ min: dateFrom || undefined } }}
          sx={{ minWidth:150, flexShrink:0, "& .MuiOutlinedInput-root":{ borderRadius:2, fontSize:13, bgcolor:"#fff" }, "& .MuiOutlinedInput-notchedOutline":{ borderColor:"#d1d5db" }, "&:hover .MuiOutlinedInput-notchedOutline":{ borderColor:"#9ca3af" } }}
        />

        {hasDateFilter && (
          <Tooltip title="Clear dates" arrow>
            <IconButton size="small" onClick={clearDateFilter}
              sx={{ color:"text.disabled", flexShrink:0, "&:hover":{ color:"error.main", bgcolor:"#fef2f2" } }}>
              <ClearIcon sx={{ fontSize:17 }} />
            </IconButton>
          </Tooltip>
        )}
      </Paper>

      {/* ── Table ── */}
      <TableContainer component={Paper} elevation={0}
        sx={{ borderRadius:3, border:"1px solid", borderColor:"divider", overflow:"hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor:"grey.50" }}>
              {["Invoice","Customer","Cashier","Sale Type","Items","Total (MMK)","Method","Status","Date & Time","Action"].map((h, i) => (
                <TableCell key={i} sx={{ fontSize:13, fontWeight:600, color:"text.secondary", borderBottom:"1px solid", borderColor:"divider", py:1.75, px:2, whiteSpace:"nowrap" }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} sx={{ textAlign:"center", py:6, color:"text.disabled", fontSize:14 }}>
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : visible.map((t) => {
              const sc      = STATUS_COLORS[t.status]   || STATUS_COLORS.Paid;
              const stStyle = SALE_TYPE_STYLES[t.saleType] || SALE_TYPE_STYLES.Retail;

              return (
                <TableRow key={t.id} sx={{ bgcolor:"#fff", "&:hover":{ bgcolor:"grey.50" }, borderBottom:"1px solid", borderColor:"grey.100", transition:"background 0.15s" }}>

                  <TableCell sx={{ py:1.75, px:2 }}>
                    <Typography fontSize={13} fontWeight={600} color="#1f3a5f">{t.invoice}</Typography>
                  </TableCell>

                  <TableCell sx={{ py:1.75, px:2 }}>
                    <Typography fontSize={14} color="text.primary">{t.customer}</Typography>
                  </TableCell>

                  <TableCell sx={{ py:1.75, px:2 }}>
                    <Typography fontSize={14} color="text.secondary">{t.cashier}</Typography>
                  </TableCell>

                  {/* Sale Type */}
                  <TableCell sx={{ py:1.75, px:2 }}>
                    <Chip
                      icon={stStyle.icon} label={t.saleType} size="small"
                      sx={{ fontSize:12, fontWeight:600, bgcolor:stStyle.bg, color:stStyle.color, "& .MuiChip-icon":{ color:"inherit" } }}
                    />
                  </TableCell>

                  <TableCell sx={{ py:1.75, px:2 }}>
                    <Typography fontSize={14} color="text.primary">{t.items}</Typography>
                  </TableCell>

                  <TableCell sx={{ py:1.75, px:2 }}>
                    <Typography fontSize={14} fontWeight={700} color="text.primary">{fmt(t.total)}</Typography>
                  </TableCell>

                  <TableCell sx={{ py:1.75, px:2 }}>
                    <Stack direction="row" alignItems="center" spacing={0.8}>
                      <Box sx={{ color:"text.secondary", display:"flex" }}>{METHOD_ICON[t.method]}</Box>
                      <Typography fontSize={13} color="text.secondary">{t.method}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell sx={{ py:1.75, px:2 }}>
                    <Chip label={t.status} size="small"
                      sx={{ fontSize:12, fontWeight:600, bgcolor:sc.bg, color:sc.color }} />
                  </TableCell>

                  <TableCell sx={{ py:1.75, px:2, whiteSpace:"nowrap" }}>
                    <Typography fontSize={12} color="text.disabled">{t.date}</Typography>
                  </TableCell>

                  {/* Action: Eye + Delete + Edit */}
                  <TableCell sx={{ py:1.75, px:2 }}>
                    <Stack direction="row" spacing={0.5} alignItems="center">

                      {/* Eye → read-only slip dialog */}
                      <Tooltip title="View Slip" arrow>
                        <IconButton size="small" onClick={() => setSlipTx(t)}
                          sx={{ color:"text.disabled", "&:hover":{ color:"#1f3a5f", bgcolor:"#eff6ff" }, transition:"all 0.15s" }}>
                          <EyeIcon sx={{ fontSize:18 }} />
                        </IconButton>
                      </Tooltip>

                      {/* Delete → remove row */}
                      <Tooltip title="Delete" arrow>
                        <IconButton size="small" onClick={() => setDeletedIds(prev => [...prev, t.id])}
                          sx={{ color:"text.disabled", "&:hover":{ color:"error.main", bgcolor:"#fef2f2" }, transition:"all 0.15s" }}>
                          <DeleteIcon sx={{ fontSize:18 }} />
                        </IconButton>
                      </Tooltip>

                      {/* Edit → editable slip dialog */}
                      <Tooltip title="Edit Slip" arrow>
                        <IconButton size="small" onClick={() => handleEditInPOS(t)}
                          sx={{
                            color:"text.disabled",
                            "&:hover":{
                              color:   t.saleType === "Wholesale" ? "#15803d" : "#1d4ed8",
                              bgcolor: t.saleType === "Wholesale" ? "#f0fdf4"  : "#eff6ff",
                            },
                            transition:"all 0.15s",
                          }}>
                          <EditIcon sx={{ fontSize:17 }} />
                        </IconButton>
                      </Tooltip>

                    </Stack>
                  </TableCell>

                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ── Footer count ── */}
      <Box pt={2} px={0.5}>
        <Typography fontSize={13} color="text.disabled">
          Showing {visible.length} of {SEED.length} records
        </Typography>
      </Box>

      {/* ── Read-only slip dialog (eye icon) ── */}
      <SlipDialog tx={slipTx} onClose={() => setSlipTx(null)} />

      {/* ── Editable slip dialog (edit icon) ── */}
      <EditDialog key={editTx?.id ?? "none"} tx={editTx} onClose={() => setEditTx(null)} />


    </Box>
  );
}