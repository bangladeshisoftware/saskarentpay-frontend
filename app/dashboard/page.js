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
  const [storesUser, setStoresUser] = useState(null);
  const [storeLoading, setStoreLoading] = useState(true);

  useEffect(() => {
    const store = JSON.parse(localStorage.getItem("store"));
    if (store) {
      setStoresUser(store);
    }
    setStoreLoading(false);
  }, [])

  useEffect(() => {
    getallBalance();
  }, [storesUser]);

  const getallBalance = async () => {
    if (storeLoading) return;
    setLoading(true);
    const response = await ApiRequest({
      url: `/marchent_balance${storesUser?.api_id ? `/${storesUser?.api_id}` : ""}`,
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
      transaction: allbalance?.balance?.total_deposit_credit || 0.0,
      title: "Total Deposit Credit",
      color: "text-yellow-500",
      gridSize: "md:col-span-3",
      icon: MdArrowDownward,
      link: "/dashboard/cash-in",
    },
    {
      transaction: allbalance?.balance?.total_deposit_debit || 0.0,
      title: "Total Deposit Debit",
      color: "text-blue-500",
      gridSize: "md:col-span-3",
      icon: MdArrowUpward,
      link: "/dashboard/cash-in",
    },
    {
      transaction: allbalance?.balance?.total_payout_credit || 0.0,
      title: "Total Payout Credit",
      color: "text-purple-500",
      gridSize: "md:col-span-3",
      icon: MdTrendingUp,
      link: "/dashboard/payout",
    },
    {
      transaction: allbalance?.balance?.total_payout_debit || 0.0,
      title: "Total Payout Debit",
      color: "text-yellow-500",
      gridSize: "md:col-span-3",
      icon: MdTrendingDown,
      link: "/dashboard/payout",
    },
    {
      transaction: allbalance?.balance?.total_settlement_credit || 0.0,
      title: "Total Settlement Credit",
      color: "text-green-700",
      gridSize: "md:col-span-3",
      icon: MdAttachMoney,
      link: "/dashboard/settlement",
    },
    {
      transaction: allbalance?.balance?.total_settlement_debit || 0.0,
      title: "Total Settlement Debit",
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
  const adminBalanceItems = [
    {
      transaction: 0.0,
      title: "Total Balance",
      color: "text-blue-500",
      gridSize: "md:col-span-3 bg-gray-50",
      icon: MdAccountBalanceWallet,
    },
    {
      transaction: 0.0,
      title: "Total Merchant",
      color: "text-green-500",
      gridSize: "md:col-span-3",
      icon: MdCreditCard,
    },
    {
      transaction: 0.0,
      title: "Total Deposit",
      color: "text-yellow-500",
      gridSize: "md:col-span-3",
      icon: MdArrowDownward,
    },
    {
      transaction: 0.0,
      title: "Total Payout",
      color: "text-purple-500",
      gridSize: "md:col-span-3",
      icon: MdTrendingUp,
    },
    {
      transaction: 0.0,
      title: "Total Settlement",
      color: "text-green-700",
      gridSize: "md:col-span-3",
      icon: MdAttachMoney,
    },
  ];
  return (
    <section className="text-white shadow-md rounded border border-gray-200">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
          {storesUser?.api_id
            ? merchantBalanceItems?.map((item, index) => (
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
              ))
            : adminBalanceItems?.map((item, index) => (
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
