# SCSS Mobile-First Architecture для Junkick

## 🎯 Полная SCSS система готова!

Я настроил профессиональную SCSS архитектуру по методологии **7-1 Pattern**:

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

### 3. **Готовые компоненты**

#### Кнопки

```html
<button class="btn btn--primary">Primary</button>
<button class="btn btn--outline btn--lg">Large Outline</button>
<button class="btn btn--secondary btn--sm">Small Secondary</button>
```

#### Карточки

```html
<div class="card card--hover">
  <div class="card__header">
    <h3 class="card__title">Title</h3>
    <p class="card__subtitle">Subtitle</p>
  </div>
  <div class="card__body">Content here</div>
  <div class="card__footer">
    <button class="btn btn--primary">Action</button>
  </div>
</div>
```

#### Формы

```html
<form class="form">
  <div class="form__group">
    <label class="form__label">Email</label>
    <input type="email" class="form__input" />
    <div class="form__error">Error message</div>
  </div>
</form>
```

#### Layout

```html
<div class="container">
  <div class="grid grid--responsive">
    <div class="card">Item 1</div>
    <div class="card">Item 2</div>
    <div class="card">Item 3</div>
  </div>
</div>
```

## 📱 Как использовать

### 1. **В компонентах используй классы:**

```jsx
export default function HomePage() {
  return (
    <div className="homepage">
      <section className="homepage__hero">
        <div className="container">
          <h1 className="homepage__title">Title</h1>
          <p className="homepage__subtitle">Subtitle</p>
          <div className="homepage__cta">
            <button className="btn btn--primary btn--lg">Get Started</button>
          </div>
        </div>
      </section>
    </div>
  );
}
```

### 2. **Создавай новые компоненты:**

```scss
// src/scss/components/_my-component.scss
@use '../abstracts' as *;

.my-component {
  @include card;

  &__title {
    @include heading(lg);
    color: color(primary);
  }

  &__content {
    @include mobile-up {
      padding: space(sm);
    }

    @include desktop-up {
      padding: space(lg);
    }
  }
}
```

### 3. **Добавляй в главный файл:**

```scss
// src/scss/components/_index.scss
@forward 'buttons';
@forward 'cards';
@forward 'forms';
@forward 'my-component'; // ← добавь сюда
```

## 🎨 Что уже настроено

✅ **SCSS установлен и настроен**  
✅ **7-1 архитектура папок**  
✅ **Mobile-first переменные и миксины**  
✅ **Готовые компоненты (кнопки, карточки, формы)**  
✅ **Responsive navigation**  
✅ **Grid система**  
✅ **HomePage обновлена с SCSS классами**  
✅ **Dark mode support**

## 🚀 Запуск

```bash
npm run dev
```

Открой http://localhost:5173 и увидишь готовую страницу с SCSS стилями!

## 📝 Примеры создания компонентов

### Feature Card

```scss
.feature-card {
  @include card;
  @include hover-lift;
  text-align: center;

  &__icon {
    font-size: font-size(3xl);
    color: color(primary);
    margin-bottom: space(md);
  }

  &__title {
    @include heading(lg);
  }
}
```

### Hero Section

```scss
.hero {
  @include gradient(45deg, color(primary), color(secondary));
  color: white;
  text-align: center;

  @include mobile-up {
    padding: space(2xl) 0;
  }

  @include desktop-up {
    padding: space(5xl) 0;
  }
}
```

Теперь у тебя есть полная SCSS система! Создавай компоненты, используй миксины и переменные. 🎉
