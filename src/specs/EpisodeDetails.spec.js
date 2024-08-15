import { mount } from '@vue/test-utils';
import EpisodeDetails from '@/components/EpisodeDetails.vue';
import flushPromises from 'flush-promises';
import axios from 'axios';

jest.mock('axios');

describe('EpisodeDetails', () => {
  it('displays episode details', async () => {
    const episodeDetails = {
      id: ' 1',
      name: 'Pickle Rick',
      air_date: "July 30, 2017",
      episode: "S03E02",
      characters: [
        'https://rickandmortyapi.com/api/character/1',
        'https://rickandmortyapi.com/api/character/2',
        'https://rickandmortyapi.com/api/character/3',
        'https://rickandmortyapi.com/api/character/4',
        'https://rickandmortyapi.com/api/character/5'
      ]
    };
    
    const characters = [
      { id: 1, name: 'Rick Sanchez', image: 'rick.png' },
      { id: 2, name: 'Morty Smith', image: 'morty.png' },
      { id: 3, name: 'Summer Smith', image: 'summer.png' },
      { id: 4, name: 'Beth Smith', image: 'beth.png' },
      { id: 5, name: 'Jerry Smith', image: 'jerry.png' }
    ];


    axios.get.mockImplementation((url) => {
      if (url.includes('episode')) {
        return Promise.resolve({ data: episodeDetails });
      } else if (url.includes('character')) {
        const id = parseInt(url.split('/').pop(), 10);
        const character = characters.find(c => c.id === id);
        return Promise.resolve({ data: character });
      }
    });
    

    const wrapper = mount(EpisodeDetails, {
      props: { id: 1 }
    });


    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.episodeTitle').text()).toContain(episodeDetails.name);
    expect(wrapper.find('.episodeAirDate').text()).toContain(episodeDetails.air_date);
    expect(wrapper.find('.episodeEpisode').text()).toContain(episodeDetails.episode);

    await flushPromises();
    await wrapper.vm.$nextTick();
    
    const ulElement = wrapper.find('ul');
    expect(ulElement.exists()).toBe(true);
  

    await flushPromises();
    await flushPromises();

    const characterItems = ulElement.findAll('li');
    expect(characterItems.length).toBe(characters.length);
    
    characterItems.forEach((item, index) => {
      const character = characters[index];
      expect(item.find('img').attributes('src')).toBe(character.image);
      expect(item.find('.displayName').text()).toBe(character.name);
    });
  });

  it('displays a message when no location details are found', async () => {
      axios.get.mockResolvedValue({ data: { residents: [] } });

    const wrapper = mount(EpisodeDetails, {
      props: { id: 1 }
    });

    await flushPromises();
    await wrapper.vm.$nextTick();

    const noEpisodeDetailsMessage = wrapper.find('.noEpisodeDetailsFound');
    expect(noEpisodeDetailsMessage.exists()).toBe(true);
    expect(noEpisodeDetailsMessage.text()).toBe('No episode details found.');
  });

    it('displays a loading message while data is being fetched', async () => {
      axios.get.mockResolvedValue({ data: { residents: [] } });
  
      const wrapper = mount(EpisodeDetails, {
        props: { id: 1 }
      });
  
      expect(wrapper.find('.loading').exists()).toBe(true);
  
      await flushPromises();
      await wrapper.vm.$nextTick();
      
      expect(wrapper.find('.loading').exists()).toBe(false);
    });

      it('displays an error message if data fetching fails', async () => {
          axios.get.mockRejectedValue(new Error('Network Error'));
    
        const wrapper = mount(EpisodeDetails, {
          props: { id: 1 }
        });
    
        await flushPromises();
        await wrapper.vm.$nextTick();
        
        const errorMessage = wrapper.find('.error');
        expect(errorMessage.exists()).toBe(true);
        expect(errorMessage.text()).toBe('Error fetching episode data.');
      });
    });