import API, { TOKEN_KEY } from './APIUtils';
import { IAdmin } from '../types';
import { setLocalStorage } from '../utils';
import { setToken } from './APIUtils';

type Admin = {
  admin: IAdmin & { token: string };
};

function handleAdminResponse({ admin: { token, ...admin } }: Admin) {
  setLocalStorage(TOKEN_KEY, token);
  setToken(token);
  return admin;
}

export function getCurrentAdmin() {
  return API.get<Admin>('/admin');
}

export function login(email: string, password: string) {
  return API.post<Admin>('/admins/login', {
    admin: { email, password },
  }).then((admin) => {
    return handleAdminResponse(admin.data)
  });
}

export function register(admin: {
  username: string;
  email: string;
  password: string;
}) {
  return API.post<Admin>('/admins', { admin }).then((admin) =>
    handleAdminResponse(admin.data),
  );
}

export function updateAdmin(admin: IAdmin & Partial<{ password: string }>) {
  return API.put<Admin>('/admin', { admin });
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  setToken(null);
}
