const express = require("express");
const router = express.Router();
const fs = require("fs");
const Template = require("../../models/Template");
const bodyParser = require("body-parser");
const auth = require('../../middleware/auth')
const { check, validationResult } = require("express-validator");

router.use(bodyParser.json());
router.use(bodyParser.json({ limit: "10mb" }));

// router.get("/", async (req, res) => {
//   try {
//     let template = await Template.findAll();
//     for (let i = 0; i < template.length; i++) {
//       const file = await fs.readFileSync(
//         `./images/templates/${template[i].template_name}`
//       );
//       template[i].template_name = `data:text/html;base64`+file.toString("base64");
//       console.log(template[i].template_name);
//     }
//     res.json({ template });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server Error");
//   }
// });

router.get("/", auth, async (req, res) => {
  // console.log(req.email)
  try {
    let template = await Template.findAll();
    for (let i = 0; i < template.length; i++) {
      const file = await fs.readFileSync(
        `./images/templates/${template[i].template_name}`
      );
      template[i].template_name = file.toString("base64");
    }
    res.status(200).json({ template });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.post(
  "/addTemplate",
  [check("url", "Please select a template").not().isEmpty()], auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { url, name } = req.body;
      let template_name = Date.now()+`_${name}`;
      const base64data = url.replace(/^data:.*,/,'');
      fs.writeFile(`./images/templates/${template_name}`, base64data, 'base64', (err)=>{
        if(err) {
          console.log(err);
        }
      })

      Template.create({
        template_name,
        template_url: url
      })

      res.json({ msg: "Data Added Successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
