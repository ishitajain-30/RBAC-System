import { create } from 'zustand';
import type { User } from '../types/auth';

interface UserState {
  users: User[];
  isLoading: boolean;
  fetchUsers: () => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  isLoading: false,
  fetchUsers: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({
      users: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          roles: [{ id: '1', name: 'Admin', description: 'Administrator', permissions: [] }],
          status: 'active',
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          roles: [{ id: '2', name: 'User', description: 'Regular User', permissions: [] }],
          status: 'active',
        },
      ],
      isLoading: false,
    });
  },
  addUser: async (user) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newUser = { ...user, id: Math.random().toString() };
    set((state) => ({
      users: [...state.users, newUser],
      isLoading: false,
    }));
  },
  updateUser: async (id, userData) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...userData } : user
      ),
      isLoading: false,
    }));
  },
  deleteUser: async (id) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
      isLoading: false,
    }));
  },
}));