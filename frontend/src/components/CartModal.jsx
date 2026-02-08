// src/components/CartModal.jsx

import { useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { X, ShoppingCart, Trash2, Loader, ShoppingBag } from 'lucide-react';

const CartModal = ({ isOpen, onClose, onCheckout, onCartUpdate }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [removingItem, setRemovingItem] = useState(null);
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
            fetchCart();
        }
    }, [isOpen]);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const response = await cartAPI.getMyCart();
            setCart(response.data.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (itemId) => {
        setRemovingItem(itemId);
        try {
            await cartAPI.removeItem(itemId);
            await fetchCart();
            onCartUpdate();
        } catch (error) {
            console.error('Error removing item:', error);
            window.alert('Failed to remove item');
        } finally {
            setRemovingItem(null);
        }
    };

    const handleCheckout = () => {
        if (!cart || cart.items.length === 0) {
            window.alert('Your cart is empty!');
            return;
        }
        onCheckout();
        handleClose();
    };

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const calculateTotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, cartItem) => {
            if (cartItem.item && cartItem.item.price) {
                return total + (cartItem.item.price * cartItem.quantity);
            }
            return total;
        }, 0);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const getTotalItems = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => total + item.quantity, 0);
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
                    className={`w-screen max-w-md transform transition-transform duration-300 ease-in-out ${
                        isAnimating ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <div className="flex flex-col h-full bg-white shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-600 to-blue-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <ShoppingCart className="text-white" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Your Cart</h2>
                                    {cart && cart.items && cart.items.length > 0 && (
                                        <p className="text-blue-100 text-sm">
                                            {getTotalItems()} item{getTotalItems() > 1 ? 's' : ''} in cart
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
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <Loader className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
                                        <p className="mt-2 text-gray-500">Loading cart...</p>
                                    </div>
                                </div>
                            ) : !cart || cart.items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <div className="p-6 bg-gray-100 rounded-full mb-4">
                                        <ShoppingBag size={48} className="opacity-50" />
                                    </div>
                                    <p className="text-lg font-medium">Your cart is empty</p>
                                    <p className="text-sm mt-2 text-center">
                                        Add some items to get started!
                                    </p>
                                    <button
                                        onClick={handleClose}
                                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {cart.items.map((cartItem, index) => (
                                        <div
                                            key={cartItem._id}
                                            className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                                            style={{
                                                animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
                                            }}
                                        >
                                            {/* Image */}
                                            <img
                                                src={cartItem.item?.image || 'https://via.placeholder.com/80'}
                                                alt={cartItem.item?.name}
                                                className="w-20 h-20 object-cover rounded-lg border"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/80';
                                                }}
                                            />

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-800 truncate">
                                                    {cartItem.item?.name || 'Unknown Item'}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {formatPrice(cartItem.item?.price || 0)} × {cartItem.quantity}
                                                </p>
                                                <p className="text-green-600 font-bold mt-1">
                                                    {formatPrice((cartItem.item?.price || 0) * cartItem.quantity)}
                                                </p>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => handleRemoveItem(cartItem.item?._id)}
                                                disabled={removingItem === cartItem.item?._id}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors"
                                                title="Remove item"
                                            >
                                                {removingItem === cartItem.item?._id ? (
                                                    <Loader size={20} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={20} />
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cart && cart.items && cart.items.length > 0 && (
                            <div className="border-t bg-white p-4 space-y-4 shadow-lg">
                                {/* Summary */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal ({getTotalItems()} items)</span>
                                        <span>{formatPrice(calculateTotal())}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between items-center">
                                        <span className="font-semibold text-gray-800">Total</span>
                                        <span className="font-bold text-2xl text-green-600">
                                            {formatPrice(calculateTotal())}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                                >
                                    <ShoppingBag size={20} />
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CSS Animation */}
            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default CartModal;