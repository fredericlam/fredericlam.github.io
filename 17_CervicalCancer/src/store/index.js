import { createStore, createLogger } from 'vuex'

// https://github.com/vuejs/vuex/tree/4.0/examples/composition

const debug = process.env.NODE_ENV !== 'production'

const state = () => ({
})

// getters
const getters = {}

// actions
const actions = {}

// mutations
const mutations = {
}

const store = createStore({
	state,
  	getters,
  	actions,
  	mutations,
  	plugins: debug ? [createLogger()] : []
})

export default store 