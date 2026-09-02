<script setup lang="ts">
const model = defineModel<string>({ required: true })

const input = ref<HTMLInputElement | null>(null)

function clear() {
  model.value = ''
  input.value?.focus()
}
</script>

<template>
  <div class="search" role="search">
    <label for="program-search" class="search__label">
      Rechercher une formation
    </label>
    <div class="search__field">
      <svg
        class="search__icon"
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.5" />
        <path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      <input
        id="program-search"
        ref="input"
        v-model="model"
        class="search__input"
        type="search"
        placeholder="Formation, domaine, diplôme, ville…"
        autocomplete="off"
        spellcheck="false"
      />
      <button
        v-if="model"
        class="search__clear"
        type="button"
        aria-label="Effacer la recherche"
        @click="clear"
      >
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.search {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
}

.search__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
}

.search__field {
  position: relative;
  display: flex;
  align-items: center;
}

.search__icon {
  position: absolute;
  left: var(--space-4);
  color: var(--color-text-muted);
  pointer-events: none;
  flex-shrink: 0;
}

.search__input {
  width: 100%;
  height: 48px;
  padding: 0 var(--space-5) 0 calc(var(--space-4) + 16px + var(--space-3));
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-raised);
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  color: var(--color-text);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  appearance: none;
}

.search__input::placeholder {
  color: var(--color-text-muted);
}

.search__input:focus {
  outline: none;
  border-color: var(--color-focus);
  box-shadow: 0 0 0 3px rgba(0, 150, 255, 0.15);
}

/* Hide browser native clear button */
.search__input::-webkit-search-cancel-button {
  display: none;
}

.search__clear {
  position: absolute;
  right: var(--space-3);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  color: var(--color-text-muted);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: background var(--transition-fast), color var(--transition-fast);
}

.search__clear:hover {
  background: var(--color-skeleton);
  color: var(--color-text);
}

.search__clear:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 1px;
}
</style>
