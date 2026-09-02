<script setup lang="ts">
type Axis = 'language' | 'apprenticeship' | 'track' | 'campus'

const props = defineProps<{
  axis: Axis
  value: string
}>()

const LANGUAGE_LABEL: Record<string, string> = {
  en: 'EN',
  it: 'IT',
  fr: 'FR',
}

const LANGUAGE_ICON: Record<string, string> = {
  en: '🇬🇧',
  it: '🇮🇹',
  fr: '🇫🇷',
}

const label = computed(() => {
  if (props.axis === 'language') return LANGUAGE_LABEL[props.value] ?? props.value.toUpperCase()
  if (props.axis === 'apprenticeship') return 'Alternance'
  if (props.axis === 'track') return props.value
  if (props.axis === 'campus') return props.value
  return props.value
})

const icon = computed(() => {
  if (props.axis === 'language') return LANGUAGE_ICON[props.value] ?? '🌐'
  if (props.axis === 'apprenticeship') return '⚙️'
  if (props.axis === 'track') return '◆'
  if (props.axis === 'campus') return '📍'
  return ''
})

const axisLabel = computed(() => {
  const map: Record<Axis, string> = {
    language: 'Langue',
    apprenticeship: 'Modalité',
    track: 'Track',
    campus: 'Campus',
  }
  return map[props.axis]
})
</script>

<template>
  <span
    class="badge"
    :class="`badge--${axis}`"
    :title="`${axisLabel} : ${label}`"
    :aria-label="`${axisLabel} : ${label}`"
  >
    <span class="badge__icon" aria-hidden="true">{{ icon }}</span>
    <span class="badge__label">{{ label }}</span>
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-tight);
  white-space: nowrap;
  letter-spacing: 0.02em;
}

.badge--language {
  background: var(--color-badge-language);
  color: var(--color-badge-language-text);
}

.badge--apprenticeship {
  background: var(--color-badge-apprenticeship);
  color: var(--color-badge-apprenticeship-text);
}

.badge--track {
  background: var(--color-badge-track);
  color: var(--color-badge-track-text);
  text-transform: capitalize;
}

.badge--campus {
  background: var(--color-badge-campus);
  color: var(--color-badge-campus-text);
}

.badge__icon {
  font-size: 10px;
  line-height: 1;
}
</style>
