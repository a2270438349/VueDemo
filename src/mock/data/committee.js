import Mock from 'mockjs';
const Committees = [];
for (let i = 0; i < 86; i++) {
  Committees.push(Mock.mock({
    id: Mock.Random.guid(),
    name: '委员会 '+(i+1),
    type:''+Mock.Random.integer(0,7),
    pid:'父级组织',
    flag:''+Mock.Random.integer(0,2 ),
    leader: Mock.Random.cname(),
    detail:'待定简介',
    available:''+Mock.Random.integer(0,1)
  }));
}

export {  Committees };