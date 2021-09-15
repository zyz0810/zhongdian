<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="10vh"
    title="添加项目"
    class="dialogContainer"
    @open="open"
  >
    <el-form ref="firstForm" :rules="rules" :inline="true" :model="temp" label-width="120px" class="mt_20">
      <el-form-item label="项目名称" prop="items_name">
        <el-input v-model.trim="temp.items_name" placeholder="请输入项目名称" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="任务类别" prop="type">
        <el-input v-model.trim="temp.type" placeholder="请输入任务类别" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="责任科室" prop="offices">
<!--        <el-select v-model="temp.offices">-->
<!--          <el-option v-for="item in officesOption"-->
<!--                     :key="item.id"-->
<!--                     :label="item.name"-->
<!--                     :value="item.id"></el-option>-->
<!--        </el-select>-->

        <el-cascader ref="cascaderPublish"
                     v-model="temp.offices"
                     :options="officesOption"
                     :show-all-levels="false"
                     value-format="yyyy-MM-dd HH:mm:ss"
                     filterable
                     :props="props"
                     placeholder="请选择"></el-cascader>
      </el-form-item>
      <el-form-item label="分管领导" prop="leader">
        <el-select v-model="temp.leader">
          <el-option v-for="item in userOption"
                     :key="item.id"
                     :label="item.user_name"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px" class="mb_20 mr_30">
      <el-form-item label="项目期限" prop="start_time">
        <el-date-picker
          v-model="dateTime"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="完成目标" prop="target">
        <el-input type="textarea" v-model.trim="temp.target" placeholder="请输入完成目标" clearable></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model.trim="temp.remark" placeholder="请输入备注" clearable></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="createData()" :loading="paraLoading">确 定</el-button>
      <el-button @click="showViewDialog = false">取 消</el-button>
    </div>


  </myDialog>
</template>

<script>

  import {addProject, departmentList, userList} from '@/api/project'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
  export default {
    name: 'parameterView',
    directives: { waves },
    components: {
      draggable,
      Pagination,
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
        props: {
          expandTrigger: "hover",
          value: "id",
          label: "department_name",
          children: "child",
          disabled: false,
        },
        paraLoading:false,
        temp: {
          items_name:'',
          type:'',
          offices:'',
          leader:'',
          start_time:'',
          end_time:'',
          target:'',
          remark:''
        },
        userOption:[],
        officesOption:[],
        rules: {
          items_name: [{ required: true, message: '请输入名称', trigger: 'change' }],
          type: [{ required: true, message: '请选择类别', trigger: 'change' }],
          offices: [{ required: true, message: '请选择科室', trigger: 'change' }],
          leader: [{ required: true, message: '请选择领导', trigger: 'change' }],
          start_time: [{ required: true, message: '请选择时间', trigger: 'change' }],
          target: [{ required: true, message: '请输入目标', trigger: 'change' }],
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
      dateTime: {
        get() {
          if (
            this.temp.start_time &&
            this.temp.end_time
          ) {
            return [
              this.temp.start_time,
              this.temp.end_time,
            ];
          } else {
            return [];
          }
        },
        set(v) {
          if (v) {
            this.temp.start_time = v[0];
            this.temp.end_time = v[1];
          } else {
            this.temp.start_time = "";
            this.temp.end_time = "";
          }
        },
      },
    },
    methods: {
      categoryChange(val){
        this.temp.offices = val[0];
      },
      getOffices(){
        departmentList().then(res => {
          this.officesOption = this.getTreeData(res.data);
        });
      },
      getTreeData (data) {
        if (data != "" || data != null) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].child.length < 1) {
              // children若为空数组，则将children设为undefined
              // if (data[i].grade == 3) {
              //   data[i].childrens = undefined;
              // }
              data[i].child = undefined;
            } else {
              // children若不为空数组，则继续 递归调用 本方法
              this.getTreeData(data[i].child);
            }
          }
          return data;
        }
      },
      getUser(){
        userList().then(res => {
          this.userOption = res.data.data
        });
      },
      open(){
        this.$nextTick(function() {
          this.getOffices();
          this.getUser();
        })
      },
      close(){},

      createData() {
        // firstForm
        this.$refs['firstForm'].validate((valid) => {
          if (valid) {
            this.$refs['dataForm'].validate((valid) => {
              if (valid) {
                this.paraLoading = true
                let temp = JSON.parse(JSON.stringify(this.temp));
                temp.offices = temp.offices[0];
                addProject(temp).then((res) => {
                  setTimeout(() => {
                    this.paraLoading = false
                  }, 1000)
                  if (res.code ==1) {
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
          }
        })
      },


    }
  }
</script>
