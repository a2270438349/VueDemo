import Mock from 'mockjs';
const voteExample={
  id:Mock.Random.guid(),
  name:'荔园大厦整修承包商投票',
  deadline1:'2017-09-01',
  deadline2:'2017-10-01',
  attribute:'荔园大厦-业主',
  vote:{
    title:'方案投票',
    radio:0,
    num:5,
    item:['某铁一局','某铁二局','某铁三局','某铁四局','某铁八局'],//投票项
    voteNum:[100,200,300,250,500]//每个投票项投票数
  }
};
const Votes = [];
for (let i = 0; i < 86; i++) {
  Votes.push(Mock.mock({
    id: Mock.Random.guid(),//投票识别ID
    name: Mock.Random.first(),//投票名称
    deadline1:Mock.Random.date('yyyy-MM-dd'),//截止年月日
    deadline2:Mock.Random.time(),//截止时分
    attribute:Mock.Random.first(),//所属组织
    vote:{
      title:Mock.Random.cname(),
      radio:Mock.Random.integer(0, 1),
      num:Mock.Random.integer(1,10),
      item:['选A','选B','选C'],//投票项
      voteNum:[100,200,300]//每个投票项投票数
    }
  }));
}

export {  Votes,voteExample };