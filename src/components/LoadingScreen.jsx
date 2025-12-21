import React from 'react';

const LoadingScreen = () => {
    return (
        <div className="h-screen bg-amber-50 flex items-center justify-center">
            <div className="animate-bounce text-6xl">💩</div>
        </div>
    );
};

export default LoadingScreen;
