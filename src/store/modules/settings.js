import defaultSettings from '@/settings'
import variables from '@/styles/element-variables.scss'

const { showSettings, sidebarLogo, tagsView, lang, title} = defaultSettings

const state = {
  theme: variables.theme,
  showSettings: showSettings,
  sidebarLogo: sidebarLogo,
  tagsView: tagsView,
  lang: lang,
  title: title
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

