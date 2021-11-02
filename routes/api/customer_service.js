const express = require("express");
const router = express.Router();
const Service = require('../../models/Service');
const {check, validationResult} = require("express-validator")

router.post('/addService', [
  check('service_data',"Please enter the service field").not().isEmpty(),
  check('business_id',"Please select the Business Category").not().isEmpty()
], async(req, res)=> {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try {
    const {user_id, business_id, service_data} = req.body;
    console.log(req.body)

    Service.create({
      user_id,
      business_id,
      service_data
    })

    res.json({msg: "Data added successfully!"});
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
})

router.post('/getService', async(req, res) => {
  try {
    const {user_id} = req.body;
    console.log(user_id)
    let service = await Service.findAll({where: {
      user_id
    }})

    res.json({service})
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
})

router.delete('/deleteService/:id', async (req, res)=> {
  try {
    const service_id = req.params.id;

    Service.destroy({where:{
      service_id
    }})

    res.json({msg:"Deleted Successfully!"})
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
})

module.exports = router;