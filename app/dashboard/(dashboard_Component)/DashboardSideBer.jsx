"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import useFetchingData from "@/app/lib/useFetchingData";

function DashboardSideBer({menuItems}) {
  const [scrollDirection, setScrollDirection] = useState("up");
  const token = Cookies.get("auth_token_font");
  const [storesUser, setStoresUser] = useState(null);

  const pathname = usePathname();


  const [isGradient, setIsGradient] = useState(false);
  const { fetchData } = useFetchingData("/api/front/setting/color-setting");

  const [color1, setColor1] = useState("");
  const [color2, setColor2] = useState("");

  // set gradient colors from settings
  useEffect(() => {
    if (fetchData?.settings?.GradientColor1 && fetchData?.settings?.GradientColor2) {
      setColor1(fetchData.settings.GradientColor1);
      setColor2(fetchData.settings.GradientColor2);
      setIsGradient(true);
    } else {
      setColor1("");
      setColor2("");
      setIsGradient(false);
    }
  }, [fetchData]);

  // get store info from localStorage
  useEffect(() => {
    // use requestIdleCallback if available to reduce load blocking
    const loadStore = () => {
      try {
        const store = JSON.parse(localStorage.getItem("store"));
        if (store) setStoresUser(store);
      } catch (err) {
        console.error("Invalid store data in localStorage");
      }
    };
  
    if ("requestIdleCallback" in window) {
      requestIdleCallback(loadStore);
    } else {
      setTimeout(loadStore, 0);
    }
  }, []);
  

  // detect scroll direction
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection("up");
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`hidden lg:block lg:w-[300px] mr-5 mt-10 rounded-md ${
        isGradient ? "text-gray-200" : "text-gray-800"
      }`}
      style={{
        background: isGradient
          ? `linear-gradient(to bottom, ${color1 || "#3b82f6"}, ${color2 || "#9333ea"})`
          : "#ffffff",
      }}
    >
      <aside className="px-4 mt-5">
        <ul>
          {menuItems?.map((item) => (
            <MenuItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname === item.href}
            />
          ))}
        </ul>
      </aside>
    </div>
  );
}

function MenuItem({ href, icon, label, active }) {
  return (
    <li
      className={`mb-4 cursor-pointer flex items-center rounded-md transition-transform duration-200 ${
        active
          ? "bg-gradient-to-r from-blue-600 to-purple-400"
          : "hover:bg-gradient-to-r from-blue-600 to-purple-400"
      }`}
    >
      <Link
        href={href}
        className="flex items-center p-2 w-full"
        prefetch={false}
      >
        {icon}
        <span className="ml-2 text-sm font-medium">{label}</span>
      </Link>
    </li>
  );
}

export default DashboardSideBer;
