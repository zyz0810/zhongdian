<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="80%"
    @close="close"
    top="10vh"
    title="项目考核评价"
    class="dialogContainer"
    @open="open"
  >
    <p class="baseColor border_bt f16 form_title mb_10">问题信息</p>
    <el-form ref="dataForm" :inline="true" :model="temp" label-width="105px">
      <el-form-item label="项目名称：" prop="name">{{projectInfo.items_name}}</el-form-item>
      <el-form-item label="任务类别：" prop="name">{{projectInfo.type_name}}</el-form-item>
      <el-form-item label="责任科室：" prop="name">{{projectInfo.offices_name}}</el-form-item>
      <el-form-item label="分管领导：" prop="name">{{projectInfo.leader_name}}</el-form-item>
    </el-form>
    <el-form ref="dataForm" :model="temp" label-width="105px">
      <el-form-item label="项目期限：" prop="name">{{projectInfo.end_time}}</el-form-item>
      <el-form-item label="计划进度：" prop="name">{{projectInfo.progressLine}}</el-form-item>
    </el-form>
    <p class="baseColor border_bt f16 form_title mb_10">项目进度</p>
    <el-table v-loading="listLoading" :data="projectInfo.progressList" :height="tableHeight" border :header-cell-style="{background:'rgb(244,244,252)',}"
              element-loading-text="拼命加载中" fit ref="tableList" class="dialog_table">
      <el-table-column label="月份" align="center" prop="month"></el-table-column>
      <el-table-column label="计划完成情况" align="center" prop="status" :formatter="formatStatus"></el-table-column>
      <el-table-column label="相关资料数量" align="center" prop="num"></el-table-column>
      <el-table-column label="评价结果" align="center" prop="result" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">--</span>
          <span v-if="scope.row.status != 0"><el-button type="text" @click="handleEvaluate(scope.row)">请评价</el-button></span>
        </template>
      </el-table-column>

    </el-table>
    <evaluateView :showDialog.sync="showEvaluateDialog" :paraData="evaluateData"></evaluateView>
  </myDialog>
</template>

<script>
  import map from '@/components/Map/map' // 引入刚才的map.js 注意路径
  import evaluateView from "./evaluate";
  import {paraValueList,paraValueSave,paraValueUpdate,paraValueDelete} from '@/api/parameter'
  import draggable from 'vuedraggable'
  import Pagination from "@/components/Pagination/index";
  import {itemsDetail} from "@/api/project";
  export default {
    name: 'parameterView',
    components: {
      draggable,
      Pagination,
      evaluateView
    },
    props: {
      showDialog: {
        required: true,
        type: Boolean,
        default: false
      },
      paraData: {
        required: true,
        type: Object,
        default: {
          option: {},
          operatorType: "view",
          id: ""
        }
      }
    },
    data() {
      return {
        tableHeight:260,
        showEvaluateDialog:false,
        evaluateData:{},
        listLoading:false,
        list: [],
        paraLoading:false,
        projectInfo:{},
        temp: {
          name:'',
          parameterId:undefined,
          deleted:0
        },
        rules: {
          name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        },
      }
    },
    computed: {
      showViewDialog: {
        get() {
          return this.showDialog;
        },
        set(value) {
          this.$emit("update:show-dialog", value);
        }
      },
    },
    filters:{
      filtersStatus: function(value) {
        let StatusArr = {0:'禁用', 1:'启用'}
        return StatusArr[value]
      }
    },
    methods: {
      // 0、无  1、正常 2 超前 3延迟
      formatStatus(row, column, cellValue, index) {
        return cellValue == 0
          ? "无"
          : cellValue == 1
            ? "正常"
            : cellValue == 2
              ? "超前"
              : cellValue == 3
                ? "延迟"
              : "";
      },
      handleEvaluate(row){

        this.showEvaluateDialog = true
        this.evaluateData = {
          id:row.items_id,
          progress_id:row.id,
        }
      },
      getView(){
        itemsDetail({id:this.paraData.id}).then(res => {
          this.projectInfo = res.data
          // this.total = res.data.total
        });
      },
      hasImgSrc(val) {
        this.temp.imgUrl = val;
      },
      open(){
        this.$nextTick(function() {
          this.getView();
        })
      },
      close(){},
      resetTemp() {
        this.temp = {
          // parameterId:undefined,
          name:'',
          parameterId:undefined,
          deleted:0
          // orders:'',
          // isSystem:1,
        }
      },



      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            this.temp.parameterId = this.paraData.id
            paraValueSave(this.temp).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.resp_code == 0) {
                this.getList();
                // this.list.unshift(res.data);
                this.showViewDialog = false;
                // debugger
                this.getList();
                this.$message({
                  message: '增加成功',
                  type: 'success'
                });
              }
            }).catch(() => {
              this.paraLoading = false;
            });
          }
        })
      },


    }
  }
</script>
