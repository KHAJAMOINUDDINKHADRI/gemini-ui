# Gemini Frontend Clone

A modern, Gemini-style conversational AI chat application built with Next.js 15, React Hook Form, Zod, and Tailwind CSS.

## 🚀 Live Demo

[Live site on Vercel](https://your-vercel-deployment-url)

## ✨ Features

- OTP-based authentication (with country code selection, simulated OTP)
- Dashboard with chatroom management (create, delete, search, toast notifications)
- Gemini-style chat UI:
  - User and simulated AI messages
  - Timestamps, typing indicator, fake AI reply with throttling
  - Reverse infinite scroll (load older messages, client-side pagination)
  - Image upload (base64 preview)
  - Copy-to-clipboard on message hover
  - Loading skeletons for chat messages
- Global UX:
  - Mobile responsive design
  - System-based dark mode (auto, no toggle)
  - Debounced search bar for chatrooms
  - All data persisted in localStorage
  - Keyboard accessibility

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **State Management:** React useState/useEffect, localStorage
- **Form Validation:** React Hook Form + Zod
- **Styling:** Tailwind CSS
- **Image Upload:** Base64/local preview
- **Deployment:** Vercel

## 📁 Folder Structure

```
/ (root)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # App layout, header, theme
│   │   ├── page.tsx           # Root redirect logic
│   │   ├── dashboard/
│   │   │   ├── layout.tsx     # Dashboard sidebar + main area
│   │   │   ├── page.tsx       # Dashboard welcome
│   │   │   └── chatroom/[id]/ # Chatroom UI (dynamic route)
│   │   └── auth/              # Auth pages (OTP, phone input)
│   ├── components/            # Reusable UI components
│   └── ...
├── public/                    # Static assets
├── tailwind.config.mjs        # Tailwind config (darkMode: 'class')
├── postcss.config.mjs         # PostCSS config
└── ...
```

## 🧩 Implementation Notes

- **Throttling & AI Simulation:**
  - AI replies are simulated with `setTimeout` and a typing indicator.
  - Throttling ensures a delay between user message and AI response.
- **Pagination & Infinite Scroll:**
  - Messages are paginated (20 per page) and loaded in reverse (oldest first) with a "Load older messages" button.
- **Form Validation:**
  - All forms use React Hook Form + Zod for robust validation (phone, OTP, chatroom title).
- **Dark Mode:**
  - Uses Tailwind's `dark:` classes and system preference (no toggle).
- **State Management:**
  - All state is managed with React hooks and persisted in localStorage for a simple, client-only experience.

## 📝 Setup & Run Instructions

1. **Install dependencies:**
   ```bash
   npm install
   # or yarn install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   # or yarn dev
   ```
3. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs/dark-mode)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

---
