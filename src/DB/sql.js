import Sequelize from 'sequelize';
import config from '../../config/config';


const sequelize = new Sequelize(config.sqlServerConnectionString);
sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.error('Unable to codnnect to the database:', err);
});

export default sequelize;