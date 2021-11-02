const Sequelize = require('sequelize');
const sequelize =  new Sequelize("xksizapa_TravelApp", "root", "xksizapa_travel", {
  host:"103.108.220.91",
  dialect:"mysql",
  password:"Drishti@123",
  ServerIP: '103.108.220.91'
});

+


sequelize.authenticate()
.then(()=>{
  console.log('Connection has been established')
})
.catch(err => {
  console.error('Unable to connect', err);
})

module.exports = sequelize;