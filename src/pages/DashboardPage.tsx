import { useEffect } from 'react';
import { Users, Shield, Key, UserCheck, UserX } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useRoleStore } from '../store/roleStore';
import { usePermissionStore } from '../store/permissionStore';

function StatCard({ title, value, icon: Icon, color }: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { users, fetchUsers } = useUserStore();
  const { roles, fetchRoles } = useRoleStore();
  const { permissions, fetchPermissions } = usePermissionStore();

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchPermissions();
  }, [fetchUsers, fetchRoles, fetchPermissions]);

  const activeUsers = users.filter(user => user.status === 'active').length;
  const inactiveUsers = users.filter(user => user.status === 'inactive').length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={users.length}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Users"
          value={activeUsers}
          icon={UserCheck}
          color="bg-green-500"
        />
        <StatCard
          title="Inactive Users"
          value={inactiveUsers}
          icon={UserX}
          color="bg-red-500"
        />
        <StatCard
          title="Total Roles"
          value={roles.length}
          icon={Shield}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Permissions"
          value={permissions.length}
          icon={Key}
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Users</h2>
          <div className="space-y-4">
            {users.slice(0, 5).map(user => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Users className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Roles</h2>
          <div className="space-y-4">
            {roles.slice(0, 5).map(role => (
              <div key={role.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{role.name}</p>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {role.permissions.length} permissions
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}