// src/components/Navbar.jsx

import { ShoppingCart, ShoppingBag, History, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ cartCount, onCartClick, onOrdersClick }) => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            await logout();
        }
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-8 h-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-800">ShopCart</span>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        {/* Username */}
                        <div className="hidden sm:flex items-center gap-2 text-gray-600">
                            <User size={18} />
                            <span className="font-medium">{user?.username}</span>
                        </div>

                        {/* Cart Button */}
                        <button
                            onClick={onCartClick}
                            className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Cart"
                        >
                            <ShoppingCart size={24} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </button>

                        {/* Orders Button */}
                        <button
                            onClick={onOrdersClick}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Order History"
                        >
                            <History size={24} />
                        </button>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                            <LogOut size={18} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;