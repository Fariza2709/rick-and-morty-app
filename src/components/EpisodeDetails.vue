<template>
  <div class="episode">
    <div v-if="loading" class="loading">Loading...</div>
    <div class="error">{{ error }}</div>
    <div v-if="episode">
      <h2 class="episodeTitle">{{ episode.name }}</h2>
      <p class="episodeAirDate">Air Date: {{ episode.air_date }}</p>
      <p class="episodeEpisode">Episode: {{ episode.episode }}</p>
      <p class="episodeListCharacters">Characters:</p>
      <ul>
      <li v-for="character in characters" :key="character.id" class="listOfCharacters">
        <img v-if="character.image" class="displayImg" :src="character.image" :alt="character.name" />
        <div class="displayName">{{ character.name }}</div>
      </li>
    </ul>
  </div>
  <p class="noEpisodeDetailsFound">No episode details found.</p>
</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EpisodeDetails',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      episode: null,
      characters: [],
      error: null,
      loading: true
    };
  },
  created() {
    this.fetchEpisode();
  },
  methods: {
    async fetchEpisode() {
      try {
        const response = await axios.get(`https://rickandmortyapi.com/api/episode/${this.id}`);
        this.episode = response.data;

        const characterRequests = this.episode.characters.map(url => axios.get(url));
        const characterResponses = await Promise.all(characterRequests);
        this.characters = characterResponses.map(res => res.data);
      } catch (error) {
        this.error = 'Error fetching episode data.';
        if (process.env.NODE_ENV === 'development') {
              console.error('Ошибка при загрузке данных о локациях:', error);
            } 
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>

  .episode {
    width: 100%;
    min-height: 100vh;
  }
  .episodeTitle {
    padding-top: 50px;
    color: #fff;
  }
  .episodeAirDate,
  .episodeEpisode,
  .episodeListCharacters {
    color: #fff;
    font-size: 20px;
}

  ul {
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    padding: 0;
  }

  .listOfCharacters {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .displayImg {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin: 10px;
  }

  .displayName {
    margin-left: 10px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 20px;
  }

.loading {
  font-size: 18px;
  font-weight: bold;
}

.error {
  color: red;
  font-size: 18px;
  font-weight: bold;
}
</style>
