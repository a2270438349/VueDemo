<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="建筑名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="value" placeholder="查询关键词">
						<el-option v-for="item in options" :key="item.value"  :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getBuildings">查询</el-button>
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
		<el-table :data="buildings" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
            <el-table-column prop="building_id" label="id" width="120" sortable>
			</el-table-column>
			<el-table-column prop="building_name" label="名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="layers" label="层数" width="100"  sortable>
			</el-table-column>
			<el-table-column prop="undergroup_layers" label="地库层数" width="120" sortable>
			</el-table-column>
			<el-table-column prop="units_num" label="单元数目" width="120" sortable>
			</el-table-column>
			<el-table-column prop="building_date" label="建筑日期" width="120" sortable>
			</el-table-column>
			<el-table-column prop="city" label="城市" width="130" sortable>
			</el-table-column>
            <el-table-column prop="district" label="地区" width="130" sortable>
			</el-table-column>
            <el-table-column prop="address" label="详细地址" min-width="130" sortable>
			</el-table-column>
            <el-table-column prop="availabel" label="可用性" width="130" :formatter="formatAvailable" sortable>
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
				<el-form-item label="建筑名称" prop="building_name">
					<el-input v-model="editForm.building_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="层数">
					<el-input-number v-model="editForm.layers" :min="0" :max="256"></el-input-number>
				</el-form-item>
				<el-form-item label="地库层数">
					<el-input-number v-model="editForm.undergroup_layers" :min="0" :max="256"></el-input-number>
				</el-form-item>
				<el-form-item label="单元数目">
					<el-input-number v-model="editForm.units_num" :min="0" :max="256"></el-input-number>
				</el-form-item>
				<el-form-item label="建筑日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.building_date"></el-date-picker>
				</el-form-item>
				<el-form-item label="城市" prop="city">
					<el-input v-model="editForm.city" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="地区" prop="district">
					<el-input v-model="editForm.district" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="详细地址">
					<el-input type="textarea" v-model="editForm.address"></el-input>
				</el-form-item>
				<el-form-item label="可用性">
					<el-radio-group v-model="editForm.available">
						<el-radio class="radio" :label="1">是</el-radio>
						<el-radio class="radio" :label="0">否</el-radio>
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
				<el-form-item label="建筑名称" prop="building_name">
					<el-input v-model="addForm.building_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="层数">
					<el-input-number v-model="addForm.layers" :min="0" :max="256"></el-input-number>
				</el-form-item>
				<el-form-item label="地库层数">
					<el-input-number v-model="addForm.undergroup_layers" :min="0" :max="256"></el-input-number>
				</el-form-item>
				<el-form-item label="单元数目">
					<el-input-number v-model="addForm.units_num" :min="0" :max="256"></el-input-number>
				</el-form-item>
				<el-form-item label="建筑日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.building_date"></el-date-picker>
				</el-form-item>
				<el-form-item label="城市" prop="city">
					<el-input v-model="addForm.city" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="地区" prop="district">
					<el-input v-model="addForm.district" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="详细地址">
					<el-input type="textarea" v-model="addForm.address"></el-input>
				</el-form-item>
				<el-form-item label="可用性">
					<el-radio-group v-model="addForm.available">
						<el-radio class="radio" :label="1">是</el-radio>
						<el-radio class="radio" :label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getBuildingListPage,batchRemoveBuilding,getBuildingList,removeBuilding, editBuilding,addBuilding,getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				//多条件查询参数
				options:[{
					value:'building_name',
					label:"名称"
				},{
					value:"layers",
					label:"层数"
				},{
					value:"undergroup_layers",
					label:"地库层数"
				},{
					value:"units_num",
					label:"单元数目"
				},{
					value:"available",
					label:"可用性"
				}],
				value:'building_name',
				//end 多条件查询参数
                users: [],
                buildings:[],
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
					building_id: 0,
					building_name: '',
					layers:0,
					undergroup_layers:0,
					units_num:0,
					building_date:'',
					city:'',
					district:'',
					address:'',
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
					building_id: 0,
					building_name: '',
					layers:0,
					undergroup_layers:0,
					units_num:0,
					building_date:'',
					city:'',
					district:'',
					address:'',
					available:1
				}

			}
		},
		methods: {
			getVotesNone:function(){
			this.filters.name='',
			this.value='building_name',
			this.getBuildings()
			},
			//性别显示转换
			formatAvailable: function (row, column) {
				return row.available == 1 ? '是' : row.available == 0 ? '否' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getBuildings();
			},
			//获取用户列表
			getBuildings() {
				let para = {
					page: this.page,
					building_name: this.filters.name,
					value:this.value
				};
				this.listLoading = true;
				//NProgress.start();
				getBuildingListPage(para).then((res) => {
					this.total = res.data.total;
					this.buildings = res.data.buildings;
					this.listLoading = false;
				//	NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { building_id: row.building_id };
					removeBuilding(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getBuildings();
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
					building_id: 0,
					building_name: '',
					layers:0,
					undergroup_layers:0,
					units_num:0,
					building_date:'',
					city:'',
					district:'',
					address:'',
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
							para.building_date = (!para.building_date || para.building_date == '') ? '' : util.formatDate.format(new Date(para.building_date), 'yyyy-MM-dd');
							editBuilding(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({//$全局引用
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getBuildings();
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
							para.building_date = (!para.building_date || para.building_date == '') ? '' : util.formatDate.format(new Date(para.building_date), 'yyyy-MM-dd');
							addBuilding(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getBuildings();
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
				var ids = this.sels.map(item => item.building_id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveBuilding(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getBuildings();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getBuildings();
		}
	}

</script>

<style scoped>

</style>