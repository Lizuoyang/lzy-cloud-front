import { login, logout, getInfo} from '@/api/login'
import { getToken, setToken, setRefreshToken, getRefreshToken, removeToken } from '@/utils/auth'
import {serialize} from '@/utils/util'
import { resetRouter } from '@/router'
import defaultSettings from '@/settings'

const { userAvator } = defaultSettings


const getDefaultState = () => {
  return {
    token: getToken(),
    refreshToken: getRefreshToken(),
    id: '',
    name: '',
    avatar: '',
    nicename: '',
    roles: [],
    resourceKeyList: [],
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_REFRESH_TOKEN: (state, refreshToken) => {
    state.refreshToken = refreshToken
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_NICKNAME: (state, nickname) => {
    state.nickname = nickname
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_RESOURCEKEYLIST: (state, resourceKeyList) => {
    state.resourceKeyList = resourceKeyList
  },
}

const actions = {
  // user login
  loginByPassword({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(serialize(userInfo)).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.tokenHead + data.token)
        commit('SET_REFRESH_TOKEN', data.tokenHead + data.refreshToken)
        setToken(data.tokenHead + data.token)
        setRefreshToken(data.tokenHead + data.refreshToken)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        console.log("userinfo: ",data)
        const { roleKeyList, account, avatar, nickname, id, resourceKeyList } = data
        // roles must be a non-empty array
        if (roleKeyList && roleKeyList.length > 0) {
          commit('SET_ROLES', roleKeyList)
          // commit('SET_PERMISSIONS', stringResources)
        } else {
          reject('getInfo: roles must be a non-null array !')
        }
        commit('SET_NAME', account)
        commit('SET_RESOURCEKEYLIST', resourceKeyList)
        commit('SET_ID', id)
        commit('SET_NICKNAME', nickname)
        commit('SET_AVATAR', avatar == null ? userAvator : avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(serialize({ RefreshToken: state.refreshToken })).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

