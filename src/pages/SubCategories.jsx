import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, FormControl, IconButton, MenuItem, Paper, Select, Snackbar,
  Alert, Stack, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TextField, Tooltip, Typography, CircularProgress,
  Skeleton, Fade,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { _DecryptService } from "../services/cryptoService";
import { API_V1_BASE_URL } from "../api/config";

/* ─────────────────────────────────────────────
   Config  —  same base URL as Categories.jsx
───────────────────────────────────────────── */
const BASE = API_V1_BASE_URL;
const getToken = () => _DecryptService(sessionStorage.getItem("pos_token") ?? "");

/* ─────────────────────────────────────────────
   Dynamic colour palette  —  same as Categories
───────────────────────────────────────────── */
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

const normalizeCategory = (item) => ({
  id:          item.categoryId,
  name:        item.categoryName,
  description: item.description ?? "",
  createdDate: item.createdDate ?? "",
});

const normalizeSubcategory = (item) => ({
  ...item,
  subCategoryId:   item.subCategoryId,
  categoryId:      item.categoryId,
  categoryName:    item.categoryName ?? "",
  subCategoryName: item.subCategoryName ?? "",
  description:     item.description ?? "",
  createdDate:     item.createdDate ?? "",
  updatedDate:     item.updatedDate ?? "",
});

const getSortValue = (item, idKey) => {
  const dateValue = Date.parse(item.createdDate);
  return Number.isNaN(dateValue) ? Number(item[idKey]) || 0 : dateValue;
};

const sortCategoriesNewestFirst = (categories) =>
  [...categories].sort((a, b) => getSortValue(b, "id") - getSortValue(a, "id"));

const sortSubsNewestFirst = (subs) =>
  [...subs].sort((a, b) => getSortValue(b, "subCategoryId") - getSortValue(a, "subCategoryId"));

const assertApiSuccess = (data, fallbackMessage) => {
  const response = data?.baseResponseModel;
  if (response && response.respCode !== 200) {
    throw new Error(response.respMessage || fallbackMessage);
  }
};

const readJsonResponse = async (response, fallbackMessage) => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  assertApiSuccess(data, fallbackMessage);
  return data;
};

/* ─────────────────────────────────────────────
   Shared fetch helper  (mirrors Categories.jsx)
───────────────────────────────────────────── */
const authFetch = (url, options = {}) =>
  fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers ?? {}),
    },
  });

/* ── SVG Icons ── */
const PlusIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const TrashIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const EditIcon  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;

