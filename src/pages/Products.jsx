import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import React from "react";
import {
  Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, FormControl, IconButton, InputAdornment,
  MenuItem, Paper, Select, Snackbar, Alert, Stack, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Tooltip,
  ClickAwayListener,
  CircularProgress, Fade,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import api from "../api/axios";
import { API_BASE_URL } from "../api/config";

/* ════════════════════════════════════════
   ICONS
   ════════════════════════════════════════ */
const SearchIcon = () => (
  <Box component="svg" width={18} height={18} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Box component="circle" cx={11} cy={11} r={8} />
    <Box component="line" x1={21} y1={21} x2={16.65} y2={16.65} />
  </Box>
);
const EditIcon = () => (
  <Box component="svg" width={16} height={16} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Box component="path" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <Box component="path" d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </Box>
);
const TrashIcon = () => (
  <Box component="svg" width={16} height={16} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Box component="polyline" points="3 6 5 6 21 6" />
    <Box component="path" d="M19 6l-1 14H6L5 6" />
    <Box component="path" d="M10 11v6M14 11v6" />
    <Box component="path" d="M9 6V4h6v2" />
  </Box>
);
const ImageIcon = () => (
  <Box component="svg" width={24} height={24} viewBox="0 0 24 24" fill="none"
    stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <Box component="rect" x={3} y={3} width={18} height={18} rx={2} />
    <Box component="circle" cx={8.5} cy={8.5} r={1.5} />
    <Box component="polyline" points="21 15 16 10 5 21" />
  </Box>
);
const ChevronDownIcon = () => (
  <Box component="svg" width={16} height={16} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Box component="polyline" points="6 9 12 15 18 9" />
  </Box>
);
const XIcon = () => (
  <Box component="svg" width={14} height={14} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Box component="line" x1={18} y1={6} x2={6} y2={18} />
    <Box component="line" x1={6} y1={6} x2={18} y2={18} />
  </Box>
);

/* ════════════════════════════════════════
   PALETTE
   ════════════════════════════════════════ */
const PALETTE = [
  { bg: "#e8f5e9", color: "#2e7d32" },
  { bg: "#e3f2fd", color: "#1565c0" },
  { bg: "#fff8e1", color: "#e65100" },
  { bg: "#e0f7fa", color: "#00695c" },
  { bg: "#f3e5f5", color: "#6a1b9a" },
  { bg: "#fce4ec", color: "#c62828" },
  { bg: "#f1f8e9", color: "#558b2f" },
  { bg: "#fafafa", color: "#78716c" },
];
const getChip = (idx) => PALETTE[idx % PALETTE.length];

/* ════════════════════════════════════════
   BLANK form state
   ════════════════════════════════════════ */
const BLANK = {
  image: "", imageFile: null, name: "", description: "", unitPrice: "",
  subcategoryId: "", subcategoryName: "", categoryId: "", categoryName: "",
  retailPrice: "", wholesalePrice: "",
  warehouseStocks: [], // [{ warehouseId, warehouseName, stockQuantity }]
};

const fmt = n => Number(n).toLocaleString();

const assertApiSuccess = (data, fallbackMessage) => {
  const response = data?.baseResponseModel;
  if (response && response.respCode !== 200) {
    throw new Error(response.respMessage || fallbackMessage);
  }
};

const getProductSortValue = (product) => {
  const dateValue = Date.parse(product.createdDate);
  return Number.isNaN(dateValue) ? Number(product.id) || 0 : dateValue;
};

const sortNewestFirst = (products) =>
  [...products].sort((a, b) => getProductSortValue(b) - getProductSortValue(a));

const getProductImageUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
};

const getImageNameFromType = (type = "") => {
  const ext = type.split("/")[1]?.split("+")[0] || "png";
  return `pasted-product-image.${ext}`;
};

/* ════════════════════════════════════════
   Normalize product from API response
   ════════════════════════════════════════ */
const normalizeProduct = (item, subcategories = []) => {
  const whs = item.warehouses ?? [];
  const subcategoryId = item.subCategoryId ?? item.subcategoryId ?? "";
  const subcategory = subcategories.find(s => Number(s.subCategoryId) === Number(subcategoryId));
  return {
    id:              item.productId        ?? item.id,
    name:            item.productName      ?? item.name      ?? "",
    image:           item.filePath         ?? item.imageUrl  ?? item.image ?? "",
    imageFile:       null,
    subcategoryId,
    subcategoryName: item.subCategoryName  ?? item.subcategory ?? subcategory?.subCategoryName ?? "",
    categoryId:      item.categoryId       ?? subcategory?.categoryId ?? "",
    categoryName:    item.categoryName     ?? subcategory?.categoryName ?? "",
    description:     item.description      ?? "",
    unitPrice:       item.unitPrice        ?? 0,
    retailPrice:     item.retailPrice      ?? 0,
    wholesalePrice:  item.wholeSalePrice   ?? item.wholesalePrice  ?? 0,
    createdDate:     item.createdDate      ?? "",
    warehouseStocks: whs.map(w => ({
      warehouseId:   w.warehouseId,
      warehouseName: w.warehouseName,
      stockQuantity: w.stockQuantity ?? 0,
    })),
  };
};

