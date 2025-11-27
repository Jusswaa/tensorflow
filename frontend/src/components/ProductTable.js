import React from "react";

export default function ProductTable({ products }) {
  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>Name</th>
          <th className="text-right">Inventory</th>
          <th className="text-right">Avg Sales (Wk)</th>
          <th className="text-right">Lead Time (Days)</th>
          <th className="text-center">Prediction</th>
        </tr>
      </thead>

      <tbody>
        {products.map((p, index) => {
          const isReorder = p.prediction === "Reorder";
          
          // Determine inventory status class
          // If inventory is less than twice the average weekly sales, consider it low.
          const inventoryClass = p.inventory < p.avgSales * 2 ? 'low-inventory' : 'ok-inventory';
          
          // Determine row background for alternating colors
          const rowClass = index % 2 === 0 ? 'row-even' : 'row-odd';

          return (
            <tr key={p.id} className={rowClass}>
              <td>{p.name}</td>
              <td className={`text-right ${inventoryClass}`}>{p.inventory}</td>
              <td className="text-right">{p.avgSales}</td>
              <td className="text-right">{p.leadTime}</td>
              <td className="text-center">
                <span className={isReorder ? 'reorder-prediction' : 'no-reorder-prediction'}>
                  {p.prediction}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}