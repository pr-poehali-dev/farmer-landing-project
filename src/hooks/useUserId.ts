import { useAuth } from './useAuth';

export const useUserId = (): string | null => {
  const { user } = useAuth();
  
  if (user) {
    return user.id.toString();
  }
  
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      return parsed.id?.toString() || null;
    } catch (e) {
      console.error('Ошибка парсинга user из localStorage:', e);
    }
  }
  
  return null;
};
