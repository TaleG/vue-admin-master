<template>
  <section>
    <!--工具条-->
    <el-form ref="serachForm" :inline="true" :model="searchMap" class="demo-form-inline">
      <!-- 重制要看el-form-item组件元素的prop上是否指定了字段名，指定了才会重置生效。 -->
      <el-form-item prop="groupName">
        <el-input v-model="searchMap.groupName" placeholder="用户组名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="GroupDataList">查询</el-button>
        <el-button type="primary" @click="handleAdd">添加</el-button>
        <el-button @click="resetForm('serachForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="GroupList" style="width: 100%;">
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column type="index" width="40" label="ID"></el-table-column>
      <el-table-column prop="groupName" label="组名" width="120" sortable></el-table-column>
      <el-table-column prop="groupDesc" label="描述" sortable></el-table-column>
      <el-table-column prop="userList" label="用户列表" sortable></el-table-column>

      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row.id)" type="primary" icon="el-icon-edit"></el-button>
          <el-button @click="handleDelete(scope.row.id)" type="danger" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

	<!-- 添加和修改 -->
    <el-dialog title="修改" :visible.sync="dialogFormVisible">
      <el-form
        :rules="rules"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width: 400px"
        :model="pojo"
      >
        <el-form-item label="用户组名" prop="groupName">
          <el-input v-model="pojo.groupName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="groupDesc">
          <el-input type="textarea" v-model="pojo.groupDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
        <!-- 判断pojo.groupId是否为null，如果为null就执行addData,否则执行updateData -->
        <el-button
          type="primary"
          @click="pojo.id === null ? addData('pojoForm'): updateData('pojoForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import SupportApi from "@/api";
export default {
  data() {
    return {
      GroupList: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页码
      pageSize: 5,
      searchMap: {
        groupName: ""
    },
    // 请求调用的URL
      UrlApi: {
        GroupList: "/group_list",
        Groups: "/groups"
      },
      // 请求调用的方法
      MethodType: {
        Get: "get",
        Post: "post",
        Put: "put",
        Delete: "Delete"
      },

	  pojo: {
		  "id": null,
		  "groupName": '',
		  "groupDesc": ''
	  },
	  dialogFormVisible: false,
	  rules: {
		  groupName: [
			  {
                required: true, 
                message: '组名字不能为空',
                trigger: 'blur'
            	}
		  ]
	  }
    };
  },
  created() {
    this.GroupDataList();
  },
  methods: {
    // 清空formName所有表单信息
    resetForm(formName) {
      // 重制要看el-form-item组件元素的prop上是否指定了字段名，指定了才会重置生效。
      this.$refs[formName].resetFields();
    },
    handleSizeChange(val) {
      // 把获取的条数信息，然后把更新的值重新赋值到pageSize
      this.pageSize = val;
      // 赋值后刷新一下页面
      this.GroupDataList();
    },
    // 获取页码信息
    handleCurrentChange(val) {
      // 把获取的页码信息赋值到currentPage中。
      this.currentPage = val;
      // 赋值后刷新一下页面
      this.GroupDataList();
    },
    GroupDataList() {
      let pageData = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        groupName: this.searchMap.groupName
      };
      SupportApi.SupportPostData(
        this.UrlApi.GroupList,
        this.MethodType.Post,
        pageData).then(response => {
        const resp = response.data;
        if (resp.code === "200") {
		  this.GroupList = resp.data;
		  this.total = resp.total
        }else {
			return false
		}
      });
	},
	handleAdd() {
		this.dialogFormVisible = true
		this.$nextTick(() => {
			this.$refs["pojoForm"].resetFields()
		})
	},
	addData(fromName) {
		// 判断表单验证是否通过
		this.$refs[fromName].validate(valid => {
			if (valid) {
				SupportApi.SupportPostData(
            this.UrlApi.Groups,
            this.MethodType.Post,
            this.pojo).then(response => {
					const resp = response.data
					if (resp.code === "200") {
						this.dialogFormVisible = false
						this.GroupDataList()
						this.$message({
							message: resp.codemsg,
							type: "success"
						})
					}else {
						this.$message({
							message: resp.codemsg,
							type: "error"
						})
					}
				})
			}
		})
	},
	handleEdit(id) {
		this.handleAdd()
		SupportApi.SupportDataById(
        this.UrlApi.GroupList,
        this.MethodType.Get,
        id).then(response => {
			const resp = response.data
			if (resp.code === "200") {
				this.pojo = resp.data
			}else {
				this.$message({
					message: resp.codemsg,
					type: "error"
				})
			}
		})
	},
	updateData(formData) {
		this.$refs[formData].validate(valid => {
			if (valid) {
				SupportApi.SupportPutData(
            this.UrlApi.Groups,
            this.MethodType.Put,
            this.pojo).then(response => {
					const resp = response.data
					if (resp.code === "200") {
						this.dialogFormVisible = false
						this.GroupDataList()
						this.$message({
							message: resp.codemsg,
							type: "success"
						})
						this.pojo.id = null
					}else {
						this.$message({
							message: resp.codemsg,
							type: "error"
						})
					}
				})
			}else {
				return false
			}
		})
	},
	handleDelete(id) {
		this.$confirm("确认删除这条记录吗？", "提示", {
			confirmButtonText: "确认",
            cancelButtonText: "取消"
		}).then(() => {
			SupportApi.SupportDataById(
            this.UrlApi.Groups,
            this.MethodType.Delete,
            id).then(response => {
			const resp = response.data
			if (resp.code === "200") {
				this.GroupDataList()
				this.$message({
					message: resp.codemsg,
					type: "success"
				})
			}else {
				this.$message({
					message: resp.codemsg,
					type: "error"
				})
			}
		})
		})
	}
  }
};
</script>
<style scoped>
</style>