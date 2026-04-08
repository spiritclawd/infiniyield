'use client';

import { useState, useEffect, useCallback } from 'react';
import { useVaultStore } from '@/store/game-store';
import {
  formatBTC,
  formatSats,
  formatScore,
  formatAddress,
  formatUSD,
  formatBTCInput,
  getTop10YieldShares,
  getDepositorProRataShare,
  getClaimBreakdown,
  getSeasonProgress,
  getIYMintAmount,
  CONTRACT,
} from '@/lib/money-flow';
import {
  connectWallet,
  fetchSeasonData,
  fetchDepositorInfo,
  fetchLeaderboard,
  fetchWBTCBalance,
  fetchIYBalance,
  depositWBTC,
  claimYield,
  harvestYield,
  CONTRACT_ADDRESSES,
} from '@/lib/vault-client';
import type { WalletInterface } from 'starkzap';

// =====================================================================
//  Constants
// =====================================================================

const BTC_PRICE_USD = 97000; // TODO: fetch from CoinGecko
const IS_TESTNET = process.env.NEXT_PUBLIC_NETWORK !== 'mainnet';
const CONTRACTS_DEPLOYED = CONTRACT_ADDRESSES.vault !== '0x0';

// =====================================================================
//  Sub-components
// =====================================================================

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: 'orange' | 'green' | 'purple';
}) {
  const color =
    accent === 'orange' ? 'text-orange-400' :
    accent === 'green'  ? 'text-emerald-400' :
                          'text-violet-400';
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 flex flex-col gap-1">
      <span className="text-xs text-slate-400 uppercase tracking-wider">{label}</span>
      <span className={`text-2xl font-bold font-mono ${color}`}>{value}</span>
      {sub && <span className="text-xs text-slate-500">{sub}</span>}
    </div>
  );
}

function SeasonBar({ pct, isOver }: { pct: number; isOver: boolean }) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>Season progress</span>
        <span>{isOver ? 'ENDED — call end_season()' : `${pct}%`}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isOver ? 'bg-red-500' : 'bg-violet-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const label = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
  return <span className="font-mono text-sm">{label}</span>;
}

