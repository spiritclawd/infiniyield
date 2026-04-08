'use client';

import { useState, useMemo } from 'react';
import { useVaultStore } from '@/store/game-store';
import {
  CONTRACT,
  formatBTC,
  formatScore,
  formatBTCInput,
  estimateVesuYield,
  VESU_WBTC_APY,
  formatAPY,
} from '@/lib/money-flow';

// ─────────────────────────────────────────────
//  Pure simulation logic (mirrors vault_core.cairo)
// ─────────────────────────────────────────────

/** Compute t_effective_scaled after N days in a season */
function computeTEffective(days: number): bigint {
  const BLOCKS_PER_DAY = Number(CONTRACT.BLOCKS_PER_DAY);
  const DAY_45 = Number(CONTRACT.DAY_45);
  const DAY_90 = Number(CONTRACT.DAY_90);

  const totalBlocks = Math.round(days * BLOCKS_PER_DAY);
  let remaining = totalBlocks;
  let t = 0;

  // Tier 1: days 0-45
  const tier1Blocks = DAY_45 * BLOCKS_PER_DAY;
  if (remaining > 0) {
    const used = Math.min(remaining, tier1Blocks);
    t += (used * Number(CONTRACT.RATE_TIER1)) / BLOCKS_PER_DAY;
    remaining -= used;
  }

  // Tier 2: days 45-90
  const tier2Blocks = (DAY_90 - DAY_45) * BLOCKS_PER_DAY;
  if (remaining > 0) {
    const used = Math.min(remaining, tier2Blocks);
    t += (used * Number(CONTRACT.RATE_TIER2)) / BLOCKS_PER_DAY;
    remaining -= used;
  }

  // Tier 3: days 90+
  if (remaining > 0) {
    t += (remaining * Number(CONTRACT.RATE_TIER3)) / BLOCKS_PER_DAY;
  }

  return BigInt(Math.floor(t));
}

/** score = principal_sats × t_effective / 100 */
function computeScore(principalSats: bigint, tEff: bigint): bigint {
  if (principalSats === 0n || tEff === 0n) return 0n;
  return (principalSats * tEff) / 100n;
}

/** (11 - rank)^2 / 385 as a fraction */
function rankYieldPct(rank: number): number {
  const num = (11 - rank) ** 2;
  return (num / 385) * 0.7 * 100; // % of total yield pool
}

// ─────────────────────────────────────────────
//  Leaderboard entry (current on-chain data)
// ─────────────────────────────────────────────

interface SimEntry {
  rank: number;
  label: string;
  principalSats: bigint;
  daysIn: number;
  score: bigint;
  isYou: boolean;
}

// ─────────────────────────────────────────────
//  Component
// ─────────────────────────────────────────────

