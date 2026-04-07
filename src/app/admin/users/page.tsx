import AdminSidebar from "@/components/admin/AdminSidebar";
export const dynamic = "force-dynamic";
import { Shield } from "lucide-react";
import { getArticlesForFrontend, getAuthors } from "@/lib/articles-service";
import DeleteUserButton from "./DeleteUserButton";
import EditUserModal from "./EditUserModal";
import InviteUserModal from "./InviteUserModal";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const roleConfig: Record<string, { label: string; className: string }> = {
  super_admin: { label: "Super Admin", className: "bg-red-100 text-red-700" },
  editor: { label: "Editor", className: "bg-blue-100 text-blue-700" },
  writer: { label: "Writer", className: "bg-green-100 text-green-700" },
};

export default async function UsersPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const articles = await getArticlesForFrontend();
  const rawUsers = await getAuthors();
  
  const users = rawUsers.map((user: any) => {
    const userArticlesCount = articles.filter(a => a.authorName === user.name).length;
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      title: user.title,
      active: user.active ?? true,
      articles: userArticlesCount,
      createdAt: new Date(user.created_at || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      avatar: user.avatar_url
    };
  });

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar user={session as any} />
      <main className="flex-1 overflow-auto">
        <div className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Users</h1>
            <p className="text-sm text-muted-foreground">Manage team members and roles</p>
          </div>
          <InviteUserModal />
        </div>

        <div className="p-8">
          {/* Role legend - adapting to card style */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-4 mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-600" />
              Role Permissions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">Super Admin</p>
                <p className="text-xs text-red-600/80 dark:text-red-300/80">Full access — manage users, settings, all content</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">Editor</p>
                <p className="text-xs text-blue-600/80 dark:text-blue-300/80">Review, approve, reject, publish, schedule articles</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">Writer</p>
                <p className="text-xs text-green-600/80 dark:text-green-300/80">Create drafts, submit for review, edit own articles</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">User</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Articles</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Joined</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {users.map((user) => {
                  const role = roleConfig[user.role] || { label: user.role, className: "bg-gray-100 text-gray-700" };
                  return (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-border">
                              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-white">{user.name[0]}</span>
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${role.className}`}>
                          {role.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{user.articles}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.active ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-muted/50 text-muted-foreground"}`}>
                          {user.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{user.createdAt}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <EditUserModal user={user} />
                          {user.role !== "super_admin" && (
                            <DeleteUserButton userId={user.id} userName={user.name} />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
