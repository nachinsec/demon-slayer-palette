<script lang="ts">
  import type { Character } from '$lib/types/types'
  import { onMount } from 'svelte'
  import { createEventDispatcher } from 'svelte'
  import { Search, Loader2 } from '@lucide/svelte'

  const dispatch = createEventDispatcher()
  let searchTerm: string = ''
  let characters: Character[] = []
  let filteredCharacters: Character[] = []
  let isLoading: boolean = false
  let error: string | null = null
  let isDropdownOpen: boolean = false
  let searchInputElement: HTMLDivElement

  onMount(async () => {
    isLoading = true
    error = null
    try {
      const response = await fetch('/api/characters')
      if (!response.ok) throw new Error('Failed to fetch character data')
      const data = await response.json()
      characters = data || []
    } catch (e) {
      console.error(e)
      error = 'Error loading characters'
    } finally {
      isLoading = false
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (searchInputElement && !searchInputElement.contains(event.target as Node)) {
        isDropdownOpen = false;
      }
    });
  })

  const handleClick = (character: Character) => {
    dispatch('characterSelect', { character, img: character.img })
    searchTerm = ''
    isDropdownOpen = false
  }

  $: {
    if (searchTerm) {
      filteredCharacters = characters.filter((character) =>
        character.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      isDropdownOpen = true
    } else {
      filteredCharacters = []
      isDropdownOpen = false
    }
  }
</script>

<div class="relative w-full" bind:this={searchInputElement}>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {#if isLoading}
        <Loader2 class="h-4 w-4 text-gray-500 dark:text-zinc-400 animate-spin" />
      {:else}
        <Search class="h-4 w-4 text-gray-500 dark:text-zinc-400" />
      {/if}
    </div>
    
    <input
      class="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg 
             bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 
             placeholder-gray-500 dark:placeholder-zinc-400
             focus:outline-none focus:ring-1 focus:ring-violet-300 dark:focus:ring-violet-500/50
             transition-colors duration-200"
      type="text"
      placeholder="Search characters..."
      bind:value={searchTerm}
      aria-label="Search for a Demon Slayer character"
    />
  </div>

  {#if error}
    <div class="mt-1 text-sm text-red-500 dark:text-red-400">
      {error}
    </div>
  {/if}

  {#if isDropdownOpen && filteredCharacters.length > 0}
    <div class="absolute z-50 mt-1 w-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm 
                border border-gray-100 dark:border-zinc-800 max-h-60 overflow-y-auto">
      <ul class="py-1">
        {#each filteredCharacters as character}
          <li>
            <button 
              class="w-full text-left px-4 py-2 hover:bg-violet-50/70 dark:hover:bg-violet-900/20
                     flex items-center gap-3 transition-colors duration-150"
              on:click={() => handleClick(character)}
            >
              <div class="flex-1">
                <div class="font-medium text-gray-900 dark:text-zinc-100">{character.name}</div>
                <div class="text-sm text-gray-500 dark:text-zinc-400">{character.race}</div>
              </div>
            </button>
          </li>
        {/each}
      </ul>
    </div>
  {:else if isDropdownOpen && searchTerm && filteredCharacters.length === 0}
    <div class="absolute z-50 mt-1 w-full bg-white dark:bg-zinc-900 rounded-lg shadow-lg 
                border border-gray-200 dark:border-zinc-800 p-4 text-center">
      <p class="text-gray-500 dark:text-zinc-400">No characters found</p>
    </div>
  {/if}
</div>
