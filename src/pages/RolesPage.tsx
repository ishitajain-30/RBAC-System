import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Table } from "../components/ui/Table";
import { Modal } from "../components/ui/Modal";
import { useRoleStore } from "../store/roleStore";
import { usePermissionStore } from "../store/permissionStore";
import type { Role, Permission } from "../types/auth";
import toast from "react-hot-toast";

export function RolesPage() {
  const { roles, isLoading, fetchRoles, addRole, deleteRole } = useRoleStore();
  const { permissions, fetchPermissions } = usePermissionStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [fetchRoles, fetchPermissions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addRole({
        ...newRole,
        permissions: permissions.filter((p) =>
          selectedPermissions.includes(p.id)
        ),
      });
      setIsModalOpen(false);
      setNewRole({ name: "", description: "" });
      setSelectedPermissions([]);
      toast.success("Role added successfully");
    } catch (error) {
      toast.error("Failed to add role");
    }
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    {
      header: "Permissions",
      accessor: (role: Role) => role.permissions.map((p) => p.name).join(", "),
    },
    {
      header: "Actions",
      accessor: (role: Role) => (
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={async () => {
              try {
                await deleteRole(role.id);
                toast.success("Role deleted successfully");
              } catch (error) {
                toast.error("Failed to delete role");
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

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <Table data={roles} columns={columns} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Role"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={newRole.name}
            onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
            required
          />
          <Input
            label="Description"
            value={newRole.description}
            onChange={(e) =>
              setNewRole({ ...newRole, description: e.target.value })
            }
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
                    checked={selectedPermissions.includes(permission.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPermissions([
                          ...selectedPermissions,
                          permission.id,
                        ]);
                      } else {
                        setSelectedPermissions(
                          selectedPermissions.filter(
                            (id) => id !== permission.id
                          )
                        );
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
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Role</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
