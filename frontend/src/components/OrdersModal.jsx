// src/components/OrdersModal.jsx

import { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';
import { X, History, Package, Loader, CheckCircle, ChevronDown, ChevronUp, Clock, MapPin } from 'lucide-react';

const OrdersModal = ({ isOpen, onClose }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Handle open/close animations
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            setIsAnimating(false);
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [isOpen]);

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
            if (response.data.data.length > 0) {
                setExpandedOrder(response.data.data[0]._id);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
            shipped: 'bg-purple-100 text-purple-800 border-purple-200',
            delivered: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle size={14} />;
            case 'shipped':
                return <MapPin size={14} />;
            case 'pending':
                return <Clock size={14} />;
            default:
                return <CheckCircle size={14} />;
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const toggleOrderExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const getTotalItems = (order) => {
        return order.items.reduce((total, item) => total + item.quantity, 0);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-300 ease-in-out ${
                    isAnimating ? 'opacity-50' : 'opacity-0'
                }`}
                onClick={handleClose}
            />

            {/* Sidebar */}
            <div className="absolute inset-y-0 right-0 flex max-w-full">
                <div
                    className={`w-screen max-w-xl transform transition-transform duration-300 ease-in-out ${
                        isAnimating ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <div className="flex flex-col h-full bg-white shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-purple-600 to-purple-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <History className="text-white" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Order History</h2>
                                    {orders.length > 0 && (
                                        <p className="text-purple-100 text-sm">
                                            {orders.length} order{orders.length > 1 ? 's' : ''} placed
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={24} className="text-white" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto bg-gray-50">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <Loader className="w-10 h-10 text-purple-600 animate-spin mx-auto" />
                                        <p className="mt-2 text-gray-500">Loading orders...</p>
                                    </div>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
                                    <div className="p-6 bg-gray-100 rounded-full mb-4">
                                        <Package size={48} className="opacity-50" />
                                    </div>
                                    <p className="text-lg font-medium">No orders yet</p>
                                    <p className="text-sm mt-2 text-center">
                                        Your order history will appear here once you make a purchase.
                                    </p>
                                    <button
                                        onClick={handleClose}
                                        className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="p-4 space-y-4">
                                    {orders.map((order, orderIndex) => (
                                        <div
                                            key={order._id}
                                            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                                            style={{
                                                animation: `fadeSlideIn 0.4s ease-out ${orderIndex * 0.1}s both`
                                            }}
                                        >
                                            {/* Order Header - Clickable */}
                                            <div
                                                onClick={() => toggleOrderExpand(order._id)}
                                                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="font-mono text-sm font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                                                                #{order._id.slice(-8).toUpperCase()}
                                                            </span>
                                                            <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                                {getStatusIcon(order.status)}
                                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <Clock size={14} />
                                                                {formatDate(order.createdAt)}
                                                            </span>
                                                            <span>•</span>
                                                            <span>{getTotalItems(order)} item{getTotalItems(order) > 1 ? 's' : ''}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <span className="font-bold text-lg text-green-600">
                                                            {formatPrice(order.totalAmount)}
                                                        </span>
                                                        <div className={`p-1 rounded-full transition-transform duration-200 ${expandedOrder === order._id ? 'rotate-180' : ''}`}>
                                                            <ChevronDown size={20} className="text-gray-400" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Order Items - Expandable */}
                                            <div
                                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                                    expandedOrder === order._id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                                                }`}
                                            >
                                                <div className="border-t">
                                                    {/* Items List */}
                                                    <div className="p-4 space-y-3">
                                                        <h4 className="font-semibold text-gray-700 text-xs uppercase tracking-wider flex items-center gap-2">
                                                            <Package size={14} />
                                                            Order Items
                                                        </h4>

                                                        {order.items.map((orderItem, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                                            >
                                                                {/* Item Image */}
                                                                <div className="relative">
                                                                    <img
                                                                        src={orderItem.item?.image || 'https://via.placeholder.com/80'}
                                                                        alt={orderItem.item?.name}
                                                                        className="w-16 h-16 object-cover rounded-lg border shadow-sm"
                                                                        onError={(e) => {
                                                                            e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                                                                        }}
                                                                    />
                                                                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                                                        {orderItem.quantity}
                                                                    </span>
                                                                </div>

                                                                {/* Item Details */}
                                                                <div className="flex-1 min-w-0">
                                                                    <h5 className="font-semibold text-gray-800 truncate">
                                                                        {orderItem.item?.name || 'Unknown Item'}
                                                                    </h5>
                                                                    <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                                                                        {orderItem.item?.description || 'No description'}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500 mt-1">
                                                                        {formatPrice(orderItem.priceAtPurchase)} × {orderItem.quantity}
                                                                    </p>
                                                                </div>

                                                                {/* Item Total */}
                                                                <div className="text-right">
                                                                    <p className="font-bold text-gray-800">
                                                                        {formatPrice(orderItem.priceAtPurchase * orderItem.quantity)}
                                                                    </p>
                                                                    <CheckCircle size={16} className="text-green-500 ml-auto mt-1" />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Order Summary */}
                                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 space-y-2">
                                                        <div className="flex justify-between text-sm text-gray-600">
                                                            <span>Subtotal ({getTotalItems(order)} items)</span>
                                                            <span>{formatPrice(order.totalAmount)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm text-gray-600">
                                                            <span>Shipping</span>
                                                            <span className="text-green-600 font-medium">Free</span>
                                                        </div>
                                                        <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                                                            <span className="font-semibold text-gray-800">Grand Total</span>
                                                            <span className="font-bold text-xl text-green-600">
                                                                {formatPrice(order.totalAmount)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Order Footer */}
                                                    <div className="px-4 py-3 bg-green-50 border-t border-green-100">
                                                        <div className="flex items-center gap-2 text-sm text-green-700">
                                                            <CheckCircle size={16} className="text-green-600" />
                                                            <span>Order confirmed on {formatDate(order.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes fadeSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default OrdersModal;