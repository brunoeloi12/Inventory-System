package br.com.brunoeloi.inventory.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_product")
public class Product extends PanacheEntity {

    public String name;
    public String code;
    public double value;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    public List<ProductMaterial> composition = new ArrayList<>();

    public void addMaterial(RawMaterial rawMaterial, double quantity) {
        ProductMaterial pm = new ProductMaterial();
        pm.product = this;
        pm.rawMaterial = rawMaterial;
        pm.quantityRequired = quantity;
        this.composition.add(pm);
    }
}