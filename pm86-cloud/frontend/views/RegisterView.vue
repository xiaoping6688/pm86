<template lang="pug">
.login-wrap
  .ms-title PM86
  .ms-login
    el-form.demo-ruleForm(:model='ruleForm',
                          :rules='rules',
                          ref='ruleForm',
                          label-width='0px')
      el-form-item(prop='email',
                   label='',
                   :rules="[\
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },\
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }\
      ]")
        el-input(v-model='ruleForm.email' placeholder='email')
      el-form-item(label='', prop='password')
        el-input(type='password',
                 placeholder='password',
                 v-model='ruleForm.password',
                 auto-complete='off')
      el-form-item(label='', prop='checkPass')
        el-input(type='password',
                 placeholder='password',
                 v-model='ruleForm.checkPass',
                 auto-complete='off')
      el-form-item
        el-button(type='primary', @click="submitForm('ruleForm')") 注册
        el-button(@click="resetForm('ruleForm')") 重置
    router-link(to='/').help 已账号 去登陆
</template>

<script>
import * as api from '../store/api'
export default {
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
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
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
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.$store.dispatch("USER_REGISTER", {
            form: _this.ruleForm,
            msg: _this.$message,
            callback: (result) => {
              _this.$message.success("注册成功")
              _this.$router.push('/login')
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted () {
  }
}
</script>

<style lang="stylus" scoped>
#vheader, #vsider
  display none

.login-wrap{
  position: relative;
  width:100%;
  height:100%;
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
  height:230px;
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
}
</style>
