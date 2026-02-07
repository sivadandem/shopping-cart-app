// src/components/CartModal.jsx

import { useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { X, ShoppingCart, Trash2, Loader, ShoppingBag } from 'lucide-react';

const CartModal = ({ isOpen, onClose, onCheckout, onCartUpdate }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [removingItem, setRemovingItem] = useState(null);

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
        onClose();
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="text-blue-600" size={24} />
                            <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
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
                        ) : !cart || cart.items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <ShoppingBag size={64} className="mb-4 opacity-50" />
                                <p className="text-lg">Your cart is empty</p>
                                <p className="text-sm mt-2">Add some items to get started!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.items.map((cartItem) => (
                                    <div
                                        key={cartItem._id}
                                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                                    >
                                        {/* Image */}
                                        <img
                                            src={cartItem.item?.image || 'https://via.placeholder.com/60'}
                                            alt={cartItem.item?.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/60';
                                            }}
                                        />

                                        {/* Details */}
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800">
                                                {cartItem.item?.name || 'Unknown Item'}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Qty: {cartItem.quantity}
                                            </p>
                                            <p className="text-blue-600 font-bold">
                                                ${((cartItem.item?.price || 0) * cartItem.quantity).toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemoveItem(cartItem.item?._id)}
                                            disabled={removingItem === cartItem.item?._id}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
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
                        <div className="border-t p-4 space-y-4">
                            <div className="flex justify-between items-center text-lg">
                                <span className="text-gray-600">Total:</span>
                                <span className="font-bold text-gray-800">
                                    ${calculateTotal().toFixed(2)}
                                </span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
                            >
                                <ShoppingBag size={20} />
                                Proceed to Checkout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartModal;