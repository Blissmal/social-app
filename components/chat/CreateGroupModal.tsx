"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus } from "lucide-react";
import { createGroupChat } from "@/actions/chat.action";

const CreateGroupModal = ({
  users,
}: {
  users: { id: string; username: string }[];
}) => {
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl w-96 shadow-xl border border-gray-300 dark:border-gray-700">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Create Group
                </h2>
                <X
                  className="cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  onClick={() => setShowModal(false)}
                />
              </div>

              {/* Inputs */}
              <input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all mb-3"
              />
              <input
                type="text"
                placeholder="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all mb-3"
              />

              {/* Member Selection */}
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Members:
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {users.map((user) => (
                    <label
                      key={user.id}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(
                              selectedUsers.filter((id) => id !== user.id)
                            );
                          }
                        }}
                        className="form-checkbox h-4 w-4 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-gray-900 dark:text-gray-100">
                        {user.username}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Create Button */}
              <button
                className="w-full bg-blue-500 text-white p-3 rounded-lg font-medium hover:bg-blue-600 transition-all"
                onClick={handleCreateGroup}
              >
                Create Group
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default CreateGroupModal;
