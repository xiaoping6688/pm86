<template lang="pug">
#login-view
  el-card.box-card
    el-form.demo-ruleForm(:model='ruleForm', :rules='rules', ref='ruleForm', label-width='100px')
      el-form-item(prop='email', label='邮箱', :rules="[\
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },\
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }\
      ]")
        el-input(v-model='ruleForm.email')
      el-form-item(label='密码', prop='password')
        el-input(type='password', v-model='ruleForm.password', auto-complete='off')
      el-form-item(label='确认密码', prop='checkPass')
        el-input(type='password', v-model='ruleForm.checkPass', auto-complete='off')
      el-form-item
        el-button(type='primary', @click="submitForm('ruleForm')") 注册
        el-button(@click="resetForm('ruleForm')") 重置

    router-link(to='/').help 已账号 去登陆
</template>

<script>

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
            callback: (result) => {
              if (result.status === 0) {_this.$message("注册成功")}
              else {_this.$message("注册失败")}
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

<style lang="stylus">
#login-view
  background-color transparent
  box-sizing border-box
  width 100%
  height 100%
  text-align center
  
  .box-card
    padding 200px 0
  
  form
    background-color transparent
    position relative
    width 50%
    margin auto
    text-align center
        
</style>