"use client";
import { deleteCookies } from "@/app/lib/cookiesSetting";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

function MerchantAndLogin({ user, password, authToken, adminUrl }) {
  const [dropdownDefaultButton, setDropdownDefaultButton] = useState(false);
  const [storesUser, setStoresUser] = useState([]);
  const router = useRouter();
  const trigger = useRef(null);
  const dropdown = useRef(null);

  const [stores, setStores] = useState(null);
  const [storeLoading, setStoreLoading] = useState(true);

  useEffect(() => {
    const store = JSON.parse(localStorage.getItem("store"));
    if (store) {
      setStores(store);
    }
    setStoreLoading(false);
  }, []);

  const logOut = async () => {
    if (localStorage.getItem("secret_key")) {
      localStorage.removeItem("secret_key");
    }
    const deleteToken = await deleteCookies({ name: "auth_token_font" });
    if (deleteToken) {
      router.push("/");
      toast.success("Successfully Logged Out");
      window.location.reload(true);
    }
  };

  useEffect(() => {
    const handleClickOutsideOperator = (event) => {
      if (!event.target.closest("#setDropdownDefaultButton")) {
        setDropdownDefaultButton(false);
      }
    };
    window.document.addEventListener("click", handleClickOutsideOperator);

    return () => {
      window.document.removeEventListener("click", handleClickOutsideOperator);
    };
  }, []);
  const loginAdmin = async (user) => {
    const redirectUrl = `${adminUrl}/login?email=${user?.email}&password=${password}`;
    window.open(redirectUrl, "_blank");
  };
  // console.log(password);
  useEffect(() => {
    const getAllStore = async () => {
      if (!user?.id) return;
      let url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/get_webaddress/${user?.id}`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        localStorage.setItem(
          "storesUser",
          JSON.stringify(response?.data?.data)
        );
        setStoresUser(response?.data?.data);
      } catch (error) {
        console.error("Error fetching deposit methods:", error);
      }
    };
    getAllStore();
  }, [user]);

  return (
    <div className="min-w-[100px]">
      {authToken && user && (
        <div className="relative">
          {user && (
            <div
              ref={trigger}
              id="setDropdownDefaultButton"
              onClick={() => setDropdownDefaultButton(!dropdownDefaultButton)}
              className="relative inline-flex cursor-pointer items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded group bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              <span className="relative px-5 py-2 transition-all ease-in duration-75 bg-white rounded group-hover:bg-transparent group-hover:text-white flex items-center gap-1">
                {storeLoading ? (
                  <>
                    <div className="rounded-full w-6 h-6 bg-gray-300 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                  </>
                ) : (
                  <>
                    {stores ? (
                      ""
                    ) : user?.avatar == null || user?.avatar == undefined ? (
                      ""
                    ) : (
                      <Image
                        src={user?.avatar}
                        width={100}
                        height={100}
                        alt="avatar"
                        className="rounded-full w-6 h-6"
                        loading="lazy"
                      />
                    )}
                    {stores
                      ? stores?.business_name?.charAt(0).toUpperCase() +
                        stores?.business_name?.slice(1).toLowerCase()
                      : user &&
                        user?.name?.charAt(0).toUpperCase() +
                          user?.name?.slice(1).toLowerCase()}
                  </>
                )}
              </span>
            </div>
          )}

          {dropdownDefaultButton && (
            <div
              className=" bg-white divide-y divide-gray-100 rounded-lg shadow w-[200px] absolute button-0 right-0 "
              style={{ zIndex: "1000" }}
              ref={dropdown}
            >
              <ul
                className="text-sm text-gray-700 max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
                style={{ scrollbarWidth: "thin" }}
                aria-labelledby="dropdownDefaultButton"
              >
                <li className="border-b border-gray-300 rounded-t-lg">
                  <Link
                    href="/dashboard"
                    prefetch={false}
                    onClick={() => {
                      localStorage.removeItem("store");
                    }}
                    className="block px-4 py-2 hover:bg-[#4944E3] hover:text-white rounded-t-lg "
                  >
                    Dashboard
                  </Link>
                </li>
                {storesUser?.map((store) => (
                  <li key={store?.id} className="border-b border-gray-300">
                    <button
                      onClick={() => {
                        localStorage.setItem("store", JSON.stringify(store));
                        window.location.href = "/store";
                      }}
                      className="px-4 py-2 hover:bg-[#4944E3] hover:text-white cursor-pointer text-left w-full grid grid-cols-1 break-words"
                    >
                      {store?.business_name?.length > 18
                        ? store?.business_name
                            ?.slice(0, 18)
                            ?.charAt(0)
                            .toUpperCase() +
                          store?.business_name?.slice(1, 18)?.toLowerCase() +
                          "..."
                        : store?.business_name?.charAt(0).toUpperCase() +
                          store?.business_name?.slice(1).toLowerCase()}
                      <br />
                      {store?.web_address}
                    </button>
                  </li>
                ))}

                {user?.roles?.some((role) => role.name === "Admin") && (
                  <li className="border-b border-gray-300">
                    <h2
                      onClick={() => loginAdmin(user)}
                      className="block px-4 py-2 hover:bg-[#4944E3] hover:text-white cursor-pointer"
                    >
                      Admin
                    </h2>
                  </li>
                )}
                <li>
                  <Link
                    onClick={() => logOut()}
                    href="#"
                    prefetch={false}
                    className="block px-4 py-2 hover:bg-[#4944E3] hover:text-white rounded-b-lg"
                  >
                    Sign out
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MerchantAndLogin;
