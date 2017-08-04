import Mock from 'mockjs';
const Buildings = [];
for (let i = 0; i < 86; i++) {
  Buildings.push(Mock.mock({
    building_id: Mock.Random.guid(),
    building_name: '建筑 '+(i+1),
    layers:' '+Mock.Random.integer(1, 100)+' ',
    undergroup_layers:' '+Mock.Random.integer(1, 10)+' ',
    units_num:' '+Mock.Random.integer(1, 100)+' ',//加空格实现全匹配，避免部分匹配
    building_date: Mock.Random.date(),
    // city: Mock.mock('@county(true)'),
    // city:Mock.Random.city(),
    // city:'城市 '+(i+1),
    // district:Mock.mock('@county(true)'),
    // district:Mock.Random.region(),
    district:Mock.mock('@county(true)'),
    // address:Mock.mock('@county(true)'),
    address:'地址 '+(i+1),
    available:''+Mock.Random.integer(0,1)
  }));
}

export {  Buildings };