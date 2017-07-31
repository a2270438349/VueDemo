<template>
  <div id='launchVote'>
    <el-form ref="form"  :model="form" label-width="80px" style="width:50%" ></br>
      <el-form-item label="投票名称" >
        <el-input type="text" style="width:100%" v-model="LVForm.voteName" auto-complete="off" placeholder="请输入投票名称"></el-input>
      </el-form-item>
      <el-form-item label="截止时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="LVForm.deadline1" style="width:100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker type="fixed-time" placeholder="选择时间" v-model="LVForm.deadline2" style="width: 100%;"></el-time-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="投票用户">
			  <el-input type="text" placeholder="请输入楼宇编号" v-model="LVForm.rightsNum"></el-input>
			</el-form-item>
      <!--投票设置框-->
      <el-form-item v-for="i in questions" :key="i">
      <el-card class="box-card" style="width:100%" body-style  >
          <div slot="header" class="clearfix">
            <span style="line-height: 36px;">投票项{{i}}</span>
            <el-button style="float: right;" type="primary" @click="handleFold">{{String_handleFold}}</el-button>
          </div>
          <el-form-item  v-show="willshow" >
            <a>标题：</a>
            <el-input type="text" style="width:100%" v-model="LVForm.vote.title" auto-complete="off" placeholder="投票标题"></el-input>
            <el-radio class="radio" v-model="LVForm.vote.radio" label="单选">单选</el-radio>
            <el-radio class="radio" v-model="LVForm.vote.radio" label="多选">多选</el-radio>
          </el-form-item>
          <el-form-item v-for="o in LVForm.vote.num" :key="o" class="text item"  v-show="willshow" >{{'选项'+o+'：'}}
            <el-input  type="textarea"  style="width:100%" v-model="LVForm.vote.item[o]" auto-complete="off" placeholder="选项内容"></el-input>
            <!-- <el-button type="primary" style="float:right;">上传图片</el-button> -->
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/" 
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              name="this.LVForm.num">
              <el-button size="small" >上传图片</el-button>
              <a slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</a> 
            </el-upload>
            <a href=JavaScript:void(0) v-if="o==LVForm.vote.num" @click="handleDelete" style="float:right">删除选项</a>
          </el-form-item>
          <el-form-item>
            <el-button style="width:100%" @click="handleAdd" v-show="willshow" type="primary">添加选项</el-button>
          </el-form-item>
      </el-card>
      </el-form-item>
      <el-form-item>
        <el-button type=""  style='width:49%'  @click='handleAddQuestions'>添加投票项</el-button>
        <el-button type=""  style="width:49%"  @click='handleDeleteQuestions'>删除投票项</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style='width:100%' @click='handleLaunchVote'>发布</el-button>
      </el-form-item>
    <!---->
    </el-form>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        questions:1,//可以用来定义投票问题的数目
        willshow:true,
        String_handleFold:'收起',
        LVForm:{
          voteName:'',//投票名称
          deadline1:'',
          deadline2:'',
          rightsNum:'',//投票用户是哪个楼宇的
          vote:{
            title:'',//投票标题
            radio:'单选',
            num:2,//选项的总数
            item:[]//每个投票选项的值
          }
        },
        fileList: []
      }
    },
    methods:{
      handleFold:function(){  
        if(this.willshow==false){
          this.willshow=true;
          this.String_handleFold='收起';
        }
        else{
          this.willshow=false;
          this.String_handleFold='打开';
        }
      },
      handleDelete:function(){
        if(this.LVForm.vote.num<=1){
          this.$message('请确保至少有一项选项');
          
        }
        else this.LVForm.vote.num-=1;
      },
      handleAdd:function(){
        this.LVForm.vote.num+=1;
      },
      handleRemove:function(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview:function(file) {
        console.log(file);
      },
      handleAddQuestions:function(){
        this.questions+=1;
      },
      handleDeleteQuestions:function(){
        if(this.questions<=1)
          this.$message('至少应有一个投票项');
        else
          this.questions-=1;
      },
      handleLaunchVote:function(){
        
      }
    }
}
</script>

<style>
  .text {
    font-size: 14px;
  }
  .item {
    padding: 18px 0;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  .clearfix:after {
      clear: both
  }

  .box-card {
    width: 480px;
  }
  .show{
    display:none;
  }  
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

