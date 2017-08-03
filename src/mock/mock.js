import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Mock from 'mockjs';
import { LoginUsers, Users } from './data/user';
import {Buildings} from './data/building';
import {Committees} from './data/committee';
import {Votes} from './data/vote';
let _Users = Users;
let _Buildings=Buildings;
let _Committees=Committees;
let _Votes=Votes;

export default {
  /**
   * mock bootstrap
   */
  bootstrap() {
    let mock = new MockAdapter(axios);//axios的模拟调试器

    // mock success request
    mock.onGet('/success').reply(200, {
      msg: 'success'
    });

    // mock error request
    mock.onGet('/error').reply(500, {
      msg: 'failure'
    });

    //登录
    mock.onPost('/login').reply(config => {
      let {username, password} = JSON.parse(config.data);//读出loginuser数据
      return new Promise((resolve, reject) => {
        let user = null;
        setTimeout(() => {
          let hasUser = LoginUsers.some(u => {//.some()放回是否符合条件的boolean
            if (u.username === username && u.password === password) {
              user = JSON.parse(JSON.stringify(u));
              user.password = undefined;
              return true;
            }
          });

          if (hasUser) {
            resolve([200, { code: 200, msg: '请求成功', user }]);
          } else {
            resolve([200, { code: 500, msg: '账号或密码错误' }]);
          }
        }, 1000);
      });
    });

    //获取用户列表
    mock.onGet('/user/list').reply(config => {
      let {name,value} = config.params;
      //多条件查询
      let mockUsers;
      if(value=='name'){
        mockUsers= _Users.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
        });
      }
      else if(value=='sex'){
        if(name=='男'){
          mockUsers= _Users.filter(user => {
            if (name && user.sex.indexOf(1) == -1) return false;
            return true;
          });
        }
        else if(name=='女'){
          mockUsers= _Users.filter(user => {
            if (name && user.sex.indexOf(0) == -1) return false;
            return true;
          });
        }
        else {
          mockUsers= _Users.filter(user => {
            // if (name && user.sex.indexOf(1) == -1) return false;
            // return true;
            return false;
          });
        }
      }
      else if(value=='phone'){
        mockUsers= _Users.filter(user => {
        if (name && user.phone.indexOf(name) == -1) return false;
        return true;
        });
      }
      else if(value=='email'){
        mockUsers= _Users.filter(user => {
        if (name && user.email.indexOf(name) == -1) return false;
        return true;
        });
      }
      else if(value=='available'){
        if(name=='是'){
          mockUsers= _Users.filter(user => {
            if (name && user.available.indexOf(1) == -1) return false;
            return true;
          });
        }
        else if(name=='否'){
          mockUsers= _Users.filter(user => {
            if (name && user.available.indexOf(0) == -1) return false;
            return true;
          });
        }
        else {
          mockUsers= _Users.filter(user => {
            // if (name && user.sex.indexOf(1) == -1) return false;
            // return true;
            return false;
          });
        }
      }
      else {
        console.log('ERROR:no match vlaue');
      }//end 多条件查询
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            users: mockUsers
          }]);
        }, 1000);
      });
    });

    //获取用户列表（分页）
    mock.onGet('/user/listpage').reply(config => {//config是提交的表单

      let {page, name ,value} = config.params;
      //多条件查询
      let mockUsers;
      if(value=='name'){
        mockUsers= _Users.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
        });
      }
      else if(value=='sex'){
        if(name=='男'){
          mockUsers= _Users.filter(user => {
            if (name && user.sex.indexOf(1) == -1) return false;
            return true;
          });
        }
        else if(name=='女'){
          mockUsers= _Users.filter(user => {
            if (name && user.sex.indexOf(0) == -1) return false;
            return true;
          });
        }
        else {
          mockUsers= _Users.filter(user => {
            // if (name && user.sex.indexOf(1) == -1) return false;
            // return true;
            return false;
          });
        }
      }
      else if(value=='phone'){
        mockUsers= _Users.filter(user => {
        if (name && user.phone.indexOf(name) == -1) return false;
        return true;
        });
      }
      else if(value=='email'){
        mockUsers= _Users.filter(user => {
        if (name && user.email.indexOf(name) == -1) return false;
        return true;
        });
      }
      else if(value=='available'){
        if(name=='是'){
          mockUsers= _Users.filter(user => {
            if (name && user.available.indexOf(1) == -1) return false;
            return true;
          });
        }
        else if(name=='否'){
          mockUsers= _Users.filter(user => {
            if (name && user.available.indexOf(0) == -1) return false;
            return true;
          });
        }
        else {
          mockUsers= _Users.filter(user => {
            // if (name && user.sex.indexOf(1) == -1) return false;
            // return true;
            return false;
          });
        }
      }
      else {
        console.log('ERROR:no match vlaue');
      }//end 多条件查询

      let total = mockUsers.length;
      mockUsers = mockUsers.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            users: mockUsers
          }]);
        }, 1000);
      });
    });

    

    //删除用户
    mock.onGet('/user/remove').reply(config => {
      let { id } = config.params;
      _Users = _Users.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //批量删除用户
    mock.onGet('/user/batchremove').reply(config => {
      let { ids } = config.params;
      ids = ids.split(',');
      _Users = _Users.filter(u => !ids.includes(u.id));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //编辑用户
    mock.onGet('/user/edit').reply(config => {
      let { id, name, addr, age, birth, sex } = config.params;
      _Users.some(u => {
        if (u.id === id) {
          u.name = name;
          u.addr = addr;
          u.age = age;
          u.birth = birth;
          u.sex = sex;
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }]);
        }, 500);//500是提交延迟
      });
    });

    //新增用户
    mock.onGet('/user/add').reply(config => {
      let { name, addr, age, birth, sex } = config.params;
      _Users.push({
        id:Mock.Random.guid(),
        name: name,
        addr: addr,
        age: age,
        birth: birth,
        sex: sex
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });
    
    //以下为建筑自导航栏的数据生成

    //获取建筑列表（分页）
    mock.onGet('/building/buildinglistpage').reply(config => {//config是提交的表单

      let {page, building_name,value} = config.params;
      //多条件查询
      let mockBuildings;
      if(value=='building_name'){
        mockBuildings= _Buildings.filter(building => {
        if (building_name && building.building_name.indexOf(building_name) == -1) return false;
        return true;
        });
      }
      
      else if(value=='layers'){
        mockBuildings= _Buildings.filter(building => {
        if (building_name && building.layers.indexOf(' '+building_name+' ') == -1) return false;//加空格后缀避免只有部分匹配
        return true;
        });
      }
      else if(value=='undergroup_layers'){
        mockBuildings= _Buildings.filter(building => {
        if (building_name && building.undergroup_layers.indexOf(' '+building_name+' ') == -1) return false;
        return true;
        });
      }
      else if(value=='units_num'){
        mockBuildings= _Buildings.filter(building => {
        if (building_name && building.units_num.indexOf(' '+building_name+' ') == -1) return false;
        return true;
        });
      }
      else if(value=='available'){
        if(building_name=='是'){
          mockBuildings= _Buildings.filter(building => {
            if (building_name && building.available.indexOf(1) == -1) return false;
            return true;
          });
        }
        else if(building_name=='否'){
          mockBuildings= _Buildings.filter(building => {
            if (building_name && building.available.indexOf(0) == -1) return false;
            return true;
          });
        }
        else {
          mockBuildings= _Buildings.filter(building => {
            // if (name && user.sex.indexOf(1) == -1) return false;
            // return true;
            return false;
          });
        }
      }
      else {
        console.log('ERROR:no match vlaue');
      }//end 多条件查询
      let total = mockBuildings.length;
      mockBuildings = mockBuildings.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            buildings: mockBuildings
          }]);
        }, 1000);
      });
    });

    mock.onGet('/building/buildinglist').reply(config => {
      let {building_name,value} = config.params;
      //多条件查询
      let mockBuildings;
      if(value=='building_name'){
        mockBuildings= _Buildings.filter(building => {
        if (building_name && building.building_name.indexOf(building_name) == -1) return false;
        return true;
        });
      }
      
      else if(value=='layers'){
        mockBuildings= _Buildings.filter(building => {
        if (building_name && building.layers.indexOf(' '+building_name+' ') == -1) return false;//加空格后缀避免只有部分匹配
        return true;
        });
      }
      else if(value=='undergroup_layers'){
        mockBuildings= _Buildings.filter(building => {
        if (building_name && building.undergroup_layers.indexOf(' '+building_name+' ') == -1) return false;
        return true;
        });
      }
      else if(value=='units_num'){
        mockBuildings= _Buildings.filter(building => {
        if (building_name && building.units_num.indexOf(' '+building_name+' ') == -1) return false;
        return true;
        });
      }
      else if(value=='available'){
        if(building_name=='是'){
          mockBuildings= _Buildings.filter(building => {
            if (building_name && building.available.indexOf(1) == -1) return false;
            return true;
          });
        }
        else if(building_name=='否'){
          mockBuildings= _Buildings.filter(building => {
            if (building_name && building.available.indexOf(0) == -1) return false;
            return true;
          });
        }
        else {
          mockBuildings= _Buildings.filter(building => {
            // if (name && user.sex.indexOf(1) == -1) return false;
            // return true;
            return false;
          });
        }
      }
      else {
        console.log('ERROR:no match vlaue');
      }//end 多条件查询
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            buildings: mockBuildings
          }]);
        }, 1000);
      });
    });
   

    //删除建筑
    mock.onGet('/building/buildingremove').reply(config => {
      let { building_id } = config.params;
      _Buildings = _Buildings.filter(u => u.building_id !== building_id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //批量删除建筑
    mock.onGet('/building/buildingbatchremove').reply(config => {
      let { ids } = config.params;
      ids = ids.split(',');
      _Buildings = _Buildings.filter(u => !ids.includes(u.building_id));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //编辑建筑
    mock.onGet('/building/buildingedit').reply(config => {
      let { building_id, building_name, layers, undergroup_layers, units_num, building_date,city,district,address,available } = config.params;
      _Buildings.some(u => {
        if (u.building_id === building_id) {
          u.building_name = building_name;
          u.layers = layers;
          u.undergroup_layers = undergroup_layers;
          u.units_num = units_num;
          u.building_date = building_date;
          u.city=city;
          u.district=district;
          u.address=address;
          u.available=available;
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }]);
        }, 500);//500是提交延迟
      });
    });

    //新增建筑
    mock.onGet('/building/buildingadd').reply(config => {
      let {  building_name, layers, undergroup_layers, units_num, building_date,city,district,address,available } = config.params;
      _Buildings.push({
        building_id:Mock.Random.guid(),
        building_name:building_name,
        layers: layers,
        undergroup_layers: undergroup_layers,
        units_num: units_num,
        building_date: building_date,
        city:city,
        district:district,
        address:address,
        available:available
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });

    //以下为委员会导航栏的拦截处理

    //获取委员会列表（分页）
    mock.onGet('/committee/committeelistpage').reply(config => {//config是提交的表单
      let {page, name,value1} = config.params;
      
      //多条件查询
      let mockCommittees;
      if(value1=='name'){
        mockCommittees= _Committees.filter(committee => {
        if (name && committee.name.indexOf(name) == -1) return false;
        return true;
        });
      }
      
      else if(value1=='type'){
        if(name=='政府'){mockCommittees= _Committees.filter(committee => {if (name && committee.type.indexOf(0) == -1) return false;return true;});}
        else if(name=='业主立案团'){mockCommittees= _Committees.filter(committee => {if (name && committee.type.indexOf(1) == -1) return false;return true;});}
        else if(name=='业主委员会'){mockCommittees= _Committees.filter(committee => {if (name && committee.type.indexOf(2) == -1) return false;return true;});}
        else if(name=='互助委员会'){mockCommittees= _Committees.filter(committee => {if (name && committee.type.indexOf(3) == -1) return false;return true;});}
        else if(name=='物业管理公司'){mockCommittees= _Committees.filter(committee => {if (name && committee.type.indexOf(4) == -1) return false;return true;});}
        else if(name=='其他'){mockCommittees= _Committees.filter(committee => {if (name && committee.type.indexOf(5) == -1) return false;return true;});}
        else if(name=='无组织'){mockCommittees= _Committees.filter(committee => {if (name && committee.type.indexOf(6) == -1) return false;return true;});}
        else if(name=='小组'){mockCommittees= _Committees.filter(committee => {if (name && committee.type.indexOf(7) == -1) return false;return true;});}
        else {mockCommittees= _Committees.filter(committee => { return false;});}
      }
      else if(value1=='pid'){
        mockCommittees= _Committees.filter(committee => {
        if (name && committee.pid.indexOf(name) == -1) return false;
        return true;
        });
      }
      else if(value1=='flag'){
        if(name=='政府'){mockCommittees= _Committees.filter(committee => {if (name && committee.flag.indexOf(0) == -1) return false;return true;});}
        else if(name=='委员会'){mockCommittees= _Committees.filter(committee => {if (name && committee.flag.indexOf(1) == -1) return false;return true;});}
        else if(name=='小组'){mockCommittees= _Committees.filter(committee => {if (name && committee.flag.indexOf(2) == -1) return false;return true;});}
        else {mockCommittees= _Committees.filter(committee => { return false;});}
      }
       else if(value1=='leader'){
        mockCommittees= _Committees.filter(committee => {
        if (name && committee.leader.indexOf(name) == -1) return false;
        return true;
        });
      }
      else if(value1=='available'){
        if(name=='是'){
          mockCommittees= _Committees.filter(committee => {
            if (name && committee.available.indexOf(1) == -1) return false;
            return true;
          });
        }
        else if(name=='否'){
          mockCommittees= _Committees.filter(committee => {
            if (name && committee.available.indexOf(0) == -1) return false;
            return true;
          });
        }
        else {
          mockCommittees= _Committees.filter(committee => {
            // if (name && user.sex.indexOf(1) == -1) return false;
            // return true;
            return false;
          });
        }
      }
      else {
        console.log('ERROR:no match vlaue');
      }//end 多条件查询
      let total = mockCommittees.length;
      mockCommittees = mockCommittees.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            committees: mockCommittees
          }]);
        }, 1000);
      });
    });

    mock.onGet('/committee/committeelist').reply(config => {
      let {name,value1} = config.params;
      //多条件查询
      let mockCommittees;
      if(value1=='name'){
        mockCommittees= _Committees.filter(committee => {
        if (name && committee.name.indexOf(name) == -1) return false;
        return true;
        });
      }
      
      else if(value1=='type'){
        if(name=='政府'){mockCommittees= _Committees.filter(committee => {if (name && committee.type.indexOf(0) == -1) return false;return true;});}
        else if(name=='业主立案团'){mockCommittees= _Committees.filter(committee => {if (name && committee.type.indexOf(1) == -1) return false;return true;});}
        else if(name=='业主委员会'){mockCommittees= _Committees.filter(committee => {if (name && committee.type.indexOf(2) == -1) return false;return true;});}
        else if(name=='互助委员会'){mockCommittees= _Committees.filter(committee => {if (name && committee.type.indexOf(3) == -1) return false;return true;});}
        else if(name=='物业管理公司'){mockCommittees= _Committees.filter(committee => {if (name && committee.type.indexOf(4) == -1) return false;return true;});}
        else if(name=='其他'){mockCommittees= _Committees.filter(committee => {if (name && committee.type.indexOf(5) == -1) return false;return true;});}
        else if(name=='无组织'){mockCommittees= _Committees.filter(committee => {if (name && committee.type.indexOf(6) == -1) return false;return true;});}
        else if(name=='小组'){mockCommittees= _Committees.filter(committee => {if (name && committee.type.indexOf(7) == -1) return false;return true;});}
        else {mockCommittees= _Committees.filter(committee => { return false;});}
      }
      else if(value1=='pid'){
        mockCommittees= _Committees.filter(committee => {
        if (name && committee.pid.indexOf(name) == -1) return false;
        return true;
        });
      }
      else if(value1=='flag'){
        if(name=='政府'){mockCommittees= _Committees.filter(committee => {if (name && committee.flag.indexOf(0) == -1) return false;return true;});}
        else if(name=='委员会'){mockCommittees= _Committees.filter(committee => {if (name && committee.flag.indexOf(1) == -1) return false;return true;});}
        else if(name=='小组'){mockCommittees= _Committees.filter(committee => {if (name && committee.flag.indexOf(2) == -1) return false;return true;});}
        else {mockCommittees= _Committees.filter(committee => { return false;});}
      }
       else if(value1=='leader'){
        mockCommittees= _Committees.filter(committee => {
        if (name && committee.leader.indexOf(name) == -1) return false;
        return true;
        });
      }
      else if(value1=='available'){
        if(name=='是'){
          mockCommittees= _Committees.filter(committee => {
            if (name && committee.available.indexOf(1) == -1) return false;
            return true;
          });
        }
        else if(name=='否'){
          mockCommittees= _Committees.filter(committee => {
            if (name && committee.available.indexOf(0) == -1) return false;
            return true;
          });
        }
        else {
          mockCommittees= _Committees.filter(committee => {
            // if (name && user.sex.indexOf(1) == -1) return false;
            // return true;
            return false;
          });
        }
      }
      else {
        console.log('ERROR:no match vlaue');
      }//end 多条件查询
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            committees: mockCommittees
          }]);
        }, 1000);
      });
    });
   

    //删除委员会
    mock.onGet('/committee/committeeremove').reply(config => {
      let { id } = config.params;
      _Committees = _Committees.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //批量删除委员会
    mock.onGet('/committee/committeebatchremove').reply(config => {
      let { ids } = config.params;
      ids = ids.split(',');
      _Committees = _Committees.filter(u => !ids.includes(u.id));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //编辑委员会
    mock.onGet('/committee/committeeedit').reply(config => {
      let { id, name, type, pid, flag, leader,detail,available } = config.params;
      _Committees.some(u => {
        if (u.id === id) {
          u.name = name;
          u.type = type;
          u.pid = pid;
          u.flag = flag;
          u.leader = leader;
          u.detail=detail;
          u.available=available;
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }]);
        }, 500);//500是提交延迟
      });
    });

    //新增委员会
    mock.onGet('/committee/committeeadd').reply(config => {
      let { name, type, pid, flag, leader,detail,available} = config.params;
      _Committees.push({
        id:Mock.Random.guid(),
        name: name,
        type: type,
        pid: pid,
        flag: flag,
        leader:leader,
        detail:detail,
        available:available
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });

    //以下为投票导航页拦截的处理
    //获取投票分页
    mock.onGet('/vote/votelistpage').reply(config => {//config是提交的表单
      let {page, attribute,value} = config.params;
      let mockVotes = _Votes.filter(vote => {
        if (attribute && vote.attribute.indexOf(attribute) == -1) return false;
        return true;
      });
      //多条件查询
      let mockBuildings;
      if(value=='name'){
        mockVotes= _Votes.filter(vote => {
        if (attribute && vote.name.indexOf(attribute) == -1) return false;
        return true;
        });
      }
      
      else if(value=='attribute'){
        mockVotes= _Votes.filter(vote => {
        if (attribute && vote.attribute.indexOf(attribute) == -1) return false;
        return true;
        });
      }
      else {
        console.log('ERROR:no match vlaue');
      }//end 多条件查询
      let total = mockVotes.length;
      mockVotes = mockVotes.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            votes: mockVotes
          }]);
        }, 1000);
      });
    });

    mock.onGet('/vote/votelist').reply(config => {
      let {attribute} = config.params;
      let mockVotes = _Votes.filter(vote => {
        if (attribute && vote.attribute.indexOf(attribute) == -1) return false;
        return true;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            votes: mockVotes
          }]);
        }, 1000);
      });
    });
   

    //删除投票
    mock.onGet('/vote/voteremove').reply(config => {
      let { id } = config.params;
      _Votes = _Votes.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //批量删除投票
    mock.onGet('/vote/votebatchremove').reply(config => {
      let { ids } = config.params;
      ids = ids.split(',');
      _Votes = _Votes.filter(u => !ids.includes(u.id));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //编辑投票
    mock.onGet('/vote/voteedit').reply(config => {
      let { id, name, deadline1, deadline2, attribute ,vote} = config.params;
      _Votes.some(u => {
        if (u.id === id) {
          u.name = name;
          u.deadline1 = deadline1;
          u.deadline2 = deadline2;
          u.attribute = attribute;
          u.vote.radio=vote.radio;
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }]);
        }, 500);//500是提交延迟
      });
    });

    //新增投票
    mock.onGet('/vote/voteadd').reply(config => {
      let {    name, deadline1, deadline2, attribute, vote} = config.params;
      _Votes.push({
        id:Mock.Random.guid(),
        name: name,
        deadline1: deadline1,
        deadline2: deadline2,
        attribute: attribute,
        vote:vote,
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功',
            
          }]);
        }, 500);
      });
      
    });
























































  }
};