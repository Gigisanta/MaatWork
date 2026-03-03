# Palette's Journal

## 2025-05-22 - Accessible Icon Buttons and Focus Visibility
**Learning:** In highly customized, dark-themed UIs (using glassmorphism like `bg-black/40`), default browser focus rings are often invisible or clash with the design. Icon-only buttons in lists also lack context for screen readers if they only use generic titles.
**Action:** Always use `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2` to ensure keyboard navigation is visible. Use dynamic `aria-label` attributes for list actions (e.g., `aria-label={`Complete task: ${todo.title}`}`) to provide specific context to assistive technologies.
