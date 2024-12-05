import { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { SearchInput } from '../components/ui/SearchInput';
import { useRoleStore } from '../store/roleStore';
import { usePermissionStore } from '../store/permissionStore';
import { useSearch } from '../hooks/useSearch';
import type { Role } from '../types/auth';
import toast from 'react-hot-toast';

export function RolesPage() {
  const { roles, isLoading, fetchRoles, addRole, updateRole, deleteRole } = useRoleStore();
  const { permissions, fetchPermissions } = usePermissionStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissionIds: [] as string[],
  });

  const { searchQuery, setSearchQuery, filteredItems: filteredRoles } = useSearch(roles, ['name', 'description']);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [fetchRoles, fetchPermissions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const roleData = {
        ...formData,
        permissions: permissions.filter((p) => formData.permissionIds.includes(p.id)),
      };

      if (editingRole) {
        await updateRole(editingRole.id, roleData);
        toast.success('Role updated successfully');
      } else {
        await addRole(roleData);
        toast.success('Role added successfully');
      }

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(editingRole ? 'Failed to update role' : 'Failed to add role');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissionIds: [],
    });
    setEditingRole(null);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissionIds: role.permissions.map((p) => p.id),
    });
    setIsModalOpen(true);
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    {
      header: 'Permissions',
      accessor: (role: Role) => role.permissions.map((p) => p.name).join(', '),
    },
    {
      header: 'Actions',
      accessor: (role: Role) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEdit(role)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={async () => {
              try {
                await deleteRole(role.id);
                toast.success('Role deleted successfully');
              } catch (error) {
                toast.error('Failed to delete role');
              }
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Roles</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Role
        </Button>
      </div>

      <div className="max-w-sm">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search roles..."
        />
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <Table data={filteredRoles} columns={columns} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingRole ? 'Edit Role' : 'Add New Role'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Permissions
            </label>
            <div className="space-y-2">
              {permissions.map((permission) => (
                <label
                  key={permission.id}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={formData.permissionIds.includes(permission.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          permissionIds: [...formData.permissionIds, permission.id],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          permissionIds: formData.permissionIds.filter(
                            (id) => id !== permission.id
                          ),
                        });
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-900">
                    {permission.name} - {permission.description}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingRole ? 'Update Role' : 'Add Role'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}