
<template lang="pug">
.profile.view
  .profile-wrap
    .ms-profile
      el-form.demo-ruleForm(:model='ruleForm', :rules='rules', ref='ruleForm', label-width='0px')
        el-form-item(prop='old')
          el-input(v-model='ruleForm.old', placeholder='Old password')
        el-form-item(prop='new')
          el-input(v-model='ruleForm.new', placeholder='New password')
        el-form-item(prop='confirm', auto-complete='off')
          el-input(type='confirm', placeholder='Confirm new password', v-model='ruleForm.confirm', @keyup.enter.native="submitForm('ruleForm')")
        .profile-btn
          el-button(type='primary', @click="submitForm('ruleForm')") 重置密码
</template>

<script>
import * as api from '../store/api'
export default {
  data: function(){
    return {
      ruleForm: {
        old: '',
        new: '',
        confirm: '',
      },
      rules: {
        email: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      const _this = this;
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          api.post({
            url: 'account/resetPassword',
            data: _this.ruleForm
          }).then((result) => {
            console.log(result);
            _this.$message.success('success')
            localStorage.setItem('email', null);
            localStorage.setItem('user', null);
            _this.$router.push('/login')
          }).catch((err) => {
            console.log(err);
            _this.$message.error(err.toString())
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
  beforeMount () {

  }
}
</script>

<style lang="stylus" scoped>
  .profile-wrap{
    position: relative;
    text-align: left;
  }
  .ms-profile{
    position: relative;
    top: 50px;
    width:300px;
    height:230px;
    margin: auto;
    padding:40px;
    border-radius: 5px;
    background: #fff;
  }
  .profile-btn{
      text-align: center;
  }
  .profile-btn button{
      width:100%;
      height:36px;
  }
</style>
