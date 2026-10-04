export type PositionSnapshot = {
  leverage: number;
  marginBufferPercent: number;
  dailyPnlUsd: number;
  hasOpenOrders: boolean;
};

export type ProtectionPolicy = {
  maxLeverage: number;
  minMarginBufferPercent: number;
  maxDailyLossUsd: number;
  reductionPercent: number;
};

export type ProtectionAction =
  | { type: "cancel-open-orders"; reason: string }
  | { type: "reduce-position"; percent: number; reason: string };

export type RiskEvaluation = {
  health: number;
  breachedRules: string[];
  actions: ProtectionAction[];
};

export function evaluatePosition(position: PositionSnapshot, policy: ProtectionPolicy): RiskEvaluation {
  const breachedRules: string[] = [];
  if (position.leverage > policy.maxLeverage) breachedRules.push("maximum-leverage");
  if (position.marginBufferPercent < policy.minMarginBufferPercent) breachedRules.push("minimum-margin-buffer");
  if (position.dailyPnlUsd < -policy.maxDailyLossUsd) breachedRules.push("maximum-daily-loss");

  const bufferScore = Math.min(100, position.marginBufferPercent * 2.4);
  const leveragePenalty = Math.max(0, position.leverage - 1) * 7;
  const lossPenalty = Math.min(35, Math.abs(Math.min(0, position.dailyPnlUsd)) / 20);
  const health = Math.max(0, Math.round(bufferScore - leveragePenalty - lossPenalty + 30));
  const actions: ProtectionAction[] = [];
  if (breachedRules.length && position.hasOpenOrders) actions.push({ type: "cancel-open-orders", reason: "Prevent the account from increasing exposure while outside policy." });
  if (breachedRules.length) actions.push({ type: "reduce-position", percent: policy.reductionPercent, reason: `Restore the margin buffer above ${policy.minMarginBufferPercent}%.` });
  return { health, breachedRules, actions };
}
