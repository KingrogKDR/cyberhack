const TOKEN_KEY = 'vault_token';
const USER_KEY = 'vault_user';

export const cookieUtils = {
  setToken: (token: string) => {
    console.log('🔄 Cookie Utils - Setting token');
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure=${window.location.protocol === 'https:'}; samesite=strict`;
    console.log('✅ Cookie Utils - Token set successfully');
  },

  getToken: (): string | null => {
    console.log('🔄 Cookie Utils - Getting token');
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith(`${TOKEN_KEY}=`));
    const token = tokenCookie ? tokenCookie.split('=')[1] : null;
    console.log('🔄 Cookie Utils - Token retrieved:', { hasToken: !!token });
    return token;
  },

  setUser: (user: any) => {
    console.log('🔄 Cookie Utils - Setting user:', { id: user.id, email: user.email, role: user.role });
    document.cookie = `${USER_KEY}=${JSON.stringify(user)}; path=/; max-age=${7 * 24 * 60 * 60}; secure=${window.location.protocol === 'https:'}; samesite=strict`;
    console.log('✅ Cookie Utils - User set successfully');
  },

  getUser: (): any | null => {
    console.log('🔄 Cookie Utils - Getting user');
    const cookies = document.cookie.split(';');
    const userCookie = cookies.find(cookie => cookie.trim().startsWith(`${USER_KEY}=`));
    const user = userCookie ? JSON.parse(decodeURIComponent(userCookie.split('=')[1])) : null;
    console.log('🔄 Cookie Utils - User retrieved:', user ? { id: user.id, email: user.email, role: user.role } : null);
    return user;
  },

  clearAuth: () => {
    console.log('🔄 Cookie Utils - Clearing auth cookies');
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
    document.cookie = `${USER_KEY}=; path=/; max-age=0`;
    console.log('✅ Cookie Utils - Auth cookies cleared');
  }
};