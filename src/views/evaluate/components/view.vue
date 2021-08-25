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
      <el-form-item label="项目名称：" prop="name">打算一提</el-form-item>
      <el-form-item label="任务类别：" prop="name">局重点项目</el-form-item>
      <el-form-item label="责任科室：" prop="name">受理中心</el-form-item>
      <el-form-item label="分管领导：" prop="name">郑思明</el-form-item>
    </el-form>
    <el-form ref="dataForm" :model="temp" label-width="105px">
      <el-form-item label="项目期限：" prop="name">2021年1月-2021年12月</el-form-item>
      <el-form-item label="计划进度：" prop="name">受理中心受理中心受理中心受理中心受理中心受理中心受理中心受理中心受理中心</el-form-item>
    </el-form>
    <p class="baseColor border_bt f16 form_title mb_10">项目进度</p>
    <el-table v-loading="listLoading" :data="list" :height="tableHeight" border :header-cell-style="{background:'rgb(244,244,252)',}"
              element-loading-text="拼命加载中" fit ref="tableList" class="dialog_table">
      <el-table-column label="月份" align="center" prop="num"></el-table-column>
      <el-table-column label="计划完成情况" align="center" prop="com"></el-table-column>
      <el-table-column label="相关资料" align="center" prop="data">
        <template slot-scope="scope">
          <el-link type="primary" href="#">{{scope.row.data}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="评价结果" align="center" prop="result" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.result == 1">完成情况良好<i class="el-icon-edit-outline f20 baseColor bold ml_10" @click="handleEvaluate(scope.row)"></i></span>
          <span v-if="scope.row.result != 1"><el-button type="text" @click="handleEvaluate(scope.row)">请评价</el-button></span>
        </template>
      </el-table-column>

    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showViewDialog = false">取 消</el-button>
      <el-button type="primary" @click="" :loading="paraLoading">保 存</el-button>
    </div>
    <evaluateView :showDialog.sync="showEvaluateDialog" :paraData="evaluateData"></evaluateView>
  </myDialog>
</template>

<script>
  import map from '@/components/Map/map' // 引入刚才的map.js 注意路径
  import evaluateView from "./evaluate";
  import {paraValueList,paraValueSave,paraValueUpdate,paraValueDelete} from '@/api/parameter'
  import draggable from 'vuedraggable'
  import Pagination from "@/components/Pagination/index";
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
        showEvaluateDialog:false,
        evaluateData:{},
        listLoading:false,
        list: [{
          num:'一月',
          com:'文一路300号',
          data:1,
          result:1
        },{
          num:'二月',
          com:'文一路300号',
          data:1,
          result:1
        },{
          num:'三月',
          com:'文一路300号',
          data:1,
          result:1
        },{
          num:'四月',
          com:'文一路300号',
          data:1,
          result:1
        },{
          num:'五月',
          com:'文一路300号',
          data:1,
          result:1
        },{
          num:'六月',
          com:'文一路300号',
          data:1,
          result:2
        }],
        showAdoptDialog:false,
        showAbandonedDialog:false,
        map: '', // 对象
        zoom: 12, // 地图的初始化级别，及放大比例
        centerLatitude:'30.20835',//中心纬度
        centerLongitude:'120.21194',//中心经度
        paraLoading:false,
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
      handleEvaluate(){
        this.showEvaluateDialog = true
        this.evaluateData = {
          // id:row.id
        }
      },
      onLoad() {
        let T = window.T;
        let map = new T.Map('mapDiv');
        map.centerAndZoom(new T.LngLat(this.centerLongitude, this.centerLatitude), this.zoom); // 设置显示地图的中心点和级别
        // 普通标注
        document.getElementsByClassName("tdt-control-copyright tdt-control")[0].style.display = 'none';
        //创建标注工具对象
        let markerTool = new T.MarkTool(map, {follow: true});

        function endeditMarker() {
          let markers = markerTool.getMarkers();
          for (let i = 0; i < markers.length; i++) {
            markers[i].disableDragging();
          }
        }
        var cp = new T.CoordinatePickup(map, {callback: this.getLngLat})
        cp.addEvent();
        function editMarker() {
          let markers = markerTool.getMarkers()
          console.log(markers)
          for (let i = 0; i < markers.length; i++) {
            markers[i].enableDragging();
          }

        }
        // endeditMarker();
        editMarker();
        markerTool.open();

      },
      getLngLat(lnglat) {
        this.temp.address  = lnglat.lng.toFixed(6) + "," + lnglat.lat.toFixed(6);
        this.temp.log = lnglat.lng.toFixed(6)
        this.temp.lat = lnglat.lat.toFixed(6)
      },
      hasImgSrc(val) {
        this.temp.imgUrl = val;
      },
      open(){
        this.$nextTick(function() {
          this.onLoad();
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
