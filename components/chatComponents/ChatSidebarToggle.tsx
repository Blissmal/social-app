"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

const SidebarToggle = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    document.getElementById("sidebar")?.classList.toggle("translate-x-0");
  };

  return (
    <>
      {/* Mobile Toggle Button (appears when sidebar is closed) */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden absolute top-3 left-[130px] z-50 p-2 bg-gray-800 text-white rounded-md focus:outline-none"
      >
        {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {/* Overlay when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default SidebarToggle;
