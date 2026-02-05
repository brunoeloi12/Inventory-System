package br.com.brunoeloi.inventory.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.List;
import jakarta.persistence.FetchType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import java.util.ArrayList;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.OneToMany;

@Entity
public class Product extends PanacheEntity {

    public String name;
    public String code;
    public double value;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JsonManagedReference
    public List<ProductMaterial> composition = new ArrayList<>();

    public void addMaterial(RawMaterial matarial, double quantity) {
        ProductMaterial pm = new ProductMaterial();
        pm.product = this;
        pm.rawMaterial = matarial;
        pm.quantityRequired = quantity;
        this.composition.add(pm);
    }
}
