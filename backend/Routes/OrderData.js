require('dotenv').config();

const express = require('express')
const router=express.Router()
const Order=require('../models/Orders')
const nodemailer =require('nodemailer')
const {google} = require('googleapis')

const CLIENT_ID='755346135325-f8jt3s7n7flahkqp938c2uovo7s0a50b.apps.googleusercontent.com'
const CLIENT_SECRET='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'
const REDIRECT_URI='https://developers.google.com/oauthplayground'
const REFRESH_TOKEN='1//04XKA8EnsZi8wCgYIARAAGAQSNwF-L9Iripen8SHa6Zwvv3XmW-wQ4db4sNWnbrh1aXG92mFu6xiUyk7Hj72s0mD47iIYwHF-63E'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})

// const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

async function sendMail(mail){
    try {
        const accessToken=await oAuth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
             service:'gmail',
             auth:{
                type:'OAuth2',
                user:'teerthpatel0408@gmail.com',
                clientId:CLIENT_ID,
                clientSecret:CLIENT_SECRET,
                refreshToken:REFRESH_TOKEN,
                accessToken:accessToken
             }
        })

        const mailOptions={
            from:'GUJFOOD <teerthpatel0408@gmail.com>',
            to:mail,
            subject:"GUJFOOD delivery",
            text:'Hello from gujfood email using api',
            html: '<h1>Your order has been placed and will be delivered successfully</h1>'
        };

        const result= await transport.sendMail(mailOptions)
        return result

    } catch (error) {
        return error
    }
}

// async function payment(){
//     try {
//         console.log("payment initiated");
//         const session = await stripe.checkout.sessions.create({
//             success_url: 'https://example.com/success',
//             line_items: [
//               {price: 'price_H5ggYwtDq4fbrJ', quantity: 2},
//             ],
//             mode: 'payment',
//           });
//           return { url: session.url }
//     } catch (error) {
//         return error;
//     }
// }

// router.post('/checkout_payment',async(req,res)=>{
//     try {
//         const session = await stripe.checkout.sessions.create({
//             success_url: 'https://example.com/success',
//             line_items: [
//               {price: 'price_H5ggYwtDq4fbrJ', quantity: 2},
//             ],
//             mode: 'payment',
//           });
//           console.log(session.url);
//         res.json({ url: session.url })
//     } catch (error) {
//         res.status(500).json({ error: error.message })
//     }
// })
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

const storeItems = new Map([
  [1, { priceInCents: 10000, name: "Pizza" }],
  [2, { priceInCents: 20000, name: "Sweat" }],
])

router.post("/payment", async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.create({
        success_url: 'https://www.beauty-addict.com/wp-content/uploads/2021/02/Payment-success.png',
        payment_method_types: ["card"],
        mode: "payment",
        line_items: req.body.items.map(item => {
          const storeItem = storeItems.get(item.id)
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: storeItem.name,
              },
              unit_amount: storeItem.priceInCents,
            },
            quantity: item.quantity,
          }
        }),
      
      })
      res.json({ url: session.url })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

router.post('/orderData', async (req, res) => {
    let data = req.body.order_data
    await data.splice(0,0,{Order_date:req.body.order_date})
   
    //if email not exisitng in db then create: else: InsertMany()
    let eId = await Order.findOne({ 'email': req.body.email })    
    console.log(eId)
    if (eId===null) {
        try {
            console.log(data)
           
            await Order.create({
                email: req.body.email,
                order_data:[data]
            }).then(() => {
                res.json({ success: true })
            })

           

            sendMail(req.body.email).then(result=>console.log('email sent..', result))
            .catch(error=>console.log(error.message));


        } catch (error) {
            console.log(error.message)
            res.send("Server Error", error.message)

        }
    }

    else {
        try {
            await Order.findOneAndUpdate({email:req.body.email},
                { $push:{order_data: data} }).then(() => {
                    res.json({ success: true })
                })
            
                

            sendMail(req.body.email).then(result=>console.log('email sent..', result))
            .catch(error=>console.log(error.message));
    
            // res.redirect('/checout_payment');
        } catch (error) {
            console.log(error.message)
            // res.send("Server Error", error.message)
            res.status(500).send("server error");
        }
    }
})

router.post('/myOrderData', async (req, res) => {
    try {
        let myData=await Order.findOne({'email':req.body.email})
        res.json({orderData:myData})
    } catch (error) {
        console.log(error.message)
        res.send("Server Error", error.message)
    }
})
module.exports=router;