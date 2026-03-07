'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/game-store';
import { formatBTC, calculateFeeSplit } from '@/lib/money-flow';

export default function Home() {
  const {
    wallet,
    vaults,
    selectedVaultId,
    activeRuns,
    selectedRunId,
    leaderboard,
    setWallet,
    disconnectWallet,
    selectVault,
    selectRun,
  } = useGameStore();

  const [isConnecting, setIsConnecting] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');

  const selectedVault = vaults.find((v) => v.id === selectedVaultId);
  const selectedRun = activeRuns.find((r) => r.id === selectedRunId);

  // Mock connect function
  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate connection delay
    await new Promise((r) => setTimeout(r, 1000));
    setWallet({
      connected: true,
      address: '0x1234567890abcdef1234567890abcdef12345678',
      btcBalance: 500000n, // 0.005 BTC
      loading: false,
    });
    setIsConnecting(false);
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatTimeRemaining = (endTime: number) => {
    const remaining = endTime - Date.now();
    const days = Math.floor(remaining / 86400000);
    return `${days}d remaining`;
  };

  // Calculate fee split for display
  const feeSplit = selectedRun ? calculateFeeSplit(selectedRun.entryFee) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-purple-500/20 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center animate-pulse-glow">
                <span className="text-white text-xl font-bold">∞</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">INFINIYIELD</h1>
                <p className="text-xs text-purple-400">Infinite Yield Gaming</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#vaults" className="text-gray-300 hover:text-white transition">Vaults</a>
              <a href="#runs" className="text-gray-300 hover:text-white transition">Games</a>
              <a href="#leaderboard" className="text-gray-300 hover:text-white transition">Leaderboard</a>
              <a href="#docs" className="text-gray-300 hover:text-white transition">Docs</a>
            </nav>

            {/* Wallet */}
            <div>
              {wallet.connected ? (
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm text-gray-400">Balance</p>
                    <p className="text-white font-mono">{formatBTC(wallet.btcBalance)}</p>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="bg-purple-500/20 border border-purple-500/50 px-4 py-2 rounded-xl text-purple-300 font-mono text-sm hover:bg-purple-500/30 transition"
                  >
                    {truncateAddress(wallet.address!)}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="btn-primary px-6 py-2.5 rounded-xl text-white font-bold disabled:opacity-50"
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
        
        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-purple-500 rounded-full animate-float opacity-50" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-blue-500 rounded-full animate-float opacity-50" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-green-500 rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }} />

        <div className="max-w-7xl mx-auto text-center relative">
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Play. </span>
            <span className="gradient-text">Earn. </span>
            <span className="text-white">Yield.</span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Entry fees compound into infinite yield. Top players share the vault rewards.
            <span className="text-purple-400"> 90% → Vault.</span>
            <span className="text-blue-400"> 10% → Platform.</span>
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
            <div className="stat-card rounded-2xl p-6 card-hover">
              <p className="text-gray-400 text-sm mb-1">Total Value Locked</p>
              <p className="text-2xl font-bold text-white font-mono">₿ 15.75</p>
              <p className="text-green-400 text-sm mt-1">↑ 12.3% this week</p>
            </div>
            <div className="stat-card rounded-2xl p-6 card-hover">
              <p className="text-gray-400 text-sm mb-1">Yield Distributed</p>
              <p className="text-2xl font-bold text-green-400 font-mono">₿ 2.85</p>
              <p className="text-gray-500 text-sm mt-1">All time</p>
            </div>
            <div className="stat-card rounded-2xl p-6 card-hover">
              <p className="text-gray-400 text-sm mb-1">Active Players</p>
              <p className="text-2xl font-bold text-purple-400 font-mono">1,247</p>
              <p className="text-gray-500 text-sm mt-1">Last 24h</p>
            </div>
            <div className="stat-card rounded-2xl p-6 card-hover">
              <p className="text-gray-400 text-sm mb-1">BTC APY</p>
              <p className="text-2xl font-bold text-blue-400 font-mono">5.2%</p>
              <p className="text-gray-500 text-sm mt-1">Endurance Staking</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vaults Section */}
      <section id="vaults" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white">Active Vaults</h3>
            <p className="text-gray-400">Select a vault to stake</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vaults.map((vault) => (
              <div
                key={vault.id}
                onClick={() => selectVault(vault.id)}
                className={`rounded-2xl p-6 cursor-pointer transition-all card-hover ${
                  selectedVaultId === vault.id
                    ? 'bg-purple-500/20 border-2 border-purple-500 glow-purple'
                    : 'bg-black/40 border border-purple-500/20 hover:border-purple-500/40'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white text-xl font-bold">
                      {vault.asset === 'BTC' ? '₿' : vault.asset === 'ETH' ? 'Ξ' : '$'}
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{vault.name}</h4>
                      <p className="text-gray-400 text-sm">{vault.active ? 'Active' : 'Coming Soon'}</p>
                    </div>
                  </div>
                  <div className="bg-green-500/20 px-3 py-1 rounded-full">
                    <span className="text-green-400 font-mono text-sm">{(vault.apy * 100).toFixed(1)}% APY</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Principal</span>
                    <span className="text-white font-mono">{formatBTC(vault.totalPrincipal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Accumulated Yield</span>
                    <span className="text-green-400 font-mono">+{formatBTC(vault.accumulatedYield)}</span>
                  </div>
                  <div className="h-px bg-purple-500/20" />
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Value</span>
                    <span className="text-purple-400 font-mono">{formatBTC(vault.totalPrincipal + vault.accumulatedYield)}</span>
                  </div>
                </div>

                {vault.active && selectedVaultId === vault.id && (
                  <div className="mt-6 flex gap-2">
                    <input
                      type="number"
                      placeholder="Amount in BTC"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="flex-1 bg-black/50 border border-purple-500/50 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                    />
                    <button className="btn-primary px-6 py-2 rounded-xl text-white font-bold">
                      Stake
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-12">How INFINIYIELD Works</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            {[
              { icon: '🎮', title: '1. Play Games', desc: 'Pay entry fee to compete in Loot Survivor runs' },
              { icon: '💰', title: '2. Fees → Vault', desc: '90% goes to BTC vault, 10% to platform' },
              { icon: '📈', title: '3. Yield Grows', desc: 'Vault earns 5% APY via Endurance staking' },
              { icon: '🏆', title: '4. Top Players Win', desc: 'Top 50% share accumulated yield' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4 animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <h4 className="text-white font-bold mb-2">{step.title}</h4>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Fee Split Visual */}
          {feeSplit && (
            <div className="max-w-md mx-auto bg-black/40 rounded-2xl p-8 border border-purple-500/20">
              <h4 className="text-lg font-bold text-white text-center mb-6">Entry Fee Split Example</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Total Entry Fee</span>
                    <span className="text-white font-mono">{formatBTC(feeSplit.totalAmount)}</span>
                  </div>
                </div>
                <div className="h-4 rounded-full bg-gray-800 overflow-hidden flex">
                  <div className="bg-purple-500 h-full" style={{ width: '90%' }} />
                  <div className="bg-blue-500 h-full" style={{ width: '10%' }} />
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="text-purple-400 font-bold">90% → Vault</p>
                    <p className="text-white font-mono text-sm">{formatBTC(feeSplit.vaultAmount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-400 font-bold">10% → Platform</p>
                    <p className="text-white font-mono text-sm">{formatBTC(feeSplit.platformAmount)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Active Runs & Leaderboard */}
      <section id="runs" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Active Runs */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Active Game Runs</h3>
              <div className="space-y-4">
                {activeRuns.map((run) => (
                  <div
                    key={run.id}
                    onClick={() => selectRun(run.id)}
                    className={`rounded-xl p-5 cursor-pointer transition-all ${
                      selectedRunId === run.id
                        ? 'bg-purple-500/20 border-2 border-purple-500'
                        : 'bg-black/40 border border-purple-500/20 hover:border-purple-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-white font-bold">{run.gameName}</h4>
                        <p className="text-gray-400 text-sm">Run #{run.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-purple-400 font-mono">{formatBTC(run.entryFee)}</p>
                        <p className="text-gray-400 text-sm">{run.playerCount} players</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">
                        {run.endTime ? formatTimeRemaining(run.endTime) : 'Ongoing'}
                      </span>
                      <button className="btn-primary px-4 py-1.5 rounded-lg text-white text-sm font-bold">
                        Enter Run
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div id="leaderboard">
              <h3 className="text-2xl font-bold text-white mb-6">
                🏆 Leaderboard
                {selectedRun && <span className="text-gray-400 text-sm ml-2">Run #{selectedRun.id}</span>}
              </h3>
              <div className="bg-black/40 rounded-2xl border border-purple-500/20 overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs text-gray-400 uppercase border-b border-purple-500/20">
                  <div className="col-span-1">#</div>
                  <div className="col-span-4">Player</div>
                  <div className="col-span-2 text-right">Score</div>
                  <div className="col-span-2 text-right">Entries</div>
                  <div className="col-span-3 text-right">Yield Share</div>
                </div>
                <div className="divide-y divide-purple-500/10">
                  {leaderboard.map((entry) => (
                    <div
                      key={entry.rank}
                      className="grid grid-cols-12 gap-4 px-6 py-4 items-center leaderboard-row"
                    >
                      <div className="col-span-1">
                        {entry.rank === 1 && <span className="text-xl">🥇</span>}
                        {entry.rank === 2 && <span className="text-xl">🥈</span>}
                        {entry.rank === 3 && <span className="text-xl">🥉</span>}
                        {entry.rank > 3 && <span className="text-gray-400 font-mono">{entry.rank}</span>}
                      </div>
                      <div className="col-span-4">
                        <span className="text-white font-mono text-sm">{entry.address}</span>
                      </div>
                      <div className="col-span-2 text-right">
                        <span className="text-purple-400 font-mono">{entry.score.toLocaleString()}</span>
                      </div>
                      <div className="col-span-2 text-right">
                        <span className="text-gray-400">{entry.entries}</span>
                      </div>
                      <div className="col-span-3 text-right">
                        <span className="text-green-400 font-mono">{entry.yieldShare}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Yield Tiers */}
      <section className="py-16 px-4 bg-black/30">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Yield Distribution Tiers</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { rank: 'Top 1', share: 30, color: 'gold' },
              { rank: 'Top 2-5', share: 25, color: 'silver' },
              { rank: 'Top 6-10', share: 20, color: 'bronze' },
              { rank: 'Top 11-25', share: 15, color: 'purple' },
              { rank: 'Top 26-50', share: 10, color: 'blue' },
            ].map((tier, i) => (
              <div
                key={i}
                className={`rounded-xl p-4 text-center ${
                  tier.color === 'gold' ? 'tier-gold' :
                  tier.color === 'silver' ? 'tier-silver' :
                  tier.color === 'bronze' ? 'tier-bronze' :
                  tier.color === 'purple' ? 'bg-purple-500/20 border border-purple-500/50' :
                  'bg-blue-500/20 border border-blue-500/50'
                }`}
              >
                <p className={`font-bold text-lg ${tier.color === 'gold' || tier.color === 'silver' || tier.color === 'bronze' ? 'text-gray-900' : 'text-white'}`}>
                  {tier.rank}
                </p>
                <p className={`text-2xl font-mono ${tier.color === 'gold' || tier.color === 'silver' || tier.color === 'bronze' ? 'text-gray-900' : 'text-white'}`}>
                  {tier.share}%
                </p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-center mt-6 text-sm">
            Top 50% of players share 100% of accumulated yield, distributed by tier
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold">∞</span>
              </div>
              <span className="text-white font-bold">INFINIYIELD</span>
            </div>
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition">Docs</a>
              <a href="#" className="hover:text-white transition">GitHub</a>
              <a href="#" className="hover:text-white transition">Discord</a>
              <a href="#" className="hover:text-white transition">Twitter</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-purple-500/10 text-center text-gray-500 text-sm">
            <p>Built on Starknet with starkzap | Powered by Endurance BTC Staking</p>
            <p className="mt-2">Dojo Game Jam VIII Submission</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