export default function VaultSimulator() {
  const { leaderboard, season } = useVaultStore();

  const [btcInput, setBtcInput] = useState('');
  const [daysInput, setDaysInput] = useState('30');

  const yourSats = useMemo(() => formatBTCInput(btcInput), [btcInput]);
  const yourDays = useMemo(() => {
    const n = parseInt(daysInput, 10);
    return isNaN(n) || n < 1 ? 1 : Math.min(n, 90);
  }, [daysInput]);

  // Build a simulated snapshot: existing top-10 + you
  const simulation = useMemo((): SimEntry[] => {
    if (yourSats <= 0n) return [];

    // Days elapsed for current depositors — estimate from season start block
    const currentBlock = Number(season.currentBlock);
    const startBlock = Number(season.seasonStartBlock);
    const blocksPerDay = Number(CONTRACT.BLOCKS_PER_DAY);
    const elapsedDays = startBlock > 0
      ? Math.max(0, (currentBlock - startBlock) / blocksPerDay)
      : 0;

    // Build entries from on-chain leaderboard
    const entries: SimEntry[] = leaderboard.slice(0, 10).map((e, i) => {
      const principal = e.principal ?? 0n;
      const tEff = computeTEffective(Math.max(elapsedDays, 1));
      const score = principal > 0n ? computeScore(principal, tEff) : e.score;
      return {
        rank: i + 1,
        label: `${e.addr.slice(0, 6)}…${e.addr.slice(-4)}`,
        principalSats: principal,
        daysIn: elapsedDays,
        score,
        isYou: false,
      };
    });

    // If leaderboard is empty, invent 3 plausible competitors
    if (entries.length === 0) {
      const mockWhales = [
        { sats: 100_000_000n, days: 45 }, // 1 BTC, 45 days
        { sats: 50_000_000n, days: 30 },  // 0.5 BTC, 30 days
        { sats: 20_000_000n, days: 60 },  // 0.2 BTC, 60 days
      ];
      mockWhales.forEach(({ sats, days }, i) => {
        const tEff = computeTEffective(days);
        entries.push({
          rank: i + 1,
          label: `🐋 Whale ${i + 1}`,
          principalSats: sats,
          daysIn: days,
          score: computeScore(sats, tEff),
          isYou: false,
        });
      });
    }

    // Add you
    const yourTEff = computeTEffective(yourDays);
    const yourScore = computeScore(yourSats, yourTEff);
    entries.push({
      rank: 99,
      label: 'You',
      principalSats: yourSats,
      daysIn: yourDays,
      score: yourScore,
      isYou: true,
    });

    // Sort descending by score
    entries.sort((a, b) => (b.score > a.score ? 1 : b.score < a.score ? -1 : 0));

    // Re-rank
    entries.forEach((e, i) => { e.rank = i + 1; });

    return entries.slice(0, 10);
  }, [yourSats, yourDays, leaderboard, season]);

  // Your result
  const yourEntry = simulation.find((e) => e.isYou);
  const yourRank = yourEntry?.rank ?? null;

  // Pro-rata share (20% pool split) estimate
  const totalPrincipal = simulation.reduce((acc, e) => acc + e.principalSats, 0n);
  const yourProRata = yourSats > 0n && totalPrincipal > 0n
    ? Number((yourSats * 10000n) / totalPrincipal) / 100
    : 0;

  // Top-10 yield % if ranked
  const top10Pct = yourRank && yourRank <= 10 ? rankYieldPct(yourRank) : 0;
  const totalEarnPct = top10Pct + yourProRata * 0.2; // 20% of pool is pro-rata

  // Vesu estimated yield
  const vesuYieldSats = estimateVesuYield(yourSats, yourDays);

  // ── Days to full recovery ──────────────────────────────────────────
  const SEASON_DAYS = 60;
  const effectiveTotal = totalPrincipal > 0n ? totalPrincipal : yourSats;
  const dailyPoolGrowthSats = Number(effectiveTotal) * VESU_WBTC_APY / 365;

  const dailyTop10 = yourRank && yourRank <= 10
    ? dailyPoolGrowthSats * (rankYieldPct(yourRank) / 100)
    : 0;

  const dailyProRata = totalPrincipal > 0n
    ? dailyPoolGrowthSats * 0.20 * (Number(yourSats) / Number(totalPrincipal))
    : 0;

  const dailyYield = dailyTop10 + dailyProRata;

  const daysToRecover = dailyYield > 0 && yourSats > 0n
    ? Math.ceil(Number(yourSats) / dailyYield)
    : null;

  const formatRecovery = (days: number | null): string => {
    if (!days) return '—';
    if (days > 365 * 500) return '∞';
    if (days >= 730) return `${(days / 365).toFixed(1)} yrs`;
    if (days >= 365) return `${(days / 365).toFixed(1)} yr`;
    return `${days.toLocaleString()} days`;
  };

  // suppress unused warning for SEASON_DAYS
  void SEASON_DAYS;

  const maxScore = simulation.length > 0 ? simulation[0].score : 1n;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="ocean-card p-6 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white font-mono mb-1">
            Position Simulator
          </h3>
          <p className="text-sm text-[#64748B]">
            Estimate your leaderboard rank and yield share — assuming current state holds.
          </p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs text-[#64748B] uppercase tracking-wider mb-2">
              Your deposit (BTC)
            </label>
            <input
              type="number"
              min="0"
              step="0.001"
              placeholder="0.01"
              value={btcInput}
              onChange={(e) => setBtcInput(e.target.value)}
              className="vault-input w-full"
            />
          </div>
          <div>
            <label className="block text-xs text-[#64748B] uppercase tracking-wider mb-2">
              Days in vault (1–90)
            </label>
            <input
              type="number"
              min="1"
              max="90"
              placeholder="30"
              value={daysInput}
              onChange={(e) => setDaysInput(e.target.value)}
              className="vault-input w-full"
            />
          </div>
        </div>

        {/* Days slider */}
        <div className="mb-6">
          <input
            type="range"
            min="1"
            max="90"
            value={yourDays}
            onChange={(e) => setDaysInput(e.target.value)}
            className="w-full h-1 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #F7931A ${(yourDays / 90) * 100}%, #1E2035 ${(yourDays / 90) * 100}%)`
            }}
          />
          <div className="flex justify-between text-xs text-[#64748B] mt-1">
            <span>Day 1</span>
            <span className="text-[#F7931A]">Day {yourDays}</span>
            <span>Day 90</span>
          </div>
        </div>

        {yourSats > 0n ? (
          <>
            {/* Result summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-[#0D0F1A] border border-[#1E2035] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold font-mono text-[#F7931A]">
                  {yourRank ? (yourRank <= 10 ? `#${yourRank}` : `>${simulation.length}`) : '—'}
                </div>
                <div className="text-xs text-[#64748B] mt-1">Leaderboard rank</div>
              </div>
              <div className="bg-[#0D0F1A] border border-[#1E2035] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold font-mono text-[#6C5CE7]">
                  {top10Pct > 0 ? `${top10Pct.toFixed(2)}%` : '—'}
                </div>
                <div className="text-xs text-[#64748B] mt-1">Top-10 yield share</div>
              </div>
              <div className="bg-[#0D0F1A] border border-[#1E2035] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold font-mono text-[#00D8A4]">
                  {yourProRata.toFixed(2)}%
                </div>
                <div className="text-xs text-[#64748B] mt-1">Pro-rata share</div>
              </div>
              <div className="bg-[#0D0F1A] border border-[#1E2035] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold font-mono" style={{ color: daysToRecover && daysToRecover < 365*10 ? '#F7931A' : '#64748B' }}>
                  {formatRecovery(daysToRecover)}
                </div>
                <div className="text-xs text-[#64748B] mt-1">Days to full recovery</div>
                <div className="text-[10px] text-[#334155] mt-0.5">at {(VESU_WBTC_APY * 100).toFixed(2)}% Vesu APY</div>
              </div>
            </div>

            {/* Score detail */}
            {yourEntry && (
              <div className="text-xs text-[#64748B] mb-3 font-mono bg-[#0D0F1A] border border-[#1E2035] rounded-lg px-4 py-3">
                <span className="text-white">{formatBTC(yourEntry.principalSats)}</span>
                {' × '}
                <span className="text-[#6C5CE7]">{computeTEffective(yourDays).toString()}</span>
                {' / 100 = '}
                <span className="text-[#F7931A]">score {formatScore(yourEntry.score)}</span>
              </div>
            )}

            {/* Vesu yield estimate */}
            {yourSats > 0n && (
              <div className="mb-5 bg-[#0D0F1A] border border-[#1E2035] rounded-lg px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#64748B] uppercase tracking-wider mb-1">
                    Estimated yield earned
                  </div>
                  <div className="text-base font-bold font-mono text-[#F7931A]">
                    +{formatBTC(vesuYieldSats)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#64748B] mb-1">Vesu wBTC APY</div>
                  <div className="text-sm font-mono text-[#00D8A4]">
                    {formatAPY(VESU_WBTC_APY)}
                    <span className="text-[10px] text-[#64748B] ml-1">/ yr</span>
                  </div>
                  <div className="text-[10px] text-[#64748B] mt-0.5">
                    Prime Pool · Starknet
                  </div>
                </div>
              </div>
            )}

            {/* Simulated leaderboard */}
            <div className="space-y-2">
              <div className="text-xs text-[#64748B] uppercase tracking-wider mb-3">
                Simulated leaderboard
                {leaderboard.length === 0 && (
                  <span className="ml-2 text-[#F7931A] normal-case">
                    (no live data — using example whales)
                  </span>
                )}
              </div>
              {simulation.map((entry) => {
                const barPct = maxScore > 0n
                  ? Number((entry.score * 100n) / maxScore)
                  : 0;
                return (
                  <div
                    key={entry.isYou ? 'you' : entry.label}
                    className={`relative rounded-lg overflow-hidden border transition-all ${
                      entry.isYou
                        ? 'border-[#F7931A] bg-[#F7931A0D]'
                        : 'border-[#1E2035] bg-[#0D0F1A]'
                    }`}
                  >
                    {/* Depth bar */}
                    <div
                      className="absolute inset-y-0 left-0 opacity-10 transition-all duration-700"
                      style={{
                        width: `${barPct}%`,
                        background: entry.isYou
                          ? 'linear-gradient(to right, #F7931A, transparent)'
                          : 'linear-gradient(to right, #6C5CE7, transparent)',
                      }}
                    />
                    <div className="relative flex items-center gap-3 px-4 py-3">
                      <span className="w-8 text-center text-sm font-mono text-[#64748B]">
                        {entry.rank === 1 ? '🐋' : `#${entry.rank}`}
                      </span>
                      <span className={`flex-1 text-sm font-mono truncate ${
                        entry.isYou ? 'text-[#F7931A] font-bold' : 'text-white'
                      }`}>
                        {entry.label}
                        {entry.isYou && (
                          <span className="ml-2 text-xs bg-[#F7931A22] text-[#F7931A] border border-[#F7931A44] rounded px-1 py-0.5">
                            you
                          </span>
                        )}
                      </span>
                      <span className="text-xs font-mono text-[#64748B] hidden sm:block">
                        {formatBTC(entry.principalSats)}
                      </span>
                      <span className="text-xs font-mono text-[#6C5CE7]">
                        {formatScore(entry.score)}
                      </span>
                      {entry.rank <= 10 && (
                        <span className="text-xs font-mono text-[#00D8A4] w-14 text-right">
                          {rankYieldPct(entry.rank).toFixed(2)}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* t_effective tier hint */}
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
              {[
                { range: 'Days 1–45', rate: '+100/day', active: yourDays <= 45 },
                { range: 'Days 46–90', rate: '+70/day', active: yourDays > 45 && yourDays <= 90 },
                { range: 'Days 91+', rate: '+40/day', active: yourDays > 90 },
              ].map((tier) => (
                <div
                  key={tier.range}
                  className={`rounded-lg border px-3 py-2 transition-all ${
                    tier.active
                      ? 'border-[#F7931A] bg-[#F7931A11] text-[#F7931A]'
                      : 'border-[#1E2035] text-[#64748B]'
                  }`}
                >
                  <div className="font-mono">{tier.rate}</div>
                  <div className="text-[10px] mt-0.5 opacity-70">{tier.range}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-[#64748B]">
            <div className="text-4xl mb-3">🐋</div>
            <div className="text-sm">Enter an amount to simulate your position</div>
          </div>
        )}
      </div>
    </div>
  );
}
