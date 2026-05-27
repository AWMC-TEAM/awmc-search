<template>
  <!-- PC 端页面 -->
  <div class="pageBox" v-if="!isMobileUser">
    <div class="searchBox">
      <el-form ref="form" :model="searchForm" inline label-width="100px">
        <el-form-item label="乐曲ID：">
          <el-input
            size="small"
            v-model="searchForm.id"
            clearable
            @input="searchMusicData"
          ></el-input>
        </el-form-item>
        <el-form-item label="乐曲名称：">
          <el-input
            size="small"
            v-model="searchForm.title"
            clearable
            @input="searchMusicData"
          ></el-input>
        </el-form-item>
        <el-form-item label="乐曲别名：">
          <el-input
            size="small"
            style="width: 200px"
            v-model="searchForm.noobNickName"
            clearable
            @input="searchMusicData"
          ></el-input>
        </el-form-item>
        <el-form-item label="乐曲类型：">
          <el-select
            size="small"
            v-model="searchForm.type"
            clearable
            placeholder="请选择"
            @change="searchMusicData"
          >
            <el-option
              v-for="item in musicTypeArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="乐曲等级：">
          <el-select
            size="small"
            v-model="searchForm.level"
            clearable
            placeholder="请选择"
            @change="searchMusicData"
          >
            <el-option
              v-for="item in musicLevelArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="乐曲定数：">
          <el-input-number
            size="small"
            controls-position="right"
            v-model="searchForm.ds"
            :precision="1"
            :step="0.1"
            :min="0"
            :max="15"
            @change="searchMusicData"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="歌手：">
          <el-input
            size="small"
            v-model="searchForm.artist"
            clearable
            placeholder="模糊匹配"
            @input="searchMusicData"
          ></el-input>
        </el-form-item>
        <el-form-item label="乐曲分类：">
          <el-select
            size="small"
            style="width: 160px"
            v-model="searchForm.genre"
            clearable
            filterable
            placeholder="请选择"
            @change="searchMusicData"
          >
            <el-option
              v-for="item in musicGenreArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属版本：">
          <el-select
            size="small"
            style="width: 220px"
            v-model="searchForm.from"
            clearable
            filterable
            placeholder="请选择"
            @change="searchMusicData"
          >
            <el-option
              v-for="item in musicFromArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-refresh"
            @click="refreshMusicData"
          >同步水鱼数据</el-button>
          <el-button
            size="small"
            :icon="darkMode ? 'el-icon-sunny' : 'el-icon-moon'"
            @click="toggleDarkMode"
          >{{ darkMode ? '浅色模式' : '深色模式' }}</el-button>
          <span
            v-if="dataUpdatedAt"
            style="margin-left: 10px; color: #909399; font-size: 12px"
          >共 {{ tableData.length }} 首 · 别名 {{ aliasCount }} 条 · 更新于 {{ dataUpdatedAt.toLocaleString() }}</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableBox">
      <el-table
        :data="
          tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)
        "
        border
        height="550px"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          :index="
            (index) => {
              return index + 1;
            }
          "
          label="序号"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="id"
          label="乐曲ID"
          width="100"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="乐曲封面" width="150">
          <template slot-scope="scope">
            <el-tooltip
              v-if="scope.row.coverUrl"
              class="item"
              effect="dark"
              content="点击查看大图"
              placement="top"
            >
              <img
                style="
                  width: 50px;
                  height: 50px;
                  border-radius: 5px;
                  overflow: hidden;
                  cursor: pointer;
                "
                :src="scope.row.coverUrl"
                @click="previewImage(scope.row.coverUrl)"
                @error="onCoverError"
              />
            </el-tooltip>
            <div
              style="
                width: 100%;
                height: 50px;
                display: flex;
                justify-content: center;
                align-items: center;
              "
              v-else
            >
              封面走丢啦 T~T
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="乐曲名"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="type"
          label="乐曲类型"
          width="100"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="maiDs"
          label="乐曲定数"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="maiLevel"
          label="乐曲等级"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="basic_info.bpm"
          label="BPM"
          width="75"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="basic_info.genre"
          label="所属分类"
          width="200"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="basic_info.from"
          label="所属版本"
          width="200"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-dropdown style="margin-right: 10px; font-size: 12px">
              <span
                class="el-dropdown-link"
                style="cursor: pointer; color: #409eff"
              >
                谱面确认
              </span>
              <el-dropdown-menu slot="dropdown">
                <template
                  v-for="(maiLevelItem, maiLevelIndex) in scope.row.maiLevelName"
                >
                  <el-dropdown-item
                    v-if="maiLevelItem.level"
                    :key="maiLevelIndex"
                    :class="
                      'ft maiColor' +
                      (maiLevelItem.eName === 'Re:Master'
                        ? 'ReMaster'
                        : maiLevelItem.eName)
                    "
                    @click.native="openChartViewer(scope.row, maiLevelIndex)"
                    >{{ maiLevelItem.term }} ({{ maiLevelItem.level }})</el-dropdown-item
                  >
                </template>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button @click="viewDetail(scope.row)" type="text" size="small"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationBox">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.length"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      :title="dialogTitle ? dialogTitle + ' 详情' : '详情'"
      width="80%"
      :visible.sync="showDialog"
      @closed="
        () => {
          this.tabsActveIndex = '0';
          this.musicItem = null;
        }
      "
    >
      <el-tabs
        v-if="musicItem && musicItem.maiLevelName"
        type="border-card"
        closable
        lazy
        stretch
        v-model="tabsActveIndex"
      >
        <el-tab-pane
          v-for="(item, index) in musicItem.maiLevelName"
          :key="index"
          :name="index + ''"
        >
          <div slot="label">
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.eName + ' ( ' + item.ds + ' ) '"
              placement="top"
            >
              <span>
                <span
                  :class="
                    'ft maiColor' +
                    (item.eName === 'Re:Master' ? 'ReMaster' : item.eName)
                  "
                >
                  {{ item.term }}
                </span>
                {{ "( " + item.level + " ) " }}
              </span>
            </el-tooltip>
          </div>
          <div class="tabPaneBox">
            <div style="margin-bottom: 8px; text-align: right">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-view"
                v-if="item.level"
                @click="openChartViewer(musicItem, index)"
              >打开 {{ item.term }} 谱面确认</el-button>
            </div>
            <el-table
              :data="musicItem.musicItemTableData[index]"
              border
              height="130px"
              style="width: 100%"
            >
              <el-table-column
                prop="tapNumber"
                label="tap数量"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                prop="holdNumber"
                label="hold数量"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                prop="slideNumber"
                label="slide数量"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                prop="touchNumber"
                label="touch数量"
                :show-overflow-tooltip="true"
                v-if="musicItem.type === 'DX'"
              ></el-table-column>
              <el-table-column
                prop="breakNumber"
                label="break数量"
                :show-overflow-tooltip="true"
              ></el-table-column>
            </el-table>
            <div style="margin-top: 10px">
              <el-form ref="form" inline label-width="0px">
                <el-form-item
                  style="margin: 0; width: 100%"
                  v-if="
                    musicItem.musicNickName && musicItem.musicNickName.length
                  "
                >
                  {{
                    musicItem.charts[index].charter === "-"
                      ? "当前铺面谱师不详"
                      : "当前铺面谱师为：" + musicItem.charts[index].charter
                  }}，此歌曲在民间又被称为：{{ Array.isArray(musicItem.musicNickName) ? musicItem.musicNickName.join(' / ') : musicItem.musicNickName }}
                </el-form-item>
                <el-form-item style="margin: 0; width: 100%">
                  {{ dialogTitle }}
                  <span
                    :class="
                      'ft maiColor' +
                      (item.eName === 'Re:Master' ? 'ReMaster' : item.eName)
                    "
                  >
                    {{ "( " + item.term + " ) " }}
                  </span>
                  理论 (101%) 每种类型 NOTE 单个占比(仅供参考)：
                </el-form-item>

                <!-- TAP、TOUCH -->
                <div style="margin: 5px 0; border-bottom: 2px solid #eee">
                  <el-table
                    :data="musicItem.musicItemTableData[index][0].maiTapTable"
                    border
                    height="130px"
                    style="width: 100%"
                  >
                    <el-table-column
                      :label="
                        'Tap/Touch - ' +
                        musicItem.musicItemTableData[index][0].maiTapTable[0].y1
                      "
                      :show-overflow-tooltip="true"
                    >
                      <template slot-scope="scope">
                        <div class="ft" :class="scope.row.y2">
                          {{ scope.row.y3 }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="
                        'Tap/Touch - ' +
                        musicItem.musicItemTableData[index][0].maiTapTable[0].p1
                      "
                      :show-overflow-tooltip="true"
                    >
                      <template slot-scope="scope">
                        <div class="ft" :class="scope.row.p2">
                          {{ scope.row.p3 }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="
                        'Tap/Touch - ' +
                        musicItem.musicItemTableData[index][0].maiTapTable[0].g1
                      "
                      :show-overflow-tooltip="true"
                    >
                      <template slot-scope="scope">
                        <div class="ft" :class="scope.row.g2">
                          {{ scope.row.g3 }}
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>

                <!-- HOLD -->
                <div style="margin: 5px 0; border-bottom: 2px solid #eee">
                  <el-table
                    :data="musicItem.musicItemTableData[index][0].maiHoldTable"
                    border
                    height="130px"
                    style="width: 100%"
                  >
                    <el-table-column
                      :label="
                        'Hold - ' +
                        musicItem.musicItemTableData[index][0].maiHoldTable[0]
                          .y1
                      "
                      :show-overflow-tooltip="true"
                    >
                      <template slot-scope="scope">
                        <div class="ft" :class="scope.row.y2">
                          {{ scope.row.y3 }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="
                        'Hold - ' +
                        musicItem.musicItemTableData[index][0].maiHoldTable[0]
                          .p1
                      "
                      :show-overflow-tooltip="true"
                    >
                      <template slot-scope="scope">
                        <div class="ft" :class="scope.row.p2">
                          {{ scope.row.p3 }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="
                        'Hold - ' +
                        musicItem.musicItemTableData[index][0].maiHoldTable[0]
                          .g1
                      "
                      :show-overflow-tooltip="true"
                    >
                      <template slot-scope="scope">
                        <div class="ft" :class="scope.row.g2">
                          {{ scope.row.g3 }}
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>

                <!-- SLIDE -->
                <div style="margin: 5px 0; border-bottom: 2px solid #eee">
                  <el-table
                    :data="musicItem.musicItemTableData[index][0].maiSlideTable"
                    border
                    height="130px"
                    style="width: 100%"
                  >
                    <el-table-column
                      :label="
                        'Slide - ' +
                        musicItem.musicItemTableData[index][0].maiSlideTable[0]
                          .y1
                      "
                      :show-overflow-tooltip="true"
                    >
                      <template slot-scope="scope">
                        <div class="ft" :class="scope.row.y2">
                          {{ scope.row.y3 }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="
                        'Slide - ' +
                        musicItem.musicItemTableData[index][0].maiSlideTable[0]
                          .p1
                      "
                      :show-overflow-tooltip="true"
                    >
                      <template slot-scope="scope">
                        <div class="ft" :class="scope.row.p2">
                          {{ scope.row.p3 }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="
                        'Slide - ' +
                        musicItem.musicItemTableData[index][0].maiSlideTable[0]
                          .g1
                      "
                      :show-overflow-tooltip="true"
                    >
                      <template slot-scope="scope">
                        <div class="ft" :class="scope.row.g2">
                          {{ scope.row.g3 }}
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>

                <!-- BREAK -->
                <div style="margin-top: 5px">
                  <el-table
                    :data="musicItem.musicItemTableData[index][0].maiBreakTable"
                    border
                    height="130px"
                    style="width: 100%"
                  >
                    <el-table-column
                      label="你绝赞黄了，但没全黄"
                      :show-overflow-tooltip="true"
                    >
                      <el-table-column
                        :label="
                          musicItem.musicItemTableData[index][0]
                            .maiBreakTable[0].y1
                        "
                        :show-overflow-tooltip="true"
                      >
                        <template slot-scope="scope">
                          <div class="ft" :class="scope.row.y2">
                            {{ scope.row.y3 }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column
                        :label="
                          musicItem.musicItemTableData[index][0]
                            .maiBreakTable[0].y4
                        "
                        :show-overflow-tooltip="true"
                      >
                        <template slot-scope="scope">
                          <div class="ft" :class="scope.row.y5">
                            {{ scope.row.y6 }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column
                        :label="
                          musicItem.musicItemTableData[index][0]
                            .maiBreakTable[0].y7
                        "
                        :show-overflow-tooltip="true"
                      >
                        <template slot-scope="scope">
                          <div class="ft" :class="scope.row.y8">
                            {{ scope.row.y9 }}
                          </div>
                        </template>
                      </el-table-column>
                    </el-table-column>
                    <el-table-column
                      label="你绝赞粉了"
                      :show-overflow-tooltip="true"
                    >
                      <el-table-column
                        :label="
                          musicItem.musicItemTableData[index][0]
                            .maiBreakTable[0].p1
                        "
                        :show-overflow-tooltip="true"
                      >
                        <template slot-scope="scope">
                          <div class="ft" :class="scope.row.p2">
                            {{ scope.row.p3 }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column
                        :label="
                          musicItem.musicItemTableData[index][0]
                            .maiBreakTable[0].p4
                        "
                        :show-overflow-tooltip="true"
                      >
                        <template slot-scope="scope">
                          <div class="ft" :class="scope.row.p5">
                            {{ scope.row.p6 }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column
                        :label="
                          musicItem.musicItemTableData[index][0]
                            .maiBreakTable[0].p7
                        "
                        :show-overflow-tooltip="true"
                      >
                        <template slot-scope="scope">
                          <div class="ft" :class="scope.row.p8">
                            {{ scope.row.p9 }}
                          </div>
                        </template>
                      </el-table-column>
                    </el-table-column>
                    <el-table-column
                      label="你绝赞绿了"
                      :show-overflow-tooltip="true"
                    >
                      <el-table-column
                        :label="
                          musicItem.musicItemTableData[index][0]
                            .maiBreakTable[0].g1
                        "
                        :show-overflow-tooltip="true"
                      >
                        <template slot-scope="scope">
                          <div class="ft" :class="scope.row.g2">
                            {{ scope.row.g3 }}
                          </div>
                        </template>
                      </el-table-column>
                    </el-table-column>
                  </el-table>
                </div>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="musicItemCoverBox" v-if="musicItem && musicItem.coverUrl">
        <img :src="musicItem.coverUrl" @error="onCoverError" />
      </div>
    </el-dialog>
    <viewer :images="previewCoverUrl" @inited="viewerInited" v-if="viewerShow">
      <img style="display: none" :src="previewCoverUrl" />
    </viewer>
  </div>

  <!-- 移动端页面 -->
  <div class="mobilePageBox" v-else>
    <div class="magickTop">
      <div class="h">
        <el-collapse>
          <el-collapse-item title="点击打开搜索栏" name="1">
            <el-form ref="form" :model="searchForm" label-width="35%">
              <el-form-item label="乐曲ID：">
                <el-input
                  size="small"
                  v-model="searchForm.id"
                  clearable
                  @input="searchMusicData"
                ></el-input>
              </el-form-item>
              <el-form-item label="乐曲名称：">
                <el-input
                  size="small"
                  v-model="searchForm.title"
                  clearable
                  @input="searchMusicData"
                ></el-input>
              </el-form-item>
              <el-form-item label="乐曲别名：">
                <el-input
                  size="small"
                  style="width: 200px"
                  v-model="searchForm.noobNickName"
                  clearable
                  @input="searchMusicData"
                ></el-input>
              </el-form-item>
              <el-form-item label="乐曲类型：">
                <el-select
                  size="small"
                  v-model="searchForm.type"
                  clearable
                  placeholder="请选择"
                  @change="searchMusicData"
                >
                  <el-option
                    v-for="item in musicTypeArray"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="乐曲等级：">
                <el-select
                  size="small"
                  v-model="searchForm.level"
                  clearable
                  placeholder="请选择"
                  @change="searchMusicData"
                >
                  <el-option
                    v-for="item in musicLevelArray"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="乐曲定数：">
                <el-input-number
                  size="small"
                  controls-position="right"
                  v-model="searchForm.ds"
                  :precision="1"
                  :step="0.1"
                  :min="0"
                  :max="15"
                  @change="searchMusicData"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="歌手：">
                <el-input
                  size="small"
                  v-model="searchForm.artist"
                  clearable
                  placeholder="模糊匹配"
                  @input="searchMusicData"
                ></el-input>
              </el-form-item>
              <el-form-item label="乐曲分类：">
                <el-select
                  size="small"
                  v-model="searchForm.genre"
                  clearable
                  filterable
                  placeholder="请选择"
                  @change="searchMusicData"
                >
                  <el-option
                    v-for="item in musicGenreArray"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属版本：">
                <el-select
                  size="small"
                  v-model="searchForm.from"
                  clearable
                  filterable
                  placeholder="请选择"
                  @change="searchMusicData"
                >
                  <el-option
                    v-for="item in musicFromArray"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-refresh"
                  @click="refreshMusicData"
                >同步水鱼数据</el-button>
                <el-button
                  size="small"
                  :icon="darkMode ? 'el-icon-sunny' : 'el-icon-moon'"
                  @click="toggleDarkMode"
                >{{ darkMode ? '浅色模式' : '深色模式' }}</el-button>
                <span
                  v-if="dataUpdatedAt"
                  style="margin-left: 8px; color: #909399; font-size: 11px"
                >共 {{ tableData.length }} 首 · 别名 {{ aliasCount }} 条</span>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div class="cardBox h">
      <el-card
        class="box-card"
        v-for="(pItem, pIndex) in tableData.slice(
          (currentPage - 1) * pagesize,
          currentPage * pagesize
        )"
        :key="pIndex"
      >
        <div slot="header" class="cardBoxHeader">
          <el-tooltip
            class="item"
            effect="dark"
            :content="'[ ' + pItem.type + ' ]' + pItem.title"
            placement="top-start"
          >
            <div style="width: 50%" class="to">
              [&nbsp;<span
                :class="'ft ' + (pItem.type === 'SD' ? 'slide' : 'zc')"
                >{{ pItem.type }}</span
              >]
              {{ "( " + pItem.id + " )" }}
              {{ pItem.title }}
            </div>
          </el-tooltip>
          <div class="r" style="width: 50%">
            <el-dropdown style="margin-right: 10px; font-size: 12px">
              <span
                class="el-dropdown-link"
                style="cursor: pointer; color: #409eff"
              >
                谱面确认
              </span>
              <el-dropdown-menu slot="dropdown">
                <template
                  v-for="(maiLevelItem, maiLevelIndex) in pItem.maiLevelName"
                >
                  <el-dropdown-item
                    v-if="maiLevelItem.level"
                    :key="maiLevelIndex"
                    :class="
                      'ft maiColor' +
                      (maiLevelItem.eName === 'Re:Master'
                        ? 'ReMaster'
                        : maiLevelItem.eName)
                    "
                    @click.native="openChartViewer(pItem, maiLevelIndex)"
                    >{{ maiLevelItem.term }} ({{ maiLevelItem.level }})</el-dropdown-item
                  >
                </template>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              size="small"
              style="padding: 3px 0"
              type="text"
              @click="viewDetail(pItem)"
              >查看详情</el-button
            >
            <el-button
              size="small"
              style="padding: 3px 0"
              type="text"
              @click="showCalcBox(pItem)"
              >计算</el-button
            >
          </div>
        </div>
        <div class="cardContentBox">
          <div
            style="
              width: 30%;
              display: flex;
              justify-content: center;
              align-items: center;
            "
          >
            <img
              :src="pItem.coverUrl"
              @click="previewImage(pItem.coverUrl)"
              @error="onCoverError"
            />
          </div>
          <div class="cardMusicInfo" style="width: 65%">
            <p>定数：{{ pItem.maiDs }}</p>
            <p>等级：{{ pItem.maiLevel }}</p>
            <p>BPM：{{ pItem.basic_info.bpm }}</p>
            <p>分类：{{ pItem.basic_info.genre }}</p>
            <p>版本：{{ pItem.basic_info.from }}</p>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 移动端分页器 -->
    <div class="h currentPagination">
      <el-button
        size="small"
        :disabled="currentPage === 1"
        icon="el-icon-arrow-left"
        type="text"
        @click="currentPage--"
        >上一页</el-button
      >
      <div style="user-select: none">
        第&nbsp;{{ currentPage }}&nbsp;/&nbsp;{{
          Math.max(1, Math.ceil(tableData.length / 10))
        }}&nbsp;页
      </div>
      <el-button
        size="small"
        :disabled="currentPage >= Math.ceil(tableData.length / 10)"
        type="text"
        @click="currentPage++"
      >
        下一页
        <i class="el-icon-arrow-right"></i>
      </el-button>
    </div>

    <!-- 移动端查看详情 -->
    <el-drawer
      :title="dialogTitle ? dialogTitle + ' 详情' : '详情'"
      size="45%"
      :visible.sync="showDrawer"
      direction="btt"
      @closed="
        () => {
          this.tabsActveIndex = '0';
          this.musicItem = null;
        }
      "
      v-if="musicItem"
    >
      <div class="h">
        <div class="musicItemCoverBox" v-if="musicItem && musicItem.coverUrl">
          <img :src="musicItem.coverUrl" @error="onCoverError" />
        </div>
        <el-tabs
          type="border-card"
          closable
          lazy
          stretch
          v-model="tabsActveIndex"
        >
          <el-tab-pane
            v-for="(item, index) in musicItem.maiLevelName"
            :key="index"
            :name="index + ''"
          >
            <div slot="label">
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.eName + ' ( ' + item.ds + ' ) '"
                placement="top"
              >
                <span>
                  <span
                    :class="
                      'ft maiColor' +
                      (item.eName === 'Re:Master' ? 'ReMaster' : item.eName)
                    "
                  >
                    {{ item.term }}
                  </span>
                  {{ "( " + item.level + " ) " }}
                </span>
              </el-tooltip>
            </div>
            <div class="tabPaneBox">
              <div style="margin-bottom: 8px; text-align: right">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-view"
                  v-if="item.level"
                  @click="openChartViewer(musicItem, index)"
                >打开 {{ item.term }} 谱面确认</el-button>
              </div>
              <el-table
                :data="musicItem.musicItemTableData[index]"
                border
                height="130px"
                style="width: 100%"
              >
                <el-table-column
                  prop="tapNumber"
                  label="tap数量"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  prop="holdNumber"
                  label="hold数量"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  prop="slideNumber"
                  label="slide数量"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  prop="touchNumber"
                  label="touch数量"
                  :show-overflow-tooltip="true"
                  v-if="musicItem.type === 'DX'"
                ></el-table-column>
                <el-table-column
                  prop="breakNumber"
                  label="break数量"
                  :show-overflow-tooltip="true"
                ></el-table-column>
              </el-table>
              <div style="margin-top: 10px">
                <el-form ref="form" inline label-width="0px">
                  <el-form-item
                    style="margin: 0; width: 100%"
                    v-if="
                      musicItem.musicNickName && musicItem.musicNickName.length
                    "
                  >
                    {{
                      musicItem.charts[index].charter === "-"
                        ? "当前铺面谱师不详"
                        : "当前铺面谱师为：" + musicItem.charts[index].charter
                    }}，此歌曲在民间又被称为：{{ Array.isArray(musicItem.musicNickName) ? musicItem.musicNickName.join(' / ') : musicItem.musicNickName }}
                  </el-form-item>
                  <el-form-item style="margin: 0; width: 100%">
                    {{ dialogTitle }}
                    <span
                      :class="
                        'ft maiColor' +
                        (item.eName === 'Re:Master' ? 'ReMaster' : item.eName)
                      "
                    >
                      {{ "( " + item.term + " ) " }}
                    </span>
                    理论 (101%) 每种类型 NOTE 单个占比(仅供参考)：
                  </el-form-item>

                  <!-- TAP、TOUCH -->
                  <el-form-item style="margin-bottom: 10px; width: 100%">
                    <p>Tap/Touch音符：</p>
                    <p class="ft maiP">
                      Perfect：{{
                        musicItem.musicItemTableData[index][0].maiTapTable[0].y3
                      }}
                    </p>
                    <p class="ft maiG">
                      Great：{{
                        musicItem.musicItemTableData[index][0].maiTapTable[0].p3
                      }}
                    </p>
                    <p class="ft maiG2">
                      Good：{{
                        musicItem.musicItemTableData[index][0].maiTapTable[0].g3
                      }}
                    </p>
                  </el-form-item>

                  <!-- HOLD -->
                  <el-form-item style="margin-bottom: 10px; width: 100%">
                    <p>Hold音符：</p>
                    <p class="ft maiP">
                      Perfect：{{
                        musicItem.musicItemTableData[index][0].maiHoldTable[0]
                          .y3
                      }}
                    </p>
                    <p class="ft maiG">
                      Great：{{
                        musicItem.musicItemTableData[index][0].maiHoldTable[0]
                          .p3
                      }}
                    </p>
                    <p class="ft maiG2">
                      Good：{{
                        musicItem.musicItemTableData[index][0].maiHoldTable[0]
                          .g3
                      }}
                    </p>
                  </el-form-item>

                  <!-- SLIDE -->
                  <el-form-item style="margin-bottom: 10px; width: 100%">
                    <p>Slide音符：</p>
                    <p class="ft maiP">
                      Perfect：{{
                        musicItem.musicItemTableData[index][0].maiSlideTable[0]
                          .y3
                      }}
                    </p>
                    <p class="ft maiG">
                      Great：{{
                        musicItem.musicItemTableData[index][0].maiSlideTable[0]
                          .p3
                      }}
                    </p>
                    <p class="ft maiG2">
                      Good：{{
                        musicItem.musicItemTableData[index][0].maiSlideTable[0]
                          .g3
                      }}
                    </p>
                  </el-form-item>

                  <!-- BREAK -->
                  <el-form-item style="margin-bottom: 10px; width: 100%">
                    <p>Break：</p>
                    <p class="ft maiCP">
                      大P(理论)：{{
                        musicItem.musicItemTableData[index][0].maiBreakTable[0]
                          .y3
                      }}
                    </p>
                    <p class="ft maiP">
                      小P(50落)：{{
                        musicItem.musicItemTableData[index][0].maiBreakTable[0]
                          .y6
                      }}
                    </p>
                    <p class="ft maiP">
                      小P(100落)：{{
                        musicItem.musicItemTableData[index][0].maiBreakTable[0]
                          .y9
                      }}
                    </p>
                    <p class="ft maiG">
                      大粉：{{
                        musicItem.musicItemTableData[index][0].maiBreakTable[0]
                          .p3
                      }}
                    </p>
                    <p class="ft maiG">
                      小粉(50落)：{{
                        musicItem.musicItemTableData[index][0].maiBreakTable[0]
                          .p6
                      }}
                    </p>
                    <p class="ft maiG">
                      小粉(100落)：{{
                        musicItem.musicItemTableData[index][0].maiBreakTable[0]
                          .p9
                      }}
                    </p>
                    <p class="ft maiG2">
                      绿了：{{
                        musicItem.musicItemTableData[index][0].maiBreakTable[0]
                          .g3
                      }}
                    </p>
                    <p></p>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>

    <!-- 图片查看 -->
    <viewer :images="previewCoverUrl" @inited="viewerInited" v-if="viewerShow">
      <img style="display: none" :src="previewCoverUrl" />
    </viewer>

    <!-- 移动端容错计算弹出层 -->
    <el-drawer
      :title="dialogTitle ? dialogTitle + ' 容错计算' : '容错计算'"
      size="55%"
      :visible.sync="calcBoxShow"
      direction="btt"
      @closed="
        () => {
          this.calcMusicItem = null;
        }
      "
      v-if="calcMusicItem && calcMusicItem.maiLevelName && calcMusicItem.maiLevelName.length"
    >
      <div class="h">
        <div
          class="musicItemCoverBox"
          v-if="calcMusicItem && calcMusicItem.coverUrl"
        >
          <img :src="calcMusicItem.coverUrl" @error="onCoverError" />
        </div>
        <el-form label-width="80px" :inline="true">
          <el-form-item label="难度">
            <el-select
              size="small"
              style="width: 80px"
              v-model="calcLevel"
              placeholder="请选择"
              @change="
                (res) => {
                  this.changeCalcLevel(calcMusicItem.maiLevelName, res);
                }
              "
            >
              <el-option
                v-for="item in calcMusicItem.maiLevelName"
                :key="item.term"
                :label="item.term"
                :value="item.term"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="完成率">
            <el-input-number
              size="small"
              style="width: 90px"
              v-model="calcAcc"
              :precision="4"
              :step="0.0001"
              :min="80"
              :max="100.5"
              :controls="false"
              @change="
                (res) => {
                  this.changeCalcLevel(
                    calcMusicItem.maiLevelName,
                    this.calcLevel
                  );
                }
              "
            ></el-input-number>
            <span style="margin-left: 5px">%</span>
          </el-form-item>
          <el-form-item style="margin: 0">{{ baseStr }}</el-form-item>
          <el-form-item style="margin: 0">{{ tapStr }}</el-form-item>
          <el-form-item style="margin: 0">{{ holdStr }}</el-form-item>
          <el-form-item style="margin: 0">{{ slideStr }}</el-form-item>
          <el-form-item style="margin: 0">{{ breakStr }}</el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
// 乐曲数据从水鱼查分器拉取，别名从柚子社拉取，封面通过 COVER_URL_TEMPLATE 配置生成
import {
  loadMusicData,
  loadAliasMap,
  clearAllCache,
  buildCoverUrl,
  toRawSongId,
  COVER_FALLBACK_URL,
} from "../services/musicService.js";

import { Message } from "element-ui";

// 模块作用域的乐曲数据 / 别名表（由 mounted 中异步填充）
let musicData = [];
let aliasMap = Object.create(null);

export default {
  data() {
    return {
      isMobileUser: this.isMobile(), // 判断是否是手机访问
      cityName: "", // 当前用户定位
      pagesize: 10, // 翻页器参数，每页条数
      currentPage: 1, // 翻页器参数，当前页数

      showDialog: false, // PC 端详情弹窗开关
      showDrawer: false, // 移动端详情弹窗开关
      tabsActveIndex: "0", // 详情 tabs 分页切换的页数 name
      musicItem: {
        // 查看详情的表格回调项
        maiLevelName: [],
        ds: [],
        musicItemTableData: [],
      },
      calcMusicItem: {
        maiLevelName: [],
      },
      calcLevel: "",
      calcAcc: 100.5,

      dialogTitle: "详情", // 查看详情弹窗的标题

      musicTypeArray: [
        {
          // 乐曲类型选择器数据
          label: "DX乐谱",
          value: "DX",
        },
        {
          label: "标准乐谱",
          value: "SD",
        },
      ],

      musicLevelArray: [], // 乐曲级别选择器数据
      musicGenreArray: [], // 乐曲分类选择器数据
      musicFromArray: [], // 乐曲版本选择器数据

      searchForm: {
        // 其他搜索条件
        id: "", // 乐曲 ID
        title: "", // 乐器名称
        ds: 0, // 乐曲定数
        type: "", // 乐曲类型
        level: "", // 乐曲级别
        noobNickName: "", // 乐曲别名
        artist: "", // 歌手
        genre: "", // 分类
        from: "", // 版本
      },

      viewerShow: false, // 查看歌曲封面弹窗显示开关
      previewCoverUrl: [], // 所查看的封面

      tableData: [], // 乐曲主体数据

      calcBoxShow: false, // 计算盒子弹出开关

      baseStr: "",
      tapStr: "",
      holdStr: "",
      slideStr: "",
      breakStr: "",

      // 上次乐曲数据更新时间（来自水鱼查分器）
      dataUpdatedAt: null,

      // 已加载的别名条数（来自柚子社）
      aliasCount: 0,

      // 深色模式
      darkMode: false,
    };
  },

  mounted() {
    const that = this;
    that.$nextTick(async () => {
      // 读取深色模式偏好
      try {
        const savedDark = localStorage.getItem("maiSearch:darkMode");
        if (savedDark === "1") {
          that.darkMode = true;
        } else if (savedDark === null) {
          that.darkMode =
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches;
        }
      } catch (e) {
        /* noop */
      }
      that.applyDarkMode();

      // 监听页面比例发生变化渲染不同的组件
      window.addEventListener("resize", () => {
        that.isMobileUser = that.isMobile();
      });

      // 拉取乐曲数据（24h 内走本地缓存，否则从水鱼查分器同步）
      // 别名数据并行从柚子社拉取
      await that.fetchAndApplyMusicData();
    });
  },

  methods: {
    // 拉取并应用乐曲数据 + 别名数据
    async fetchAndApplyMusicData(forceRefresh = false) {
      const loading = this.$loading({
        lock: true,
        text: forceRefresh
          ? "正在同步水鱼乐曲数据与柚子社别名..."
          : "正在加载乐曲数据与别名...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      try {
        // 并行拉取，乐曲数据失败会抛错，别名失败已在 service 中兜底为 {}
        const [data, alias] = await Promise.all([
          loadMusicData({ forceRefresh }),
          loadAliasMap({ forceRefresh }),
        ]);
        musicData = data;
        aliasMap = alias || Object.create(null);
        musicData.sort((a, b) => Number(a.id) - Number(b.id));

        this.riseData();
        this.tableData = JSON.parse(JSON.stringify(musicData));
        this.renderSearchOption();
        this.dataUpdatedAt = new Date();
        this.aliasCount = Object.keys(aliasMap).length;
        if (forceRefresh) {
          Message.success(
            `已同步：${musicData.length} 首乐曲，${this.aliasCount} 条别名`
          );
        }
      } catch (e) {
        console.error("[maiSearch] 加载乐曲数据失败：", e);
        Message.error("加载乐曲数据失败：" + (e && e.message ? e.message : e));
      } finally {
        loading.close();
      }
    },

    // 手动刷新数据按钮
    async refreshMusicData() {
      clearAllCache();
      await this.fetchAndApplyMusicData(true);
    },

    // 封面加载失败时切换到本地兜底图，避免无限循环
    onCoverError(e) {
      const img = e && e.target;
      if (!img) return;
      if (img.dataset.fallback === '1') return;
      img.dataset.fallback = '1';
      img.src = COVER_FALLBACK_URL;
    },

    // 切换深色模式
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      try {
        localStorage.setItem("maiSearch:darkMode", this.darkMode ? "1" : "0");
      } catch (e) {
        /* noop */
      }
      this.applyDarkMode();
    },

    // 把当前 darkMode 状态应用到 <html> 上（CSS 通过 .dark 选择器生效）
    applyDarkMode() {
      const root = document.documentElement;
      if (this.darkMode) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    },

    //是移动端返回true,否则false
    isMobile() {
      return /phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone|webOS|android/i.test(
        navigator.userAgent
      );
    },

    // 取随机数
    randomNum(minNum, maxNum) {
      switch (arguments.length) {
        case 1:
          return parseInt(Math.random() * minNum + 1, 10);
          break;
        case 2:
          return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
          break;
        default:
          return 0;
          break;
      }
    },

    // 获取 tap 数据
    getTap(baseScore) {
      return [
        {
          name: "Perfect",
          score: baseScore,
          proportion: (baseScore / 10000).toFixed(4),
          className: "maiP",
        },
        {
          name: "Great",
          score: baseScore * 0.8,
          proportion: ((baseScore * 0.8) / 10000).toFixed(4),
          className: "maiG",
        },
        {
          name: "Good",
          score: baseScore * 0.5,
          proportion: ((baseScore * 0.5) / 10000).toFixed(4),
          className: "maiG2",
        },
      ];
    },

    // 获取 hold 数据
    getHold(baseScore) {
      let hold = this.getTap(baseScore);
      hold.forEach((ele) => {
        ele.score *= 2;
        ele.proportion = (ele.proportion * 2).toFixed(4);
      });
      return hold;
    },

    // 获取 slide 数据
    getSlide(baseScore) {
      let slide = this.getTap(baseScore);
      slide.forEach((ele) => {
        ele.score *= 3;
        ele.proportion = (ele.proportion * 3).toFixed(4);
      });
      return slide;
    },

    // 获取 break 数据
    getBreak(breakNumber, baseScore) {
      const totalScore = 10000 / breakNumber + baseScore * 5;
      return {
        Perfect: [
          {
            name: "Critical Perfect",
            score: totalScore,
            proportion: (totalScore / 10000).toFixed(4),
            className: "maiCP",
          },
          {
            name: "Lost 50 Perfect",
            score: totalScore * 0.8,
            proportion: ((totalScore * 0.8) / 10000).toFixed(4),
            className: "maiP",
          }, // 2550
          {
            name: "Lost 100 Perfect",
            score: totalScore * 0.5,
            proportion: ((totalScore * 0.5) / 10000).toFixed(4),
            className: "maiP",
          }, // 2500
        ],
        Great: [
          {
            name: "Break Great",
            score: totalScore * 0.4,
            proportion: ((totalScore * 0.4) / 10000).toFixed(4),
            className: "maiG",
          }, // 2000
          {
            name: "Lost 500 Great",
            score: totalScore * 0.3,
            proportion: ((totalScore * 0.3) / 10000).toFixed(4),
            className: "maiG",
          }, // 1500
          {
            name: "Lost 750 Great",
            score: totalScore * 0.25,
            proportion: ((totalScore * 0.25) / 10000).toFixed(4),
            className: "maiG",
          }, // 1250
        ],
        Good: [
          {
            name: "Break Good",
            core: totalScore * 0.2,
            proportion: ((totalScore * 0.2) / 10000).toFixed(4),
            className: "maiG2",
          },
        ],
      };
    },

    // 获取 touch 数据
    getTouch(baseScore) {
      return [
        {
          name: "Perfect",
          score: baseScore,
          proportion: (baseScore / 10000).toFixed(4),
          className: "maiP",
        },
        {
          name: "Late",
          score: baseScore * 0.5,
          proportion: (baseScore / 10000).toFixed(4),
          className: "maiG2",
        },
      ];
    },

    // 获取 touchHold 数据
    getTouchHold(baseScore) {
      let touchHold = this.getTouch(baseScore);
      touchHold.forEach((ele) => {
        ele.score *= 2;
        ele.proportion *= 2;
      });
      return touchHold;
    },

    // 获取级别名称和术语
    getMaiLevelName() {
      return [
        { eName: "Basic", cName: "初级", term: "绿谱" },
        { eName: "Advanced", cName: "高级", term: "黄谱" },
        { eName: "Expert", cName: "专家", term: "红谱" },
        { eName: "Master", cName: "大师", term: "紫谱" },
        { eName: "Re:Master", cName: "宗师", term: "白谱" },
      ];
    },

    // 修改每页显示数量
    handleSizeChange(size) {
      this.pagesize = size;
    },

    // 修改页数
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },

    // 清洗数据
    riseData() {
      const maiLevelNameData = this.getMaiLevelName();
      musicData.forEach((pEle) => {
        // 通过配置化的 COVER_URL_TEMPLATE 生成封面 URL
        pEle.coverUrl = buildCoverUrl(pEle);

        let levelNameArray = [];
        pEle.maiDs = pEle.ds.toString().replace(/,/g, " -> ");
        pEle.maiLevel = pEle.level.toString().replace(/,/g, " -> ");

        pEle.level.forEach((cEle, cIndex) => {
          levelNameArray.push({
            level: cEle,
            ds: pEle.ds[cIndex],
            eName: maiLevelNameData[cIndex].eName,
            cName: maiLevelNameData[cIndex].cName,
            term: maiLevelNameData[cIndex].term,
          });
        });

        pEle.maiLevelName = levelNameArray;

        // 从柚子社别名映射中按 id 注入别名数组
        const aliasList = aliasMap[String(pEle.id)];
        if (Array.isArray(aliasList) && aliasList.length) {
          pEle.musicNickName = aliasList;
        } else {
          pEle.musicNickName = null;
        }
      });
    },

    // 搜索歌曲数据
    searchMusicData() {
      let filters = []; // 搜索条件
      this.currentPage = 1;

      // 如果填入了 ID
      if (this.searchForm.id) {
        filters.push({
          field: "id",
          relationType: "equal",
          value: this.searchForm.id,
        });
      }

      // 如果填入了乐曲名称
      if (this.searchForm.title) {
        filters.push({
          field: "title",
          relationType: "like",
          value: this.searchForm.title,
        });
      }

      // 如果填入了乐曲别名（任一别名包含输入子串即匹配，对原始数组做匹配）
      if (this.searchForm.noobNickName) {
        filters.push({
          field: "musicNickName",
          relationType: "arrayLike",
          value: this.searchForm.noobNickName,
        });
      }

      // 如果填入了定数
      if (this.searchForm.ds && this.searchForm.ds !== "->") {
        filters.push({
          field: "ds",
          relationType: "include",
          value: this.searchForm.ds + "",
        });
      }

      // 如果填入了乐曲类型
      if (this.searchForm.type) {
        filters.push({
          field: "type",
          relationType: "equal",
          value: this.searchForm.type,
        });
      }

      // 如果填入了乐曲等级
      if (this.searchForm.level) {
        filters.push({
          field: "level",
          relationType: "include",
          value: this.searchForm.level,
        });
      }

      // 如果填入了歌手（模糊匹配）
      if (this.searchForm.artist) {
        filters.push({
          field: "basic_info.artist",
          relationType: "like",
          value: this.searchForm.artist,
        });
      }

      // 如果选择了乐曲分类
      if (this.searchForm.genre) {
        filters.push({
          field: "basic_info.genre",
          relationType: "equal",
          value: this.searchForm.genre,
        });
      }

      // 如果选择了乐曲版本
      if (this.searchForm.from) {
        filters.push({
          field: "basic_info.from",
          relationType: "equal",
          value: this.searchForm.from,
        });
      }

      let tableData = JSON.parse(JSON.stringify(musicData));
      this.tableData = this.filteringDataSources(tableData, filters);
      this.riseData();
    },

    // 搜索算法
    filteringDataSources(source, filters) {
      // 通过点路径读取嵌套字段，例如 "basic_info.artist"
      const getFieldValue = (obj, field) => {
        if (!field) return undefined;
        const parts = String(field).split(".");
        let cur = obj;
        for (let i = 0; i < parts.length; i++) {
          if (cur === null || cur === undefined) return undefined;
          cur = cur[parts[i]];
        }
        return cur;
      };

      // 动态表达式集合，用于存储判断某个对象是否满足条件的函数
      const expressions = [];
      // 遍历过滤器集合，动态添加表达式函数
      filters.forEach((item) => {
        // 添加表达式函数，参数为数组的每个数据对象
        expressions.push((obj) => {
          // 是否符合条件
          let isFit = false;
          // 用于被比较的过滤器值
          const compareValue = String(item.value);
          const compareLower = compareValue.toLowerCase();
          // 判断数据对象是否存在用于过滤的属性，如果不存在直接判定为不符合条件
          const fieldValue = getFieldValue(obj, item.field);
          if (fieldValue === undefined || fieldValue === null) {
            return false;
          }

          // arrayLike: 在数组里任意一项包含子串
          if (item.relationType === "arrayLike") {
            const list = Array.isArray(fieldValue)
              ? fieldValue
              : String(fieldValue).split(",");
            return list.some((ele) =>
              String(ele).toLowerCase().includes(compareLower)
            );
          }

          // 获取数据对象用于比较的属性值，统一转为字符串类型，便于比较
          const objValue = String(fieldValue);

          // 判断逻辑
          if (item.relationType === "equal") {
            // 等于
            isFit = objValue.toLowerCase() === compareLower;
          } else if (item.relationType === "notEqual") {
            // 不等于
            isFit = objValue.toLowerCase() !== compareLower;
          } else if (item.relationType === "like") {
            // 模糊匹配
            isFit = objValue.toLowerCase().includes(compareLower);
          } else if (item.relationType === "beginWith") {
            // 以它开头
            isFit = objValue.toLowerCase().startsWith(compareLower);
          } else if (item.relationType === "endWith") {
            // 以它结尾
            isFit = objValue.toLowerCase().endsWith(compareLower);
          } else if (item.relationType === "include") {
            // 包含(用于逗号分隔的字符串字段，例如 ds / level)
            isFit = objValue.split(",").some((ele) => {
              return ele.toLowerCase() === compareLower;
            });
          }

          // 返回当前表达式是否符合条件
          return isFit;
        });
      });

      // 遍历数据源
      source = source.filter((item) => {
        // 是否符合条件
        let isFit = true;
        // 遍历表达式集合，循环判断每个用于过滤的表达式函数是否符合
        for (let index = 0; index < expressions.length; index++) {
          // 获取表达式函数
          const expression = expressions[index];
          // 调用表达式函数，获取结果
          const result = expression(item);
          // 如果结果为false，则终止表达式集合的遍历（即有一个条件不符合，则该条数据则被判定不满足条件）
          if (!result) {
            isFit = false;
            break;
          }
        }

        // 返回当前数据对象是否符合条件，不符合条件则被过滤掉，不会出现在最终数据中
        return isFit;
      });

      // 返回过滤后的数据源
      return source;
    },

    // 生成其他搜索条件
    renderSearchOption() {
      // 乐曲等级搜索条件
      let musicLevelArray = [];
      // 分类与版本搜索条件
      const genreSet = new Set();
      const fromSet = new Set();

      musicData.forEach((pEle) => {
        // 包装乐曲等级搜索条件
        const levelFindResult = pEle.level.find((findEle) => {
          const cRes = musicLevelArray.some((cEle) => {
            return cEle === findEle;
          });
          return !cRes;
        });
        // 遍历出不重复的等级搜索条件并 push 进数组备用
        levelFindResult && musicLevelArray.push(levelFindResult);

        const info = pEle.basic_info || {};
        if (info.genre) genreSet.add(String(info.genre));
        if (info.from) fromSet.add(String(info.from));
      });

      // 将包装出来的等级搜索条件排序为从小到大的排列方式，如：
      // ["1", "2", "3", "4", "5", "6", "7", "7+", "8", "8+" ......]
      musicLevelArray.sort((a, b) => {
        const tempA = a.indexOf("+") !== -1 ? parseInt(a) + 0.5 : parseInt(a);
        const tempB = b.indexOf("+") !== -1 ? parseInt(b) + 0.5 : parseInt(b);
        return tempA - tempB;
      });

      // 遍历改变结构为 select 组件直接可用的方便格式
      musicLevelArray = musicLevelArray.map((ele) => {
        return {
          label: ele,
          value: ele,
        };
      });

      // 返回给 select 组件使用
      this.musicLevelArray = musicLevelArray;

      // 分类：按字典序排
      this.musicGenreArray = Array.from(genreSet)
        .sort((a, b) => a.localeCompare(b))
        .map((v) => ({ label: v, value: v }));

      // 版本：尝试按"maimai 版本顺序"排，找不到就按字典序兜底
      const versionOrder = [
        "maimai",
        "maimai PLUS",
        "maimai GreeN",
        "maimai GreeN PLUS",
        "maimai ORANGE",
        "maimai ORANGE PLUS",
        "maimai PiNK",
        "maimai PiNK PLUS",
        "maimai MURASAKi",
        "maimai MURASAKi PLUS",
        "maimai MiLK",
        "maimai MiLK PLUS",
        "maimai FiNALE",
        "maimai でらっくす",
        "maimai でらっくす PLUS",
        "maimai でらっくす Splash",
        "maimai でらっくす Splash PLUS",
        "maimai でらっくす UNiVERSE",
        "maimai でらっくす UNiVERSE PLUS",
        "maimai でらっくす FESTiVAL",
        "maimai でらっくす FESTiVAL PLUS",
        "maimai でらっくす BUDDiES",
        "maimai でらっくす BUDDiES PLUS",
        "maimai でらっくす PRiSM",
        "maimai でらっくす PRiSM PLUS",
      ];
      const versionIndex = (v) => {
        const i = versionOrder.indexOf(v);
        return i === -1 ? Number.MAX_SAFE_INTEGER : i;
      };
      this.musicFromArray = Array.from(fromSet)
        .sort((a, b) => {
          const ia = versionIndex(a);
          const ib = versionIndex(b);
          if (ia !== ib) return ia - ib;
          return a.localeCompare(b);
        })
        .map((v) => ({ label: v, value: v }));
    },

    // 查看详情
    viewDetail(musicItem) {
      this.dialogTitle =
        "[ " + musicItem.title + " ( " + musicItem.type + " ) ]";
      let musicItemTableData = [];
      musicItem.charts.forEach((pEle) => {
        const maiNotes = pEle.notes;
        const tapNumber = maiNotes[0];
        const holdNumber = maiNotes[1];
        const slideNumber = maiNotes[2];
        const touchNumber = musicItem.type === "DX" ? maiNotes[3] : 0;
        const breakNumber = musicItem.type === "DX" ? maiNotes[4] : maiNotes[3];

        const baseScore =
          1000000 /
          (tapNumber +
            touchNumber +
            breakNumber * 5 +
            holdNumber * 2 +
            slideNumber * 3);

        // tap note
        const maiTap = this.getTap(baseScore);
        // hold note
        const maiHold = this.getHold(baseScore);
        // slide note
        const maiSlide = this.getSlide(baseScore);
        // touch note
        const maiTouch = this.getTouch(baseScore);
        // toucHold note
        const maiTouchHold = this.getTouchHold(baseScore);
        // break note
        let maiBreak = this.getBreak(breakNumber, baseScore);

        musicItemTableData.push([
          {
            tapNumber,
            holdNumber,
            slideNumber,
            touchNumber,
            breakNumber,

            maiTap,
            maiTapTable: [
              {
                y1: maiTap[0].name,
                y2: maiTap[0].className,
                y3: maiTap[0].proportion + "%",

                p1: maiTap[1].name,
                p2: maiTap[1].className,
                p3: maiTap[1].proportion + "%",

                g1: maiTap[2].name,
                g2: maiTap[2].className,
                g3: maiTap[2].proportion + "%",
              },
            ],

            maiHold,
            maiHoldTable: [
              {
                y1: maiHold[0].name,
                y2: maiHold[0].className,
                y3: maiHold[0].proportion + "%",

                p1: maiHold[1].name,
                p2: maiHold[1].className,
                p3: maiHold[1].proportion + "%",

                g1: maiHold[2].name,
                g2: maiHold[2].className,
                g3: maiHold[2].proportion + "%",
              },
            ],

            maiSlide,
            maiSlideTable: [
              {
                y1: maiSlide[0].name,
                y2: maiSlide[0].className,
                y3: maiSlide[0].proportion + "%",

                p1: maiSlide[1].name,
                p2: maiSlide[1].className,
                p3: maiSlide[1].proportion + "%",

                g1: maiSlide[2].name,
                g2: maiSlide[2].className,
                g3: maiSlide[2].proportion + "%",
              },
            ],

            maiTouch,
            maiBreak,
            maiBreakTable: [
              {
                y1: maiBreak.Perfect[0].name,
                y2: maiBreak.Perfect[0].className,
                y3: maiBreak.Perfect[0].proportion + "%",

                y4: maiBreak.Perfect[1].name,
                y5: maiBreak.Perfect[1].className,
                y6: maiBreak.Perfect[1].proportion + "%",

                y7: maiBreak.Perfect[2].name,
                y8: maiBreak.Perfect[2].className,
                y9: maiBreak.Perfect[2].proportion + "%",

                p1: maiBreak.Great[0].name,
                p2: maiBreak.Great[0].className,
                p3: maiBreak.Great[0].proportion + "%",

                p4: maiBreak.Great[1].name,
                p5: maiBreak.Great[1].className,
                p6: maiBreak.Great[1].proportion + "%",

                p7: maiBreak.Great[2].name,
                p8: maiBreak.Great[2].className,
                p9: maiBreak.Great[2].proportion + "%",

                g1: maiBreak.Good[0].name,
                g2: maiBreak.Good[0].className,
                g3: maiBreak.Good[0].proportion + "%",
              },
            ],
          },
        ]);
      });

      musicItem.musicItemTableData = musicItemTableData;
      this.musicItem = musicItem;
      if (this.isMobileUser) {
        this.showDrawer = true;
        this.showDialog = false;
      } else {
        this.showDrawer = false;
        this.showDialog = true;
      }
    },

    // 打开谱面确认（基于 awmc.team 的 viewer）
    // musicItem: 乐曲对象（需要 id 与 type 字段）
    // levelIndex: maiLevelName 数组下标，0=Basic 1=Advanced 2=Expert 3=Master 4=Re:Master
    //   对应 viewer 的 diff: 0->2, 1->3, 2->4, 3->5, 4->6
    openChartViewer(musicItem, levelIndex) {
      if (!musicItem || musicItem.id == null) {
        Message.warning("缺少乐曲 ID");
        return;
      }
      const level = musicItem.maiLevelName && musicItem.maiLevelName[levelIndex];
      if (!level || !level.level) {
        Message.warning("此谱面不存在");
        return;
      }
      // viewer 的 song 需要原始 id；水鱼对 DX 谱面加了 10000 偏移，需要还原
      const songId = toRawSongId(musicItem.id);
      const kind = musicItem.type === "DX" ? "dx" : "standard";
      const diff = levelIndex + 2; // Basic/Advanced/Expert/Master/Re:Master => 2/3/4/5/6
      const url = `https://v.awmc.team/?song=${encodeURIComponent(
        songId
      )}&kind=${kind}&diff=${diff}`;
      window.open(url, "_blank", "noopener");
    },

    // 弹出计算弹窗
    showCalcBox(musicItem) {
      this.dialogTitle =
        "[ " + musicItem.title + " ( " + musicItem.type + " ) ]";

      this.calcMusicItem = musicItem;
      this.calcLevel = musicItem.maiLevelName[0].term;
      this.calcAcc = this.calcAcc || 97.0;

      let musicItemTableData = [];

      musicItem.charts.forEach((pEle) => {
        const maiNotes = pEle.notes;
        const tapNumber = maiNotes[0];
        const holdNumber = maiNotes[1];
        const slideNumber = maiNotes[2];
        const touchNumber = musicItem.type === "DX" ? maiNotes[3] : 0;
        const breakNumber = musicItem.type === "DX" ? maiNotes[4] : maiNotes[3];

        const baseScore =
          1000000 /
          (tapNumber +
            touchNumber +
            breakNumber * 5 +
            holdNumber * 2 +
            slideNumber * 3);

        // tap note
        const maiTap = this.getTap(baseScore);
        // hold note
        const maiHold = this.getHold(baseScore);
        // slide note
        const maiSlide = this.getSlide(baseScore);
        // touch note
        const maiTouch = this.getTouch(baseScore);
        // break note
        let maiBreak = this.getBreak(breakNumber, baseScore);

        musicItemTableData.push({
          tapNumber,
          holdNumber,
          slideNumber,
          touchNumber,
          breakNumber,

          maiTap,
          maiTapInfo: {
            y1: maiTap[0].name,
            y2: maiTap[0].className,
            y3: maiTap[0].proportion,

            p1: maiTap[1].name,
            p2: maiTap[1].className,
            p3: maiTap[1].proportion,

            g1: maiTap[2].name,
            g2: maiTap[2].className,
            g3: maiTap[2].proportion,
          },

          maiHold,
          maiHoldInfo: {
            y1: maiHold[0].name,
            y2: maiHold[0].className,
            y3: maiHold[0].proportion,

            p1: maiHold[1].name,
            p2: maiHold[1].className,
            p3: maiHold[1].proportion,

            g1: maiHold[2].name,
            g2: maiHold[2].className,
            g3: maiHold[2].proportion,
          },

          maiSlide,
          maiSlideTable: [],
          maiSlideInfo: {
            y1: maiSlide[0].name,
            y2: maiSlide[0].className,
            y3: maiSlide[0].proportion,

            p1: maiSlide[1].name,
            p2: maiSlide[1].className,
            p3: maiSlide[1].proportion,

            g1: maiSlide[2].name,
            g2: maiSlide[2].className,
            g3: maiSlide[2].proportion,
          },

          maiTouch,
          maiBreak,
          maiBreakInfo: {
            y1: maiBreak.Perfect[0].name,
            y2: maiBreak.Perfect[0].className,
            y3: maiBreak.Perfect[0].proportion,

            y4: maiBreak.Perfect[1].name,
            y5: maiBreak.Perfect[1].className,
            y6: maiBreak.Perfect[1].proportion,

            y7: maiBreak.Perfect[2].name,
            y8: maiBreak.Perfect[2].className,
            y9: maiBreak.Perfect[2].proportion,

            p1: maiBreak.Great[0].name,
            p2: maiBreak.Great[0].className,
            p3: maiBreak.Great[0].proportion,

            p4: maiBreak.Great[1].name,
            p5: maiBreak.Great[1].className,
            p6: maiBreak.Great[1].proportion,

            p7: maiBreak.Great[2].name,
            p8: maiBreak.Great[2].className,
            p9: maiBreak.Great[2].proportion,

            g1: maiBreak.Good[0].name,
            g2: maiBreak.Good[0].className,
            g3: maiBreak.Good[0].proportion,
          },
        });
      });

      musicItem.musicItemTableData = musicItemTableData;

      this.calcMusicItem = musicItem;

      this.calcAccData(0);
    },

    // 简易计算容错
    calcAccData(index) {
      const TAP = this.calcMusicItem.musicItemTableData[index].maiTapInfo;
      const TNumber =
        this.calcMusicItem.musicItemTableData[index].tapNumber +
        (this.calcMusicItem.musicItemTableData[index].touchNumber || 0);

      const HOLD = this.calcMusicItem.musicItemTableData[index].maiHoldInfo;
      const HNumber = this.calcMusicItem.musicItemTableData[index].holdNumber;

      const SLIDE = this.calcMusicItem.musicItemTableData[index].maiSlideInfo;
      const SNumber = this.calcMusicItem.musicItemTableData[index].slideNumber;

      const BREAK = this.calcMusicItem.musicItemTableData[index].maiBreakInfo;
      const BNumber = this.calcMusicItem.musicItemTableData[index].breakNumber;

      const calcScore = this.calcAcc * 10000;

      let baseCalc = function (noteScore) {
        let totalScore = 1010000 - noteScore;
        let count = 0;
        while (totalScore > calcScore) {
          totalScore -= noteScore;
          count++;
        }
        return count;
      };

      const tapGreatNum = baseCalc((TAP.y3 - TAP.p3) * 10000);
      const tapGoodNum = baseCalc((TAP.y3 - TAP.g3) * 10000);
      const tapMissNum = baseCalc(TAP.y3 * 10000);
      const baseStr = `${this.calcMusicItem.title} [${this.calcLevel}] 达到 ${this.calcAcc}% 允许的最大容错率为：`;
      const tapStr = `Tap与Touch(${TNumber}个) - ${
        tapGreatNum >= TNumber ? "可全粉" : "可粉" + tapGreatNum + "个"
      } 或 ${tapGoodNum >= TNumber ? "全绿" : "绿" + tapGoodNum + "个"} 或 ${
        tapMissNum >= TNumber ? "全Miss" : "Miss" + tapMissNum + "个"
      }`;

      const holdGreatNum = baseCalc((HOLD.y3 - HOLD.p3) * 10000);
      const holdGoodNum = baseCalc((HOLD.y3 - HOLD.g3) * 10000);
      const holdMissNum = baseCalc(HOLD.y3 * 10000);
      const holdStr = `Hold(${HNumber}个) - ${
        holdGreatNum >= HNumber ? "可全粉" : "可粉" + holdGreatNum + "个"
      } 或 ${holdGoodNum >= HNumber ? "全绿" : "绿" + holdGoodNum + "个"} 或 ${
        holdMissNum >= HNumber ? "全Miss" : "Miss" + holdMissNum + "个"
      }`;

      const slideGreatNum = baseCalc((SLIDE.y3 - SLIDE.p3) * 10000);
      const slideGoodNum = baseCalc((SLIDE.y3 - SLIDE.g3) * 10000);
      const slideMissNum = baseCalc(SLIDE.y3 * 10000);
      const slideStr = `Slide(${SNumber}个) - ${
        slideGreatNum >= SNumber ? "可全粉" : "可粉" + slideGreatNum + "个"
      } 或 ${
        slideGoodNum >= SNumber ? "全绿" : "绿" + slideGoodNum + "个"
      } 或 ${
        slideMissNum >= SNumber ? "全Miss" : "Miss" + slideMissNum + "个"
      }`;

      const break50P = baseCalc((BREAK.y3 - BREAK.y6) * 10000);
      const break100P = baseCalc((BREAK.y3 - BREAK.y9) * 10000);
      const breakCG = baseCalc((BREAK.y3 - BREAK.p3) * 10000);
      const break50G = baseCalc((BREAK.y3 - BREAK.p6) * 10000);
      const break100G = baseCalc((BREAK.y3 - BREAK.p9) * 10000);
      const breakG = baseCalc((BREAK.y3 - BREAK.g3) * 10000);
      const breakMiss = baseCalc(BREAK.y3 * 10000);

      const breakStr = `Break(${BNumber}个) - ${
        break50P >= BNumber ? "可全黄50落" : "可黄50落" + break50P + "个"
      } 或 ${
        break100P >= BNumber ? "全黄100落" : "黄100落" + break100P + "个"
      } 或 ${breakCG >= BNumber ? "全大粉" : "大粉" + breakCG + "个"} 或 ${
        break50G >= BNumber ? "全粉50落" : "粉50落" + break50G + "个"
      } 或 ${
        break100G >= BNumber ? "全粉100落" : "粉100落" + break100G + "个"
      } 或 ${breakG >= BNumber ? "全绿" : "绿" + breakG + "个"} 或 ${
        breakMiss >= BNumber ? "全Miss" : "Miss" + breakMiss + "个"
      }`;

      this.baseStr = baseStr;
      this.tapStr = tapStr;
      this.holdStr = holdStr;
      this.slideStr = slideStr;
      this.breakStr = breakStr;

      this.calcBoxShow = true;
    },

    // 修改计算容错级别或完成率
    changeCalcLevel(item, res) {
      item.forEach((ele, index) => {
        if (ele.term === res) {
          this.calcAccData(index || 0);
        }
      });
    },

    // 图片查看组件初始化
    viewerInited(viewer) {
      this.viewer = viewer;
      this.viewer.hidden = () => {
        this.viewerShow = false;
        if (this.isMobileUser) {
          document.body.classList.remove("viewer-open");
        }
      };
      this.viewer.view(0);
    },

    // 查看歌曲大图封面
    previewImage(previewCoverUrl) {
      this.previewCoverUrl = [previewCoverUrl];
      this.viewerShow = true;
    },
  },
};
</script>
<style scoped>
.pageBox {
  width: 100%;
  height: 100%;
}

.pageBox .tableBox {
  width: 90%;
  height: 90%;
  margin: 0 5%;
}

.pageBox .searchBox {
  width: 90%;
  margin: 0 5%;
}

.pageBox .searchBox .el-input,
.pageBox .searchBox .el-select {
  width: 130px;
}

.pageBox .paginationBox {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
}
</style>
<style>
.pageBox .tableBox .cell,
.pageBox .tabPaneBox .cell {
  text-align: center;
}

.pageBox .el-tabs .el-tabs__content {
  max-height: 400px;
  overflow-y: scroll;
}

.pageBox .el-tabs .el-tabs__content::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background: #fff;
}

.pageBox .el-tabs .el-tabs__content::-webkit-scrollbar-track {
  border-radius: 5px;
  background: #fff;
}

.pageBox .el-tabs .el-tabs__content::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(144, 147, 153, 0.3);
}

.pageBox .el-dropdown-menu__item.maiColorExpert {
  color: red;
}

.pageBox .el-dropdown-menu__item.maiColorMaster {
  color: purple;
}

.pageBox .el-dropdown-menu__item.maiColorReMaster {
  color: rgb(221, 152, 249);
}

.pageBox .musicItemCoverBox {
  width: 75px;
  height: 75px;
  padding: 10px;
  position: absolute;
  left: 0;
  top: -95px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px 5px 0 0;
}

.pageBox .musicItemCoverBox img {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
}
</style>
<style>
.mobilePageBox {
  font-size: 14px;
  width: 100%;
  height: 100%;
  position: relative;
}

.h {
  position: relative;
  margin: 0 0.24rem;
}

.magickTop {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  background: #fff;
  z-index: 2000;
}

.cardBox {
  margin-top: 50px;
  height: calc(100% - 60px);
  overflow-y: scroll;
}

.cardBox .el-card {
  margin-bottom: 24px;
}

.cardBox .el-card:last-child {
  margin-bottom: 0;
}

.cardBoxHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cardBoxHeader .r {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.cardBox .cardContentBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cardBox .cardContentBox img {
  width: 100%;
  background: 100% 100%;
}

.cardMusicInfo {
  width: 65%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.cardMusicInfo p {
  margin-bottom: 8px;
}

.cardMusicInfo p:last-child {
  margin-bottom: 0;
}

.mobilePageBox .cell {
  text-align: center;
}

.mobilePageBox .el-tabs__content {
  max-height: 55vh;
  overflow-y: scroll;
}

.currentPagination {
  padding-bottom: 20px;
  padding-top: 10px;
  width: calc(100% - 0.48rem);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 2000;
  background: #fff;
}

.el-loading-mask .el-icon-loading {
  font-size: 36px;
}

.el-loading-mask .el-loading-text {
  font-size: 14px;
}

.mobilePageBox .musicItemCoverBox {
  width: 75px;
  height: 75px;
  padding: 10px;
  position: absolute;
  left: -13px;
  top: -172px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px 5px 0 0;
}

.mobilePageBox .musicItemCoverBox img {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
}

.mobilePageBox .el-drawer {
  overflow: visible;
}
</style>

