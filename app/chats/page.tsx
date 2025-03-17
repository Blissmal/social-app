import NoChatSelected from "@/components/chatComponents/NoChatSelected";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Chats | bls Socially`,
    description: `Stay connected with your friends and groups on bls Socially.`,
  };
}

const HomePage = () => {
  return <NoChatSelected />;
};

export default HomePage;
