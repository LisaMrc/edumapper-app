<script setup lang="ts">
const { query, programs, pending, error } = usePrograms()

useHead({ title: 'Edumapper — Trouvez votre formation' })
</script>

<template>
  <div class="app">

    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar__brand">
        <span class="sidebar__logo" aria-hidden="true">◆</span>
        <span class="sidebar__name">Edumapper</span>
      </div>
      <p class="sidebar__tagline">Trouvez votre formation</p>
    </aside>

    <!-- Right pane -->
    <div class="pane">

      <!-- Navbar sticky -->
      <header class="navbar">
        <div class="navbar__inner">
          <SearchBar v-model="query" />
        </div>
      </header>

      <!-- Main content -->
      <main class="main" aria-live="polite" :aria-busy="pending">

        <!-- Loading -->
        <div v-if="pending" class="skeletons" aria-label="Chargement des formations…">
          <div v-for="i in 6" :key="i" class="skeleton-card">
            <div class="skeleton-line skeleton-line--sm" />
            <div class="skeleton-line skeleton-line--lg" />
            <div class="skeleton-line skeleton-line--md" />
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="state state--error" role="alert">
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
            <path d="M12 7v6M12 16.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <p>{{ error }}</p>
        </div>

        <!-- Empty -->
        <div v-else-if="programs.length === 0" class="state state--empty">
          <svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="14" cy="14" r="10" stroke="currentColor" stroke-width="1.5" />
            <path d="M22 22L29 29" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            <path d="M10 14h8M14 10v8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <p v-if="query">Aucune formation pour « {{ query }} »</p>
          <p v-else>Aucune formation disponible.</p>
        </div>

        <!-- Results -->
        <template v-else>
          <p class="results-count">
            {{ programs.length }} formation{{ programs.length > 1 ? 's' : '' }}
            <template v-if="query"> pour « {{ query }} »</template>
          </p>
          <ul class="grid" role="list">
            <li v-for="program in programs" :key="program.program_id">
              <ProgramCard :program="program" />
            </li>
          </ul>
        </template>

      </main>
    </div>
  </div>
</template>

<style scoped>
/* ── App shell ─────────────────────────────────── */
.app {
  display: flex;
  min-height: 100dvh;
}

/* ── Sidebar ───────────────────────────────────── */
.sidebar {
  width: 220px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100dvh;
  padding: var(--space-6) var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  border-right: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
}

.sidebar__brand {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.sidebar__logo {
  background: var(--color-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: var(--font-size-xl);
  line-height: 1;
}

.sidebar__name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.sidebar__tagline {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

/* ── Right pane ────────────────────────────────── */
.pane {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/* ── Navbar ────────────────────────────────────── */
.navbar {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: var(--space-4) var(--space-5);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  border-bottom: 1px solid var(--color-border);
}

.navbar__inner {
  max-width: 720px;
}

/* ── Main ──────────────────────────────────────── */
.main {
  flex: 1;
  padding: var(--space-5);
}

.results-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: stretch;
  gap: var(--space-4);
  list-style: none;
}

.grid > li {
  display: flex;
}

/* ── Skeletons ─────────────────────────────────── */
.skeletons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}

.skeleton-card {
  background: var(--color-surface-raised);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.skeleton-line {
  background: linear-gradient(
    90deg,
    var(--color-skeleton) 25%,
    var(--color-skeleton-sheen) 50%,
    var(--color-skeleton) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  border-radius: var(--radius-sm);
  height: 12px;
}

.skeleton-line--sm { width: 40%; }
.skeleton-line--md { width: 65%; }
.skeleton-line--lg { width: 90%; height: 18px; }

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-line { animation: none; }
}

/* ── Empty / Error ─────────────────────────────── */
.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-8) var(--space-5);
  text-align: center;
  color: var(--color-text-muted);
}

.state--error { color: var(--color-error); }
.state p { font-size: var(--font-size-base); }
</style>
