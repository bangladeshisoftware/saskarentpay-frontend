"use client";
import { useState, useEffect } from "react";
import moment from "moment";
import ApiRequest from "@/app/lib/Api_request";


import DatePickers from "../../dashboard/(dashboard_Component)/DatePickers";
import InputFiled from "../../dashboard/(dashboard_Component)/InputFiled";
import FilterStatus from "../../dashboard/(dashboard_Component)/FilterStatus";
import Table from "../../dashboard/(dashboard_Component)/Table";
import TableFooter from "../../dashboard/(dashboard_Component)/TableFooter";
import SkeletonLoader from "../../dashboard/(dashboard_Component)/SkeletonLoader";



function page() {
  const headers = [
    "Sl",
    "Trans Date",
    "Category",
    "Particulars",
    "Type",
    "Amount",
    "Fee",
    "Before Balance",
    "After Balance",
  ];
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
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
  const [total, setTotal] = useState({ totalItems: 0, totalPage: 0 });
  const [loading, setLoading] = useState(false);
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [transactionCategories, setTransactionCategories] = useState([]);

  const [showTransactionTypes, setShowTransactionTypes] = useState(false);
  const [transactionType, setTransactionType] = useState("");

  const [showTransactionCategories, setShowTransactionCategories] =
    useState(false);
  const [transactionCategory, setTransactionCategory] = useState("");
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
    
    setLoading(true);
    getBalanceHistory();
  }, [currentPage,storesUser]);

  useEffect(() => {
    setCurrentPage(1);
    getBalanceHistory();
  }, [search, startEndDate, transactionCategory, transactionType]);
  
  const getBalanceHistory = async () => {
    if (storeLoading) return;
    try {
      const response = await ApiRequest({
        url: `/merchant/transaction-history${storesUser?.api_id ? `/${storesUser?.api_id}` : ""}?page=${currentPage}&per_page=${itemsPerPage}&search=${search}&end_date=${
          differenceInDays > 0 ? endDate : ""
        }&start_date=${
          differenceInDays > 0 ? startDate : ""
        }&transaction_type=${
          transactionType ? transactionType : ""
        }&transaction_category=${
          transactionCategory ? transactionCategory : ""
        }`,
        method: "get",
      });
      setTotal({
        totalItems: response?.total,
        totalPage: response?.last_page,
      });
      setTransactions(response?.data);
    } catch (error) {
      // setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    getTransactionTypes();
    getTransactionCategories();
  }, []);

  const getTransactionTypes = async () => {
    try {
      const response = await ApiRequest({
        url: `/merchant/transaction-type-list`,
        method: "get",
      });
      setTransactionTypes(response);
    } catch (error) {
      setLoading(false);
    }
  };
  const getTransactionCategories = async () => {
    try {
      const response = await ApiRequest({
        url: `merchant/transaction-category-list`,
        method: "get",
      });
      setTransactionCategories(response);
    } catch (error) {
      setLoading(false);
    }
  };
  const formatMessage = (message) => {
    if (typeof message !== "string") {
      return message;
    }

    const formattedMessage = message
      .replace(
        /(\b(?:Tk|Amount:)\s?\d+(\.\d{1,2})?\b)/g,
        '<strong class="text-green-500">$1</strong>'
      )
      .replace(/(TrxID\s\w+)/g, '<strong class="text-blue-500">$1</strong>')
      .replace(
        /(Send Money|Balance|Reference|Ref|Fee|OK|CANCEL|SEND|Deposit|Payout|Settlement|Admin)/g,
        '<span class="font-semibold">$1</span>'
      )
      .replace(
        /(The destination account is in a state which prohibits the execution of the transaction\.)/g,
        '<span class="text-red-500 font-semibold">⚠️ $1</span>'
      )
      .replace(
        /PayerAccount:\s(,|N\/A)?/g,
        'PayerAccount: <span class="text-gray-500">N/A</span>'
      );
    return (
      <div className="prose lg:prose-xl prose-gray">
        <p
          className="w-[300px] break-words whitespace-normal"
          dangerouslySetInnerHTML={{ __html: formattedMessage }}
        />
      </div>
    );
  };

  // Exam;
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickTargets = [
        { id: "setShowTransactionTypes", setter: setShowTransactionTypes },
        {
          id: "setShowTransactionCategories",
          setter: setShowTransactionCategories,
        },
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

  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <section className="bg-white shadow-md border border-gray-200 rounded">
      <div className="space-y-6">
        {/* <!-- Start coding here --> */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 px-6 pt-5">
          <div className="flex items-center w-full gap-3">
            <div className="w-full md:w-[300px]">
              <InputFiled
                value={search}
                onChange={setSearch}
                placeholder="Search Category, Amount "
              />
            </div>
            <FilterStatus
              showMerchantStatus={showTransactionTypes}
              setShowMerchantStatus={setShowTransactionTypes}
              setSearchMerchantStatus={setTransactionType}
              searchMerchantStatus={
                transactionType
                  ? transactionType?.charAt(0).toUpperCase() +
                    transactionType?.slice(1).toLowerCase()
                  : ""
              }
              id="setShowTransactionTypes"
              placeholderText="Type..."
            >
              {transactionTypes?.length > 0 ? (
                transactionTypes?.map((item, index) => (
                  <div
                    key={transactionTypes?.length + index}
                    className="px-2 py-2 lg:py-2 lg:px-3 text-black cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                    onClick={() => {
                      setTransactionType(item);
                      setShowTransactionTypes(false);
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
            <FilterStatus
              showMerchantStatus={showTransactionCategories}
              setShowMerchantStatus={setShowTransactionCategories}
              setSearchMerchantStatus={setTransactionCategory}
              searchMerchantStatus={
                transactionCategory
                  ? transactionCategory?.charAt(0).toUpperCase() +
                    transactionCategory?.slice(1).toLowerCase()
                  : ""
              }
              id="setShowTransactionCategories"
              placeholderText="Category..."
            >
              {transactionCategories?.length > 0 ? (
                transactionCategories?.map((item, index) => (
                  <div
                    key={transactionCategories?.length + index}
                    className="px-2 py-2 lg:py-2 lg:px-3 text-black cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                    onClick={() => {
                      setTransactionCategory(item);
                      setShowTransactionCategories(false);
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
            ? Array(10)
                ?.fill()
                ?.map((_, index) => (
                  <tr key={index} className="table_tr">
                    {[
                      { width: "w-8", height: "h-8" },
                      { width: "w-20", height: "h-8" },
                      { width: "w-28", height: "h-8" },
                      { width: "w-44", height: "h-8" },
                      { width: "w-16", height: "h-8" },
                      { width: "w-16", height: "h-8" },
                      { width: "w-16", height: "h-8" },
                      { width: "w-16", height: "h-8" },
                      { width: "w-16", height: "h-8" },
                    ].map((item, i) => (
                      <SkeletonLoader item={item} key={i} />
                    ))}
                  </tr>
                ))
            : Array.isArray(transactions) &&
              transactions?.map((transaction, index) => (
                <tr className="table_tr" key={transactions?.length + index}>
                  <td className="px-6 py-4 w-[50px]">
                  {total?.totalItems -
                      ((currentPage - 1) * itemsPerPage + index)}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {transaction?.created_at &&
                      moment(transaction?.created_at).format("DD MMM YYYY") }
                    <br/> 
                    {transaction?.created_at &&
                      moment(transaction?.created_at).format("HH:mm a") }
                  </td>
                  <td className="p-4 whitespace-nowrap w-[150px]">
                    {transaction?.type?.charAt(0).toUpperCase() +
                      transaction?.type?.slice(1).toLowerCase()}
                  </td>
                  <td className="p-4">
                    {transaction?.particulars &&
                      formatMessage(transaction?.particulars)}
                  </td>
                  <td className="p-4 whitespace-nowrap w-[150px]">
                    {transaction?.transaction_type?.charAt(0).toUpperCase() +
                      transaction?.transaction_type?.slice(1).toLowerCase()}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {transaction?.amount}
                  </td>
                  <td className="p-4 whitespace-nowrap">{transaction?.fee}</td>
                  <td className="p-4 whitespace-nowrap">
                    {transaction?.balance_before}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {transaction?.balance_after}
                  </td>
                </tr>
              ))}
        </Table>

        <TableFooter
          startIndex={startIndex}
          data={transactions}
          totalItems={total.totalItems || 0}
          currentPage={currentPage}
          totalPages={total.totalPage || 0}
          handlePageChange={setCurrentPage}
        />
      </div>
    </section>
  );
}

export default page;
