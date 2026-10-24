import React from 'react';

const Loading = () => {
    return (
        <div className="loading-container">
            <div className="flex gap-2">
                <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
                <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
                <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
            </div>
        </div>
    );
}

export default Loading;
