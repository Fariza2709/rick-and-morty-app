<template>
  <div class="character">
  <div v-if="loading" class="loading">Loading...</div>
  <div v-if="error" class="error">{{ error }}</div>
  <div class="characterDetails" v-if="!loading && !error && character">
    <img :src="character.image" :alt="character.name" class="characterDetailsImage"/>
    <h2 class="characterName">{{ character.name }}</h2>
    <p class="status">Status: {{ character.status }}</p>
    <p class="species">Species: {{ character.species }}</p>
    <p class="gender">Gender: {{ character.gender }}</p>
    <p>
      <router-link :to="{ name: 'ListLocations', params: { id: character.id } }">Locations:</router-link>
    </p>
    <p class="origin">Origin: {{ character.origin.name }}</p>
    <p>
      <router-link :to="{ name: 'ListEpisodes', params: { id: character.id } }">Episodes:</router-link>
    </p>
    <p class="created">Created: {{ character.created }}</p>
  </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CharacterDetail',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      character: null,
      error: null,
      loading: true
    };
  },
  created() {
    this.fetchCharacter();
  },
  methods: {
    async fetchCharacter() {
      try {
        const response = await axios.get(`https://rickandmortyapi.com/api/character/${this.id}`);
        this.character = response.data;
      } catch (error) {
        this.error = 'Failed to fetch character data.';
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching character data:', error);
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.characterDetails {
  padding-bottom: 40px;
  padding-top: 60px;
}

.characterDetailsImage {
  width: 200px;
  height: auto;
  border-radius: 50%;
}

.status, .species, .gender, .origin, .created {
  color: white;
  font-size: 16px;
}

h2.characterName {
  color: white;
  font-size: 20px;
}

.loading {
  width: 100%;
  height: 100%;
  padding-top: 100px;
  color: white;
}

.error {
  color: red;
  padding-top: 100px;
  text-align: center;
}
</style>
