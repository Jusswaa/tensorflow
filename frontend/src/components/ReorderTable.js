import React from "react";
import ProductTable from "./ProductTable";

export default function ReorderTable({ products }) {
  // Filter products that the AI model predicted need a "Reorder"
  const reorderSuggestions = products.filter(p => p.prediction === "Reorder");

  if (reorderSuggestions.length === 0) {
    return (
      <div className="card-message">
        <p className="ok-message">
          Great news! The AI model currently predicts all items are sufficiently stocked.
        </p>
      </div>
    );
  }

  return (
    <div className="reorder-section">
      <h3 className="section-title">
        AI Reorder Suggestions ({reorderSuggestions.length} Items)
      </h3>
      
      {/* Reusing ProductTable structure but limiting columns for suggestion view */}
      <ProductTable products={reorderSuggestions} isSuggestionTable={true} />
    </div>
  );
}