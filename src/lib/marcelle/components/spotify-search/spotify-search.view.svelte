<script lang="ts">
    import { ViewContainer } from '@marcellejs/design-system';
    import SpotifyWebApi from 'spotify-web-api-node';
    import { onMount } from 'svelte';

    
    const spotifyApi = new SpotifyWebApi();
    const clientId = import.meta.env.VITE_SPOTIPY_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_SPOTIPY_CLIENT_SECRET;
    onMount(() => {
    

    // Obtenir le jeton d'accès en utilisant les identifiants de l'application
    const credentials = btoa(`${clientId}:${clientSecret}`);
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`,
      },
      body: 'grant_type=client_credentials',
    };

    fetch('https://accounts.spotify.com/api/token', requestOptions)
      .then(response => response.json())
      .then(data => {
        const accessToken = data.access_token;
        spotifyApi.setAccessToken(accessToken);
      })
      .catch(err => console.error(err));
  });



    let input = '';
    let searchResults: { id: string, name: string, artist: string }[] = [];
    let activeResult: { id: string, name: string, artist: string } | null = null;
    async function handleSearch() {
      if (input.trim() === '') {
        searchResults = [];
        return;
      }
  
      try {
        const data = await spotifyApi.searchTracks(input);
        searchResults = data.body.tracks.items.map((track : any) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
        }));
      } catch (error) {
        console.error(error);
      }
    }
  
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Enter' && activeResult) {
        console.log(activeResult);
      }
    }
  
    export let title: string;
  
  </script>
  <style>
    .search {
      position: relative;
      z-index: 1000;
    }

    .search input[type="text"] {
      width: 100%;
      padding: 10px;
      border: none;
      border-bottom: 1px solid #ccc;
      font-size: 16px;
    }
  
    .search .results {
      top: 100%;
      left: 0;
      right: 0;
      max-height: 300px;
      overflow-y: auto;
      background: #fff;
      border: 1px solid #ccc;
      border-top: none;
    }
  
    .search .results ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
  
    .search .results li {
      padding: 10px;
      cursor: pointer;
    }
  
    .search .results li:hover {
      background: #f9f9f9;
    }
  
    .search .results li.selected {
      background: #f9f9f9;
    } 
  </style>
  <ViewContainer {title}>
      <div class="search">
          <input type="text" placeholder="Rechercher sur Spotify" bind:value={input} on:input={handleSearch}>
        
          {#if searchResults.length > 0}
            <div class="results">
              <ul>
                {#each searchResults as result}
                  <li 
                    on:click={() => {activeResult = result;console.log(activeResult)}} 
                    class:selected={result === activeResult} 
                    on:keydown={handleKeydown} 
                    
                  >
                    {result.name} - {result.artist}
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>
  </ViewContainer>
  