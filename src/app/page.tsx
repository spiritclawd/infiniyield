'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useVaultStore } from '@/store/game-store';
import {
  formatBTC,
  formatSats,
  formatScore,
  formatBTCInput,
  getTop10YieldShares,
  getClaimBreakdown,
  getIYMintAmount,
  CONTRACT,
} from '@/lib/money-flow';
import {
  connectCartridge,
  disconnectCartridge,
  fetchSeasonData,
  fetchDepositorInfo,
  fetchLeaderboard,
  fetchTokenBalance,
  depositWBTC,
  claimYield,
  harvestYield,
  mintMockWBTC,
  CONTRACT_ADDRESSES,
  CONTRACTS_DEPLOYED,
} from '@/lib/vault-client';
import type ControllerProvider from '@cartridge/controller';
import WhaleAsset from '@/components/WhaleAsset';
import BitcoinGlow from '@/components/BitcoinGlow';
import BubbleField from '@/components/BubbleField';
import DepthLines from '@/components/DepthLines';

// =====================================================================
//  Helpers
// =====================================================================

function truncate(addr: string): string {
  if (!addr || addr.length < 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function satsToBTCDisplay(sats: bigint): string {
  if (sats === 0n) return '0.00000000';
  const btc = Number(sats) / 1e8;
  return btc.toFixed(8);
}

// =====================================================================
//  Main Page
// =====================================================================

export default function Home() {
  const {
    wallet,
    season,
    depositorInfo,
    leaderboard,
    leaderboardLoading,
    tx,
    setWallet,
    disconnectWallet,
    setSeason,
    setDepositorInfo,
    setLeaderboard,
    setLeaderboardLoading,
    setTx,
    clearTx,
    setLastRefreshed,
  } = useVaultStore();

  // depositAmount stays as raw string; we derive sats via formatBTCInput
  const [depositAmountStr, setDepositAmountStr] = useState('');
  const [controllerRef, setControllerRef] = useState<ControllerProvider | null>(null);
  const depositSectionRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------------
  //  Data loading
  // ---------------------------------------------------------------

  const loadPublicData = useCallback(async () => {
    if (!CONTRACTS_DEPLOYED) return;
    try {
      setLeaderboardLoading(true);
      const [seasonData, lb] = await Promise.all([
        fetchSeasonData(),
        fetchLeaderboard(),
      ]);
      if (seasonData) setSeason(seasonData);
      setLeaderboard(lb);
      setLastRefreshed(Date.now());
    } catch (e) {
      console.error('Failed to load public data', e);
    } finally {
      setLeaderboardLoading(false);
    }
  }, [setSeason, setLeaderboard, setLastRefreshed, setLeaderboardLoading]);

  const loadUserData = useCallback(async (address: string) => {
    if (!CONTRACTS_DEPLOYED) return;
    try {
      const [info, wbtc, iy] = await Promise.all([
        fetchDepositorInfo(address),
        fetchTokenBalance(CONTRACT_ADDRESSES.wbtc, address),
        fetchTokenBalance(CONTRACT_ADDRESSES.iyToken, address),
      ]);
      setDepositorInfo(info);
      setWallet({ wbtcBalance: wbtc, iyBalance: iy });
    } catch (e) {
      console.error('Failed to load user data', e);
    }
  }, [setDepositorInfo, setWallet]);

  useEffect(() => {
    loadPublicData();
    const interval = setInterval(loadPublicData, 30_000);
    return () => clearInterval(interval);
  }, [loadPublicData]);

  useEffect(() => {
    if (wallet.connected && wallet.address) {
      loadUserData(wallet.address);
    }
  }, [wallet.connected, wallet.address, loadUserData]);

  // ---------------------------------------------------------------
  //  Wallet actions
  // ---------------------------------------------------------------

  const handleConnect = async () => {
    try {
      setWallet({ loading: true });
      const { controller, address } = await connectCartridge();
      setControllerRef(controller);
      setWallet({ connected: true, address, loading: false });
    } catch (e) {
      console.error('Connect failed', e);
      setWallet({ loading: false });
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectCartridge();
    } catch { /* ignore */ }
    disconnectWallet();
    setControllerRef(null);
  };

  // ---------------------------------------------------------------
  //  Mint faucet
  // ---------------------------------------------------------------

  const FAUCET_AMOUNT_SATS = 100_000n; // 0.001 wBTC test amount

  const handleMint = async () => {
    if (!controllerRef || !wallet.address) return;
    setTx({ pending: true, hash: null, error: null });
    try {
      const hash = await mintMockWBTC(controllerRef, wallet.address, FAUCET_AMOUNT_SATS);
      setTx({ pending: false, hash });
      await loadUserData(wallet.address);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setTx({ pending: false, hash: null, error: msg });
    }
  };

  // ---------------------------------------------------------------
  //  Deposit
  // ---------------------------------------------------------------

  const handleDeposit = async () => {
    if (!controllerRef || !depositAmountStr) return;
    const sats = formatBTCInput(depositAmountStr);
    if (sats === 0n) return;

    setTx({ pending: true, hash: null, error: null });
    try {
      // depositWBTC(controller, amountSats) — 2 args
      const hash = await depositWBTC(controllerRef, sats);
      setTx({ pending: false, hash });
      setDepositAmountStr('');
      await loadPublicData();
      if (wallet.address) await loadUserData(wallet.address);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setTx({ pending: false, hash: null, error: msg });
    }
  };

  // ---------------------------------------------------------------
  //  Claim
  // ---------------------------------------------------------------

  const handleClaim = async () => {
    if (!controllerRef) return;
    setTx({ pending: true, hash: null, error: null });
    try {
      // claimYield(controller) — 1 arg
      const hash = await claimYield(controllerRef);
      setTx({ pending: false, hash });
      if (wallet.address) await loadUserData(wallet.address);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setTx({ pending: false, hash: null, error: msg });
    }
  };

  // ---------------------------------------------------------------
  //  Harvest (seasonal)
  // ---------------------------------------------------------------

  const handleHarvest = async () => {
    if (!controllerRef) return;
    setTx({ pending: true, hash: null, error: null });
    try {
      // harvestYield(controller) — 1 arg
      const hash = await harvestYield(controllerRef);
      setTx({ pending: false, hash });
      await loadPublicData();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setTx({ pending: false, hash: null, error: msg });
    }
  };

  // ---------------------------------------------------------------
  //  Computed values
  // ---------------------------------------------------------------

  const depositSats = formatBTCInput(depositAmountStr);
  const iyToMint = depositSats > 0n ? getIYMintAmount(depositSats) : 0n;

  const yieldShares = getTop10YieldShares(season.yieldPool, leaderboard.length);

  // getClaimBreakdown(claimableYield, currentBlock, lastClaimBlock)
  const claimBreakdown = depositorInfo
    ? getClaimBreakdown(
        depositorInfo.claimable_yield,
        season.currentBlock,
        depositorInfo.last_claim_block,
      )
    : null;

  const totalDepositors = leaderboard.length;

  // Max score for depth bars
  const maxScore = leaderboard.length > 0
    ? leaderboard.reduce((m, e) => (e.score > m ? e.score : m), 1n)
    : 1n;

  // ---------------------------------------------------------------
  //  Render
  // ---------------------------------------------------------------

  return (
    <div style={{ background: '#07080F', minHeight: '100vh', color: '#F8FAFC' }}>

      {/* ============================================================
          SECTION 1: HERO
          ============================================================ */}
      <section
        style={{
          minHeight: '100vh',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #070C1F 0%, #07080F 60%, #050608 100%)',
          overflow: 'hidden',
          padding: '0 24px',
        }}
      >
        {/* Depth lines background */}
        <DepthLines />

        {/* Bubbles */}
        <BubbleField count={25} />

        {/* Whale silhouette — barely visible, far right */}
        <div
          className="whale-drift"
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '-40px',
            opacity: 0.12,
            pointerEvents: 'none',
          }}
        >
          <WhaleAsset />
        </div>

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '820px' }}>
          {/* Bitcoin icon */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <BitcoinGlow size={72} />
          </div>

          {/* Title */}
          <h1
            className="glow-title"
            style={{
              fontSize: 'clamp(48px, 10vw, 96px)',
              fontWeight: '900',
              letterSpacing: '-0.02em',
              color: '#F7931A',
              lineHeight: 1,
              marginBottom: '24px',
            }}
          >
            INFINIYIELD
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(16px, 2.5vw, 22px)',
              color: '#94A3B8',
              lineHeight: 1.6,
              maxWidth: '600px',
              margin: '0 auto 16px',
            }}
          >
            The vault that never closes.
            <br />
            <span style={{ color: '#F8FAFC', fontWeight: 500 }}>
              wBTC locked forever, yield flowing forever.
            </span>
          </p>

          <p
            style={{
              fontSize: '15px',
              color: '#6C5CE7',
              marginBottom: '48px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Commit capital · Earn yield · Every season, the deepest whales win
          </p>

          {/* CTA */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn-vault"
              onClick={() => depositSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
              style={{ fontSize: '17px', padding: '16px 40px' }}
            >
              Enter the Vault ↓
            </button>
            <button
              className="btn-ghost"
              onClick={() => document.getElementById('leaderboard')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View the Depths
            </button>
          </div>

          {/* Scroll hint */}
          <p style={{ marginTop: '64px', color: '#1E2035', fontSize: '13px', letterSpacing: '0.1em' }}>
            ▼ ▼ ▼
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: WHAT IS TRAP THE WHALE
          ============================================================ */}
      <section
        style={{
          padding: '100px 24px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{ color: '#6C5CE7', fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 600 }}>
            Protocol
          </p>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: '800', color: '#F8FAFC', marginBottom: '16px' }}>
            Trap the Whale
          </h2>
          <p style={{ color: '#64748B', fontSize: '18px', maxWidth: '500px', margin: '0 auto' }}>
            A yield competition built on permanent commitment.
          </p>
        </div>

        {/* 3 cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '48px' }}>
          {/* Lock Forever */}
          <div className="ocean-card" style={{ padding: '32px' }}>
            <div style={{ fontSize: '36px', marginBottom: '20px' }}>🔒</div>
            <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#F8FAFC', marginBottom: '12px' }}>
              Lock Forever
            </h3>
            <p style={{ color: '#64748B', lineHeight: 1.7 }}>
              Deposit wBTC. It never comes back.
              <span style={{ color: '#F7931A', fontWeight: 600 }}> The game is commitment.</span>
              <br /><br />
              No rug. No exit. No second thoughts.
            </p>
            <div style={{ marginTop: '24px', height: '2px', background: 'linear-gradient(90deg, #F7931A44, transparent)' }} />
          </div>

          {/* Earn Forever */}
          <div className="ocean-card" style={{ padding: '32px' }}>
            <div style={{ fontSize: '36px', marginBottom: '20px' }}>∞</div>
            <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#F8FAFC', marginBottom: '12px' }}>
              Earn Forever
            </h3>
            <p style={{ color: '#64748B', lineHeight: 1.7 }}>
              Your BTC generates yield through Vesu DeFi
              <span style={{ color: '#00D8A4', fontWeight: 600 }}> every block</span>.
              <br /><br />
              Each season the pool resets, yield flows again.
            </p>
            <div style={{ marginTop: '24px', height: '2px', background: 'linear-gradient(90deg, #00D8A444, transparent)' }} />
          </div>

          {/* Win by Weight */}
          <div className="ocean-card" style={{ padding: '32px' }}>
            <div style={{ fontSize: '36px', marginBottom: '20px' }}>🏆</div>
            <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#F8FAFC', marginBottom: '12px' }}>
              Win by Weight
            </h3>
            <p style={{ color: '#64748B', lineHeight: 1.7 }}>
              Top 10 depositors share
              <span style={{ color: '#6C5CE7', fontWeight: 600 }}> 70% of yield</span>.
              Quadratic weighting — the more you commit, the more you earn.
            </p>
            <div style={{ marginTop: '24px', height: '2px', background: 'linear-gradient(90deg, #6C5CE744, transparent)' }} />
          </div>
        </div>

        {/* Live stats bar */}
        <div className="stats-bar">
          <div className="stats-item">
            <div style={{ color: '#64748B', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>TVL</div>
            <div style={{ color: '#F7931A', fontWeight: '700', fontSize: '18px' }}>
              {season.totalDeposited > 0n ? formatBTC(season.totalDeposited) : '—'}
            </div>
          </div>
          <div className="stats-item">
            <div style={{ color: '#64748B', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Yield Pool</div>
            <div style={{ color: '#00D8A4', fontWeight: '700', fontSize: '18px' }}>
              {season.yieldPool > 0n ? formatSats(season.yieldPool) : '—'}
            </div>
          </div>
          <div className="stats-item">
            <div style={{ color: '#64748B', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Season</div>
            <div style={{ color: '#6C5CE7', fontWeight: '700', fontSize: '18px' }}>
              #{season.seasonNumber > 0n ? season.seasonNumber.toString() : '—'}
            </div>
          </div>
          <div className="stats-item">
            <div style={{ color: '#64748B', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Whales</div>
            <div style={{ color: '#F8FAFC', fontWeight: '700', fontSize: '18px' }}>
              {totalDepositors > 0 ? totalDepositors : '—'}
            </div>
          </div>
          <div className="stats-item">
            <div style={{ color: '#64748B', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Block</div>
            <div style={{ color: '#F8FAFC', fontWeight: '700', fontSize: '18px' }}>
              {season.currentBlock > 0n ? `#${season.currentBlock.toString()}` : '—'}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: LEADERBOARD — THE DEPTHS
          ============================================================ */}
      <section
        id="leaderboard"
        style={{
          padding: '100px 24px',
          background: 'linear-gradient(180deg, #07080F 0%, #0A0C18 50%, #07080F 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <DepthLines />

        {/* Whale in background */}
        <div
          className="whale-drift"
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '-60px',
            opacity: 0.06,
            pointerEvents: 'none',
            transform: 'scaleX(-1)',
          }}
        >
          <WhaleAsset />
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p style={{ color: '#6C5CE7', fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 600 }}>
              Leaderboard
            </p>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: '800', color: '#F8FAFC', marginBottom: '12px' }}>
              The Depths
            </h2>
            <p style={{ color: '#64748B', fontSize: '17px' }}>
              Who&apos;s committed the most
            </p>
          </div>

          {/* Leaderboard */}
          {leaderboardLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="shimmer" style={{ height: '72px', borderRadius: '10px' }} />
              ))}
            </div>
          ) : leaderboard.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 24px',
                border: '1px dashed #1E2035',
                borderRadius: '16px',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🐋</div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#F8FAFC', marginBottom: '12px' }}>
                Be the first whale
              </h3>
              <p style={{ color: '#64748B' }}>
                No one has committed yet. The ocean floor awaits.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Header */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '48px 1fr 140px 120px 90px',
                  gap: '16px',
                  padding: '8px 20px',
                  color: '#64748B',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                <span>#</span>
                <span>Address</span>
                <span style={{ textAlign: 'right' }}>wBTC Locked</span>
                <span style={{ textAlign: 'right' }}>Score</span>
                <span style={{ textAlign: 'right' }}>Yield Share</span>
              </div>

              {leaderboard.map((entry, idx) => {
                const share = yieldShares[idx];
                const barWidth = maxScore > 0n
                  ? Math.round(Number((entry.score * 100n) / maxScore))
                  : 0;
                const isWinner = entry.rank === 1;

                return (
                  <div
                    key={entry.addr}
                    style={{
                      background: isWinner
                        ? 'linear-gradient(90deg, #1a0e0022, #F7931A08)'
                        : '#0E1020',
                      border: `1px solid ${isWinner ? '#7A4A0D' : '#1E2035'}`,
                      borderRadius: '10px',
                      padding: '16px 20px',
                      display: 'grid',
                      gridTemplateColumns: '48px 1fr 140px 120px 90px',
                      gap: '16px',
                      alignItems: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Depth bar background */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        height: '2px',
                        width: `${barWidth}%`,
                        background: isWinner
                          ? 'linear-gradient(90deg, #F7931A, transparent)'
                          : 'linear-gradient(90deg, #6C5CE7, transparent)',
                        opacity: 0.5,
                      }}
                    />

                    {/* Rank */}
                    <div>
                      {entry.rank === 1 ? (
                        <span style={{ fontSize: '22px' }}>🐋</span>
                      ) : (
                        <span className="rank-number">{entry.rank}</span>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <span style={{ fontFamily: 'monospace', fontSize: '14px', color: '#94A3B8' }}>
                        {truncate(entry.addr)}
                      </span>
                      {wallet.address && entry.addr.toLowerCase() === wallet.address.toLowerCase() && (
                        <span style={{
                          marginLeft: '8px',
                          background: '#6C5CE722',
                          color: '#6C5CE7',
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 600,
                        }}>
                          YOU
                        </span>
                      )}
                    </div>

                    {/* wBTC */}
                    <div style={{ textAlign: 'right', fontWeight: '600', color: '#F7931A', fontSize: '14px' }}>
                      {entry.principal != null
                        ? `${satsToBTCDisplay(entry.principal)} BTC`
                        : '—'}
                    </div>

                    {/* Score */}
                    <div style={{ textAlign: 'right', color: '#94A3B8', fontSize: '14px' }}>
                      {formatScore(entry.score)}
                    </div>

                    {/* Yield share */}
                    <div style={{ textAlign: 'right', color: isWinner ? '#F7931A' : '#6C5CE7', fontWeight: '700', fontSize: '14px' }}>
                      {share ? share.pctLabel : '—'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Yield split explanation */}
          <div
            style={{
              marginTop: '40px',
              padding: '20px 24px',
              background: '#0D0F1A',
              border: '1px solid #1E2035',
              borderRadius: '10px',
              display: 'flex',
              gap: '32px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#F7931A', fontWeight: '700', fontSize: '20px' }}>70%</div>
              <div style={{ color: '#64748B', fontSize: '12px' }}>Top 10 (Quadratic)</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#00D8A4', fontWeight: '700', fontSize: '20px' }}>20%</div>
              <div style={{ color: '#64748B', fontSize: '12px' }}>All Depositors (Pro-rata)</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#64748B', fontWeight: '700', fontSize: '20px' }}>10%</div>
              <div style={{ color: '#64748B', fontSize: '12px' }}>Treasury</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: VAULT ENTRY
          ============================================================ */}
      <section
        ref={depositSectionRef}
        id="deposit"
        style={{
          padding: '100px 24px',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ color: '#F7931A', fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 600 }}>
            Vault
          </p>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: '800', color: '#F8FAFC', marginBottom: '12px' }}>
            Go Deeper
          </h2>
          <p style={{ color: '#64748B', fontSize: '17px' }}>
            Commit your capital. Join the whales.
          </p>
        </div>

        {/* Permanent warning */}
        <div className="warning-banner" style={{ marginBottom: '32px' }}>
          <span>⚠</span>
          <span>No withdraw function. This is permanent. The vault never gives back.</span>
        </div>

        {/* Not deployed notice */}
        {!CONTRACTS_DEPLOYED && (
          <div
            style={{
              background: '#2D260022',
              border: '1px solid #2D2660',
              borderRadius: '10px',
              padding: '20px',
              marginBottom: '24px',
              color: '#6C5CE7',
              fontSize: '14px',
              textAlign: 'center',
            }}
          >
            Contracts not yet deployed. Set env vars to enable live interaction.
          </div>
        )}

        {/* Wallet connect / info */}
        <div className="btc-card" style={{ padding: '28px', marginBottom: '24px' }}>
          {!wallet.connected ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#64748B', marginBottom: '24px', fontSize: '15px' }}>
                Connect your Cartridge wallet to interact with the vault.
              </p>
              <button
                className="btn-vault"
                onClick={handleConnect}
                disabled={wallet.loading}
                style={{ width: '100%' }}
              >
                {wallet.loading ? 'Connecting…' : 'Connect Cartridge Wallet'}
              </button>
            </div>
          ) : (
            <div>
              {/* Connected state */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <div style={{ color: '#64748B', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Connected
                  </div>
                  <div style={{ fontFamily: 'monospace', color: '#F8FAFC', fontSize: '14px' }}>
                    {truncate(wallet.address ?? '')}
                  </div>
                </div>
                <button
                  onClick={handleDisconnect}
                  style={{
                    background: 'transparent',
                    border: '1px solid #1E2035',
                    color: '#64748B',
                    borderRadius: '6px',
                    padding: '8px 14px',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Disconnect
                </button>
              </div>

              {/* Balances */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: '#07080F', borderRadius: '8px', padding: '14px', border: '1px solid #1E2035' }}>
                  <div style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', marginBottom: '6px' }}>wBTC Balance</div>
                  <div style={{ color: '#F7931A', fontWeight: '700' }}>
                    {satsToBTCDisplay(wallet.wbtcBalance)} BTC
                  </div>
                </div>
                <div style={{ background: '#07080F', borderRadius: '8px', padding: '14px', border: '1px solid #1E2035' }}>
                  <div style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', marginBottom: '6px' }}>IY Tokens</div>
                  <div style={{ color: '#6C5CE7', fontWeight: '700' }}>
                    {wallet.iyBalance > 0n ? (wallet.iyBalance / BigInt(1e18)).toString() : '0'}
                  </div>
                </div>
              </div>

              {/* Faucet */}
              <button
                onClick={handleMint}
                disabled={tx.pending}
                className="btn-ghost"
                style={{ width: '100%' }}
              >
                {tx.pending ? 'Minting…' : '🚰 Mint Test wBTC (Sepolia faucet)'}
              </button>
            </div>
          )}
        </div>

        {/* Deposit form */}
        {wallet.connected && (
          <div className="ocean-card" style={{ padding: '28px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#F8FAFC' }}>
              Lock wBTC Forever
            </h3>

            {/* Amount input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#64748B', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                Amount (BTC)
              </label>
              <input
                type="number"
                className="vault-input"
                placeholder="0.001"
                value={depositAmountStr}
                onChange={(e) => setDepositAmountStr(e.target.value)}
                min="0"
                step="0.0001"
              />
            </div>

            {/* Preview */}
            {depositSats > 0n && (
              <div
                style={{
                  background: '#07080F',
                  border: '1px solid #1E2035',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '20px',
                  fontSize: '13px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748B' }}>Satoshis</span>
                  <span style={{ color: '#F8FAFC', fontWeight: 600 }}>{formatSats(depositSats)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748B' }}>IY Tokens to mint</span>
                  <span style={{ color: '#6C5CE7', fontWeight: 600 }}>
                    {iyToMint > 0n ? (iyToMint / BigInt(1e15)).toString() : '0'} mIY
                  </span>
                </div>
                <div
                  style={{
                    marginTop: '12px',
                    padding: '8px',
                    background: '#F7931A11',
                    borderRadius: '6px',
                    color: '#F7931A',
                    fontSize: '12px',
                    textAlign: 'center',
                    fontWeight: 600,
                  }}
                >
                  ⚠ This action cannot be undone. Ever.
                </div>
              </div>
            )}

            {/* Deposit button */}
            <button
              className="btn-vault"
              onClick={handleDeposit}
              disabled={tx.pending || depositSats === 0n || !CONTRACTS_DEPLOYED}
              style={{ width: '100%', fontSize: '16px' }}
            >
              {tx.pending ? 'Locking…' : '🔒 Lock wBTC Forever'}
            </button>

            {/* TX status */}
            {tx.hash && (
              <div style={{ marginTop: '16px', padding: '12px', background: '#004D3A22', border: '1px solid #00D8A433', borderRadius: '8px', fontSize: '13px' }}>
                <div style={{ color: '#00D8A4', fontWeight: 600, marginBottom: '4px' }}>✓ Transaction submitted</div>
                <div style={{ fontFamily: 'monospace', color: '#64748B', fontSize: '11px', wordBreak: 'break-all' }}>
                  {tx.hash}
                </div>
                <button
                  onClick={() => clearTx()}
                  style={{ marginTop: '8px', background: 'none', border: 'none', color: '#64748B', fontSize: '11px', cursor: 'pointer' }}
                >
                  Dismiss
                </button>
              </div>
            )}
            {tx.error && (
              <div style={{ marginTop: '16px', padding: '12px', background: '#3d000022', border: '1px solid #ff444433', borderRadius: '8px', fontSize: '13px', color: '#ff6666' }}>
                {tx.error}
                <button
                  onClick={() => clearTx()}
                  style={{ display: 'block', marginTop: '8px', background: 'none', border: 'none', color: '#64748B', fontSize: '11px', cursor: 'pointer' }}
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        )}

        {/* My Position */}
        {wallet.connected && depositorInfo && depositorInfo.principal > 0n && (
          <div className="btc-card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🐋 My Position
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: '#07080F', borderRadius: '8px', padding: '14px', border: '1px solid #1E2035' }}>
                <div style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', marginBottom: '6px' }}>wBTC Locked</div>
                <div style={{ color: '#F7931A', fontWeight: '700' }}>{satsToBTCDisplay(depositorInfo.principal)} BTC</div>
              </div>
              <div style={{ background: '#07080F', borderRadius: '8px', padding: '14px', border: '1px solid #1E2035' }}>
                <div style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', marginBottom: '6px' }}>Score</div>
                <div style={{ color: '#6C5CE7', fontWeight: '700' }}>{formatScore(depositorInfo.score)}</div>
              </div>
              <div style={{ background: '#07080F', borderRadius: '8px', padding: '14px', border: '1px solid #1E2035' }}>
                <div style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', marginBottom: '6px' }}>Claimable Yield</div>
                <div style={{ color: '#00D8A4', fontWeight: '700' }}>{formatSats(depositorInfo.claimable_yield)}</div>
              </div>
              {claimBreakdown && claimBreakdown.canClaim && (
                <div style={{ background: '#07080F', borderRadius: '8px', padding: '14px', border: '1px solid #1E2035' }}>
                  <div style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', marginBottom: '6px' }}>After 1% Fee</div>
                  <div style={{ color: '#00D8A4', fontWeight: '700' }}>{formatSats(claimBreakdown.net)}</div>
                </div>
              )}
            </div>

            {/* Cooldown message */}
            {claimBreakdown && !claimBreakdown.canClaim && claimBreakdown.reason && (
              <div style={{ marginBottom: '16px', padding: '10px 14px', background: '#2D260022', border: '1px solid #2D2660', borderRadius: '8px', color: '#6C5CE7', fontSize: '13px' }}>
                ⏳ {claimBreakdown.reason}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn-vault"
                onClick={handleClaim}
                disabled={
                  tx.pending ||
                  !claimBreakdown?.canClaim ||
                  !CONTRACTS_DEPLOYED
                }
                style={{ flex: 1 }}
              >
                {tx.pending ? 'Claiming…' : '💰 Claim Yield'}
              </button>
              <button
                className="btn-ghost"
                onClick={handleHarvest}
                disabled={tx.pending || !CONTRACTS_DEPLOYED}
                style={{ flex: 1 }}
              >
                🌾 Harvest
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ============================================================
          SECTION 5: FOOTER
          ============================================================ */}
      <footer
        style={{
          borderTop: '1px solid #1E2035',
          padding: '40px 24px',
          background: '#0D0F1A',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#F7931A', fontWeight: '900', fontSize: '18px', letterSpacing: '-0.02em' }}>INFINIYIELD</span>
              <span style={{ color: '#1E2035' }}>|</span>
              <span style={{ color: '#6C5CE7', fontSize: '13px', fontWeight: 600 }}>Starknet Sepolia</span>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#64748B', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              GitHub
            </a>
          </div>

          {/* Contract addresses */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            {Object.entries(CONTRACT_ADDRESSES).map(([key, addr]) => (
              <div key={key} style={{ fontSize: '12px' }}>
                <span style={{ color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{key}:{' '}</span>
                <span style={{ fontFamily: 'monospace', color: '#2D2660' }}>
                  {addr === '0x0' ? 'not deployed' : truncate(addr)}
                </span>
              </div>
            ))}
          </div>

          <div style={{ color: '#1E2035', fontSize: '12px', textAlign: 'center' }}>
            No withdraw function. No refunds. Pure commitment.
          </div>
        </div>
      </footer>
    </div>
  );
}
