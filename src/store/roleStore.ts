import { create } from 'zustand';
import type { Role, Permission } from '../types/auth';

interface RoleState {
  roles: Role[];
  isLoading: boolean;
  fetchRoles: () => Promise<void>;
  addRole: (role: Omit<Role, 'id'>) => Promise<void>;
  updateRole: (id: string, role: Partial<Role>) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
}

export const useRoleStore = create<RoleState>((set) => ({
  roles: [],
  isLoading: false,
  fetchRoles: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({
      roles: [
        {
          id: '1',
          name: 'Admin',
          description: 'Full system access',
          permissions: [
            { id: '1', name: 'users:read', description: 'View users' },
            { id: '2', name: 'users:write', description: 'Modify users' },
          ],
        },
        {
          id: '2',
          name: 'User',
          description: 'Limited access',
          permissions: [
            { id: '1', name: 'users:read', description: 'View users' },
          ],
        },
      ],
      isLoading: false,
    });
  },
  addRole: async (role) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newRole = { ...role, id: Math.random().toString() };
    set((state) => ({
      roles: [...state.roles, newRole],
      isLoading: false,
    }));
  },
  updateRole: async (id, roleData) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set((state) => ({
      roles: state.roles.map((role) =>
        role.id === id ? { ...role, ...roleData } : role
      ),
      isLoading: false,
    }));
  },
  deleteRole: async (id) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set((state) => ({
      roles: state.roles.filter((role) => role.id !== id),
      isLoading: false,
    }));
  },
}));