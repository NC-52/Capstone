// States
const state = {
  logos: [],
  logo: {}
};

// Getters
const getters = {
  logos: state => {
    return state.logos;
  },

  logo: state => {
    return state.logo;
  }
};

// Actions
const actions = {};

// Mutations
const mutations = {
  setLogosState(state, { logos }) {
    // Update logos state
    state.logos = logos;
  },

  setLogoState(state, { logo }) {
    // Update logo state
    state.logo = logo;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
