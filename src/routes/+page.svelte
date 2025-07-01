<script lang="ts">
  import Navbar from '$lib/components/navbar.svelte'
  import type { Character } from '$lib/types/types'
  import { Clipboard, Check } from '@lucide/svelte'
  
  export let selectedCharacter: Character | null = null
  let originalImgUrl = ''
  let proxiedImgUrl = ''
  let palette: string[] = []
  let hoveredColor: string = ''
  let isLoading: boolean = false
  let isCopied: { [key: string]: boolean } = {}
  
  const handleCharacterSelect = async (
    event: CustomEvent<{ character: Character; img: string }>
  ) => {
    selectedCharacter = event.detail.character
    originalImgUrl = event.detail.img
    isLoading = true
    proxiedImgUrl = `/api/image-proxy?url=${encodeURIComponent(originalImgUrl)}`

    const paletteRes = await fetch(`/api/image-palette?url=${encodeURIComponent(originalImgUrl)}`)

    if (paletteRes.ok) {
      const data = await paletteRes.json()
      console.log(data)
      palette = data.palette
      isCopied = {}
    } else {
      palette = []
      console.error('Error fetching palette')
    }
    isLoading = false
  }

  const handleImageLoad = () => {
    isLoading = false
  }
  
  const copyToClipboard = (color: string) => {
    const hexColor = color.replace('#', '')
    navigator.clipboard.writeText(hexColor)
    isCopied = { ...isCopied, [color]: true }
    setTimeout(() => {
      isCopied = { ...isCopied, [color]: false }
    }, 2000)
  }
</script>

<Navbar
  {selectedCharacter}
  on:characterSelect={handleCharacterSelect}
  on:loading={(e) => {
    isLoading = e.detail
  }}
/>

<main class="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
  {#if !selectedCharacter && !isLoading}
    <div class="container mx-auto px-4 py-16 flex flex-col items-center text-center">
      <h1 class="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
        Demon Slayer Palette
      </h1>
      <p class="text-xl md:text-2xl mb-8 max-w-2xl text-gray-600 dark:text-zinc-300">
        Create beautiful color palettes inspired by your favorite Demon Slayer characters. 
        Just search for any character to discover their unique color scheme.
      </p>
      
      <div class="w-full max-w-md mx-auto mt-8 mb-16">
      </div>
    </div>
  {/if}

  {#if isLoading}
    <div class="container mx-auto px-4 py-16 flex flex-col items-center">
      <div class="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl p-8 flex flex-col items-center">
        <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Generating palette...</h2>
        <div class="w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-gray-600 dark:text-zinc-300">Please wait while we analyze the character's colors</p>
      </div>
    </div>
  {/if}

  {#if selectedCharacter && !isLoading}
    <div class="container mx-auto px-4 py-8">
      <div class="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm">
        <div class="bg-gray-50 dark:bg-zinc-900 p-6 text-gray-800 dark:text-white">
          <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div class="w-64 h-64 rounded-xl bg-white dark:bg-zinc-800 p-2 shadow-sm overflow-hidden flex-shrink-0">
              <img
                src={originalImgUrl}
                alt={selectedCharacter.name}
                class="w-full h-full object-contain rounded-lg hover:scale-105 transition-transform"
                on:load={handleImageLoad}
              />
            </div>
            <div class="flex-1 text-center md:text-left">
              <h1 class="text-3xl md:text-4xl font-bold mb-2">{selectedCharacter.name}</h1>
              <p class="text-xl opacity-90 mb-4">{selectedCharacter.race}</p>
              
              <div class="grid grid-cols-2 gap-4 max-w-md">
                <div class="bg-gray-100 dark:bg-zinc-800 rounded-lg p-3">
                  <p class="text-sm opacity-80">Age</p>
                  <p class="font-semibold">{selectedCharacter.age}</p>
                </div>
                <div class="bg-gray-100 dark:bg-zinc-800 rounded-lg p-3">
                  <p class="text-sm opacity-80">Gender</p>
                  <p class="font-semibold">{selectedCharacter.gender}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {#if selectedCharacter.quote}
          <div class="p-6 border-b border-gray-200 dark:border-zinc-800 dark:border-t">
            <blockquote class="italic text-gray-600 dark:text-zinc-300 text-lg">
              "{selectedCharacter.quote}"
            </blockquote>
          </div>
        {/if}
        
        <!-- Color Palette Section -->
        <div class="p-6">
          <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Color Palette</h2>
          
          {#if palette.length}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {#each palette as color}
                <div 
                  class="rounded-xl overflow-hidden shadow-sm transition-transform hover:scale-105 hover:shadow-md"
                  style="background-color: {color}"
                >
                  <div class="h-32"></div>
                  <div class="bg-black/10 dark:bg-zinc-900/10 p-4 flex justify-between items-center">
                    <span class="font-mono font-medium text-gray-100 dark:text-gray-100">{color}</span>
                    <button 
                      class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors group"
                      on:click={() => copyToClipboard(color)}
                      aria-label="Copy color code"
                    >
                      {#if isCopied[color]}
                        <Check class="w-5 h-5 text-green-500" />
                      {:else}
                        <Clipboard class="w-5 h-5 text-gray-100 dark:text-gray-100 group-hover:text-gray-500 dark:group-hover:text-gray-100  transition-colors" />
                      {/if}
                    </button>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <p class="text-gray-600 dark:text-zinc-400">No palette available for this character.</p>
          {/if}
        </div>
        
        {#if selectedCharacter.description}
          <div class="p-6 bg-gray-50 dark:bg-zinc-900 dark:border-zinc-800 dark:border-t">
            <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">About</h2>
            <p class="text-gray-700 dark:text-zinc-400">{selectedCharacter.description}</p>
          </div>
        {/if}
      </div>
    </div>
  {/if}
  
  <footer class="mt-16 py-8 border-t border-gray-200 dark:border-zinc-800">
    <div class="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
      <p class="mb-4">Demon Slayer Palette is a fan project and is not affiliated with or endorsed by the creators of Demon Slayer.</p>
      <p> 2025 Demon Slayer Palette. All rights reserved.</p>
    </div>
  </footer>
</main>
