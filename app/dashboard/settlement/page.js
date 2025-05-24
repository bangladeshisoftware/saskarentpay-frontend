"use client";
import { useState, useEffect } from "react";

import moment from "moment";
import Table from "../(dashboard_Component)/Table";
import SettlementTransactions from "./SettlementTransactions";
import ButtonDashboard from "../(dashboard_Component)/ButtonDashboard";
import TableFooter from "../(dashboard_Component)/TableFooter";
import DatePickers from "../(dashboard_Component)/DatePickers";
import InputFiled from "../(dashboard_Component)/InputFiled";
import ApiRequest from "@/app/lib/Api_request";
import SkeletonLoader from "../(dashboard_Component)/SkeletonLoader";
import FilterStatus from "../(dashboard_Component)/FilterStatus";

function Wtransactions() {
  const headers = [
    "Sl",
    "Date",
    "Store",
    "Settlement Info",
    "Payment Info",
    "Amount / Fee",
    "Reason",
    "Status",
  ];
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setlooding] = useState(false);

  const [startEndDate, setStartEndDate] = useState({
    startDate: "",
    endDate: "",
  });
  const startDate = moment(startEndDate?.startDate).format("YYYY-MM-DD");
  const endDate = moment(startEndDate?.endDate).format("YYYY-MM-DD");

  // difference day today and start date
  const date = new Date();
  const today = moment(date).format("YYYY-MM-DD");
  const startDates = moment(startDate);
  const todayDate = moment(today);
  const differenceInDays = todayDate.diff(startDates, "days");

  const [transactions, setTransactions] = useState([]);
  const [mainBalance, setMainBalance] = useState(0);
  const [total, setTotal] = useState({ totalItems: 0, totalPage: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [allStore, setAllStore] = useState([]);
  const [showStores, setShowStores] = useState(false);
  const [store, setStore] = useState(null);

  useEffect(() => {
    const storeUser = JSON.parse(localStorage.getItem("storesUser"));
    if (storeUser) {
      setAllStore(storeUser);
    }
  }, []);

  useEffect(() => {
    setlooding(true);
    getWithdrw();
  }, [currentPage]);

  const getWithdrw = async () => {
    const response = await ApiRequest({
      url: `withdraw_history${
        store?.api_id ? `/${store?.api_id}` : ""
      }?page=${currentPage}&per_page=${itemsPerPage}&search=${search}&end_date=${
        differenceInDays > 0 ? endDate : ""
      }&start_date=${differenceInDays > 0 ? startDate : ""}`,
      method: "get",
    });
    if (response?.status === 200) {
      setTotal({
        totalItems: response?.data?.total,
        totalPage: response?.data?.last_page,
      });
      setTransactions(response?.data?.data);
      setlooding(false);
    } else {
      setlooding(false);
    }
  };
  useEffect(() => {
    setCurrentPage(1);
    getWithdrw();
  }, [search, startEndDate, store]);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const getMainBalance = async () => {
    try {
      const response = await ApiRequest({
        url: `/merchant/balance`,
        method: "get",
      });
      setMainBalance(response);
    } catch (error) {
      toast.error(error?.message);
    }
  };
  useEffect(() => {
    getMainBalance();
  }, []);

  useEffect(() => {
    const handleClick = (event) => {
      const clickTargets = [{ id: "setShowStores", setter: setShowStores }];
      clickTargets.forEach(({ id, setter }) => {
        if (!event.target.closest(`#${id}`)) {
          setter(false);
        }
      });
    };
    window.document.addEventListener("click", handleClick);

    return () => {
      window.document.removeEventListener("click", handleClick);
    };
  }, []);

  const totalPendingList = transactions?.filter(
    (transaction) => transaction?.status === "Pending"
  );
  return (
    <section className="bg-white shadow-md border border-gray-200 rounded-md ml-0  ">
      <div className="space-y-6">
        <div className="relative flex flex-wrap justify-between gap-3 px-6 pt-5 xl:flex-row xl:space-y-0 xl:space-x-4 ">
          <div className="flex items-center flex-wrap w-full md:w-fit gap-3">
            <div className="w-full md:w-[300px]">
              <InputFiled
                value={search}
                onChange={setSearch}
                placeholder="Search Number, Method, Currency"
              />
            </div>

            <FilterStatus
              showMerchantStatus={showStores}
              setShowMerchantStatus={setShowStores}
              setSearchMerchantStatus={setStore}
              searchMerchantStatus={
                store?.business_name
                  ? store.business_name.length > 15
                    ? store.business_name.charAt(0).toUpperCase() +
                      store.business_name.slice(1, 15).toLowerCase() +
                      "..."
                    : store.business_name.charAt(0).toUpperCase() +
                      store.business_name.slice(1).toLowerCase()
                  : ""
              }
              id="setShowStores"
              placeholderText="All Stores..."
              cssClass="w-full"
            >
              {allStore?.map((item, index) => (
                <div
                  key={index}
                  className="px-2 py-2 lg:py-2 lg:px-3 text-black cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                  onClick={() => {
                    setStore(item);
                    setShowStores(false);
                  }}
                >
                  <span>
                    {" "}
                    {item?.business_name?.charAt(0)?.toUpperCase() +
                      item?.business_name?.slice(1)?.toLowerCase()}
                  </span>
                </div>
              ))}
            </FilterStatus>
            <ButtonDashboard
              open={showModal}
              onClick={setShowModal}
              title="Settlement"
            />
            {showModal && (
              <SettlementTransactions
                showModal={showModal}
                setShowModal={setShowModal}
                getMainBalance={getMainBalance}
                getWithdrw={getWithdrw}
                mainBalance={mainBalance}
                totalPendingList={totalPendingList}
              />
            )}
          </div>
          <DatePickers
            setStartEndDate={setStartEndDate}
            startEndDate={startEndDate}
          />
        </div>
        <Table headers={headers}>
          {loading
            ? Array(5)
                ?.fill()
                ?.map((_, index) => (
                  <tr key={index} className="table_tr">
                    {[
                      { width: "w-8", height: "h-4" },
                      { width: "w-20", height: "h-4", extra: 1 },
                      // { width: "w-32", height: "h-14" },
                      { width: "w-20", height: "h-6" },
                      { width: "w-20", height: "h-6" },
                      { width: "w-20", height: "h-4", extra: 2 },
                      { width: "w-20", height: "h-4", extra: 1 },
                      { width: "w-28", height: "h-14" },
                      { width: "w-14", height: "h-8" },
                    ].map((item, i) => (
                      <SkeletonLoader item={item} key={i} />
                    ))}
                  </tr>
                ))
            : Array.isArray(transactions) &&
              transactions?.map((transaction, index) => (
                <tr key={transactions?.length + index} className="table_tr">
                  <td scope="row" className="px-6 py-4 text-left">
                    {total?.totalItems -
                      ((currentPage - 1) * itemsPerPage + index)}
                  </td>
                  <td className="p-4">
                    {transaction?.created_at
                      ? moment(transaction?.created_at).format("DD MMM YYYY")
                      : "--"}{" "}
                    <br />
                    {transaction?.created_at
                      ? moment(transaction?.created_at).format("h:mm a")
                      : "--"}
                  </td>
                  {/* <td>
                    {transaction?.users && (
                      <div className="cursor-pointer items-center p-1 border border-gray-200 hover:bg-gray-100 rounded font-semibold w-[170px] break-words">
                        {transaction?.users?.name && (
                          <h1>{transaction?.users?.name}</h1>
                        )}
                        {transaction?.users?.phone && (
                          <h1>{transaction?.users?.phone}</h1>
                        )}
                      </div>
                    )}
                  </td> */}
                  <td className="p-4">
                    {transaction?.api_key?.merchants?.business_name && (
                      <>{transaction?.api_key?.merchants?.business_name}</>
                    )}
                  </td>
                  <td className="p-4">{transaction?.number}</td>
                  <td className="p-4">
                    {transaction?.currency} <br />{" "}
                    {transaction?.method?.charAt(0).toUpperCase() +
                      transaction?.method?.slice(1).toLowerCase()}
                  </td>
                  <td className="p-4">
                    <span className="text-blue-500">
                      {transaction?.amount &&
                        Number(transaction?.amount)?.toLocaleString("en-US")}
                    </span>
                    <br />
                    <span className="text-green-500">
                      {transaction?.fee !== "0.00" &&
                        Number(transaction?.fee)?.toLocaleString("en-US")}
                    </span>
                  </td>
                  <td className="p-4">
                    {transaction?.note ? transaction?.note : ""}
                  </td>
                  <td className="p-4">
                    <div
                      className={`px-2 py-0.5 rounded flex items-center cursor-pointer transition-colors duration-200 gap-2 w-fit ${
                        {
                          Success:
                            "bg-green-700 hover:bg-green-800 text-white ",
                          Pending:
                            "bg-[#ff7654] hover:bg-[#da5737] text-white ",
                          Failed: "bg-red-600 hover:bg-red-800 text-white ",
                          Rejected:
                            "bg-[#ff1d1d] hover:bg-[#d63737] text-white ",
                        }[transaction?.status] ||
                        "bg-gray-200 hover:bg-gray-300 text-gray-800 "
                      }`}
                    >
                      {transaction?.status}
                    </div>
                  </td>
                </tr>
              ))}
        </Table>
        {/* showing page number & table */}
        <TableFooter
          startIndex={startIndex}
          data={transactions}
          totalItems={total?.totalItems}
          currentPage={currentPage}
          totalPages={total?.totalPage}
          handlePageChange={setCurrentPage}
        />
      </div>
    </section>
  );
}

export default Wtransactions;
