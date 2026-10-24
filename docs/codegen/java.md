# Java

Use the published model instead of your own copy:

```xml
<dependency>
   <groupId>com.centeractive.koia</groupId>
   <artifactId>koia-scene-model</artifactId>
   <version>1.0.0</version>
</dependency>
```

- The package `com.centeractive.koia.scene.v1` contains `SceneDocument`, `SceneColumn`, `ContextInfo` and `SceneConfig`, with Gson
  annotations. Gson is not bundled, so add your own Gson 2.x.
- The jar is an OSGi bundle that exports `com.centeractive.koia.scene.v1`. It runs on Java 21 or later.
- The schemas are jar resources at `/koia-scene-schema/<version>/<kind>.schema.json`, for contract tests with a JSON Schema
  validator such as `com.networknt:json-schema-validator`.
- The generated classes have no defaults. Set `creationTime`, `schemaVersion` and `config` (`records` and `views` as empty lists)
  yourself.
- `width` is a `Double`, so Gson writes `135.0`. Koia reads it as 135.

```java
SceneDocument scene = new SceneDocument()
   .withSchemaVersion("1.0")
   .withCreationTime(System.currentTimeMillis())
   .withName("Logs")
   .withShortDescription("")
   .withDatabase("data_1")
   .withColumns(List.of(new SceneColumn().withName("Data").withDataType(SceneColumn.DataType.TEXT).withWidth(400d)))
   .withConfig(new SceneConfig().withRecords(List.of()).withViews(List.of()));
String json = new Gson().toJson(scene);
```

To generate the classes yourself, use `jsonschema2pojo-maven-plugin` with the settings in
[`packages/java/pom.xml`](../../packages/java/pom.xml): `annotationStyle=gson` (or `jackson2`), `useLongIntegers=true`,
`useTitleAsClassname=true` and `includeAdditionalProperties=false`.
