<script setup lang="ts">
import type { EduGeneric } from '../types/programs'

const props = defineProps<{
  program: EduGeneric
}>()

const locationGroups = useLocationGroups(computed(() => props.program))

// Aggregate unique values per axis across all variants
const axes = computed(() => {
  const languages = new Set<string>()
  let hasApprenticeship = false
  const tracks = new Set<string>()

  for (const v of props.program.variants) {
    if (v.axes.language) languages.add(v.axes.language)
    if (v.axes.apprenticeship) hasApprenticeship = true
    if (v.axes.track) tracks.add(v.axes.track)
  }

  return {
    languages: [...languages],
    hasApprenticeship,
    tracks: [...tracks],
  }
})

const hasAxes = computed(
  () => axes.value.languages.length > 0 || axes.value.hasApprenticeship || axes.value.tracks.length > 0
)

const popover = ref<{ open: () => void } | null>(null)
</script>

<template>
  <ProgramPopover ref="popover" :program="program" />
  <article
    class="card card--clickable"
    :aria-label="program.title"
    role="button"
    tabindex="0"
    @click="popover?.open()"
    @keydown.enter="popover?.open()"
    @keydown.space.prevent="popover?.open()"
  >

    <!-- Hover overlay -->
    <div class="card__overlay" aria-hidden="true">
      <span class="card__overlay-label">En savoir plus</span>
    </div>

    <!-- Header -->
    <div class="card__header">
      <h2 class="card__title">{{ program.title }}</h2>
      <div class="card__school-info">
        <div
          v-for="loc in locationGroups"
          :key="loc.group"
          class="card__location-group"
        >
          <span class="card__school-group">{{ loc.group }}</span>
          <div class="card__cities">
            <svg class="card__pin" aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1C4.067 1 2.5 2.567 2.5 4.5c0 2.625 3.5 6.5 3.5 6.5s3.5-3.875 3.5-6.5C9.5 2.567 7.933 1 6 1Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
              <circle cx="6" cy="4.5" r="1.25" fill="currentColor"/>
            </svg>
            <span class="card__cities-list">
              <template v-for="(city, i) in loc.cities" :key="city">
                <span>{{ city }}</span>
                <span v-if="i < loc.cities.length - 1" class="card__dot" aria-hidden="true">·</span>
              </template>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Grouped axes -->
    <div v-if="program.variants.length > 0 && hasAxes" class="card__axes">
      <div class="card__meta">
        <span class="card__tag">{{ program.diploma }}</span>
        <span class="card__tag">{{ program.field }}</span>
      </div>

      <div v-if="axes.languages.length > 0" class="card__axis">
        <span class="card__axis-label">Langues</span>
        <div class="card__axis-badges">
          <VariantBadge
            v-for="lang in axes.languages"
            :key="lang"
            axis="language"
            :value="lang"
          />
        </div>
      </div>

      <div v-if="axes.hasApprenticeship" class="card__axis">
        <span class="card__axis-label">Modalités</span>
        <div class="card__axis-badges">
          <VariantBadge axis="apprenticeship" value="true" />
        </div>
      </div>

      <div v-if="axes.tracks.length > 0" class="card__axis">
        <span class="card__axis-label">Tracks</span>
        <div class="card__axis-badges">
          <VariantBadge
            v-for="track in axes.tracks"
            :key="track"
            axis="track"
            :value="track"
          />
        </div>
      </div>

    </div>

  </article>
</template>

<style scoped>
.card {
  position: relative;
  background: var(--color-surface-raised);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
  height: 100%;
  transition: box-shadow var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-card-hover);
}

/* Header */
.card__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-text);
  margin-bottom: var(--space-2);
}

.card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  margin-bottom: var(--space-2);
}

.card__tag {
  display: inline-flex;
  align-items: center;
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  background: var(--color-skeleton);
  color: var(--color-text-muted);
}

.card__sep {
  color: var(--color-border);
}

.card__school-info {
  margin-top: var(--space-2);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.card__location-group {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.card__school-group {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: var(--color-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline;
}

.card--clickable {
  cursor: pointer;
}

.card--clickable:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

/* Hover overlay */
.card__overlay {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-md);
  background: linear-gradient(
    to top,
    rgba(247, 50, 165, 1) 0%,
    rgba(255, 114, 63, 0.85) 50%,
    rgba(255, 114, 63, 0) 100%
  );
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: var(--space-4);
  opacity: 0;
  transition: opacity var(--transition-base);
  pointer-events: none;
}

.card:hover .card__overlay {
  opacity: 1;
}

.card__overlay-label {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: white;
}

@media (prefers-reduced-motion: reduce) {
  .card__overlay { transition: none; }
}

.card__cities {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.card__pin {
  flex-shrink: 0;
  color: var(--color-text-muted);
}

.card__cities-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 3px;
}

.card__dot {
  color: var(--color-text-muted);
  margin: 0 1px;
}

/* Axes */
.card__axes {
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: auto;
}

.card__axis {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.card__axis-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  width: 56px;
  flex-shrink: 0;
}

.card__axis-badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}
</style>
