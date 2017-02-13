<template lang="pug">
#create-view

  el-card.box-card
    el-form.demo-ruleForm(:model='ruleForm', :rules='rules', ref='ruleForm', label-width='100px')
      el-form-item(label='名称', prop='bucket_name')
        el-input(v-model='ruleForm.bucket_name')
      el-form-item(label='描述', prop='bucket_description')
        el-input(v-model='ruleForm.bucket_description')
      el-form-item
        el-button(type='primary', @click="submitForm('ruleForm')") 创建
        el-button(@click="resetForm('ruleForm')") 重置
</template>

<script>

export default {
  name: 'create-view',
  data() {

    var validateAll = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入信息'));
      }
      callback();
    };
    return {
      ruleForm: {
        bucket_description: '',
        checkPass: '',
        bucket_name: ''
      },
      rules: {
        bucket_description: [
          { validator: validateAll, trigger: 'blur' }
        ],
        bucket_name: [
          { validator: validateAll, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.$store.dispatch("ADD_BUCKET", {
            form: _this.ruleForm,
            callback: (result) => {
              if (result.status === 0) {_this.$message("创建成功")}
              else {_this.$message("创建失败")}
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
  mounted () {
  }
}
</script>

<style lang="stylus">
#create-view
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
