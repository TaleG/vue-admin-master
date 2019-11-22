<template>
  <section>
    <!--工具条-->
    <el-form ref="serachForm" :inline="true" :model="searchMap" class="demo-form-inline">
      <!-- 重制要看el-form-item组件元素的prop上是否指定了字段名，指定了才会重置生效。 -->
      <el-form-item prop="username">
        <el-input v-model="searchMap.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="userListData">查询</el-button>
        <el-button type="primary" @click="handleAdd">添加</el-button>
        <el-button @click="resetForm('serachForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="usersList" border style="width: 100%;">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column type="index" width="40" label="ID"></el-table-column>
      <el-table-column prop="name" label="名字" width="100" sortable></el-table-column>
      <el-table-column prop="username" label="用户名" width="100" sortable></el-table-column>
      <el-table-column prop="userEmail" label="邮箱" width="200" sortable></el-table-column>
      <el-table-column prop="userPhone" label="电话" width="110" sortable></el-table-column>
      <el-table-column prop="userDesc" label="描述" sortable></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row.id)" type="primary" icon="el-icon-edit"></el-button>
          <el-button @click="handleDelete(scope.row.id)" type="danger" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
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
        <el-form-item label="姓名" prop="name">
          <el-input v-model="pojo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="pojo.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="pojo.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" prop="userRole">
          <el-select v-model="pojo.userRole" placeholder="选择权限">
            <el-option label="管理员" value="admin"></el-option>
            <el-option label="普通用户" value="user"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="pojo.userEmail" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="userPhone">
          <el-input v-model="pojo.userPhone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="userDesc">
          <el-input type="textarea" v-model="pojo.userDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="updateData('pojoForm')">确 定</el-button> -->
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
      usersList: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页码
      pageSize: 5,
      searchMap: {
        username: ""
      },
      // 请求调用的URL
      UrlApi: {
        UserList: "/user_list",
        Users: "/users"
      },
      // 请求调用的方法
      MethodType: {
        Get: "get",
        Post: "post",
        Put: "put",
        Delete: "Delete"
      },
      dialogFormVisible: false, // 控制对话框
      pojo: {
        id: null,
        name: "",
        username: "",
        password: "",
        userRole: "",
        userEmail: "",
        userPhone: "",
        userDesc: ""
      },
      rules: {
        //校验规则
        name: [
          {
            required: true,
            message: "名字不能为空",
            trigger: "blur"
          }
        ],
        username: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ],
        userEmail: [
          {
            required: true,
            message: "邮箱不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.userListData();
  },
  methods: {
    // 清空formName所有表单信息
    resetForm(formName) {
      // 重制要看el-form-item组件元素的prop上是否指定了字段名，指定了才会重置生效。
      this.$refs[formName].resetFields();
    },
    // 获取条数信息
    handleSizeChange(val) {
      // 把获取的条数信息，然后把更新的值重新赋值到pageSize
      this.pageSize = val;
      // 赋值后刷新一下页面
      this.userListData();
    },
    // 获取页码信息
    handleCurrentChange(val) {
      // 把获取的页码信息赋值到currentPage中。
      this.currentPage = val;
      // 赋值后刷新一下页面
      this.userListData();
    },
    userListData() {
      // 格式化分页后的数据
      let pageData = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        searchMap: this.searchMap.username
      };
      let urlType = "/user_list";
      let methodType = "post";

      // 把格式化的数据传给userList接口
      SupportApi.SupportPostData(
        this.UrlApi.UserList,
        this.MethodType.Post,
        pageData
      ).then(response => {
        const resp = response.data;
        // 判断返回码为200就继续向下执行。
        if (resp.code === "200") {
          // 获取返回数据赋值给usersList
          this.usersList = resp.data;
          // 获取返回值数据总数量，赋值给total
          this.total = resp.total;
        } else {
          return false;
        }
      });
    },
    addData(fromName) {
      // 验证表单是否验证通过。
      this.$refs[fromName].validate(valid => {
        // 如果通过就调用用户添加接口
        if (valid) {
          SupportApi.SupportPostData(
            this.UrlApi.Users,
            this.MethodType.Post,
            this.pojo
          ).then(response => {
            const resp = response.data;
            if (resp.code === "200") {
              this.userListData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.codemsg,
                type: "error"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 添加数据时清空表单数据。
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    // 打开修改窗口，然后把查到的数据赋值给表单
    handleEdit(id) {
      this.handleAdd();

      SupportApi.SupportDataById(
        this.UrlApi.UserList,
        this.MethodType.Get,
        id
      ).then(response => {
        const resp = response.data;
        if (resp.code === "200") {
          this.pojo = resp.data;
        } else {
          this.$message({
            message: resp.codemsg,
            type: "error"
          });
        }
      });
    },

    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          SupportApi.SupportPutData(
            this.UrlApi.Users,
            this.MethodType.Put,
            this.pojo
          ).then(response => {
            const resp = response.data;
            if (resp.code === "200") {
              // 刷新列表
              this.userListData();
              this.dialogFormVisible = false;
              // 此处为userId进行一个更新后初始化操作。不设置的话如果做一次更新在添加会不生效。
              this.pojo.id = null;
            } else {
              this.$message({
                message: resp.codemsg,
                type: "error"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    handleDelete(id) {
      this.$confirm("确认删除这条记录吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消"
      })
        .then(() => {
          // 确认
          let urlType = "/users";
          let methodType = "delete";
          SupportApi.SupportDataById(
            this.UrlApi.Users,
            this.MethodType.Delete,
            id
          ).then(response => {
            const resp = response.data;
            this.$message({
              message: resp.codemsg,
              type: resp.code === "200" ? "success" : "error"
            });
            if (resp.code === "200") {
              this.userListData();
            }
          });
        })
        .catch(() => {
          //取消
          return false;
        });
    }
  }
};
</script>
<style scoped>
</style>