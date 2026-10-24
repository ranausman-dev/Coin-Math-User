import React from "react";
import { FaFacebookF } from "react-icons/fa";

const Fb = ({ isOpen, closeModal, onJoin, hasFollowedFacebook }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 text-center w-auto">
        <div className="flex justify-center mb-4 text-blue-600">
          <FaFacebookF size={50} />
        </div>
        <h2 className="text-xl font-bold mb-2">Follow us on Facebook</h2>
        <div>
          {hasFollowedFacebook ? (
            <span className="text-xs text-gray-700">
              Wait 1 hour for moderation check to claim the prize.
            </span>
          ) : (
            <span className="text-xs text-gray-700">
              Visit our Facebook page to get 5 coins.
            </span>
          )}
        </div>
        <div className="flex gap-10 justify-center">
          {!hasFollowedFacebook && (
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-700"
              onClick={onJoin}
            >
              Join
            </button>
          )}
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-700"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Fb;
