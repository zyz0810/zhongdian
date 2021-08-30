<template>
  <div class="app-container">
    <div class="p20 bg_white">
      <el-form :inline="true"
               :model="listQuery"
               class="">
        <el-form-item label="项目"
                      prop="brandId">
          <el-select v-model.trim="listQuery.brandId"
                     filterable
                     clearable
                     placeholder="请选择项目">
            <el-option v-for="item in projectOption"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="责任科室"
                      prop="brandId">
          <el-select v-model.trim="listQuery.brandId"
                     filterable
                     clearable
                     placeholder="请选择责任科室">
            <el-option v-for="item in projectOption"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-waves
                     class="filter-item"
                     type="primary"
                     icon="el-icon-search"
                     @click="">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="mb_10">
        <el-checkbox-group v-model="checkList" class="fl" style="line-height: 32px;">
          <el-checkbox :label="0">进度按时提交</el-checkbox>
          <el-checkbox :label="1">进度未提交</el-checkbox>
          <el-checkbox :label="2">时间未到</el-checkbox>
        </el-checkbox-group>
<!--        <el-button type="primary" @click="handleView">添加项目</el-button>-->
        <el-form :inline="true" :model="listQuery" :label="280" class="fr">
          <el-form-item label="">
            <el-input v-model="listQuery.productSn" placeholder="" @change="handleFilter" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button class="btn_blue02" type="primary" @click="handleFilter">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight" border :header-cell-style="{background:'rgb(244,244,252)',}"
                element-loading-text="拼命加载中" fit ref="tableList" @row-click="clickRow" @selection-change="handleSelectionChange">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column label="重点工作项目" align="center" prop="items_name"></el-table-column>
        <el-table-column label="责任科室" align="center" prop="offices_name"></el-table-column>
        <el-table-column label="计划进度" align="center" prop="progressLine"></el-table-column>
        <el-table-column label="总体进度提交情况" align="center" prop="name">
          <template slot-scope="scope">
<!--         0：无，1：正常（蓝色），2：超前（绿色），3：延迟（红色）   -->

            <span v-for="item in scope.row.progresslist" :key="item.id" :class="['inlineBlock', 'step_tag', {'bg_gray':item.status==0,'bg_blue':item.status==1,'bg_green':item.status==2,'bg_red':item.status==3}]">{{item.month}}</span>
<!--            <span class="inlineBlock step_tag bg_blue">2</span>-->
<!--            <span class="inlineBlock step_tag bg_green">3</span>-->
<!--            <span class="inlineBlock step_tag bg_blue">4</span>-->
<!--            <span class="inlineBlock step_tag bg_blue">5</span>-->
<!--            <span class="inlineBlock step_tag bg_blue">6</span>-->
<!--            <span class="inlineBlock step_tag bg_blue">7</span>-->
<!--            <span class="inlineBlock step_tag bg_red">8</span>-->
<!--            <span class="inlineBlock step_tag bg_gray">9</span>-->
<!--            <span class="inlineBlock step_tag bg_gray">10</span>-->
<!--            <span class="inlineBlock step_tag bg_gray">11</span>-->
<!--            <span class="inlineBlock step_tag bg_gray">12</span>-->
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="name" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="handleView(scope.row)">更新进度</el-button>
          </template>
        </el-table-column>

      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                  @pagination="getList" class="text-right"/>
    </div>

    <paraView :showDialog.sync="showViewDialog" :paraData="paraData"></paraView>

  </div>
</template>

<script>
  import {itemProgressList} from '@/api/project'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import paraView from "./components/view";
  export default {
    name: 'parameterList',
    directives: {waves},
    components: {
      draggable,
      Pagination,
      paraView
    },
    data() {
      return {
        checkList:[0],
        projectOption:[{
          id:1,
          name:'项目1',
        },{
          id:2,
          name:'项目2',
        }],
        showViewDialog:false,
        paraData:{
          id:''
        },
        updateBtn: true,
        enableBtn: true,
        disableBtn: true,
        total: 16,
        parameterValueList: [{name: ''}],
        list: [],
        listLoading: false,
        listQuery: {
          name: '',
          status: undefined,
          page: 1,
          limit: 10
        },
        tableHeight:'100'
      }
    },
    filters: {
      filtersStatus: function (value) {
        let StatusArr = {0: '未审核', 1: '已审核'}
        return StatusArr[value]
      },
      filtersType: function (value) {
        let StatusArr = {0: '店外经营', 1: '违规撑伞', 2: '流动摊点', 3: '沿街晾晒'}
        return StatusArr[value]
      },
      filtersSource: function (value) {
        let StatusArr = {0: '其它', 1: '滨康二区',}
        return StatusArr[value]
      },
    },
    computed: {
      ...mapState({
        roles: state => state.user.roles,
      }),
    },
    mounted() {
      this.$nextTick(function() {
        // this.$refs.filter-container.offsetHeight
        let height = window.innerHeight - this.$refs.tableList.$el.offsetTop - 190;
        if(height>100){
          this.tableHeight = height
        }else{
          this.tableHeight = 100
        }
        // 监听窗口大小变化
        const self = this;
        window.onresize = function() {
          let height = window.innerHeight - self.$refs.tableList.$el.offsetTop - 190;
          if(height>100){
            self.tableHeight = height
          }else{
            self.tableHeight = 100
          }
        };
      });
      this.getList();
    },
    methods: {

      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      getList() {
        itemProgressList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
      },

      resetList() {
        this.listQuery = {
          name: '',
          status: undefined,
          page: 1,
          limit: 10
        }
        this.getList();
      },
      clickRow(row){
        this.$refs.tableList.toggleRowSelection(row)
      },
      handleSelectionChange(val) {
        console.log(val)
        this.rowInfo = val;
        if (val.length == 1) {
          this.updateBtn = false
          this.deleteBtn = false
          if(val[0].status == 0){
            this.enableBtn = false
            this.disableBtn = true
          }else{
            this.enableBtn = true
            this.disableBtn = false
          }
        } else {
          this.updateBtn = true
          this.deleteBtn = true
          this.enableBtn = true
          this.disableBtn = true
        }
      },

      handleView(row){
        this.showViewDialog = true
        this.paraData = {
          id:row.id
        }
      },


    }
  }
</script>

