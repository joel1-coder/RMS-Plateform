# Analysis Inference Notes

No explicit `"inference": true` entries were present in `analysis/api-spec.json`, `analysis/db-schema.json`, `analysis/route-map.json`, or `analysis/seed-data.json`.

The following route-map endpoints were referenced by frontend actions but were absent from `analysis/api-spec.json`; they are implemented with `// TODO: VERIFY_INFERENCE` comments and should be verified with product owners:

- `POST /api/submissions/thesis`
- `GET /api/reports/scholar?name=:name`
- `GET /api/reports/generate`

The `POST /api/research` API spec accepts scholar and supervisor names, while `analysis/db-schema.json` requires `scholarId` and `supervisorId`. The backend resolves those IDs from matching user records by name and role.

Upload metadata is stored directly in the `submissions` collection because `analysis/db-schema.json` does not define an `attachments` collection.
