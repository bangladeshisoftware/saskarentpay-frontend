import { QRCodeSVG } from "qrcode.react";
import React from "react";


const QRPayment = () => {
  const paymentLink = "https://karentpay.laravel.bangladeshisoftware.com/pay/8512af073332ad3d8c5a2b036fd2853683470d2f";
  const logoImage = "https://karentpay.laravel.bangladeshisoftware.com/storage/images/67781e82ce424_kpay.png";
  
  return (
    <div className="flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center border border-gray-200">
        {/* Logo */}
        <div className="mb-4">
          <img src={logoImage} alt="Company Logo" className="mx-auto w-20" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-800">Scan to Pay</h2>

        {/* Phone Number */}
        <p className="text-gray-600 text-sm mt-2 font-medium">+880 1234 567 890</p>

        {/* Address */}
        <p className="text-gray-500 text-xs mt-1">123 Street Name, City, Country</p>

        {/* QR Code with Logo */}
        <div className="flex justify-center mt-4 bg-gray-100 p-4 rounded-lg shadow-md border border-gray-300">
          <QRCodeSVG 
            value={paymentLink} 
            size={180} 
            level="H" 
            includeMargin={true} 
            imageSettings={{
              src: logoImage,
              x: undefined,
              y: undefined,
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </div>

        {/* Pay Now Button */}
        <a 
          href={paymentLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all block">
          Pay Now
        </a>
      </div>
    </div>
  );
};

export default QRPayment;
