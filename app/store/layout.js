
import DashboardSideBer from "../dashboard/(dashboard_Component)/DashboardSideBer";
import { GetCookies } from "@/app/lib/cookiesSetting";
import { redirect } from "next/navigation";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { MdAccountBalance, MdAccountBalanceWallet, MdPayments, MdSpaceDashboard } from "react-icons/md";

export default async function  LoginLayout({ children }) {
  const token = await GetCookies({ name: "auth_token_font" });

  if (!token) {
    redirect("/auth/login");
  }
  

  const menuItemsStore = [
    {
      href: "/store",
      icon: <MdSpaceDashboard className="mr-2 text-2xl" />,
      label: "Dashboard",
    },
    {
      href: "/store/cash-in",
      icon: <MdAccountBalanceWallet className="mr-2 text-2xl" />,
      label: "Deposit",
    },
    {
      href: "/store/payout",
      icon: <FaMoneyCheckAlt className="mr-2 text-2xl" />,
      label: "Payout",
    },
    {
      href: "/store/payments",
      icon: <MdPayments className="mr-2 text-2xl" />,
      label: "Payments",
    },
    {
      href: "/store/statement",
      icon: <MdAccountBalance className="mr-2 text-2xl" />,
      label: "Statement Balance",
    },
  ];
  
  return (
    <>
      <div className={` flex min-h-[88vh] container mx-auto`}>
        <DashboardSideBer menuItems = {menuItemsStore}/>
        <section className="w-full mt-5 lg:mt-10 overflow-hidden">
          <div className="px-1">{children}</div>
        </section>        
      </div>
    </>
  );
}
