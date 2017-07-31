<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="建筑名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getBuilding">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getVotesNone">重置查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="buildings" highlight-current-row v-loading="loading"  style="width: 100%;">
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
		</el-table>

	</section>
</template>
<script>
	import { getBuildingList } from '../../api/api';
	//import NProgress from 'nprogress'
	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				loading: false,
				buildings: [
				]
			}
		},
		methods: {
			getVotesNone:function(){
			this.filters.name='';
			this.getBuilding();
			},
			//性别显示转换
			formatAvailable: function (row, column) {
				return row.available == 1 ? '是' : row.available == 0 ? '否' : '未知';
			},
			//获取用户列表
			getBuilding: function () {
				let para = {
					building_name: this.filters.name
				};
				this.loading = true;
				//NProgress.start();
				getBuildingList(para).then((res) => {
					this.buildings = res.data.buildings;
					this.loading = false;
					//NProgress.done();
				});
			}
		},
		mounted() {
			this.getBuilding();
		}
	};

</script>

<style scoped>

</style>