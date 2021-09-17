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
      <el-form-item label="计划进度：" prop="name">{{projectInfo.progressLine}}</el-form-item>
    </el-form>
    <p class="baseColor border_bt f16 form_title mb_10">项目实际进度</p>
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="135px" class="mb_20">
      <el-form-item label="上传文件：" prop="url">
        <el-upload
                class="upload-demo"
                ref="upload"
                action
                :multiple="false"
                name="files"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                v-loading="loading"
                :http-request="uploadFile"
        >
          <!--:disabled="protocolRebate.protocolFileUrl != ''"  protocolFileName -->
          <el-button slot="trigger" type="primary">选取文件</el-button>
          <div slot="tip" class="el-upload__tip">
            支持文件格式：pdf格式且单个文件不能超过2M
          </div>
        </el-upload>
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
  import {itemsDetail, progressList,editProgress} from '@/api/project'
  import draggable from 'vuedraggable'
  import SingleImageTwo from "@/components/Upload/SingleImage2";
  import { uploadImg } from "@/api/upload";
  export default {
    name: 'speedView',
    components: {
      draggable,
      SingleImageTwo,
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
        loading:false,
        fileList:[],
        projectTimeOption:[],
        paraLoading:false,
        temp: {
          id:'',
          status:1,	//1、正常 2 超前 3延迟
          progress_info:'',
          url:''
        },
        projectInfo:{},
        rules: {
          id: [{ required: true, message: '请选择项目', trigger: 'change' }],
          url: [{ required: true, message: '请选择文件', trigger: 'change' }],
          status: [{ required: true, message: '请选择完成情况', trigger: 'change' }],
          progress_info: [{ required: true, message: '请输入说明', trigger: 'change' }],
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
      // 图片上传
      uploadFile(e) {
        const file = e.file;
        // if (file.type != "application/pdf") {
        //   this.$message({ message: "附件仅支持PDF格式", type: "warning" });
        //   this.fileList = [];
        //   return;
        // }
        // if (!(file.size / 1024 / 1024 / 2 <= 1)) {
        //   this.$message({
        //     message: "上传文件大小不能超过 2MB!",
        //     type: "warning",
        //   });
        //   this.fileList = [];
        //   return;
        // }
        this.loading = true;
        uploadImg(file)
                .then((res) => {
                    // this.fileList = [{ url: res.images, name: file.name }];
                  this.fileList.push({ url: res.images, name: file.name });
                  console.log(this.fileList)
                  this.temp.url = this.fileList.map(item=>{ return item.url}).join(',')
                    this.loading = false;
                    this.$message({ message:res.message, type: "success" });
                })
                .catch((e) => {
                  this.loading = false;
                  this.$message({ message: "上传附件失败", type: "warning" });
                });
      },
      handlePreview(file) {
        console.log(file);
      },
      // 文件删除
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.fileList = fileList
        this.temp.url = this.fileList.map(item=>{ return item.url}).join(',')
        // this.temp.url = "";
      },
      getProjectTime(){
        progressList({items_id:this.paraData.id}).then(res => {
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
          this.$refs.dataForm.clearValidate();
        })
      },
      close(){
        this.loading=false;
        this.fileList=[];
        this.projectTimeOption=[];
        this.paraLoading=false;
        this.temp= {
          id:'',
          status:1,	//1、正常 2 超前 3延迟
          progress_info:'',
          url:''
        };
        this.projectInfo={};
        this.$refs.dataForm.clearValidate();
      },
      onsubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            this.temp.url = this.fileList.map(item=>{ return item.url}).join(',')
            editProgress(this.temp).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.code == 1) {
                // this.list.unshift(res.data);
               this.showViewDialog = false;
                // debugger
                this.$emit('updateList');
                this.$message({
                  message: res.message,
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
