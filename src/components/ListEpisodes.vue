<template>
  <div class="bgEpisodes">
    <h2 class="episodes">Episodes:</h2>
    <div v-if="loading" class="loading">Loading ...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <ul v-if="!loading && !error && episodes.length">
      <li class="listEpisodes" v-for="episode in episodes" :key="episode.id">
        <router-link :to="{ name: 'EpisodeDetails', params: { id: episode.id } }">
          {{ episode.name }}
        </router-link> - {{ episode.air_date }}
      </li>
    </ul>
    <p v-else class="noEpisodes">No episodes found.</p>
    <div v-if="totalPages > 1" class="pagination">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'ListEpisodes',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      episodes: [],
      loading: true,
      error: null,
      currentPage: 1,
      totalPages: 1
    };
  },
  created() {
    this.fetchEpisodes();
  },
  methods: {
    async fetchEpisodes(page = 1) {
      try {
        const response = await axios.get(`https://rickandmortyapi.com/api/character/${this.id}`);
        const episodeUrls = response.data.episode;
        
        const pageSize = 20; 
        const startIndex = (page - 1) * pageSize;
        const paginatedUrls = episodeUrls.slice(startIndex, startIndex + pageSize);

        const episodePromises = paginatedUrls.map(url => axios.get(url));
        const episodeResponses = await Promise.all(episodePromises);

        this.episodes = episodeResponses.map(response => response.data);
        this.totalPages = Math.ceil(episodeUrls.length / pageSize);
        this.currentPage = page;

      } catch (error) {
        this.error = 'Error fetching episode data.';
        if (process.env.NODE_ENV === 'development') {
              console.error('Ошибка при загрузке данных о локациях:', error);
          }
      } finally {
        this.loading = false;
      }
    },
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.fetchEpisodes(page);
      }
    }
  }
};
</script>
<style scoped>
/* ваш стиль здесь */
</style>

<style scoped>
.bgEpisodes {
  background-color: #fff;
  padding: 20px;
}

.episodes {
  padding-top: 40px;
  padding-bottom: 20px;
  color: #000;
  font-size: 25px;
}

ul {
  list-style-type: none;
  color: #000;
  font-size: 16px;
  padding-bottom: 40px;
}

.listEpisodes {
  margin-bottom: 10px;
}

a {
  text-decoration: none;
  color: #000;
  font-size: 16px;
}

.noEpisodes {
  color: #000;
  font-size: 16px;
}

.error {
  color: red;
  font-size: 16px;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

button {
  margin: 0 5px;
  padding: 5px 10px;
  font-size: 16px;
}
</style>
