import type { SanitizedConfig } from '@/interfaces/sanitized-config';

interface ThemeSwitchProps {
  className: string;
  theme: string;
  setTheme: (theme: string) => void;
  sanitizedConfig: SanitizedConfig | Record<string, never>;
}

export default function ThemeSwitch({
  className,
  theme,
  setTheme,
  sanitizedConfig,
}: ThemeSwitchProps) {
  const disableScroll = () => {
    document.body.style.overflow = 'hidden';
  };

  const enableScroll = () => {
    document.body.style.overflow = 'unset';
  };
  return (
    <select
      className={className}
      value={theme}
      onFocus={disableScroll}
      onBlur={enableScroll}
      onChange={(e) => {
        setTheme(e.target.value);
        e.target.blur();
      }}
    >
      <optgroup label="Light Themes">
        {sanitizedConfig.themeConfig.themes.light.map((item) => (
          <option key={item} value={item}>
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </option>
        ))}
      </optgroup>

      <optgroup label="Dark Themes">
        {sanitizedConfig.themeConfig.themes.dark.map((item) => (
          <option key={item} value={item}>
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </option>
        ))}
      </optgroup>
    </select>
  );
}
