import React from "react";

export default function ProductTable({ products, isSuggestionTable = false }) {
  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>Name</th>
          <th className="text-right">Inventory</th>
          <th className="text-right">Avg Sales (Wk)</th>
          <th className="text-right">Lead Time (Days)</th>
          {/* Show Prediction column only in the main dashboard view */}
          {!isSuggestionTable && <th className="text-center">Prediction</th>}
          {/* Show Suggested Qty column only in the Reorder Suggestions table */}
          {isSuggestionTable && <th className="text-right suggest-col">Suggested Qty</th>}
        </tr>
      </thead>

      <tbody>
        {products.map((p, index) => {
          const isReorder = p.prediction === "Reorder";
          
          // Determine inventory status class only for the main table view
          const inventoryClass = !isSuggestionTable && p.inventory < p.avgSales * 2 
            ? 'low-inventory' 
            : '';
          
          // Determine row background for alternating colors
          const rowClass = index % 2 === 0 ? 'row-even' : 'row-odd';

          // Simple Reorder Quantity Calculation: 
          // (Avg Weekly Sales * (Lead Time in Weeks)) * 2 + buffer 
          const leadTimeWeeks = p.leadTime / 7;
          const safetyStock = p.avgSales * leadTimeWeeks * 2;
          const suggestedQty = Math.ceil(safetyStock - p.inventory) + 5; // +5 buffer
          const finalSuggestedQty = Math.max(10, suggestedQty); // Minimum order of 10

          return (
            <tr key={p.id} className={rowClass}>
              <td>{p.name}</td>
              <td className={`text-right ${inventoryClass}`}>{p.inventory}</td>
              <td className="text-right">{p.avgSales}</td>
              <td className="text-right">{p.leadTime}</td>
              
              {!isSuggestionTable && (
                <td className="text-center">
                  <span className={isReorder ? 'reorder-prediction' : 'no-reorder-prediction'}>
                    {p.prediction}
                  </span>
                </td>
              )}
              
              {isSuggestionTable && (
                <td className="text-right suggest-col">
                  <span className="suggested-quantity">
                    {finalSuggestedQty}
                  </span>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}