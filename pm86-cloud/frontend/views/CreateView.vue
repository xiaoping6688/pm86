<template lang="pug">
#create-view.view
    el-form.create-wrap(:model='ruleForm', :rules='rules', ref='ruleForm', label-width='100px')
      el-form-item(prop='bucket_name')
        el-input(v-model='ruleForm.bucket_name', placeholder='Name')
      el-form-item(prop='bucket_description')
        el-input(v-model='ruleForm.bucket_description', placeholder='Description')
      .create-btn
        el-button(type='primary', @click="submitForm('ruleForm')") Create
        el-button(@click="resetForm('ruleForm')") Reset

</template>

<script>

export default {
  name: 'create-view',
  data() {

    var validateAll = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('please input'));
      }
      callback();
    };
    return {
      ruleForm: {
        bucket_description: '',
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
              _this.$message("创建成功");
              _this.$router.push('/buckets');
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

  .create-wrap{
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

  .el-form-item__content {
    margin-left: 0 !important;
  }

  .create-btn{
    text-align: center;
  }

</style>
