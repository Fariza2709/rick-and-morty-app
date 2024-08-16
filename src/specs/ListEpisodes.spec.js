import { mount, RouterLinkStub } from "@vue/test-utils";
import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import ListEpisodes from '@/components/ListEpisodes.vue';
import EpisodeDetails from '@/components/EpisodeDetails.vue';
import flushPromises from 'flush-promises';

jest.mock('axios');

describe('ListEpisodes.vue', () => {
  let router;
  const episodes = [
    { id: 1, name: 'Episode 1', air_date: '2023-01-01' },
    { id: 2, name: 'Episode 2', air_date: '2023-01-02' }
  ];

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'Home', component: { template: '<div></div>' } },
        { path: '/character/:id/episodes', name: 'ListEpisodes', component: ListEpisodes },
        { path: '/episode/:id', name: 'EpisodeDetails', component: EpisodeDetails }
      ]
    });
  });

  it('displays episodes correctly when data fetching is successful', async () => {
    axios.get.mockResolvedValueOnce({ data: { episode: ['url1', 'url2'] } })
           .mockResolvedValueOnce({ data: episodes[0] })
           .mockResolvedValueOnce({ data: episodes[1] });

    const wrapper = mount(ListEpisodes, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': RouterLinkStub,
          'router-view': true
        },
      },
      props: {
        id: 1
      }
    });

    await flushPromises();
    await wrapper.vm.$nextTick();

    const ulElement = wrapper.find('ul');
    expect(ulElement.exists()).toBe(true);

    const episodeItems = ulElement.findAll('li');
    expect(episodeItems.length).toBe(episodes.length);

    episodeItems.forEach((item, index) => {
      const episode = episodes[index];
      expect(item.text()).toContain(episode.name);
      expect(item.text()).toContain(episode.air_date);
    });

    const routerLinks = wrapper.findAllComponents(RouterLinkStub);
    const episodeDetailsLink = routerLinks.find(link => link.props().to.name === 'EpisodeDetails');
    expect(episodeDetailsLink.exists()).toBe(true);
  });

  it('displays a message when no episodes are found', async () => {
    axios.get.mockResolvedValueOnce({ data: { episode: [] } });

    const wrapper = mount(ListEpisodes, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': RouterLinkStub,
          'router-view': true
        },
      },
      props: {
        id: 1
      }
    });

    await flushPromises();
    await wrapper.vm.$nextTick();

    const noEpisodesMessage = wrapper.find('.noEpisodes');
    expect(noEpisodesMessage.exists()).toBe(true);
    expect(noEpisodesMessage.text()).toBe('No episodes found.');
  });

  it('displays a loading message while data is being fetched', async () => {
    axios.get.mockResolvedValue({ data: { episode: [] } });

    const wrapper = mount(ListEpisodes, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': RouterLinkStub,
          'router-view': true
        }
      },
      props: {
        id: 1
      }
    });

    expect(wrapper.find('.loading').exists()).toBe(true);

    
    await flushPromises();

  
    await wrapper.vm.$nextTick();

    
    expect(wrapper.find('.loading').exists()).toBe(false);
  });

  it('displays an error message when data fetching fails', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    const wrapper = mount(ListEpisodes, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': RouterLinkStub,
          'router-view': true
        }
      },
      props: {
        id: 1
      }
    });

    await flushPromises();
    await wrapper.vm.$nextTick();

    const errorMessage = wrapper.find('.error');
    expect(errorMessage.exists()).toBe(true);
    expect(errorMessage.text()).toBe('Error fetching episode data.');
  });

  it('handles pagination buttons correctly', async () => {
    axios.get.mockResolvedValue({
      data: {
        episode: new Array(40).fill({ id: 1, name: 'Episode', air_date: 'Date' })
      }
    });

    const wrapper = mount(ListEpisodes, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': RouterLinkStub,
          'router-view': true
        }
      },
      props: {
        id: 1
      }
    });

    await flushPromises();
    await wrapper.vm.$nextTick();

    
    const buttons = wrapper.findAll('button');
    const buttonNext = buttons.find(button => button.text() === 'Next');
    const buttonPrevious = buttons.find(button => button.text() === 'Previous');
  
    expect(buttonNext.exists()).toBe(true);
    expect(buttonNext.text()).toBe('Next');
    
    await buttonNext.trigger('click');
    await flushPromises();
    expect(wrapper.vm.currentPage).toBe(2);
  
    expect(buttonPrevious.exists()).toBe(true);
    expect(buttonPrevious.text()).toBe('Previous');
  
    await buttonPrevious.trigger('click');
    await flushPromises();
    expect(wrapper.vm.currentPage).toBe(1);
  });
});
