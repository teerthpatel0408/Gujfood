const mongoose = require('mongoose');
const mongoURI='mongodb+srv://Teerth:Teerth04@cluster0.cgy3lvf.mongodb.net/gujfoodmern?retryWrites=true&w=majority'
//const mongoURI='mongodb://Teerth:Teerth04@ac-kdbpm2e-shard-00-00.cgy3lvf.mongodb.net:27017,ac-kdbpm2e-shard-00-01.cgy3lvf.mongodb.net:27017,ac-kdbpm2e-shard-00-02.cgy3lvf.mongodb.net:27017/gujfoodmernssl=true&replicaSet=atlas-13q84i-shard-0&authSource=admin&retryWrites=true&w=majority'
const mongoDB = async () => {
        mongoose.set('strictQuery', false);
        await mongoose.connect(mongoURI, { useNewUrlParser: true ,useUnifiedTopology: true}, async (err, result)=>{
        if(err) console.log("---", err)
        else{
            console.log("connected");
            const fetched_data = await mongoose.connection.db.collection("food_items");
            //fetched_data.find({}).toArray(function(err, data) {
                fetched_data.find({}).toArray( async function(err,data){
                    const foodCategory = await mongoose.connection.db.collection("foodCategory");
                    foodCategory.find({}).toArray( function(err,catData){
                        if(err) console.log(err);
                        else{
                            global.food_items=data;
                            global.foodCategory=catData;
                            // console.log(global.food_items);
                        }
                    })
                    
                })
            }
        });
  };

module.exports=mongoDB;