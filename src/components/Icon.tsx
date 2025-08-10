// Типы для размеров иконок
type IconSize = 'sm' | 'md' | 'lg' | 'xl';

// Интерфейс для пропсов иконки
interface IconProps {
  name?: string; // имя предустановленной иконки
  size?: IconSize; // размер
  className?: string; // доп. классы
  color?: string; // управление цветом для SVG
  src?: string; // путь к внешнему png/svg файлу (public или import)
  alt?: string; // alt для изображений
  custom?: React.ReactNode; // кастомный React-узел
  ariaLabel?: string; // доступность
}

// Компонент иконки
export const Icon = ({
  name,
  size = 'md',
  className = '',
  color,
  src,
  alt = '',
  custom,
  ariaLabel,
}: IconProps) => {
  // Определяем SVG иконки
  const icons = {
    logo: (
      <svg viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="30" r="8" />
        <rect x="42" y="42" width="16" height="4" rx="2" />
        <rect x="38" y="50" width="24" height="4" rx="2" />
        <rect x="34" y="58" width="32" height="4" rx="2" />
        <rect x="30" y="66" width="40" height="4" rx="2" />
        <rect x="26" y="74" width="48" height="4" rx="2" />
        <circle cx="50" cy="85" r="3" />
      </svg>
    ),
    menu: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M3 12h18M3 6h18M3 18h18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    home: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    projects: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    user: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    close: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M6 18L18 6M6 6l12 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    arrow: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M9 5l7 7-7 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  // Получаем нужную иконку
  // 1. custom приоритет
  if (custom) {
    return (
      <span className={`icon icon--${size} ${className}`} aria-label={ariaLabel} style={{ color }}>
        {custom}
      </span>
    );
  }

  // 2. внешнее изображение (png/svg/webp)
  if (src) {
    return (
      <span className={`icon icon--${size} ${className}`} aria-label={ariaLabel}>
        <img src={src} alt={alt} className="icon__img" loading="lazy" draggable={false} />
      </span>
    );
  }

  // 3. встроенный svg по name
  if (name) {
    const IconSvg = icons[name as keyof typeof icons];
    if (!IconSvg) {
      console.warn(`Icon "${name}" not found`);
      return null;
    }
    return (
      <span
        className={`icon icon--${size} ${className}`}
        style={{ color }}
        aria-label={ariaLabel}
        role="img"
      >
        {IconSvg}
      </span>
    );
  }

  return null;
};

// Экспорт типов для использования в других компонентах
export type { IconProps, IconSize };
