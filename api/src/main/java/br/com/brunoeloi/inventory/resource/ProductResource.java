package br.com.brunoeloi.inventory.resource;

import java.util.List;
import br.com.brunoeloi.inventory.model.Product;
import br.com.brunoeloi.inventory.model.RawMaterial;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
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

        if (dto.materials != null) {
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

    public static class ProductDTO {
        public String name;
        public String code;
        public double value;
        public List<MaterialItem> materials;
    }

    public static class MaterialItem {
        public Long rawMaterialId;
        public double quantity;
    }
}
