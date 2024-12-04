import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Table } from "../components/ui/Table";
import { Modal } from "../components/ui/Modal";
import { usePermissionStore } from "../store/permissionStore";
import type { Permission } from "../types/auth";
import toast from "react-hot-toast";

export function PermissionsPage() {
  const {
    permissions,
    isLoading,
    fetchPermissions,
    addPermission,
    deletePermission,
  } = usePermissionStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPermission, setNewPermission] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPermission(newPermission);
      setIsModalOpen(false);
      setNewPermission({ name: "", description: "" });
      toast.success("Permission added successfully");
    } catch (error) {
      toast.error("Failed to add permission");
    }
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    {
      header: "Actions",
      accessor: (permission: Permission) => (
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={async () => {
              try {
                await deletePermission(permission.id);
                toast.success("Permission deleted successfully");
              } catch (error) {
                toast.error("Failed to delete permission");
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

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <Table data={permissions} columns={columns} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Permission"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={newPermission.name}
            onChange={(e) =>
              setNewPermission({ ...newPermission, name: e.target.value })
            }
            required
          />
          <Input
            label="Description"
            value={newPermission.description}
            onChange={(e) =>
              setNewPermission({
                ...newPermission,
                description: e.target.value,
              })
            }
            required
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Permission</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
