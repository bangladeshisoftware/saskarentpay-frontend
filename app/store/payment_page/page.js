"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import InputFiledLabel from "../../dashboard/(dashboard_Component)/InputFiledLabel";
import { FaSpinner } from "react-icons/fa6";
import { GetCookies } from "@/app/lib/cookiesSetting";

function PaymentPage() {
  const [paymentTitle, setPaymentTitle] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyLogoLink, setCompanyLogoLink] = useState("");
  const [companyImages, setCompanyImages] = useState(null);
  const [support, setSupport] = useState("");
  const [faq, setFaq] = useState("");
  const [gift, setGift] = useState("");
  const [loginLink, setLoginLink] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [agentToggle, setAgentToggle] = useState("");
  const [autoToggle, setAutoToggle] = useState("");
  const [data, setData] = useState([]);
  const [manualToggle, setManualToggle] = useState("");

  const imageRef = React.createRef();

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
  useEffect(() => {
    getPaymentSettings();
  }, [storeLoading]);
  const getPaymentSettings = async () => {
    if (!storesUser?.api_id) return;
    const token = await GetCookies({ name: "auth_token_font" });
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/merchant/payment-settings/${storesUser?.api_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response?.data[0];

      setData(data);
      setPaymentTitle(data?.payment_title);
      setSupport(data?.support);
      setFaq(data?.faq);
      setGift(data?.gift);
      setLoginLink(data?.login_link);
      setCompanyLogoLink(data?.company_logo);
      setMobileNumber(data?.mobile_number);
      setAddress(data?.address);
      setAgentToggle(data?.manual_payment_active);
      setAutoToggle(data?.auto_payment_active);
      setManualToggle(String(data?.p2p_payment_active) || "0");
    } catch (error) {
      // console.error(error);
    }
  };

  const handlePaymentSetting = async () => {
    const formData = new FormData();
    formData.append("payment_title", paymentTitle ? paymentTitle : "");
    if (companyImages) {
      formData.append("company_logo", companyImages);
    }
    formData.append("support", support ? support : "");
    formData.append("faq", faq ? faq : "");
    formData.append("gift", gift ? gift : "");
    formData.append("login_link", loginLink ? loginLink : "");
    formData.append("mobile_number", mobileNumber ? mobileNumber : "");
    formData.append("address", address ? address : "");

    if (!data?.id) {
      formData.append("key_id", storesUser?.api_id);
    }
    if (data?.id) {
      formData.append("_method", "PUT");
    }
    setLoading(true);
    let token = await GetCookies({ name: "auth_token_font" });
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/merchant/payment-settings${
          data?.id ? `/${data?.id}` : ""
        }`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      getPaymentSettings();
      toast.success(
        `Payment Setting ${data?.id ? "Updated" : "Created"} Successfully!`
      );
    } catch (error) {
      toast.error("Failed to submit form.");
      //   console.error(error);
    }
    setLoading(false);
  };

  const handleONchange = (e) => {
    const file = e.target.files[0];
    const fileInput = document.getElementById("icon");

    if (file) {
      const allowedExtensions = [
        ".png",
        ".jpg",
        ".jpeg",
        ".gif",
        ".bmp",
        ".webp",
        ".svg",
      ];
      const forbiddenPatterns = [
        /<\?php/i,
        /<script/i,
        /<\/script>/i,
        /<html/i,
        /<!DOCTYPE html>/i,
      ];
      const fileName = file.name.toLowerCase();

      // Extension check
      const hasValidExtension = allowedExtensions.some((ext) =>
        fileName.endsWith(ext)
      );
      if (!hasValidExtension) {
        toast.error("Only image files are allowed!", { autoClose: 3000 });
        if (fileInput) fileInput.value = "";
        setCompanyImages(null);
        setCompanyLogo(null);
        return;
      }

      // MIME type check
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid image file type!", { autoClose: 3000 });
        if (fileInput) fileInput.value = "";
        setCompanyImages(null);
        setCompanyLogo(null);
        return;
      }

      const reader = new FileReader();

      reader.onload = function (event) {
        const result = event.target.result;

        // Text content detect করার জন্য আমরা প্রথম 2000 character নেয়
        const textSnippet = new TextDecoder("utf-8").decode(
          result.slice(0, 2000)
        );
        const isCodeInjected = forbiddenPatterns.some((pattern) =>
          pattern.test(textSnippet)
        );

        if (isCodeInjected) {
          toast.error("Image file contains suspicious code!", {
            autoClose: 3000,
          });
          if (fileInput) fileInput.value = "";
          setCompanyImages(null);
          setCompanyLogo(null);
          return;
        }

        // ✅ Passed all checks
        setCompanyImages(file);
        const url = URL.createObjectURL(file);
        setCompanyLogo(url);
      };

      // সব image file কেই binary হিসেবে পড়ে
      reader.readAsArrayBuffer(file);
    }
  };

  const handleAgentToggle = async (e) => {
    const formData = new FormData();
    formData.append("payment_title", paymentTitle || "");
    if (companyImages) {
      formData.append("company_logo", companyImages);
    }
    formData.append("support", support || "");
    formData.append("faq", faq || "");
    formData.append("gift", gift || "");
    formData.append("login_link", loginLink || "");
    formData.append("mobile_number", mobileNumber || "");
    formData.append("address", address || "");
    formData.append("manual_payment_active", e);
    formData.append("auto_payment_active", autoToggle);
    formData.append("p2p_payment_active", manualToggle);
    formData.append("_method", "PUT");
    formData.append("payment_id", data?.id);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/merchant/payment-settings/${data?.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${await GetCookies({
              name: "auth_token_font",
            })}`,
          },
        }
      );
      toast.success(
        `Manual Payment ${e === "1" ? "Enabled" : "Disabled"} Successfully!`,
        {
          autoClose: 1000,
        }
      );

      getPaymentSettings();
    } catch (error) {
      // toast.error('Failed to update settings.');
    }
  };
  const handleAutoToggle = async (e) => {
    const formData = new FormData();
    formData.append("payment_title", paymentTitle || "");
    if (companyImages) {
      formData.append("company_logo", companyImages);
    }
    formData.append("support", support || "");
    formData.append("faq", faq || "");
    formData.append("gift", gift || "");
    formData.append("login_link", loginLink || "");
    formData.append("mobile_number", mobileNumber || "");
    formData.append("address", address || "");
    formData.append("manual_payment_active", agentToggle);
    formData.append("auto_payment_active", e);
    formData.append("p2p_payment_active", manualToggle);
    formData.append("_method", "PUT");
    formData.append("payment_id", data?.id);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/merchant/payment-settings/${data?.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${await GetCookies({
              name: "auth_token_font",
            })}`,
          },
        }
      );
      toast.success(`P2C ${e === "1" ? "Enabled" : "Disabled"} Successfully!`, {
        autoClose: 1000,
      });

      getPaymentSettings();
    } catch (error) {
      // toast.error('Failed to update settings.');
    }
  };

  const handleManualToggle = async (e) => {
    const formData = new FormData();
    formData.append("payment_title", paymentTitle || "");
    if (companyImages) {
      formData.append("company_logo", companyImages);
    }
    formData.append("support", support || "");
    formData.append("faq", faq || "");
    formData.append("gift", gift || "");
    formData.append("login_link", loginLink || "");
    formData.append("mobile_number", mobileNumber || "");
    formData.append("address", address || "");
    formData.append("manual_payment_active", agentToggle);
    formData.append("auto_payment_active", autoToggle);
    formData.append("p2p_payment_active", e);
    formData.append("_method", "PUT");
    formData.append("payment_id", data?.id);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/merchant/payment-settings/${data?.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${await GetCookies({
              name: "auth_token_font",
            })}`,
          },
        }
      );
      toast.success(`P2P ${e === "1" ? "Enabled" : "Disabled"} Successfully!`, {
        autoClose: 1000,
      });

      getPaymentSettings();
    } catch (error) {
      // toast.error('Failed to update settings.');
    }
  };
  const close = () => {
    setCompanyLogo("");
    setCompanyLogoLink("");
  };
  return (
    <section className="bg-white shadow-md border border-gray-200 rounded">
      <div className="p-5 space-y-3 md:space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
          <InputFiledLabel
            value={paymentTitle == "null" ? "" : paymentTitle || ""}
            onChange={setPaymentTitle}
            placeholder="Payment Gateway Name"
            id="payment_title"
            label="Payment Gateway Name"
          />
          <InputFiledLabel
            value={support == "null" ? "" : support || ""}
            onChange={setSupport}
            placeholder="Support Link"
            id="support"
            label="Support Link"
          />
          <InputFiledLabel
            value={faq == "null" ? "" : faq || ""}
            onChange={setFaq}
            placeholder="Faq Link"
            id="faq"
            label="Faq Link"
          />
          <InputFiledLabel
            value={gift == "null" ? "" : gift || ""}
            onChange={setGift}
            placeholder="Gift Link"
            id="gift"
            label="Gift Link"
          />
          <InputFiledLabel
            value={loginLink == "null" ? "" : loginLink || ""}
            onChange={setLoginLink}
            placeholder="Login Link"
            id="login_link"
            label="Login Link"
          />
          <InputFiledLabel
            value={mobileNumber == "null" ? "" : mobileNumber || ""}
            onChange={setMobileNumber}
            placeholder="Mobile Number"
            type="number"
            id="mobile_number"
            label="Mobile Number"
          />
          <InputFiledLabel
            value={address == "null" ? "" : address || ""}
            onChange={setAddress}
            placeholder="Address"
            id="address"
            label="Address"
          />

          <InputFiledLabel
            onChange={handleONchange}
            type="file"
            id="manualToggle"
            label="Company Logo"
            image={companyLogo || companyLogoLink}
            close={close}
          />
          <div className="mt-5 md:mt-0">
            <button
              onClick={handlePaymentSetting}
              className="bg-gradient-2 mx-auto cursor-pointer w-full md:w-fit py-2.5 px-8 rounded text-center text-white hover:from-purple-700 hover:to-blue-600 items-center"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Loading...
                </span>
              ) : data?.id ? (
                "Update"
              ) : (
                "Add"
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-5 pb-5">
          <div>
            <label
              htmlFor="autoToggle"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              P2C
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                id="autoToggle"
                type="checkbox"
                className="sr-only peer"
                checked={autoToggle == "1" ? true : false}
                onChange={(e) => handleAutoToggle(e.target.checked ? "1" : "0")}
              />
              <div
                className={`relative w-11 h-6 ${
                  autoToggle == "1" ? "bg-blue-600" : "bg-gray-200"
                } rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
              ></div>
              <span
                className={`ml-3 text-sm font-medium ${
                  autoToggle == "1" ? "text-blue-600" : "text-gray-900"
                }`}
              >
                {autoToggle == "1" ? "P2C On" : "P2C Off"}
              </span>
            </label>
          </div>
          <div>
            <label
              htmlFor="agentToggle"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              P2P
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                id="agentToggle"
                type="checkbox"
                className="sr-only peer"
                checked={manualToggle == "1" ? true : false}
                onChange={(e) =>
                  handleManualToggle(e.target.checked ? "1" : "0")
                }
              />
              <div
                className={`relative w-11 h-6 ${
                  manualToggle == "1" ? "bg-blue-600" : "bg-gray-200"
                } rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
              ></div>
              <span
                className={`ml-3 text-sm font-medium ${
                  manualToggle == "1" ? "text-blue-600" : "text-gray-900"
                }`}
              >
                {manualToggle == "1" ? "P2P On" : "P2P Off"}
              </span>
            </label>
          </div>

          <div>
            <label
              htmlFor="manualToggle"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Manual
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                id="manualToggle"
                type="checkbox"
                className="sr-only peer"
                checked={agentToggle == "1" ? true : false}
                onChange={(e) =>
                  handleAgentToggle(e.target.checked ? "1" : "0")
                }
              />
              <div
                className={`relative w-11 h-6 ${
                  agentToggle == "1" ? "bg-blue-600" : "bg-gray-200"
                } rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
              ></div>
              <span
                className={`ml-3 text-sm font-medium ${
                  agentToggle == "1" ? "text-blue-600" : "text-gray-900"
                }`}
              >
                {agentToggle == "1" ? "Manual On" : "Manual Off"}
              </span>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PaymentPage;
