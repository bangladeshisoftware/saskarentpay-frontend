import React from 'react';
import { IoMdClose } from 'react-icons/io';

function InputFiled({ value, onChange, placeholder }) {
    return (
        <div className="relative w-full ">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
            <div className="flex">
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    type="text"
                    id="simple-search"
                    className="block w-full md:w-[300px] p-2.5 pl-10 border border-gray-300 rounded bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder={placeholder}
                    required=""
                />
            </div>
            {value && (
                <span
                    onClick={() => onChange("")}
                    className="absolute top-[.9rem] right-2 w-[20px] h-[20px] rounded-full bg-blue-500 text-white flex items-center justify-center cursor-pointer"
                >
                    <IoMdClose />
                </span>
            )}
        </div>
    );
}

export default InputFiled;