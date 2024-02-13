
import React, { useState, useEffect } from "react";
import axios from "axios";

const styles = {
    dashboardContainer: {
      padding: '20px',
    },
    
    dashboardTitle: {
      fontSize: '24px',
      marginBottom: '20px',
    },
    
    filterForm: {
      marginBottom: '20px',
    },
    
    itemsTitle: {
      fontSize: '20px',
      marginBottom: '10px',
    },
    
    itemList: {
      listStyle: 'none',
      padding: 0,
    },
    
    itemListItem: {
      marginBottom: '10px',
    },
    
    noItemsMessage: {
      fontStyle: 'italic',
    },
    
    categoriesTitle: {
      fontSize: '20px',
      marginTop: '20px',
      marginBottom: '10px',
    },
    
    categoryList: {
      listStyle: 'none',
      padding: 0,
    },
    
    categoryListItem: {
      marginBottom: '10px',
    }
  };
  

function Dashboard() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [queryParams, setQueryParams] = useState({
    search: "",
    order_by: "",
    sku: "",
    name: "",
    category: "",
    stock_status: "",
  });
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, [queryParams, authToken]);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/item-list/", {
        params: queryParams,
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      setItems(response.data.results);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/category-list/",
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e) => {
    setQueryParams({ ...queryParams, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const deleteItem = async (SKU) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/item-delete/?SKU=${SKU}`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      // Refresh items after deletion
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/category-delete/?category=${categoryId}`,
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );
      // Refresh categories after deletion
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      <h1 style={styles.dashboardTitle}>Dashboard</h1>

      {/* Form for accepting query parameters */}
      <form style={styles.filterForm} onSubmit={handleSubmit}>
        <label>
          Search:
          <input
            type="text"
            name="search"
            value={queryParams.search}
            onChange={handleChange}
          />
        </label>
        <label>
          Order By:
          <select
            name="order_by"
            value={queryParams.order_by}
            onChange={handleChange}
          >
            <option value="">-- Select --</option>
            <option value="name">Name</option>
            <option value="SKU">SKU</option>
            {/* Add more options as needed */}
          </select>
        </label>
        <label>
          Category:
          <input
            type="text"
            name="category"
            value={queryParams.category}
            onChange={handleChange}
          />
        </label>
        <label>
          Tags:
          <input
            type="text"
            name="tags"
            value={queryParams.tags}
            onChange={handleChange}
          />
        </label>
        <label>
          Stock Status:
          <select
            name="stock_status"
            value={queryParams.stock_status}
            onChange={handleChange}
          >
            <option value="">-- Select --</option>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            {/* Add more options as needed */}
          </select>
        </label>
        <label>
          Available Stock (Minimum):
          <input
            type="number"
            name="min_available_stock"
            value={queryParams.min_available_stock}
            onChange={handleChange}
          />
        </label>
        {/* Add more input fields/select dropdowns for other query parameters */}
        <button type="submit">Apply Filters</button>
      </form>

      {/* Display items */}
      <h2 style={styles.itemsTitle} >Items</h2>
      {items.length > 0 ? (
        <ul style={styles.itemList}>
          {items.map((item) => (
            <li key={item.SKU}>
              <strong>Name:</strong> {item.name}
              <br />
              <strong>SKU:</strong> {item.SKU}
              <br />
              <strong>Category:</strong> {item.category}
              <br />
              <strong>Tags:</strong> {item.tags}
              <br />
              <strong>Stock Status:</strong> {item.stock_status}
              <br />
              <strong>Available Stock:</strong> {item.available_stock}
              <br />
              <button onClick={() => deleteItem(item.SKU)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={styles.noItemsMessage}>No items found.</p>
      )}

      {/* Display categories */}
      <h2 style={styles.categoriesTitle}>Categories</h2>
      <ul style={styles.categoryList}>
        {categories.map((category) => (
          <li key={category.id}>
            {category.name}
            <button onClick={() => deleteCategory(category.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
