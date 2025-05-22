import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import MerchantAndLogin from "./MerchantAndLogin";
import { GetCookies } from "@/app/lib/cookiesSetting";
import { fetchingDataGet } from "@/app/lib/fetchingDataGet";

const TopBar = async () => {
  const token = await GetCookies({ name: "auth_token_font" });

  const topbarGradientColors = await fetchingDataGet(
    "/api/front/setting/header-setting"
  );
  const fetchData = await fetchingDataGet("/api/front/setting/header-setting");
  const logoIdentity = await fetchingDataGet("/api/front/setting/logo-identity");

  const logo = fetchData?.settings?.HeaderBanner;

  let userData = null;

  if (token) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      userData = response?.data?.data;
    } catch (error) {
      // console.log(error);
    }
  }
  return (
    <section
      className="h-auto  py-2"
      style={{
        background: `linear-gradient(to right, ${topbarGradientColors?.settings?.Color1}, ${topbarGradientColors?.settings?.Color2})`,
      }}
    >
      <div className=" container mx-auto justify-between items-center hidden lg:flex wide-laptop:flex small-laptop:flex">
        {/* large screens */}
        <div className="flex items-center justify-between w-full">
          <Link href="/" prefetch={false}>
            {logo ? (
              <Image
                src={logo}
                width="1000"
                height="100"
                alt="logo"
                className="w-auto h-14"
                priority
              />
            ) : (
              <div className="w-44 h-10 bg-gray-200 animate-pulse rounded-md"></div>
            )}
          </Link>

          <div className="flex items-center gap-3">

            {userData ? (
              <MerchantAndLogin user={userData?.user} password={userData?.password} authToken={token} adminUrl={logoIdentity?.settings?.adminUrl}/>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  prefetch={false}
                  className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded group bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300"
                >
                  <span className="relative px-5 py-2 transition-all ease-in duration-75 bg-white rounded group-hover:bg-transparent group-hover:text-white flex items-center gap-1">
                    Sign Up
                  </span>
                </Link>
                <Link
                  href="/auth/login"
                  prefetch={false}
                  className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded group bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300"
                >
                  <span className="relative px-5 py-2 transition-all ease-in duration-75 bg-white rounded group-hover:bg-transparent group-hover:text-white flex items-center gap-1">
                    Login
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopBar;
