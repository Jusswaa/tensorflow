export async function getProducts() {
  const res = await fetch("http://localhost:5000/products");
  const data = await res.json();

  return data.map(prod => ({
    id: prod.id,
    name: prod.name,
    inventory: prod.currentInventory,
    avgSales: prod.avgSalesPerWeek,
    leadTime: prod.daysToReplenish
  }));
}