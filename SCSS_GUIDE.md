# SCSS Mobile-First Architecture для Junkick

```
src/scss/
├── abstracts/          # Переменные и миксины
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── _index.scss
├── base/              # Reset и базовые стили
│   ├── _reset.scss
│   └── _index.scss
├── components/        # Компоненты UI
│   ├── _buttons.scss
│   ├── _cards.scss
│   ├── _forms.scss
│   └── _index.scss
├── layout/           # Layout структуры
│   ├── _grid.scss
│   ├── _navigation.scss
│   └── _index.scss
├── pages/           # Стили страниц
│   ├── _home.scss
│   └── _index.scss
└── main.scss       # Главный файл
```

## 🚀 Mobile-First функции

### 1. **Переменные и функции**

```scss
// Цвета
color(primary)        // #646cff
color(text)          // #213547
color(background)    // #ffffff

// Spacing
space(xs)   // 4px
space(sm)   // 8px
space(md)   // 16px
space(lg)   // 24px
space(xl)   // 32px

// Typography
font-size(base)  // 1rem
font-size(lg)    // 1.125rem
font-size(2xl)   // 1.5rem

// Border radius
radius(sm)   // 0.25rem
radius(md)   // 0.5rem
radius(lg)   // 0.75rem
```

### 2. **Mobile-First миксины**

```scss
// Responsive breakpoints
@include mobile-up { ... }     // По умолчанию
@include tablet-up { ... }     // 640px+
@include desktop-up { ... }    // 768px+
@include large-up { ... }      // 1024px+

// Layout
@include container;           // Responsive контейнер
@include flex-center;        // display: flex + center
@include flex-between;       // justify-content: space-between
@include grid(3);           // CSS Grid с 3 колонками

// Компоненты
@include button-variant(primary);
@include card;
@include input-base;
```
