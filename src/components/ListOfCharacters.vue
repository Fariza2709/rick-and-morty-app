<template>
  <div class="characters_wrapper">
    <h1 class="titleRick">Rick and Morty</h1>
    <ul>
      <li class="listOfCharacters" v-for="character in characters" :key="character.id">
        <router-link :to="{ name: 'CharacterDetail', params: { id: character.id } }">
          <img class="displayImg" :src="character.image" :alt="character.name" />
          <div class="displayName">{{ character.name }}</div>
          </router-link>
      </li>
    </ul>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
  import axios from 'axios';


export default {
  name: 'ListCharacters',
  data() {
    return {
      characters: [],
      error: null,
      loading: true,
      page: 1,
      totalPages: 1
    };
  },
  created() {
    this.fetchCharacters();
  },
  methods: {
    async fetchCharacters() {
      this.loading = true;
      try {
        const response = await axios.get(`https://rickandmortyapi.com/api/character?page=${this.page}`);
        this.characters = response.data?.results || [];
      } catch (error) {
        this.error = 'Не удалось загрузить персонажей';
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
  .characters_wrapper {
    height: auto;
    width: 100%;
    background-color: black;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 150px;
    position: relative;
  }

  ul {
    list-style-type: none;
    padding-left: 50px;
    padding-right: 50px;
  }

  .listOfCharacters {
    text-align: center;
    margin: 10px;
    display: inline-block;
  }

  h1.titleRick {
    position: absolute;
    top: 10px;
    text-align: center;
    color: white;
    padding-top: 40px;
    margin-bottom: 50px;
    margin-top: 0;
  }

  .displayImg {
    border-radius: 50%;
    width: 100px;
    height: 100px; 
    display: block;
    margin: 0 auto; 
  }

  .displayName {
    margin-top: 8px; 
    text-align: center;
    color: white;
    text-decoration: none;
    font-size: 12px;
    width: 100px;
  }

  .loading {
    font-weight: bold;
    color: white;
  }

  .error {
    color: red;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    .characters_wrapper {
      padding-top: 50px;
    }

    h1.titleRick {
      font-size: 20px;
    } 
    ul {
      padding-top: 40px;
    }
    .displayImg {
      width: 80px;
      height: 80px;
    }
    .displayName {
      font-size: 14px;
    }
  }

</style>
