"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowDownRight, Bell, Bot, Check, ChevronsUp, CircleGauge, Clock3, Command, FileClock, Gauge, LockKeyhole, RotateCcw, Settings2, ShieldCheck, Siren, Sparkles, TerminalSquare, WalletCards, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

const safeSeries = [51,50,52,50,48,49,46,44,45,43,40,39,36,37,34,32,30,31,28,26,27,24,22,20];
const stressedSeries = [51,50,49,47,45,42,39,34,31,27,23,20,17,14,12,10,8,7,6,7,8,10,12,14];

type WebMcpTool = {
  name: string;
  title?: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
  execute: (input: unknown) => unknown | Promise<unknown>;
};

declare global {
  interface Document {
    modelContext?: {
      registerTool: (tool: WebMcpTool, options?: { signal?: AbortSignal }) => void | Promise<void>;
    };
  }
}

function Sparkline({ stressed }: { stressed: boolean }) {
  const values = stressed ? stressedSeries : safeSeries;
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${62 - value}`).join(" ");
  return <svg className="risk-chart" viewBox="0 0 100 64" preserveAspectRatio="none" role="img" aria-label="Margin buffer over the last hour">
    <defs><linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={stressed ? "#ff6b5e" : "#8dff75"} stopOpacity="0.3"/><stop offset="100%" stopColor={stressed ? "#ff6b5e" : "#8dff75"} stopOpacity="0"/></linearGradient></defs>
    <line x1="0" y1="46" x2="100" y2="46" className="threshold-line"/><polygon points={`0,64 ${points} 100,64`} fill="url(#riskFill)"/><polyline points={points} fill="none" stroke={stressed ? "#ff6b5e" : "#8dff75"} strokeWidth="1.7" vectorEffect="non-scaling-stroke"/><circle cx="100" cy={62-values.at(-1)!} r="2" fill={stressed ? "#ff6b5e" : "#8dff75"}/>
  </svg>;
}

export default function Home() {
  const [armed, setArmed] = useState(true);
  const [maxLeverage, setMaxLeverage] = useState([5]);
  const [minBuffer, setMinBuffer] = useState([18]);
  const [dailyLoss, setDailyLoss] = useState([500]);
  const [stressed, setStressed] = useState(false);
  const [protectedPosition, setProtectedPosition] = useState(false);
  const health = protectedPosition ? 72 : stressed ? 18 : 64;
  const healthLabel = protectedPosition ? "Recovered" : stressed ? "Action required" : "Protected";
  const liquidation = protectedPosition ? "$2,241.80" : stressed ? "$2,186.40" : "$2,104.12";
  const events = useMemo(() => protectedPosition ? [
    {icon:Check,tone:"safe",title:"Position reduced",detail:"Closed 0.84 ETH · margin buffer restored to 31%",time:"now"},
    {icon:ShieldCheck,tone:"safe",title:"Airlock policy executed",detail:"Reduce-only order confirmed on Monad",time:"now"},
    {icon:Siren,tone:"danger",title:"Minimum buffer breached",detail:"18% threshold crossed at $2,214.32",time:"4s"},
  ] : stressed ? [
    {icon:Siren,tone:"danger",title:"Minimum buffer breached",detail:"18% threshold crossed at $2,214.32",time:"now"},
    {icon:Bot,tone:"warning",title:"Intervention prepared",detail:"Reduce 40% of ETH-PERP position",time:"now"},
    {icon:Activity,tone:"neutral",title:"Price volatility detected",detail:"5-minute move exceeded 2.4%",time:"8s"},
  ] : [
    {icon:ShieldCheck,tone:"safe",title:"Protection armed",detail:"Three deterministic policies are active",time:"2m"},
    {icon:Activity,tone:"neutral",title:"Position indexed",detail:"ETH-PERP long · Perpl · Monad",time:"3m"},
    {icon:WalletCards,tone:"neutral",title:"Wallet connected",detail:"0x71F2…94A8",time:"4m"},
  ], [protectedPosition, stressed]);
  function simulate(){ if(!stressed){setStressed(true);setProtectedPosition(false)} else if(armed&&!protectedPosition){setProtectedPosition(true)} else {setStressed(false);setProtectedPosition(false)} }

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool: WebMcpTool) => {
      try {
        void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(console.error);
      } catch (error) {
        console.error(error);
      }
    };

    register({
      name: "inspect_airlock_risk",
      title: "Inspect Airlock risk",
      description: "Read the visible Airlock demo state, active safety policy, and current portfolio health.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: () => ({ armed, state: protectedPosition ? "protected" : stressed ? "breached" : "safe", health, policy: { maxLeverage: maxLeverage[0], minMarginBufferPercent: minBuffer[0], maxDailyLossUsd: dailyLoss[0] } }),
    });
    register({
      name: "advance_airlock_demo",
      title: "Advance Airlock demo",
      description: "Advance the visible demo from safe to breached, breached to protected, or protected back to safe.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: () => {
        const next = !stressed ? "breached" : armed && !protectedPosition ? "protected" : "safe";
        simulate();
        return { state: next };
      },
    });
    register({
      name: "configure_airlock_policy",
      title: "Configure protection policy",
      description: "Update the same leverage, margin-buffer, and daily-loss controls visible in the Airlock policy panel.",
      inputSchema: {
        type: "object",
        properties: {
          maxLeverage: { type: "number", minimum: 1, maximum: 10 },
          minMarginBufferPercent: { type: "number", minimum: 5, maximum: 40 },
          maxDailyLossUsd: { type: "number", minimum: 100, maximum: 2000 },
        },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: (input) => {
        const values = input as { maxLeverage?: number; minMarginBufferPercent?: number; maxDailyLossUsd?: number };
        if (values.maxLeverage !== undefined) setMaxLeverage([values.maxLeverage]);
        if (values.minMarginBufferPercent !== undefined) setMinBuffer([values.minMarginBufferPercent]);
        if (values.maxDailyLossUsd !== undefined) setDailyLoss([values.maxDailyLossUsd]);
        return { updated: true, policy: values };
      },
    });
    return () => lifecycle.abort();
  }, [armed, dailyLoss, health, maxLeverage, minBuffer, protectedPosition, stressed]);

  return <main className="app-shell">
    <aside className="rail"><div className="brand-mark" aria-label="Airlock home"><LockKeyhole/></div><nav aria-label="Primary navigation"><button className="rail-button active" aria-label="Risk console"><CircleGauge/></button><button className="rail-button" aria-label="Positions"><ChevronsUp/></button><button className="rail-button" aria-label="Automation"><Bot/></button><button className="rail-button" aria-label="Audit log"><FileClock/></button></nav><div className="rail-bottom"><button className="rail-button" aria-label="Settings"><Settings2/></button><div className="avatar">RK</div></div></aside>
    <section className="workspace">
      <header className="topbar"><div><div className="wordmark">AIRLOCK <span>for Perpl</span></div><p>Autonomous position defense</p></div><div className="topbar-actions"><span className="network-pill"><i/> Monad Testnet</span><button className="icon-button" aria-label="Notifications"><Bell/></button><button className="wallet-button"><WalletCards/> 0x71F2…94A8</button></div></header>
      <div className="content-grid"><section className="main-column">
        <div className="section-heading"><div><p className="eyebrow">Live risk console</p><h1>Your position has a way out.</h1></div><Button className="simulate-button" onClick={simulate}>{stressed&&protectedPosition?<RotateCcw/>:stressed?<Zap/>:<Siren/>}<span>{stressed&&protectedPosition?"Reset demo":stressed?"Execute protection":"Simulate price shock"}</span></Button></div>
        <section className={`hero-panel ${stressed&&!protectedPosition?"danger":""}`}><div className="health-copy"><div className="health-row"><div className="status-orb"><ShieldCheck/></div><div><span>Portfolio health</span><strong>{healthLabel}</strong></div></div><div className="score"><strong>{health}</strong><span>/100</span></div><p>{protectedPosition?"Airlock cut exposure before liquidation.":stressed?"Margin buffer crossed your safety floor.":"All positions are inside your policy envelope."}</p></div><div className="chart-wrap"><div className="chart-label"><span>Margin buffer</span><strong>{protectedPosition?"31.0%":stressed?"17.8%":"26.4%"}</strong></div><Sparkline stressed={stressed&&!protectedPosition}/><div className="chart-axis"><span>60m ago</span><span>Policy floor: 18%</span><span>now</span></div></div></section>
        <section className="panel positions-panel"><div className="panel-title"><div><p className="eyebrow">Open exposure</p><h2>Perpl positions</h2></div><span className="live-label"><i/> demo feed</span></div><div className="position-row"><div className="asset-icon">Ξ</div><div className="asset-name"><strong>ETH-PERP</strong><span>Long · isolated</span></div><div className="position-stat"><span>Size</span><strong>{protectedPosition?"$3,184.20":"$5,307.00"}</strong></div><div className="position-stat"><span>Leverage</span><strong>{protectedPosition?"2.8×":"4.7×"}</strong></div><div className="position-stat"><span>Unrealized PnL</span><strong className={stressed?"negative":"positive"}>{stressed?"−$284.16":"+$126.41"}</strong></div><div className="position-stat"><span>Liquidation</span><strong>{liquidation}</strong></div><div className={`risk-badge ${stressed&&!protectedPosition?"high":""}`}>{stressed&&!protectedPosition?"HIGH RISK":"GUARDED"}</div></div></section>
        <section className="panel timeline-panel"><div className="panel-title"><div><p className="eyebrow">Audit trail</p><h2>What Airlock saw</h2></div><button className="text-button">View all <Command/></button></div><div className="event-list">{events.map((event,index)=>{const Icon=event.icon;return <div className="event" key={`${event.title}-${index}`}><div className={`event-icon ${event.tone}`}><Icon/></div><div><strong>{event.title}</strong><span>{event.detail}</span></div><time>{event.time}</time></div>})}</div></section>
      </section><aside className="policy-column">
        <section className="policy-card"><div className="policy-header"><div><p className="eyebrow">Deterministic guardrails</p><h2>Protection policy</h2></div><Switch checked={armed} onCheckedChange={setArmed} aria-label="Arm protection policy"/></div><div className={`armed-state ${armed?"on":"off"}`}><span><i/> {armed?"Protection armed":"Protection paused"}</span><LockKeyhole/></div>
          <div className="policy-control"><div className="control-label"><span><Gauge/> Maximum leverage</span><strong>{maxLeverage[0]}×</strong></div><Slider value={maxLeverage} onValueChange={setMaxLeverage} min={1} max={10} step={.5}/><div className="range-label"><span>1×</span><span>10×</span></div></div>
          <div className="policy-control"><div className="control-label"><span><ShieldCheck/> Minimum margin buffer</span><strong>{minBuffer[0]}%</strong></div><Slider value={minBuffer} onValueChange={setMinBuffer} min={5} max={40}/><div className="range-label"><span>5%</span><span>40%</span></div></div>
          <div className="policy-control"><div className="control-label"><span><ArrowDownRight/> Maximum daily loss</span><strong>${dailyLoss[0]}</strong></div><Slider value={dailyLoss} onValueChange={setDailyLoss} min={100} max={2000} step={50}/><div className="range-label"><span>$100</span><span>$2,000</span></div></div>
          <div className="action-rule"><div className="rule-number">01</div><div><strong>Cancel open orders</strong><span>Stop exposure from increasing</span></div><Check/></div><div className="action-rule"><div className="rule-number">02</div><div><strong>Reduce position 40%</strong><span>Submit a reduce-only market order</span></div><Check/></div><div className="policy-footer"><Clock3/><span>Policies execute without model judgment.</span></div>
        </section>
        <section className="agent-card"><div className="agent-icon"><TerminalSquare/></div><div><strong>MetaMask Agent Wallet</strong><span>Plugin integration planned</span></div><span className="soon">NEXT</span></section><section className="source-card"><Sparkles/><div><strong>Onchain integration path</strong><span>Perpl execution · Envio indexing · Monad settlement</span></div></section>
      </aside></div>
    </section>
  </main>;
}
