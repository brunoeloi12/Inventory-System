package br.com.brunoeloi.inventory.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;

@Entity
public class ProductMaterial extends PanacheEntity {
    
    @ManyToOne
    @JsonIgnore
    public Product product;

    @ManyToOne
    public RawMaterial rawMaterial;

    public double quantityRequired;
}
