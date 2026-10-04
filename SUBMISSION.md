# Airlock — Metropolis submission package

This is the working source of truth for the final entry. Replace every unchecked item with verified evidence before copying it into the portal.

## Project identity

**Name:** Airlock

**One-line description:** An autonomous risk guardian for Perpl that monitors positions in real time and automatically enforces user-defined safety policies before liquidation.

**Primary track:** Onchain Finance & Trading

**Logo:** `public/airlock-logo.png`

## Bounties

Core targets:

1. Best Analytics / Risk Tool — Perpl
2. Best use of Perpl's API — Perpl
3. Best Agent Wallet Plugin — MetaMask
4. Best Use of Envio

Add only after the corresponding integration is working in the recorded demo: Best use of Nansen, Best workflow with CRE, and Best Projects using Alchemy.

## Project overview

Leveraged traders usually discover that their risk controls failed at the worst possible moment. Dashboards can warn them and agents can trade for them, but neither guarantees that a protective action will happen within rules the user chose in advance.

Airlock is an autonomous risk guardian for Perpl positions on Monad. It continuously turns live position data into a margin-health model, evaluates that state against a deterministic policy, and intervenes before liquidation. A user can set a maximum leverage, minimum margin buffer, and maximum daily loss. When a boundary is crossed, Airlock cancels orders that could increase exposure and submits a reduce-only action designed to restore the account to safety.

The important separation is between intelligence and authority. An agent may explain the market, identify a threat, or recommend an action. It cannot rewrite the account's limits. Execution remains bounded by a small deterministic engine whose decision and reason are written to an audit trail.

The product is demonstrated as a live risk console rather than a passive analytics page. Judges can start with a healthy ETH-PERP position, trigger a price shock, watch the configured margin floor break, and see Airlock prepare and execute the protective response. The timeline shows what changed, which rule fired, and what the system did.

## Technical implementation

Airlock is divided into four narrow layers:

1. **Data plane.** Envio indexes the Perpl events needed to reconstruct positions, orders, fills, funding, and liquidation risk. The application consumes normalized account snapshots rather than issuing a burst of RPC calls from the browser.
2. **Risk engine.** A deterministic TypeScript module evaluates leverage, margin buffer, and realized/unrealized loss against the user's policy. It returns named breaches and an explicit action plan. This path contains no model inference.
3. **Execution adapter.** The Perpl adapter converts a policy-approved action into a reduce-only transaction, simulates it, checks expected post-trade exposure, and submits it on Monad.
4. **Agent surface.** A MetaMask Agent Wallet plugin exposes position inspection and protected execution as native commands. Wallet submission remains subject to the Agent Wallet's own policy boundary.

The web console is built with React, TypeScript, and a Cloudflare-compatible runtime. The interactive prototype implements the policy controls, state transitions, risk visualization, and audit timeline. Contract addresses, indexed event signatures, and transaction hashes will be documented only after they are verified against the deployed build.

## Repository and deployment

- [ ] Public repository URL
- [ ] Live deployment URL
- [ ] Monad network: Mainnet or Testnet
- [ ] Perpl contract addresses used
- [ ] Envio hosted indexer / GraphQL URL
- [ ] MetaMask plugin package or install command

## Three-minute demo video

**0:00–0:20 — problem:** “A trading agent can open a leveraged position in seconds. When the market moves, most risk tools can only send another notification. Airlock gives the position a way out.” Show the healthy position and armed policy.

**0:20–0:55 — boundary:** Set maximum leverage, minimum margin buffer, and maximum daily loss. Explain that these deterministic rules cannot be changed by the agent.

**0:55–1:35 — break it:** Trigger the price-shock scenario. Show health falling, the margin floor being crossed, and the exact rule appearing in the audit trail.

**1:35–2:10 — protect it:** Execute protection. Show open orders being canceled, the reduce-only Perpl action, Monad confirmation, and restored buffer.

**2:10–2:40 — integrations:** Show the Envio event arriving and run the MetaMask Agent Wallet command against the same position. Do not show source code.

**2:40–3:00 — close:** “Agents should be able to trade without having unlimited authority to lose. Airlock separates intelligence from execution and gives every Perpl position a deterministic escape route.”

## Two-minute team pitch

“I'm Rex, and I'm building Airlock because the dangerous part of agentic finance is not giving an agent market data. It is giving a probabilistic system authority over a leveraged wallet.

Existing dashboards tell you that a position is in danger. Existing bots ask you to trust their strategy. Airlock takes a different approach: the user defines a small, deterministic safety envelope before the trade. The agent can analyze and propose, but it cannot exceed those rules.

Airlock watches Perpl positions on Monad, detects when leverage, margin buffer, or daily loss crosses a boundary, and automatically cancels unsafe orders or reduces the position. Every decision is explainable, reproducible, and visible in the audit trail.

I'm building this because autonomous wallets need a hard boundary between intelligence and authority. As agents become capable of trading around the clock, that boundary is not an optional feature. It is the infrastructure that makes autonomous finance safe enough to use.”

## Thirty-second promotional clip

**0–5 seconds:** Healthy Perpl position. “Your trading agent never sleeps.”

**5–12 seconds:** Price shock; screen turns red. “Neither does liquidation.”

**12–23 seconds:** Policy fires, order is reduced, health recovers. “Airlock watches the boundary and acts before the position breaks.”

**23–30 seconds:** Logo and protected state. “Airlock. Give every position a way out.”

## Final evidence checklist

- [ ] Demo runs against Monad Mainnet or Testnet
- [ ] Video shows the working product, not slides or a code walkthrough
- [ ] Demo video is no longer than three minutes
- [ ] Team pitch is no longer than two minutes
- [ ] Repository is public or shared with metropolis@hackathon.monad.xyz
- [ ] Every selected bounty has its required questions completed
- [ ] Logo file is under 2 MB and between 500 px and 4 million pixels
- [ ] All sponsor names and claims match the final implementation
