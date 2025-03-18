"use client";

import { useState, useEffect } from "react";
import { SearchIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface User {
  id: string;
  username: string;
  image: string;
}

export function SearchUserDialog() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search.length < 2) {
      setUsers([]);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/searchUsers?query=${search}`);
        const data = await res.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchUsers, 300);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-500">
          <SearchIcon className="size-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Search Users</AlertDialogTitle>
        </AlertDialogHeader>
        <Input
          type="text"
          placeholder="Enter username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="mt-2">
          {loading ? (
            <p className="text-center text-muted-foreground">
              <Loader2Icon className="size-5 animate-spin mx-auto" />
            </p>
          ) : users.length > 0 ? (
            <ul>
              {users.map((user) => (
                <li key={user.id} className="flex items-center gap-2 p-2 border-b">
                  <Link href={`/chats/${user.username}`} className="flex items-center gap-2 w-full hover:bg-gray-100 p-2 rounded-md">
                    <img src={user.image} alt={user.username} className="w-8 h-8 rounded-full" />
                    <span>{user.username}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            search.length > 1 && <p className="text-center text-muted-foreground">No users found.</p>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
