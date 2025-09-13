import { Colors } from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';

export function useTheme() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return {
    colors,
    colorScheme,
    isDark: colorScheme === 'dark',
  };
}
