import React, { useEffect, useState, useCallback } from "react";
import ProductTable from "./components/ProductTable";
import ReorderTable from "./components/ReorderTable";
import { getProducts } from "./api";
import { createReorderModel, predictReorder } from "./components/util/reorder";

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTraining, setIsTraining] = useState(false);
  
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

  const handleTrainModel = useCallback(async () => {
    try {
      setIsTraining(true);
      console.log("Starting model training...");
      // This function calls TensorFlow.js to train the neural network
      const model = await createReorderModel();
      setReorderModel(model);
      console.log("Model training complete.");
    } catch (err) {
      console.error("Error training model:", err);
    } finally {
      setIsTraining(false);
    }
  }, []);

  // 1. Initial Model Training (runs only once on mount)
  useEffect(() => {
    handleTrainModel();
  }, [handleTrainModel]);

  // 2. Data fetch when the model is ready (initially or after retraining)
  useEffect(() => {
    // Only fetch data and predict if the model is ready AND we are not currently training.
    if (reorderModel && !isTraining) {
      fetchDataAndPredict();
    }
  }, [reorderModel, isTraining, fetchDataAndPredict]);

  const handleRunPredictions = () => {
    fetchDataAndPredict();
  };
  
  const isButtonDisabled = loading || isTraining || !reorderModel;
  const trainButtonClass = `refresh-button ${isTraining || loading ? 'disabled' : ''}`;
  const runButtonClass = `refresh-button ${isButtonDisabled ? 'disabled' : ''}`;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">
          Inventory Reorder Dashboard 
        </h2>
        
        <div className="button-group">
          
          <button
            onClick={handleTrainModel}
            disabled={isTraining || loading}
            className={trainButtonClass}
            title="Retrain the TensorFlow.js model using the synthetic dataset."
          >
            {isTraining ? 'Training AI...' : 'Train Model'}
          </button>

          <button
            onClick={handleRunPredictions}
            disabled={isButtonDisabled}
            className={runButtonClass}
            title="Fetch latest inventory data from Laravel and run AI predictions"
          >
            {loading ? 'Running...' : 'Run Predictions'}
          </button>
        </div>
      </div>

      {isTraining ? (
        <p className="loading-message">
          Training AI model... This only happens once on startup or when manually triggered.
        </p>
      ) : loading ? (
        <p className="loading-message">
          Fetching data and calculating predictions...
        </p>
      ) : (
        products.length > 0 ? (
          <>
            {/* 1. Reorder Suggestions Table (Actionable Items) */}
            <ReorderTable products={products} />
            
            {/* 2. Main Inventory Table (Full List) */}
            <h3 className="section-title main-table-title">Full Inventory List ({products.length} Items)</h3>
            <ProductTable products={products} />
          </>
        ) : (
          <p className="error-message">No product data available to display.</p>
        )
      )}
    </div>
  );
}