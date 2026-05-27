<template>
  <div id="app">
    <MaiSearch />
  </div>
</template>

<script>
import MaiSearch from "./components/maiSearch.vue";

export default {
  name: "App",
  components: {
    MaiSearch,
  },
};
</script>

<style>
#app .ft {
  font-weight: 700;
  letter-spacing: 4px;
}

#app .tap {
  color: #eb4f82;
}

#app .hold {
  color: #eb4f82;
}

#app .slide {
  color: #48bcd8;
}

#app .touch {
  color: #48bcd8;
}

#app .zc {
  background: -webkit-linear-gradient(
    left,
    red,
    orange,
    yellow,
    lime,
    deepskyblue,
    blue,
    purple
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.maiColorBasic {
  color: green;
}

.maiColorAdvanced {
  color: rgb(254, 203, 48);
}

.maiColorExpert {
  color: red;
}

.maiColorMaster {
  color: purple;
}

.maiColorReMaster {
  color: rgb(221, 152, 249);
}

.el-dropdown-menu__item.maiColorExpert {
  color: red;
}

.el-dropdown-menu__item.maiColorMaster {
  color: purple;
}

.el-dropdown-menu__item.maiColorReMaster {
  color: rgb(221, 152, 249);
}

.maiP {
  color: darkorange;
}

.maiG {
  color: #eb4f82;
}

.maiG2 {
  color: green;
}

.maiCP {
  color: #F25656;
}

.to {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ============================================================
   深色模式
   通过 <html class="dark"> 切换，覆盖 element-ui 主要组件
   ============================================================ */
html.dark,
html.dark body {
  background: #181a1f;
  color: #d6d6d6;
}

html.dark #app {
  background: #181a1f;
  color: #d6d6d6;
}

/* 文本与标签 */
html.dark .el-form-item__label,
html.dark .el-collapse-item__header,
html.dark .el-pagination__total,
html.dark .el-pagination__jump,
html.dark .el-pagination button,
html.dark .el-pagination .el-pager li,
html.dark .el-dialog__title,
html.dark .el-drawer__header,
html.dark .el-collapse-item__content {
  color: #d6d6d6 !important;
}

/* 表格 */
html.dark .el-table,
html.dark .el-table__body,
html.dark .el-table tr,
html.dark .el-table th.el-table__cell,
html.dark .el-table td.el-table__cell,
html.dark .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
  background: #1f2128 !important;
  color: #d6d6d6 !important;
  border-color: #2c2f38 !important;
}
html.dark .el-table--border::after,
html.dark .el-table--group::after,
html.dark .el-table::before {
  background-color: #2c2f38 !important;
}
html.dark .el-table--border .el-table__cell,
html.dark .el-table--border th.el-table__cell {
  border-right-color: #2c2f38 !important;
}
html.dark .el-table thead th.el-table__cell {
  background: #232631 !important;
  color: #c8c8c8 !important;
}
html.dark .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
  background: #2a2d36 !important;
}

/* 输入框 / 下拉 */
html.dark .el-input__inner,
html.dark .el-textarea__inner {
  background: #2a2d36 !important;
  border-color: #3a3e4a !important;
  color: #e0e0e0 !important;
}
html.dark .el-input__inner::placeholder {
  color: #888 !important;
}
html.dark .el-input-number__decrease,
html.dark .el-input-number__increase {
  background: #2a2d36 !important;
  color: #d6d6d6 !important;
  border-color: #3a3e4a !important;
}
html.dark .el-select-dropdown,
html.dark .el-picker-panel,
html.dark .el-popper {
  background: #2a2d36 !important;
  border-color: #3a3e4a !important;
  color: #d6d6d6 !important;
}
html.dark .el-select-dropdown__item {
  color: #d6d6d6 !important;
}
html.dark .el-select-dropdown__item.hover,
html.dark .el-select-dropdown__item:hover {
  background: #353945 !important;
}
html.dark .el-popper[x-placement^="top"] .popper__arrow,
html.dark .el-popper[x-placement^="bottom"] .popper__arrow,
html.dark .el-popper[x-placement^="left"] .popper__arrow,
html.dark .el-popper[x-placement^="right"] .popper__arrow {
  border-color: #3a3e4a !important;
}

/* 折叠面板（移动端搜索区） */
html.dark .el-collapse,
html.dark .el-collapse-item__header,
html.dark .el-collapse-item__wrap,
html.dark .el-collapse-item__content {
  background: #1f2128 !important;
  border-color: #2c2f38 !important;
}

/* 卡片（移动端列表） */
html.dark .el-card {
  background: #1f2128 !important;
  border-color: #2c2f38 !important;
  color: #d6d6d6 !important;
}
html.dark .el-card__header {
  border-bottom-color: #2c2f38 !important;
}

/* 弹窗 / 抽屉 */
html.dark .el-dialog,
html.dark .el-drawer,
html.dark .el-message-box {
  background: #1f2128 !important;
  color: #d6d6d6 !important;
}
html.dark .el-dialog__body,
html.dark .el-drawer__body,
html.dark .el-message-box__content {
  color: #d6d6d6 !important;
}
html.dark .el-dialog__header,
html.dark .el-drawer__header,
html.dark .el-message-box__header {
  border-bottom: 1px solid #2c2f38;
}

/* Tabs */
html.dark .el-tabs--border-card,
html.dark .el-tabs--border-card > .el-tabs__header,
html.dark .el-tabs--border-card > .el-tabs__content {
  background: #1f2128 !important;
  border-color: #2c2f38 !important;
  color: #d6d6d6 !important;
}
html.dark .el-tabs--border-card > .el-tabs__header .el-tabs__item {
  color: #b0b0b0 !important;
}
html.dark .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  background: #232631 !important;
  color: #fff !important;
  border-right-color: #2c2f38 !important;
  border-left-color: #2c2f38 !important;
}

/* 按钮：默认 default 反色 */
html.dark .el-button--default {
  background: #2a2d36 !important;
  border-color: #3a3e4a !important;
  color: #e0e0e0 !important;
}
html.dark .el-button--default:hover {
  background: #353945 !important;
  border-color: #4a4e5a !important;
}
html.dark .el-button--text {
  color: #79bbff !important;
}

/* 重置部分文字色（数字定数小箭头等） */
html.dark .el-input-number__decrease:hover,
html.dark .el-input-number__increase:hover {
  color: #79bbff !important;
}

/* 滚动条美化 */
html.dark ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background: #1f2128;
}
html.dark ::-webkit-scrollbar-thumb {
  background: #3a3e4a;
  border-radius: 4px;
}
html.dark ::-webkit-scrollbar-thumb:hover {
  background: #4a4e5a;
}

/* maiP 等谱面颜色在深色下做轻微提亮 */
html.dark .maiColorBasic { color: #4ade80; }
html.dark .maiColorAdvanced { color: #facc15; }
html.dark .maiColorExpert { color: #f87171; }
html.dark .maiColorMaster { color: #c084fc; }
html.dark .maiColorReMaster { color: #f0abfc; }

html.dark .maiP { color: #f59e0b; }
html.dark .maiG { color: #f472b6; }
html.dark .maiG2 { color: #4ade80; }
html.dark .maiCP { color: #ef4444; }

/* tooltip 暗色下不强行修改（element 自身已是深色） */

/* 移动端专属硬编码白底的 override */
html.dark .magickTop,
html.dark .currentPagination {
  background: #181a1f !important;
}
html.dark .mobilePageBox .musicItemCoverBox,
html.dark .pageBox .musicItemCoverBox {
  background: #1f2128 !important;
}
html.dark .el-loading-mask {
  background: rgba(0, 0, 0, 0.7) !important;
}

html.dark .pageBox .el-tabs .el-tabs__content::-webkit-scrollbar {
  background: #1f2128 !important;
}
html.dark .pageBox .el-tabs .el-tabs__content::-webkit-scrollbar-track {
  background: #1f2128 !important;
}

</style>
