import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Grid,
  CircularProgress,
  Divider,
  Fade,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import LocationOnIcon from "@mui/icons-material/LocationOnOutlined";
import PersonIcon from "@mui/icons-material/PersonOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import SearchIcon from "@mui/icons-material/Search";
import api from "../api/axios";

/* ── palette tokens ── */
const C = {
  teal: "#0d9488",
  tealBg: "#f0fdfa",
  tealBd: "#ccfbf1",
  bg: "#f9fafb",
  border: "#e5e7eb",
  border2: "#e2e8f0",
  text: "#111827",
  sub: "#6b7280",
  muted: "#9ca3af",
};

const assertApiSuccess = (data, fallbackMessage) => {
  const response = data?.baseResponseModel;
  if (response && response.respCode !== 200) {
    throw new Error(response.respMessage || fallbackMessage);
  }
};

const getWarehouseSortValue = (warehouse) => {
  const dateValue = Date.parse(warehouse.lastUpdatedDate);
  return Number.isNaN(dateValue) ? Number(warehouse.id) || 0 : dateValue;
};

const sortNewestFirst = (warehouses) =>
  [...warehouses].sort((a, b) => getWarehouseSortValue(b) - getWarehouseSortValue(a));

const TrashIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>;

/* ── Warehouse Form Dialog (Create / Edit) ── */
function WarehouseFormDialog({ open, initial, onSave, onClose }) {
  const BLANK = {
    name: "",
    location: "",
    manager: "",
    phone: "",
    description: "",
    status: true,
  };
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleEnter = () => {
    if (initial) {
      setForm({
        name: initial.name || "",
        location: initial.location || "",
        manager: initial.manager || "",
        phone: initial.phone || "",
        description: initial.description || "",
        status: initial.status === "Active",
      });
    } else {
      setForm(BLANK);
    }
    setErrors({});
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Warehouse name is required";
    if (!form.location.trim()) e.location = "Location is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    const payload = {
      warehouseName: form.name.trim(),
      warehouseAddress: form.location.trim(),
      managerName: form.manager.trim(),
      phoneNumber: form.phone.trim(),
      ...(initial && { warehouseId: initial.id }),
      ...(initial && { isActive: form.status }),
    };
    try {
      await onSave(payload, initial ? "update" : "create");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      TransitionProps={{ onEnter: handleEnter }}
      TransitionComponent={Fade}
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
          fontWeight: 700,
          fontSize: 16,
          color: C.text,
        }}
      >
        {initial ? "Edit Warehouse" : "Create New Warehouse"}
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            bgcolor: C.tealBg,
            border: `1px solid ${C.tealBd}`,
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: C.tealBd,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <WarehouseIcon sx={{ color: C.teal }} />
          </Box>
          <Box>
            <Typography fontWeight={700} fontSize={14} color={C.teal}>
              {form.name || "New Warehouse"}
            </Typography>
            <Typography fontSize={12} color={C.sub}>
              Fill in the details to {initial ? "update" : "create"} this warehouse
            </Typography>
          </Box>
        </Box>

        <TextField
          label={
            <>
              Warehouse Name <span style={{ color: "#ef4444" }}>*</span>
            </>
          }
          fullWidth
          size="small"
          placeholder="e.g. Warehouse C"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
          autoFocus
        />

        <TextField
          label={
            <>
              Location / Address <span style={{ color: "#ef4444" }}>*</span>
            </>
          }
          fullWidth
          size="small"
          placeholder="e.g. South Branch, Bago"
          value={form.location}
          onChange={(e) => set("location", e.target.value)}
          error={!!errors.location}
          helperText={errors.location}
        />

        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Manager Name"
              fullWidth
              size="small"
              placeholder="e.g. U Kyaw Zin"
              value={form.manager}
              onChange={(e) => set("manager", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Manager Phone No"
              fullWidth
              size="small"
              placeholder="e.g. 09-123456789"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </Grid>
        </Grid>

        <TextField
          label="Description (optional)"
          fullWidth
          size="small"
          multiline
          minRows={2}
          placeholder="e.g. Cold storage for beverages"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </DialogContent>

      <Divider />
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading}
          sx={{ borderColor: "#e2e8f0", color: "#475569", fontWeight: 600, textTransform: "none", borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={14} color="inherit" />}
          sx={{ background: "#0f2942", fontWeight: 600, textTransform: "none", borderRadius: 2, "&:hover": { background: "#162d4a" } }}
        >
          {loading ? "Saving…" : initial ? "Save Changes" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ── Delete Confirmation Dialog ── */
function DeleteConfirmDialog({ open, warehouseName, onConfirm, onClose, deleting }) {
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
            Delete Warehouse?
          </Typography>
          <Typography sx={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.6 }}>
            You're about to delete{" "}
            <Box component="span" sx={{ fontWeight: 700, color: "#0f172a" }}>"{warehouseName}"</Box>.
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

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
export default function WHManagement() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  const showToast = (msg, severity = "success") => setToast({ msg, severity });

  const mapAndDedupeWarehouses = (warehousesArray = []) => {
    const uniqueMap = new Map();

    warehousesArray.forEach((wh) => {
      if (!wh?.warehouseId) return;

      uniqueMap.set(wh.warehouseId, {
        id: wh.warehouseId,
        name: wh.warehouseName,
        location: wh.warehouseAddress || "",
        manager: wh.managerName,
        phone: wh.phoneNumber,
        description: wh.description || "",
        lastUpdatedDate: wh.lastUpdatedDate || wh.createdDate || "",
        status:
          wh.isActive === true
            ? "Active"
            : wh.isActive === false
            ? "Inactive"
            : "Active",
      });
    });

    return sortNewestFirst(Array.from(uniqueMap.values()));
  };

  const fetchWarehouses = useCallback(async ({ showError = true } = {}) => {
    try {
      const response = await api.get("/api/v1/warehouse");
      assertApiSuccess(response.data, "Failed to load warehouses");
      const warehousesArray = response.data?.dataLst || [];
      setWarehouses(mapAndDedupeWarehouses(warehousesArray));
    } catch (error) {
      console.error("Fetch warehouses error:", error);
      if (showError) showToast(error.message || "Failed to load warehouses", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch warehouses on mount
  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  // Create warehouse
  const handleCreate = async (payload) => {
    try {
      const response = await api.post("/api/v1/warehouse", payload);
      assertApiSuccess(response.data, "Failed to create warehouse");
      await fetchWarehouses({ showError: false });
      showToast("Warehouse created successfully.");
    } catch (error) {
      console.error("Create error:", error);
      showToast(error.message || "Failed to create warehouse", "error");
      throw error;
    }
  };

  // Update warehouse
  const handleEditWh = async (payload) => {
    try {
      const response = await api.put("/api/v1/warehouse", payload);
      assertApiSuccess(response.data, "Failed to update warehouse");
      await fetchWarehouses({ showError: false });
      showToast(`Warehouse "${payload.warehouseName}" updated.`);
    } catch (error) {
      console.error("Update error:", error);
      showToast(error.message || "Failed to update warehouse", "error");
      throw error;
    }
  };

  // Delete warehouse
  const handleDeleteWh = async (warehouseId, warehouseName) => {
    setDeleting(true);
    try {
      const response = await api.delete("/api/v1/warehouse", {
        params: { warehouseId },
      });
      assertApiSuccess(response.data, "Failed to delete warehouse");
      await fetchWarehouses({ showError: false });
      showToast(`Warehouse "${warehouseName}" deleted.`);
      setModal(null);
    } catch (error) {
      console.error("Delete error:", error?.response?.data || error);
      showToast(
        error.message ||
          error?.response?.data?.baseResponseModel?.respMessage ||
          "Failed to delete warehouse",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  const visibleWarehouses = warehouses.filter((warehouse) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return [
      warehouse.name,
      warehouse.location,
      warehouse.manager,
      warehouse.phone,
      warehouse.description,
    ].some((value) => String(value ?? "").toLowerCase().includes(query));
  });

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: C.bg, minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} color={C.text}>
            Warehouse Management
          </Typography>
          <Typography fontSize={14} color={C.sub} mt={0.5}>
            <Box component="span" sx={{ fontWeight: 800, fontSize: 18, color: C.teal }}>
              {warehouses.length}
            </Box>{" "}
            warehouse{warehouses.length !== 1 ? "s" : ""} total
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModal("create")}
          sx={{
            bgcolor: "#1f3a5f",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { bgcolor: "#16304f" },
          }}
        >
          Create Warehouse
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: 2, mb: 2.5, borderRadius: 3, border: `1px solid ${C.border}`, bgcolor: "#fff" }}>
        <TextField
          fullWidth
          size="small"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by warehouse name, address, manager, phone or description…"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 19, color: C.muted }} />
              </InputAdornment>
            ),
          }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: C.bg } }}
        />
      </Paper>

      {/* Warehouse Cards Grid */}
      <Grid container spacing={3}>
        {visibleWarehouses.map((wh) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
            key={wh.id}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: `1px solid ${C.border}`,
                minHeight: 170,
              }}
            >
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: C.tealBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <WarehouseIcon sx={{ color: C.teal, fontSize: 20 }} />
                    </Box>
                    <Typography fontWeight={700} fontSize={14} color={C.text}>
                      {wh.name}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => setModal({ editWh: wh })}
                      sx={{
                        border: `1.5px solid ${C.border2}`,
                        borderRadius: 1.5,
                        mr: 1,
                        "&:hover": { borderColor: C.teal, color: C.teal },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setModal({ deleteWh: wh })}
                      sx={{
                        border: `1.5px solid ${C.border2}`,
                        borderRadius: 1.5,
                        "&:hover": { borderColor: "#ef4444", color: "#ef4444" },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.6 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                    <LocationOnIcon sx={{ fontSize: 13, color: C.muted }} />
                    <Typography fontSize={12} color={C.sub}>
                      {wh.location || "—"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                      <PersonIcon sx={{ fontSize: 13, color: C.muted }} />
                      <Typography fontSize={12} color={C.sub}>
                        {wh.manager || "—"}
                      </Typography>
                    </Box>
                    {wh.phone && (
                      <Typography fontSize={11} color={C.muted} sx={{ ml: "18px" }}>
                        {wh.phone}
                      </Typography>
                    )}
                  </Box>
                  {wh.description && (
                    <Typography fontSize={11} color={C.muted} mt={0.3} sx={{ lineHeight: 1.4 }}>
                      {wh.description}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
        {visibleWarehouses.length === 0 && !loading && (
          <Box sx={{ width: "100%", textAlign: "center", py: 8 }}>
            <Typography color={C.muted}>
              {warehouses.length === 0
                ? 'No warehouses found. Click "Create Warehouse" to add one.'
                : "No warehouses match your search."}
            </Typography>
          </Box>
        )}
      </Grid>

      {/* Dialogs */}
      <WarehouseFormDialog
        open={modal === "create"}
        initial={null}
        onSave={handleCreate}
        onClose={() => setModal(null)}
      />
      <WarehouseFormDialog
        open={!!modal?.editWh}
        initial={modal?.editWh || null}
        onSave={handleEditWh}
        onClose={() => setModal(null)}
      />
      <DeleteConfirmDialog
        open={!!modal?.deleteWh}
        warehouseName={modal?.deleteWh?.name || ""}
        onConfirm={() => handleDeleteWh(modal.deleteWh.id, modal.deleteWh.name)}
        onClose={() => setModal(null)}
        deleting={deleting}
      />

      {/* Toast Snackbar */}
      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setToast(null)} severity={toast?.severity || "success"} variant="filled" sx={{ borderRadius: 2 }}>
          {toast?.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
