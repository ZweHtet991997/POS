import { useState, useEffect, useCallback } from "react";
import {
  Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, IconButton, InputAdornment, Paper, Snackbar, Alert, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography, Tooltip, CircularProgress, Fade,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import api from "../api/axios";

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
const UserIcon = () => (
  <Box component="svg" width={22} height={22} viewBox="0 0 24 24" fill="none"
    stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <Box component="path" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Box component="circle" cx={12} cy={7} r={4} />
  </Box>
);
const PhoneIcon = () => (
  <Box component="svg" width={14} height={14} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Box component="path" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.98-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </Box>
);
const MapPinIcon = () => (
  <Box component="svg" width={14} height={14} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Box component="path" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Box component="circle" cx={12} cy={10} r={3} />
  </Box>
);

/* ════════════════════════════════════════
   Avatar helpers
   ════════════════════════════════════════ */
const AVATAR_COLORS = ["#1f3a5f","#0f766e","#7c3aed","#b45309","#be185d","#15803d","#1d4ed8"];

function getInitials(name) {
  if (!name || name === "—") return "?";
  return name.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}
function getAvatarColor(id) {
  return AVATAR_COLORS[((Number(id) || 1) - 1) % AVATAR_COLORS.length];
}

const BLANK = { name: "", phone: "", address: "" };

const cleanPhoneInput = (value) => {
  const trimmedStart = value.trimStart();
  const hasLeadingPlus = trimmedStart.startsWith("+");
  const digitsOnly = value.replace(/\D/g, "");
  return hasLeadingPlus ? `+${digitsOnly}` : digitsOnly;
};

const assertApiSuccess = (data, fallbackMessage) => {
  const response = data?.baseResponseModel;
  if (response && response.respCode !== 200) {
    throw new Error(response.respMessage || fallbackMessage);
  }
};

const normalizeCustomer = (item) => ({
  id: item.customerId,
  name: item.customerName ?? "",
  phone: item.phoneNumber ?? "",
  address: item.address ?? "",
  createdDate: item.createdDate ?? "",
  updatedDate: item.updatedDate ?? "",
});

const getCustomerSortValue = (customer) => {
  const dateValue = Date.parse(customer.createdDate);
  return Number.isNaN(dateValue) ? Number(customer.id) || 0 : dateValue;
};

const sortNewestFirst = (customers) =>
  [...customers].sort((a, b) => getCustomerSortValue(b) - getCustomerSortValue(a));

/* ════════════════════════════════════════
   CustomerForm
   ════════════════════════════════════════ */
function CustomerForm({ initial, onSave, onClose, saving }) {
  const [form,   setForm]   = useState(initial ? { ...initial } : { ...BLANK });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const saved = { ...form };
    if (initial?.id != null) saved.id = initial.id;
    try {
      await onSave(saved);
      onClose();
    } catch {
      // Keep the dialog open; the parent already shows the API error toast.
    }
  };

  return (
    <>
      <DialogContent sx={{ pt: 2.5, pb: 1 }}>
        <Stack spacing={2.5}>

          {/* Customer Name */}
          <TextField
            fullWidth size="small"
            label="Customer Name"
            placeholder="e.g. Daw Aye Aye"
            value={form.name}
            onChange={e => set("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />

          {/* Phone Number */}
          <TextField
            fullWidth size="small"
            label="Phone Number"
            placeholder="e.g. +959421111222"
            value={form.phone}
            onChange={e => set("phone", cleanPhoneInput(e.target.value))}
            error={!!errors.phone}
            helperText={errors.phone}
            InputProps={{
              startAdornment: (
                <Box sx={{ color: "text.disabled", display: "flex", mr: 0.5 }}>
                  <PhoneIcon />
                </Box>
              ),
            }}
          />

          {/* Address */}
          <TextField
            fullWidth size="small"
            label="Address (Optional)"
            placeholder="e.g. No. 12, Bogyoke Road, Yangon"
            value={form.address}
            onChange={e => set("address", e.target.value)}
            multiline minRows={2}
            InputProps={{
              startAdornment: (
                <Box sx={{ color: "text.disabled", display: "flex", mr: 0.5, mt: 0.3 }}>
                  <MapPinIcon />
                </Box>
              ),
            }}
          />

        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" disabled={saving}
          sx={{ borderColor: "divider", color: "text.secondary", fontWeight: 600, textTransform: "none" }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={saving}
          sx={{ bgcolor: "#1f3a5f", fontWeight: 600, textTransform: "none", "&:hover": { bgcolor: "#162d4a" } }}>
          {saving ? <CircularProgress size={18} color="inherit" /> : initial ? "Save Changes" : "Add Customer"}
        </Button>
      </DialogActions>
    </>
  );
}

function DeleteConfirmDialog({ open, customerName, onConfirm, onClose, deleting }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      TransitionComponent={Fade}
      PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}
    >
      <Box sx={{ height: 4, bgcolor: "#ef4444" }} />
      <DialogContent sx={{ px: 4, pt: 4, pb: 2.5 }}>
        <Stack spacing={2.5}>
          <Box sx={{ width: 56, height: 56, borderRadius: 3, bgcolor: "#fee2e2", display: "grid", placeItems: "center" }}>
            <WarningAmberRoundedIcon sx={{ fontSize: 28, color: "#ef4444" }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#0f172a", mb: 1 }}>
              Delete Customer?
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
              You're about to delete <Box component="strong" sx={{ color: "#0f172a" }}>"{customerName}"</Box>.
              <br />
              This action cannot be undone.
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 4, pb: 4, pt: 1, gap: 1.5 }}>
        <Button
          onClick={onClose}
          disabled={deleting}
          variant="outlined"
          fullWidth
          sx={{ py: 1.2, borderRadius: 2, borderColor: "#e2e8f0", color: "#64748b", fontWeight: 700, textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={deleting}
          variant="contained"
          fullWidth
          sx={{ py: 1.2, borderRadius: 2, bgcolor: "#ef4444", fontWeight: 800, textTransform: "none", "&:hover": { bgcolor: "#dc2626" } }}
        >
          {deleting ? <CircularProgress size={18} color="inherit" /> : "Yes, Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ════════════════════════════════════════
   Main — Customer Management
   ════════════════════════════════════════ */
export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [deleting,  setDeleting]  = useState(false);
  const [search,    setSearch]    = useState("");
  const [modal,     setModal]     = useState(null);
  const [toast,     setToast]     = useState(null); // { msg, severity }

  const total   = customers.length;
  const query = search.trim().toLowerCase();
  const visible = customers.filter(c =>
    c.name.toLowerCase().includes(query) ||
    c.phone.toLowerCase().includes(query) ||
    c.address.toLowerCase().includes(query)
  );

  const showToast = (msg, severity = "success") => setToast({ msg, severity });

  /* ─── GET ─────────────────────────────────────────────────── */
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/customer");
      assertApiSuccess(res.data, "Failed to load customers");
      setCustomers(sortNewestFirst((res.data?.dataLst ?? []).map(normalizeCustomer)));
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      showToast(err?.response?.data?.baseResponseModel?.respMessage || err.message || "Failed to load customers", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  /* ─── POST ───────────────────────────────────────────────── */
  const addCustomer = async (f) => {
    setSaving(true);
    try {
      const res  = await api.post("/api/v1/customer", {
        customerName: f.name.trim(),
        phoneNumber:  f.phone.trim(),
        address:      f.address.trim(),
      });
      assertApiSuccess(res.data, "Failed to add customer");
      await fetchCustomers();
      showToast(`"${f.name.trim()}" added successfully`);
    } catch (err) {
      console.error("Failed to add customer:", err);
      showToast(err?.response?.data?.baseResponseModel?.respMessage || err.message || "Failed to add customer", "error");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  /* ─── PUT ────────────────────────────────────────────────── */
  const editCustomer = async (f) => {
    setSaving(true);
    try {
      const res  = await api.put("/api/v1/customer", {
        customerId:   f.id,
        customerName: f.name.trim(),
        phoneNumber:  f.phone.trim(),
        address:      f.address.trim(),
      });
      assertApiSuccess(res.data, "Failed to update customer");
      await fetchCustomers();
      showToast(`"${f.name.trim()}" updated successfully`);
    } catch (err) {
      console.error("Failed to update customer:", err);
      showToast(err?.response?.data?.baseResponseModel?.respMessage || err.message || "Failed to update customer", "error");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  /* ─── DELETE ─────────────────────────────────────────────── */
  // DELETE uses query param: /api/v1/customer?customerId=1
  const delCustomer = async (id) => {
    const target = modal?.del;
    setDeleting(true);
    try {
      const res = await api.delete(`/api/v1/customer`, {
        params: { customerId: id },
      });
      assertApiSuccess(res.data, "Failed to delete customer");
      await fetchCustomers();
      setModal(null);
      showToast(`"${target?.name}" deleted successfully`);
    } catch (err) {
      console.error("Failed to delete customer:", err);
      showToast(err?.response?.data?.baseResponseModel?.respMessage || err.message || "Failed to delete customer", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ p: "28px 32px 48px", bgcolor: "grey.50", minHeight: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="text.primary">Customer Management</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {loading ? "Loading…" : `${total} total customers`}
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => setModal("add")}
          sx={{ bgcolor: "#1f3a5f", borderRadius: 3, fontWeight: 600, textTransform: "none", px: 3, py: 1.3, "&:hover": { bgcolor: "#162d4a" } }}>
          + Add Customer
        </Button>
      </Stack>

      {/* Search Bar */}
      <Paper elevation={0} sx={{ display: "flex", alignItems: "center", p: 2, borderRadius: 4, border: "1px solid", borderColor: "divider", mb: 2.5 }}>
        <TextField
          fullWidth size="small"
          placeholder="Search by name, phone number, or address…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box sx={{ color: "text.disabled", display: "flex" }}><SearchIcon /></Box>
              </InputAdornment>
            ),
          }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "grey.50" } }}
        />
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} elevation={0}
        sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              {["Customer Name", "Phone Number", "Address", "Actions"].map(h => (
                <TableCell key={h} sx={{
                  fontSize: 13, fontWeight: 600, color: "text.secondary",
                  borderBottom: "1px solid", borderColor: "divider",
                  py: 1.75, px: 2,
                }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: "center", py: 6, color: "text.disabled", fontSize: 14 }}>
                  Loading customers...
                </TableCell>
              </TableRow>
            ) : visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: "center", py: 6, color: "text.disabled", fontSize: 14 }}>
                  {total === 0 ? "No customers yet. Add your first one!" : "No customers match your search."}
                </TableCell>
              </TableRow>
            ) : visible.map(c => (
              <TableRow key={c.id} sx={{
                "&:hover": { bgcolor: "grey.50" },
                borderBottom: "1px solid", borderColor: "grey.100",
                transition: "background 0.15s",
              }}>

                {/* Name + Avatar */}
                <TableCell sx={{ py: 1.75, px: 2, minWidth: 220 }}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar sx={{
                      width: 40, height: 40, borderRadius: 2.5,
                      bgcolor: getAvatarColor(c.id),
                      fontSize: 14, fontWeight: 700,
                    }}>
                      {c.name === "Walk-in Customer"
                        ? <UserIcon />
                        : getInitials(c.name)
                      }
                    </Avatar>
                    <Typography variant="body2" fontWeight={600} color="text.primary">
                      {c.name}
                    </Typography>
                  </Stack>
                </TableCell>

                {/* Phone */}
                <TableCell sx={{ py: 1.75, px: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={0.8}>
                    <Box sx={{ color: "text.disabled", display: "flex" }}><PhoneIcon /></Box>
                    <Typography fontSize={14} color="text.secondary">{c.phone}</Typography>
                  </Stack>
                </TableCell>

                {/* Address */}
                <TableCell sx={{ py: 1.75, px: 2, maxWidth: 300 }}>
                  {c.address ? (
                    <Stack direction="row" alignItems="flex-start" spacing={0.8}>
                      <Box sx={{ color: "text.disabled", display: "flex", mt: "2px" }}><MapPinIcon /></Box>
                      <Typography fontSize={13} color="text.secondary">{c.address}</Typography>
                    </Stack>
                  ) : (
                    <Typography fontSize={13} color="text.disabled" fontStyle="italic">—</Typography>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell sx={{ py: 1.75, px: 2 }}>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => setModal({ edit: c })}
                        sx={{ color: "text.disabled", "&:hover": { color: "text.primary" } }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => setModal({ del: c })}
                        sx={{ color: "text.disabled", "&:hover": { color: "error.main" } }}>
                        <TrashIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer */}
      <Box sx={{ pt: 2, px: 0.5 }}>
        <Typography fontSize={13} color="text.disabled">
          Showing {visible.length} of {total} customers
        </Typography>
      </Box>

      {/* Add Dialog */}
      <Dialog open={modal === "add"} onClose={() => setModal(null)}
        maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 16, borderBottom: "1px solid", borderColor: "divider", pb: 2 }}>
          Add New Customer
        </DialogTitle>
        <CustomerForm onSave={addCustomer} onClose={() => setModal(null)} saving={saving} />
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!modal?.edit} onClose={() => setModal(null)}
        maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 16, borderBottom: "1px solid", borderColor: "divider", pb: 2 }}>
          Edit Customer
        </DialogTitle>
        {modal?.edit && (
          <CustomerForm initial={modal.edit} onSave={editCustomer} onClose={() => setModal(null)} saving={saving} />
        )}
      </Dialog>

      <DeleteConfirmDialog
        open={!!modal?.del}
        customerName={modal?.del?.name}
        onConfirm={() => delCustomer(modal.del.id)}
        onClose={() => setModal(null)}
        deleting={deleting}
      />

      {/* Toast */}
      <Snackbar open={!!toast} autoHideDuration={3500} onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setToast(null)}
          severity={toast?.severity ?? "success"}
          variant="filled"
          sx={{
            bgcolor: toast?.severity === "error" ? "#ef4444" : "#0f172a",
            color: "#fff",
            "& .MuiAlert-icon": { color: toast?.severity === "error" ? "#fff" : "#22c55e" },
            borderRadius: 3,
          }}>
          {toast?.msg}
        </Alert>
      </Snackbar>

    </Box>
  );
}
