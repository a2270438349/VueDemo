<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="请输入关键词"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="value" placeholder="查询关键词">
						<el-option v-for="item in options" :key="item.value"  :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
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
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
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
			<el-table-column prop="email" label="电子邮件" width="180" sortable>
			</el-table-column>
			<!-- <el-table-column prop="photo" label="头像" width="120" sortable>
			</el-table-column> -->
			<el-table-column prop="addr" label="地址" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="regdate" label="注册日期" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="available" label="可用性" min-width="120" :formatter="formatAvailable" sortable>
			</el-table-column>
			<!-- <el-table-column prop="num" label="楼宇编号" width="130" sortable></el-table-column> -->
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
				<el-form-item label="用户名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="''+1">男</el-radio>
						<el-radio class="radio" :label="''+0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="电话" prop="phone">
					<el-input v-model="editForm.phone" ></el-input>
				</el-form-item>
				<el-form-item label="电子邮件" prop="email">
					<el-input v-model="editForm.email" ></el-input>
				</el-form-item>
				<!-- 此处头像应改为上传图片并绑定，待修改  -->
				<el-form-item label="头像" prop="photo">
					<el-input v-model="editForm.photo" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="地址" prop="addr">
					<!-- <el-input type='textarea' v-model="editForm.address" ></el-input> -->
					<!--省市区三级选择器  -->
						<el-select v-model="prov">
							<el-option v-for="option in arr" :label="option.name" :value="option.name" :key="option.name"></el-option>
						</el-select>
						<el-select v-model="city">
							<el-option v-for="option in cityArr" :label="option.name" :value="option.name" :key="option.name"></el-option>
						</el-select>
						<el-select v-model="district" v-if="district">
							<el-option v-for="option in districtArr" :label="option.name" :value="option.name" :key="option.name"></el-option>
						</el-select>
					<!--end 省市区三级选择器  -->
				</el-form-item>
				<el-form-item label="注册日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.regdate"></el-date-picker>
				</el-form-item>
				<el-form-item label="可用性" prop="available">
					<el-radio-group v-model="editForm.available">
						<el-radio class="radio" :label="''+1">是</el-radio>
						<el-radio class="radio" :label="''+0">否</el-radio>
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
				<el-form-item label="性别" prop="sex">
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
				<el-form-item label="地址" prop="addr">
					<!-- <el-input type='textarea' v-model="editForm.address" ></el-input> -->
					<!--省市区三级选择器  -->
						<el-select v-model="prov">
							<el-option v-for="option in arr" :label="option.name" :value="option.name" :key="option.name"></el-option>
						</el-select>
						<el-select v-model="city">
							<el-option v-for="option in cityArr" :label="option.name" :value="option.name" :key="option.name"></el-option>
						</el-select>
						<el-select v-model="district" v-if="district">
							<el-option v-for="option in districtArr" :label="option.name" :value="option.name" :key="option.name"></el-option>
						</el-select>
					<!--end 省市区三级选择器  -->
				</el-form-item>
				<el-form-item label="注册日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.regdate"></el-date-picker>
				</el-form-item>
				<el-form-item label="可用性" >
					<el-radio-group v-model="addForm.available" :disabled="true">
						<el-radio class="radio" :label="''+1">是</el-radio>
						<el-radio class="radio" :label="''+0">否</el-radio>
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
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
	import { arrAll} from '../../common/js/districtSelect';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				//省市区三级选择器参数
				prov: '请选择',
		    	city: '请选择',
		    	district: '请选择',
		   		cityArr: [],
        		districtArr: [],
        		arr :arrAll,
				//多条件查询参数
				options:[{
					value:'name',
					label:"用户名"
				},{
					value:"sex",
					label:"性别"
				},{
					value:"phone",
					label:"电话"
				},{
					value:"email",
					label:"电子邮件"
				},{
					value:"available",
					label:"可用性"
				}],
				value:'name',
				//end 多条件查询参数
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' },
						
					],
					sex:[{ required: true, message: '请输入性别', trigger: 'blur' },],

				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					phone: 0,
					email: '',
					photo: '',
					addr:'',
					regdate:'',
					available:1
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					sex:[{ required: true, message: '请输入性别', trigger: 'blur' },],
					phone:[{ required: true, message: '请输入电话', trigger: 'blur' },],
					addr:[{ required: true, message: '请选择地址', trigger: 'blur' },],
				},
				//新增界面数据
				addForm: {
					id: 0,
					name: '',
					sex: -1,
					phone: 0,
					email: '',
					photo: '',
					addr:'',
					regdate:'',
					available:1
				}

			}
		},
		methods: {
			getVotesNone:function(){
			this.filters.name='';
			this.value='name';
			this.getUsers();
			},
			formatAvailable: function (row, column) {
				return row.available == 1 ? '是' : row.available == 0 ? '否' : '未知';
			},
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					name: this.filters.name,
					value:this.value
				};
				this.listLoading = true;
				//NProgress.start();
				getUserListPage(para).then((res) => {
					this.total = res.data.total;

					this.users = res.data.users;
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
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				//初始化省市区三级参数
				this.prov='请选择';
				this.city='请选择';
				this.district='请选择';
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				//初始化省市区三级参数
				this.prov='请选择';
				this.city='请选择';
				this.district='请选择';
				this.addForm = {
					name: '',
					sex: -1,
					phone: '',
					email: '',
					photo: '',
					addr:'',
					regdate:'',
					available:''+1
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
							para.regdate = (!para.regdate || para.regdate == '') ? '' : util.formatDate.format(new Date(para.regdate), 'yyyy-MM-dd');

							para.addr=this.prov+' '+this.city+' '+this.district;
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({//$全局引用
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
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
							para.regdate = (!para.regdate || para.regdate == '') ? '' : util.formatDate.format(new Date(para.regdate), 'yyyy-MM-dd');
							para.addr=this.prov+' '+this.city+' '+this.district;
							para.available=1;
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
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//省市区三级选择器调用方法
			updateCity: function () {
			for (var i in this.arr) {
				var obj = this.arr[i];
				if (obj.name == this.prov) {
					this.cityArr = obj.sub;
					break;
				}
			}
			this.city = this.cityArr[1].name;
			},
			updateDistrict: function () {
			for (var i in this.cityArr) {
				var obj = this.cityArr[i];
				if (obj.name == this.city) {
					this.districtArr = obj.sub;
					break;
				}
			}
			if(this.districtArr && this.districtArr.length > 0 && this.districtArr[1].name) {
				this.district = this.districtArr[1].name;
			} else {
				this.district = '';
			}
			}
		},
		mounted() {
			this.getUsers();
		},
		//省市区三级选择器方法
		beforeMount: function () {
		this.updateCity();
		this.updateDistrict();
		},
		watch: {
		prov: function () {
			this.updateCity();
			this.updateDistrict();
		},
		city: function () {
			this.updateDistrict();
		}
		}
	}

</script>

<style scoped>

</style>