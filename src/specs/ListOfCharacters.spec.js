import { mount, RouterLinkStub } from '@vue/test-utils';
import ListOfCharacters from '../components/ListOfCharacters.vue';
import CharacterDetail from '../components/CharacterDetail.vue';
import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import flushPromises from 'flush-promises'; 
jest.mock('axios');

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: ListOfCharacters,
      props: true
    },
    {
      path: '/character/:id',
      name: 'CharacterDetail',
      component: CharacterDetail,
      props: true
    },
  ]
});

describe('ListOfCharacters.vue', () => {
  it('renders characters correctly after data is fetched', async () => {
    const characters = [
      { id: 1, name: 'Rick Sanchez', image: 'rick.png' },
      { id: 2, name: 'Morty Smith', image: 'morty.png' }
    ];

    axios.get.mockResolvedValue({ data: { results: characters } });

    const wrapper = mount(ListOfCharacters, {
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

    const listItems = ulElement.findAll('li');
    expect(listItems.length).toBe(characters.length);

    listItems.forEach((item, index) => {
      const character = characters[index];
      expect(item.find('img').attributes('src')).toBe(character.image);
      expect(item.find('.displayName').text()).toBe(character.name);
    });
  });

  it('shows loading message when loading is true', () => {
    const wrapper = mount(ListOfCharacters, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': RouterLinkStub,
          'router-view': true
        },
      },
      data() {
        return {
          characters: [],
          loading: true,
          error: null
        };
      }
    });

    expect(wrapper.find('.loading').isVisible()).toBe(true);
  });

  it('shows error message when there is an error', () => {
    const errorMessage = 'Failed to load characters';
    const wrapper = mount(ListOfCharacters, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': RouterLinkStub,
          'router-view': true
        },
      },
      data() {
        return {
          characters: [],
          loading: false,
          error: errorMessage
        };
      }
    });

    expect(wrapper.find('.error').text()).toBe(errorMessage);
  });
});
