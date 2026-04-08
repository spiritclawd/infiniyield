# INFINIYIELD — Zaia Wrap-Up
**Fecha:** 2026-04-08  
**Estado:** Base sólida. Listo para siguiente iteración o demo.

---

## Qué es

**INFINIYIELD "Trap the Whale"** — vault de depósito permanente en Starknet.  
Depositas wBTC. Para siempre. Ganas yield de Vesu DeFi. Los top 10 depositors por score se llevan el 70% del yield cada epoch.

Tagline definitivo: *"Permanent capital. Perpetual yield. No exit."*

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Contratos | Cairo 2.x, Scarb 2.13.1, sncast 0.58.1 |
| Tests | cairo_test (21/21 green) |
| Frontend | Next.js 15, TypeScript, Tailwind v4, static export |
| Wallet | Cartridge Controller (Starknet native AA) |
| Reads | starknet.js v9 RPC directo |
| Deploy | GitHub Pages (`spiritclawd.github.io/infiniyield/`) |
| Yield data | api.vesu.xyz (Prime Pool wBTC APY: 0.14% real) |

---

## Contratos desplegados — Sepolia

| Contrato | Address |
|----------|---------|
| VaultCore | `0x00a60e55f58d72744f099f6dbbfdbaadd0b87f3fa0618e069299bced33b59c80` |
| MockWBTC | `0x067643f9a0722a3717ddf9469d266c739ebb8d1d365807888989e70b88937595` |
| IYToken | `0x035f1980ee1d948641d2cebb74c6dafee595f6b817874ef24f631a8a9d34b6ee` |
| MockYieldSource | `0x06a34c197345c929b7f63b9d936aa725c9cd1bb87a6f64d7d6e300e475129840` |

Deployer: `0x01c5e682f44ef485c44db5aa1ddb842dc2ec9c7de05e3e65d8b13464a96dd8e8`  
Accounts file: `~/.starknet_accounts/starknet_open_zeppelin_accounts.json`  
RPC Sepolia: `https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_9/demo`

---

## Mecánica core

```
score = principal_sats × t_effective / 100

t_effective acumula por bloque:
  días  1-45:  +100/día
  días 46-90:  +70/día
  días 91+:    +40/día

Yield split por epoch:
  70% → top 10 (cuadrático: (11-rank)²/385)
  20% → todos depositors pro-rata
  10% → treasury

IY token: 1 IY (1e18) por cada 1,000 sats depositados
         → proof of commitment, powers compound leaderboard
         → sin governance, sin especulación, pura matemática

SEASON_BLOCKS = 100 (testing) → cambiar a 2_592_000 para producción
```

---

## Frontend — secciones del funnel

1. **Hero** — statement directo, stat ticker en vivo, whale sutil
2. **Trap the Whale** — 4 cards: Lock / Earn / Win / IY Token + stats bar
3. **How Winning Works** — vídeo 69s + simulador de posición
4. **The Depths** — leaderboard top-10 con depth bars
5. **Enter the Vault** — onboarding 3 pasos + deposit form + my position

---

## Simulador de posición

- Input: BTC amount + días en vault
- Output: rank estimado, yield share top-10, pro-rata share, **días para recuperar inversión completa**
- Fórmula exacta del contrato Cairo
- Usa APY real de Vesu para estimar yield

---

## Vídeos generados (Manim)

| Vídeo | Duración | Path |
|-------|----------|------|
| INFINIYIELD explainer (qué es) | 61s | `/tmp/infiniyield_explainer.mp4` |
| Zaia identity | 60s | `/tmp/zaia_explainer.mp4` |
| How Winning Works | 69s | `/public/winning.mp4` (embebido en landing) |

---

## Pendiente para próxima iteración

### Crítico para mainnet
- [ ] Cambiar `SEASON_BLOCKS = 100` → `2_592_000` en vault_core.cairo
- [ ] Integrar Vesu real (no mock) — despelgar `VaultCore` apuntando a Vesu en lugar de `MockYieldSource`
- [ ] Conseguir Alchemy API key real (no usar endpoint demo en producción)
- [ ] Custom domain para la landing (ahora en GitHub Pages subpath)

### Producto
- [ ] IY token utility más desarrollada si se quiere expandir el sistema
- [ ] Notificaciones on-chain cuando alguien te supera en el leaderboard
- [ ] Leaderboard histórico (cross-epoch)
- [ ] Social sharing — "I'm rank #3 on INFINIYIELD" con imagen generada

### Marketing/demo
- [ ] Vídeos en mejor calidad / con voz
- [ ] Onboarding guiado en testnet con wBTC faucet visible desde el hero
- [ ] OG image mejorada (la actual es sólida pero generada con PIL)

---

## Cómo retomar

```bash
# Clonar repo
cd ~ && gh repo clone spiritclawd/infiniyield

# Frontend
cd infiniyield && npm install --legacy-peer-deps && npm run dev

# Contratos (build + test)
cd contracts && scarb build && scarb test

# Deploy frontend a GitHub Pages
npm run build
# → copiar out/ a gh-pages branch (ver script previo en sesión)

# Deploy contrato nuevo a Sepolia
export PATH=$HOME/.local/bin:$HOME/bin:$PATH
cd contracts
OWNER=0x01c5e6... TREASURY=0x01c5e6... bash deploy-sepolia.sh
```

---

## Notas de diseño

- Color principal: `#F7931A` (Bitcoin orange)
- Fuente de datos: monospace siempre
- No glow en todas partes — sólo hero title
- Cards flat `#0D0F1A`, border `#1E2035`
- Live dot (CSS pulse verde) = datos en tiempo real
- El "no withdraw" es feature, no warning

---

*Generado por Zaia · 2026-04-08*
