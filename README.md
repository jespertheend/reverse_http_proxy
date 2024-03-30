# Reverso

A CLI tool that starts a reverse proxy server.

## Install

```
deno install --allow-net https://deno.land/x/reverso@v0.2.0/reverso.ts
```

## Usage

```
reverso --from 8080 --to https://example.com
```

You can now open http://localhost:8080/ in your browser and it will show the contents of example.com
