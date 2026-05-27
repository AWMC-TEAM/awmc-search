# MaiSearch

简易的 MaiMai 歌曲检索 SPA 页面。

> **源代码出处**：https://github.com/KmjKoishi/maiSearch （原作者 [KmjKoishi](https://github.com/KmjKoishi)）
> 本仓库基于原 dist 的 source map 还原源码，并增加了以下功能：
> - 自动同步水鱼查分器乐曲数据（运行时 API，非本地写死）
> - 自动同步柚子社乐曲别名 API
> - 谱面确认（awmc.team 谱面预览页，替代原 B 站手元搜索）
> - 歌手 / 分类 / 版本多维筛选
> - 深色模式 + 移动端适配修复

## 功能特性

- **自动同步水鱼查分器乐曲数据**：启动时拉取 [diving-fish music_data](https://www.diving-fish.com/api/maimaidxprober/music_data)，24 小时内复用 `localStorage` 缓存
- **自动同步柚子社乐曲别名**：启动时拉取 [yuzuchan maimaidxalias](https://www.yuzuchan.moe/api/maimaidx/maimaidxalias)，按 SongID 关联到每首歌
- **可配置封面 API**：默认接入 `https://assets.awmc.team/covers/{id}.png`，加载失败自动回落本地占位图
- **谱面确认**：列表中"谱面确认"下拉打开对应难度的 [v.awmc.team](https://v.awmc.team/) 预览页（替代原 B 站手元搜索）
- **多维筛选**：ID / 名称 / 别名（任一别名包含子串）/ 类型（DX/SD）/ 等级 / 定数 / 歌手 / 分类 / 版本
- **深色模式**：默认跟随系统 `prefers-color-scheme`（实时响应系统主题切换），手动点击按钮后锁定为手动选择并记忆到 `localStorage`，再次点击可切换并继续记忆
- **手动"同步"按钮**：一键清空所有缓存并重新拉取乐曲与别名
- **移动端适配**：自动识别移动端/PC 端，移动端以卡片列表+底部抽屉方式展示，深色模式下修复了固定顶栏/底栏的白底问题

## 移动端说明

应用通过 UA 自动判断是否为移动端访问。移动端布局与 PC 端功能完全一致：

| 功能 | PC 端 | 移动端 |
|---|---|---|
| 搜索表单 | 顶部横向展开 | 折叠面板（点击展开） |
| 列表样式 | el-table 表格 | 卡片列表（封面 + 信息） |
| 详情查看 | el-dialog 弹窗 | el-drawer 底部抽屉 |
| 谱面确认 | 操作列下拉 | 卡片头部下拉 |
| 容错计算 | 未接入（表格版） | 卡片内"计算"按钮 |
| 分页器 | el-pagination | 上一页/下一页按钮 |

## 数据来源

| 数据 | 接口 | 缓存 key |
|---|---|---|
| 乐曲 | `https://www.diving-fish.com/api/maimaidxprober/music_data` | `maiSearch:musicData` |
| 别名 | `https://www.yuzuchan.moe/api/maimaidx/maimaidxalias` | `maiSearch:aliasMap` |
| 封面 | `https://assets.awmc.team/covers/{id}.png` | 无（按需请求） |
| 谱面预览 | `https://v.awmc.team/?song={id}&kind={dx\|standard}&diff={2..6}` | 跳转外链 |

## 谱面确认 URL 规则

```
https://v.awmc.team/?song={ID}&kind={KIND}&diff={DIFF}
```

| 参数 | 含义 |
|---|---|
| `song` | 乐曲 ID（直接使用水鱼 `id`） |
| `kind` | 谱面类型：`standard` 标准谱、`dx` DX 谱（来自水鱼 `type`） |
| `diff` | 难度：`2` Basic、`3` Advanced、`4` Expert、`5` Master、`6` Re:Master |

不存在的难度（`level` 为空）不会出现在下拉中；Re:Master 仅当该曲存在第 5 个难度时才会显示。

## 配置

主要配置都集中在 `src/config/index.js`：

```js
// 乐曲数据接口（开发环境通过 /diving-fish 代理）
export const MUSIC_DATA_URL = ...;

// 别名接口（开发环境通过 /yuzu-alias 代理）
export const ALIAS_DATA_URL = ...;

// 缓存有效期（默认 24 小时）
export const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

// 封面 API 模板，支持占位符:
//   {id}    → 歌曲原始 id
//   {id5}   → 歌曲 id 左侧补 0 至 5 位
//   {title} → 歌曲标题（已 URL 编码）
export const COVER_URL_TEMPLATE = 'https://assets.awmc.team/covers/{id}.png';

// 加载失败时使用的本地兜底图
export const COVER_FALLBACK_URL = './static/img/akalin.png';
```

要换成自己的封面源时，只需要改 `COVER_URL_TEMPLATE` 这一行，重新 `npm run build`。

## 别名 API 详细说明（柚子社 yuzuchan）

| 环境 | 地址 |
|---|---|
| 直连 | `https://www.yuzuchan.moe/api/maimaidx` |
| 代理 | `https://proxy.yuzuchan.site/maimaidxaliases` |
| WebSocket | `wss://{host}/ws/{UUID}` |

### 端点

| 方法 | 端点 | 说明 |
|---|---|---|
| GET | `/maimaidxalias` | 获取所有别名列表（本项目使用此接口） |
| GET | `/getsongs?name={name}` | 通过别名查询曲目 |
| GET | `/getsongsalias?song_id={id}` | 通过曲目 ID 查询别名 |
| GET | `/getaliasstatus` | 获取当前别名投票状态 |
| POST | `/applyalias` | 提交别名申请 |
| POST | `/agreeuser` | 同意别名投票 |

`/maimaidxalias` 返回结构：

```jsonc
{
  "code": 0,
  "content": [
    { "IsVotable": true, "SongID": 8, "Name": "True Love Song", "Alias": ["真爱歌", "糖糖", ...] },
    ...
  ]
}
```

本项目在 `src/services/musicService.js#fetchAliasMapRemote` 中将其归一化为：

```js
{ "8": ["真爱歌", "糖糖", ...], "9": [...], ... }
```

然后按 `String(song.id)` 关联到每首乐曲，存到 `song.musicNickName`。

## 开发与构建

```bash
npm install
npm run serve   # http://localhost:8080，已配置代理规避 CORS
npm run build   # 输出到 dist/
```

> Node.js >= 17 时 vue-cli 4 会因 OpenSSL 报错，本项目脚本已通过 `cross-env NODE_OPTIONS=--openssl-legacy-provider` 处理。

## 跨域提示

- 开发：`vue.config.js` 已为 `/diving-fish` 与 `/yuzu-alias` 配置代理。
- 生产：水鱼与柚子社接口都允许跨域访问，直接部署到任意静态托管即可。如遇限制，可自建反向代理后改 `MUSIC_DATA_URL` / `ALIAS_DATA_URL`。

## 目录结构

```
src/
  api/axios.js           # 通用 axios 封装（旧版彩贝壳功能保留接口，已禁用调用）
  components/
    maiSearch.vue        # 主组件（PC + 移动端 UI、筛选、详情、容错计算、深色模式）
  config/
    index.js             # 数据/别名/封面/缓存等配置
    remConfig.js         # 移动端 rem 适配
  services/
    musicService.js      # 乐曲数据、别名、封面 URL、缓存读写
  App.vue                # 全局样式 + 深色模式样式
  main.js
public/
  index.html
  favicon.ico
  css/reset.css
  static/img/akalin.png  # 占位图
```

## 致谢

- 音乐数据：[舞萌查分器 Web 版](https://www.diving-fish.com/maimaidx/prober)
- 乐曲别名：[柚子社 yuzuchan 别名服务器](https://www.yuzuchan.moe/)
- 封面源：默认接入 `assets.awmc.team`

如果项目内所使用的资源、引用侵犯了他人的权益，请联系删除。
