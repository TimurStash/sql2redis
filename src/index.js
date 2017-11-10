import sequelize from './DB/sql';
import rc from './DB/redis';
import ntes from './helper/nullToEmptyString'

const FORM_ID = '9bc4a107-3ef5-4b22-aa2e-00001f3e3820';

async function queryFieldDefinitions(){
  try{
    const result = await sequelize.query(`SELECT * FROM iep.FormFieldDefinition`);
    return result;
  }
  catch(err){
    throw err;
  }
}

async function queryValues(){
  try{
    const result = await sequelize.query(`SELECT * FROM iep.FormFieldValue as FFV WHERE FFV.FormId = '${FORM_ID}'`);
    return result;
  }
  catch(err){
    throw err;
  }
}

async function populateRedisValues(values, meta){
  let command = rc.multi();
  values.forEach(val=>{
    command.sadd(`FFVIds:${FORM_ID}`, val.FormFieldValueId).
            hmset(`FFV:${val.FormFieldValueId}`,ntes(val));
    });

    try{
      const res = await command.execAsync();
      return res;
      console.log(res)
    }
    catch(err){
      throw err;
    }
}

async function populateRedisFields(fields, meta){
  let command = rc.multi();
  fields.forEach(fld=>{
    command.hmset(`FFD:${fld.FormFieldDefinitionId}`,ntes(fld));
  });

  try{
    const res = await command.execAsync();
    return res;
    console.log(res)
  }
  catch(err){
    throw err;
  }
}

(async ()=>{
  try{
    console.time('Migration data of one form to redis');
    const values = await queryValues();
    const fields = await queryFieldDefinitions();

    // const fieldsReplies = await populateRedisFields(...fields);
    // const valuesReplies = await populateRedisValues(...values);
    const [fieldsReplies, valuesReplies] = await Promise.all([
                                                              populateRedisFields(...fields),
                                                              populateRedisValues(...values)]);
    console.timeEnd('Migration data of one form to redis');
  }
  catch(err){
    throw err;
  }
})()
