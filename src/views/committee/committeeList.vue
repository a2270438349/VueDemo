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
					<el-button type="primary"  v-on:click="getCommittee">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getVotesNone">重置查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="committees" highlight-current-row v-loading="loading"  style="width: 100%;">
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
		</el-table>

	</section>
</template>
<script>
	import { getCommitteeList } from '../../api/api';
	import NProgress from 'nprogress'
	export default {
		data() {
			return {
				filters: {
					name: ''
				},
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
				loading: false,
				committees: [
				]
			}
		},
		methods: {
			getVotesNone:function(){
			this.filters.name='';
			this.value1='name',
			this.getCommittee();
			},
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
			//获取委员会列表
			getCommittee: function () {
				let para = {
					name: this.filters.name,
					value1:this.value1
				};
				this.loading = true;
				//NProgress.start();
				getCommitteeList(para).then((res) => {
					this.committees = res.data.committees;
					this.loading = false;
					//NProgress.done();
				});
			}
		},
		mounted() {
			this.getCommittee();
		}
	};

</script>

<style scoped>

</style>