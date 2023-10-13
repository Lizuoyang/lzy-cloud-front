// 遍历文件夹内子目录，并且引入所有子目录的名字
export function getIconList(){
  const req = require.context('../icons/svg', false, /\.svg$/)
  const requireAll = requireContext => requireContext.keys()
  const re = /\.\/(.*)\.svg/
  const icons = requireAll(req).map(i => {
    return i.match(re)[1]
  })
  return icons
}
