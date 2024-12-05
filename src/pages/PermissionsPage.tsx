import { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { SearchInput } from '../components/ui/SearchInput';
import { usePermissionStore } from '../store/permissionStore';
import { useSearch } from '../hooks/useSearch';
import type { Permission } from '../types/auth';
import toast from 'react-hot-toast';

export function PermissionsPage() {
  const {
    permissions,
    isLoading,
    fetchPermissions,
    addPermission,
    updatePermission,
    deletePermission,
  } = usePermissionStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const { searchQuery, setSearchQuery, filteredItems: filteredPermissions } = useSearch(
    permissions,
    ['name', 'description']
  );

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPermission) {
        await updatePermission(editingPermission.id, formData);
        toast.success('Permission updated successfully');
      } else {
        await addPermission(formData);
        toast.success('Permission added successfully');
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(
        editingPermission
          ? 'Failed to update permission'
          : 'Failed to add permission'
      );
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
    });
    setEditingPermission(null);
  };

  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission);
    setFormData({
      name: permission.name,
      description: permission.description,
    });
    setIsModalOpen(true);
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    {
      header: 'Actions',
      accessor: (permission: Permission) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEdit(permission)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={async () => {
              try {
                await deletePermission(permission.id);
                toast.success('Permission deleted successfully');
              } catch (error) {
                toast.error('Failed to delete permission');
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
        <h1 className="text-2xl font-semibold text-gray-900">Permissions</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Permission
        </Button>
      </div>

      <div className="max-w-sm">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search permissions..."
        />
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <Table data={filteredPermissions} columns={columns} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingPermission ? 'Edit Permission' : 'Add New Permission'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
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
              {editingPermission ? 'Update Permission' : 'Add Permission'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}