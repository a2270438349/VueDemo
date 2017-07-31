<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="某建筑名称下的所有投票"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getVotes">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getVotesNone">重置查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="votes" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="id" label="投票id" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="name" label="投票名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="deadline1" label="截止日期" width="120"  sortable>
			</el-table-column>
			<el-table-column prop="deadline2" label="截止钟点" width="120" sortable>
			</el-table-column>
			<el-table-column prop="attribute" label="所属组织" width="120" sortable>
			</el-table-column>
			 <el-table-column prop="vote.radio" label="单选/多选" width="120" :formatter="formatRadio" sortable> 
			 </el-table-column> 
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="投票名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="截止时间">
					<el-date-picker type="date" placeholder="截止日期" v-model="editForm.deadline1"></el-date-picker>
					<el-time-select  v-model="editForm.deadline2"  :picker-options="{start: '08:30',step: '00:15', end: '18:30' }" placeholder="截止时分"></el-time-select>
				</el-form-item>
				<el-form-item label="所属组织">
					<el-input v-model="editForm.attribute"></el-input>
				</el-form-item>
				<el-form-item label="单选/多选">
					<el-radio-group v-model="editForm.vote.radio">
						<el-radio class="radio" :label="0">单选</el-radio>
						<el-radio class="radio" :label="1">多选</el-radio>
					</el-radio-group>
				</el-form-item>
				</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="用户名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="电话" prop="phone">
					<el-input v-model="addForm.phone" ></el-input>
				</el-form-item>
				<el-form-item label="电子邮件" prop="email">
					<el-input v-model="addForm.email" ></el-input>
				</el-form-item>
				<!-- 此处头像应改为上传图片并绑定，待修改  -->
				<el-form-item label="头像" prop="photo">
					<el-input v-model="addForm.photo" ></el-input>
				</el-form-item>
				<el-form-item label="地址" prop="address">
					<el-input v-model="addForm.address" ></el-input>
				</el-form-item>
				<el-form-item label="注册日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.regdate"></el-date-picker>
				</el-form-item>
				<el-form-item label="可用性">
					<el-radio-group v-model="addForm.available">
						<el-radio class="radio" :label="1">是</el-radio>
						<el-radio class="radio" :label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
				
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getVoteListPage, getVoteList, removeVote, batchRemoveVote, editVote,addVote } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				votes: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id:0,
					name:'',
					deadline1:'',
					deadline2:'',
					attribute:'',
					vote:{
						radio:0
					}
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					id: 0,
					name: '',
					sex: -1,
					phone: 0,
					email: '',
					photo: '',
					address:'',
					regdate:'',
					available:1
				}

			}
		},
		methods: {
			//性别显示转换
			formatAvailable: function (row, column) {
				return row.available == 1 ? '是' : row.available == 0 ? '否' : '未知';
			},
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			formatRadio:function(row,column){
				return row.vote.radio==0?'单选':row.vote.radio==1?'多选':'未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getVotes();
			},
			//获取用户列表
			getVotes() {
				let para = {
					page: this.page,
					attribute: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getVoteListPage(para).then((res) => {
					this.total = res.data.total;
					this.votes = res.data.votes;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeVote(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getVotes();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.$router.push({ path: '/launchVote' });
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.deadline1 = (!para.deadline1 || para.deadline1 == '') ? '' : util.formatDate.format(new Date(para.deadline1), 'yyyy-MM-dd');
							editVote(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({//$全局引用
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getVotes();
							});
						});
					}
				});
			},
			getVotesNone:function(){
			this.filters.name='';
			this.getVotes();
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveVote(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getVotes();
					});
				}).catch(() => {

				});
			}
		},
		
		mounted() {
			this.getVotes();
		}
	}

</script>

<style scoped>

</style>