const Medication = require("../models/Medication");
const {Op} = require("sequelize");

exports.getMedications = async (req, res) => {
    try{
        const medication = await Medication.findAll();
        res.status(200).json(medication);
    } catch(err){
        res.status(500).json(`Server error ${err.message}`);
    }

}

exports.getDrugs = async (req, res) => {
    try{
        const searchQuery = req.query.search || "";

        const drugs = await Medication.findAll({
            where: {
                medsName: {
                    [Op.like]: `%${searchQuery}%`
                }
            },
            limit: 5,
            order: [["medsName", "ASC"]]
        });
        res.status(200).json(drugs);
    } catch(err){
        res.status(500).json(`Server error ${err.message}`);
    }

}

exports.createMedications = async (req, res) => {
    try{
        const {medsName, description, dosage, quantity, available, price} = req.body;
        if(!medsName || !description || !dosage || !quantity || !available || !price){
            return res.status(401).json({message: "All credentials required"});
        }

        const medication = await Medication.create({medsName, description, dosage, quantity, available, price});
        res.status(201).json(medication); 
    }catch(err){
        res.status(500).json(`Server Failed! ${err}`);
    }
}

exports.getMedicationById = async (req, res) => {
    try{
        const medication = await Medication.findByPk(req.params.id);
        if(!medication) return res.status(401).json("Drug not found!");
        res.status(200).json(medication);
    }catch(err){
        res.status(500).json({err: err.message});
    }
}

exports.updateMedication = async (req, res) => {
    try{
        const {medsName, description, dosage, quantity, available, price} = req.body;

        const medication = await Medication.findByPk(req.params.id);
        if(!medication) return res.status(401).json("Drug not found!");

        await medication.update({medsName, description, dosage, quantity, available, price});
        res.status(200).json(medication);
    }catch(err){
        res.status(400).json({err: err.message});
    }
}

exports.deleteMedication = async (req, res) => {
    try{
        const medication = await Medication.findByPk(req.params.id);
        if(!medication) return res.status(404).json({msg: "Drug not Found"});
        
        await medication.destroy();
        res.status(204).json({msg: "Medication Deleted!"});
    }catch(err){
        res.status(500).json({err: err.message});
    }
}

