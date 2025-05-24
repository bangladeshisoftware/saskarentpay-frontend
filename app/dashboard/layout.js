
import DashboardSideBer from "./(dashboard_Component)/DashboardSideBer";
import { GetCookies } from "@/app/lib/cookiesSetting";
import { redirect } from "next/navigation";
import { FaHandsHelping, FaUserCog } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";
import { MdBalance, MdDeveloperMode, MdSpaceDashboard } from "react-icons/md";
import { RiSecurePaymentFill } from "react-icons/ri";
import { TbWorldDown} from "react-icons/tb";

export default async function  LoginLayout({ children }) {
  const token = await GetCookies({ name: "auth_token_font" });

  if (!token) {
    redirect("/auth/login");
  }
  

  const menuItems = [
    {
      href: "/dashboard",
      icon: <MdSpaceDashboard className="mr-2 text-2xl" />,
      label: "Dashboard",
    },
    {
      href: "/dashboard/settlement",
      icon: <MdBalance className="mr-2 text-2xl" />,
      label: "Settlement",
    },
    {
      href: "/dashboard/developer",
      icon: <MdDeveloperMode className="mr-2 text-2xl" />,
      label: "All Stores",
    },
    {
      href: "/dashboard/support",
      icon: <FaHandsHelping className="mr-2 text-2xl" />,
      label: "Support",
    },
    {
      href: "/dashboard/reports",
      icon: <HiDocumentReport className="mr-2 text-2xl" />,
      label: "Reports",
    },
    {
      href: "/dashboard/profile",
      icon: <FaUserCog className="mr-2 text-2xl" />,
      label: "Profile",
    },
    {
      href: "/dashboard/allowed_ip",
      icon: <TbWorldDown className="mr-2 text-2xl" />,
      label: "Allowed IP",
    },
  ];

  return (
    <>
      <div className={` flex min-h-[88vh] container mx-auto`}>
        <DashboardSideBer menuItems={menuItems}/>
        <section className="w-full mt-5 lg:mt-10 overflow-hidden">
          <div className="px-1">{children}</div>
        </section>        
      </div>
    </>
  );
}
