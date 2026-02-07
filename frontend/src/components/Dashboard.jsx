// src/components/Dashboard.jsx

import { useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import Navbar from './Navbar';
import ItemList from './ItemList';
import CartModal from './CartModal';
import OrdersModal from './OrdersModal';
import CheckoutModal from './CheckoutModal';

const Dashboard = () => {
    const [cartCount, setCartCount] = useState(0);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isOrdersOpen, setIsOrdersOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const fetchCartCount = useCallback(async () => {
        try {
            const response = await cartAPI.getMyCart();
            const items = response.data.data?.items || [];
            const count = items.reduce((total, item) => total + item.quantity, 0);
            setCartCount(count);
        } catch (error) {
            console.error('Error fetching cart count:', error);
        }
    }, []);

    useEffect(() => {
        fetchCartCount();
    }, [fetchCartCount]);

    const handleCheckoutSuccess = () => {
        fetchCartCount();
        setIsCheckoutOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar
                cartCount={cartCount}
                onCartClick={() => setIsCartOpen(true)}
                onOrdersClick={() => setIsOrdersOpen(true)}
            />

            <main className="max-w-7xl mx-auto">
                <ItemList onCartUpdate={fetchCartCount} />
            </main>

            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onCheckout={() => setIsCheckoutOpen(true)}
                onCartUpdate={fetchCartCount}
            />

            <OrdersModal
                isOpen={isOrdersOpen}
                onClose={() => setIsOrdersOpen(false)}
            />

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                onSuccess={handleCheckoutSuccess}
            />
        </div>
    );
};

export default Dashboard;