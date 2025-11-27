<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Retrieve a large set of mock products for the inventory dashboard.
     * Generates at least 100 products with realistic, randomized inventory metrics.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $products = [];
        $numProducts = 100;

        for ($i = 1; $i <= $numProducts; $i++) {
            // Generate randomized, yet somewhat realistic, data for the ML model
            $avgSalesPerWeek = rand(5, 55);
            $daysToReplenish = rand(3, 21); // Lead time in days

            // Generate inventory:
            // This ensures a mix of high, medium, and low stock items relative to sales.
            $baseInventory = $avgSalesPerWeek * rand(1, 4);
            $currentInventory = $baseInventory + rand(-10, 20); // Add some variability

            // Ensure inventory and sales are not negative
            $currentInventory = max(1, $currentInventory);
            $avgSalesPerWeek = max(1, $avgSalesPerWeek);

            $products[] = [
                'id' => $i,
                'name' => 'Product ' . $i . ' (' . $this->getCategory($i) . ')',
                'currentInventory' => $currentInventory,
                'avgSalesPerWeek' => $avgSalesPerWeek,
                'daysToReplenish' => $daysToReplenish,
            ];
        }

        // Return the data as a JSON response
        return response()->json($products);
    }

    /**
     * Helper to give products a category name for variety.
     */
    private function getCategory(int $id): string
    {
        $categories = ['Component', 'Accessory', 'Module', 'Tool', 'Raw Material'];
        return $categories[$id % count($categories)];
    }
}