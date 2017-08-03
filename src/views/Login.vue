<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号:admin"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码:123"></el-input>
    </el-form-item>
    <div style="text-align:right;">
      <el-checkbox v-model="Flag_remember"   class="remember">记住密码</el-checkbox>
      <!-- <el-checkbox v-model="Flag_authlogin"  class="authlogin">自动登录</el-checkbox> -->
    </div>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleReset2">重置并清空缓存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { requestLogin } from '../api/api';
  import axios from 'axios';
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        Flag_remember:localStorage.Flag_remember?true:false,
        // Flag_authlogin:localStorage.Flag_authlogin?true:false,
        ruleForm2: {
          account: localStorage.user!=null?localStorage.user:'',
          checkPass: localStorage.pass!=null?localStorage.pass:''
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        }
      };
    },
    methods: {
      handleReset2() {

        localStorage.clear();
        this.ruleForm2.account='',
        this.ruleForm2.checkPass='',
        this.Flag_remember=false
        // this.Flag_authlogin=false
      },
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            //NProgress.start();
            var loginParams = { username: this.ruleForm2.account, password: this.ruleForm2.checkPass };
            //  var loginParams = { phone: '15647854635', passwd: '123456' };


             requestLogin(loginParams).then(data => {//请求验证账号密码
              this.logining = false;
              //NProgress.done()
              let { msg, code, user } = data;//后端返回的code为200验证通过
              if (code !== 200) {
                this.$message({
                  message: msg,
                  type: 'error'
                });
              } else {
                 if(this.Flag_remember==true){
                  localStorage.user=this.ruleForm2.account;
                  localStorage.pass=this.ruleForm2.checkPass;
                  localStorage.Flag_remember=this.Flag_remember;
                }
                else {
                  localStorage.clear();
                }
                //  localStorage.Flag_authlogin=this.Flag_authlogin;
                sessionStorage.setItem('user', JSON.stringify(user));//利用sessionStorage存记录
                
                this.$router.push({ path: '/' });//路由跳转到/table
                
               
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>