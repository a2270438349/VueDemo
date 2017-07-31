import Mock from 'mockjs';
const Buildings = [];
for (let i = 0; i < 86; i++) {
  Buildings.push(Mock.mock({
    building_id: Mock.Random.guid(),
    building_name: Mock.Random.first(),
    layers:Mock.Random.integer(1, 100),
    undergroup_layers:Mock.Random.integer(1, 10),
    units_num:Mock.Random.integer(1, 100),
    building_date: Mock.Random.date(),
    // city: Mock.mock('@county(true)'),
    // city:Mock.Random.city(),
    city:'某城市',
    // district:Mock.mock('@county(true)'),
    // district:Mock.Random.region(),
    district:'某地区',
    // address:Mock.mock('@county(true)'),
    address:'某地址',
    available:Mock.Random.integer(0,1)
  }));
}

export {  Buildings };