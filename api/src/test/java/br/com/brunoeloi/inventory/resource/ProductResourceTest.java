package br.com.brunoeloi.inventory.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;
import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.hasSize;

@QuarkusTest
public class ProductResourceTest {

    @Test
    public void testCreateAndUpdateProductRecipe() {
        Integer idTrigo = given()
            .contentType(ContentType.JSON)
            .body("{\"name\": \"Trigo\", \"code\": \"TRI\", \"stockQuantity\": 100}")
            .when().post("/raw-materials").then().statusCode(201)
            .extract().path("id");

        Integer idLeite = given()
            .contentType(ContentType.JSON)
            .body("{\"name\": \"Leite\", \"code\": \"LEI\", \"stockQuantity\": 100}")
            .when().post("/raw-materials").then().statusCode(201)
            .extract().path("id");

        String jsonCreate = "{"
            + "\"name\": \"Massa\", \"code\": \"MAS-01\", \"value\": 10.0,"
            + "\"materials\": [{\"rawMaterialId\": " + idTrigo + ", \"quantity\": 5}]"
            + "}";

        Integer productId = given()
            .contentType(ContentType.JSON)
            .body(jsonCreate)
            .when().post("/products")
            .then()
            .statusCode(201)
            .body("name", is("Massa"))
            .extract().path("id");

        String jsonUpdate = "{"
            + "\"name\": \"Massa\", \"code\": \"MAS-01\", \"value\": 12.0,"
            + "\"materials\": [{\"rawMaterialId\": " + idLeite + ", \"quantity\": 2}]"
            + "}";

        given()
            .contentType(ContentType.JSON)
            .body(jsonUpdate)
            .when().put("/products/" + productId)
            .then()
            .statusCode(200)
            .body("value", is(12.0f));

        given()
            .when().get("/products")
            .then()
            .statusCode(200)
            .rootPath("find { it.id == " + productId + " }") 
            .body("name", is("Massa"))
            .body("composition", hasSize(1)) 
            .body("composition[0].rawMaterial.id", is(idLeite)); 
    }
}