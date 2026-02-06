package br.com.brunoeloi.inventory.model;

import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import java.util.ArrayList;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_product")
public class Product extends PanacheEntity {

    public String name;
    public String code;
    public double value;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonProperty("materials")
    public List<ProductMaterial> composition = new ArrayList<>();

    public void addMaterial(RawMaterial matarial, double quantity) {
        ProductMaterial pm = new ProductMaterial();
        pm.product = this;
        pm.rawMaterial = matarial;
        pm.quantityRequired = quantity;
        this.composition.add(pm);
    }
}
