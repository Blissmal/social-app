This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

A Next.js-based social app with Clerk auth, post creation/deletion by owners, and profile customization (bio, website and name). Profile image can be customized on clerk's profile management. Includes a chat listing all users (excluding the auth user) with dynamic usernames for 1-on-1 and group chats available on the chat SideBar. 

## Highlights:

- 🚀 Tech stack: Next.js App Router, Postgres, Prisma, Clerk, TypeScript & pusherJs
- 💻 Server Components, Layouts, Route Handlers, Server Actions
- 🔥 loading.tsx, error.tsx, not-found.tsx
- 📡 API Integration using Route Handlers
- 🔄 Data Fetching, Caching & Revalidation
- 🎭 Client & Server Components
- 🛣️ Dynamic & Static Routes
- 🎨 Styling with Tailwind & Shadcn
- 🔒 Authentication & Authorization
- 📤 File Uploads with UploadThing
- 🗃️ Database Integration with Prisma
- 🚀 Server Actions & Forms
- ⚡ Optimistic Updates
- 💫 Realtime online status update using pusher
- ✨ Powered by Framer Motion 💫
- 🔗 Smart link previews with Open Graph metadata extraction and real-time updates
- 🐻 Bear necessities for state management in React (zustand)
- ↩️ React Swipe event handler hook for chat replies

### Setup .env file

```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_from_clerk
CLERK_SECRET_KEY=your_secret_key_from_clerk
DATABASE_URL=your_url_from_postgress_db
UPLOADTHING_TOKEN=your_uploadthing_token
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=your_pusher_cluster

NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
```

visit [pusher](https://pusher.com) and create new Channels App to get the pusher keys

### Run the app

```shell
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

