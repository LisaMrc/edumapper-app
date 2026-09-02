<script setup lang="ts">
const { query, programs, pending, error } = usePrograms()
</script>

<template>
  <div class="layout">
    <!-- Header -->
    <header class="header">
      <div class="header__inner">
        <div class="header__brand">
          <span class="header__logo" aria-hidden="true">◆</span>
          <span class="header__name">Edumapper</span>
        </div>
        <p class="header__tagline">Trouvez votre formation</p>
      </div>
    </header>

    <!-- Search -->
    <div class="search-wrapper">
      <SearchBar v-model="query" />
    </div>

    <!-- Main -->
    <main class="main" id="results" aria-live="polite" aria-busy="pending">

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
</template>

<style scoped>
/* Layout */
.layout {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  padding: var(--space-6) var(--space-5) 0;
}

.header__inner {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.header__brand {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.header__logo {
  background: var(--color-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: var(--font-size-xl);
  line-height: 1;
}

.header__name {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.header__tagline {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

/* Search */
.search-wrapper {
  padding: var(--space-5) var(--space-5) 0;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

/* Main */
.main {
  flex: 1;
  padding: var(--space-5);
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

/* Results count */
.results-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
}

/* Grid */
.grid {
  display: grid;
  gap: var(--space-4);
  list-style: none;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Skeleton loader */
.skeletons {
  display: grid;
  gap: var(--space-4);
}

@media (min-width: 640px) {
  .skeletons {
    grid-template-columns: repeat(2, 1fr);
  }
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
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-line { animation: none; }
}

/* Empty / Error states */
.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-8) var(--space-5);
  text-align: center;
  color: var(--color-text-muted);
}

.state--error {
  color: var(--color-error);
}

.state p {
  font-size: var(--font-size-base);
}
</style>
