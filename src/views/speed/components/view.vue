<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="80%"
    @close="close"
    top="10vh"
    title="进度更新"
    class="dialogContainer"
    @open="open"
  >
    <p class="baseColor border_bt f16 form_title mb_10">项目信息</p>
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
    <p class="baseColor border_bt f16 form_title mb_10">项目实际进度</p>
    <el-form ref="dataForm" :model="temp" label-width="135px" class="mb_20">
      <el-form-item label="选择进度时间：" prop="name">
        <el-date-picker
          v-model="temp.name"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="进度完成情况：" prop="name">
        <el-radio-group v-model="temp.radio">
          <el-radio :label="3">正常</el-radio>
          <el-radio :label="6">超前</el-radio>
          <el-radio :label="9">延迟</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="进度完成说明：" prop="name">
        <el-input type="textarea" v-model.trim="temp.name" placeholder="" clearable></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showViewDialog = false">取 消</el-button>
      <el-button type="primary" @click="" :loading="paraLoading">提 交</el-button>
    </div>

  </myDialog>
</template>

<script>
  import map from '@/components/Map/map' // 引入刚才的map.js 注意路径
  import {paraValueList,paraValueSave,paraValueUpdate,paraValueDelete} from '@/api/parameter'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import SingleImage from "@/components/Upload/SingleImage.vue"; // waves directive


  export default {
    name: 'parameterView',
    directives: { waves },
    components: {
      draggable,
      Pagination,
      SingleImage,

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
