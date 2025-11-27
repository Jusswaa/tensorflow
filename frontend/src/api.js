export async function getProducts() {

  const API_URL = "https://jsonplaceholder.typicode.com/comments?_limit=100";
  
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();

    return data.map(comment => {
      const idPart = comment.id;
      const bodyLength = comment.body.length;
      
      return {
        id: idPart,
        name: comment.email.split('@')[0].toUpperCase(),
        inventory: (idPart * 20) % 150 + 10, 
        avgSales: Math.ceil(bodyLength / 40) + 5,
        leadTime: (idPart % 19) + 3
      };
    });
  } catch (error) {
    console.error("Failed to fetch products from the external API:", error);
    return [];
  }
}