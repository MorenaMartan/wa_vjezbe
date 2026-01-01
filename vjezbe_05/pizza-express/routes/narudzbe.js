import express from `express`;

const router=express.Router();


router.post('/', async (req, res) => {
    try{
        const db=req.app.local.db;
        const {ime, adresa, telefon, narucene_pizze}=req.body;

        if(
            typeof ime!=="string" ||
            typeof adresa!=="string" ||
            typeof telefon===isNaN ||
            !Array.isArray(narucene_pizze)
        ){
            return res.status(400).json({message: `Unijeli ste neispravne podatke!`});
        }

        let ukupnaCijena=0;

        for(const s of narucene_pizze){
            const pizza=await db.collection("pizze").findOne({
                neziv:{$regex:`^${stavka.naziv}$`, $options: "i" },
            });

            if (!pizza){
                return res.status(400).json({message: "Ne postoji ta pizza u ponudi."})
            }
            
            const cijena=pizza.cijene[s.velicina];
            ukupnaCijena+=cijena*s.kolicina;
        }
        ukupnaCijena=Number(ukupnaCijena.toFixed(2));

        const narudzba = {
                ime,
                adresa,
                telefon,
                narucene_pizze,
                ukupna_cijena,
                created_at: new Date(),
                };
        await db.collection("narudzbe").insertOne(narudzba);

            res.status(201).json(narudzba);
        } catch (err) {
            res.status(500).json({ message: "Greška pri kreiranju narudžbe" });
        }
});

export default router;