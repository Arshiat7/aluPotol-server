const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middle ware
app.use(cors());
app.use(express.json())



const uri = "mongodb+srv://nabil786:L5MtU98rK5thJgmW@computerbuilder.xsiecyw.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
  try{
    await client.connect();
    const productCollection = client.db('alupotol').collection('AllProducts');
    const BlogCollection = client.db('alupotol').collection('Blog');
    const PinedCollection = client.db('alupotol').collection('Pined_Product');
    app.get('/allProducts' , async(req , res)=>{
      const query ={};
      const cursor = productCollection.find(query);
      const allProducts = await cursor.toArray();
      res.send(allProducts)
    });
    app.get('/product/:id', async (req , res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const singleProduct = await productCollection.findOne(query);
      res.send(singleProduct);

    });
    //Blog Getting
    app.get('/allBlog' , async(req , res) => {
      const query ={};
      const corsor = BlogCollection.find(query);
      const allBlog = await corsor.toArray();
      res.send(allBlog)
    });

    app.put('/deliveredproduct/:id', async(req, res) =>{
      const id = req.params.id;
      const updatedProduct = req.body;
      console.log(req.body);
      const filter = {_id: ObjectId(id)};
      const options = { upsert: true };
      const updatedDoc = {
          $set: {
            quantity: updatedProduct.newQuantity,
              
              }
          };
          const result = await productCollection.updateOne(filter, updatedDoc, options);
          res.send(result);

      })

    app.put('/product/:id' , async(req , res)=>{
      const id = req.params.id;
      const newQuantity = req.body;
      const filter = {_id: ObjectId(id)}
      const option ={upsert : true};
      const updateQuantity = {
        $set: {
          quantity : newQuantity.quantity
        }
      };
      const result = productCollection.updateOne(filter , updateQuantity ,option)
      res.send(result);

    })
    app.put('/updateProduct/:id' , async(req , res)=>{
      const id = req.params.id;
      const newData = req.body;
      console.log(newData.name)
      const filter = {_id: ObjectId(id)}
      const option ={upsert : true};
      const updateQuantity = {
        $set: {
          name : newData.name,
          img : newData.img,
          price : newData.price,
          quantity : newData.quantity,
          supplyre : newData.supplyre,
          date : newData.date
        }
      };
      const result = productCollection.updateOne(filter , updateQuantity ,option)
      res.send(result);

    })


    app.delete('/product/:id', async(req , res)=>{
      const id = req.params.id;
      const query ={_id: ObjectId(id)}
      const result = await productCollection.deleteOne(query)
      res.send(result)


    })
    app.delete('/userProduct/:id', async(req , res)=>{
      const id = req.params.id;
      const query ={_id: ObjectId(id)}
      const result = await PinedCollection.deleteOne(query)
      res.send(result)


    })

    app.post('/allProducts' , async(req , res)=> {
      const newProducts = req.body;
      const result = await PinedCollection.insertOne(newProducts);

      console.log(newProducts)
      res.send(result);
    });
    //added product 
    app.post('/addProduct' , async(req , res)=> {
      const newProducts = req.body;
      const result = await productCollection.insertOne(newProducts);
      console.log(newProducts)
      res.send(result);
    });
    app.post('/userProducts' , async(req , res)=> {
      const newProducts = req.body;
      console.log(newProducts)
      const query = { id : newProducts.id }
      const exists = await PinedCollection.findOne(query);
      if (exists) {
        return res.send({ success: false, booking: exists })
      }else{
        const result = await PinedCollection.insertOne(newProducts);
      console.log(newProducts)
      res.send(result);
      }
      
    });
    app.get('/myorders/:email', async (req, res) => {
      const email = req.query.email;
      const query = { email: email }
      const orders = await PinedCollection.find(query).toArray();
      res.send(orders)
  })

  }finally{
    //await client.close();
  }

}
run().catch(console.dir())

app.get('/' , (req, res)=>{
    res.send('server is running')
});
app.listen(port , ()=>{
    console.log(port , "listing port")
})