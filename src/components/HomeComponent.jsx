import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "./CartContext";
import { useError } from '../Context/ErrorContext.jsx';

const HomeComponent = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [subCategories, setSubCategories] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { cartItems, dispatch } = useCart(); 
    const [message, setMessage] = useState(""); 
    const { setError } = useError();
    const customerId = 1;

    useEffect(() => {
        refreshCart(); 
    }, []);
    
    useEffect(() => {
        axios.get("http://localhost:8081/api/categories")
            .then(response => setCategories(response.data))
            .catch(error => {
                console.error("Error fetching categories:", error);
                setError("Failed to fetch categories. Please try again later.");
            });
    }, []);

    useEffect(() => {
        refreshCart();  // ✅ Fetch the cart on mount
    }, []);

    const handleCategoryChange = (event) => {
        const categoryId = event.target.value;
        setSelectedCategory(categoryId);
        const category = categories.find(cat => cat.categoryId === Number(categoryId));
        setSubCategories(category?.subCategoriesDto || []);
        setSelectedSubCategory("");
        setProducts([]);
    };

    const handleSubCategoryChange = (event) => {
        const subCategoryId = event.target.value;
        setSelectedSubCategory(subCategoryId);
        setLoading(true);

        axios.get(`http://localhost:8081/api/products/products?categoryId=${selectedCategory}&subcategoryId=${subCategoryId}`)
            .then(response => setProducts(response.data))
            .catch(error => {
                console.error("Error fetching products:", error);
                setError("Failed to fetch products. Please try again later.");
            })
            .finally(() => setLoading(false));
    };

    const addToCart = (product) => {
        axios.post("http://localhost:8082/cart/add", { 
            productId: product.productId, quantity: 1, customerId: 1 
        })
        .then(() => {
            setMessage(`${product.productTitle} added to cart!`);
            refreshCart();
        })
        .catch(error => {
            console.error("Error adding to cart:", error);
            setError("Failed to add product to cart. Please try again later.");
        });
    };

    const refreshCart = () => {
        axios.get(`http://localhost:8082/cart/${customerId}`)
            .then(response => dispatch({ type: "SET_CART", payload: response.data }))
            .catch(error => {
                console.error("Error fetching updated cart:", error);
                setError("Failed to refresh the cart. Please try again later.");
            });
    };

    const increaseQuantity = (productId, quantity, productTitle, priceUnit) => {

        const cartItem = cartItems.find(item => item.productId === productId);
    
        if (cartItem) {
            axios.put(`http://localhost:8082/cart/update/${cartItem.customerId}/${cartItem.productId}?quantity=${quantity + 1}`)
                .then(() => {
                    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity: quantity + 1 } });
                    refreshCart();
                })
                .catch(error => {
                    console.error("Error updating quantity:", error);
                    setError("Failed to update the quantity. Please try again later.");
                });
        } else {
            axios.post("http://localhost:8082/cart/add", { 
                productId, quantity: 1, customerId 
            })
            .then(() => {
                dispatch({ type: "ADD_TO_CART", payload: { productId, quantity: 1, productTitle, priceUnit } });
                setMessage(`${productTitle} added to cart!`);
                refreshCart();
            })
            .catch(error => {
                console.error("Error adding to cart:", error);
                setError("Failed to add product to cart. Please try again later.");
            });
        }
    };
    
const decreaseQuantity = (productId, quantity, productTitle, priceUnit) => {
    const cartItem = cartItems.find(item => item.productId === productId);

    if (cartItem) {
        if (quantity > 1) {
            axios.put(`http://localhost:8082/cart/update/${cartItem.id}?quantity=${quantity - 1}`)
                .then(() => {
                    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity: quantity - 1 } });
                    refreshCart();
                })
                .catch(error => {
                    console.error("Error updating quantity:", error);
                    setError("Failed to update the quantity. Please try again later.");
                });
        } else {
            axios.delete(`http://localhost:8082/cart/delete/${cartItem.id}`)
                .then(() => {
                    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
                    refreshCart();
                })
                .catch(error => {
                    console.error("Error removing from cart:", error);
                    setError("Failed to remove product from cart. Please try again later.");
                });
        }
    }
};


    return (
        <div>
            <h2>Select Category</h2>
            <select value={selectedCategory} onChange={handleCategoryChange}>
                <option value="">Select Category</option>
                {categories
                    .filter(cat => cat.subCategoriesDto && cat.subCategoriesDto.length > 0)
                    .map(cat => (
                        <option key={cat.categoryId} value={cat.categoryId}>
                            {cat.categoryTitle}
                        </option>
                    ))}
            </select>

            {subCategories.length > 0 && (
                <>
                    <h2>Select Subcategory</h2>
                    <select value={selectedSubCategory} onChange={handleSubCategoryChange}>
                        <option value="">Select Subcategory</option>
                        {subCategories.map(sub => (
                            <option key={sub.categoryId} value={sub.categoryId}>
                                {sub.categoryTitle}
                            </option>
                        ))}
                    </select>
                </>
            )}

            {loading && <p>Loading products...</p>}

            {products.length > 0 && !loading && (
                <>
                    <h2>Products</h2>
                    <ul>
                        {products.map(product => {
                            const cartItem = cartItems.find(item => item.productId === product.productId);
                            const quantity = cartItem ? cartItem.quantity : 0;

                            return (
                                <li key={product.productId}>
                                    {product.productTitle} Rs.{product.priceUnit}
                                    {quantity >= 0 ? (
                                        <>
                                            <button onClick={() => decreaseQuantity(product.productId, quantity, product.productTitle, product.priceUnit)}>
                                            -</button>
                                            <span> {quantity} </span>
                                            <button onClick={() => increaseQuantity(product.productId, quantity, product.productTitle, product.priceUnit)}>+</button>
                                        </>
                                    ) : (
                                        <button onClick={() => addToCart(product)}>Add to Cart</button>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}
            {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}
        </div>
    );
};

export default HomeComponent;
