package br.com.brunoeloi.inventory.resource;

import java.util.List;

import br.com.brunoeloi.inventory.model.ProductMaterial;
import br.com.brunoeloi.inventory.model.RawMaterial;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RawMaterialResource {

    @GET
    public List<RawMaterial> list() {
        return RawMaterial.list("active", true);
    }

    @POST
    @Transactional
    public Response create(RawMaterial dto) {
        RawMaterial entity = new RawMaterial();
        entity.name = dto.name;
        entity.code = dto.code;
        entity.stockQuantity = dto.stockQuantity;
        entity.active = true;
        
        entity.persist();
        return Response.status(Response.Status.CREATED).entity(entity).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public RawMaterial update(@PathParam("id") Long id, RawMaterial dto) {
        RawMaterial entity = RawMaterial.findById(id);
        if (entity == null) throw new NotFoundException();

        entity.name = dto.name;
        entity.code = dto.code;
        entity.stockQuantity = dto.stockQuantity;
        
        return entity;
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        RawMaterial entity = RawMaterial.findById(id);
        if (entity == null) throw new NotFoundException();
        long usoEmProdutos = ProductMaterial.count("rawMaterial.id", id);
        
        if (usoEmProdutos > 0) {
            return Response.status(Response.Status.CONFLICT)
                   .entity("Não é possível excluir: Este insumo é usado em " + usoEmProdutos + " produto(s).")
                   .build();
        }

        entity.delete();
        
        return Response.noContent().build();
    }
}