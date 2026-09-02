<script setup lang="ts">
import type { EduGeneric } from '../../server/utils/programs'

const props = defineProps<{
  program: EduGeneric
}>()

const dialog = ref<HTMLDialogElement | null>(null)

function open() {
  dialog.value?.showModal()
}

function close() {
  dialog.value?.close()
}

function onBackdropClick(e: MouseEvent) {
  if (e.target === dialog.value) close()
}

defineExpose({ open })

// Close on Escape is handled natively by <dialog>
</script>

<template>
  <dialog
    ref="dialog"
    class="popover"
    :aria-label="program.title"
    @click="onBackdropClick"
  >
    <div class="popover__panel">

      <!-- Identity — same structure as card header -->
      <div class="popover__identity">
        <div class="popover__header">
          <h2 class="popover__title">{{ program.title }}</h2>
          <button
            class="popover__close"
            type="button"
            aria-label="Fermer"
            @click="close"
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="popover__school-group">{{ program.school_group }}</div>

        <div class="popover__meta">
          <span class="popover__tag">{{ program.diploma }}</span>
          <span class="popover__tag">{{ program.field }}</span>
        </div>
      </div>

      <!-- Variants detail -->
      <div class="popover__variants">
        <p v-if="program.variants.length === 0" class="popover__no-variants">
          Aucune variante.
        </p>

        <template v-else>
        <p class="popover__section-label">
          {{ program.variants.length }} variante{{ program.variants.length > 1 ? 's' : '' }}
        </p>

        <ul class="popover__list" role="list">
          <li
            v-for="variant in program.variants"
            :key="variant.program_id"
            class="popover__variant"
          >
            <div class="popover__variant-title">{{ variant.title }}</div>
            <div class="popover__variant-location">
              <svg aria-hidden="true" width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M6 1C4.067 1 2.5 2.567 2.5 4.5c0 2.625 3.5 6.5 3.5 6.5s3.5-3.875 3.5-6.5C9.5 2.567 7.933 1 6 1Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
                <circle cx="6" cy="4.5" r="1.25" fill="currentColor"/>
              </svg>
              <span class="popover__variant-school">{{ variant.school_title }}</span>
              <span v-if="variant.city" class="popover__variant-city">· {{ variant.city }}</span>
            </div>
            <div class="popover__variant-badges">
              <VariantBadge v-if="variant.axes.language" axis="language" :value="variant.axes.language" />
              <VariantBadge v-if="variant.axes.apprenticeship" axis="apprenticeship" value="true" />
              <VariantBadge v-if="variant.axes.track" axis="track" :value="variant.axes.track" />
              <VariantBadge v-if="variant.axes.campus" axis="campus" :value="variant.axes.campus" />
            </div>
          </li>
        </ul>
        </template>
      </div>

    </div>
  </dialog>
</template>

<style scoped>
/* Backdrop */
.popover {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  background: transparent;
  border: none;
  padding: 0;
}

.popover::backdrop {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Panel */
.popover__panel {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(560px, calc(100vw - var(--space-6)));
  max-height: calc(100dvh - var(--space-8));
  overflow-y: auto;
  background: var(--color-surface-raised);
  border-radius: var(--radius-md);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
}

/* Identity section */
.popover__identity {
  padding: var(--space-5);
  border-bottom: 1px solid var(--color-border);
}

.popover__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
}

.popover__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-text);
}

.popover__close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.popover__close:hover {
  background: var(--color-skeleton);
  color: var(--color-text);
}

.popover__close:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 1px;
}

.popover__school-group {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: var(--color-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--space-2);
}

.popover__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.popover__tag {
  display: inline-flex;
  align-items: center;
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  background: var(--color-skeleton);
  color: var(--color-text-muted);
}

/* Variants section */
.popover__variants {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.popover__no-variants {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  font-style: italic;
}

.popover__section-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
}

.popover__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  list-style: none;
}

.popover__variant {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.popover__variant:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.popover__variant-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  line-height: var(--line-height-tight);
}

.popover__variant-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.popover__variant-school {
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.popover__variant-city {
  color: var(--color-text-muted);
}

.popover__variant-badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}
</style>
