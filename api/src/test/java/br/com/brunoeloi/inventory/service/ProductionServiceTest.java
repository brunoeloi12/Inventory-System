package br.com.brunoeloi.inventory.service;

import br.com.brunoeloi.inventory.model.Product;
import br.com.brunoeloi.inventory.model.ProductMaterial;
import br.com.brunoeloi.inventory.model.RawMaterial;
import br.com.brunoeloi.inventory.service.ProductionService.ProductionResult;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

@QuarkusTest
public class ProductionServiceTest {

    @Inject
    ProductionService service;

    @BeforeEach
    @Transactional
    void setup() {
        ProductMaterial.deleteAll();
        Product.deleteAll();
        RawMaterial.deleteAll();

        RawMaterial farinha = new RawMaterial();
        farinha.name = "Farinha";
        farinha.stockQuantity = 100;
        farinha.active = true;
        farinha.persist();

        RawMaterial ovo = new RawMaterial();
        ovo.name = "Ovo";
        ovo.stockQuantity = 5;
        ovo.active = true;
        ovo.persist();

        Product bolo = new Product();
        bolo.name = "Bolo Premium";
        bolo.value = 50.0;
        bolo.addMaterial(farinha, 40);
        bolo.addMaterial(ovo, 2);
        bolo.persist();

        Product pao = new Product();
        pao.name = "Pão Simples";
        pao.value = 5.0;
        pao.addMaterial(farinha, 10);
        pao.persist();
    }
    
    @AfterEach
    @Transactional
    void tearDown() {
        ProductMaterial.deleteAll();
        Product.deleteAll();
        RawMaterial.deleteAll();
    }

    @Test
    public void testProductionCalculationPriority() {
        ProductionResult result = service.calculateProduction();

        Assertions.assertEquals(2, result.items.size(), "Devem ser sugeridos 2 tipos de produtos");
        Assertions.assertEquals("Bolo Premium", result.items.get(0).productName);
        Assertions.assertEquals(2, result.items.get(0).quantity, "Deveria sugerir 2 Bolos");
        Assertions.assertEquals("Pão Simples", result.items.get(1).productName);
        Assertions.assertEquals(2, result.items.get(1).quantity, "Deveria sugerir 2 Pães com a sobra");
    }
}