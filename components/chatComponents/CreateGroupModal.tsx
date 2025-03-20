"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus } from "lucide-react";
import { createGroupChat } from "@/actions/chat.action";

const CreateGroupModal = ({ users }: { users: { id: string; username: string }[] }) => {
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [desc, setDesc] = useState("");

  const handleCreateGroup = async () => {
    if (!groupName || selectedUsers.length === 0) return;

    const success = await createGroupChat({
      name: groupName,
      userIds: selectedUsers,
      description: desc,
    });

    if (success) {
      setShowModal(false);
      setGroupName("");
      setSelectedUsers([]);
      window.location.reload();
    }
  };

  return (
    <>
      <div
        className="flex space-x-3 cursor-pointer p-3 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200"
        onClick={() => setShowModal(true)}
      >
        <Plus />
      </div>

      {showModal &&
        createPortal(
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Create Group</h2>
                <X className="cursor-pointer" onClick={() => setShowModal(false)} />
              </div>

              <input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full p-2 border rounded mb-3"
              />
              <input
                type="text"
                placeholder="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full p-2 border rounded mb-3"
              />

              <div className="mb-3">
                <h3 className="text-sm font-medium mb-1">Select Members:</h3>
                <div className="space-y-2">
                  {users.map((user) => (
                    <label key={user.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
                          }
                        }}
                      />
                      <span>{user.username}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="w-full bg-blue-500 text-white p-2 rounded" onClick={handleCreateGroup}>
                Create
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default CreateGroupModal;
