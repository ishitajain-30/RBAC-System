import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Table } from "../components/ui/Table";
import { Modal } from "../components/ui/Modal";
import { useUserStore } from "../store/userStore";
import type { User } from "../types/auth";
import toast from "react-hot-toast";

export function UsersPage() {
  const { users, isLoading, fetchUsers, addUser, deleteUser } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    status: "active" as const,
  });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addUser({
        ...newUser,
        roles: [],
      });
      setIsModalOpen(false);
      setNewUser({ name: "", email: "", status: "active" });
      toast.success("User added successfully");
    } catch (error) {
      toast.error("Failed to add user");
    }
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    {
      header: "Roles",
      accessor: (user: User) => user.roles.map((role) => role.name).join(", "),
    },
    { header: "Status", accessor: "status" },
    {
      header: "Actions",
      accessor: (user: User) => (
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={async () => {
              try {
                await deleteUser(user.id);
                toast.success("User deleted successfully");
              } catch (error) {
                toast.error("Failed to delete user");
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
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <Table data={users} columns={columns} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New User"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
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
            <Button type="submit">Add User</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
