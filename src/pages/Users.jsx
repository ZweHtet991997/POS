import { useCallback, useEffect, useState } from "react";
import {
  Alert, Avatar, Box, Button, Chip, CircularProgress, Dialog,
  DialogActions, DialogContent, DialogTitle, Divider, FormControl,
  Grid, IconButton, InputAdornment, InputLabel, MenuItem, Paper,
  Select, Snackbar, Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Tooltip, Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import api from "../api/axios";

const ROLE_OPTIONS = [
  { value: "Casher", label: "Cashier" },
  { value: "Admin", label: "Administrator" },
];

const roleLabel = (role = "") => {
  if (role.toLowerCase() === "casher" || role.toLowerCase() === "cashier") return "Cashier";
  if (role.toLowerCase().includes("admin")) return "Administrator";
  return role || "User";
};

const roleColors = (role) => roleLabel(role) === "Administrator"
  ? { bg: "#e8f0fe", color: "#1a56db" }
  : { bg: "#fffbeb", color: "#d97706" };

const getInitials = (name = "") =>
  name.trim().split(/\s+/).map((part) => part[0]).join("").toUpperCase().slice(0, 2) || "US";

const assertApiSuccess = (data, fallbackMessage) => {
  const response = data?.baseResponseModel;
  if (response && response.respCode !== 200) {
    throw new Error(response.respMessage || fallbackMessage);
  }
};

const normalizeUser = (user) => ({
  id: user.userId,
  businessId: user.business_Id,
  businessName: user.businessName ?? "",
  name: user.userName ?? "",
  email: user.email ?? "",
  phone: user.phoneNumber ?? "",
  role: user.role ?? "Casher",
  companyId: user.companyId,
  companyName: user.companyName ?? "",
  active: user.isActive !== false,
});

function UserForm({ initial, companies, businesses, onSave, onClose }) {
  const editing = !!initial;
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    businessId: initial?.businessId ?? businesses[0]?.businessId ?? "",
    companyId: initial?.companyId ?? companies[0]?.companyId ?? "",
    role: initial?.role ?? "Casher",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Required";
    if (!form.email.trim()) nextErrors.email = "Required";
    if (!form.businessId) nextErrors.businessId = "Required";
    if (!editing && !form.companyId) nextErrors.companyId = "Required";
    if (!editing && !form.password.trim()) nextErrors.password = "Required";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2.25}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar sx={{ width: 54, height: 54, borderRadius: 2.5, bgcolor: "#1f3a5f", fontWeight: 700 }}>
              {getInitials(form.name)}
            </Avatar>
            <Box>
              <Typography fontWeight={700}>{form.name || "New User"}</Typography>
              <Typography fontSize={12} color="text.secondary">{editing ? "Update user profile" : "Create a system user"}</Typography>
            </Box>
          </Stack>
          <Divider />
          <TextField label="Full Name *" size="small" value={form.name} onChange={(e) => set("name", e.target.value)} error={!!errors.name} helperText={errors.name} />
          <TextField label="Email Address *" size="small" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} error={!!errors.email} helperText={errors.email} />
          <TextField label="Phone Number" size="small" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          <FormControl size="small" error={!!errors.businessId}>
            <InputLabel>Business *</InputLabel>
            <Select label="Business *" value={form.businessId} onChange={(e) => set("businessId", e.target.value)}>
              {businesses.map((business) => <MenuItem key={business.businessId} value={business.businessId}>{business.businessName}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" disabled={editing} error={!!errors.companyId}>
            <InputLabel>Company *</InputLabel>
            <Select label="Company *" value={form.companyId} onChange={(e) => set("companyId", e.target.value)}>
              {companies.map((company) => <MenuItem key={company.companyId} value={company.companyId}>{company.companyName}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" disabled={editing}>
            <InputLabel>Role *</InputLabel>
            <Select label="Role *" value={form.role} onChange={(e) => set("role", e.target.value)}>
              {ROLE_OPTIONS.map((role) => <MenuItem key={role.value} value={role.value}>{role.label}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField
            label={editing ? "New Password (optional)" : "Password *"}
            size="small"
            type="password"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
          {editing && <Typography fontSize={12} color="text.secondary">The current API does not support changing company or role during update.</Typography>}
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={onClose} disabled={saving} sx={{ textTransform: "none", fontWeight: 600 }}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={saving} startIcon={saving && <CircularProgress size={14} color="inherit" />}
          sx={{ bgcolor: "#1f3a5f", textTransform: "none", fontWeight: 700, "&:hover": { bgcolor: "#162d4a" } }}>
          {saving ? "Saving…" : editing ? "Save Changes" : "Add User"}
        </Button>
      </DialogActions>
    </>
  );
}

function ConfirmDialog({ open, title, name, confirmLabel, onConfirm, onClose, loading }) {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: "20px", width: 360, overflow: "hidden" } }}>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ height: 5, background: "linear-gradient(90deg, #ef4444, #f97316)" }} />
        <Box sx={{ p: 3.5 }}>
          <Box sx={{ width: 52, height: 52, borderRadius: "14px", bgcolor: "rgba(239,68,68,.1)", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
            <WarningAmberRoundedIcon sx={{ color: "#ef4444", fontSize: 28 }} />
          </Box>
          <Typography fontWeight={700} fontSize={18}>{title}</Typography>
          <Typography fontSize={14} color="text.secondary" mt={1}>You're about to update <strong>"{name}"</strong>. This action takes effect immediately.</Typography>
          <Stack direction="row" spacing={1.5} mt={3}>
            <Button fullWidth variant="outlined" onClick={onClose} disabled={loading} sx={{ textTransform: "none", fontWeight: 600 }}>Cancel</Button>
            <Button fullWidth variant="contained" onClick={onConfirm} disabled={loading} startIcon={loading && <CircularProgress size={14} color="inherit" />}
              sx={{ bgcolor: "#ef4444", textTransform: "none", fontWeight: 700, "&:hover": { bgcolor: "#dc2626" } }}>
              {loading ? "Processing…" : confirmLabel}
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [stats, setStats] = useState({ total: 0, admins: 0, cashiers: 0, active: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, severity = "success") => setToast({ message, severity });

  const fetchUsers = useCallback(async () => {
    const response = await api.get("/api/v1/userlist");
    assertApiSuccess(response.data, "Failed to load users");
    setUsers((response.data?.dataLst ?? []).map(normalizeUser));
    setStats({
      total: response.data?.totalUserCount ?? 0,
      admins: response.data?.adminCount ?? 0,
      cashiers: response.data?.cashierCount ?? 0,
      active: response.data?.activeUserCount ?? 0,
    });
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [companyResponse, businessResponse] = await Promise.all([
          api.get("/api/v1/company"),
          api.get("/api/v1/business"),
        ]);
        assertApiSuccess(companyResponse.data, "Failed to load companies");
        assertApiSuccess(businessResponse.data, "Failed to load businesses");
        setCompanies(companyResponse.data?.dataLst ?? []);
        setBusinesses(businessResponse.data?.dataLst ?? []);
        await fetchUsers();
      } catch (error) {
        showToast(error.message || "Failed to load users", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchUsers]);

  const addUser = async (form) => {
    try {
      const response = await api.post("/api/v1/user-register", {
        business_Id: Number(form.businessId), userName: form.name.trim(), email: form.email.trim(),
        phoneNumber: form.phone.trim(), role: form.role, company: Number(form.companyId), password: form.password,
      });
      assertApiSuccess(response.data, "Failed to create user");
      await fetchUsers();
      showToast(`"${form.name}" added successfully`);
    } catch (error) {
      showToast(error.message || "Failed to create user", "error");
      throw error;
    }
  };

  const editUser = async (form) => {
    try {
      const response = await api.put("/api/v1/user/update", {
        userId: modal.edit.id, business_Id: Number(form.businessId), userName: form.name.trim(),
        email: form.email.trim(), phoneNumber: form.phone.trim(), password: form.password,
      });
      assertApiSuccess(response.data, "Failed to update user");
      await fetchUsers();
      showToast(`"${form.name}" updated successfully`);
    } catch (error) {
      showToast(error.message || "Failed to update user", "error");
      throw error;
    }
  };

  const runAction = async (type) => {
    const user = modal?.[type];
    if (!user) return;
    setActionLoading(true);
    try {
      const response = type === "deactivate"
        ? await api.patch("/api/v1/user/inactive", null, { params: { userId: user.id, status: false } })
        : await api.delete("/api/v1/user/delete", { params: { userId: user.id } });
      assertApiSuccess(response.data, `Failed to ${type} user`);
      await fetchUsers();
      setModal(null);
      showToast(`User ${type === "deactivate" ? "deactivated" : "deleted"} successfully`);
    } catch (error) {
      showToast(error.message || `Failed to ${type} user`, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const visible = users.filter((user) => {
    const query = search.toLowerCase();
    const matchesQuery = [user.name, user.email, user.phone, user.companyName, user.businessName]
      .some((value) => value.toLowerCase().includes(query));
    return matchesQuery && (roleFilter === "All" || roleLabel(user.role) === roleFilter);
  });

  return (
    <Box sx={{ p: "28px 32px 48px", bgcolor: "#f9fafb", minHeight: "100vh" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box><Typography variant="h5" fontWeight={700}>User Management</Typography><Typography fontSize={13} color="text.secondary" mt={0.5}>{stats.total} total users • {stats.active} active</Typography></Box>
        <Button variant="contained" startIcon={<PersonAddAltOutlinedIcon />} onClick={() => setModal("add")}
          sx={{ bgcolor: "#1f3a5f", textTransform: "none", fontWeight: 700, borderRadius: 2.5, px: 3, py: 1.2, "&:hover": { bgcolor: "#162d4a" } }}>Add User</Button>
      </Stack>

      <Grid container spacing={2} mb={3}>
        {[{ label: "Total Users", value: stats.total }, { label: "Admins", value: stats.admins }, { label: "Cashiers", value: stats.cashiers }, { label: "Active Users", value: stats.active }].map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.label}><Paper elevation={0} sx={{ p: 2.25, border: "1px solid #e5e7eb", borderRadius: 3 }}><Typography fontSize={28} fontWeight={800} color="#1f3a5f">{item.value}</Typography><Typography fontSize={13} color="text.secondary">{item.label}</Typography></Paper></Grid>
        ))}
      </Grid>

      <Paper elevation={0} sx={{ display: "flex", gap: 1.5, p: 2, mb: 2.5, border: "1px solid #e5e7eb", borderRadius: 3 }}>
        <TextField fullWidth size="small" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, phone, company or business…"
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "text.disabled" }} /></InputAdornment> }} />
        <FormControl size="small" sx={{ minWidth: 170 }}><Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}><MenuItem value="All">All Roles</MenuItem><MenuItem value="Administrator">Administrator</MenuItem><MenuItem value="Cashier">Cashier</MenuItem></Select></FormControl>
      </Paper>

      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e5e7eb", borderRadius: 3 }}>
        <Table><TableHead><TableRow>{["User", "Contact", "Business", "Company", "Role", "Status", "Actions"].map((heading) => <TableCell key={heading} sx={{ fontSize: 13, fontWeight: 700, color: "text.secondary" }}>{heading}</TableCell>)}</TableRow></TableHead>
          <TableBody>{loading ? <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}><CircularProgress size={26} /></TableCell></TableRow> : visible.length === 0 ? <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6, color: "text.disabled" }}>No users found.</TableCell></TableRow> : visible.map((user) => {
            const colors = roleColors(user.role);
            return <TableRow key={user.id} hover><TableCell><Stack direction="row" spacing={1.25} alignItems="center"><Avatar sx={{ bgcolor: "#1f3a5f", width: 40, height: 40, fontSize: 13 }}>{getInitials(user.name)}</Avatar><Typography fontWeight={600} fontSize={14}>{user.name}</Typography></Stack></TableCell><TableCell><Typography fontSize={13}>{user.email}</Typography><Typography fontSize={12} color="text.secondary">{user.phone || "—"}</Typography></TableCell><TableCell>{user.businessName || "—"}</TableCell><TableCell>{user.companyName || "—"}</TableCell><TableCell><Chip size="small" label={roleLabel(user.role)} sx={{ bgcolor: colors.bg, color: colors.color, fontWeight: 600 }} /></TableCell><TableCell><Chip size="small" label="Active" sx={{ bgcolor: "#dcfce7", color: "#15803d", fontWeight: 700 }} /></TableCell><TableCell><Stack direction="row" spacing={0.25}><Tooltip title="Edit"><IconButton size="small" onClick={() => setModal({ edit: user })}><EditOutlinedIcon fontSize="small" /></IconButton></Tooltip><Tooltip title="Deactivate"><IconButton size="small" onClick={() => setModal({ deactivate: user })}><PersonOffOutlinedIcon fontSize="small" /></IconButton></Tooltip><Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setModal({ delete: user })}><DeleteOutlineIcon fontSize="small" /></IconButton></Tooltip></Stack></TableCell></TableRow>;
          })}</TableBody></Table>
      </TableContainer>

      <Dialog open={modal === "add"} onClose={() => setModal(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}><DialogTitle fontWeight={700}>Add User</DialogTitle>{modal === "add" && <UserForm companies={companies} businesses={businesses} onSave={addUser} onClose={() => setModal(null)} />}</Dialog>
      <Dialog open={!!modal?.edit} onClose={() => setModal(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}><DialogTitle fontWeight={700}>Edit User</DialogTitle>{modal?.edit && <UserForm initial={modal.edit} companies={companies} businesses={businesses} onSave={editUser} onClose={() => setModal(null)} />}</Dialog>
      <ConfirmDialog open={!!modal?.deactivate} title="Deactivate User?" name={modal?.deactivate?.name} confirmLabel="Deactivate" onConfirm={() => runAction("deactivate")} onClose={() => setModal(null)} loading={actionLoading} />
      <ConfirmDialog open={!!modal?.delete} title="Delete User?" name={modal?.delete?.name} confirmLabel="Delete" onConfirm={() => runAction("delete")} onClose={() => setModal(null)} loading={actionLoading} />

      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast(null)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}><Alert variant="filled" severity={toast?.severity ?? "success"} onClose={() => setToast(null)}>{toast?.message}</Alert></Snackbar>
    </Box>
  );
}
