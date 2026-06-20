import React, { useState } from "react";
import {
  Box, Typography, Button, TextField, Divider,
  MenuItem, Select, FormControl, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Chip, Stack, Snackbar, Alert,
  CircularProgress, Fade,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import api from "../api/axios";

/* ─── COLOR PALETTE ──────────────────────────────────────────── */
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
const getColor = (idx) => PALETTE[idx % PALETTE.length];

const normalizeCategory = (item) => ({
  id:          item.categoryId,
  name:        item.categoryName,
  description: item.description ?? "",
  createdDate: item.createdDate ?? "",
  updatedDate: item.updatedDate ?? "",
});

const blankCategoryForm = { name: "", description: "" };

const getCategorySortValue = (category) => {
  const dateValue = Date.parse(category.createdDate);
  return Number.isNaN(dateValue) ? Number(category.id) || 0 : dateValue;
};

const sortNewestFirst = (categories) =>
  [...categories].sort((a, b) => getCategorySortValue(b) - getCategorySortValue(a));

const assertApiSuccess = (data, fallbackMessage) => {
  const response = data?.baseResponseModel;
  if (response && response.respCode !== 200) {
    throw new Error(response.respMessage || fallbackMessage);
  }
};

const PlusIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const TrashIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const EditIcon  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;

/* ─── FORM DIALOG ────────────────────────────────────────────── */
function CategoryFormDialog({ open, initial, onSave, onClose, existingNames, saving }) {
  const [form, setForm] = useState(initial ? { ...initial } : blankCategoryForm);
  const [nameError, setNameError] = useState("");

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (k === "name") {
      if (!v.trim()) {
        setNameError("Category name is required");
      } else {
        // Check duplicate — ignore current item when editing
        const isDuplicate = existingNames.some(
          n => n.toLowerCase() === v.trim().toLowerCase() &&
               n.toLowerCase() !== initial?.name?.toLowerCase()
        );
        setNameError(isDuplicate ? "A category with this name already exists" : "");
      }
    }
  };

  const handleSave = () => {
    if (!form.name.trim()) { setNameError("Category name is required"); return; }

    const isDuplicate = existingNames.some(
      n => n.toLowerCase() === form.name.trim().toLowerCase() &&
           n.toLowerCase() !== initial?.name?.toLowerCase()
    );
    if (isDuplicate) { setNameError("A category with this name already exists"); return; }

    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      TransitionComponent={Fade}
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: 16, borderBottom: "1.5px solid #f1f5f9", pb: 2 }}>
        {initial ? "Edit Category" : "Add Category"}
      </DialogTitle>

      <DialogContent sx={{ pt: 2.5, pb: 1 }}>
        <Stack spacing={2.5}>
          <TextField
            fullWidth size="small"
            label="Category Name"
            value={form.name}
            onChange={e => set("name", e.target.value)}
            placeholder="e.g. Electronics"
            error={!!nameError} helperText={nameError}
            onKeyDown={e => { if (e.key === "Enter") handleSave(); }}
          />
          <TextField
            fullWidth size="small"
            label="Description (optional)"
            multiline rows={2} value={form.description}
            onChange={e => set("description", e.target.value)}
            placeholder="Short description..."
          />
        </Stack>
      </DialogContent>

      <Divider sx={{ mt: 2 }} />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" disabled={saving}
          sx={{ borderColor: "#e2e8f0", color: "#475569", fontWeight: 600, textTransform: "none", borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving || !!nameError}
          startIcon={saving && <CircularProgress size={14} color="inherit" />}
          sx={{ background: "#0f2942", fontWeight: 600, textTransform: "none", borderRadius: 2, "&:hover": { background: "#162d4a" } }}>
          {saving ? "Saving…" : initial ? "Save Changes" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ─── DELETE DIALOG ──────────────────────────────────────────── */
function DeleteDialog({ open, category, onConfirm, onClose, deleting }) {
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
            Delete Category?
          </Typography>
          <Typography sx={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.6 }}>
            You're about to delete{" "}
            <Box component="span" sx={{ fontWeight: 700, color: "#0f172a" }}>"{category?.name}"</Box>.
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

/* ─── MAIN ───────────────────────────────────────────────────── */
export default function Categories() {
  const [cats,    setCats]    = useState([]);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [deleting,setDeleting]= useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [delCat,  setDelCat]  = useState(null);
  const [toast,   setToast]   = useState(null); // { msg, severity }

  const total        = cats.length;
  const existingNames = cats.map(c => c.name);

  const showToast = (msg, severity = "success") => setToast({ msg, severity });

  const fetchCategories = React.useCallback(async ({ showError = true } = {}) => {
    try {
      const res = await api.get("/api/v1/category");
      assertApiSuccess(res.data, "Failed to load categories");
      setCats(sortNewestFirst((res.data?.dataLst ?? []).map(normalizeCategory)));
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      if (showError) showToast("Failed to load categories", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /* ─── GET ──────────────────────────────────────────────── */
  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /* ─── POST ───────────────────────────────────────────────── */
  const handleAdd = async (f) => {
    // Double-check duplicate before API call
    const isDuplicate = existingNames.some(
      n => n.toLowerCase() === f.name.trim().toLowerCase()
    );
    if (isDuplicate) {
      showToast("A category with this name already exists", "error");
      return;
    }

    setSaving(true);
    try {
      const res   = await api.post("/api/v1/category", {
        categoryName: f.name.trim(),
        description:  f.description,
      });
      const data  = res.data;

      // Check application-level error in response body
      assertApiSuccess(data, "Failed to add category");

      await fetchCategories({ showError: false });
      setAddOpen(false);
      showToast(`"${f.name.trim()}" added successfully`);
    } catch (err) {
      console.error("Failed to add category:", err);
      showToast(err.message || "Failed to add category", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ─── PUT ────────────────────────────────────────────────── */
  const handleEdit = async (f) => {
    setSaving(true);
    try {
      const res  = await api.put("/api/v1/category", {
        categoryId:   f.id,
        categoryName: f.name.trim(),
        description:  f.description,
      });
      const data = res.data;

      assertApiSuccess(data, "Failed to update category");

      await fetchCategories({ showError: false });
      setEditCat(null);
      showToast(`"${f.name.trim()}" updated successfully`);
    } catch (err) {
      console.error("Failed to update category:", err);
      showToast(err.message || "Failed to update category", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ─── DELETE ─────────────────────────────────────────────── */
  const handleDelete = async () => {
    const target = delCat;
    if (!target) return;
    setDeleting(true);
    try {
      await api.delete("/api/v1/category", {
        params: { categoryId: target.id },
      }).then((res) => assertApiSuccess(res.data, "Failed to delete category"));
      await fetchCategories({ showError: false });
      setDelCat(null);
      showToast(`"${target.name}" deleted successfully`);
    } catch (err) {
      console.error("Failed to delete category:", err);
      showToast(err.message || "Failed to delete category", "error");
      setDelCat(null);
    } finally {
      setDeleting(false);
    }
  };

  /* ─── FILTER ─────────────────────────────────────────────── */
  const visible = cats.filter(c => {
    const q           = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    const matchFilter = filter === "all" || String(c.id) === filter;
    return matchSearch && matchFilter;
  });

  return (
    <Box sx={{ p: "28px 32px 48px", fontFamily: "'DM Sans',sans-serif", bgcolor: "#f9fafb", minHeight: "100vh", boxSizing: "border-box" }}>

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="#0f172a">Category Management</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {total} {total === 1 ? "category" : "categories"}
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => setAddOpen(true)}
          startIcon={<PlusIcon />}
          sx={{
            background: "#0f2942", borderRadius: 2.5, fontWeight: 600,
            fontSize: 14, px: 3, py: 1.3, textTransform: "none",
            "&:hover": { background: "#162d4a" },
          }}>
          Add Category
        </Button>
      </Stack>

      {/* Search + Filter Bar */}
      <Paper elevation={0} sx={{ display: "flex", gap: 1.5, alignItems: "center", p: 2, borderRadius: 3, border: "1px solid #e5e7eb", mb: 2.5, bgcolor: "#fff" }}>
        <TextField
          size="small" placeholder="Search categories…" value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 2, background: "#f9fafb" } }}
        />
        <FormControl sx={{ minWidth: 210 }}>
          <Select value={filter} onChange={e => setFilter(e.target.value)}
            displayEmpty
            sx={{ borderRadius: 2, bgcolor: "#f9fafb", fontSize: 13 }}
            renderValue={(selected) => {
              if (selected === "all") return <Typography fontSize={13} color="text.secondary">All Categories</Typography>;
              const cat = cats.find(c => String(c.id) === selected);
              const idx = cats.findIndex(c => String(c.id) === selected);
              if (!cat) return <Typography fontSize={13} color="text.secondary">All Categories</Typography>;
              return (
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{ width: 11, height: 11, borderRadius: "50%", bgcolor: getColor(idx).color, flexShrink: 0 }} />
                  <Typography fontSize={13}>{cat.name}</Typography>
                </Stack>
              );
            }}>
            <MenuItem value="all" sx={{ py: 1.2, minHeight: 44 }}>
              <Typography fontSize={13} color="text.secondary">All Categories</Typography>
            </MenuItem>
            {cats.map((c, idx) => (
              <MenuItem key={c.id} value={String(c.id)} sx={{ py: 1.2, minHeight: 44 }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{ width: 11, height: 11, borderRadius: "50%", bgcolor: getColor(idx).color, flexShrink: 0 }} />
                  <Typography fontSize={13}>{c.name}</Typography>
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: "1px solid #e5e7eb", bgcolor: "#fff" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9fafb" }}>
              {["#", "Category Name", "Description", "Actions"].map((h, i) => (
                <TableCell key={h}
                  align={i === 3 ? "right" : "left"}
                  sx={{
                    fontSize: 13, fontWeight: 600, color: "#6b7280",
                    borderBottom: "1px solid #e5e7eb", py: 1.75,
                    px: i === 0 ? 3 : 2,
                    width: i === 0 ? 52 : i === 3 ? 130 : "auto",
                  }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 8, color: "#9ca3af", fontSize: 14 }}>
                  Loading categories...
                </TableCell>
              </TableRow>
            ) : visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 8, color: "#9ca3af", fontSize: 14 }}>
                  {total === 0 ? "No categories yet. Add your first one!" : "No categories match your search."}
                </TableCell>
              </TableRow>
            ) : (
              visible.map((cat, idx) => {
                const clr = getColor(idx);
                return (
                  <TableRow key={cat.id}
                    sx={{ "&:last-child td": { borderBottom: 0 }, "&:hover": { bgcolor: "#f9fafb" }, transition: "background 0.15s" }}>
                    <TableCell sx={{ px: 3, py: 1.8, color: "#9ca3af", fontSize: 13, fontWeight: 500, borderBottom: "1px solid #f1f5f9" }}>
                      {idx + 1}
                    </TableCell>
                    <TableCell sx={{ py: 1.8, px: 2, borderBottom: "1px solid #f1f5f9" }}>
                      <Chip label={cat.name} size="small"
                        sx={{ bgcolor: clr.bg, color: clr.color, fontWeight: 700, fontSize: 12, height: 26, borderRadius: 1.5, "& .MuiChip-label": { px: 1.5 } }} />
                    </TableCell>
                    <TableCell sx={{ py: 1.8, px: 2, borderBottom: "1px solid #f1f5f9", maxWidth: 460 }}>
                      <Typography sx={{ fontSize: 13, color: "#6b7280", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
                        {cat.description || <Box component="span" sx={{ color: "#d1d5db", fontStyle: "italic" }}>No description</Box>}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 1.8, px: 2, borderBottom: "1px solid #f1f5f9" }}>
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <IconButton size="small" onClick={() => setEditCat(cat)}
                          sx={{ color: "#9ca3af", p: 0.7, borderRadius: 1.5, "&:hover": { color: "#1e88e5", bgcolor: "#e3f2fd" } }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => setDelCat(cat)}
                          sx={{ color: "#9ca3af", p: 0.7, borderRadius: 1.5, "&:hover": { color: "#ef4444", bgcolor: "#fff5f5" } }}>
                          <TrashIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer count */}
      <Typography sx={{ mt: 2, fontSize: 12, color: "#9ca3af" }}>
        Showing {visible.length} of {total} categories
      </Typography>

      {/* Dialogs */}
      {addOpen && (
        <CategoryFormDialog
          key="add-category"
          open={addOpen}
          initial={null}
          onSave={handleAdd}
          onClose={() => setAddOpen(false)}
          existingNames={existingNames}
          saving={saving}
        />
      )}
      {editCat && (
        <CategoryFormDialog
          key={`edit-category-${editCat.id}`}
          open={!!editCat}
          initial={editCat}
          onSave={handleEdit}
          onClose={() => setEditCat(null)}
          existingNames={existingNames}
          saving={saving}
        />
      )}
      <DeleteDialog
        open={!!delCat}
        category={delCat}
        onConfirm={handleDelete}
        onClose={() => setDelCat(null)}
        deleting={deleting}
      />

      {/* Toast */}
      <Snackbar
        open={!!toast}
        autoHideDuration={3500}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast(null)}
          severity={toast?.severity ?? "success"}
          variant="filled"
          sx={{
            bgcolor: toast?.severity === "error" ? "#ef4444" : "#0f172a",
            color: "#fff",
            "& .MuiAlert-icon": { color: toast?.severity === "error" ? "#fff" : "#22c55e" },
            borderRadius: 2.5,
          }}
        >
          {toast?.msg}
        </Alert>
      </Snackbar>

    </Box>
  );
}
