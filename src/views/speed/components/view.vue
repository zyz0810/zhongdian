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
    <el-form :inline="true" :model="temp" label-width="105px">
      <el-form-item label="项目名称：" prop="name">{{projectInfo.items_name}}</el-form-item>
      <el-form-item label="任务类别：" prop="name">{{projectInfo.type_name}}</el-form-item>
      <el-form-item label="责任科室：" prop="name">{{projectInfo.offices_name}}</el-form-item>
      <el-form-item label="分管领导：" prop="name">{{projectInfo.leader_name}}</el-form-item>
    </el-form>
    <el-form  :model="temp" label-width="105px">
      <el-form-item label="项目期限：" prop="name">{{projectInfo.end_time}}</el-form-item>
      <el-form-item label="计划进度：" prop="name">{{projectInfo.items_name}}</el-form-item>
    </el-form>
    <p class="baseColor border_bt f16 form_title mb_10">项目实际进度</p>
    <el-form ref="dataForm" :rule="rules" :model="temp" label-width="135px" class="mb_20">
      <el-form-item label="上传文件：" prop="name">
        <SingleImage></SingleImage>
      </el-form-item>
      <el-form-item label="选择进度时间：" prop="id">
        <el-select v-model.trim="temp.id"
                   filterable
                   clearable
                   placeholder="请选择项目">
          <el-option v-for="item in projectTimeOption"
                     :key="item.id"
                     :label="item.month"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="进度完成情况：" prop="status">
        <el-radio-group v-model="temp.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="2">超前</el-radio>
          <el-radio :label="3">延迟</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="进度完成说明：" prop="progress_info">
        <el-input type="textarea" v-model.trim="temp.progress_info" placeholder="" clearable></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showViewDialog = false">取 消</el-button>
      <el-button type="primary" @click="onsubmit" :loading="paraLoading">提 交</el-button>
    </div>

  </myDialog>
</template>

<script>
  import {itemsDetail, progressList} from '@/api/project'
  import draggable from 'vuedraggable'
  import SingleImage from "@/components/Upload/SingleImage.vue";

  export default {
    name: 'speedView',
    components: {
      draggable,
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
        projectTimeOption:[],
        paraLoading:false,
        temp: {
          id:'',
          status:'',	//1、正常 2 超前 3延迟
          progress_info:'',
          url:''
        },
        projectInfo:{},
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
    methods: {

      hasImgSrc(val) {
        this.temp.imgUrl = val;
      },
      getProjectTime(){
        progressList({}).then(res => {
          this.projectTimeOption = res.data
          // this.total = res.data.total
        });
      },
      getView(){
        itemsDetail({id:this.paraData.id}).then(res => {
          this.projectInfo = res.data
          // this.total = res.data.total
        });
      },
      open(){
        this.$nextTick(function() {
          this.getView();
          this.getProjectTime();
        })
      },
      close(){},
      onsubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            this.temp.parameterId = this.paraData.id
            editProgress(this.temp).then((res) => {
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
