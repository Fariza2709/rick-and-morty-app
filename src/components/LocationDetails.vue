<template>
  <div class="locationDetail">
    <div class="loading" v-if="loading">Loading...</div>
    <div class="error">{{ error }}</div>
    <div v-if="!loading && !error && location">
      <h2 class="locationTitle">{{ location.name }}</h2>
      <p class="locationType">Type: {{ location.type }}</p>
      <p class="locationDimension">Dimension: {{ location.dimension }}</p>
      <p class="locationListCharacters">Characters:</p>
    <ul>
      <li v-for="character in characters" :key="character.id" class="listOfCharacters">
        <img v-if="character.image" class="displayImg" :src="character.image" :alt="character.name" />
        <div class="displayName">{{ character.name }}</div>
      </li>
    </ul>
  </div>
  <p class="noLocationDetails">No location details found.</p>
</div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'locationDetails',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      location: null,
      characters: [],
      loading: true,
      error: null
    };
  },
  created() {
    this.fetchLocationDetails();
  },
  methods: {
    async fetchLocationDetails() {   

      try {
        const response = await axios.get(`https://rickandmortyapi.com/api/location/${this.id}`);
        this.location = response.data;
        const characterRequests = this.location.residents.map(url => axios.get(url));
        const characterResponses = await Promise.all(characterRequests);
        this.characters = characterResponses.map(res => res.data);
      } catch (error) {
        this.error = 'Error fetching location data.';
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
  .locationDetail {
    width: 100%;
    min-height: 100vh;
  }

  .locationTitle {
    padding-top: 50px;
    color: #fff;
  }

  ul {
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
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

  .locationType, 
  .locationDimension, 
  .locationListCharacters {
    color: #fff;
    font-size: 16px;
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
