import express from `express`;
import {pizze} from `../data/data.js`;
const router=express.Router();


router.get(`/`, (req,res)=>{
    if (pizze.length===0 || !pizze){
        return res.status(404).json({message:`Nema dostupnih pizza.`});
    }
    res.status(200).json(pizze)
});


router.get(`/:naziv`, (req,res)=>{
    const trazena=req.params.naziv;
    const pizza=pizze.find(i=>i.naziv.toLowerCase()===trazena.toLowerCase())

    if(!pizza){
        return res.status(404).json({message:`Pizza nije pronađena`});
    }
    res.status(200).json(pizza);
})

export default router;