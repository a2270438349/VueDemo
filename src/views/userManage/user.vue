<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUser">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getVotesNone">重置查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;">
			
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="id" label="用户id" width="120" sortable>
			</el-table-column>
			<el-table-column prop="name" label="用户名" width="120" sortable>
			</el-table-column>
			<el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable>
			</el-table-column>
			<el-table-column prop="phone" label="电话" width="100" sortable>
			</el-table-column>
			<el-table-column prop="email" label="电子邮件" width="120" sortable>
			</el-table-column>
			<el-table-column prop="photo" label="头像" width="120" sortable>
			</el-table-column>
			<el-table-column prop="addr" label="地址" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="regdate" label="注册日期" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="available" label="可用性" min-width="120" :formatter="formatAvailable" sortable>
			</el-table-column>
			</el-table>
						
		</el-col>
		</template>

	</section>
</template>
<script>
	import { getUserList } from '../../api/api';
	//import NProgress from 'nprogress'
	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				loading: false,
				users: [
				]
			}
		},
		methods: {
			getVotesNone:function(){
			this.filters.name='';
			this.getUser();
			},
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			formatAvailable: function (row, column) {
				return row.available == 1 ? '是' : row.available == 0 ? '否' : '未知';
			},
			//获取用户列表
			getUser: function () {
				let para = {
					name: this.filters.name
				};
				this.loading = true;
				//NProgress.start();
				getUserList(para).then((res) => {
					this.users = res.data.users;
					this.loading = false;
					//NProgress.done();
				});
			}
		},
		mounted() {
			this.getUser();
		}
	};

</script>

<style scoped>

</style>