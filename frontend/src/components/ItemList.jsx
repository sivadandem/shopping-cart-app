// src/components/ItemList.jsx

import { useState, useEffect } from 'react';
import { itemsAPI, cartAPI } from '../services/api';
import { Plus, Package, Loader } from 'lucide-react';

const ItemList = ({ onCartUpdate }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await itemsAPI.getAll();
            setItems(response.data.data);
        } catch (error) {
            console.error('Error fetching items:', error);
            window.alert('Failed to load items');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (itemId) => {
        setAddingToCart(itemId);
        try {
            await cartAPI.addItem(itemId);
            onCartUpdate();

            const item = items.find(i => i._id === itemId);
            window.alert(`${item.name} added to cart!`);
        } catch (error) {
            console.error('Error adding to cart:', error);
            window.alert('Failed to add item to cart');
        } finally {
            setAddingToCart(null);
        }
    };

    // Format price in Indian Rupees
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                <span className="ml-2 text-gray-600">Loading items...</span>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Package size={48} className="mb-4" />
                <p>No items available</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Available Items ({items.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        {/* Image */}
                        <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                }}
                            />
                        </div>

                        {/* Details */}
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-800 text-lg mb-1">
                                {item.name}
                            </h3>
                            <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                                {item.description || 'No description available'}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-green-600">
                                    {formatPrice(item.price)}
                                </span>
                                <button
                                    onClick={() => handleAddToCart(item._id)}
                                    disabled={addingToCart === item._id}
                                    className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {addingToCart === item._id ? (
                                        <Loader size={18} className="animate-spin" />
                                    ) : (
                                        <Plus size={18} />
                                    )}
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ItemList;