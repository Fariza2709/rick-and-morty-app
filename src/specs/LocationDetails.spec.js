import { mount } from '@vue/test-utils';
import LocationDetails from '@/components/LocationDetails.vue';
import flushPromises from 'flush-promises';
import axios from 'axios';

jest.mock('axios');

describe('LocationDetails.vue', () => {
  it('displays location details', async () => {
    const locationDetails = {
      id: 1,
      name: 'Young Memory Rick',
      type: 'Planet',
      dimension: 'unknown',
      residents: [
        'https://rickandmortyapi.com/api/character/1',
        'https://rickandmortyapi.com/api/character/2'
      ]
    };
    
    const characters = [
      { id: 1, name: 'Rick Sanchez', image: 'rick.png' },
      { id: 2, name: 'Morty Smith', image: 'morty.png' }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('location')) {
        return Promise.resolve({ data: locationDetails });
      } else {
        return Promise.resolve({ data: characters.find(c => url.includes(c.id)) });
      }
    });

    const wrapper = mount(LocationDetails, {
      props: { id: 1 }
    });

    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.locationTitle').text()).toContain(locationDetails.name);
    expect(wrapper.find('.locationType').text()).toContain(locationDetails.type);
    expect(wrapper.find('.locationDimension').text()).toContain(locationDetails.dimension);

    const ulElement = wrapper.find('ul');
    expect(ulElement.exists()).toBe(true);

    const characterItems = ulElement.findAll('li');
    expect(characterItems).toHaveLength(2);

    characterItems.forEach((item, index) => {
      const character = characters[index];
      expect(item.find('img').attributes('src')).toBe(character.image);
      expect(item.find('.displayName').text()).toBe(character.name);
    });
  });

  it('displays a message when no location details are found', async () => {
      axios.get.mockResolvedValue({ data: { residents: [] } });

    const wrapper = mount(LocationDetails, {
      props: { id: 1 }
    });

    await flushPromises();
    await wrapper.vm.$nextTick();

    const noLocationDetailsMessage = wrapper.find('.noLocationDetails');
    expect(noLocationDetailsMessage.exists()).toBe(true);
    expect(noLocationDetailsMessage.text()).toBe('No location details found.');
  });

    it('displays a loading message while data is being fetched', async () => {
      axios.get.mockResolvedValue({ data: { residents: [] } });
  
      const wrapper = mount(LocationDetails, {
        props: { id: 1 }
      });
  
      expect(wrapper.find('.loading').exists()).toBe(true);
  
      await flushPromises();
      await wrapper.vm.$nextTick();
      
      expect(wrapper.find('.loading').exists()).toBe(false);
    });

      it('displays an error message if data fetching fails', async () => {
          axios.get.mockRejectedValue(new Error('Network Error'));
    
        const wrapper = mount(LocationDetails, {
          props: { id: 1 }
        });
    
        await flushPromises();
        await wrapper.vm.$nextTick();
        
        const errorMessage = wrapper.find('.error');
        expect(errorMessage.exists()).toBe(true);
        expect(errorMessage.text()).toBe('Error fetching location data.');
      });
    });