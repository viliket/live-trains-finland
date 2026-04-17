import { useColorScheme, useTheme } from '@mui/material/styles';

/**
 * Returns the active color scheme mode and its palette, re-rendering when
 * the scheme changes.
 *
 * Use for non-CSS consumers (MapLibre paint expressions, canvas, imperative
 * APIs). For CSS/`sx`, prefer `theme.vars.palette.*` which binds to CSS
 * variables and swaps automatically.
 */
export function useResolvedPalette() {
  const theme = useTheme();
  const { mode, systemMode } = useColorScheme();
  const resolvedMode = (mode === 'system' ? systemMode : mode) ?? 'light';
  const palette = theme.colorSchemes[resolvedMode]?.palette ?? theme.palette;
  return { resolvedMode, palette };
}
