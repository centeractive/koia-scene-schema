package com.centeractive.koia.scene.v1;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Stream;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import com.google.gson.Gson;
import com.networknt.schema.Error;
import com.networknt.schema.Schema;
import com.networknt.schema.SchemaRegistry;
import com.networknt.schema.SpecificationVersion;

import tools.jackson.databind.json.JsonMapper;

class SceneDocumentTest {

   private static final Path VALID_EXAMPLES = Path.of(System.getProperty("examples.dir"), "1.0", "valid");

   private final Gson gson = new Gson();
   private final JsonMapper jsonMapper = new JsonMapper();

   static Stream<Path> validExamples() throws IOException {
      return Files.list(VALID_EXAMPLES).filter(p -> p.toString().endsWith(".json")).sorted();
   }

   @ParameterizedTest
   @MethodSource("validExamples")
   void validExampleSurvivesGsonRoundTripAndStaysValid(Path example) throws IOException {
      SceneDocument document = gson.fromJson(Files.readString(example), SceneDocument.class);

      String json = gson.toJson(document);

      List<Error> errors = sceneSchema().validate(jsonMapper.readTree(json));
      assertEquals(List.of(), errors);
   }

   @Test
   void sceneBuiltAsDocumentedIsValid() throws IOException {
      SceneDocument scene = new SceneDocument()
         .withSchemaVersion("1.0")
         .withCreationTime(System.currentTimeMillis())
         .withName("Logs")
         .withShortDescription("")
         .withDatabase("data_1")
         .withColumns(List.of(new SceneColumn().withName("Data").withDataType(SceneColumn.DataType.TEXT).withWidth(400d)))
         .withConfig(new SceneConfig().withRecords(List.of()).withViews(List.of()));

      String json = gson.toJson(scene);

      assertEquals(List.of(), sceneSchema().validate(jsonMapper.readTree(json)));
   }

   private Schema sceneSchema() throws IOException {
      try (InputStream schema = getClass().getResourceAsStream("/koia-scene-schema/1.0/scene.schema.json")) {
         return SchemaRegistry.withDefaultDialect(SpecificationVersion.DRAFT_7).getSchema(schema);
      }
   }
}
