# Graphify Skill

Turn codebase AST, documents, schemas, and configurations into a queryable knowledge graph without vector stores or external APIs.

## Capabilities

1. **Extract AST Knowledge Graph**: Analyzes code syntax trees, call graphs, imports, and connections locally.
2. **Query Connections**: Trace dependencies, god nodes (central hub modules), and call pathways.
3. **Persist & Cache**: Caches AST hashes in `graphify-out/` so re-runs only parse modified files.

## Usage

When analyzing project-wide architecture, run `graphify` commands via Shell:

```bash
# Build / update knowledge graph for current workspace
graphify .

# Query connection pathways
graphify path "<SourceModule>" "<TargetModule>"

# Query specific concepts or modules
graphify explain "<ComponentName>"

# Export graph for inspection
graphify . --svg
```

## Boundaries & Efficiency

- Output directory `graphify-out/` is git-ignored.
- Use targeted AST queries rather than loading full raw graphs into context.
- Never commit graph outputs or cache to Git.