/* ══════════════════════════════════════════════
   Add / Edit Dialog
══════════════════════════════════════════════ */
function SubcategoryDialog({ open, onClose, onSave, initial, categories, saving }) {
  const [categoryId,   setCategoryId] = useState(initial?.categoryId ? Number(initial.categoryId) : "");
  const [subName,      setSubName]    = useState(initial?.subCategoryName ?? "");
  const [description,  setDesc]       = useState(initial?.description ?? "");
  const [errors,       setErrors]     = useState({});

  const isEdit = !!initial;

  const validate = () => {
    const e = {};
    if (!categoryId)     e.categoryId = "Please select a category";
    if (!subName.trim()) e.subName    = "Please enter a subcategory name";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (isEdit) {
      onSave({
        subCategoryId:   initial.subCategoryId,
        categoryId:      Number(categoryId),
        subCategoryName: subName.trim(),
        description:     description.trim(),
      });
    } else {
      onSave({
        categoryId:      Number(categoryId),
        subCategoryName: subName.trim(),
        description:     description.trim(),
        isActive:        true,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      TransitionComponent={Fade}
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: 16, borderBottom: "1.5px solid #f1f5f9", pb: 2 }}>
        {isEdit ? "Edit Subcategory" : "Add Subcategory"}
      </DialogTitle>

      <DialogContent sx={{ pt: 2.5, pb: 1 }}>
        <Stack spacing={2.5}>

          {/* ── Category dropdown (populated from real API) ── */}
          <FormControl fullWidth size="small" error={!!errors.categoryId}>
            <Select
              value={categoryId}
              displayEmpty
              onChange={e => setCategoryId(e.target.value)}
              sx={{
                borderRadius: 2,
                fontSize: 14,
                "& .MuiSelect-select": { py: "10px" },
                ...(errors.categoryId
                  ? {}
                  : { "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d1d5db" } }),
              }}
              renderValue={(selected) => {
                // nothing chosen yet — show placeholder
                if (!selected && selected !== 0) {
                  return (
                    <Typography fontSize={14} sx={{ color: "#9ca3af" }}>
                      Select Category
                    </Typography>
                  );
                }
                const cat = categories.find(c => c.id === selected);
                const idx = categories.findIndex(c => c.id === selected);
                if (!cat) return <Typography fontSize={14} sx={{ color: "#9ca3af" }}>Select Category</Typography>;
                return (
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{ width: 11, height: 11, borderRadius: "50%", bgcolor: getChip(idx).color, flexShrink: 0 }} />
                    <Typography fontSize={14} color="#111827">{cat.name}</Typography>
                  </Stack>
                );
              }}
            >
              {categories.map((c, idx) => (
                <MenuItem key={c.id} value={c.id} sx={{ py: 1.2, minHeight: 44 }}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{ width: 11, height: 11, borderRadius: "50%", bgcolor: getChip(idx).color, flexShrink: 0 }} />
                    <Typography fontSize={14}>{c.name}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
            {errors.categoryId && (
              <Typography fontSize={12} color="error" mt={0.5}>{errors.categoryId}</Typography>
            )}
          </FormControl>

          {/* ── Subcategory name ── */}
          <TextField
            fullWidth size="small"
            label="Subcategory Name"
            placeholder="e.g. Instant Noodles"
            value={subName}
            onChange={e => setSubName(e.target.value)}
            error={!!errors.subName}
            helperText={errors.subName}
            onKeyDown={e => { if (e.key === "Enter") handleSave(); }}
          />

          {/* ── Description ── */}
          <TextField
            fullWidth size="small"
            label="Description (optional)"
            placeholder="Short description..."
            value={description}
            onChange={e => setDesc(e.target.value)}
            multiline rows={2}
          />
        </Stack>
      </DialogContent>

      <Divider sx={{ mt: 2 }} />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" disabled={saving}
          sx={{ borderColor: "#e2e8f0", color: "#475569", fontWeight: 600, textTransform: "none", borderRadius: 2 }}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={saving}
          startIcon={saving && <CircularProgress size={14} color="inherit" />}
          sx={{ background: "#0f2942", fontWeight: 600, textTransform: "none", borderRadius: 2, "&:hover": { background: "#162d4a" } }}>
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ══════════════════════════════════════════════
   Delete Confirmation Dialog
══════════════════════════════════════════════ */
function DeleteDialog({ open, target, onClose, onConfirm, deleting }) {
  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Fade} transitionDuration={220}
      PaperProps={{ sx: { borderRadius: "20px", width: 360, overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.2)" } }}>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ height: 5, background: "linear-gradient(90deg, #ef4444, #f97316)" }} />
        <Box sx={{ px: 3.5, pt: 3.5, pb: 3 }}>
          <Box sx={{ width: 52, height: 52, borderRadius: "14px", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
            <WarningAmberRoundedIcon sx={{ fontSize: 28, color: "#ef4444" }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#0f172a", mb: 0.8 }}>
            Delete Subcategory?
          </Typography>
          <Typography sx={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.6 }}>
            You're about to delete{" "}
            <Box component="span" sx={{ fontWeight: 700, color: "#0f172a" }}>"{target?.subCategoryName}"</Box>.
            {" "}This action cannot be undone.
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, mt: 3.5 }}>
            <Button fullWidth variant="outlined" onClick={onClose} disabled={deleting}
              sx={{ borderRadius: "10px", py: 1.2, borderColor: "#e2e8f0", color: "#64748b", fontWeight: 600, textTransform: "none" }}>
              Cancel
            </Button>
            <Button fullWidth variant="contained" onClick={onConfirm} disabled={deleting}
              startIcon={deleting ? <CircularProgress size={14} color="inherit" /> : <TrashIcon />}
              sx={{ borderRadius: "10px", py: 1.2, background: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)", fontWeight: 600, textTransform: "none", boxShadow: "0 4px 14px rgba(239,68,68,0.3)", "&:hover": { background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)" } }}>
              {deleting ? "Deleting…" : "Yes, Delete"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

/* ── Skeleton rows while loading ── */
function TableSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      {[48, "30%", "22%", "30%", 90].map((w, j) => (
        <TableCell key={j} sx={{ py: 1.75, px: 2 }}>
          <Skeleton variant="rounded" width={typeof w === "number" ? w : "100%"} height={22} />
        </TableCell>
      ))}
    </TableRow>
  ));
}

/* ══════════════════════════════════════════════
   Main Component
══════════════════════════════════════════════ */
export default function SubCategories() {
  const [subs,         setSubs]         = useState([]);
  const [categories,   setCategories]   = useState([]);   // { id, name, description }
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [deleting,     setDeleting]     = useState(false);

  const [addOpen,      setAddOpen]      = useState(false);
  const [editTarget,   setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [search,       setSearch]       = useState("");
  const [catFilter,    setCatFilter]    = useState("All");  // "All" | categoryId (number)
  const [toast,        setToast]        = useState(null);   // { msg, severity }

  const showToast = (msg, severity = "success") => setToast({ msg, severity });

  /* ── Look up category from local list (same shape as Categories.jsx) ── */
  const getCat = useCallback((id) =>
    categories.find(c => c.id === Number(id)) ?? null,
  [categories]);

  /* ══ Fetch categories — mirrors Categories.jsx exactly ══ */
  const fetchCategories = useCallback(async () => {
    try {
      const res = await authFetch(`${BASE}/category`);
      const data = await readJsonResponse(res, "Failed to load categories");
      // API returns { dataLst: [...] }  —  same response as Categories.jsx
      const normalized = (data?.dataLst ?? []).map(normalizeCategory);
      setCategories(sortCategoriesNewestFirst(normalized));
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }, []);

  /* ══ Fetch subcategories ══ */
  const fetchSubs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${BASE}/subcategory`);
      const data = await readJsonResponse(res, "Failed to load subcategories");
      // handle { dataLst: [...] }  or  plain array
      const list = data?.dataLst ?? (Array.isArray(data) ? data : []);
      setSubs(sortSubsNewestFirst(list.map(normalizeSubcategory)));
    } catch (err) {
      console.error("Failed to fetch subcategories:", err);
      showToast(err?.message ?? "Failed to load subcategories.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchSubs();
  }, [fetchCategories, fetchSubs]);

  /* ══ POST ══ */
  const handleAdd = async (payload) => {
    setSaving(true);
    try {
      const res = await authFetch(`${BASE}/subcategory`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      await readJsonResponse(res, "Failed to add subcategory.");
      showToast(`"${payload.subCategoryName}" added successfully.`);
      setAddOpen(false);
      await fetchSubs();
    } catch (err) {
      showToast(err?.message ?? "Failed to add subcategory.", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ══ PUT ══ */
  const handleEdit = async (payload) => {
    setSaving(true);
    try {
      const res = await authFetch(`${BASE}/subcategory`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      await readJsonResponse(res, "Failed to update subcategory.");
      showToast(`"${payload.subCategoryName}" updated successfully.`);
      setEditTarget(null);
      await fetchSubs();
    } catch (err) {
      showToast(err?.message ?? "Failed to update subcategory.", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ══ DELETE ══ */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await authFetch(`${BASE}/subcategory/?subCategoryId=${deleteTarget.subCategoryId}`, {
        method: "DELETE",
      });
      await readJsonResponse(res, "Failed to delete subcategory.");
      showToast(`"${deleteTarget.subCategoryName}" deleted.`);
      setDeleteTarget(null);
      await fetchSubs();
    } catch (err) {
      showToast(err?.message ?? "Failed to delete subcategory.", "error");
    } finally {
      setDeleting(false);
    }
  };

  /* ══ Filter — catFilter is "All" or a number (categoryId) ══ */
  const visible = subs.filter(s => {
    const cat     = getCat(s.categoryId);
    const catName = cat?.name ?? "";
    const matchQ  = s.subCategoryName?.toLowerCase().includes(search.toLowerCase()) ||
                    catName.toLowerCase().includes(search.toLowerCase());
    const matchC  = catFilter === "All" || Number(s.categoryId) === Number(catFilter);
    return matchQ && matchC;
  });

  /* colour for a subcategory row — index matches the category's position in list */
  const chipForSub = (sub) => {
    const idx = categories.findIndex(c => c.id === Number(sub.categoryId));
    return getChip(idx >= 0 ? idx : 0);
  };

  const uniqueCatCount = new Set(subs.map(s => s.categoryId)).size;

  /* ════════════════════════ render ════════════════════════ */
  return (
    <Box sx={{ p: "28px 32px 48px", fontFamily: "'DM Sans',sans-serif", background: "#f9fafb", minHeight: "100vh" }}>

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="#0f172a">Subcategory Management</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {loading
              ? "Loading…"
              : `${subs.length} subcategories across ${uniqueCatCount} ${uniqueCatCount === 1 ? "category" : "categories"}`}
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setAddOpen(true)}
          startIcon={<PlusIcon />}
          sx={{ background: "#0f2942", borderRadius: 2.5, fontWeight: 600, fontSize: 14, px: 3, py: 1.3, textTransform: "none", "&:hover": { background: "#162d4a" } }}
        >
          Add Subcategory
        </Button>
      </Stack>

      {/* Filter bar */}
      <Paper elevation={0} sx={{ display: "flex", gap: 1.5, alignItems: "center", p: 2, borderRadius: 3, border: "1px solid #e5e7eb", mb: 2.5 }}>
        <TextField
          size="small" placeholder="Search subcategories…" value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 2, background: "#f9fafb" } }}
        />

        {/* Category filter — driven by real API categories */}
        <FormControl sx={{ minWidth: 210 }}>
          <Select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            sx={{ borderRadius: 2, bgcolor: "#f9fafb", fontSize: 13 }}
            displayEmpty
            renderValue={(selected) => {
              if (selected === "All") {
                return <Typography fontSize={13} color="text.secondary">All Categories</Typography>;
              }
              const cat = categories.find(c => c.id === selected);
              const idx = categories.findIndex(c => c.id === selected);
              if (!cat) return <Typography fontSize={13} color="text.secondary">All Categories</Typography>;
              return (
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{ width: 11, height: 11, borderRadius: "50%", bgcolor: getChip(idx).color, flexShrink: 0 }} />
                  <Typography fontSize={13}>{cat.name}</Typography>
                </Stack>
              );
            }}
          >
            <MenuItem value="All" sx={{ py: 1.2, minHeight: 44 }}>
              <Typography fontSize={13} color="text.secondary">All Categories</Typography>
            </MenuItem>
            {categories.map((c, idx) => (
              <MenuItem key={c.id} value={c.id} sx={{ py: 1.2, minHeight: 44 }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{ width: 11, height: 11, borderRadius: "50%", bgcolor: getChip(idx).color, flexShrink: 0 }} />
                  <Typography fontSize={13}>{c.name}</Typography>
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: "1px solid #e5e7eb" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#f9fafb" }}>
              {["#", "Subcategory Name", "Category", "Description", "Actions"].map(h => (
                <TableCell key={h} sx={{ fontSize: 13, fontWeight: 600, color: "#6b7280", borderBottom: "1px solid #e5e7eb", py: 1.75, px: 2 }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableSkeleton />
            ) : visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: "center", py: 6, color: "#94a3b8", fontSize: 14 }}>
                  {subs.length === 0
                    ? "No subcategories yet. Add one to get started."
                    : "No results match your search or filter."}
                </TableCell>
              </TableRow>
            ) : (
              visible.map((s, i) => {
                const cat  = getCat(s.categoryId);
                const chip = chipForSub(s);
                return (
                  <TableRow key={s.subCategoryId}
                    sx={{ "&:hover": { background: "#f9fafb" }, borderBottom: "1px solid #f1f5f9", transition: "background 0.15s" }}>
                    <TableCell sx={{ py: 1.75, px: 2, color: "#94a3b8", fontSize: 13, width: 48 }}>{i + 1}</TableCell>
                    <TableCell sx={{ py: 1.75, px: 2, fontWeight: 500, color: "#111827", fontSize: 14 }}>
                      {s.subCategoryName}
                    </TableCell>
                    <TableCell sx={{ py: 1.75, px: 2 }}>
                      <Chip
                        label={cat?.name ?? `#${s.categoryId}`}
                        size="small"
                        sx={{ background: chip.bg, color: chip.color, fontWeight: 600, fontSize: 12 }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 1.75, px: 2, maxWidth: 240 }}>
                      <Typography noWrap fontSize={13} color="#64748b">
                        {s.description || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.75, px: 2 }}>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => setEditTarget(s)}
                            sx={{ color: "#9ca3af", "&:hover": { color: "#1e88e5", background: "#e3f2fd" } }}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => setDeleteTarget(s)}
                            sx={{ color: "#9ca3af", "&:hover": { color: "#ef4444", background: "#fff5f5" } }}>
                            <TrashIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialogs */}
      {addOpen && (
        <SubcategoryDialog
          key="add-subcategory"
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onSave={handleAdd}
          initial={null}
          categories={categories}
          saving={saving}
        />
      )}
      {editTarget && (
        <SubcategoryDialog
          key={`edit-subcategory-${editTarget.subCategoryId}`}
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleEdit}
          initial={editTarget}
          categories={categories}
          saving={saving}
        />
      )}
      <DeleteDialog
        open={!!deleteTarget}
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        deleting={deleting}
      />

      {/* Toast */}
      <Snackbar open={!!toast} autoHideDuration={3500} onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setToast(null)} severity={toast?.severity ?? "success"} variant="filled"
          sx={{ background: toast?.severity === "error" ? "#ef4444" : "#0f172a", color: "#fff", "& .MuiAlert-icon": { color: toast?.severity === "error" ? "#fff" : "#22c55e" }, borderRadius: 2.5 }}>
          {toast?.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
