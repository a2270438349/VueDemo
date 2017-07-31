import Mock from 'mockjs';
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

export {  Votes };