import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";

const InventoryComponent = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);  // For product quantity
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      navigate("/");
      return;
    }
  
    // Listener for logout event
    const handleLogout = () => {
      navigate("/");
    };
  
    window.addEventListener("logout", handleLogout);
  
    // Cleanup when component unmounts
    return () => {
      window.removeEventListener("logout", handleLogout);
    };
  }, [navigate]);
  

  // Fetch categories
  useEffect(() => {
    // If there's a token, fetch categories
    axios
      .get("http://localhost:8081/api/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, [navigate]);

  // Handle category change
  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    const category = categories.find((cat) => cat.categoryId === Number(categoryId));
    setSubCategories(category?.subCategoriesDto || []);
    setSelectedSubCategory("");
    setProducts([]);
  };

  // Handle subcategory change
  const handleSubCategoryChange = (event) => {
    const subCategoryId = event.target.value;
    setSelectedSubCategory(subCategoryId);
    setLoading(true);
    axios
      .get(`http://localhost:8081/api/products/products?categoryId=${selectedCategory}&subcategoryId=${subCategoryId}`)
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error))
      .finally(() => setLoading(false));
  };

  // Handle product selection
  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  // Handle save product (add to inventory)
  const handleSaveProduct = () => {
    if (!selectedProduct || !quantity) return;

    const data = {
      productId: selectedProduct,
      quantity: quantity,
    };
    const jwtToken = localStorage.getItem("token");

    // Hit the inventory endpoint to save product
    axios
      .post("http://localhost:8083/api/inventory/add", data, {
        headers: {
          "Authorization": `Bearer ${jwtToken}` // jwtToken is your token value
        }
      })
      .then((response) => {
        console.log("Product added to inventory:", response.data);
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error("Error adding product to inventory:", error);
      });
  };

  return (
    <div>
      <h2>Manage Inventory</h2>

      {/* Category dropdown */}
      <h3>Select Category</h3>
      <select value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">Select Category</option>
        {categories
          .filter((cat) => cat.subCategoriesDto && cat.subCategoriesDto.length > 0)
          .map((cat) => (
            <option key={cat.categoryId} value={cat.categoryId}>
              {cat.categoryTitle}
            </option>
          ))}
      </select>

      {/* Subcategory dropdown */}
      {subCategories.length > 0 && (
        <>
          <h3>Select Subcategory</h3>
          <select value={selectedSubCategory} onChange={handleSubCategoryChange}>
            <option value="">Select Subcategory</option>
            {subCategories.map((sub) => (
              <option key={sub.categoryId} value={sub.categoryId}>
                {sub.categoryTitle}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Product dropdown */}
      {products.length > 0 && (
        <>
          <h3>Select Product</h3>
          <select value={selectedProduct} onChange={handleProductChange}>
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product.productId} value={product.productId}>
                {product.productTitle}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Quantity input */}
      <h3>Quantity</h3>
      <input
        type="number"
        value={quantity === 0 ? "" : quantity} // Allow clearing the input (empty string) or setting 0
        onChange={(e) => {
          const newValue = e.target.value;
          // Handle input only if it's a valid number or empty (to clear the input)
          if (newValue === "" || !isNaN(newValue) && Number(newValue) >= 0) {
            setQuantity(newValue === "" ? 0 : Number(newValue)); // Set 0 if empty string
          }
        }}
        min="0" // Prevent negative numbers
      />

      {/* Save button */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleSaveProduct}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Save Product
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Loading products...</p>}
      {message && <p style={{ color: message === "Item added successfully!" ? "green" : "red" }}>{message}</p>}

    </div>
  );
};

export default InventoryComponent;
