import axios from 'axios';
import {
  MUSIC_DATA_URL,
  CACHE_TTL_MS,
  MUSIC_CACHE_KEY,
  MUSIC_CACHE_TS_KEY,
  ALIAS_DATA_URL,
  ALIAS_CACHE_KEY,
  ALIAS_CACHE_TS_KEY,
  COVER_URL_TEMPLATE,
  COVER_FALLBACK_URL,
} from '../config';

export { COVER_FALLBACK_URL };

/**
 * 把水鱼 id 映射回真实 song id。
 * 水鱼对 DX 谱面会在原 song id 上加 10000 偏移（例如真实 id 1221 → 水鱼 11221），
 * 而 awmc 谱面预览等外部服务期望的是不带偏移的原始 id。
 */
export function toRawSongId(id) {
  const n = Number(id);
  if (!Number.isFinite(n)) return String(id);
  return String(n > 10000 ? n - 10000 : n);
}

/**
 * 根据封面 URL 模板和歌曲对象生成封面 URL。
 * 支持占位符: {id} {id5} {title}
 */
export function buildCoverUrl(song) {
  if (!COVER_URL_TEMPLATE) return COVER_FALLBACK_URL;
  const id = String(song.id || '');
  const id5 = id.padStart(5, '0');
  const title = encodeURIComponent(song.title || '');
  return COVER_URL_TEMPLATE
    .replace(/\{id5\}/g, id5)
    .replace(/\{id\}/g, id)
    .replace(/\{title\}/g, title);
}

// ------------------------------------------------------------
// 通用 localStorage 缓存读写
// ------------------------------------------------------------
function readCache(dataKey, tsKey) {
  try {
    const ts = Number(localStorage.getItem(tsKey) || 0);
    if (!ts) return null;
    if (Date.now() - ts > CACHE_TTL_MS) return null;
    const raw = localStorage.getItem(dataKey);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function writeCache(dataKey, tsKey, data) {
  try {
    localStorage.setItem(dataKey, JSON.stringify(data));
    localStorage.setItem(tsKey, String(Date.now()));
  } catch (e) {
    console.warn('[maiSearch] 写入缓存失败：', e && e.message);
  }
}

// ------------------------------------------------------------
// 乐曲数据
// ------------------------------------------------------------

/**
 * 强制清空乐曲数据本地缓存。
 */
export function clearMusicCache() {
  try {
    localStorage.removeItem(MUSIC_CACHE_KEY);
    localStorage.removeItem(MUSIC_CACHE_TS_KEY);
  } catch (e) {
    /* noop */
  }
}

/**
 * 强制清空别名本地缓存。
 */
export function clearAliasCache() {
  try {
    localStorage.removeItem(ALIAS_CACHE_KEY);
    localStorage.removeItem(ALIAS_CACHE_TS_KEY);
  } catch (e) {
    /* noop */
  }
}

/**
 * 一并清空所有本地缓存。
 */
export function clearAllCache() {
  clearMusicCache();
  clearAliasCache();
}

/**
 * 拉取最新的乐曲数据（绕过缓存）。
 */
export async function fetchMusicDataRemote() {
  const resp = await axios.get(MUSIC_DATA_URL, {
    timeout: 30000,
    withCredentials: false,
  });
  if (!resp || !Array.isArray(resp.data)) {
    throw new Error('水鱼查分器返回的数据格式不正确');
  }
  return resp.data;
}

/**
 * 加载乐曲数据：优先使用 24h 内的本地缓存，否则从水鱼查分器拉取。
 */
export async function loadMusicData(options = {}) {
  if (!options.forceRefresh) {
    const cached = readCache(MUSIC_CACHE_KEY, MUSIC_CACHE_TS_KEY);
    if (Array.isArray(cached)) return cached;
  }
  const remote = await fetchMusicDataRemote();
  writeCache(MUSIC_CACHE_KEY, MUSIC_CACHE_TS_KEY, remote);
  return remote;
}

// ------------------------------------------------------------
// 乐曲别名（柚子社）
// ------------------------------------------------------------

/**
 * 拉取并归一化柚子社别名数据。
 * 返回格式：{ "<id>": ["别名1", "别名2", ...], ... }
 * 其中 id 为字符串形式的 SongID。
 */
export async function fetchAliasMapRemote() {
  const resp = await axios.get(ALIAS_DATA_URL, {
    timeout: 30000,
    withCredentials: false,
  });
  const body = resp && resp.data;
  if (!body || body.code !== 0 || !Array.isArray(body.content)) {
    throw new Error('柚子社别名 API 返回的数据格式不正确');
  }
  const map = Object.create(null);
  body.content.forEach((row) => {
    if (!row || row.SongID == null) return;
    const id = String(row.SongID);
    const list = Array.isArray(row.Alias)
      ? row.Alias.filter((s) => s && String(s).trim()).map((s) => String(s).trim())
      : [];
    if (!list.length) return;
    // 去重
    map[id] = Array.from(new Set(list));
  });
  return map;
}

/**
 * 加载别名映射：优先 24h 缓存，否则从柚子社拉取。
 * 拉取/解析失败不抛出（返回 {}），别名仅是增强体验，不应阻塞主流程。
 */
export async function loadAliasMap(options = {}) {
  if (!options.forceRefresh) {
    const cached = readCache(ALIAS_CACHE_KEY, ALIAS_CACHE_TS_KEY);
    if (cached && typeof cached === 'object') return cached;
  }
  try {
    const map = await fetchAliasMapRemote();
    writeCache(ALIAS_CACHE_KEY, ALIAS_CACHE_TS_KEY, map);
    return map;
  } catch (e) {
    console.warn('[maiSearch] 加载柚子社别名失败：', e && e.message);
    // 兜底：尝试用过期缓存
    try {
      const raw = localStorage.getItem(ALIAS_CACHE_KEY);
      if (raw) {
        const stale = JSON.parse(raw);
        if (stale && typeof stale === 'object') return stale;
      }
    } catch (_) {
      /* noop */
    }
    return {};
  }
}

/**
 * 给乐曲数据数组中的每一项写入 coverUrl 字段。
 * 必须在 loadMusicData 之后调用。
 */
export function attachCoverUrls(songs) {
  songs.forEach((song) => {
    song.coverUrl = buildCoverUrl(song);
  });
  return songs;
}

export default {
  loadMusicData,
  fetchMusicDataRemote,
  loadAliasMap,
  fetchAliasMapRemote,
  clearMusicCache,
  clearAliasCache,
  clearAllCache,
  buildCoverUrl,
  attachCoverUrls,
  toRawSongId,
};
