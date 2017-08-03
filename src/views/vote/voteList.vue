<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="搜索关键词"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="value" placeholder="查询关键词">
						<el-option v-for="item in options" :key="item.value"  :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"  v-on:click="getVote">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getVotesNone">重置查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="votes" highlight-current-row v-loading="loading"  style="width: 100%;">
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
		</el-table>

	</section>
</template>
<script>
	import { getVoteList } from '../../api/api';
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
					label:"投票名称"
				},{
					value:"attribute",
					label:"发起组织"
				}],
				value:'name',
				//end 多条件查询参数
				loading: false,
				votes: [
				]
			}
		},
		methods: {
			getVotesNone:function(){
			this.filters.name='';
			this.value='name';
			this.getVote();
			},
			//获取投票列表
			getVote: function () {
				let para = {
					attribute: this.filters.name,
					value:this.value
				};
				this.loading = true;
				//NProgress.start();
				getVoteList(para).then((res) => {
					this.votes = res.data.votes;
					this.loading = false;
					//NProgress.done();
				});
			}
		},
		mounted() {
			this.getVote();
		}
	};

</script>

<style scoped>

</style>