"use client";
import { useEffect, useState } from "react";

import DashboardCard from "../dashboard/(dashboard_Component)/DashboardCard";
import {
  MdAccountBalanceWallet,
  MdCreditCard,
  MdAttachMoney,
  MdArrowUpward,
  MdArrowDownward,
  MdTrendingUp,
  MdTrendingDown,
} from "react-icons/md";
import ApiRequest from "../lib/Api_request";
function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [allbalance, setAllbalance] = useState(null);
  const [storesUser, setStoresUser] = useState(null);
  const [storeLoading, setStoreLoading] = useState(true);

  useEffect(() => {
    const store = JSON.parse(localStorage.getItem("store"));
    if (store) {
      setStoresUser(store);
    }
    setStoreLoading(false);
  }, []);

  useEffect(() => {
    getallBalance();
  }, [storeLoading]);

  const getallBalance = async () => {
    if (storeLoading) return;
    setLoading(true);
    const response = await ApiRequest({
      url: `/marchent_balance${
        storesUser?.api_id ? `/${storesUser?.api_id}` : ""
      }`,
      method: "get",
    });
    if (response?.status == 200) {
      setLoading(false);
      setAllbalance(response?.data);
    }
  };
  const merchantBalanceItems = [
    {
      transaction: allbalance?.balance?.main_balance || 0.0,
      title: "Main Balance",
      color: "text-blue-500",
      gridSize: "md:col-span-3 bg-gray-50",
      icon: MdAccountBalanceWallet,
      link: "/dashboard",
    },
    {
      transaction: allbalance?.link_wallet || 0.0,
      title: "Total Received From Link",
      color: "text-green-500",
      gridSize: "md:col-span-3",
      icon: MdCreditCard,
      link: "/dashboard/payments",
    },
    {
      transaction: allbalance?.total_deposit_amount || 0.0,
      title: "Total Deposit Amount",
      color: "text-yellow-500",
      gridSize: "md:col-span-3",
      icon: MdArrowDownward,
      link: "/dashboard/cash-in",
    },
    {
      transaction: allbalance?.total_deposit_fee || 0.0,
      title: "Total Deposit Fee",
      color: "text-blue-500",
      gridSize: "md:col-span-3",
      icon: MdArrowUpward,
      link: "/dashboard/cash-in",
    },
    {
      transaction: allbalance?.total_payout_amount || 0.0,
      title: "Total Payout Amount",
      color: "text-purple-500",
      gridSize: "md:col-span-3",
      icon: MdTrendingUp,
      link: "/dashboard/payout",
    },
    {
      transaction: allbalance?.total_payout_fee || 0.0,
      title: "Total Payout Fee",
      color: "text-yellow-500",
      gridSize: "md:col-span-3",
      icon: MdTrendingDown,
      link: "/dashboard/payout",
    },
    {
      transaction: allbalance?.total_settlement_amount || 0.0,
      title: "Total Settlement Amount",
      color: "text-green-700",
      gridSize: "md:col-span-3",
      icon: MdAttachMoney,
      link: "/dashboard/settlement",
    },
    {
      transaction: allbalance?.total_settlement_fee || 0.0,
      title: "Total Settlement Fee",
      color: "text-purple-500",
      gridSize: "md:col-span-3",
      icon: MdCreditCard,
      link: "/dashboard/settlement",
    },
    {
      transaction: allbalance?.bkash_cashin || 0.0,
      title: "Bkash Deposit",
      color: "text-orange-500",
      gridSize: "md:col-span-3",
      icon: MdCreditCard,
      link: "/dashboard/cash-in",
    },
    {
      transaction: allbalance?.bkash_payout || 0.0,
      title: "Bkash Payout",
      color: "text-green-700",
      gridSize: "md:col-span-3",
      icon: MdAccountBalanceWallet,
      link: "/dashboard/payout",
    },
    {
      transaction: allbalance?.nagad_cashin || 0.0,
      title: "Nagad Deposit",
      color: "text-green-500",
      gridSize: "md:col-span-3",
      icon: MdCreditCard,
      link: "/dashboard/cash-in",
    },
    {
      transaction: allbalance?.nagad_payout || 0.0,
      title: "Nagad Payout",
      color: "text-orange-500",
      gridSize: "md:col-span-3",
      icon: MdAccountBalanceWallet,
      link: "/dashboard/payout",
    },
  ];
  return (
    <section className="text-white shadow-md rounded border border-gray-200">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
          {merchantBalanceItems?.map((item, index) => (
            <DashboardCard
              key={index}
              title={item.title}
              amount={item.transaction}
              color={item.color}
              gridSize={item.gridSize}
              loading={loading}
              icon={item.icon}
              link={item.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;
