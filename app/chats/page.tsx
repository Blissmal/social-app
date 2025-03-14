"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Image } from "lucide-react";

const ChatUI = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello!", sender: "me" },
    { id: 2, text: "Hey there!", sender: "other" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), text: newMessage, sender: "me" }]);
    setNewMessage("");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 hidden md:block">
        <h2 className="text-xl text-black font-bold">Chats</h2>
        <ul className="mt-4 space-y-2">
          <li className="p-2 bg-white rounded-lg shadow">User 1</li>
          <li className="p-2 bg-white rounded-lg shadow">User 2</li>
        </ul>
      </div>

      {/* Chat Window */}
      <div className="flex flex-col flex-1 p-4">
        <h1>USER INFO SECTION OF THE PAGE</h1>
        <ScrollArea className="flex-1 overflow-y-auto border rounded-lg p-4 bg-gray-50">
          {messages.map((msg) => (
            <Card key={msg.id} className={`mb-2 w-fit ${msg.sender === "me" ? "ml-auto" : ""}`}>
              <CardContent className="p-2">{msg.text}</CardContent>
            </Card>
          ))}
        </ScrollArea>

        {/* Input Area */}
        <div className="flex items-center gap-2 mt-4">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button variant="ghost">
            <Image size={24} />
          </Button>
          <Button onClick={sendMessage}>
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
