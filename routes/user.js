const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const nodemailer = require("nodemailer");
const verifyToken = require("../middleware/verify");

const mail = "akplmathan@gmail.com";
const pwd = "yszapxeudmbvfwav";

router.get("/", (req, res) => {
  try {
    res.send("user route is working....");
  } catch (error) {
    console.log(error);
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.send({ msg: "Fill the all required Fields.." });
    } else {
      const userExist = await User.findOne({ email: email });
      if (!userExist) {
        const Salt = await bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(password, Salt);
        const user = {
          name,
          email,
          password: hashPassword,
        };
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: mail,
            pass: pwd,
          },
        });

        const options = {
          from: '"Mathan" <akplmathan@gmail.com>',
          to: email,
          subject: "Welcome to Our Website",
          html: `
        <h2> welcome ${name} </h2>
        <p> hello how are you</p>
        `,
        };
        transporter.sendMail(options, (error, info) => {
          if (error) return console.log(error);
          console.log("Message sent: %s", info.messageId);
        });

        const data = await User.create(user);

        res.status(201).send({ msg: "Sign Up SuccessFully" });
      } else {
        res.send({ msg: "user already exist" });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const psCheck = bcrypt.compareSync(req.body.password, user.password);
      if (psCheck) {
        const token = jwt.sign({ id: user._id }, "hello");
        if (user.verified) {
          res.send({token,login:true });
        } else {
          res.send({ success:false ,token });

          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: mail,
              pass: pwd,
            },
          });
          const options = {
            from: '"Mathan" <akplmathan@gmail.com>',
            to: req.body.email,
            subject: "Verify the email",
            html: `
            <h2> welcome </h2>
            <p> click the URL to verify the email</p>
            <a href='https://main--fanciful-lamington-b67d69.netlify.app/api/verify/${token}'>verify email</a>
            `,
          };
          transporter.sendMail(options, (error, info) => {
            if (error) return console.log(error);
            console.log("Message sent: %s", info.messageId);
          });
        }
      } else {
        res.send({ msg: "password doesnt match" });
      }
    } else {
      res.send({ msg: "user not Found" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    await jwt.verify(token, "hello", async (err, decoded) => {
      if (err) {
        res.send({ msg: err.message });
      } else {
        await User.findByIdAndUpdate(decoded.id, { verified: true });
        res.send("go to the login page");
      }
    });
  } catch (error) {
    console.log(error);
  }
});
router.get("/data", verifyToken, async (req, res) => {
  try {
    const id = req.userId;
    const user = await User.findById(id).select('-password');
    res.json(user);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
