import store from '@/store'

const hasBtnPermission = {
  install (Vue, options) {
    Vue.directive('has', {
      inserted: (el, binding, vnode)=>{
        filterGlobalPermission(el, binding, vnode);
      }
    });
  }
};
/**
 * 全局按钮权限控制
 */
export const filterGlobalPermission = (el, binding, vnode) => {
  let btnPermissionList = store.state.user.resourceKeyList;
  if (!btnPermissionList.includes(binding.value)) {
    el.parentNode.removeChild(el);
  }
}
export default hasBtnPermission;
