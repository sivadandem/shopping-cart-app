// src/components/OrdersModal.jsx

import { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';
import { X, History, Package, Loader, CheckCircle } from 'lucide-react';

const OrdersModal = ({ isOpen, onClose }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchOrders();
        }
    }, [isOpen]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await ordersAPI.getMyOrders();
            setOrders(response.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center gap-2">
                            <History className="text-blue-600" size={24} />
                            <h2 className="text-xl font-bold text-gray-800">Order History</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <Package size={64} className="mb-4 opacity-50" />
                                <p className="text-lg">No orders yet</p>
                                <p className="text-sm mt-2">Your order history will appear here</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div
                                        key={order._id}
                                        className="border rounded-lg overflow-hidden"
                                    >
                                        {/* Order Header */}
                                        <div className="bg-gray-50 p-4 flex justify-between items-start">
                                            <div>
                                                <p className="text-sm text-gray-500">Order ID</p>
                                                <p className="font-mono text-sm font-medium">
                                                    {order._id}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {formatDate(order.createdAt)}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </div>

                                        {/* Order Items */}
                                        <div className="p-4 space-y-2">
                                            {order.items.map((orderItem, index) => (
                                                <div
                                                    key={index}
                                                    className="flex justify-between items-center text-sm"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle size={16} className="text-green-500" />
                                                        <span className="text-gray-700">
                                                            {orderItem.item?.name || 'Item'}
                                                        </span>
                                                        <span className="text-gray-400">
                                                            x{orderItem.quantity}
                                                        </span>
                                                    </div>
                                                    <span className="text-gray-600">
                                                        ${(orderItem.priceAtPurchase * orderItem.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Order Total */}
                                        <div className="bg-gray-50 p-4 flex justify-between items-center border-t">
                                            <span className="font-semibold text-gray-700">Total</span>
                                            <span className="font-bold text-lg text-blue-600">
                                                ${order.totalAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersModal;