// Labels describe the effect path, not the package.json dependency list.
const catalog = {
  'waapi': ['Web Animations API', 'Element.animate() 驱动关键帧与播放。'],
  'css-transition': ['CSS 过渡', 'transition 在选定状态之间插值。'],
  'css-keyframes': ['CSS 关键帧', '@keyframes / animation 驱动当前效果。'],
  'css-state': ['CSS 状态样式', '伪类或状态选择器直接显示反馈。'],
  'react-state': ['React 状态更新', '状态变化直接更新文字或元素样式。'],
  'react': ['React', '维护当前交互状态并渲染界面。'],
  'raf': ['requestAnimationFrame', '逐帧根据时间或目标值更新当前画面。'],
  'raf-schedule': ['requestAnimationFrame', '等待下一帧安排更新、测量或挂载，不作为动画插值器。'],
  'timers': ['JavaScript 计时器', 'setTimeout / setInterval 安排触发、等待或状态衔接。'],
  'pointer-events': ['Pointer Events', '接收鼠标、触屏或笔的指针输入。'],
  'keyboard-events': ['键盘事件', '处理方向键、确认、取消等键盘操作。'],
  'mouse-events': ['鼠标事件', '由鼠标进入、离开等事件调度当前效果。'],
  'clipboard-api': ['Clipboard API', '当前复制操作调用 navigator.clipboard.writeText。'],
  'css-radial-gradient': ['CSS 径向渐变', 'radial-gradient 绘制随当前输入更新的光照背景。'],
  'pointer-focus-events': ['指针与焦点事件', '由指针进入或键盘焦点触发当前反馈。'],
  'scroll-events': ['滚动事件', '读取滚动位置并更新当前进度。'],
  'resize-observer': ['ResizeObserver', '测量内容尺寸、边界或可移动范围。'],
  'intersection-observer': ['IntersectionObserver', '按元素进入或离开可见区域触发。'],
  'image-load': ['图片加载事件', '图片载入后启动或显示对应内容。'],
  'image-decode': ['图片解码', '图片解码就绪后再衔接显示。'],
  'html-dialog': ['HTML dialog', '原生模态层负责顶层显示与焦点约束。'],
  'page-events': ['页面可见性与焦点事件', '监听 visibilitychange、focus、blur。'],
  'css-gradient-mask': ['CSS 渐变蒙版', '使用 CSS mask 的渐变区域揭示内容。'],
  'svg-brush-css-mask': ['SVG 笔刷蒙版', 'SVG 笔刷图片作为 CSS mask 使用。'],
  'svg-filter-mask': ['SVG 滤镜与蒙版', 'SVG filter / mask 参与当前内容显现。'],
  'css-clip-path': ['CSS clip-path', '通过裁剪几何形状揭示或遮挡内容。'],
  'css-overflow-clip': ['CSS overflow 裁剪', '文字在 overflow:hidden 的窗口中进入。'],
  'svg': ['SVG', 'SVG 几何图形构成当前效果的画面。'],
  'manual-path-interpolation': ['自写路径插值', '在预先对应的轮廓坐标之间插值。'],
  'flubber': ['Flubber', '在 SVG 路径之间计算形状插值。'],
  'flip': ['FLIP 布局算法', '测量前后几何位置，反向位移后播放归位；不是独立动画库。'],
  'geometry-tween': ['共享元素几何补间', '测量原位置与目标位置，插值共享元素的位置、尺寸和圆角。'],
  'dom-style': ['DOM 样式更新', '把进度或输入直接映射为元素样式。'],
  'css-scroll-snap': ['CSS Scroll Snap', '原生滚动吸附到内容边界。'],
  'css-sticky': ['CSS sticky', '在滚动区间内保持内容位置。'],
  'three': ['Three.js', '建立三维几何、相机和灯光。'],
  'svg-renderer': ['SVGRenderer', '把 Three.js 场景投影为 SVG。'],
  'three-frames': ['Three.js · 帧生成', '首次生成图片序列时建立三维场景；播放时不逐帧重建模型。'],
  'svg-renderer-frames': ['SVGRenderer · 帧生成', '将三维场景的各个状态绘制成 SVG 帧。'],
  'canvas-frames': ['Canvas 2D · 帧生成', '将画面绘入 Canvas 并编码为 WebP 图片帧。'],
  'webp-sequence': ['图片序列 / 帧切换', '播放时按进度选择预先生成的图片帧，不等同于实时三维渲染。'],
  'd3-geo': ['D3 Geo', '计算当前地图的地理投影与 SVG 路径。'],
  'topojson': ['TopoJSON', '把地图拓扑数据转换为地理要素。'],
};

export function presentTechnology(profile) {
  const groups = [['drivers', 'effect'], ['renderers', 'graphics'], ['support', 'support'], ['secondaryDrivers', 'secondary']];
  const seen = new Set();
  const result = [];
  for (const [field, group] of groups) {
    for (const id of profile[field] || []) {
      if (seen.has(id) || id === 'raf-schedule' && seen.has('raf')) continue;
      const item = catalog[id];
      if (!item) throw new Error(`Unreviewed technology key: ${id}`);
      seen.add(id);
      result.push({id, name:item[0], detail:item[1], group:['react','react-state'].includes(id)?'support':group});
    }
  }
  if (!seen.has('react') && !seen.has('react-state')) result.push({id:'react', name:catalog.react[0], detail:catalog.react[1], group:'support'});
  return result;
}

export const technologyGroups = [['effect','效果实现'],['graphics','图形处理'],['support','交互与调度'],['secondary','辅助反馈']];
