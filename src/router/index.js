import { createRouter, createWebHistory } from 'vue-router';
import ListOfCharacters from '../components/ListOfCharacters.vue';
import CharacterDetail from '../components/CharacterDetail.vue';
import ListEpisodes from '../components/ListEpisodes.vue'; 
import EpisodeDetails from '../components/EpisodeDetails.vue';
import ListLocations from '../components/ListLocations.vue';
import LocationDetails from '../components/LocationDetails.vue';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: ListOfCharacters
  },
  {
    path: '/character/:id',
    name: 'CharacterDetail',
    component: CharacterDetail,
    props: true
  },
  {
    path: '/character/:id/locations',
    name: 'ListLocations',
    component: ListLocations,
    props: true
  },
  {
    path: '/locations/:id/locationDetails',
    name: 'LocationDetails',
    component: LocationDetails,
    props: true
  },
  {
    path: '/character/:id/episodes',
    name: 'ListEpisodes',
    component: ListEpisodes,
    props: true
  },
  {
    path: '/episode/:id',
    name: 'EpisodeDetails',
    component: EpisodeDetails,
    props: true
  }  
];


const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
