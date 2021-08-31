<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="80%"
    @close="close"
    top="10vh"
    title="评价结果"
    class="dialogContainer"
    :append-to-body="true"
    @open="open"
  >
    <p class="baseColor border_bt f16 form_title mb_10">进度完成情况</p>
    <el-form :inline="true" :model="progressInfo" label-width="110px">
      <el-form-item label="考核周期：" prop="name">{{progressInfo.month}}</el-form-item>
      <el-form-item label="完成情况说明：" prop="name">{{progressInfo.status | filtersStatus}}</el-form-item>
    </el-form>
    <el-form :model="progressInfo" label-width="110px">
      <el-form-item label="相关材料：" prop="name">
        <a href="item" class="text-center w_100_px inlineBlock mr_10" v-for="(item,index) in progressInfo.images" :key="index">
          <i class="el-icon-document f50 baseColor"></i>
          <p>文件{{index+1}}</p>
        </a>
        <span v-if="progressInfo.images.length == 0">无</span>
      </el-form-item>
    </el-form>
    <p class="baseColor border_bt f16 form_title mb_10">项目评价</p>
    <el-form ref="dataForm" :model="temp" :rules="rules" label-width="135px" class="mb_20">
      <el-form-item label="完成进度评价：" prop="status">
<!--        1、优秀 2、良好 、3合格 4、差-->
        <el-radio-group v-model="temp.status">
          <el-radio :label="1">优秀</el-radio>
          <el-radio :label="2">良好</el-radio>
          <el-radio :label="3">合格</el-radio>
          <el-radio :label="4">差</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="评分：" prop="grade">
        <el-input v-model.trim="temp.grade" placeholder="" clearable class="w_200"></el-input> 分
      </el-form-item>
      <el-form-item label="说明：" prop="remark">
        <el-input type="textarea" v-model.trim="temp.remark" placeholder="" clearable></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showViewDialog = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit" :loading="paraLoading">保 存</el-button>
    </div>

  </myDialog>
</template>

<script>
  import draggable from 'vuedraggable'
  import {itemsDetail,editCheck } from "@/api/project";
  import ScrollPane from "@/layout/components/TagsView/ScrollPane";
  export default {
    name: 'parameterView',
    components: {
      ScrollPane,
      draggable,
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
          id: "",
          progress_id:""
        }
      }
    },
    data() {
      return {
        paraLoading:false,
        progressInfo:{
          month:"",
          status:"",
          images:[],
        },
        temp: {
          progress_id:'',
          status:1,
          grade:'',
          remark:'',
        },
        rules: {
          status: [{ required: true, message: '请选择评价', trigger: 'change' }],
          grade: [{ required: true, message: '请输入分数', trigger: 'change' }],
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
        // 0、无  1、正常 2 超前 3延迟
        let StatusArr = {0:'无', 1:'正常',2:'超前', 3:'延迟'}
        return StatusArr[value]
      }
    },
    methods: {
      getView(){
        itemsDetail({id:this.paraData.id,progress_id:this.paraData.progress_id}).then(res => {
          this.progressInfo = res.data.progressList
        });
      },
      open(){
        this.$nextTick(function() {
          this.$refs.dataForm.clearValidate();
          this.getView();
        })
      },
      close(){
        this.progressInfo={
          month:"",
          status:"",
          images:[],
        };
        this.temp= {
          progress_id:'',
          status:1,
          grade:'',
          remark:'',
        }
        this.$refs.dataForm.clearValidate();
      },
      onSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.progress_id = this.paraData.progress_id;
            this.paraLoading = true;
            editCheck(this.temp).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.code == 1) {
                this.showViewDialog = false;
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
