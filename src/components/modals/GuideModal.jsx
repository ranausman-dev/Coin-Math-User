import React from "react";
import 'react-toastify/dist/ReactToastify.css';

const GuideModal = ({ closeSideModal }) => {

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                <div className="fixed inset-0 bg-black opacity-50 "></div>
                <div className="relative w-full max-w-4xl mx-auto mt-6 transition-transform transform translate-x-full slide-in">
                    <div className="relative flex flex-col w-full px-4 bg-[#1F1F1F] rounded-lg shadow-lg outline-none focus:outline-none mt-64 md:mt-0">
                        <div className="flex items-start justify-between p-5 border-solid">
                            <button
                                className="p-1 ml-auto text-3xl font-semibold text-white bg-transparent border-0 opacity-5 outline-none focus:outline-none"
                                onClick={closeSideModal}
                            >
                                x
                            </button>
                        </div>
                        <h3 className="text-lg font-semibold text-center text-white w-full">
                            How To Mine $COIM
                        </h3>
                        <div className="max-w-3xl mx-auto px-4 py-8 text-white">
                            <h2 className="text-3xl font-bold mb-4 text-[#007bff]">$COIM Token Mining Guide</h2>
                            <p className="mb-4">Getting Started with Mining $COIM Tokens in our app is straightforward and rewarding. Follow the simple steps below to increase your $COIM holdings:</p>

                            <ol className="list-decimal ml-6 mb-4">
                                <li>
                                    <strong>Navigate to the COIM Gen Tab:</strong> Locate the Mining Icon tab on the main navigation menu.
                                </li>
                                <li>
                                    <strong>Start Generation:</strong> Click the Start Generation button to begin a mining session. Each session lasts for 24 hours, after which you can initiate a new session to continue earning.
                                </li>
                                <li>
                                    <strong>Earn More by Referring Friends:</strong> Your base rate of coins mined per hour is 0.14 $COIM. Increase your mining rate by 10% for each friend you refer to the app. Simply hit the Copy button to share your unique referral code. When a friend signs up using your code, your mining rate increases in real time.
                                </li>
                            </ol>

                            <p className="mb-4">Happy mining! Your dedication not only enhances your $COIM balance but also strengthens our community.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GuideModal;
