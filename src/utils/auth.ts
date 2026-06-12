export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: string;
  scanCount: number;
}

const STORAGE_KEY = 'phishguard_auth';
const USERS_KEY = 'phishguard_users';

export function getUsers(): Array<User & { password: string }> {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveUsers(users: Array<User & { password: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser(name: string, email: string, password: string): User | null {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return null;
  }
  const newUser: User & { password: string } = {
    id: Math.random().toString(36).substring(2, 15),
    name,
    email,
    password, // In production, this would be hashed
    role: email.includes('admin') ? 'admin' : 'user',
    createdAt: new Date().toISOString(),
    scanCount: 0,
  };
  users.push(newUser);
  saveUsers(users);
  return { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, createdAt: newUser.createdAt, scanCount: newUser.scanCount };
}

export function loginUser(email: string, password: string): User | null {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }
  return null;
}

export function logoutUser() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === 'admin';
}

export function updateUserScanCount() {
  const user = getCurrentUser();
  if (user) {
    user.scanCount += 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      users[idx].scanCount = user.scanCount;
      saveUsers(users);
    }
  }
}

export function getAllUsers(): User[] {
  return getUsers().map(({ password, ...user }) => user);
}

export function deleteUser(userId: string) {
  const users = getUsers().filter(u => u.id !== userId);
  saveUsers(users);
}
