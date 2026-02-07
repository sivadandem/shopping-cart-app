// src/components/CheckoutModal.jsx

import { useState } from 'react';
import { ordersAPI } from '../services/api';
import { X, CreditCard, Loader, CheckCircle, AlertCircle } from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, processing, success, error

    const handlePlaceOrder = async () => {
        setLoading(true);
        setStatus('processing');

        try {
            await ordersAPI.create();
            setStatus('success');

            setTimeout(() => {
                onSuccess();
                window.alert('Order placed successfully!');
                onClose();
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
            setStatus('idle');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                {/* Close Button */}
                {status !== 'processing' && (
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
                    >
                        <X size={20} />
                    </button>
                )}

                {/* Idle State */}
                {status === 'idle' && (
                    <>
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                <CreditCard className="w-8 h-8 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Confirm Order</h2>
                            <p className="text-gray-500 mt-2">
                                Are you sure you want to place this order?
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleClose}
                                className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePlaceOrder}
                                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
                            >
                                Place Order
                            </button>
                        </div>
                    </>
                )}

                {/* Processing State */}
                {status === 'processing' && (
                    <div className="text-center py-8">
                        <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-800">Processing Order...</h2>
                        <p className="text-gray-500 mt-2">Please wait</p>
                    </div>
                )}

                {/* Success State */}
                {status === 'success' && (
                    <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-800">Order Placed!</h2>
                        <p className="text-gray-500 mt-2">Thank you for your purchase</p>
                    </div>
                )}

                {/* Error State */}
                {status === 'error' && (
                    <div className="text-center py-8">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-800">Order Failed</h2>
                        <p className="text-gray-500 mt-2">Something went wrong</p>
                        <button
                            onClick={() => setStatus('idle')}
                            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
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