/* ════════════════════════════════════════
   SubcategorySelect — driven by real API
   ════════════════════════════════════════ */
function SubcategorySelect({ value, onChange, subcategories, categories, error }) {
  const [open,  setOpen]  = useState(false);
  const [query, setQuery] = useState("");
  const inputRef          = useRef();

  const filtered = useMemo(() => {
    if (!query.trim()) return subcategories;
    const q = query.toLowerCase();
    return subcategories.filter(s =>
      s.subCategoryName?.toLowerCase().includes(q) ||
      s.categoryName?.toLowerCase().includes(q)
    );
  }, [query, subcategories]);

  const selected = subcategories.find(s => s.subCategoryId === value);

  const handleSelect = (s) => { onChange(s); setQuery(""); setOpen(false); };
  const handleClear  = (e) => { e.stopPropagation(); onChange(null); setQuery(""); };

  return (
    <ClickAwayListener onClickAway={() => { setOpen(false); setQuery(""); }}>
      <Box sx={{ position: "relative" }}>

        {/* Trigger */}
        <Box
          onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 0); }}
          sx={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            border: "1px solid",
            borderColor: error ? "error.main" : open ? "primary.main" : "#c4c4c4",
            borderRadius: "4px", px: 1.5, py: "8.5px", cursor: "pointer", bgcolor: "#fff",
            boxShadow: open ? "0 0 0 1px #1976d2" : "none",
            "&:hover": { borderColor: error ? "error.main" : "#000" },
            minHeight: 40,
          }}
        >
          <Typography fontSize={14} color={selected ? "text.primary" : "text.disabled"} noWrap>
            {selected ? selected.subCategoryName : "Select subcategory…"}
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexShrink: 0 }}>
            {selected && (
              <IconButton size="small" onClick={handleClear}
                sx={{ p: "2px", color: "text.disabled", "&:hover": { color: "text.primary" } }}>
                <XIcon />
              </IconButton>
            )}
            <Box sx={{ color: "text.disabled", display: "flex", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
              <ChevronDownIcon />
            </Box>
          </Stack>
        </Box>

        {/* Floating label */}
        <Typography component="label" sx={{
          position: "absolute", top: -9, left: 10, px: 0.5, fontSize: 12,
          bgcolor: "#fff", color: error ? "error.main" : open ? "primary.main" : "text.secondary",
          lineHeight: 1, pointerEvents: "none",
        }}>
          Subcategory *
        </Typography>

        {/* Dropdown */}
        {open && (
          <Paper elevation={4} sx={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 1300,
            borderRadius: 2, overflow: "hidden", border: "1px solid", borderColor: "divider",
          }}>
            <Box sx={{ p: 1, borderBottom: "1px solid", borderColor: "divider" }}>
              <TextField
                inputRef={inputRef} size="small" fullWidth
                placeholder="Search subcategory or category…"
                value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Escape") { setOpen(false); setQuery(""); }
                  if (e.key === "Enter" && filtered.length === 1) handleSelect(filtered[0]);
                }}
                InputProps={{ startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ color: "text.disabled", display: "flex" }}><SearchIcon /></Box>
                  </InputAdornment>
                )}}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
              />
            </Box>
            <Box sx={{ maxHeight: 240, overflowY: "auto" }}>
              {filtered.length === 0 ? (
                <Box sx={{ px: 2, py: 2.5, textAlign: "center" }}>
                  <Typography fontSize={13} color="text.disabled">No results found</Typography>
                </Box>
              ) : categories.map(cat => {
                const items = filtered.filter(s => s.categoryId === cat.id);
                if (!items.length) return null;
                const catIdx = categories.findIndex(c => c.id === cat.id);
                const chip   = getChip(catIdx);
                return (
                  <Box key={cat.id}>
                    <Box sx={{ px: 2, py: 0.8, bgcolor: "grey.50", borderBottom: "1px solid", borderColor: "divider" }}>
                      <Typography fontSize={11} fontWeight={600} color="text.disabled" textTransform="uppercase" letterSpacing={0.5}>
                        {cat.name}
                      </Typography>
                    </Box>
                    {items.map(s => (
                      <Box key={s.subCategoryId} onClick={() => handleSelect(s)} sx={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        px: 2, py: 1.1, cursor: "pointer",
                        bgcolor: s.subCategoryId === value ? "grey.100" : "transparent",
                        "&:hover": { bgcolor: "grey.50" },
                      }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: chip.color, flexShrink: 0 }} />
                          <Typography fontSize={14} fontWeight={s.subCategoryId === value ? 600 : 400}>
                            {s.subCategoryName}
                          </Typography>
                        </Stack>
                      </Box>
                    ))}
                  </Box>
                );
              })}
            </Box>
          </Paper>
        )}

        {error && (
          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block", px: "14px" }}>
            Required
          </Typography>
        )}
      </Box>
    </ClickAwayListener>
  );
}

