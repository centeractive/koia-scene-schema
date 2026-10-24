# Koia scene format specification

This specification defines how a program other than Koia (a *writer*) stores a scene in CouchDB and opens it in Koia. The key words
MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

The JSON Schemas in [`schemas/`](../schemas) are normative for the documents. This specification adds the rules a schema cannot express.

## 1. Documents and databases

1. The scene document MUST validate against `schemas/<version>/scene.schema.json`. It is stored in the database `scenes`.
2. A writer that creates the database `scenes` MUST also create a CouchDB index on the field `creationTime`
   (`POST /scenes/_index` with `{"index":{"fields":["creationTime"]}}`). Koia lists scenes sorted by it.
3. The entries of a scene are stored in their own database, named by the scene's `database`. A writer SHOULD use the first free
   name of `data_1` … `data_100` and treat HTTP 412 on creation as "taken, try the next name".
4. For every column with `indexed: true`, the writer MUST create exactly one index in the entries database
   (`{"index":{"fields":["<column name>"]}}`) and no other design documents. Koia derives the entry count from the document count.
5. Every entry MUST validate against `schemas/<version>/entry.schema.json`.
   - Property names equal column names. Empty values are omitted.
   - `Time` values are milliseconds since the epoch, and `Object` values are JSON strings.
6. A scene MUST NOT have more than 100,000 entries. Entries SHOULD be written with `_bulk_docs` in batches. An `_id` counter
   starting at `"1000001"` is RECOMMENDED, because it keeps CouchDB's natural order.
7. `config` is owned by Koia. Writers of format 1.0 SHOULD write `{"records":[],"views":[]}`, the form every Koia deployment accepts.

## 2. Launching Koia

After the documents are written, the writer opens

```
<koiaUrl>/front?lang=<en|de|ja>#protocol=<HTTP|HTTPS>&host=<host>&port=<port>&user=<user>&pw=<base64(password)>&scene_id=<scene _id>
```

- Every value MUST be URL-encoded as UTF-8, e.g. Java's `URLEncoder.encode(value, StandardCharsets.UTF_8)`.
- The connection values MUST be passed after `#`. A URL fragment never reaches a web server, so the password stays on the machine.
- `lang` is the only query parameter, and it is optional.
- Koia 1.0.0 or later is required. Earlier versions ignore the fragment and show an empty front page.
- Koia still accepts all values in the query string (`/front?protocol=…`) for writers released before Koia 1.0.0. New writers
  MUST NOT use that form, because the query string is sent to the web server.

## 3. Versions

1. A document declares its format in `schemaVersion` (`<major>.<minor>`). A document without `schemaVersion` is read as format 1.0.
2. A `schemaVersion` that is not a string matching `^[0-9]+\.[0-9]+$` is treated by readers as an unsupported version.
3. Koia lists the formats it reads at `<koiaUrl>/assets/scene-format/versions.json`, e.g. `{"versions":["1.0"]}`.
   - A writer SHOULD request it with a timeout of 5 seconds.
   - A network error, a timeout, a status other than 2xx, or a body that is not a JSON object with a string array `versions`
     all mean `["1.0"]`. Koia versions without this file answer with their start page.
   - The writer writes the highest version that both Koia and the writer support. It MUST NOT fill properties introduced after that
     version.
   - The response only selects the format version. It never changes how Koia is launched (section 2).
4. Koia refuses to open a scene whose `schemaVersion` it does not support, or a document with `schemaVersion` that violates its
   schema, and lists the violations. Documents without `schemaVersion` are opened as before.
5. Koia never drops support for a published version.

## 4. Evolution rules

1. A **minor** version only adds optional properties or enum values. Every valid example of an older minor MUST stay valid.
2. Every property or enum value added by a minor carries the annotation `"x-since": "<major.minor>"`. For an enum value it goes on
   the enclosing schema as `"x-since": {"<value>": "<major.minor>"}`. Validators register `x-since` as a non-validating keyword
   (Ajv: `ajv.addKeyword('x-since')`, networknt: a custom keyword), starting with the first minor that uses it.
3. A **major** version is any other change. It comes with a new `schemas/<major>.0`, a migration note in the
   [changelog](../CHANGELOG.md), and a Koia upcaster that converts older documents. The upcaster sets `schemaVersion` when Koia saves
   the converted document.
4. These property names are reserved for Koia and are never redefined: scene `columnMappings` and `config.savedViews`, column
   `computation` and `groupingTimeUnit`.
5. A package's `major.minor` equals its newest schema version. A patch release only changes documentation, or generator settings
   that keep the generated code source compatible.
