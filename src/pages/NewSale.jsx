import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  Box, Typography, TextField, InputAdornment, IconButton,
  Chip, Card, Button, Divider, Switch, Dialog, Alert, CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import WifiIcon from "@mui/icons-material/Wifi";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PrintIcon from "@mui/icons-material/Print";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import api from "../api/axios";
import { API_BASE_URL } from "../api/config";

const assertApiSuccess = (data, fallbackMessage) => {
  const response = data?.baseResponseModel;
  if (response && response.respCode !== 200) {
    throw new Error(response.respMessage || fallbackMessage);
  }
};

const getProductImageUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
};

const PAYMENT_METHODS = [
  { key: "cash",    label: "Cash",    icon: <AttachMoneyIcon sx={{ fontSize: 16 }} /> },
  { key: "kbzpay",  label: "KBZPay",  icon: <WifiIcon sx={{ fontSize: 16 }} /> },
  { key: "wavepay", label: "Wave Pay",icon: <WifiIcon sx={{ fontSize: 16 }} /> },
  { key: "card",    label: "Card",    icon: <CreditCardIcon sx={{ fontSize: 16 }} /> },
  { key: "other",   label: "Other",   icon: <MoreHorizIcon sx={{ fontSize: 16 }} /> },
];

const QUICK_CASH = [5000, 10000, 20000, 50000];

const fmt = (n) => Number(n || 0).toLocaleString();

