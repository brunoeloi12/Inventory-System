package br.com.brunoeloi.inventory.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import br.com.brunoeloi.inventory.model.Product;
import br.com.brunoeloi.inventory.model.ProductMaterial;
import br.com.brunoeloi.inventory.model.RawMaterial;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ProductionService {
    
    public ProductionResult calculateProduction() {
        List<Product> products = Product.listAll();
        
        products.sort((p1, p2) -> Double.compare(p2.value, p1.value));

        List<RawMaterial> materials = RawMaterial.listAll();
        Map<Long, Integer> stockMap = new HashMap<>();
        for (RawMaterial rm : materials) {
            stockMap.put(rm.id, rm.stockQuantity);
        }

        List<ProductionItem> suggestion = new ArrayList<>();
        double totalValue = 0;

        for (Product product : products) {
            if (product.composition == null || product.composition.isEmpty()) {
                continue;
            }

            int quantityToProduce = 0;
            boolean canProduce = true;

            while (canProduce) {
                for (ProductMaterial pm : product.composition) {
                    if (pm.rawMaterial == null) {
                        canProduce = false;
                        break;
                    }

                    int currentStock = stockMap.getOrDefault(pm.rawMaterial.id, 0);
                    
                    if (currentStock < pm.quantityRequired) {
                        canProduce = false;
                        break;
                    }
                }

                if (canProduce) {
                    quantityToProduce++;

                    for (ProductMaterial pm : product.composition) {
                        int currentStock = stockMap.get(pm.rawMaterial.id);
                        stockMap.put(pm.rawMaterial.id, currentStock - (int) pm.quantityRequired);
                    }
                }
            }

            if (quantityToProduce > 0) {
                double subtotal = quantityToProduce * product.value;
                totalValue += subtotal;
                suggestion.add(new ProductionItem(product.name, quantityToProduce, product.value, subtotal));
            }
        }

        return new ProductionResult(suggestion, totalValue);
    }
    public static class ProductionResult {
        public List<ProductionItem> items;
        public double totalValue;

        public ProductionResult(List<ProductionItem> items, double totalValue) {
            this.items = items;
            this.totalValue = totalValue;
        }
    }

    public static class ProductionItem {
        public String productName;
        public int quantity;
        public double unitValue;
        public double subtotal;

        public ProductionItem(String productName, int quantity, double unitValue, double subtotal) {
            this.productName = productName;
            this.quantity = quantity;
            this.unitValue = unitValue;
            this.subtotal = subtotal;
        }
    }
}