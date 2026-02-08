package br.com.brunoeloi.inventory;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;
import io.restassured.http.ContentType;
import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

@QuarkusTest
public class RawMaterialResourceTest {

    @Test
    public void testCreateRawMaterial() {
        String jsonBody = "{\"name\": \"Sal\", \"code\": \"SAL-01\", \"stockQuantity\": 100}";

        given()
          .contentType(ContentType.JSON)
          .body(jsonBody)
        .when()
          .post("/raw-materials")
        .then()
          .statusCode(201)
          .body("name", is("Sal"));
    }

    @Test
    public void testDeleteInUseMaterialShouldFail() {
        Integer materialId = given()
            .contentType(ContentType.JSON)
            .body("{\"name\": \"Aço\", \"code\": \"ACO-99\", \"stockQuantity\": 50}")
            .when().post("/raw-materials").then().statusCode(201)
            .extract().path("id");

        String productJson = "{"
            + "\"name\": \"Carro\", \"code\": \"CAR-01\", \"value\": 50000,"
            + "\"materials\": [{\"rawMaterialId\": " + materialId + ", \"quantity\": 10}]"
            + "}";

        given()
            .contentType(ContentType.JSON)
            .body(productJson)
            .when().post("/products").then().statusCode(201);

        given()
            .when().delete("/raw-materials/" + materialId)
            .then()
            .statusCode(409);
    }
}