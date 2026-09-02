<script setup lang="ts">
import type { EduGeneric } from '../../server/utils/programs'

defineProps<{
  program: EduGeneric
}>()
</script>

<template>
  <article class="card" :aria-label="program.title">
    <!-- Header -->
    <div class="card__header">
      <div class="card__meta">
        <span class="card__diploma">{{ program.diploma }}</span>
        <span class="card__sep" aria-hidden="true">·</span>
        <span class="card__field">{{ program.field }}</span>
      </div>
      <h2 class="card__title">{{ program.title }}</h2>
      <div class="card__location">
        <span class="card__school">{{ program.school_title }}</span>
        <span class="card__sep" aria-hidden="true">·</span>
        <span class="card__city">{{ program.city }}</span>
      </div>
    </div>

    <!-- Variants -->
    <div v-if="program.variants.length > 0" class="card__variants">
      <p class="card__variants-label">
        {{ program.variants.length }} variante{{ program.variants.length > 1 ? 's' : '' }}
      </p>
      <ul class="card__variants-list" role="list">
        <li
          v-for="variant in program.variants"
          :key="variant.program_id"
          class="card__variant"
        >
          <span class="card__variant-title">{{ variant.short_title }}</span>
          <div class="card__variant-axes">
            <VariantBadge
              v-if="variant.axes.language"
              axis="language"
              :value="variant.axes.language"
            />
            <VariantBadge
              v-if="variant.axes.apprenticeship"
              axis="apprenticeship"
              value="true"
            />
            <VariantBadge
              v-if="variant.axes.track"
              axis="track"
              :value="variant.axes.track"
            />
            <VariantBadge
              v-if="variant.axes.campus"
              axis="campus"
              :value="variant.axes.campus"
            />
          </div>
        </li>
      </ul>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: var(--color-surface-raised);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  transition: box-shadow var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-card-hover);
}

/* Header */
.card__meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-2);
}

.card__sep {
  color: var(--color-border);
}

.card__diploma {
  font-weight: var(--font-weight-medium);
  background: var(--color-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-text);
}

.card__location {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-top: var(--space-1);
}

/* Variants section */
.card__variants {
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.card__variants-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
}

.card__variants-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  list-style: none;
}

.card__variant {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.card__variant-title {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  flex-shrink: 0;
  min-width: 0;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card__variant-axes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  flex-shrink: 0;
}
</style>
