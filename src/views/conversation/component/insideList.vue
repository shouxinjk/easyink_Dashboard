
<template>
  <div v-loading="loading" class="list">
    <div class="search">
      <el-input v-model="insideretrieveName" clearable placeholder="请输入聊天对象昵称" prefix-icon="el-icon-search" @input="input" @clear="clear" />
    </div>
    <empty-default-icon
      v-if="!loading"
      text="暂无聊天对象"
      :length="list.length"
    >

      <div v-if="personList.length >= 1" style="margin-top:45px">
        <ul>
          <li
            v-for="(item, index) in list"
            :key="index"
            :class="{ liActive: index == personIndex }"
            @click="liClick(item, index)"
          >
            <el-row style="padding: 10px">
              <span class="fl">
                <img
                  :src="item.receiveWeUser.avatarMediaid"
                ></span>
              <span class="fl" style="margin-left: 10px">
                <p>{{ item.receiveWeUser.name }}</p>
              </span>
              <span v-if="item.finalChatContext" class="time">{{ dealTime(item.finalChatContext.msgtime) }}</span>
            </el-row>
          </li>
        </ul>
      </div>
    <!-- <div v-else /> -->
    </empty-default-icon>
  </div>
</template>
<script>
import EmptyDefaultIcon from '@/components/EmptyDefaultIcon';
import { dealTime } from '@/utils';
export default {
  components: { EmptyDefaultIcon },
  props: {
    personList: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      defluat: false
    }
  },

  data() {
    return {
      loadings: true,
      personIndex: -1,
      // 员工检索姓名
      insideretrieveName: '',
      // 聊天对象列表
      list: []
    };
  },
  watch: {
    personList(newval) {
      // 在personlist更新时赋值给list
      this.list = newval;
      if (this.insideretrieveName) {
        this.list = this.personList.filter(item => {
          return item.receiveWeUser.name.includes(this.insideretrieveName);
        });
      }
    },
    insideretrieveName(val) {
      sessionStorage.setItem('insideList', val);
      this.list = this.personList.filter(item => {
        return item.receiveWeUser.name.includes(val);
      });
    }
  },
  created() {
    if (sessionStorage.getItem('insideList') !== null) {
      this.insideretrieveName = sessionStorage.getItem('insideList');
    }
  },
  methods: {
    dealTime(time) {
      return dealTime(time);
    },
    // 输入框值改变时
    input(value) {
      // 当输入框值变为空的时候
      if (!value) {
        this.list = this.personList;
      }
    },
    // 清除输入框
    clear() {
      sessionStorage.removeItem('insideList');
      this.list = this.personList;
    },
    liClick(e, index) {
      this.personIndex = index;
      this.$emit('chatFn', e);
    }
  }
};
</script>
<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
}
.time {
  float: right;
  font-size: 14px;
  height: 19px;
  width: 39px;
  margin-top: 10px;
  color: #B8BCC5;
}
.fl {
  float: left;
}
.list {
  overflow-y: auto;
  height: 100%;
  ::-webkit-scrollbar {
    display: none;
  }

  /deep/ .el-loading-spinner {
    margin-top: 20px;
  }
  .fr {
    float: right;
  }
  .gray {
    color: #999;
  }
  .padt10 {
    padding-top: 10px;
  }
  ul li {
    overflow: hidden;
    border-bottom: 1px solid #efefef;
    cursor: pointer;
    p {
      white-space: nowrap;
      overflow: hidden;
      line-height: 40px;
      text-overflow: ellipsis;
    }
    :hover {
      background: #efefef;
    }
    img {
      width: 40px;
      height: 40px;
      float: left;
    }
  }
  .liActive {
    background-color: #eeeeee;
  }
  .search {
    position: absolute;
    padding: 6px 11px;
    z-index :999;
    background-color: #F6F6F6;
    width: 100%;
  }
}

</style>
