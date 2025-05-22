"use client";
import { useState, useEffect, useRef } from "react";

import { MdDeleteForever, MdOutlineQrCodeScanner } from "react-icons/md";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";

import Image from "next/image";
import Link from "next/link";

import { FaCheck, FaLocationDot, FaPhoneVolume } from "react-icons/fa6";
import { PiClipboardFill } from "react-icons/pi";
import { FaSpinner } from "react-icons/fa";
import ButtonDashboard from "../../dashboard/(dashboard_Component)/ButtonDashboard";
import Table from "../../dashboard/(dashboard_Component)/Table";
import TableFooter from "../../dashboard/(dashboard_Component)/TableFooter";
import SkeletonLoader from "../../dashboard/(dashboard_Component)/SkeletonLoader";
import { QRCodeSVG } from "qrcode.react";
import useFetchingData from "@/app/lib/useFetchingData";
import ApiRequest from "@/app/lib/Api_request";
function PaymentCopy() {
  const mobileHeaders = ["Sl", "Link"];
  const desktopHeaders = ["Sl", "Link", "Copy Link", "QR Code", "Action"];
  const [headers, setHeaders] = useState(mobileHeaders);

  const [copied, setCopied] = useState("");
  const [deleteid, setDeleteid] = useState(null);
  const [LoadingDelete, setLoadingDelete] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [link, setLink] = useState([]);
  const [showQrCode, setShowQrCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [storesUser, setStoresUser] = useState(null);
  const [storeLoading, setStoreLoading] = useState(true);

  useEffect(() => {
    const store = JSON.parse(localStorage.getItem("store"));
    if (store) {
      setStoresUser(store);
    }
    setStoreLoading(false);
  }, []);
  // Add useEffect to handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setHeaders(window.innerWidth >= 640 ? desktopHeaders : mobileHeaders);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { fetchData: logo } = useFetchingData(
    "/api/front/setting/logo-identity"
  );

  useEffect(() => {
    getPayLink();
  }, [storesUser?.api_id]);

  const getPayLink = async () => {
    if (!storesUser?.api_id) return;
    setLoading(true);
    const response = await ApiRequest({
      url: `/v1/pay_with_link${storesUser?.api_id ? `/${storesUser?.api_id}` : ""}`,
      method: "get",
    });
    if (response?.status === 200) {
      if (Array.isArray(response?.data)) {
        setLink(response?.data);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const getNewLink = async () => {
    const response = await ApiRequest({
      url: "/v1/pay_with_link",
      formdata: { api_id: storesUser?.api_id },
    });
    if (response?.status === 200) {
      getPayLink();
    } else {
    }
  };

  const handleCopy = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setTimeout(() => setCopied(""), 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDeleteLink = async (id) => {
    setLoadingDelete(true);
    const response = await ApiRequest({
      url: "/v1/pay_with_link/" + id,
      method: "delete",
    });
    if (response?.status === 200) {
      getPayLink();
    } else {
    }
    setLoadingDelete(false);
    setDeleteModalOpen(false);
  };

  // Pagination logic
  const totalItems = link?.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleLink = link?.slice(startIndex, startIndex + itemsPerPage);

  const [payment, setPayment] = useState([]);
  

  useEffect(() => {
    getPaymentSetting();
  }, []);
  const getPaymentSetting = async () => {
    try {
      const response = await ApiRequest({
        url: "/merchant/payment-settings",
        method: "get",
      });
      setPayment(response[0]);
    } catch (error) {
      // console.log(error);
    }
  };

  const modalRef = useRef();

  const handlePrint = () => {
    // Add a class to hide everything except the modal during printing
    const originalBodyClass = document.body.className;
    document.body.className += " print-modal-only";

    window.print();
    // After printing, remove the print-specific class
    document.body.className = originalBodyClass;
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "p") {
        event.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <section className="bg-white shadow-md border border-gray-200 rounded">
      <div className="space-y-5">
        <div className="px-6 pt-6 flex items-center ">
          <ButtonDashboard onClick={getNewLink} title="New Link" />
        </div>

        <Table headers={headers}>
          {loading
            ? Array(5)
                ?.fill()
                ?.map((_, index) => (
                  <tr key={index} className="table_tr">
                    {[
                      { width: "w-6", height: "h-6" },
                      { width: "w-[400px]", height: "h-8" },
                      { width: "w-10", height: "h-4" },
                      { width: "w-10", height: "h-14" },
                      { width: "w-10", height: "h-6" },
                    ].map((item, i) => (
                      <SkeletonLoader item={item} key={i} />
                    ))}
                  </tr>
                ))
            : Array.isArray(visibleLink) &&
              visibleLink?.map((item, index) => (
                <tr key={index} className="table_tr">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap w-[50px]">
                    {link?.length - ((currentPage - 1) * itemsPerPage + index)}
                  </td>
                  <td className="p-4 font-medium text-gray-900 break-words whitespace-normal">
                    <Link
                      className="hover:underline text-blue-600 break-words"
                      target="_blank"
                      href={`${process.env.NEXT_PUBLIC_BASE_URL}/pay/${item?.link}`}
                      rel="noopener noreferrer"
                      prefetch={false}
                    >
                      {`${process.env.NEXT_PUBLIC_BASE_URL}/pay/${item?.link}`}
                    </Link>
                    {/* Mobile-only buttons */}
                    <div className="flex flex-col gap-2 sm:hidden mt-3">
                      <button
                        className={`text-white text-xl w-full cursor-pointer ${
                          copied === item?.link
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-blue-500"
                        } hover:bg-blue-800 font-medium rounded-[4px] px-2 py-1 flex items-center gap-1`}
                        onClick={() => {
                          setCopied(item?.link);
                          handleCopy(
                            process.env.NEXT_PUBLIC_BASE_URL +
                              "/pay/" +
                              item?.link
                          );
                        }}
                      >
                        {copied === item?.link ? (
                          <FaCheck />
                        ) : (
                          <PiClipboardFill />
                        )}
                      </button>

                      <button
                        onClick={() =>
                          setShowQrCode(
                            process.env.NEXT_PUBLIC_BASE_URL +
                              "/pay/" +
                              item?.link
                          )
                        }
                        className={`text-white text-xl w-full cursor-pointer bg-[#8080FF] hover:bg-[#5151f5] font-medium rounded px-2 py-1 flex items-center gap-1`}
                      >
                        <MdOutlineQrCodeScanner />{" "}
                        <span className="text-sm">QR Code</span>
                      </button>

                      <button
                        onClick={() => {
                          setDeleteid(item?.id);
                          setDeleteModalOpen(item?.id);
                        }}
                        className="text-white text-xl w-full cursor-pointer bg-red-500 hover:bg-red-800 font-medium rounded-[4px] px-2 py-1 flex items-center gap-1"
                      >
                        <RiDeleteBin2Fill />{" "}
                        <span className="text-sm">Delete</span>
                      </button>
                    </div>
                  </td>
                  {/* Desktop-only action columns */}
                  <td className="p-4 hidden sm:table-cell">
                    <div className="flex items-center gap-2 relative">
                      <button
                        className={`text-white cursor-pointer text-xl w-fit ${
                          copied === item?.link
                            ? "bg-green-500 hover:bg-green-500"
                            : "bg-blue-500"
                        } hover:bg-blue-800 font-medium rounded-[4px] px-2 py-1 flex items-center gap-1`}
                        onClick={() => {
                          setCopied(item?.link);
                          handleCopy(
                            process.env.NEXT_PUBLIC_BASE_URL +
                              "/pay/" +
                              item?.link
                          );
                        }}
                      >
                        {copied === item?.link ? (
                          <FaCheck />
                        ) : (
                          <PiClipboardFill />
                        )}
                      </button>
                    </div>
                  </td>

                  <td className="p-4 hidden sm:table-cell">
                    <div>
                      <button
                        onClick={() =>
                          setShowQrCode(
                            process.env.NEXT_PUBLIC_BASE_URL +
                              "/pay/" +
                              item?.link
                          )
                        }
                        className={`text-white cursor-pointer text-xl w-fit bg-[#8080FF] hover:bg-[#5151f5] font-medium rounded px-2 py-1 flex items-center gap-1`}
                      >
                        <MdOutlineQrCodeScanner />
                      </button>
                    </div>
                  </td>

                  <td className="p-4 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setDeleteid(item.id);
                          setDeleteModalOpen(true);
                        }}
                        className="text-white cursor-pointer text-xl w-fit bg-red-500 hover:bg-red-800 font-medium rounded-[4px] px-2 py-1 flex items-center gap-1"
                      >
                        <RiDeleteBin2Fill />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          {showQrCode && (
            <div
              id="popup-modal"
              className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black/30 px-2 overflow-y-auto"
            >
              <div className="relative w-full max-w-2xl my-8 sm:my-14">
                <div
                  className="bg-white relative rounded-lg shadow max-h-[90vh] overflow-y-auto"
                  ref={modalRef}
                >
                  <button
                    onClick={() => setShowQrCode("")}
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full text-2xl z-10"
                  >
                    <IoMdClose />
                  </button>

                  <div className="p-6 sm:p-12">
                    <div className="flex gap-4 flex-col sm:flex-row items-center justify-center">
                      <div className="w-[150px] md:w-[200px]">
                        <Image
                          width={500}
                          height={500}
                          src={
                            payment?.company_logo
                              ? payment?.company_logo
                              : "https://shop.raceya.fit/wp-content/uploads/2020/11/logo-placeholder.jpg"
                          }
                          alt="website logo"
                          className="rounded w-full"
                          loading="lazy"
                        />
                      </div>
                      <div className="w-full sm:w-[70%] space-y-2 flex flex-col items-center sm:items-start text-center sm:text-left">
                        <h3 className="text-2xl md:text-4xl font-bold text-black tracking-widest break-words">
                          {payment?.payment_title || "Gateway Name"}
                        </h3>
                        {payment?.mobile_number && (
                          <div className="flex items-center gap-2 text-lg">
                            <FaPhoneVolume className="text-blue-600 text-2xl" />
                            <p>{payment?.mobile_number}</p>
                          </div>
                        )}
                        {payment?.address && (
                          <div className="flex items-center gap-2 text-lg">
                            <FaLocationDot className="text-blue-600 text-2xl" />
                            <p className="break-words">{payment?.address}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="w-full flex flex-col items-center justify-center py-10">
                      <div className="w-[250px] h-[250px]">
                        <QRCodeSVG
                          value={showQrCode}
                          size={250}
                          level="H"
                          includeMargin={true}
                          imageSettings={{
                            src: logo?.settings?.faviconImage || "",
                            height: 40,
                            width: 40,
                            excavate: true,
                          }}
                          style={{ backgroundColor: "#f0f0f0" }}
                        />
                      </div>
                      <h2 className="mt-5 text-2xl md:text-3xl text-center">
                        Scan and pay with Link
                      </h2>
                    </div>

                    <div className="flex items-center justify-center">
                      <Link
                        href={showQrCode}
                        target="_blank"
                        prefetch={false}
                        className="text-white font-medium rounded-[4px] px-4 py-2 w-full mx-auto flex items-center justify-center gap-1"
                        style={{
                          background:
                            "linear-gradient(to right, #2D64EC, #BA83FC)",
                        }}
                      >
                        Pay Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {deleteModalOpen && (
            <div
              id="popup-modal"
              className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black/30"
            >
              <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow">
                  <div className="p-4 pr-10 md:p-5 text-center">
                    <div className="flex justify-center items-center text-[60px] text-red-600">
                      <MdDeleteForever />
                    </div>
                    <h3 className="mb-5 text-lg font-normal text-black">
                      Are you sure? <br /> you want to delete this Link
                    </h3>
                    {/* Add your modal content here */}
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleDeleteLink(deleteid)}
                        type="button"
                        className="text-white bg-red-500 hover:bg-red-600 focus:outline-none font-medium rounded-[4px] text-sm flex items-center justify-center gap-2 px-5 py-2.5 text-center"
                      >
                        {LoadingDelete ? (
                          <>
                            <FaSpinner className="animate-spin" /> Loading...
                          </>
                        ) : (
                          "Yes, I am sure"
                        )}
                      </button>
                      <button
                        onClick={() => setDeleteModalOpen(false)}
                        type="button"
                        className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-gray-50 rounded-[4px] border border-gray-200 hover:bg-gray-200  cursor-pointer"
                      >
                        No, cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Table>
        <TableFooter
          startIndex={startIndex}
          data={visibleLink}
          totalItems={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={setCurrentPage}
        />
      </div>
    </section>
  );
}

export default PaymentCopy;
