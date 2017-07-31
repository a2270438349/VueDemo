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
for (let i = 0; i < 86; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.cname(),
    sex: Mock.Random.integer(0, 1),
    phone:'电话号码',
    email:'邮件地址',
    photo:'图片url',
    addr: Mock.mock('@county(true)'),
    regdate:Mock.Random.date(),
    available:Mock.Random.integer(0,1)
    // num:Mock.Random.integer(0, 1000)+"-"+Mock.Random.integer(0, 1000)+"-"+Mock.Random.integer(0, 10000)
  }));
}

export { LoginUsers, Users };
