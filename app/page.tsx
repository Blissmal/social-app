import { getPosts } from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";
import Sidebar from "@/components/layout/Sidebar";
import CreatePost from "@/components/posts/CreatePost";
import PostCard from "@/components/posts/PostCard";
import WhoToFollow from "@/components/user/WhoToFollow";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  const posts = await getPosts();
  const dbUserId = await getDbUserId();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="hidden lg:block lg:col-span-3">
        <Sidebar />
      </div>
      <div className="lg:col-span-6">
        {user ? <CreatePost /> : null}
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} dbUserId={dbUserId} />
          ))}
        </div>
      </div>
      <div className="hidden lg:block lg:col-span-3 sticky top-20">
        <WhoToFollow />
      </div>
    </div>
  );
}
