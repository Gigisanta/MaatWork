## 2025-05-22 - [Search Debouncing]
**Learning:** The Global Search component was firing server-side actions on every keystroke, leading to high network usage and unnecessary DB queries.
**Action:** Implement a reusable `useDebounce` hook in `@maatwork/ui` and apply it to search inputs to reduce API pressure.
