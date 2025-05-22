"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import moment from "moment";
import { GetCookies } from "@/app/lib/cookiesSetting";
import ApiRequest from "@/app/lib/Api_request";
import InputFiled from "../../dashboard/(dashboard_Component)/InputFiled";
import FilterStatus from "../../dashboard/(dashboard_Component)/FilterStatus";
import DatePickers from "../../dashboard/(dashboard_Component)/DatePickers";
import Table from "../../dashboard/(dashboard_Component)/Table";
import TableFooter from "../../dashboard/(dashboard_Component)/TableFooter";
import { TextCopy } from "../../dashboard/(dashboard_Component)/TextCopy";
import SkeletonLoader from "../../dashboard/(dashboard_Component)/SkeletonLoader";

function Transactions() {
  const headers = [
    "Sl",
    "Date",
    "Customer Info",
    "Sender Info",
    "Wallet Info",
    "Amount / Fee",
    "Trx / Ref ID",
    "Status",
  ];
  const [search, setSearch] = useState("");
  const [transactionsData, setTransactionsData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const [paymentType, setPaymentType] = useState("");
  const [showPaymentType, setShowPaymentType] = useState(false);

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
    const token = await GetCookies({ name: "auth_token_font" });
    if (storeLoading) return;
    if (token) {
      try {
        const response = await ApiRequest({
          url: `cash_in_history${storesUser?.api_id ? `/${storesUser?.api_id}` : ""}?start_date=${
            differenceInDays > 0 ? startDate : ""
          }&end_date=${
            differenceInDays > 0 ? endDate : ""
          }&search=${search}&cashin_type=${paymentType.toLowerCase()}&payment_method=${CostumerMethod}&transactionStatus=${cashInStatus}&page=${currentPage}&per_page=${ItemsPerPage}`,
          method: "get",
        });
        setTotal({
          totalItems: response?.data?.total,
          totalPage: response?.data?.last_page,
        });
        setTransactionsData(response?.data?.data);
      } catch (error) {
        toast.error(error?.message);
        setLoading(false);
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [currentPage,storesUser]);

  useEffect(() => {
    setCurrentPage(1);
    fetchData();
  }, [search, startEndDate, paymentType, CostumerMethod, cashInStatus]);
  const [showManualPaymentText, setShowManualPaymentText] = useState("");

  const handleShowManualPayment = (key, id) => {
    setShowManualPaymentText({
      key: key,
      id: id,
    });
  };
  const startIndex = (currentPage - 1) * ItemsPerPage;

  useEffect(() => {
    handelGetMethod();
  }, [paymentType]);

  const handelGetMethod = async () => {
    if (paymentType === "") {
      return;
    }
    try {
      const response = await ApiRequest({
        url: `/merchant/deposit-methods?cashin_type=${paymentType?.toLowerCase()}`,
        method: "get",
      });
      setCostumerInfo(response);
    } catch (error) {
      // console.log(error);
    }
  };
  useEffect(() => {
    handelGetStatus();
  }, []);
  const handelGetStatus = async () => {
    try {
      const response = await ApiRequest({
        url: "/merchant/deposit-statuses",
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
        { id: "setShowPaymentType", setter: setShowPaymentType },
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
    <section className="bg-white shadow-md border border-gray-200 rounded">
      <div className="space-y-6">
        {/* <!-- Start coding here --> */}
        <div className="w-full flex flex-col md:flex-row justify-between space-y-3 md:space-y-0 md:space-x-4 px-6 pt-5">
          <div className="flex items-center flex-wrap w-full gap-3">
            <div className="w-full md:w-[300px]">
              <InputFiled
                value={search}
                onChange={setSearch}
                placeholder="Sender Number, Amount Trx, Ref ID"
              />
            </div>
            <FilterStatus
              showMerchantStatus={showPaymentType}
              setShowMerchantStatus={setShowPaymentType}
              setSearchMerchantStatus={setPaymentType}
              searchMerchantStatus={paymentType ? paymentType : ""}
              id="setShowPaymentType"
              placeholderText="Payment Type..."
            >
              {["P2C", "P2P", "Manual"]?.map((item, index) => (
                <div
                  key={index}
                  className="px-2 py-2 lg:py-2 lg:px-3 text-black cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                  onClick={() => {
                    setPaymentType(item);
                    setShowPaymentType(false);
                    setCostumerInfo([]);
                    setCostumerMethod("");
                  }}
                >
                  <span>{item}</span>
                </div>
              ))}
            </FilterStatus>
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

        <Table headers={headers}>
          {loading
            ? Array.from({ length: 10 })?.map((_, index) => (
                <tr key={index} className="table_tr">
                  {[
                    { width: "w-8", height: "h-4" },
                    { width: "w-20", height: "h-4", extra: 1 },
                    { width: "w-32", height: "h-14" },
                    { width: "w-20", height: "h-6" },
                    { width: "w-20", height: "h-4", extra: 2 },
                    { width: "w-20", height: "h-4", extra: 1 },
                    { width: "w-20", height: "h-4", extra: 1 },
                    { width: "w-14", height: "h-8" },
                  ].map((item, i) => (
                    <SkeletonLoader item={item} key={i}/>
                  ))}
                </tr>
              ))
            : Array.isArray(transactionsData) &&
              transactionsData?.map((transaction, index) => (
                <tr className="table_tr" key={transaction.id}>
                  <th
                    scope="row"
                    className="px-6 py-4 whitespace-nowrap font-normal text-left w-[50px]"
                  >
                    {total?.totalItems -
                      ((currentPage - 1) * ItemsPerPage + index)}
                  </th>
                  <td className="p-4 w-[150px]">
                    {transaction?.created_at
                      ? moment(transaction?.created_at).format("DD MMM YYYY")
                      : "--"}{" "}
                    <br />
                    {transaction?.created_at
                      ? moment(transaction?.created_at).format("h:mm a")
                      : "--"}
                  </td>
                  <td className="p-4">
                    {transaction?.customer_name && (
                      <div
                        onClick={() => setSearch(transaction?.customer_name)}
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
                  <td className="p-4  break-words w-[150px]">
                    {transaction?.customerMsisdn
                      ? transaction?.customerMsisdn
                      : transaction?.payment_method?.includes("manual") &&
                        transaction?.manual?.payment_fields
                      ? (() => {
                          let paymentFields = {};
                          try {
                            paymentFields =
                              typeof transaction?.manual?.payment_fields ===
                              "string"
                                ? JSON.parse(transaction?.manual?.payment_fields)
                                : transaction?.manual?.payment_fields;
                          } catch (error) {
                            /* console.error(
                            'Error parsing payment_fields:',
                            error
                          ); */
                          }

                          return (
                            <>
                              {Object.entries(paymentFields)?.map(
                                ([key, value], index) => (
                                  <p
                                    key={index}
                                    onClick={() =>
                                      handleShowManualPayment(
                                        key,
                                        transaction?.id
                                      )
                                    }
                                  >
                                    {showManualPaymentText?.key === key &&
                                    showManualPaymentText?.id ===
                                      transaction?.id ? (
                                      <>
                                        {key} : {value}{" "}
                                      </>
                                    ) : (
                                      <>
                                        {" "}
                                        {key?.length > 7
                                          ? key?.slice(0, 7)
                                          : key}{" "}
                                        :{" "}
                                        {value?.length > 15
                                          ? value?.slice(0, 15) + "..."
                                          : value}{" "}
                                      </>
                                    )}
                                  </p>
                                )
                              )}
                            </>
                          );
                        })()
                      : ""}
                  </td>
                  <td className="p-4 break-words w-[150px]">
                    {transaction?.currency && (
                      <>
                        {transaction?.currency} <br />
                      </>
                    )}
                    {transaction?.payment_method_type && (
                      <>
                        {["p2p", "p2c"].includes(
                          transaction?.payment_method_type?.toLowerCase()
                        )
                          ? transaction?.payment_method_type?.toUpperCase()
                          : transaction?.payment_method_type?.toLowerCase() ===
                            "auto"
                          ? "P2C"
                          : transaction?.payment_method_type
                              ?.charAt(0)
                              .toUpperCase() +
                            transaction?.payment_method_type
                              ?.slice(1)
                              .toLowerCase()}
                        <br />
                      </>
                    )}
                    {transaction?.payment_method && (
                      <>
                        {transaction?.payment_method?.charAt(0).toUpperCase() +
                          transaction?.payment_method
                            ?.slice(1)
                            .toLowerCase()}{" "}
                        <br />
                      </>
                    )}
                    {transaction?.merchant_number && (
                      <>{transaction?.merchant_number}</>
                    )}
                  </td>
                  <td className="p-4 whitespace-nowrap">
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
                  <td className="p-4 whitespace-nowrap">
                    <TextCopy
                      text={transaction?.trxID}
                      fontSize="font-semibold w-[150px]"
                      status="T : "
                    />
                    <TextCopy
                      text={transaction?.reference}
                      fontSize="w-[150px]"
                      status="R : "
                    />
                  </td>
                  <td className="p-4 w-[100px]">
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
                        }[transaction?.transactionStatus] ||
                        "bg-gray-200 hover:bg-gray-300 text-gray-800 "
                      }`}
                    >
                      {transaction?.transactionStatus}
                    </div>
                  </td>
                </tr>
              ))}
        </Table>

        <TableFooter
          startIndex={startIndex}
          data={transactionsData}
          totalItems={total?.totalItems}
          currentPage={currentPage}
          totalPages={total?.totalPage}
          handlePageChange={setCurrentPage}
        />
      </div>
    </section>
  );
}

export default Transactions;
