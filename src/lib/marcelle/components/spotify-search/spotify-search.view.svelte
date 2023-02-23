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
    let searchResults: {id: string,name: string,artist: string,image: string,duration_ms: number}[] = [];
    let activeResult: {id: string, name: string, artist: string, image: string,duration_ms: number } | null = null;
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
          image: track.album.images[0].url,
          duration_ms: track.duration_ms


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
    function formatTime(ms: number) {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${(+seconds < 10 ? '0' : '')}${seconds}`;
    }
    export let title: string;
  
  </script>
 <style>
  .search {
 position: relative;
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
 display: flex;
 align-items: center;
}

.search .results li:hover {
 background: #f9f9f9;
}

.search .results li.selected {
 background: #f9f9f9;
}

.search .results li img {
 margin-right: 10px;
 height: 50px;
 width: 50px;
 object-fit: cover;
}

.search .results li .result-container {
 display: flex;
 flex-direction: row;
 align-items: center;
 width: 100%;
}

.search .results li .result-details {
 display: flex;
 flex-direction: column;
 margin-left: 10px;
 flex-grow: 1;
}

.search .results li .result-name {
 font-weight: bold;
}

.search .results li .result-artist {
 margin-top: 5px;
 font-size: 14px;
 color: #999;
}

.search .results li .result-time {
 text-align: right;
 font-size: 14px;
 color: #999;
 white-space: nowrap;
}
</style>
<ViewContainer {title}>
<div class="search">
 <input type="text" placeholder="Rechercher sur Spotify" bind:value={input} on:input={handleSearch}>
   
 {#if searchResults.length > 0}
   <div class="results">
     <ul>
       {#each searchResults as result}
         <li on:click={() => { activeResult = result; }} class:selected={result === activeResult} on:keydown={handleKeydown} tabindex="0">
           <div class="result-container">
             <img src={result.image} alt={result.name}>
             <div class="result-details">
               <div class="result-name">{result.name}</div>
               <div class="result-artist">{result.artist}</div>
             </div>
             
             <div class="result-time">{formatTime(result.duration_ms)}</div>
           </div>
         </li>
       {/each}
     </ul>
   </div>
 {/if}
</div>
</ViewContainer>
