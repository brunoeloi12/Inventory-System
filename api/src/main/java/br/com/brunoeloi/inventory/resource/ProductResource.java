package br.com.brunoeloi.inventory.resource;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import br.com.brunoeloi.inventory.model.Product;
import br.com.brunoeloi.inventory.model.ProductMaterial;
import br.com.brunoeloi.inventory.model.RawMaterial;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductResource {

    @GET
    public List<Product> list() {
        return Product.list("SELECT p FROM Product p LEFT JOIN FETCH p.composition c LEFT JOIN FETCH c.rawMaterial");
    }

    @POST
    @Transactional
    public Response create(ProductDTO dto) {
        Product product = new Product();
        product.name = dto.name;
        product.code = dto.code;
        product.value = dto.value;

        if (dto.materials != null && !dto.materials.isEmpty()) {
            for (MaterialItem item : dto.materials) {
                RawMaterial raw = RawMaterial.findById(item.rawMaterialId);
                if (raw != null) {
                    product.addMaterial(raw, item.quantity);
                }
            }
        }

        product.persist();
        return Response.status(Response.Status.CREATED).entity(product).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, ProductDTO dto) {
        Product entity = Product.findById(id);
        if (entity == null) throw new NotFoundException("Produto não encontrado");

        entity.name = dto.name;
        entity.code = dto.code;
        entity.value = dto.value;

        if (dto.materials != null) {
            
            entity.composition.removeIf(existingItem -> 
                dto.materials.stream().noneMatch(newItem -> 
                    newItem.rawMaterialId.longValue() == existingItem.rawMaterial.id.longValue()
                )
            );

            for (MaterialItem newItem : dto.materials) {
                ProductMaterial existing = entity.composition.stream()
                    .filter(pm -> pm.rawMaterial.id.longValue() == newItem.rawMaterialId.longValue())
                    .findFirst()
                    .orElse(null);

                if (existing != null) {
                    existing.quantityRequired = newItem.quantity;
                } else {
                    RawMaterial raw = RawMaterial.findById(newItem.rawMaterialId);
                    if (raw != null) {
                        entity.addMaterial(raw, newItem.quantity);
                    }
                }
            }
        }
        
        return Response.ok(entity).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public void delete(@PathParam("id") Long id) {
        Product entity = Product.findById(id);
        if (entity == null) throw new NotFoundException();
        entity.delete();
    }

    @POST
    @Path("/{id}/materials")
    @Transactional
    public Response addMaterialToProduct(@PathParam("id") Long id, MaterialItem item) {
        if (item == null || item.rawMaterialId == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Dados inválidos").build();
        }

        Product product = Product.findById(id);

        if (product == null) throw new NotFoundException("Produto não encontrado");
        boolean exists = product.composition.stream()
            .anyMatch(pm -> pm.rawMaterial.id.equals(item.rawMaterialId));
    
        if (exists) {
            return Response.status(Response.Status.CONFLICT)
                .entity("Este material já está na receita. Edite a quantidade existente.")
                .build();
        }

        RawMaterial raw = RawMaterial.findById(item.rawMaterialId);
        if (raw == null) throw new NotFoundException("Matéria-prima não encontrada");

        product.addMaterial(raw, item.quantity);
        product.persist();
        
        return Response.ok(product).build();
    }

    @PUT
    @Path("/materials/{relationId}")
    @Transactional
    public Response updateMaterialQuantity(@PathParam("relationId") Long relationId, MaterialItem item) {
        ProductMaterial pm = ProductMaterial.findById(relationId);
        if (pm == null) throw new NotFoundException();
        
        pm.quantityRequired = item.quantity;
        return Response.ok(pm).build();
    }

    @DELETE
    @Path("/materials/{relationId}")
    @Transactional
    public Response removeMaterialFromRecipe(@PathParam("relationId") Long relationId) {
        ProductMaterial pm = ProductMaterial.findById(relationId);
        if (pm == null) throw new NotFoundException();
        
        if(pm.product != null) {
            pm.product.composition.remove(pm);
        }
        pm.delete();
        return Response.noContent().build();
    }

    public static class ProductDTO {
        public String name;
        public String code;
        public double value;
        public List<MaterialItem> materials;
    }

    public static class MaterialItem {
        @JsonProperty("rawMaterialId")
        public Long rawMaterialId;

        @JsonProperty("quantity")
        public double quantity;
    }
}