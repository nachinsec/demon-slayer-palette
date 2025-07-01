<script lang="ts">
  import CharacterSearch from '$lib/components/character-search.svelte'
  import { createEventDispatcher, onMount } from 'svelte'
  import type { Character } from '$lib/types/types'
  import { Moon, Sun, Menu, X } from '@lucide/svelte'
  
  const dispatch = createEventDispatcher()
  let darkMode: boolean = false
  let mobileMenuOpen: boolean = false
  export let selectedCharacter: Character | null = null
  
  const handleCharacterSelect = (event: CustomEvent<{ character: Character; img: string }>) => {
    dispatch('characterSelect', event.detail)
    mobileMenuOpen = false
  }
  
  const toggleDarkMode = () => {
    darkMode = !darkMode
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }
  
  onMount(() => {
    // Check localStorage first
    const storedDarkMode = localStorage.getItem('darkMode')
    
    if (storedDarkMode !== null) {
      // Use stored preference if available
      darkMode = storedDarkMode === 'true'
    } else {
      // Otherwise check system preference
      darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    
    // Apply initial dark mode setting
    if (darkMode) {
      document.documentElement.classList.add('dark')
    }
  })
</script>

<nav class="bg-white dark:bg-zinc-950 dark:border-zinc-800 dark:border-b shadow-sm sticky top-0 z-50 transition-colors duration-300">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <!-- Logo and Title -->
      <div class="flex items-center">
        <a href="/" class="flex items-center gap-2">
          <div class="w-10 h-10 bg-violet-200 dark:bg-violet-900/50 rounded-lg flex items-center justify-center text-violet-800 dark:text-violet-200 font-bold">
            DS
          </div>
          <span class="text-xl font-bold text-gray-800 dark:text-white hidden md:block">Demon Slayer Palette</span>
        </a>
      </div>
      
      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-6">
        <!-- Search Component -->
        <div class="w-64">
          <CharacterSearch on:characterSelect={handleCharacterSelect} />
        </div>
        
        <!-- Action Buttons -->
        <div class="flex items-center gap-3">
          <a 
            href="https://www.buymeacoffee.com" 
            target="_blank" 
            rel="noopener noreferrer"
            class="px-4 py-2 rounded-lg bg-violet-200 hover:bg-violet-300 text-violet-800 dark:bg-violet-900/40 dark:hover:bg-violet-900/60 dark:text-violet-100 transition-colors"
          >
            Support
          </a>
          <button
            class="p-2 rounded-lg bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
            on:click={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {#if darkMode}
              <Sun class="w-5 h-5 text-yellow-500" />
            {:else}
              <Moon class="w-5 h-5 text-violet-400" />
            {/if}
          </button>
        </div>
      </div>
      
      <!-- Mobile Menu Button -->
      <div class="md:hidden">
        <button 
          class="p-2 rounded-lg bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
          on:click={() => mobileMenuOpen = !mobileMenuOpen}
          aria-label="Toggle menu"
        >
          {#if mobileMenuOpen}
            <X class="w-6 h-6 text-gray-800 dark:text-white" />
          {:else}
            <Menu class="w-6 h-6 text-gray-800 dark:text-white" />
          {/if}
        </button>
      </div>
    </div>
  </div>
  
  <!-- Mobile Menu -->
  {#if mobileMenuOpen}
    <div class="md:hidden bg-white dark:bg-zinc-950 shadow-lg border-t dark:border-zinc-800 transition-all duration-300">
      <div class="container mx-auto px-4 py-4 space-y-4">
        <!-- Mobile Search -->
        <div class="w-full">
          <CharacterSearch on:characterSelect={handleCharacterSelect} />
        </div>
        
        <!-- Mobile Actions -->
        <div class="flex items-center justify-between">
          <a 
            href="https://www.buymeacoffee.com" 
            target="_blank" 
            rel="noopener noreferrer"
            class="px-4 py-2 rounded-lg bg-violet-200 hover:bg-violet-300 text-violet-800 dark:bg-violet-900/40 dark:hover:bg-violet-900/60 dark:text-violet-100 transition-colors"
          >
            Support
          </a>
          <button
            class="p-2 rounded-lg bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
            on:click={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {#if darkMode}
              <Sun class="w-5 h-5 text-yellow-500" />
            {:else}
              <Moon class="w-5 h-5 text-violet-400" />
            {/if}
          </button>
        </div>
      </div>
    </div>
  {/if}
  
</nav>
