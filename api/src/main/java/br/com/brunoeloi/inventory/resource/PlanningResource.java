package br.com.brunoeloi.inventory.resource;

import br.com.brunoeloi.inventory.service.ProductionService;
import br.com.brunoeloi.inventory.service.ProductionService.ProductionResult;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/planning")
public class PlanningResource {
    
    @Inject
    ProductionService service;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public ProductionResult getPlan() {
        return service.calculateProduction();
    }
}
