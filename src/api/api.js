import axios from 'axios';

let base = '';
//params参数=》loginParams（账号密码），返回格式 {msg ,code , user},${base}/项目名称
export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };


//建筑导航api
export const getBuildingListPage = params => { return axios.get(`${base}/building/buildinglistpage`, { params: params }); };

export const getBuildingList = params => { return axios.get(`${base}/building/buildinglist`, { params: params }); };

export const removeBuilding = params => { return axios.get(`${base}/building/buildingremove`, { params: params }); };

export const batchRemoveBuilding = params => { return axios.get(`${base}/building/buildingbatchremove`, { params: params }); };

export const editBuilding = params => { return axios.get(`${base}/building/buildingedit`, { params: params }); };

export const addBuilding = params => { return axios.get(`${base}/building/buildingadd`, { params: params }); };


//委员会导航api
export const getCommitteeListPage = params => { return axios.get(`${base}/committee/committeelistpage`, { params: params }); };

export const getCommitteeList = params => { return axios.get(`${base}/committee/committeelist`, { params: params }); };

export const removeCommittee = params => { return axios.get(`${base}/committee/committeeremove`, { params: params }); };

export const batchRemoveCommittee = params => { return axios.get(`${base}/committee/committeebatchremove`, { params: params }); };

export const editCommittee = params => { return axios.get(`${base}/committee/committeeedit`, { params: params }); };

export const addCommittee = params => { return axios.get(`${base}/committee/committeeadd`, { params: params }); };


//投票导航api
export const getVoteListPage = params => { return axios.get(`${base}/vote/votelistpage`, { params: params }); };

export const getVoteList = params => { return axios.get(`${base}/vote/votelist`, { params: params }); };

export const removeVote = params => { return axios.get(`${base}/vote/voteremove`, { params: params }); };

export const batchRemoveVote = params => { return axios.get(`${base}/vote/votebatchremove`, { params: params }); };

export const editVote = params => { return axios.get(`${base}/vote/voteedit`, { params: params }); };

export const addVote = params => { return axios.get(`${base}/vote/voteadd`, { params: params }); };

// export const requestLogin = params => { return axios.post(`http://172.31.72.53:8090/login/byPhone`, params).then(res => res.data); };

// http://172.31.72,53:8090/login/byPhone?phone=15647854635&passwd=123456