// ── Main Component ────────────────────────────────────────────────────────────
export default function NewSale() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isWholesale               = searchParams.get("type") === "wholesale";
  const accent                    = isWholesale ? "#1d4ed8" : "#16a34a";  // blue vs green
  const accentHover               = isWholesale ? "#1e40af" : "#15803d";
  const accentLight               = isWholesale ? "#dbeafe" : "#dcfce7";
  const accentText                = isWholesale ? "#1d4ed8" : "#16a34a";

  const [category, setCategory]   = useState("All");
  const [search, setSearch]       = useState("");
  const [products, setProducts]   = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");
  const [cart, setCart]           = useState(() => {
    const saved = sessionStorage.getItem("edit_cart");
    if (saved) { sessionStorage.removeItem("edit_cart"); return JSON.parse(saved); }
    return [];
  });
  const [payMethod, setPayMethod] = useState("cash");
  const [saleType, setSaleType]   = useState("Debit");
  const [cashInput, setCashInput] = useState("");
  const [discount, setDiscount]   = useState("");
  const [discType, setDiscType]   = useState("MMK");
  const [taxOn, setTaxOn]         = useState(false);
  const [customer, setCustomer]   = useState("");
  const [receipt, setReceipt]     = useState(null); // holds completed sale data

  useEffect(() => {
    const type = searchParams.get("type");
    if (type !== "retail" && type !== "wholesale") {
      setSearchParams({ type: "retail" }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoadingProducts(true);
      setProductError("");
      try {
        const [productResponse, subcategoryResponse, categoryResponse] = await Promise.all([
          api.get("/api/v1/product"),
          api.get("/api/v1/subcategory"),
          api.get("/api/v1/category"),
        ]);

        assertApiSuccess(productResponse.data, "Failed to load products");
        assertApiSuccess(subcategoryResponse.data, "Failed to load subcategories");
        assertApiSuccess(categoryResponse.data, "Failed to load categories");

        const subcategories = subcategoryResponse.data?.dataLst ?? [];
        const subcategoryById = new Map(
          subcategories.map(item => [Number(item.subCategoryId), item])
        );
        const catalog = (productResponse.data?.dataLst ?? productResponse.data?.data ?? [])
          .filter(item => item.isActive !== false)
          .map(item => {
            const subcategory = subcategoryById.get(Number(item.subCategoryId));
            const stock = (item.warehouses ?? []).reduce(
              (total, warehouse) => total + (Number(warehouse.stockQuantity) || 0),
              0
            );
            return {
              id: item.productId,
              name: item.productName ?? "Unnamed product",
              retailPrice: Number(item.retailPrice) || 0,
              wholesalePrice: Number(item.wholeSalePrice ?? item.wholesalePrice) || 0,
              unit: "Unit",
              stock,
              category: item.categoryName ?? subcategory?.categoryName ?? "Uncategorized",
              subcategory: item.subCategoryName ?? subcategory?.subCategoryName ?? "",
              low: stock > 0 && stock <= 10,
              img: getProductImageUrl(item.filePath),
            };
          });

        const categoryNames = (categoryResponse.data?.dataLst ?? [])
          .map(item => item.categoryName)
          .filter(Boolean);
        setCategories(["All", ...new Set(categoryNames)]);
        setProducts(catalog);
      } catch (error) {
        console.error("Failed to load sale catalog:", error);
        setProductError(
          error?.response?.data?.baseResponseModel?.respMessage ||
          error.message ||
          "Failed to load products"
        );
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchCatalog();
  }, []);

  const pricedProducts = useMemo(() => products.map(product => ({
    ...product,
    price: isWholesale ? product.wholesalePrice : product.retailPrice,
  })), [isWholesale, products]);

  useEffect(() => {
    if (pricedProducts.length === 0) return;
    setCart(currentCart => currentCart.map(item => {
      const currentProduct = pricedProducts.find(product => product.id === item.id);
      if (!currentProduct) return null;
      return {
        ...item,
        ...currentProduct,
        qty: Math.min(Number(item.qty) || 1, currentProduct.stock),
      };
    }).filter(item => item && item.qty > 0));
  }, [pricedProducts]);

  // ── Cart helpers
  const addToCart = (product) => {
    if (product.stock <= 0) return;
    setCart(c => {
      const existing = c.find(i => i.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) return c;
        return c.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...c, { ...product, qty: 1 }];
    });
  };
  const changeQty = (id, delta) => {
    setCart(c => c
      .map(i => {
        if (i.id !== id) return i;
        const nextQty = i.qty + delta;
        const maxStock = Number(i.stock);
        return {
          ...i,
          qty: Number.isFinite(maxStock) ? Math.min(maxStock, nextQty) : nextQty,
        };
      })
      .filter(i => i.qty > 0)
    );
  };
  const removeItem = (id) => setCart(c => c.filter(i => i.id !== id));
  const handleCheckout = () => {
    const now = new Date();
    const invNum = `INV-${now.getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setReceipt({
      invNum,
      date: now.toLocaleString("en-GB", { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" }).replace(",",""),
      cashier: "Ko Zaw",
      items: [...cart],
      subtotal,
      discAmt,
      taxAmt,
      grandTotal,
      payMethod: PAYMENT_METHODS.find(p => p.key === payMethod)?.label || payMethod,
      cashGiven,
      change,
    });
  };

  const closeReceipt = () => {
    setReceipt(null);
    setCart([]);
    setCashInput("");
    setDiscount("");
    setTaxOn(false);
    setCustomer("");
  };

  const handlePrint = () => window.print();

  // ── Totals
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discAmt  = discType === "%" ? Math.round(subtotal * (parseFloat(discount) || 0) / 100)
                                    : (parseFloat(discount) || 0);
  const taxAmt   = taxOn ? Math.round((subtotal - discAmt) * 0.05) : 0;
  const grandTotal = subtotal - discAmt + taxAmt;
  const cashGiven  = parseFloat(cashInput) || 0;
  const change     = cashGiven - grandTotal;

  // ── Filtered products
  const visible = pricedProducts.filter(p => {
    const matchCat = category === "All" || p.category === category;
    const matchQ   = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <Box sx={{ display: "flex", height: "100%", bgcolor: "#f0f4f8", overflow: "hidden" }}>

      {/* ── LEFT: Product Area ─────────────────────────────────── */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", p: "20px 20px 20px 28px" }}>

        {/* Search */}
        <TextField
          fullWidth size="small"
          placeholder="Search product name"
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <QrCodeScannerIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            bgcolor: "#fff",
            "& .MuiOutlinedInput-root": {
              borderRadius: 2.5,
              "& fieldset": { borderColor: "#e2e8f0" },
              "&:hover fieldset": { borderColor: "#cbd5e1" },
            },
          }}
        />

        {/* Category tabs */}
        <Box sx={{ display: "flex", gap: 1, mb: 2.5, flexWrap: "wrap" }}>
          {categories.map(cat => (
            <Button
              key={cat}
              size="small"
              onClick={() => setCategory(cat)}
              sx={{
                px: 1.8, py: 0.6,
                borderRadius: 5,
                textTransform: "none",
                fontSize: 13,
                fontWeight: category === cat ? 700 : 400,
                bgcolor: category === cat ? accent : "#fff",
                color: category === cat ? "#fff" : "#475569",
                border: "1px solid",
                borderColor: category === cat ? accent : "#e2e8f0",
                boxShadow: "none",
                minWidth: 0,
                "&:hover": { bgcolor: category === cat ? accentHover : "#f8fafc", boxShadow: "none" },
              }}
            >
              {cat}
            </Button>
          ))}
        </Box>

        {/* Product grid */}
        <Box sx={{ flex: 1, overflowY: "auto", pr: 0.5 }}>
          {loadingProducts ? (
            <Box sx={{ height: "100%", display: "grid", placeItems: "center" }}>
              <CircularProgress size={32} sx={{ color: accent }} />
            </Box>
          ) : productError ? (
            <Alert severity="error">{productError}</Alert>
          ) : visible.length === 0 ? (
            <Box sx={{ height: "100%", display: "grid", placeItems: "center" }}>
              <Typography sx={{ color: "#94a3b8", fontSize: 14 }}>
                {products.length === 0 ? "No products available" : "No products match your search"}
              </Typography>
            </Box>
          ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 1.5 }}>
            {visible.map(product => (
              <Card
                key={product.id}
                onClick={() => addToCart(product)}
                elevation={0}
                sx={{
                  border: "1px solid #e8ecf0",
                  borderRadius: 2.5,
                  overflow: "hidden",
                  cursor: product.stock > 0 ? "pointer" : "not-allowed",
                  opacity: product.stock > 0 ? 1 : 0.62,
                  transition: "box-shadow 0.15s, transform 0.15s",
                  "&:hover": product.stock > 0
                    ? { boxShadow: "0 4px 16px rgba(0,0,0,0.10)", transform: "translateY(-1px)" }
                    : {},
                }}
              >
                {/* Image */}
                <Box sx={{ position: "relative", height: 100, bgcolor: "#f8fafc", display: "grid", placeItems: "center" }}>
                  <ImageOutlinedIcon sx={{ color: "#cbd5e1", fontSize: 32 }} />
                  {product.img && (
                    <Box
                      component="img"
                      src={product.img}
                      alt={product.name}
                      loading="lazy"
                      sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      onError={e => { e.currentTarget.style.display = "none"; }}
                    />
                  )}
                  {product.low && (
                    <Chip label="LOW" size="small" sx={{ position: "absolute", top: 6, left: 6, height: 20, fontSize: 10, fontWeight: 700, bgcolor: "#f97316", color: "#fff", borderRadius: 1 }} />
                  )}
                  {product.stock <= 0 && (
                    <Chip label="OUT" size="small" sx={{ position: "absolute", top: 6, left: 6, height: 20, fontSize: 10, fontWeight: 700, bgcolor: "#64748b", color: "#fff", borderRadius: 1 }} />
                  )}
                </Box>

                {/* Info */}
                <Box sx={{ p: "8px 10px 10px" }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#1e293b", lineHeight: 1.3, mb: 0.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", minHeight: 30 }}>
                    {product.name}
                  </Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 800, color: accentText }}>
                    {fmt(product.price)}
                    <Box component="span" sx={{ fontSize: 10, fontWeight: 500, color: "#94a3b8", ml: 0.3 }}>/{product.unit}</Box>
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 0.2 }}>Stock: {product.stock}</Typography>
                </Box>
              </Card>
            ))}
          </Box>
          )}
        </Box>
      </Box>

      {/* ── RIGHT: Current Sale Panel ──────────────────────────── */}
      <Box sx={{
        width: 420,
        bgcolor: "#fff",
        borderLeft: "1px solid #e8ecf0",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flexShrink: 0,
      }}>

        {/* Header */}
        <Box sx={{ px: 2.5, py: 2, borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 800, color: "#1e293b" }}>Current Sale</Typography>
            {cart.length > 0 && (
              <Chip label={`${cart.length} item${cart.length > 1 ? "s" : ""}`} size="small"
                sx={{ height: 20, fontSize: 11, fontWeight: 700, bgcolor: accentLight, color: accentText }} />
            )}
          </Box>
          {cart.length > 0 && (
            <Button size="small" onClick={() => setCart([])}
              sx={{ textTransform: "none", fontSize: 12, color: "#94a3b8", minWidth: 0, p: 0.5 }}>
              Clear
            </Button>
          )}
        </Box>

        {/* Cart items */}
        <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, py: 1.5 }}>
          {cart.length === 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 1.5 }}>
              <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShoppingCartIcon sx={{ fontSize: 28, color: "#cbd5e1" }} />
              </Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#94a3b8" }}>Cart is empty</Typography>
              <Typography sx={{ fontSize: 12, color: "#cbd5e1" }}>Tap a product to add to cart</Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {cart.map(item => (
                <Box key={item.id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1, borderBottom: "1px solid #f8fafc" }}>
                  {/* Name + subtitle */}
                  <Box sx={{ flex: 1, mr: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#1e293b", lineHeight: 1.3 }}>{item.name}</Typography>
                    <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 0.2 }}>{fmt(item.price)} × {item.qty}</Typography>
                  </Box>
                  {/* −  qty  +  |  price MMK  |  X */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, flexShrink: 0 }}>
                    {/* Qty controls */}
                    <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: 1.5, overflow: "hidden" }}>
                      <IconButton size="small" onClick={() => changeQty(item.id, -1)} sx={{ p: 0.4, borderRadius: 0, color: "#475569" }}>
                        <RemoveIcon sx={{ fontSize: 13 }} />
                      </IconButton>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, px: 1, color: "#1e293b", minWidth: 20, textAlign: "center" }}>{item.qty}</Typography>
                      <IconButton size="small" onClick={() => changeQty(item.id, 1)} sx={{ p: 0.4, borderRadius: 0, color: "#475569" }}>
                        <AddIcon sx={{ fontSize: 13 }} />
                      </IconButton>
                    </Box>
                    {/* Price */}
                    <Box sx={{ textAlign: "right", minWidth: 60 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{fmt(item.price * item.qty)}</Typography>
                      <Typography sx={{ fontSize: 10, color: "#94a3b8" }}>MMK</Typography>
                    </Box>
                    {/* X button — smaller, subtle */}
                    <IconButton onClick={() => removeItem(item.id)}
                      sx={{ p: 0.4, bgcolor: "transparent", color: "#cbd5e1", borderRadius: 1.5, "&:hover": { bgcolor: "#ef4444", color: "#fff" } }}>
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Bottom panel — only show when cart has items */}
        {cart.length > 0 && (
          <Box sx={{ borderTop: "1px solid #f1f5f9", px: 2.5, py: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>

            {/* Customer */}
            <TextField size="small" placeholder="Select or search customer..."
              value={customer} onChange={e => setCustomer(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ fontSize: 17, color: "#94a3b8" }} /></InputAdornment> }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: 13, "& fieldset": { borderColor: "#e2e8f0" } } }}
            />

            {/* Discount row */}
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {/* MMK / % toggle */}
              <Box sx={{ display: "flex", border: "1px solid #e2e8f0", borderRadius: 2, overflow: "hidden", flexShrink: 0 }}>
                {["MMK", "%"].map(t => (
                  <Button key={t} size="small" onClick={() => setDiscType(t)}
                    sx={{ px: 1.5, py: 0.5, minWidth: 0, textTransform: "none", fontSize: 12, fontWeight: 600, borderRadius: 0,
                      bgcolor: discType === t ? "#1e293b" : "transparent",
                      color: discType === t ? "#fff" : "#64748b",
                    }}>{t}</Button>
                ))}
              </Box>
              <TextField size="small" placeholder="Discount (optional)" value={discount}
                onChange={e => setDiscount(e.target.value)} type="number"
                InputProps={{ startAdornment: <InputAdornment position="start"><LocalOfferOutlinedIcon sx={{ fontSize: 16, color: "#94a3b8" }} /></InputAdornment> }}
                sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: 12, "& fieldset": { borderColor: "#e2e8f0" } } }}
              />
              {/* Tax */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
                <Switch size="small" checked={taxOn} onChange={e => setTaxOn(e.target.checked)}
                  sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: accent }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: accent } }} />
                <Typography sx={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Tax 5%</Typography>
              </Box>
            </Box>

            {/* Totals */}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: 13, color: "#64748b" }}>Subtotal</Typography>
              <Typography sx={{ fontSize: 13, color: "#1e293b", fontWeight: 600 }}>{fmt(subtotal)} MMK</Typography>
            </Box>
            {discAmt > 0 && (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>Discount</Typography>
                <Typography sx={{ fontSize: 13, color: "#ef4444", fontWeight: 600 }}>-{fmt(discAmt)} MMK</Typography>
              </Box>
            )}
            {taxOn && (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>Tax (5%)</Typography>
                <Typography sx={{ fontSize: 13, color: "#1e293b", fontWeight: 600 }}>{fmt(taxAmt)} MMK</Typography>
              </Box>
            )}
            <Box sx={{ display: "flex", justifyContent: "space-between", pt: 0.5 }}>
              <Typography sx={{ fontSize: 15, fontWeight: 800, color: "#1e293b" }}>Grand Total</Typography>
              <Typography sx={{ fontSize: 15, fontWeight: 800, color: accentText }}>{fmt(grandTotal)} <Box component="span" sx={{ fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>MMK</Box></Typography>
            </Box>

            <Divider sx={{ borderColor: "#f1f5f9" }} />

            {/* Payment methods */}
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em" }}>PAYMENT METHOD</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
              {PAYMENT_METHODS.map(pm => (
                <Button key={pm.key} size="small" startIcon={pm.icon} onClick={() => setPayMethod(pm.key)}
                  sx={{
                    px: 1.5, py: 0.6, borderRadius: 2, textTransform: "none", fontSize: 12, fontWeight: 600,
                    border: "1px solid",
                    bgcolor: payMethod === pm.key ? accent : "transparent",
                    color: payMethod === pm.key ? "#fff" : "#475569",
                    borderColor: payMethod === pm.key ? accent : "#e2e8f0",
                    boxShadow: "none",
                    "&:hover": { bgcolor: payMethod === pm.key ? accentHover : "#f8fafc", boxShadow: "none" },
                  }}>
                  {pm.label}
                </Button>
              ))}
            </Box>

            {/* Sale Type */}
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em" }}>SALE TYPE</Typography>
            <Box sx={{ display: "flex", gap: 0.8 }}>
              {["Debit", "Credit"].map(type => (
                <Button key={type} size="small" onClick={() => setSaleType(type)}
                  sx={{
                    px: 1.5, py: 0.6, borderRadius: 2, textTransform: "none", fontSize: 12, fontWeight: 600,
                    border: "1px solid",
                    bgcolor: saleType === type ? accent : "transparent",
                    color: saleType === type ? "#fff" : "#475569",
                    borderColor: saleType === type ? accent : "#e2e8f0",
                    boxShadow: "none",
                    "&:hover": { bgcolor: saleType === type ? accentHover : "#f8fafc", boxShadow: "none" },
                  }}>
                  {type}
                </Button>
              ))}
            </Box>

            {/* Cash section — only for cash method */}
            {payMethod === "cash" && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <TextField size="small" placeholder="Enter cash amount (optional)" value={cashInput}
                  onChange={e => setCashInput(e.target.value)} type="number"
                  InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>MMK</Typography></InputAdornment> }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: 13, "& fieldset": { borderColor: "#e2e8f0" } } }}
                />
                {cashGiven > 0 && cashGiven >= grandTotal && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", bgcolor: accentLight, borderRadius: 2, px: 1.5, py: 1 }}>
                    <Typography sx={{ fontSize: 12, color: accentHover, fontWeight: 600 }}>Change</Typography>
                    <Typography sx={{ fontSize: 12, color: accentHover, fontWeight: 700 }}>{fmt(change)} MMK</Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* Checkout button */}
            <Button fullWidth variant="contained" startIcon={<CheckCircleOutlineIcon />}
              onClick={handleCheckout}
              sx={{ bgcolor: accent, borderRadius: 2.5, textTransform: "none", fontWeight: 700, fontSize: 14, py: 1.3, boxShadow: "none", "&:hover": { bgcolor: accentHover, boxShadow: "none" } }}>
              Checkout & Print Receipt
            </Button>

          </Box>
        )}
      </Box>
      {/* ── Receipt Dialog ─────────────────────────────────────── */}
      <Dialog open={!!receipt} onClose={closeReceipt} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}>
        {receipt && (
          <>
            {/* Green header */}
            <Box sx={{ bgcolor: accent, pt: 3.5, pb: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 52, height: 52, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircleIcon sx={{ fontSize: 32, color: "#fff" }} />
              </Box>
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Payment Successful!</Typography>
              <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{receipt.invNum}</Typography>
            </Box>

            {/* Receipt body */}
            <Box sx={{ px: 3, py: 2.5 }}>
              {/* Logo + company */}
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2.5, gap: 0.8 }}>
                <Box sx={{ width: 52, height: 52, borderRadius: 2, bgcolor: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <Box component="img" src={logo} alt="logo"
                    sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                    onError={e => { e.target.style.display = "none"; }}
                  />
                </Box>
                <Typography sx={{ fontSize: 15, fontWeight: 800, color: "#1e293b" }}>KBS Impex</Typography>
                <Typography sx={{ fontSize: 11, color: "#94a3b8", textAlign: "center", lineHeight: 1.6 }}>
                  No. 25, Merchant Road, Yangon<br />Ph: 09-123-456-789
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Meta */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.6, mb: 2 }}>
                <Row label="Date:" value={receipt.date} />
                <Row label="Cashier:" value={receipt.cashier} />
              </Box>

              <Divider sx={{ mb: 1.5 }} />

              {/* Items */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, mb: 1.5 }}>
                {receipt.items.map(item => (
                  <Row key={item.id}
                    label={`${item.name} x${item.qty}`}
                    value={`${fmt(item.price * item.qty)} MMK`}
                  />
                ))}
              </Box>

              <Divider sx={{ mb: 1.5 }} />

              {/* Totals */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.6, mb: 1.5 }}>
                <Row label="Subtotal" value={`${fmt(receipt.subtotal)} MMK`} />
                {receipt.discAmt > 0 && <Row label="Discount" value={`-${fmt(receipt.discAmt)} MMK`} valueColor="#ef4444" />}
                {receipt.taxAmt > 0 && <Row label="Tax (5%)" value={`${fmt(receipt.taxAmt)} MMK`} />}
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 800, color: "#1e293b" }}>Total</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 800, color: "#1e293b" }}>{fmt(receipt.grandTotal)} MMK</Typography>
                </Box>
                <Row label="Payment" value={receipt.payMethod} />
                {receipt.payMethod === "Cash" && <>
                  <Row label="Cash Tendered" value={`${fmt(receipt.cashGiven)} MMK`} />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: accentText }}>Change</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: accentText }}>{fmt(Math.max(0, receipt.change))} MMK</Typography>
                  </Box>
                </>}
              </Box>

              <Typography sx={{ fontSize: 12, color: "#94a3b8", textAlign: "center", mt: 1, mb: 2.5, fontStyle: "italic" }}>
                Thank you for shopping! ✨
              </Typography>

              {/* Buttons */}
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button fullWidth variant="outlined" startIcon={<CloseIcon />} onClick={closeReceipt}
                  sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600, borderColor: "#e2e8f0", color: "#64748b", "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" } }}>
                  Close
                </Button>
                <Button fullWidth variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}
                  sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, bgcolor: accent, boxShadow: "none", "&:hover": { bgcolor: accentHover, boxShadow: "none" } }}>
                  Print
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Dialog>
    </Box>
  );
}

function Row({ label, value, valueColor }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography sx={{ fontSize: 13, color: "#64748b" }}>{label}</Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: valueColor || "#1e293b" }}>{value}</Typography>
    </Box>
  );
}