function TxOverlay({ pending, hash, error, onClose }: {
  pending: boolean;
  hash: string | null;
  error: string | null;
  onClose: () => void;
}) {
  if (!pending && !hash && !error) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="rounded-2xl border border-white/10 bg-[#12121a] p-8 max-w-sm w-full mx-4 flex flex-col gap-4">
        {pending && (
          <>
            <div className="w-12 h-12 mx-auto rounded-full border-4 border-violet-500/30 border-t-violet-500 animate-spin" />
            <p className="text-center text-slate-300">Confirming on-chain…</p>
          </>
        )}
        {hash && !pending && (
          <>
            <div className="w-12 h-12 mx-auto text-3xl text-center">✅</div>
            <p className="text-center text-emerald-400 font-semibold">Transaction confirmed</p>
            <a
              href={`https://sepolia.voyager.online/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-center text-violet-400 hover:underline break-all"
            >
              {hash}
            </a>
            <button onClick={onClose} className="mt-2 rounded-lg bg-white/10 hover:bg-white/20 py-2 text-sm">
              Close
            </button>
          </>
        )}
        {error && (
          <>
            <div className="w-12 h-12 mx-auto text-3xl text-center">❌</div>
            <p className="text-center text-red-400 font-semibold">Error</p>
            <p className="text-xs text-center text-slate-400 break-words">{error}</p>
            <button onClick={onClose} className="mt-2 rounded-lg bg-white/10 hover:bg-white/20 py-2 text-sm">
              Dismiss
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// =====================================================================
//  Main Page
// =====================================================================

export default function Home() {
  const {
    wallet, season, depositorInfo, leaderboard, leaderboardLoading, tx,
    setWallet, disconnectWallet, setSeason, setDepositorInfo,
    setLeaderboard, setLeaderboardLoading, setTx, clearTx, setLastRefreshed,
  } = useVaultStore();

  const [walletInterface, setWalletInterface] = useState<WalletInterface | null>(null);
  const [depositInput, setDepositInput] = useState('');
  const [activeTab, setActiveTab] = useState<'deposit' | 'leaderboard' | 'yield'>('deposit');

  // ------------------------------------------------------------------
  //  Data refresh
  // ------------------------------------------------------------------

  const refreshChainData = useCallback(async () => {
    if (!CONTRACTS_DEPLOYED) return;
    try {
      const s = await fetchSeasonData();
      setSeason(s);

      const lb = await fetchLeaderboard();
      setLeaderboard(lb);
      setLeaderboardLoading(false);

      if (wallet.address) {
        const info = await fetchDepositorInfo(wallet.address);
        setDepositorInfo(info);
        const wbtcBal = await fetchWBTCBalance(wallet.address);
        const iyBal = await fetchIYBalance(wallet.address);
        setWallet({ wbtcBalance: wbtcBal, iyBalance: iyBal });
      }
      setLastRefreshed(Date.now());
    } catch (e) {
      console.error('Chain data refresh failed:', e);
    }
  }, [wallet.address]); // eslint-disable-line

  useEffect(() => {
    refreshChainData();
    const interval = setInterval(refreshChainData, 30_000);
    return () => clearInterval(interval);
  }, [refreshChainData]);

  // ------------------------------------------------------------------
  //  Wallet
  // ------------------------------------------------------------------

  const handleConnect = async () => {
    setWallet({ loading: true });
    try {
      const { address, wallet: w } = await connectWallet();
      setWalletInterface(w);
      setWallet({ connected: true, address, loading: false });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setWallet({ loading: false });
      setTx({ error: msg });
    }
  };

  // ------------------------------------------------------------------
  //  Deposit
  // ------------------------------------------------------------------

  const handleDeposit = async () => {
    if (!walletInterface || !depositInput) return;
    const amountSats = formatBTCInput(depositInput);
    if (amountSats <= 0n) return;

    setTx({ pending: true, error: null, hash: null });
    try {
      const hash = await depositWBTC(walletInterface, amountSats);
      setTx({ pending: false, hash });
      setDepositInput('');
      setTimeout(refreshChainData, 2000);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setTx({ pending: false, error: msg });
    }
  };

  // ------------------------------------------------------------------
  //  Claim
  // ------------------------------------------------------------------

  const handleClaim = async () => {
    if (!walletInterface) return;
    setTx({ pending: true, error: null, hash: null });
    try {
      const hash = await claimYield(walletInterface);
      setTx({ pending: false, hash });
      setTimeout(refreshChainData, 2000);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setTx({ pending: false, error: msg });
    }
  };

  // ------------------------------------------------------------------
  //  Harvest
  // ------------------------------------------------------------------

  const handleHarvest = async () => {
    if (!walletInterface) return;
    setTx({ pending: true, error: null, hash: null });
    try {
      const hash = await harvestYield(walletInterface);
      setTx({ pending: false, hash });
      setTimeout(refreshChainData, 2000);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setTx({ pending: false, error: msg });
    }
  };

  // ------------------------------------------------------------------
  //  Derived state
  // ------------------------------------------------------------------

  const seasonProgress = getSeasonProgress(season.currentBlock, season.seasonStartBlock);
  const depositSats = formatBTCInput(depositInput);
  const iyPreview = depositSats > 0n ? getIYMintAmount(depositSats) : null;

  const claimBreakdown = depositorInfo
    ? getClaimBreakdown(
        depositorInfo.claimable_yield,
        season.currentBlock,
        depositorInfo.last_claim_block,
      )
    : null;

  const yieldShares = getTop10YieldShares(season.yieldPool);

  const proRataShare = depositorInfo
    ? getDepositorProRataShare(depositorInfo.principal, season.totalDeposited, season.yieldPool)
    : 0n;

  // ------------------------------------------------------------------
  //  Render
  // ------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      <TxOverlay
        pending={tx.pending}
        hash={tx.hash}
        error={tx.error}
        onClose={clearTx}
      />

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-tight">∞ INFINIYIELD</span>
            <span className="hidden sm:inline text-xs text-slate-500 border border-white/10 rounded px-2 py-0.5">
              {IS_TESTNET ? 'SEPOLIA' : 'MAINNET'}
            </span>
          </div>

          {wallet.connected ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-slate-400">{formatAddress(wallet.address!)}</p>
                <p className="text-xs text-orange-400 font-mono">{formatBTC(wallet.wbtcBalance)} wBTC</p>
              </div>
              <button
                onClick={() => { setWalletInterface(null); disconnectWallet(); }}
                className="text-xs text-slate-400 hover:text-slate-200 border border-white/10 rounded px-3 py-1.5"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={wallet.loading}
              className="rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 px-4 py-2 text-sm font-semibold transition-colors"
            >
              {wallet.loading ? 'Connecting…' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-10">

        {/* ── Hero ── */}
        <section className="text-center flex flex-col gap-4">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Trap the Whale
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-base leading-relaxed">
            Deposit wBTC permanently. Earn yield from DeFi.
            The top 10 depositors share <span className="text-orange-400 font-semibold">70%</span> of all yield each season.
            There is no withdraw. This is the game.
          </p>
          {!CONTRACTS_DEPLOYED && (
            <div className="inline-flex items-center gap-2 mx-auto border border-yellow-500/30 bg-yellow-500/10 rounded-lg px-4 py-2 text-sm text-yellow-300">
              ⚠ Contracts not yet deployed — connect to interact once live
            </div>
          )}
        </section>

        {/* ── Season Stats ── */}
        <section className="flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              label="Total Locked"
              value={formatBTC(season.totalDeposited)}
              sub={formatUSD(season.totalDeposited, BTC_PRICE_USD)}
              accent="orange"
            />
            <StatCard
              label="Yield Pool"
              value={formatBTC(season.yieldPool)}
              sub={`Season #${season.seasonNumber}`}
              accent="green"
            />
            <StatCard
              label="Season"
              value={`#${season.seasonNumber}`}
              sub={`Block ${season.currentBlock}`}
              accent="purple"
            />
            <StatCard
              label="Block"
              value={season.currentBlock > 0n ? season.currentBlock.toString() : '—'}
              sub="current"
            />
          </div>
          <SeasonBar pct={seasonProgress.percentComplete} isOver={seasonProgress.isOver} />
        </section>

        {/* ── Tabs ── */}
        <section>
          <div className="flex border-b border-white/10 mb-6">
            {(['deposit', 'leaderboard', 'yield'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-violet-500 text-violet-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ─ Deposit Tab ─ */}
          {activeTab === 'deposit' && (
            <div className="grid sm:grid-cols-2 gap-6">

              {/* Deposit form */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4">
                <div>
                  <h2 className="text-lg font-bold">Lock wBTC</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Permanent. No withdraw. Your principal stays forever and earns yield every season.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Amount (BTC)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.0001"
                    placeholder="0.001"
                    value={depositInput}
                    onChange={(e) => setDepositInput(e.target.value)}
                    className="rounded-lg bg-white/10 border border-white/10 px-4 py-3 font-mono text-sm focus:outline-none focus:border-violet-500 transition-colors"
                  />
                  {wallet.connected && (
                    <button
                      onClick={() => setDepositInput(
                        (Number(wallet.wbtcBalance) / 1e8).toFixed(8)
                      )}
                      className="text-xs text-violet-400 hover:text-violet-300 self-start"
                    >
                      Max: {formatBTC(wallet.wbtcBalance)}
                    </button>
                  )}
                </div>

                {depositSats > 0n && (
                  <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Deposit</span>
                      <span className="font-mono">{formatSats(depositSats)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">IY tokens minted</span>
                      <span className="font-mono text-violet-400">
                        {iyPreview ? (Number(iyPreview) / 1e18).toFixed(2) : '0'} IY
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Withdraw</span>
                      <span className="text-red-400 font-semibold">Never</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleDeposit}
                  disabled={!wallet.connected || depositSats <= 0n || tx.pending}
                  className="rounded-lg bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed py-3 font-bold text-sm transition-colors"
                >
                  {!wallet.connected ? 'Connect wallet first' : 'Lock wBTC Forever'}
                </button>
              </div>

              {/* My position */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4">
                <h2 className="text-lg font-bold">My Position</h2>

                {!wallet.connected ? (
                  <p className="text-sm text-slate-400">Connect wallet to see your position.</p>
                ) : !depositorInfo || depositorInfo.principal === 0n ? (
                  <p className="text-sm text-slate-400">No deposits yet. Lock wBTC to start earning.</p>
                ) : (
                  <>
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Principal locked</span>
                        <span className="font-mono text-orange-400">{formatBTC(depositorInfo.principal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Score</span>
                        <span className="font-mono text-violet-400">{formatScore(depositorInfo.score)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Claimable yield</span>
                        <span className="font-mono text-emerald-400">{formatBTC(depositorInfo.claimable_yield)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Pro-rata this season</span>
                        <span className="font-mono text-slate-300">{formatBTC(proRataShare)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">IY balance</span>
                        <span className="font-mono text-violet-400">{(Number(wallet.iyBalance) / 1e18).toFixed(2)} IY</span>
                      </div>
                    </div>

                    {claimBreakdown && (
                      <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm flex flex-col gap-1">
                        {claimBreakdown.canClaim ? (
                          <>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Gross</span>
                              <span className="font-mono">{formatSats(claimBreakdown.gross)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Fee (1%)</span>
                              <span className="font-mono text-red-400">−{formatSats(claimBreakdown.fee)}</span>
                            </div>
                            <div className="flex justify-between font-semibold">
                              <span>Net</span>
                              <span className="font-mono text-emerald-400">{formatSats(claimBreakdown.net)}</span>
                            </div>
                          </>
                        ) : (
                          <p className="text-yellow-400 text-xs">{claimBreakdown.reason}</p>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={handleClaim}
                        disabled={!claimBreakdown?.canClaim || tx.pending}
                        className="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed py-2.5 font-semibold text-sm transition-colors"
                      >
                        Claim Yield
                      </button>
                      <button
                        onClick={handleHarvest}
                        disabled={tx.pending}
                        className="rounded-lg border border-white/10 hover:bg-white/10 px-4 py-2.5 text-sm transition-colors"
                        title="Pull latest yield from DeFi source into the season pool"
                      >
                        Harvest
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ─ Leaderboard Tab ─ */}
          {activeTab === 'leaderboard' && (
            <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-bold">Top 10 Depositors</h2>
                <span className="text-xs text-slate-400">
                  Share 70% of season yield — quadratic distribution
                </span>
              </div>

              {leaderboardLoading || leaderboard.length === 0 ? (
                <div className="px-6 py-12 text-center text-slate-400 text-sm">
                  {leaderboardLoading ? 'Loading…' : 'No depositors yet. Be first.'}
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {leaderboard.map((entry) => {
                    const share = yieldShares.find((s) => s.rank === entry.rank);
                    const isMe = wallet.address?.toLowerCase() === entry.addr.toLowerCase();
                    return (
                      <div
                        key={entry.addr}
                        className={`px-6 py-4 flex items-center gap-4 ${isMe ? 'bg-violet-500/10' : ''}`}
                      >
                        <div className="w-10 text-center">
                          <RankBadge rank={entry.rank} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-sm truncate">
                            {formatAddress(entry.addr)}
                            {isMe && <span className="ml-2 text-xs text-violet-400">you</span>}
                          </p>
                          <p className="text-xs text-slate-400">
                            Score: {formatScore(entry.score)}
                          </p>
                        </div>
                        <div className="text-right">
                          {share && (
                            <>
                              <p className="text-sm font-semibold text-emerald-400">{share.pctLabel}</p>
                              <p className="text-xs text-slate-400">of total yield</p>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ─ Yield Tab ─ */}
          {activeTab === 'yield' && (
            <div className="flex flex-col gap-6">

              {/* Distribution breakdown */}
              <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10">
                  <h2 className="font-bold">Season Yield Distribution</h2>
                  <p className="text-sm text-slate-400 mt-0.5">
                    Pool: <span className="text-emerald-400 font-mono">{formatBTC(season.yieldPool)}</span>
                    {' '}(from Vesu DeFi yield on locked wBTC)
                  </p>
                </div>
                <div className="divide-y divide-white/5">
                  {/* Top 10 rows */}
                  {yieldShares.map((s) => (
                    <div key={s.rank} className="px-6 py-3 flex items-center gap-4 text-sm">
                      <div className="w-10 text-center">
                        <RankBadge rank={s.rank} />
                      </div>
                      <div className="flex-1">
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${s.fractionOfTotal * 100 * 3}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right w-28">
                        <span className="font-mono text-emerald-400">{s.pctLabel}</span>
                        <span className="text-slate-500 text-xs ml-1">of pool</span>
                      </div>
                      <div className="text-right w-36 font-mono text-xs text-slate-300">
                        {formatBTC(s.amountSatoshis)}
                      </div>
                    </div>
                  ))}
                  {/* Pro-rata row */}
                  <div className="px-6 py-3 flex items-center gap-4 text-sm bg-white/[0.02]">
                    <div className="w-10 text-center text-slate-400 text-xs">All</div>
                    <div className="flex-1 text-slate-400">All depositors — pro-rata by principal</div>
                    <div className="text-right w-28 font-mono text-violet-400">20.00%</div>
                    <div className="text-right w-36 font-mono text-xs text-slate-300">
                      {formatBTC((season.yieldPool * CONTRACT.YIELD_DEPOSITORS_PCT) / CONTRACT.PCT_DENOM)}
                    </div>
                  </div>
                  {/* Treasury row */}
                  <div className="px-6 py-3 flex items-center gap-4 text-sm bg-white/[0.02]">
                    <div className="w-10 text-center text-slate-400 text-xs">⚙</div>
                    <div className="flex-1 text-slate-400">Treasury</div>
                    <div className="text-right w-28 font-mono text-slate-400">10.00%</div>
                    <div className="text-right w-36 font-mono text-xs text-slate-300">
                      {formatBTC((season.yieldPool * CONTRACT.YIELD_TREASURY_PCT) / CONTRACT.PCT_DENOM)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scoring explainer */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-bold mb-3">How scoring works</h3>
                <div className="text-sm text-slate-300 space-y-2 font-mono">
                  <p>score = principal_sats × t_effective / 100</p>
                  <p className="text-slate-400 font-sans text-xs mt-2">
                    t_effective accumulates per block — tiered to reward long-term holders:
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-xs mt-2">
                    <div className="rounded bg-white/5 px-3 py-2">
                      <p className="text-slate-400">Days 1–45</p>
                      <p className="text-violet-400 font-bold">+100 / day</p>
                    </div>
                    <div className="rounded bg-white/5 px-3 py-2">
                      <p className="text-slate-400">Days 46–90</p>
                      <p className="text-violet-400 font-bold">+70 / day</p>
                    </div>
                    <div className="rounded bg-white/5 px-3 py-2">
                      <p className="text-slate-400">Days 91+</p>
                      <p className="text-violet-400 font-bold">+40 / day</p>
                    </div>
                  </div>
                  <p className="text-slate-400 font-sans text-xs mt-2">
                    Anti-sybil: splitting 1 BTC across 2 wallets gives identical total score. Zero advantage.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

      </main>

      <footer className="border-t border-white/10 mt-20 py-8 text-center text-xs text-slate-500">
        INFINIYIELD — Starknet · {IS_TESTNET ? 'Sepolia testnet' : 'Mainnet'} ·{' '}
        <a
          href="https://github.com/spiritclawd/infiniyield"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-slate-300"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}
