import { useAppSelector, useAppDispatch } from '../store/hooks';
import { login, register, logout } from '../store/authSlice';
import type { RootState } from '../store/index'

export const useAuth = () => {
  const { user, isLoading, error } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login: (email: string, password: string) => dispatch(login({ email, password })).unwrap(),
    register: (username: string, email: string, password: string, fullName: string) =>
      dispatch(register({ username, email, password, fullName })).unwrap(),
    logout: () => dispatch(logout()),
  };
};