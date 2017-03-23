<template lang="pug">
.login-wrap
  .ms-title PM86
  .ms-login
    el-form.demo-ruleForm(:model='ruleForm',
                          :rules='rules',
                          ref='ruleForm',
                          label-width='0px')
      el-form-item(prop='email')
        el-input(v-model='ruleForm.email', placeholder='email')
      el-form-item(prop='password', auto-complete='on')
        el-input(type='password',
                 placeholder='password',
                 v-model='ruleForm.password',
                 @keyup.enter.native="submitForm('ruleForm')")
      .login-btn
        el-button(type='primary', @click="submitForm('ruleForm')") 登录
      router-link.help(to='/register') 还没有账号 去注册
</template>

<script>
import * as api from '../store/api'
export default {
  name: 'login-view',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    return {
      ruleForm: {
        password: '',
        checkPass: '',
        email: ''
      },
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.$store.dispatch("USER_LOGIN", {
            form: _this.ruleForm,
            msg: _this.$message,
            callback: (result) => {
              localStorage.setItem('email', result.data.data.email);
              _this.$message.success("登陆成功")
              _this.$router.push('/buckets')
            }
          })
        } else {
          console.log('error submit!!')
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  },
  beforeMount () {
  }
}
</script>

<style lang="stylus" scoped>
#vheader, #vsider
  display none

.login-wrap{
  position: relative;
  width:100%;
  height:calc(100% - 60px);
  background: #324157;
  z-index: 10;
  text-align: center;
}
.ms-title{
  position: absolute;
  top:50%;
  width:100%;
  margin-top: -230px;
  text-align: center;
  font-size:30px;
  color: #fff;
}
.ms-login{
  position: absolute;
  left:50%;
  top:50%;
  width:300px;
  height:170px;
  margin:-150px 0 0 -190px;
  padding:40px;
  border-radius: 5px;
  background: #fff;
}
.login-btn{
  text-align: center;
}
.login-btn button{
  width:100%;
  height:36px;
  margin-bottom: 20px;
}
</style>
