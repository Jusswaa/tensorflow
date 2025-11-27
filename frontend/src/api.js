export async function getProducts() {
  const API_URL = "http://localhost:8000/api/products";
  
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status} from ${API_URL}`);
    }
    const data = await res.json();

    return data.map(prod => ({
      id: prod.id,
      name: prod.name,
      inventory: prod.currentInventory,
      avgSales: prod.avgSalesPerWeek,
      leadTime: prod.daysToReplenish
    }));
  } catch (error) {
    console.error("Failed to fetch products. Check if the Laravel backend is running and the URL is correct:", error);
    return [];
  }
}