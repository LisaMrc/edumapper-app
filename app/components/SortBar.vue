<script setup lang="ts">
import { SORT_OPTIONS, type SortKey } from '../composables/usePrograms'

const model = defineModel<SortKey>({ required: true })

const open = ref(false)
const btnRef = ref<HTMLButtonElement | null>(null)
const menuRef = ref<HTMLUListElement | null>(null)

const selectedLabel = computed(
  () => SORT_OPTIONS.find((o) => o.key === model.value)?.label ?? ''
)

function select(key: SortKey) {
  model.value = key
  open.value = false
  btnRef.value?.focus()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    open.value = false
    btnRef.value?.focus()
  }
}

function onDocumentClick(e: MouseEvent) {
  const target = e.target as Node
  if (!menuRef.value?.contains(target) && !btnRef.value?.contains(target)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onDocumentClick, true))
onUnmounted(() => document.removeEventListener('click', onDocumentClick, true))
</script>

<template>
  <div class="sortbar" @keydown="onKeydown">
    <button
      ref="btnRef"
      class="sortbar__btn"
      type="button"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="open = !open"
    >
      <span class="sortbar__prefix">Trier par</span>
      <span class="sortbar__selected">{{ selectedLabel }}</span>
      <svg
        class="sortbar__chevron"
        :class="{ 'sortbar__chevron--open': open }"
        aria-hidden="true"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <ul
      v-if="open"
      ref="menuRef"
      class="sortbar__menu"
      role="listbox"
      :aria-label="`Trier par : ${selectedLabel}`"
    >
      <li
        v-for="option in SORT_OPTIONS"
        :key="option.key"
        class="sortbar__option"
        :class="{ 'sortbar__option--active': model === option.key }"
        role="option"
        :aria-selected="model === option.key"
        tabindex="0"
        @click="select(option.key)"
        @keydown.enter="select(option.key)"
        @keydown.space.prevent="select(option.key)"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.sortbar {
  position: relative;
  display: inline-flex;
}

.sortbar__btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 6px var(--space-3);
  border-radius: var(--radius-full);
  border: none;
  background: var(--color-gradient);
  font-family: var(--font-family);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: #fff;
  cursor: pointer;
  transition: opacity var(--transition-fast);
}

.sortbar__btn:hover {
  opacity: 0.88;
}

.sortbar__btn:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.sortbar__prefix {
  opacity: 0.75;
}

.sortbar__selected {
  font-weight: var(--font-weight-bold);
}

.sortbar__chevron {
  flex-shrink: 0;
  transition: transform var(--transition-fast);
}

.sortbar__chevron--open {
  transform: rotate(180deg);
}

/* Dropdown */
.sortbar__menu {
  position: absolute;
  top: calc(100% + var(--space-2));
  left: 0;
  min-width: 140px;
  background: var(--color-surface-raised);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card-hover);
  list-style: none;
  padding: var(--space-1);
  z-index: 20;
  animation: menu-in 0.15s ease forwards;
}

@keyframes menu-in {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}

.sortbar__option {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.sortbar__option:hover {
  background: var(--color-skeleton);
  color: var(--color-text);
}

.sortbar__option:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: -2px;
}

.sortbar__option--active {
  font-weight: var(--font-weight-bold);
  background: var(--color-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}
</style>
