<template>
  <div class="locations_wrapper">
        <div v-if="loading" class="loading">Loading...</div>
        <div v-if="error" class="error">{{ error }}</div>
        <h2 class="locations">Locations:</h2>
        <ul v-if="!loading && !error && locations.length">
        <li v-for="location in locations" :key="location.id" class="listLocationsNameAndType">
        <router-link :to="{ name: 'LocationDetails', params: { id: location.id } }">
          {{ location.name }}
        </router-link>
        <p>Type: {{ location.type }}</p>
      </li>
    </ul>
    <p v-else class="noLocationFound">No locations found.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ListLocations',
  data() {
    return {
      locations: [],
      error: null,
      loading: true,
    };
  },
  created() {
    this.fetchLocations();
  },
  methods: {
  async fetchLocations() {
    try {
        const response = await axios.get(`https://rickandmortyapi.com/api/location?page=${this.page}`);
        this.locations = response.data.results;
        } catch (error) {
            this.error = 'Не удалось загрузить локации';
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
.locations_wrapper {
  padding: 20px;
}

.locations {
  font-size: 25px;
  margin-bottom: 20px;
  color: #fff;
}

ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.listLocationsNameAndType {
  margin-bottom: 10px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

p {
  margin: 10px;
}

.loading {
  font-weight: bold;
  color: #fff;
}

.error {
  color: red;
  font-weight: bold;
}

@media (max-width: 768px) {
  .locations_wrapper {
    padding: 10px;
  }

  .locations {
    font-size: 20px;
  }

  ul {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .listLocationsNameAndType {
    flex-direction: column;
  }
}
</style>
