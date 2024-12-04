import { create } from 'zustand';
import type { Permission } from '../types/auth';

interface PermissionState {
  permissions: Permission[];
  isLoading: boolean;
  fetchPermissions: () => Promise<void>;
  addPermission: (permission: Omit<Permission, 'id'>) => Promise<void>;
  updatePermission: (id: string, permission: Partial<Permission>) => Promise<void>;
  deletePermission: (id: string) => Promise<void>;
}

export const usePermissionStore = create<PermissionState>((set) => ({
  permissions: [],
  isLoading: false,
  fetchPermissions: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({
      permissions: [
        { id: '1', name: 'users:read', description: 'View users' },
        { id: '2', name: 'users:write', description: 'Modify users' },
        { id: '3', name: 'roles:read', description: 'View roles' },
        { id: '4', name: 'roles:write', description: 'Modify roles' },
      ],
      isLoading: false,
    });
  },
  addPermission: async (permission) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newPermission = { ...permission, id: Math.random().toString() };
    set((state) => ({
      permissions: [...state.permissions, newPermission],
      isLoading: false,
    }));
  },
  updatePermission: async (id, permissionData) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set((state) => ({
      permissions: state.permissions.map((permission) =>
        permission.id === id ? { ...permission, ...permissionData } : permission
      ),
      isLoading: false,
    }));
  },
  deletePermission: async (id) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set((state) => ({
      permissions: state.permissions.filter((permission) => permission.id !== id),
      isLoading: false,
    }));
  },
}));