/* ════════════════════════════════════════
   ProductForm
   ════════════════════════════════════════ */
function ProductForm({ initial, onSave, onClose, subcategories, categories, warehouses }) {
  const [form,   setForm]   = useState(() => ({
    ...(initial ? { ...initial } : { ...BLANK }),
    warehouseStocks: warehouses.map(wh => {
      const existing = initial?.warehouseStocks?.find(s => s.warehouseId === wh.warehouseId);
      return {
        warehouseId:   wh.warehouseId,
        warehouseName: wh.warehouseName,
        stockQuantity: existing?.stockQuantity ?? "",
      };
    }),
  }));
  const [errors, setErrors] = useState({});
  const [imgErr, setImgErr] = useState("");
  const [saving, setSaving] = useState(false);
  const fileRef             = useRef();

  const set = useCallback((k, v) => setForm(f => ({ ...f, [k]: v })), []);

  const setStock = (warehouseId, qty) => {
    setForm(f => ({
      ...f,
      warehouseStocks: f.warehouseStocks.map(s =>
        s.warehouseId === warehouseId ? { ...s, stockQuantity: qty } : s
      ),
    }));
    setErrors(e => ({ ...e, [`stock_${warehouseId}`]: "" }));
  };

  const applyImageFile = useCallback((file, resetInput) => {
    if (!file) return;
    setImgErr("");
    if (!file.type?.startsWith("image/")) {
      setImgErr("Please use an image file");
      if (resetInput) resetInput();
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setImgErr("Image must be under 2 MB");
      if (resetInput) resetInput();
      return;
    }
    const imageFile = file instanceof File && file.name
      ? file
      : new File([file], getImageNameFromType(file.type), { type: file.type });
    set("imageFile", imageFile);
    setErrors(e => ({ ...e, imageFile: "" }));
    const r = new FileReader();
    r.onload = ev => set("image", ev.target.result);
    r.readAsDataURL(imageFile);
  }, [set]);

  const handleImage = e => {
    applyImageFile(e.target.files[0], () => { e.target.value = ""; });
  };

  const handlePaste = useCallback(e => {
    const imageItem = [...(e.clipboardData?.items ?? [])]
      .find(item => item.type.startsWith("image/"));
    if (!imageItem) return;
    e.preventDefault();
    applyImageFile(imageItem.getAsFile());
  }, [applyImageFile]);

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  const validate = () => {
    const e = {};
    if (form.imageFile && !(form.imageFile instanceof File)) e.imageFile = "Invalid image file";
    if (!form.name.trim())    e.name           = "Required";
    if (!form.subcategoryId)  e.subcategoryId  = "Required";
    if (!form.retailPrice)    e.retailPrice    = "Required";
    if (!form.wholesalePrice) e.wholesalePrice = "Required";
    form.warehouseStocks.forEach(s => {
      if (s.stockQuantity === "" || s.stockQuantity === null || s.stockQuantity === undefined) {
        e[`stock_${s.warehouseId}`] = "Required";
      }
    });
    setErrors(e);
    setImgErr(e.imageFile || "");
    return !Object.keys(e).length;
  };

  const handleSubcategoryChange = (sub) => {
    if (!sub) {
      setForm(f => ({ ...f, subcategoryId: "", subcategoryName: "", categoryId: "", categoryName: "" }));
      return;
    }
    setForm(f => ({
      ...f,
      subcategoryId:   sub.subCategoryId,
      subcategoryName: sub.subCategoryName,
      categoryId:      sub.categoryId,
      categoryName:    sub.categoryName ?? "",
    }));
    setErrors(e => ({ ...e, subcategoryId: "" }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const saved = { ...form };
    if (initial?.id != null) saved.id = initial.id;
    setSaving(true);
    try {
      await onSave(saved);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <DialogContent sx={{ pt: 3, pb: 1 }}>
        <Stack spacing={2.5}>

          {/* Image + Name */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack alignItems="center" spacing={0.5}>
              <Avatar
                src={form.image || undefined} variant="rounded"
                onClick={() => fileRef.current.click()}
                sx={{
                  width: 100, height: 100, borderRadius: 3, cursor: "pointer",
                  border: "2px dashed", borderColor: imgErr ? "error.main" : "#e2e8f0",
                  bgcolor: "grey.50", "&:hover": { borderColor: "grey.400" },
                }}
              >
                <Stack alignItems="center" spacing={0.5}>
                  <ImageIcon />
                  <Typography variant="caption" color="text.disabled">Upload</Typography>
                </Stack>
              </Avatar>
              <Box component="input" ref={fileRef} type="file" accept="image/*"
                onChange={handleImage} sx={{ display: "none" }} />
              <Typography variant="caption" color={imgErr ? "error" : "text.disabled"}
                textAlign="center" sx={{ maxWidth: 100 }}>
                {imgErr || "Max 2 MB, Ctrl+V"}
              </Typography>
            </Stack>
            <TextField fullWidth size="small" label="Product Name *"
              placeholder="e.g. Mama Noodles Chicken"
              value={form.name} onChange={e => set("name", e.target.value)}
              error={!!errors.name} helperText={errors.name} />
          </Stack>

          {/* Subcategory */}
          <SubcategorySelect
            value={form.subcategoryId}
            onChange={handleSubcategoryChange}
            subcategories={subcategories}
            categories={categories}
            error={!!errors.subcategoryId}
          />

          {/* Description */}
          <TextField fullWidth size="small" multiline rows={2} label="Description"
            placeholder="e.g. Fresh product description"
            value={form.description} onChange={e => set("description", e.target.value)} />

          {/* Retail + Wholesale */}
          <Stack direction="row" spacing={1.5}>
            <TextField fullWidth size="small" type="number" label="Retail Price *"
              inputProps={{ min: 0 }} value={form.retailPrice}
              onChange={e => set("retailPrice", e.target.value)}
              error={!!errors.retailPrice} helperText={errors.retailPrice} />
            <TextField fullWidth size="small" type="number" label="Wholesale Price *"
              inputProps={{ min: 0 }} value={form.wholesalePrice}
              onChange={e => set("wholesalePrice", e.target.value)}
              error={!!errors.wholesalePrice} helperText={errors.wholesalePrice} />
          </Stack>

          {/* ── Dynamic Warehouse Stock Fields ── */}
          {form.warehouseStocks.length === 0 && (
            <Typography fontSize={13} color="text.disabled" textAlign="center">
              No warehouses found. Please add warehouses in Warehouse Management first.
            </Typography>
          )}
          {form.warehouseStocks.map(s => (
            <Stack key={s.warehouseId} direction="row" spacing={1.5}>
              <TextField
                fullWidth size="small" type="number" label="Stock Qty *"
                inputProps={{ min: 0 }}
                value={s.stockQuantity}
                onChange={e => setStock(s.warehouseId, e.target.value)}
                error={!!errors[`stock_${s.warehouseId}`]}
                helperText={errors[`stock_${s.warehouseId}`]}
              />
              <TextField
                fullWidth size="small" label="Warehouse"
                value={s.warehouseName}
                InputProps={{ readOnly: true }}
                sx={{
                  "& .MuiOutlinedInput-root": { bgcolor: "grey.50" },
                  "& .MuiInputBase-input": { color: "text.secondary", cursor: "default" },
                }}
              />
            </Stack>
          ))}

        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" disabled={saving}
          sx={{ borderColor: "divider", color: "text.secondary", fontWeight: 600, textTransform: "none" }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={saving}
          startIcon={saving && <CircularProgress size={14} color="inherit" />}
          sx={{ bgcolor: "#1f3a5f", fontWeight: 600, textTransform: "none", "&:hover": { bgcolor: "#162d4a" } }}>
          {saving ? "Saving…" : initial ? "Save Changes" : "Add Product"}
        </Button>
      </DialogActions>
    </>
  );
}

/* ════════════════════════════════════════
   Main — Products page
   ════════════════════════════════════════ */
export default function Products() {
  const [products,      setProducts]      = useState([]);
  const [categories,    setCategories]    = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [warehouses,    setWarehouses]    = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [catFilter,     setCatFilter]     = useState("All");
  const [modal,         setModal]         = useState(null);
  const [toast,         setToast]         = useState(null);
  const [deleting,      setDeleting]      = useState(false);
  const [viewLoading,   setViewLoading]   = useState(false);

  const total = products.length;
  const showToast = (msg, severity = "success") => setToast({ msg, severity });

  /* ─── GET real API data ───────────────────────────────────── */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [categoryRes, subcategoryRes, warehouseRes, productRes] = await Promise.all([
          api.get("/api/v1/category"),
          api.get("/api/v1/subcategory"),
          api.get("/api/v1/warehouse"),
          api.get("/api/v1/product"),
        ]);

        assertApiSuccess(categoryRes.data, "Failed to load categories");
        assertApiSuccess(subcategoryRes.data, "Failed to load subcategories");
        assertApiSuccess(warehouseRes.data, "Failed to load warehouses");
        assertApiSuccess(productRes.data, "Failed to load products");

        const categoryList = (categoryRes.data?.dataLst ?? []).map(item => ({
          id: item.categoryId,
          name: item.categoryName,
        }));
        const subcategoryList = subcategoryRes.data?.dataLst ?? [];
        const normalized = (productRes.data?.dataLst ?? productRes.data?.data ?? [])
          .map(item => normalizeProduct(item, subcategoryList));

        setCategories(categoryList);
        setSubcategories(subcategoryList);
        setWarehouses(warehouseRes.data?.dataLst ?? []);
        setProducts(sortNewestFirst(normalized));
      } catch (err) {
        console.error("Failed to load product data:", err);
        showToast(err.message || "Failed to load product data", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  /* ─── Refresh products ────────────────────────────────────── */
  const refreshProducts = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/product");
      assertApiSuccess(res.data, "Failed to refresh products");
      const normalized = (res.data?.dataLst ?? res.data?.data ?? [])
        .map(item => normalizeProduct(item, subcategories));
      setProducts(sortNewestFirst(normalized));
    } catch (err) {
      console.error("Failed to refresh products:", err);
      throw err;
    }
  }, [subcategories]);

  /* ─── POST ───────────────────────────────────────────────── */
  const addProduct = async (f) => {
    try {
      const formData = new FormData();
      if (f.imageFile instanceof File) {
        formData.append("File", f.imageFile, f.imageFile.name);
      }
      formData.append("SubCategoryId",  String(f.subcategoryId ?? "1"));
      formData.append("ProductName",    f.name);
      formData.append("Description",    f.description   ?? "");
      formData.append("UnitPrice",      String(f.retailPrice));
      formData.append("RetailPrice",    String(f.retailPrice));
      formData.append("WholeSalePrice", String(f.wholesalePrice));
      formData.append("CreatedBy",      "1");

      // Dynamic warehouses from API
      f.warehouseStocks.forEach((s, idx) => {
        formData.append(`Warehouses[${idx}].WarehouseId`,   String(s.warehouseId));
        formData.append(`Warehouses[${idx}].StockQuantity`, String(s.stockQuantity ?? 0));
      });

      // Let the browser add the multipart boundary to Content-Type.
      const response = await api.post("/api/v1/product", formData);
      assertApiSuccess(response.data, "Failed to add product");
      await refreshProducts();
      showToast(`"${f.name}" added successfully`);
    } catch (err) {
      console.error("Failed to add product:", err);
      showToast(err.message || "Failed to add product", "error");
      throw err;
    }
  };

  /* ─── PUT ────────────────────────────────────────────────── */
  const editProduct = async (f) => {
    try {
      const formData = new FormData();
      formData.append("ProductId",      String(f.id));
      formData.append("SubCategoryId",  String(f.subcategoryId));
      formData.append("ProductName",    f.name);
      formData.append("Description",    f.description   ?? "");
      formData.append("UnitPrice",      String(f.retailPrice));
      formData.append("RetailPrice",    String(f.retailPrice));
      formData.append("WholeSalePrice", String(f.wholesalePrice));
      formData.append("IsActive",       "true");
      formData.append("CreatedBy",      "1");
      formData.append("UpdatedBy",      "1");
      if (f.imageFile instanceof File) {
        formData.append("File", f.imageFile, f.imageFile.name);
      }

      // Dynamic warehouses from API
      f.warehouseStocks.forEach((s, idx) => {
        formData.append(`Warehouses[${idx}].WarehouseId`,   String(s.warehouseId));
        formData.append(`Warehouses[${idx}].StockQuantity`, String(s.stockQuantity ?? 0));
      });

      // Let the browser add the multipart boundary to Content-Type.
      const response = await api.put("/api/v1/product", formData);
      assertApiSuccess(response.data, "Failed to update product");
      await refreshProducts();
      showToast(`"${f.name}" updated successfully`);
    } catch (err) {
      console.error("Failed to update product:", err);
      showToast(err.message || "Failed to update product", "error");
      throw err;
    }
  };

  /* ─── DELETE ─────────────────────────────────────────────── */
  const delProduct = async (id) => {
    setDeleting(true);
    try {
      const response = await api.delete("/api/v1/product", {
        params: { productId: id },
      });
      assertApiSuccess(response.data, "Failed to delete product");
      await refreshProducts();
      setModal(null);
      showToast("Product deleted successfully");
    } catch (err) {
      console.error("Failed to delete product:", err);
      showToast(err.message || "Failed to delete product", "error");
    } finally {
      setDeleting(false);
    }
  };

  const viewProduct = async (product) => {
    setViewLoading(true);
    setModal({ view: product });
    try {
      const response = await api.get(`/api/v1/product/${product.id}`);
      const detail = normalizeProduct(response.data, subcategories);
      setModal({ view: detail });
    } catch (err) {
      console.error("Failed to load product details:", err);
      showToast(err.message || "Failed to load product details", "error");
      setModal(null);
    } finally {
      setViewLoading(false);
    }
  };

  /* ─── FILTER ─────────────────────────────────────────────── */
  const visible = products.filter(p => {
    const q      = search.toLowerCase();
    const matchQ = p.name.toLowerCase().includes(q) ||
                   (p.description ?? "").toLowerCase().includes(q);
    const matchC = catFilter === "All" || String(p.categoryId) === String(catFilter);
    return matchQ && matchC;
  });

  /* ─── Dynamic table columns from warehouses ───────────────── */
  const warehouseColumns = warehouses.map(w => ({
    id:   w.warehouseId,
    name: w.warehouseName,
  }));

  return (
    <Box sx={{ p: "28px 32px 48px", bgcolor: "grey.50", minHeight: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="text.primary">Product Management</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>{total} total products</Typography>
        </Box>
        <Button variant="contained" onClick={() => setModal("add")}
          sx={{ bgcolor: "#1f3a5f", borderRadius: 3, fontWeight: 600, textTransform: "none", px: 3, py: 1.3, "&:hover": { bgcolor: "#162d4a" } }}>
          + Add Product
        </Button>
      </Stack>

      {/* Filter Bar */}
      <Paper elevation={0} sx={{ display: "flex", gap: 1.5, alignItems: "center", p: 2, borderRadius: 4, border: "1px solid", borderColor: "divider", mb: 2.5 }}>
        <TextField size="small" placeholder="Search by name or description…" value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{ startAdornment:
            <InputAdornment position="start">
              <Box sx={{ color: "text.disabled", display: "flex" }}><SearchIcon /></Box>
            </InputAdornment>
          }}
          sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "grey.50" } }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <Select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            sx={{ borderRadius: 3 }} displayEmpty
            renderValue={(val) => {
              if (val === "All") return <Typography fontSize={13} color="text.secondary">All Categories</Typography>;
              const cat = categories.find(c => String(c.id) === String(val));
              return <Typography fontSize={13}>{cat?.name ?? "All Categories"}</Typography>;
            }}>
            <MenuItem value="All">All Categories</MenuItem>
            {categories.map(c => (
              <MenuItem key={c.id} value={String(c.id)}>{c.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              {/* Static columns */}
              {["Product", "Subcategory", "Description", "Retail Price", "Wholesale Price"].map(h => (
                <TableCell key={h} sx={{ fontSize: 13, fontWeight: 600, color: "text.secondary", borderBottom: "1px solid", borderColor: "divider", py: 1.75, px: 2 }}>
                  {h}
                </TableCell>
              ))}
              {/* Dynamic warehouse columns */}
              {warehouseColumns.map(wh => (
                <TableCell key={wh.id} sx={{ fontSize: 13, fontWeight: 600, color: "text.secondary", borderBottom: "1px solid", borderColor: "divider", py: 1.75, px: 2 }}>
                  {wh.name}
                </TableCell>
              ))}
              <TableCell sx={{ fontSize: 13, fontWeight: 600, color: "text.secondary", borderBottom: "1px solid", borderColor: "divider", py: 1.75, px: 2 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6 + warehouseColumns.length} sx={{ textAlign: "center", py: 5, color: "text.disabled" }}>
                  Loading products...
                </TableCell>
              </TableRow>
            ) : visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6 + warehouseColumns.length} sx={{ textAlign: "center", py: 5, color: "text.disabled" }}>
                  No products found.
                </TableCell>
              </TableRow>
            ) : visible.map(p => {
              const subIdx = subcategories.findIndex(s => s.subCategoryId === p.subcategoryId);
              const chip   = getChip(subIdx >= 0 ? subIdx : 0);
              return (
                <TableRow key={p.id} sx={{ "&:hover": { bgcolor: "grey.50" }, borderBottom: "1px solid", borderColor: "grey.100", transition: "background 0.15s" }}>

                  {/* Product */}
                  <TableCell sx={{ py: 1.75, px: 2, minWidth: 200 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar variant="rounded"
                        sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: "grey.100" }}>
                        <ImageIcon />
                      </Avatar>
                      <Typography variant="body2" fontWeight={500} color="text.primary">{p.name}</Typography>
                    </Stack>
                  </TableCell>

                  {/* Subcategory */}
                  <TableCell sx={{ py: 1.75, px: 2, minWidth: 140 }}>
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.8, px: 1.2, py: 0.4, borderRadius: 1.5, bgcolor: chip.bg }}>
                      <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: chip.color }} />
                      <Typography fontSize={12} fontWeight={600} color={chip.color}>
                        {p.subcategoryName || "—"}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Description */}
                  <TableCell sx={{ py: 1.75, px: 2, maxWidth: 220 }}>
                    <Typography fontSize={13} color="text.secondary" noWrap>
                      {p.description || <Box component="span" sx={{ color: "#d1d5db", fontStyle: "italic" }}>No description</Box>}
                    </Typography>
                  </TableCell>

                  {/* Retail Price */}
                  <TableCell sx={{ fontWeight: 600, fontSize: 14, py: 1.75, px: 2 }}>
                    {fmt(p.retailPrice)}
                  </TableCell>

                  {/* Wholesale Price */}
                  <TableCell sx={{ color: "text.secondary", fontSize: 14, py: 1.75, px: 2 }}>
                    {fmt(p.wholesalePrice)}
                  </TableCell>

                  {/* Dynamic warehouse stock cells */}
                  {warehouseColumns.map(wh => {
                    const stock = p.warehouseStocks?.find(s => s.warehouseId === wh.id);
                    return (
                      <TableCell key={wh.id} sx={{ py: 1.75, px: 2 }}>
                        <Typography fontWeight={600} fontSize={14} color="text.primary">
                          {fmt(stock?.stockQuantity ?? 0)}
                        </Typography>
                      </TableCell>
                    );
                  })}

                  {/* Actions */}
                  <TableCell sx={{ py: 1.75, px: 2 }}>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="View details">
                        <IconButton size="small" onClick={() => viewProduct(p)}
                          sx={{ color: "text.disabled", "&:hover": { color: "#0d9488", bgcolor: "#f0fdfa" } }}>
                          <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => setModal({ edit: p })}
                          sx={{ color: "text.disabled", "&:hover": { color: "text.primary" } }}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => setModal({ del: p })}
                          sx={{ color: "text.disabled", "&:hover": { color: "error.main" } }}>
                          <TrashIcon />
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

      {/* Add Dialog */}
      <Dialog open={modal === "add"} onClose={() => setModal(null)} maxWidth="sm" fullWidth
        TransitionComponent={Fade} PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 16, borderBottom: "1px solid", borderColor: "divider", pb: 2 }}>
          Add New Product
        </DialogTitle>
        {modal === "add" && (
          <ProductForm
            key="add-product"
            onSave={addProduct}
            onClose={() => setModal(null)}
            subcategories={subcategories}
            categories={categories}
            warehouses={warehouses}
          />
        )}
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!modal?.edit} onClose={() => setModal(null)} maxWidth="sm" fullWidth
        TransitionComponent={Fade} PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 16, borderBottom: "1px solid", borderColor: "divider", pb: 2 }}>
          Edit Product
        </DialogTitle>
        {modal?.edit && (
          <ProductForm
            key={`edit-product-${modal.edit.id}`}
            initial={modal.edit}
            onSave={editProduct}
            onClose={() => setModal(null)}
            subcategories={subcategories}
            categories={categories}
            warehouses={warehouses}
          />
        )}
      </Dialog>

      {/* Product Detail Dialog — image loads only when this modal is open */}
      <Dialog open={!!modal?.view} onClose={() => setModal(null)} maxWidth="sm" fullWidth
        TransitionComponent={Fade} PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 16, borderBottom: "1px solid", borderColor: "divider", pb: 2 }}>
          Product Details
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2.5 }}>
          {viewLoading ? (
            <Box sx={{ minHeight: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CircularProgress size={28} />
            </Box>
          ) : modal?.view && (
            <Stack spacing={2.5}>
              <Box sx={{ width: "100%", aspectRatio: "16 / 9", borderRadius: 3, overflow: "hidden", bgcolor: "grey.50", border: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {modal.view.image ? (
                  <Box
                    component="img"
                    src={getProductImageUrl(modal.view.image)}
                    alt={modal.view.name}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                      event.currentTarget.nextElementSibling.style.display = "flex";
                    }}
                    sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                ) : null}
                <Stack
                  alignItems="center"
                  spacing={1}
                  sx={{ display: modal.view.image ? "none" : "flex", color: "text.disabled" }}
                >
                  <ImageIcon />
                  <Typography fontSize={13}>Product image is not available</Typography>
                </Stack>
              </Box>

              <Box>
                <Typography variant="h6" fontWeight={700}>{modal.view.name}</Typography>
                <Typography fontSize={13} color="text.secondary" mt={0.5}>
                  {modal.view.subcategoryName || "No subcategory"}
                </Typography>
              </Box>

              <Typography fontSize={14} color="text.secondary">
                {modal.view.description || "No description"}
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Paper variant="outlined" sx={{ flex: 1, p: 1.5, borderRadius: 2 }}>
                  <Typography fontSize={12} color="text.secondary">Unit Price</Typography>
                  <Typography fontWeight={700}>{fmt(modal.view.unitPrice)}</Typography>
                </Paper>
                <Paper variant="outlined" sx={{ flex: 1, p: 1.5, borderRadius: 2 }}>
                  <Typography fontSize={12} color="text.secondary">Retail Price</Typography>
                  <Typography fontWeight={700}>{fmt(modal.view.retailPrice)}</Typography>
                </Paper>
                <Paper variant="outlined" sx={{ flex: 1, p: 1.5, borderRadius: 2 }}>
                  <Typography fontSize={12} color="text.secondary">Wholesale Price</Typography>
                  <Typography fontWeight={700}>{fmt(modal.view.wholesalePrice)}</Typography>
                </Paper>
              </Stack>

              <Stack spacing={1}>
                <Typography fontSize={13} fontWeight={700}>Warehouse Stock</Typography>
                {modal.view.warehouseStocks.map(stock => (
                  <Stack key={stock.warehouseId} direction="row" justifyContent="space-between" sx={{ py: 0.8, borderBottom: "1px solid", borderColor: "divider" }}>
                    <Typography fontSize={13} color="text.secondary">{stock.warehouseName}</Typography>
                    <Typography fontSize={13} fontWeight={700}>{fmt(stock.stockQuantity)}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setModal(null)} variant="contained"
            sx={{ bgcolor: "#0f2942", fontWeight: 600, textTransform: "none", "&:hover": { bgcolor: "#162d4a" } }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!modal?.del} onClose={() => setModal(null)} TransitionComponent={Fade} transitionDuration={220}
        PaperProps={{ sx: { borderRadius: "20px", width: 360, overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.2)" } }}>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ height: 5, background: "linear-gradient(90deg, #ef4444, #f97316)" }} />
          <Box sx={{ px: 3.5, pt: 3.5, pb: 3 }}>
            <Box sx={{ width: 52, height: 52, borderRadius: "14px", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
              <WarningAmberRoundedIcon sx={{ fontSize: 28, color: "#ef4444" }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#0f172a", mb: 0.8 }}>
              Delete Product?
            </Typography>
            <Typography sx={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.6 }}>
              You're about to delete{" "}
              <Box component="span" sx={{ fontWeight: 700, color: "#0f172a" }}>"{modal?.del?.name}"</Box>.
              {" "}This action cannot be undone.
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, mt: 3.5 }}>
              <Button fullWidth variant="outlined" onClick={() => setModal(null)} disabled={deleting}
                sx={{ borderRadius: "10px", py: 1.2, borderColor: "#e2e8f0", color: "#64748b", fontWeight: 600, textTransform: "none" }}>
                Cancel
              </Button>
              <Button fullWidth variant="contained" onClick={() => delProduct(modal.del.id)} disabled={deleting}
                startIcon={deleting ? <CircularProgress size={14} color="inherit" /> : <TrashIcon />}
                sx={{ borderRadius: "10px", py: 1.2, background: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)", fontWeight: 600, textTransform: "none", boxShadow: "0 4px 14px rgba(239,68,68,0.3)", "&:hover": { background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)" } }}>
                {deleting ? "Deleting…" : "Yes, Delete"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Toast */}
      <Snackbar open={!!toast} autoHideDuration={3500} onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setToast(null)} severity={toast?.severity ?? "success"} variant="filled"
          sx={{ bgcolor: toast?.severity === "error" ? "#ef4444" : "#0f172a", color: "#fff", "& .MuiAlert-icon": { color: toast?.severity === "error" ? "#fff" : "#22c55e" }, borderRadius: 3 }}>
          {toast?.msg}
        </Alert>
      </Snackbar>

    </Box>
  );
}
