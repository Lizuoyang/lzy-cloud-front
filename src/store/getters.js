const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  account: state => state.user.name,
  nickname: state => state.user.nickname,
  user: state => state.user,
  roles: state => state.user.roles,
  resourceKeys: state => state.user.resourceKeyList,
  permission_routes: state => state.permission.routes,
  visitedViews: state => state.tagsView.visitedViews,
}
export default getters
