<!--
 * @Description: 员工服务
 * @Author: wJiaaa
 * @LastEditors: wJiaaa
-->
<template>
  <div class="overview-page">
    <RightContainer :config-keys="['chatSecret']" :page-title="'统计 [有效沟通客户数] 、 [有效沟通率] '">
      <template v-slot:search>
        <el-form
          ref="queryForm"
          :inline="true"
          :model="query"
          label-width="100px"
          class="top-search"
          size="small"
        >
          <el-form-item>
            <div class="tag-input" @click="dialogVisibleSelectUser = true">
              <span v-if="!userAndDepartmentList.length" class="tag-place">请选择员工/部门</span>
              <template v-else>
                <el-tag
                  v-for="(unit, unique) in userAndDepartmentList"
                  :key="unique"
                  class="theme-text-color user-tag iaic"
                >
                  <TagUserShow :name="unit.name" :show-icon="!unit.userId" />
                </el-tag>
              </template>
            </div>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="dateRange"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSearch"
            >查询</el-button>
            <el-button
              class="btn-reset"
              @click="resetForm"
            >重置</el-button>
          </el-form-item>
        </el-form>
      </template>

      <template v-slot:data>
        <Statistics
          :show-uptime="false"
          :col-list="topLineColList"
          title="数据总览"
        >
          <template slot="operate">
            <el-popover
              placement="left-start"
              trigger="hover"
              :offset="10"
            >
              <div class="popover-content">
                <div class="info">
                  <p>聊天总数：员工有发过消息的单聊总数</p>
                  <p>发送消息数：员工在单聊中发送的消息总数</p>
                  <p>平均会话数：发送消息数/聊天总数</p>
                  <p>平均首次回复时长：客户主动发起聊天，员工在一个自然日内首次回复的间隔时长的平均值</p>
                  <p>回复率：客户主动发起聊天后，员工在一个自然日内有回复消息的聊天数/客户主动发起聊天数</p>
                  <p>有效沟通客户数：在一个自然日内，和员工有3轮以上对话的客户数</p>
                  <p>有效沟通率：有效沟通客户数/聊天总数</p>
                  <p>客户好评率：从问卷表单中统计而来，员工收到的评价/（评价人数*10）</p>
                </div>
                <div class="line" />
                <div class="notice">
                  注意：
                  <div>
                    1. 聊天总数、发送消息数、平均首次回复时长、回复率的统计数据来源于企业微信；
                  </div>
                  <div>
                    2. 有效沟通客户数、有效沟通率的统计数据来源于会话存档，若员工未开启会话存档或客户拒绝存档，统计数将受影响。
                  </div>
                </div>
              </div>
              <div slot="reference" class="statistic theme-text-color">统计说明</div>
            </el-popover>
          </template>
        </Statistics>
        <Statistics
          class="next-statistics"
          :show-uptime="false"
          :col-list="nextLineColList"
        />
        <div class="table-overview">
          <div class="forms-handle-btn">
            <!-- TODO 暂时屏蔽 -->
            <!-- <el-button
              v-hasPermi="['statistic:employeeService:export']"
              class="btn-reset"
              @click="exportForms"
            >导出报表</el-button> -->
          </div>
          <!-- TODO 暂时屏蔽 -->
          <!-- sortable="customer"
            :default-sort="{ prop: 'chatTotal', order: 'descending' }"
            @sort-change="changeTableSort" -->
          <el-table
            ref="table"
            v-loading="loading"
            :data="list"
          >
            <template slot="empty">
              <empty-default-icon :length="list.length" />
            </template>
            <el-table-column label="员工" align="center" width="180">
              <template slot-scope="scope">
                <div class="user-info">
                  <img :src="scope.row.userHeadImage || require('@/assets/image/card-avatar.svg')" alt="">
                  <div class="user-info-userName inoneline">
                    <span class="inoneline">{{ scope.row.userName }}</span>
                    <span class="user-info-departmentName inoneline">{{ companName + '/' + scope.row.departmentName }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="chatTotal" label="聊天总数" min-width="120" />
            <el-table-column prop="sendContactCnt" label="发送消息数" min-width="120" />
            <el-table-column prop="averageChatTotal" label="平均会话数" min-width="120" />
            <el-table-column prop="averageFirstReplyDuration" label="平均首次回复时长" min-width="160">
              <template slot-scope="scope">
                <span>{{ scope.row.averageFirstReplyDuration + '分钟' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="replyRate" label="回复率" min-width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.replyRate + '%' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="effectiveCommunicationCustomerCnt" label="有效沟通客户数" min-width="160" />
            <el-table-column prop="effectiveCommunicationRate" label="有效沟通率" min-width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.effectiveCommunicationRate + '%' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="customerPositiveCommentsRate" label="客户好评率" min-width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.customerPositiveCommentsRate + '%' }}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            :total="total"
            :page.sync="query.pageNum"
            :limit.sync="query.pageSize"
            @pagination="getList()"
          />
        </div>
        <!-- 选择员工/部门弹窗 -->
        <SelectUser
          :visible.sync="dialogVisibleSelectUser"
          title="选择员工/部门"
          :is-only-leaf="false"
          :selected-user-list="userAndDepartmentList"
          @success="selectedUserOrDepartment"
        />
      </template>
    </RightContainer>
  </div>
</template>
<script>
import TagUserShow from '@/components/TagUserShow';
import SelectUser from '@/components/SelectUser/index.vue';
import Statistics from '@/components/Statistics';
import EmptyDefaultIcon from '@/components/EmptyDefaultIcon';
import RightContainer from '@/components/RightContainer';
import { PAGE_LIMIT } from '@/utils/constant';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { YESTERDAY_TIME, FIXED_DAYS_AGO_TIME, groupByScopeType } from '@/utils/common';
import { getUserServiceOfTotal, getUserServiceOfUser, exportUserServiceOfUser } from '@/api/statistics';
// TODO 合并客户联系相同字段
// eslint-disable-next-line no-magic-numbers
const ONE_MONTH = 30 * 24 * 3600 * 1000;
export default {
  name: '',
  components: { RightContainer, EmptyDefaultIcon, Statistics, SelectUser, TagUserShow },
  data() {
    return {
      selectDate: '',
      // TODO 合并客户联系相同方法
      // 日期范围选择限定
      pickerOptions: {
        disabledDate: (v) => {
          if (this.selectDate !== '') {
            const minTime = this.selectDate - ONE_MONTH;
            const maxTime = this.selectDate + ONE_MONTH;
            return v.getTime() < new Date(FIXED_DAYS_AGO_TIME).getTime() || v.getTime() > new Date().getTime() || moment(v).isSame(new Date(), 'day') ||
             v.getTime() < minTime || v.getTime() > maxTime;
          }
          return v.getTime() < new Date(FIXED_DAYS_AGO_TIME).getTime() || v.getTime() > new Date().getTime() || moment(v).isSame(new Date(), 'day');
        },
        onPick: ({ maxDate, minDate }) => {
          this.selectDate = minDate.getTime();
          if (maxDate) {
            this.selectDate = '';
          }
        }
      },
      // 日期范围
      dateRange: [YESTERDAY_TIME, YESTERDAY_TIME],
      // 搜索框选择的添加人
      userAndDepartmentList: [],
      // 查询参数
      query: {
        pageNum: 1,
        // eslint-disable-next-line no-magic-numbers
        pageSize: PAGE_LIMIT,
        beginTime: YESTERDAY_TIME,
        endTime: YESTERDAY_TIME
      },
      // 总条数
      total: 0,
      /** 员工服务表格数据 */
      list: [],
      // 选择添加人弹窗显隐
      dialogVisibleSelectUser: false,
      // 表格loading
      loading: false,
      /** 数据总览的聊天总数、发送消息数、平均会话数、平均回复时长 */
      topLineColList: [
        {
          title: '聊天总数',
          filed: 'chatTotal',
          showPopover: false
        },
        { title: '发送消息数', filed: 'sendContactCnt', showPopover: false },
        {
          title: '平均会话数',
          filed: 'averageChatTotal',
          showPopover: false
        },
        { title: '平均首次回复时长', filed: 'averageFirstReplyDuration', showPopover: false, unit: '分钟' }
      ],
      /** 数据总览回复率、有效沟通客户数、有效沟通率、客户好评率 */
      nextLineColList: [
        {
          title: '回复率', filed: 'replyRate', showPopover: false, unit: '%'
        },
        { title: '有效沟通客户数', filed: 'effectiveCommunicationCustomerCnt', showPopover: false },
        {
          title: '有效沟通率', filed: 'effectiveCommunicationRate', showPopover: false, unit: '%'
        },
        { title: '客户好评率', filed: 'customerPositiveCommentsRate', showPopover: false, unit: '%' }
      ],
      /** 当前排序规则 */
      // sortRule: { chatTotal: 'DESC' }
      sortRule: {}
    };
  },
  computed: {
    companName() {
      return this.$store.state.enterPriseWechatConfig.companyName;
    }
  },
  created() {
    this.onSearch();
  },
  methods: {
    /**
     * @description 为数据总览赋值
     * @param filedType 当前赋值的列表
     * @param data 赋值列表中字段所需要的数字
     */
    setDataOverview(filedType, data) {
      filedType.forEach(element => {
        this[element] = this[element].map((item) => {
          return {
            ...item,
            [item.filed]: data ? data[item.filed] : ''
          };
        });
      });
    },

    /**
     * @description 获取数据总览数据
     */
    getDataOverview() {
      getUserServiceOfTotal(this.dealSearchPayload(true)).then((res) => {
        this.setDataOverview(['topLineColList', 'nextLineColList'], res.data);
      });
    },

    /**
     * @description 处理搜索的参数
     * @param isNeedPage 是否需要分页
     */
    dealSearchPayload(isNeedPage) {
      this.query.beginTime = this.dateRange[0];
      this.query.endTime = this.dateRange[1];
      const payload = cloneDeep(this.query);
      if (isNeedPage) {
        delete payload.pageNum;
        delete payload.pageSize;
      }
      return payload;
    },
    /**
     * @description 获取员工服务数据表格
     */
    getList() {
      this.loading = true;
      getUserServiceOfUser({ ...this.sortRule, ...this.dealSearchPayload() }).then((res) => {
        this.list = res.rows || [];
        this.total = res.total;
      }).finally(() => {
        this.loading = false;
      });
    },

    onSearch() {
      this.query.pageNum = 1;
      this.getList();
      this.getDataOverview();
    },

    resetForm() {
      this.query = this.$options.data().query;
      this.dateRange = this.$options.data().dateRange;
      this.userAndDepartmentList = [];
      // this.sortRule = { chatTotal: 'DESC' };
      this.$refs.table.sort('chatTotal', 'descending');
      this.onSearch();
    },
    /**
     * @description 选择员工/部门的回调
     */
    selectedUserOrDepartment(list) {
      this.userAndDepartmentList = list;
      const groupByList = groupByScopeType(list);
      this.query.userIds = groupByList.useEmployeesList.map((item) => item.userId);
      this.query.departmentIds = groupByList.useDepartmentList.map((item) => item.id);
    },
    /**
     * @description 导出报表
     */
    exportForms() {
      exportUserServiceOfUser(this.dealSearchPayload()).then((res) => {
        this.download(res.data.msg, true);
      }).catch(() => {
        this.msgError('导出失败!');
      });
    },
    /**
     * @description 表格排序
     */
    changeTableSort({ prop, order }) {
      // TODO 合并客户联系相同方法
      const SORT_TYPE = {
        'ascending': 'ASC',
        'descending': 'DESC',
        'null': null
      };
      this.sortRule = { [prop]: SORT_TYPE[order] };
      this.getList();
    }
  }
};
</script>
<style scoped lang='scss'>
  @import '~@/styles/mixin.scss';
  .data-overview {
    height: 182px;
    width: 100%;
    background-color: #fff;
    margin-bottom: 10px;
  }
  .table-overview {
    padding: 15px;
    margin-top: 10px;
    background-color: #fff;
    flex: 1;
    .forms-handle-btn {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 15px;
    }

  }
  /deep/ .show-data-wrapper {
    background-color: transparent;
    padding: 0;
    display: flex;
    .data-container {
      width: 100%;
      display: flex;
      flex-direction: column;
    }
  }
  .next-statistics {
    margin-top: -55px;
    /deep/ .tables {
      height: 160px;
    }
  }
  .statistic {
    font-size: 14px;
    cursor: default;
  }
  .popover-content {
    width: 390px;
    font-size: 12px;
    line-height: 20px;
    .line {
      margin: 10px 0;
      width: 100%;
      height: 0;
      border-bottom: 1px solid #EEE;
    }
    .notice {
      color: #E29836;
    }
  }
  .user-info {
    display: flex;
    align-items: center;
    i {
      font-size: 35px;
      @include text_btn_color($color-theme2-1);
    }
    img {
      width: 35px;
      height: 35px;
    }
    span {
      color: #333;
      padding-left: 5px;
      line-height: 14px;
    }
    .user-info-userName {
      display: flex;
      flex-direction: column;
      .user-info-departmentName {
        margin-top: 5px;
        color: #AAA;
      }
    }
}
</style>
