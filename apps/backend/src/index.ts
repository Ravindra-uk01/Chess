import express from "express";

const PORT = process.env.PORT;
console.log("port is PORT ", PORT)
const app = express();

app.get('/', (req, res)=>{
    return res.json({
        "message": "working fine",
        "status": 'success'
    })
})

app.listen(3000, ()=>{
    console.log(`server is listening in port ${PORT} `);
})