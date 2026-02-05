package br.com.brunoeloi.inventory.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

@Entity
public class RawMaterial extends PanacheEntity {

    public String name;
    public String code;
    public int stockQuantity;
    
}
