"use client";
import { GetCookies } from "@/app/lib/cookiesSetting";
import { FaPlus, FaRegRegistered } from "react-icons/fa6";
import { useState } from "react";
import { toast } from "react-toastify";
import { DrawerDialogDemo } from "./DrawerDialogDemo";

const BecomeMerchant = ({ user }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenDrawer = async (e) => {
    e.preventDefault();

    const token = await GetCookies({ name: "auth_token_font" });
    if (!token) {
      toast.error("Please Login First, To Become Store");
    } else {
      setIsDrawerOpen(true);
    }
  };

  return (
    <>
      <button onClick={handleOpenDrawer} className="cursor-pointer">
        <div className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded group bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300">
          <span className="relative px-5 py-2 transition-all ease-in duration-75 bg-white rounded group-hover:bg-transparent group-hover:text-white flex items-center gap-1">
            <FaRegRegistered className="w-4 h-4 text-lg" />
            New Store Create
          </span>
        </div>
      </button>

      {/* Drawer Dialog */}
      {isDrawerOpen && (
        <DrawerDialogDemo open={isDrawerOpen} setOpen={setIsDrawerOpen} />
      )}
    </>
  );
};

export default BecomeMerchant;
