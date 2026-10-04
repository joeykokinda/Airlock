# Airlock

Airlock is an autonomous risk guardian for leveraged positions on Perpl. It watches position health, evaluates every account against deterministic user-defined policies, and prepares protective actions before liquidation.

The core rule is simple: an AI agent can observe and propose, but a deterministic policy engine decides what it is allowed to execute.

## Current build

- A responsive risk console with a safe → breached → protected demo flow
- Editable leverage, margin-buffer, and daily-loss policies
- A deterministic risk engine in `lib/risk-engine.ts`
- A position view and human-readable intervention audit trail
- Explicit integration boundaries for Perpl, Envio, and MetaMask Agent Wallet

The visible market feed is currently seeded demo data. It is intentionally labeled as a demo until the Perpl contracts and Envio indexer are connected.

## Planned production path

1. Index Perpl position, order, fill, funding, and liquidation events with Envio.
2. Convert indexed accounts into the normalized `PositionSnapshot` consumed by the risk engine.
3. Build and simulate reduce-only Perpl transactions when a rule is breached.
4. Expose the same flow through a MetaMask Agent Wallet plugin.
5. Persist policy evaluations and transaction hashes as the audit trail.

## Run locally

```bash
npm install
npm run dev
```

Build the production bundle with `npm run build`.

## Brand assets

- Portal logo: `public/airlock-logo.png` (1254×1254 transparent PNG, under 2 MB)
- App favicon: `public/favicon.svg`

The working draft for every hackathon form field and the video shot list lives in [`SUBMISSION.md`](./SUBMISSION.md).
