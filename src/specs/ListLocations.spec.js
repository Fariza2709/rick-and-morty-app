import { mount, RouterLinkStub } from "@vue/test-utils";
import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import ListOfCharacters from '@/components/ListOfCharacters.vue';
import CharacterDetail from '@/components/CharacterDetail.vue';
import ListLocations from "@/components/ListLocations.vue";
import flushPromises from 'flush-promises';
import LocationDetails from '@/components/LocationDetails.vue';

jest.mock('axios');

describe('ListLocations.vue', () => {
  let router;

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'Home', component: ListOfCharacters },
        { path: '/character/:id', name: 'CharacterDetail', component: CharacterDetail },
        { path: '/locations/:id', name: 'ListLocations', component: ListLocations },
        { path: '/locations/:id/locationDetails', name: 'LocationDetails', component: LocationDetails }
      ]
    });
  });


  it('displays locations correctly when data fetching is successful', async () => {
    const locations = [
      { id: 1, name: 'Location 1', type: 'Type 1' },
      { id: 2, name: 'Location 2', type: 'Type 2' }
    ];

    axios.get.mockResolvedValue({ data: { results: locations } });

    const wrapper = mount(ListLocations, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': RouterLinkStub,
          'router-view': true
        }
      }
    });

    await flushPromises();
    await wrapper.vm.$nextTick();

    const ulElement = wrapper.find('ul');
    expect(ulElement.exists()).toBe(true);

    const locationItems = ulElement.findAll('li');
    expect(locationItems.length).toBe(locations.length);

    locationItems.forEach((item, index) => {
      const location = locations[index];
      expect(item.text()).toContain(location.name);
      expect(item.text()).toContain(location.type);
    });

    const routerLinks = wrapper.findAllComponents(RouterLinkStub);
    const locationDetailsLinks = routerLinks.find(link => link.props().to.name === 'LocationDetails');

    
    await router.push({ name: 'LocationDetails', params: { id: locations[0].id } });
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('LocationDetails');
  });


  it('displays a message when no locations are found', async () => {
    axios.get.mockResolvedValue({ data: { results: [] } });

    const wrapper = mount(ListLocations, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': RouterLinkStub,
          'router-view': true
        }
      }
    });

    await flushPromises();
    await wrapper.vm.$nextTick();

    const noLocationsMessage = wrapper.find('.noLocationFound');
    expect(noLocationsMessage.exists()).toBe(true);
    expect(noLocationsMessage.text()).toBe('No locations found.');
  });

  it('displays a loading message while data is being fetched', async () => {
    axios.get.mockResolvedValue({ data: { results: [] } });
  
    const wrapper = mount(ListLocations, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': RouterLinkStub,
          'router-view': true
        }
      }
    });
  
    let loadingMessage = wrapper.find('.loading');
    expect(loadingMessage.exists()).toBe(true);
  
    await flushPromises();
    await wrapper.vm.$nextTick();

    
    loadingMessage = wrapper.find('.loading');
    expect(loadingMessage.exists()).toBe(false);
  });

  it('displays an error message when data fetching fails', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    const wrapper = mount(ListLocations, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': RouterLinkStub,
          'router-view': true
        }
      }
    });

    await flushPromises();
    await wrapper.vm.$nextTick();

    const errorMessage = wrapper.find('.error');
    expect(errorMessage.exists()).toBe(true);
    expect(errorMessage.text()).toBe('Не удалось загрузить локации');
  });
});
