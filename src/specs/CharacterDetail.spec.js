import { mount, RouterLinkStub } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import ListOfCharacters from '@/components/ListOfCharacters.vue';
import CharacterDetail from '@/components/CharacterDetail.vue';
import ListLocations from '@/components/ListLocations.vue';
import ListEpisodes from '@/components/ListEpisodes.vue';
import flushPromises from 'flush-promises';
import axios from 'axios';

jest.mock('axios');

describe('CharacterDetail.vue', () => {
  let router;
  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'Home', component: ListOfCharacters },
        { path: '/character/:id', name: 'CharacterDetail', component: CharacterDetail },
        { path: '/character/:id/locations', name: 'ListLocations', component: ListLocations },
        { path: '/character/:id/episodes', name: 'ListEpisodes', component: ListEpisodes },
      ]
    });
  });
  const character = {
    id: 779,
    name: 'Young Memory Rick',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    origin: { name: "Birdperson's Consciousness" },
    image: 'rick.jpeg',
    location: 'Locations:',
    episode: 'Episodes:',
    created: '2021-10-25T09:12:36.210Z'
  };

  it('display all characters and check clicks', async () => {
    axios.get.mockResolvedValue({ data: character });
    const wrapper = mount(CharacterDetail, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': RouterLinkStub,
          'router-view': true
        }
      },
      props: {
        id: character.id
      },
    });

    await flushPromises();
    await wrapper.vm.$nextTick();

    const routerLinks = wrapper.findAllComponents(RouterLinkStub);

    const locationLink = routerLinks.find(link => link.props().to.name === 'ListLocations');
    const episodesLink = routerLinks.find(link => link.props().to.name === 'ListEpisodes');

    expect(locationLink).toBeTruthy();
    expect(episodesLink).toBeTruthy();

    await router.push({ name: 'ListLocations', params: { id: character.id } });
    await flushPromises();

    expect(router.currentRoute.value.name).toBe('ListLocations');

    await router.push({ name: 'ListEpisodes', params: { id: character.id } });
    await flushPromises();

    expect(router.currentRoute.value.name).toBe('ListEpisodes');
  });

  it('sets loading to false after fetching character', async () => {
    axios.get.mockResolvedValue({ data: { name: 'Rick', image: 'rick.png', status: 'Alive', species: 'Human', gender: 'Male', origin: { name: 'Earth' }, created: '2020-01-01T00:00:00Z', id: 1 } });

    const wrapper = mount(CharacterDetail, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': RouterLinkStub,
          'router-view': true
        }
      },
      props: { id: 1 }
    });

    expect(wrapper.vm.loading).toBe(true);

    await flushPromises();

    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.character).toBeDefined();
  });

  it('handles fetch error correctly', async () => {
    axios.get.mockRejectedValue(new Error('Failed to fetch'));

    const wrapper = mount(CharacterDetail, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': RouterLinkStub,
          'router-view': true
        }
      },
      props: { id: 1 }
    });

    await flushPromises(); 

    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.error).toBe('Failed to fetch character data.');
  });
});
