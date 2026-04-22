import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Trash2, Shield, Loader2, Power } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();
  const { admin } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await fetchApi("/api/admin-users/", { method: "GET" });
      setUsers(data?.users || []);
    } catch (err: any) {
      toast({ title: "Failed to fetch users", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      toast({ title: "All fields are required", variant: "destructive" });
      return;
    }
    setAdding(true);
    try {
      await fetchApi("/api/admin-users/create/", {
        method: "POST",
        body: JSON.stringify(form),
      });
      toast({ title: "Admin user created!" });
      setForm({ username: "", email: "", password: "" });
      fetchUsers();
    } catch (err: any) {
      toast({ title: "Failed to create user", description: err.message, variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin user?")) return;
    try {
      await fetchApi(`/api/admin-users/${id}/delete/`, { method: "DELETE" });
      toast({ title: "User deleted" });
      fetchUsers();
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await fetchApi(`/api/admin-users/${id}/toggle/`, { method: "PATCH" });
      toast({ title: "User status updated" });
      fetchUsers();
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Admin Users</h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-card rounded-xl border border-border p-6 shadow-sm h-fit">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5" /> Add New Admin
          </h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Username</label>
              <Input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="admin_name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min 8 characters"
              />
            </div>
            <Button type="submit" disabled={adding} className="w-full gap-2 mt-2">
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {adding ? "Creating..." : "Create Admin User"}
            </Button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
              <Loader2 className="w-6 h-6 animate-spin mb-2" /> Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 font-semibold text-foreground">Username</th>
                    <th className="text-left p-4 font-semibold text-foreground">Email</th>
                    <th className="text-left p-4 font-semibold text-foreground">Status</th>
                    <th className="text-right p-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const isSelf = admin?.id === u.id;
                    return (
                      <tr key={u.id} className={`border-b border-border last:border-0 hover:bg-muted/20 ${isSelf ? 'bg-primary/5' : ''}`}>
                        <td className="p-4 font-medium flex items-center gap-2 text-foreground">
                          <Shield className="w-4 h-4 text-primary" /> {u.username}
                          {isSelf && <span className="text-[10px] bg-primary/20 text-primary px-1.5 rounded-sm uppercase font-bold tracking-wider">You</span>}
                        </td>
                        <td className="p-4 text-muted-foreground">{u.email}</td>
                        <td className="p-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${u.is_active ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}`}>
                            {u.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {!isSelf && (
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleActive(u.id)}
                                title={u.is_active ? "Deactivate" : "Activate"}
                                className={u.is_active ? "text-amber-500 hover:text-amber-600" : "text-green-500 hover:text-green-600"}
                              >
                                <Power className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDelete(u.id)}
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
