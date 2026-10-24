import React from 'react';
import { FaCoins } from "react-icons/fa6";

const BalanceModal = ({ showBalanceModal, closeBalanceModal, balanceHandler, message }) => {
  return (
    <>
      {showBalanceModal && (
        <div
          tabIndex="-1"
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center w-full h-full px-5 md:px-0 overflow-hidden bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-md h-auto bg-white rounded-lg shadow dark:bg-gray-800">
            <button
              type="button"
              onClick={closeBalanceModal}
              className="absolute top-2.5 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <svg
              className="text-gray-400 dark:text-gray-500 w-10 h-11 mb-3.5 mx-auto"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
             <FaCoins className="w-10 h-10 flex justify-cener my-5" />
            </svg>
            <p className="mb-4 text-sm md:text-base text-center text-gray-500 dark:text-gray-300">
              {message}
            </p>
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={closeBalanceModal}
                type="button"
                className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                No, cancel
              </button>
              <button
                onClick={balanceHandler}
                type="button"
                className="py-2 px-3 text-sm font-medium text-center text-white bg-[#ce9600] rounded-lg hover:bg-[#ce9600] focus:ring-4 focus:outline-none focus:ring-[#ce9600] dark:bg-[#ce9600] dark:hover:bg-[#ce9600] dark:focus:ring-[#ce9600]"
              >
                Yes, I Know
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BalanceModal;
