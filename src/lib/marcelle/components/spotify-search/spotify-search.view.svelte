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
        const data = await spotifyApi.searchTracks(input) as any;
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


    function formatTime(ms: number) {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${(+seconds < 10 ? '0' : '')}${seconds}`;
    }
    function handleKeydownInput(event: KeyboardEvent) {
  if (event.key=== 'ArrowDown' && searchResults.length > 0 ) {
    document.getElementById('result-0').focus();
    event.preventDefault();
  }
}
function handleKeydownLi(event: KeyboardEvent,music:any,myId:number) {
  if (searchResults.length > 1 ) {
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        if (myId === 0){
          document.getElementById(`result-${searchResults.length-1}`).focus();
        }
        else document.getElementById(`result-${myId-1}`).focus();
        return;
      case "ArrowDown":
        event.preventDefault();
        if (myId===(searchResults.length-1) ){
          document.getElementById(`result-0`).focus();
        }
        else document.getElementById(`result-${myId+1}`).focus();
        return;
      case "Enter":
        event.preventDefault();
        console.log(music);
        break;

      default:

    }



  }
}
    export let title: string;
    export let bdd:any

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
 <input type="text" placeholder="Rechercher sur Spotify" on:keydown={handleKeydownInput} bind:value={input} on:input={handleSearch}>

 {#if searchResults.length > 0}
   <div class="results">
     <ul>
       {#each searchResults as result, i}
         <li id={`result-${i}`} on:keydown={(e)=>handleKeydownLi(e,result,i)}  on:click={(e) => {bdd.create({x:result.name,y:document.querySelector("#component-002 > div > div > select").value,ide:result.id,id:result.id,artist:result.artist});console.log(e.currentTarget);  activeResult = result; }} class:selected={result === activeResult}  tabindex="0">
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
