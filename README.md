
# 🌐 Social App

A modern, full-stack social platform built with **Next.js** and powered by **Clerk**, **Prisma**, **PostgreSQL**, and **Pusher**. Users can customize profiles, create or delete their posts, and chat in real-time with individuals or groups — all in a sleek, responsive interface.

---

## 🔧 Tech Stack

* **Framework**: [Next.js App Router](https://nextjs.org)
* **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
* **Authentication**: [Clerk](https://clerk.dev)
* **Real-time Communication**: [Pusher Channels](https://pusher.com/channels)
* **File Uploads**: [UploadThing](https://uploadthing.com)
* **Styling**: Tailwind CSS + [shadcn/ui](https://ui.shadcn.com)
* **State Management**: Zustand
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **Language**: TypeScript

---

## ✨ Features

* 🔐 **Clerk Auth Integration** with protected routes and profile management
* 👤 **Customizable User Profiles** (name, bio, website)
* 🖼 **Profile Images** managed via Clerk's user dashboard
* 📝 **Post Creation & Deletion** (by the post owner)
* 💬 **Real-time Chat**

  * 1-on-1 and group conversations
  * Sidebar with user list (excluding current user)
  * Dynamic chat usernames and swipe-to-reply support
* 🟢 **Online/Offline Presence** via Pusher
* 📎 **Link Previews** using Open Graph metadata
* ⚡ **Optimistic UI Updates** for faster interactions
* 🗃️ **Reusable Components** with server/client component separation
* ⚠️ Built-in loading, error, and not-found handling

---

## 📁 Project Structure Highlights

* `actions/`: Server actions to interact with neon db
* `app/`: App Router structure with layout and route handlers
* `components/`: Shared and feature-specific UI components
* `hooks/`: Custom hooks with defined data accessibility
* `lib/`: Utility and configuration helpers (e.g., pusher, prisma, auth)
* `prisma/`: Defined database schema

---

## 🧪 Environment Setup

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

DATABASE_URL=your_postgres_database_url

UPLOADTHING_TOKEN=your_uploadthing_token

PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=your_pusher_cluster

NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
```

> 🔑 Get Pusher keys from your [Pusher Dashboard](https://dashboard.pusher.com)
> 🔑 Get Clerk keys from your [Clerk Dashboard](https://dashboard.clerk.dev)

---

## ▶️ Getting Started

```bash
npm install
npm run dev
```

Then visit: [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deployment

The easiest way to deploy is via [Vercel](https://vercel.com):

👉 [Deploy with Vercel](https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app-readme)

For more deployment options, check the [Next.js Deployment Guide](https://nextjs.org/docs/app/building-your-application/deploying)

---
