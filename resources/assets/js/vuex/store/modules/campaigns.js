import api from '../../../api/campaigns'
import * as types from '../mutation-types'

// initial state of our campaings
// define here all the object we need
const state = {
  current: [],
  all: [],
  query: [],
  total: '',
  page: 1,
  count: 50,
  start_date: {},
  end_date: {}
}

// getters
// we can set here getters for computation rate
const getters = {
  campaignlist: state => state.all,
  currentCampaign: state => state.current,
  getQuery: state => state.query,
  getTotal: state => state.total,
  getPage: state => state.page,
  getCount: state => state.count,
  getStartDate: state => moment(state.start_date).format('YYYY-MM-DD'),
  getEndDate: state => moment(state.end_date).format('YYYY-MM-DD')
}

// actions
// we can do here our campaigns api call
const actions = {
  async getCampaigns({commit},query) {
    let payload = (await api.index(query)).data
    commit('setList', await payload.data)
    commit('setTotal', await payload.total)
    commit('setCount', await query.count)
  },
    async setCurrentCampaign({commit},id) {
    let payload = (await api.show(id)).data
    commit('setCurrentCampaign', await payload)
    let created = moment(payload.created).format('YYYY-MM-DD')
    commit('setStartDate', await created)
    let now = moment().format('YYYY-MM-DD')
    commit('setEndDate', await now)
  }


}

// mutations
const mutations = {
    setList: (state, payload ) => {  state.all = payload},
    setQuery: (state, payload) => { state.query = payload },
    setTotal: (state, payload) => { state.total = payload },
    setCount: (state, payload) => { state.count = payload },
    setCurrentCampaign: (state, payload) => { state.current = payload },
    setStartDate: (state, payload) => { state.start_date = { time:payload } } ,
    setEndDate: (state, payload) => { state.end_date = { time:payload } },
    
    // Added vue pagination mutation
    ['pagination/PAGINATE'](state, payload) {
              state.page = payload

    }
    
}

export default {
  state,
  getters,
  actions,
  mutations
}