"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import DatePickers from "../../dashboard/(dashboard_Component)/DatePickers";
import InputFiled from "../../dashboard/(dashboard_Component)/InputFiled";
import FilterStatus from "../../dashboard/(dashboard_Component)/FilterStatus";
import Table from "../../dashboard/(dashboard_Component)/Table";
import TableFooter from "../../dashboard/(dashboard_Component)/TableFooter";
import { TextCopy } from "../../dashboard/(dashboard_Component)/TextCopy";
import SkeletonLoader from "../../dashboard/(dashboard_Component)/SkeletonLoader";
import { GetCookies } from "@/app/lib/cookiesSetting";
import ApiRequest from "@/app/lib/Api_request";

function Payout() {
  const headers = [
    "Sl",
    "Date",
    "Customer Info",
    "Sender Info",
    "Payment Info",
    "Amount / Fee",
    "Trx / Ref ID",
    "Reason",
    "Status",
  ];
  const [transactionsData, setTransactionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ItemsPerPage, setItemsPerPage] = useState(10);
  const [total, setTotal] = useState({ totalItems: 0, totalPage: 0 });
  const [startEndDate, setStartEndDate] = useState({
    startDate: "",
    endDate: "",
  });
  const [CostumerMethod, setCostumerMethod] = useState("");
  const [showCostumerMethod, setShowCostumerMethod] = useState(false);
  const [costumerInfo, setCostumerInfo] = useState([]);
  const [cashInStatus, setCashInStatus] = useState("");
  const [showCashInStatus, setShowCashInStatus] = useState(false);
  const [cashInStatusList, setCashInStatusList] = useState([]);

  const startDate = moment(startEndDate?.startDate).format("YYYY-MM-DD");
  const endDate = moment(startEndDate?.endDate).format("YYYY-MM-DD");

  // difference day today and start date
  const date = new Date();
  const today = moment(date).format("YYYY-MM-DD");
  const startDates = moment(startDate);
  const todayDate = moment(today);
  const differenceInDays = todayDate.diff(startDates, "days");  
  const [storesUser, setStoresUser] = useState(null);
  const [storeLoading, setStoreLoading] = useState(true);

  useEffect(() => {
    const store = JSON.parse(localStorage.getItem("store"));
    if (store) {
      setStoresUser(store);
    }
    setStoreLoading(false);
  }, [])

  const fetchData = async () => {
    if (storeLoading) return;
    const token = await GetCookies({ name: "auth_token_font" });
    setLoading(true);
    if (token) {
      const response = await ApiRequest({
        url: `transactions${storesUser?.api_id ? `/${storesUser?.api_id}` : ""}?page=${currentPage}&per_page=${ItemsPerPage}&start_date=${
          differenceInDays > 0 ? startDate : ""
        }&end_date=${
          differenceInDays > 0 ? endDate : ""
        }&search=${searchData}&payment_method=${CostumerMethod}&status=${cashInStatus}`,
        method: "get",
      });
      if (response?.status == 200) {
        setTransactionsData(response?.data?.data);
        setTotal({
          totalItems: response?.data?.total,
          totalPage: response?.data?.last_page,
        });
        setLoading(false);
      } else {
        toast.error(response?.message);
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [currentPage,storesUser]);

  useEffect(() => {
    setCurrentPage(1);
    fetchData();
  }, [searchData, startEndDate, cashInStatus, CostumerMethod]);

  const startIndex = (currentPage - 1) * ItemsPerPage;

  const formatMessage = (message) => {
    if (typeof message !== "string") {
      return message;
    }
    const formattedMessage = message
      .replace(
        /(\bTk\s?\d+(\.\d{1,2})?\b)/g,
        '<strong class="text-green-500">$1</strong>'
      )
      .replace(/(TrxID\s\w+)/g, '<strong class="text-blue-500">$1</strong>')
      .replace(
        /(Send Money|Balance|Reference|Fee|OK|CANCEL|SEND)/g,
        '<span class="font-semibold">$1</span>'
      )
      .replace(
        /(The destination account is in a state which prohibits the execution of the transaction\.)/g,
        '<span class="text-red-500 font-semibold">⚠️ $1</span>'
      );

    return (
      <div className="prose lg:prose-xl prose-gray">
        <p
          dangerouslySetInnerHTML={{ __html: String(formattedMessage || "") }}
        />
      </div>
    );
  };

  useEffect(() => {
    handelGetMethod();
    handelGetStatus();
  }, []);
  const handelGetMethod = async () => {
    try {
      const response = await ApiRequest({
        url: "/merchant/payout-methods",
        method: "get",
      });
      setCostumerInfo(response);
    } catch (error) {
      // console.log(error);
    }
  };
  const handelGetStatus = async () => {
    try {
      const response = await ApiRequest({
        url: "/merchant/payout-statuses",
        method: "get",
      });
      setCashInStatusList(response);
    } catch (error) {
      // console.log(error);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickTargets = [
        { id: "setShowCostumerMethod", setter: setShowCostumerMethod },
        { id: "setShowCashInStatus", setter: setShowCashInStatus },
      ];

      clickTargets.forEach(({ id, setter }) => {
        if (!event.target.closest(`#${id}`)) {
          setter(false);
        }
      });
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <section className=" bg-white shadow-md border border-gray-200 rounded-md ml-0 ">
      <div className="space-y-6">
        <div className="w-full flex flex-col md:flex-row justify-between space-y-3 md:space-y-0 md:space-x-4 px-6 pt-5">
          <div className="flex items-center flex-wrap w-full gap-3">
            <div className="w-full md:w-[300px]">
              <InputFiled
                value={searchData}
                onChange={setSearchData}
                placeholder="Sender Number, Amount, Trx, Ref"
              />
            </div>
            <FilterStatus
              showMerchantStatus={showCostumerMethod}
              setShowMerchantStatus={setShowCostumerMethod}
              setSearchMerchantStatus={setCostumerMethod}
              searchMerchantStatus={
                CostumerMethod
                  ? CostumerMethod?.charAt(0).toUpperCase() +
                    CostumerMethod?.slice(1).toLowerCase()
                  : ""
              }
              id="setShowCostumerMethod"
              placeholderText="Payment Method..."
            >
              {costumerInfo?.length > 0 ? (
                costumerInfo?.map((item, index) => (
                  <div
                    key={index}
                    className="px-2 py-2 lg:py-2 lg:px-3 text-black cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                    onClick={() => {
                      setCostumerMethod(item);
                      setShowCostumerMethod(false);
                    }}
                  >
                    <span>
                      {item?.charAt(0).toUpperCase() +
                        item?.slice(1).toLowerCase()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-2 py-2 lg:py-2 lg:px-3 text-black cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between">
                  <span> No Data Available</span>
                </div>
              )}
            </FilterStatus>

            <FilterStatus
              showMerchantStatus={showCashInStatus}
              setShowMerchantStatus={setShowCashInStatus}
              setSearchMerchantStatus={setCashInStatus}
              searchMerchantStatus={
                cashInStatus
                  ? cashInStatus?.charAt(0).toUpperCase() +
                    cashInStatus?.slice(1).toLowerCase()
                  : ""
              }
              id="setShowCashInStatus"
              placeholderText="Status..."
            >
              {cashInStatusList?.length > 0 ? (
                cashInStatusList?.map((item, index) => (
                  <div
                    key={index}
                    className="px-2 py-2 lg:py-2 lg:px-3 text-black cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                    onClick={() => {
                      setCashInStatus(item);
                      setShowCashInStatus(false);
                    }}
                  >
                    <span>
                      {" "}
                      {item?.charAt(0).toUpperCase() +
                        item?.slice(1).toLowerCase()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-2 py-2 lg:py-2 lg:px-3 text-black cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between">
                  <span> No Data Available</span>
                </div>
              )}
            </FilterStatus>
          </div>
          <DatePickers
            setStartEndDate={setStartEndDate}
            startEndDate={startEndDate}
          />
        </div>

        <Table headers={headers} classCss="p-3">
          {loading
            ? [...Array(10)]?.map((_, index) => (
                <tr key={index} className="table_tr">
                  {[
                    { width: "w-8", height: "h-4" },
                    { width: "w-20", height: "h-4", extra: 1 },
                    { width: "w-32", height: "h-14" },
                    { width: "w-20", height: "h-6" },
                    { width: "w-20", height: "h-4", extra: 2 },
                    { width: "w-20", height: "h-4", extra: 1 },
                    { width: "w-20", height: "h-4", extra: 1 },
                    { width: "w-28", height: "h-14" },
                    { width: "w-14", height: "h-8" },
                  ].map((item, i) => (
                    <SkeletonLoader item={item} key={i} />
                  ))}
                </tr>
              ))
            : Array.isArray(transactionsData) &&
              transactionsData?.map((transaction, index) => (
                <tr className="table_tr" key={transaction.id}>
                  <td
                    scope="row"
                    className="px-6 py-3 w-[50px] whitespace-nowrap"
                  >
                    {total?.totalItems -
                      ((currentPage - 1) * ItemsPerPage + index)}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {transaction.created_at &&
                      moment(transaction.created_at).format("DD MMM YYYY")}{" "}
                    <br />
                    {transaction.created_at &&
                      moment(transaction.created_at).format("h:mm a")}
                  </td>
                  <td className="p-3">
                    {transaction?.customer_name && (
                      <div
                        onClick={() =>
                          setSearchData(transaction?.customer_name)
                        }
                        className="cursor-pointer flex items-center p-1 border border-gray-200 hover:bg-gray-100 rounded font-semibold w-[170px] break-words"
                      >
                        {transaction?.customer_name && (
                          <>{transaction?.customer_name}</>
                        )}
                        {transaction?.customer_phone && (
                          <>{transaction?.customer_phone}</>
                        )}
                        {transaction?.customer_email && (
                          <>{transaction?.customer_email}</>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-3  break-words w-[150px]">
                    {transaction.sender}
                  </td>
                  <td className="p-3  break-words w-[150px]">
                    {transaction.currency}
                    <br />
                    {transaction.payment_method?.charAt(0).toUpperCase() +
                      transaction?.payment_method?.slice(1).toLowerCase()}
                    <br />
                    {transaction.withdraw_number}
                  </td>
                  <td className="p-3">
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

                  <td className="p-3">
                    <TextCopy
                      text={transaction.trxID}
                      fontSize="text-semibold w-[130px]"
                      status="T : "
                    />
                    <TextCopy
                      text={transaction.reference}
                      fontSize="text-semibold w-[130px]"
                      status="R : "
                    />
                  </td>
                  <td className="p-3 w-[200px]">
                    {transaction?.failed_reason &&
                      formatMessage(transaction?.failed_reason)}
                  </td>
                  <td className="p-3 w-[100px]">
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
        {/* this is pagination */}

        {/* table footer code start  */}
        <TableFooter
          startIndex={startIndex}
          data={transactionsData}
          totalItems={total?.totalItems}
          currentPage={currentPage}
          totalPages={total?.totalPage}
          handlePageChange={setCurrentPage}
        />
        {/* table footer code end  */}
      </div>
    </section>
  );
}

export default Payout;
