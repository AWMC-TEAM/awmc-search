// ============================================================
// 应用配置
// ============================================================

// 水鱼查分器乐曲数据 API
// 官方接口（默认）：https://www.diving-fish.com/api/maimaidxprober/music_data
// 如果遇到跨域问题，开发环境下 vue.config.js 已配置代理 /diving-fish/* -> 水鱼
// 生产环境如有跨域，请部署到允许跨域的域名或自建反向代理。
export const MUSIC_DATA_URL =
  process.env.NODE_ENV === 'development'
    ? '/diving-fish/api/maimaidxprober/music_data'
    : 'https://www.diving-fish.com/api/maimaidxprober/music_data';

// 缓存时间（毫秒）。默认 24 小时刷新一次乐曲数据
export const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

// localStorage 中乐曲数据的缓存 key
export const MUSIC_CACHE_KEY = 'maiSearch:musicData';
export const MUSIC_CACHE_TS_KEY = 'maiSearch:musicData:ts';

// ============================================================
// 乐曲别名 API（柚子社 yuzuchan）
// ============================================================
//   直连:  https://www.yuzuchan.moe/api/maimaidx
//   代理:  https://proxy.yuzuchan.site/maimaidxaliases
// 端点:    GET /maimaidxalias
// 返回:    { code: 0, content: [{ SongID, Name, Alias: [string, ...] }, ...] }
// 开发环境通过 vue.config.js 的 /yuzu-alias 代理转发，规避 CORS。
export const ALIAS_DATA_URL =
  process.env.NODE_ENV === 'development'
    ? '/yuzu-alias/api/maimaidx/maimaidxalias'
    : 'https://www.yuzuchan.moe/api/maimaidx/maimaidxalias';

// 别名缓存 key（与乐曲数据同 TTL）
export const ALIAS_CACHE_KEY = 'maiSearch:aliasMap';
export const ALIAS_CACHE_TS_KEY = 'maiSearch:aliasMap:ts';

// ============================================================
// 封面 API 配置
// ============================================================
// 封面 API URL 模板。支持的占位符：
//   {id}     → 歌曲原始 id（例如 "100"、"10021"、"834"）
//   {id5}    → 歌曲 id 左侧补 0 至 5 位（例如 "00100"、"10021"、"00834"）
//   {title}  → 歌曲标题（已 encodeURIComponent）
//
// 当前接入：assets.awmc.team 封面 API（按原始 id 取，未收录的会自动用兜底图）
export const COVER_URL_TEMPLATE = 'https://assets.awmc.team/covers/{id}.png';

// 封面加载失败时使用的兜底图（本地）
export const COVER_FALLBACK_URL = './static/img/akalin.png';
