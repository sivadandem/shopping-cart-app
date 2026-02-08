// src/components/CheckoutModal.jsx

import { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';
import { X, CreditCard, Loader, CheckCircle, AlertCircle } from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle');
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            setIsAnimating(false);
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [isOpen]);

    const handlePlaceOrder = async () => {
        setLoading(true);
        setStatus('processing');

        try {
            await ordersAPI.create();
            setStatus('success');

            setTimeout(() => {
                onSuccess();
                window.alert('Order placed successfully!');
                handleClose();
                setStatus('idle');
            }, 1500);

        } catch (error) {
            console.error('Error placing order:', error);
            setStatus('error');
            const message = error.response?.data?.message || 'Failed to place order';
            window.alert(message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (status !== 'processing') {
            setIsAnimating(false);
            setTimeout(() => {
                setStatus('idle');
                onClose();
            }, 300);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                    isAnimating ? 'opacity-50' : 'opacity-0'
                }`}
                onClick={handleClose}
            />

            {/* Modal */}
            <div
                className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 ${
                    isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}
            >
                {/* Close Button */}
                {status !== 'processing' && (
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}

                {/* Idle State */}
                {status === 'idle' && (
                    <>
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-4 shadow-lg">
                                <CreditCard className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Confirm Order</h2>
                            <p className="text-gray-500 mt-2">
                                Are you sure you want to place this order?
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleClose}
                                className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePlaceOrder}
                                className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                            >
                                Place Order
                            </button>
                        </div>
                    </>
                )}

                {/* Processing State */}
                {status === 'processing' && (
                    <div className="text-center py-8">
                        <div className="relative w-20 h-20 mx-auto mb-4">
                            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Processing Order...</h2>
                        <p className="text-gray-500 mt-2">Please wait while we confirm your order</p>
                    </div>
                )}

                {/* Success State */}
                {status === 'success' && (
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Order Placed!</h2>
                        <p className="text-gray-500 mt-2">Thank you for your purchase</p>
                    </div>
                )}

                {/* Error State */}
                {status === 'error' && (
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-12 h-12 text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Order Failed</h2>
                        <p className="text-gray-500 mt-2">Something went wrong</p>
                        <button
                            onClick={() => setStatus('idle')}
                            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutModal;