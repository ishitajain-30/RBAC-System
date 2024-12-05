export interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  status: 'active' | 'inactive';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}