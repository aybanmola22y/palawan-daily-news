import AdminSidebar from "@/components/admin/AdminSidebar";
export const dynamic = "force-dynamic";
import { PlusCircle, Shield, Edit, Trash2 } from "lucide-react";
import { mockOrgChartEmployees } from "@/lib/mock-data";
import { getArticlesForFrontend } from "@/lib/articles-service";

const demoUser = { name: "Demo Admin", email: "admin@palawandaily.com", role: "super_admin" };

const roleConfig: Record<string, { label: string; className: string }> = {
  super_admin: { label: "Super Admin", className: "bg-red-100 text-red-700" },
  editor: { label: "Editor", className: "bg-blue-100 text-blue-700" },
  writer: { label: "Writer", className: "bg-green-100 text-green-700" },
};

export default async function UsersPage() {
  const articles = await getArticlesForFrontend();
  
  const users = mockOrgChartEmployees.map((emp, index) => {
    let role = "writer";
    if (emp.department === "management") role = "super_admin";
    else if (emp.title.toLowerCase().includes("editor")) role = "editor";
    
    const userArticlesCount = articles.filter(a => a.authorName === emp.name).length;
    
    return {
      id: parseInt(emp.id),
      name: emp.name,
      email: emp.name.toLowerCase().replace(/\s+/g, ".") + "@palawandaily.com",
      role: role,
      active: index !== mockOrgChartEmployees.length - 1,
      articles: userArticlesCount,
      createdAt: "Jan 15, 2024",
      avatar: emp.avatarUrl
    };
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar user={demoUser} />
      <main className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Users</h1>
            <p className="text-sm text-gray-500">Manage team members and roles</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
            <PlusCircle className="h-4 w-4" />
            Invite User
          </button>
        </div>

        <div className="p-8">
          {/* Role legend */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-600" />
              Role Permissions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-sm font-semibold text-red-700 mb-1">Super Admin</p>
                <p className="text-xs text-red-600">Full access — manage users, settings, all content</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-semibold text-blue-700 mb-1">Editor</p>
                <p className="text-xs text-blue-600">Review, approve, reject, publish, schedule articles</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-semibold text-green-700 mb-1">Writer</p>
                <p className="text-xs text-green-600">Create drafts, submit for review, edit own articles</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Articles</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => {
                  const role = roleConfig[user.role];
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-white">{user.name[0]}</span>
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${role.className}`}>
                          {role.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.articles}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {user.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.createdAt}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          {user.role !== "super_admin" && (
                            <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
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
