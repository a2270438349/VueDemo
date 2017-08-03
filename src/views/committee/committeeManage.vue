<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="委员会名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="value1" placeholder="查询关键词">
						<el-option v-for="item in options" :key="item.value"  :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getCommittees">查询</el-button>
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
		<el-table :data="committees" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
            <el-table-column prop="id" label="委员会id" width="120" sortable>
			</el-table-column>
			<el-table-column prop="name" label="委员会名称" width="130" sortable>
			</el-table-column>
            <el-table-column prop="type" label="组织类型" width="120" :formatter="formatType" sortable>
            </el-table-column>
            <el-table-column prop="pid" label="父级组织" width="120" sortable>
            </el-table-column>
            <el-table-column prop="flag" label="标记" width="120" :formatter="formatFlag" sortable>
            </el-table-column>
            <el-table-column prop="leader" label="主要领导" width="120" sortable>
            </el-table-column>
            <el-table-column prop="detail" label="简介" min-width="120" sortable>
            </el-table-column>
            <el-table-column prop="available" label="可用性" width="120" :formatter="formatAvailable" sortable>
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
				<el-form-item label="委员会名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="组织类型">
                    <el-radio-group v-model="editForm.type">
						<el-radio class="radio" :label="0">政府</el-radio>
						<el-radio class="radio" :label="1">业主立案团</el-radio>
						<el-radio class="radio" :label="2">业主委员会</el-radio>
                        <el-radio class="radio" :label="3">互助委员会</el-radio>
                        <el-radio class="radio" :label="4">物业管理公司</el-radio>
                        <el-radio class="radio" :label="5">其他</el-radio>
                        <el-radio class="radio" :label="6">无组织</el-radio>
                        <el-radio class="radio" :label="7">小组</el-radio>
					</el-radio-group>
                </el-form-item>
				<el-form-item label="父级组织">
					<el-input v-model="editForm.pid" ></el-input>
				</el-form-item>
				<el-form-item label="标记">
					<el-radio-group v-model="editForm.flag">
						<el-radio class="radio" :label='0'>政府</el-radio>
						<el-radio class="radio" :label='1'>居委会</el-radio>
						<el-radio class="radio" :label='2'>小组</el-radio>
					</el-radio-group>
				</el-form-item>
                <el-form-item label="主要领导" >
					<el-input v-model="editForm.leader" ></el-input>
				</el-form-item>
                <el-form-item label="简介" >
					<el-input v-model="editForm.detail" ></el-input>
				</el-form-item>
				<el-form-item label="可用性">
					<el-radio-group v-model="editForm.available">
						<el-radio class="radio" :label="1">是</el-radio>
						<el-radio class="radio" :label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
				<el-button @click.native="editFormVisible = false">取消</el-button>
				
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="委员会名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="组织类型">
                    <el-radio-group v-model="addForm.type">
						<el-radio class="radio" :label="0">政府</el-radio>
						<el-radio class="radio" :label="1">业主立案团</el-radio>
						<el-radio class="radio" :label="2">业主委员会</el-radio>
                        <el-radio class="radio" :label="3">互助委员会</el-radio>
                        <el-radio class="radio" :label="4">物业管理公司</el-radio>
                        <el-radio class="radio" :label="5">其他</el-radio>
                        <el-radio class="radio" :label="6">无组织</el-radio>
                        <el-radio class="radio" :label="7">小组</el-radio>
					</el-radio-group>
                </el-form-item>
				<el-form-item label="父级组织">
					<el-input v-model="addForm.pid" ></el-input>
				</el-form-item>
				<el-form-item label="标记">
					<el-radio-group v-model="addForm.flag">
						<el-radio class="radio" :label='0'>政府</el-radio>
						<el-radio class="radio" :label='1'>居委会</el-radio>
						<el-radio class="radio" :label='2'>小组</el-radio>
					</el-radio-group>
				</el-form-item>
                <el-form-item label="主要领导" >
					<el-input v-model="addForm.leader" ></el-input>
				</el-form-item>
                <el-form-item label="简介" >
					<el-input v-model="addForm.detail" ></el-input>
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
	import {getCommitteeListPage,getCommitteeList,removeCommittee,batchRemoveCommittee,editCommittee, addCommittee} from '../../api/api';

	export default {
		data() {
			return {
				//多条件查询参数
				options:[{
					value:'name',
					label:"委员会名称"
				},{
					value:"type",
					label:"组织类型"
				},{
					value:"pid",
					label:"父级组织"
				},{
					value:"flag",
					label:"标记"
				},{
					value:'leader',
					label:'主要领导'

				},{
					value:"available",
					label:"可用性"
				}],
				value1:'name',
				//end 多条件查询
				value: '',
				
                options1:[{
                    value:'0',
                    label:'政府'
                },{
                    value:'1',
                    label:'委员会'
                },{
                    value:'2',
                    label:'小组'
                }],
				filters: {
					name: ''
				},
                users: [],
                committees:[],
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
					id: 0,
					name: '',
					type:-1,
					pid:0,
					flag:0,
					leader:'',
					detail:'',
					available:1
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
					type:-1,
					pid:0,
					flag:0,
					leader:'',
					detail:'',
					available:1
				}

			}
		},
		methods: {
			getVotesNone:function(){
			this.filters.name='';
			this.value1='name',
			this.getCommittees();
			},
			//性别显示转换
			formatAvailable: function (row, column) {
				return row.available == 1 ? '是' : row.available == 0 ? '否' : '未知';
            },
            formatFlag:function(row,column){
                if(row.flag==0)
                return '政府';
                else if(row.flag==1)
                return '委员会';
                else if(row.flag==2)
                return '小组';
                else return '未知';
            },
            formatType:function(row,column){
                if(row.type==0)
                return '政府';
                else if(row.type==1)
                return '业主立案团';
                else if(row.type==2)
                return '业主委员会';
                else if(row.type==3)
                return '互助委员会';
                else if(row.type==4)
                return '物业管理公司';
                else if(row.type==5)
                return '其他';
                else if(row.type==6)
                return '无组织';
                else if(row.type==7)
                return '小组';
                else return '未知';
            },
			handleCurrentChange(val) {
				this.page = val;
				this.getCommittees();
			},
			//获取用户列表
			getCommittees() {
				let para = {
					page: this.page,
					name: this.filters.name,
					value1:this.value1
				};
				this.listLoading = true;
				//NProgress.start();
				getCommitteeListPage(para).then((res) => {
					this.total = res.data.total;
					this.committees = res.data.committees;
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
					removeCommittee(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getCommittees();
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
				this.addFormVisible = true;
				this.addForm = {
					id: 0,
					name: '',
					type:-1,
					pid:0,
					flag:0,
					leader:'',
					detail:'',
					available:1
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							// para.building_date = (!para.building_date || para.building_date == '') ? '' : util.formatDate.format(new Date(para.building_date), 'yyyy-MM-dd');
							editCommittee(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({//$全局引用
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getCommittees();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							// para.building_date = (!para.building_date || para.building_date == '') ? '' : util.formatDate.format(new Date(para.building_date), 'yyyy-MM-dd');
							addCommittee(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getCommittees();
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
					batchRemoveCommittee(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getCommittees();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getCommittees();
		}
	}

</script>

<style scoped>

</style>