package br.com.brunoeloi.inventory.resource;

import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import java.util.List;
import jakarta.ws.rs.NotFoundException;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import br.com.brunoeloi.inventory.model.RawMaterial;

@Path("/raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RawMaterialResource {

    @GET
    public List<RawMaterial> list() {
        return RawMaterial.listAll();
    }

    @POST
    @Transactional
    public Response create(RawMaterial material) {
        material.persist();
        return Response.status(Response.Status.CREATED).entity(material).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public RawMaterial update(@PathParam("id") Long id, RawMaterial dto) {
        RawMaterial entity = RawMaterial.findById(id);
        if (entity == null) {
            throw new NotFoundException();
        }

        entity.name = dto.name;
        entity.code = dto.code;
        entity.stockQuantity = dto.stockQuantity;

        return entity;
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public void delete(@PathParam("id") Long id) {
        RawMaterial entity = RawMaterial.findById(id);
        if (entity == null) {
            throw new NotFoundException();
        }
        entity.delete();
    }
    
}
