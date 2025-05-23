"use client";
import { useEffect, useState } from "react";

import DashboardCard from "./(dashboard_Component)/DashboardCard";
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


  useEffect(() => {
    getallBalance();
  }, []);

  const getallBalance = async () => {
    const response = await ApiRequest({
      url: `/marchent_balance`,
      method: "get",
    });
    if (response?.status == 200) {
      setAllbalance(response?.data);
    }
  };

  const adminBalanceItems = [
    {
      transaction: allbalance?.balance?.main_balance || 0.0,
      title: "Total Balance",
      color: "text-blue-500",
      gridSize: "md:col-span-3 bg-gray-50",
      icon: MdAccountBalanceWallet,
    },
    {
      transaction: allbalance?.total_store || 0.0,
      title: "Total Active Store",
      color: "text-green-500",
      gridSize: "md:col-span-3",
      icon: MdCreditCard,
    },
    {
      transaction: allbalance?.total_deposit_amount || 0.0,
      title: "Total Deposit Amount",
      color: "text-yellow-500",
      gridSize: "md:col-span-3",
      icon: MdArrowDownward,
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
      color: "text-blue-500",
      gridSize: "md:col-span-3",
      icon: MdArrowUpward,
      link: "/dashboard/cash-in",
    },
    {
      transaction: allbalance?.total_payout_fee || 0.0,
      title: "Total Payout Fee",
      color: "text-purple-500",
      gridSize: "md:col-span-3",
      icon: MdTrendingUp,
    },
    {
      transaction: allbalance?.total_settlement_amount || 0.0,
      title: "Total Settlement Amount",
      color: "text-green-700",
      gridSize: "md:col-span-3",
      icon: MdAttachMoney,
    },
    {
      transaction: allbalance?.total_settlement_fee || 0.0,
      title: "Total Settlement Fee",
      color: "text-green-700",
      gridSize: "md:col-span-3",
      icon: MdAttachMoney,
    },
  ];
  return (
    <section className="text-white shadow-md rounded border border-gray-200">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
          {adminBalanceItems?.map((item, index) => (
            <DashboardCard
              key={index}
              title={item.title}
              amount={item.transaction}
              color={item.color}
              gridSize={item.gridSize}
              loading={loading}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;
