import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleDarkMode } from '../store/themeSlice';

export const useTheme = () => {
	const darkMode = useAppSelector(state => state.theme.darkMode);
	const dispatch = useAppDispatch();
	return {
		darkMode,
		toggleDarkMode: () => dispatch(toggleDarkMode()),
	};
};