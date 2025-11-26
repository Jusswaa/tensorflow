import React, { useEffect, useState, useCallback } from "react";
import ProductTable from "./components/ProductTable";
import { getProducts } from "./api";
import { createReorderModel, predictReorder } from "./components/util/reorder";

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [reorderModel, setReorderModel] = useState(null);

  const fetchDataAndPredict = useCallback(async () => {
    if (!reorderModel) {
      console.warn("Model not yet initialized. Skipping data fetch.");
      return;
    }

    try {
      setLoading(true);
      
      const productList = await getProducts();
      
      const predictions = await Promise.all(
        productList.map(async (p) => ({
          ...p,
          prediction: await predictReorder(reorderModel, p),
        }))
      );

      setProducts(predictions);
    } catch (err) {
      console.error("Error fetching or predicting data:", err);
    } finally {
      setLoading(false);
    }
  }, [reorderModel]); 

  useEffect(() => {
    async function trainModel() {
      try {
        setLoading(true);
        const model = await createReorderModel();
        setReorderModel(model);
      } catch (err) {
        console.error("Error training model:", err);
        setLoading(false);
      }
    }
    trainModel();
  }, []);

  useEffect(() => {
    if (reorderModel) {
      fetchDataAndPredict();
    }
  }, [reorderModel, fetchDataAndPredict]);


  const handleRefresh = () => {
    fetchDataAndPredict();
  };

  const buttonClass = `refresh-button ${loading || !reorderModel ? 'disabled' : ''}`;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">
           Inventory Reorder Dashboard 
        </h2>
        
        <button
          onClick={handleRefresh}
          disabled={loading || !reorderModel}
          className={buttonClass}
          title="Reload products from API and re-calculate predictions"
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {loading ? (
        <p className="loading-message">
          {reorderModel ? 'Fetching latest data and running predictions...' : 'Training AI model... Please wait.'}
        </p>
      ) : (
        products.length > 0 ? (
          <ProductTable products={products} />
        ) : (
          <p className="error-message">No product data available to display.</p>
        )
      )}
    </div>
  );
}