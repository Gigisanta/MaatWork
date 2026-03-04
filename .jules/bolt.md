## 2025-05-15 - [Debounce Search to Reduce Server Load]
**Learning:** In applications using Next.js Server Actions for real-time search, every keystroke triggers a network request and potential database query. Implementing a simple debouncing strategy on the client side can significantly reduce server load and improve perceived performance by avoiding unnecessary updates.
**Action:** Always check if real-time search components are debounced, especially when they trigger server-side operations.
