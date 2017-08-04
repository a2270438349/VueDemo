import Mock from 'mockjs';
const LoginUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123',
    avatar: 'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=56f18862ba3eb1354492bfbd962e84eb/902397dda144ad348f79230dd6a20cf430ad8572.jpg',//服务器中的图片
    name: '管理员'
  },
];

const Users = [];
// let strings=[];
for (let i = 0; i < 86; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.cname(),
    sex: ''+Mock.Random.integer(0, 1),
    phone:''+Mock.Random.integer(10000000000,19999999999),
    email:Mock.Random.integer(1000000,9999999)+'@vue.com',
    photo:'图片url-'+i,
    addr: Mock.mock('@county(true)'),
    // strings:addr.split(' '),
    // prov:strings[1],
    // city:strings[2],
    // district:strings[3],
    regdate:''+Mock.Random.date(),
    available:''+Mock.Random.integer(0,1)
    // num:Mock.Random.integer(0, 1000)+"-"+Mock.Random.integer(0, 1000)+"-"+Mock.Random.integer(0, 10000)
  }));
}

export { LoginUsers, Users };
