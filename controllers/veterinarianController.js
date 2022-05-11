import Veterinarian from "../models/VeterinarianModel.js";
import generateJWT from "../helpers/generateJWT.js";
import generateId from "../helpers/generateId.js";
import emailRegister from "../helpers/emailRegister.js";
import emailForgotPassword from "../helpers/emailForgotPassword.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const userExist = await Veterinarian.findOne({ email });

  if (userExist) {
    const error = new Error("already registered user");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const vet = new Veterinarian(req.body);
    const vetSaved = await vet.save();

    emailRegister({
      email,
      name,
      token: vetSaved.token,
    });

    res.send(vetSaved);
  } catch (error) {
    console.error(error);
  }
};

const profile = (req, res) => {
  const { veterinarian } = req;
  res.json(veterinarian);
};

const confirm = async (req, res) => {
  const { token } = req.params;
  const confirmUser = await Veterinarian.findOne({ token });
  if (!confirmUser) {
    const error = new Error("Token no valid");
    return res.status(404).json({ msg: error.message });
  }
  try {
    confirmUser.token = null;
    confirmUser.confirmed = true;
    await confirmUser.save();

    res.json({ msg: "The user has been confirmed" });
  } catch (error) {
    console.error(error);
  }
};

const authenticate = async (req, res) => {
  const { email, password } = req.body;
  const user = await Veterinarian.findOne({ email });
  if (!user) {
    const error = new Error("User not exist");
    return res.status(403).json({ msg: error.message });
  }

  if (!user.confirmed) {
    const error = new Error("Your account hasn't been confirmed");
    return res.status(403).json({ msg: error.message });
  }

  if (await user.checkPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateJWT(user.id),
    });
  } else {
    const error = new Error("Password not correct");
    return res.status(403).json({ msg: error.message });
  }
};

const recoverPassword = async (req, res) => {
  const { email } = req.body;
  const theVetExists = await Veterinarian.findOne({ email });
  if (!theVetExists) {
    const error = new Error("The Vet not exists");
    return res.status(400).json({ msg: error.message });
  }

  try {
    theVetExists.token = generateId();
    await theVetExists.save();

    emailForgotPassword({
      email,
      name: theVetExists.name,
      token: theVetExists.token,
    });

    res.json({
      msg: "We have sent you an email with instructions to recover your password",
    });
  } catch (error) {
    console.error(error);
  }
};

const checkToken = async (req, res) => {
  const { token } = req.params;
  const tokenValid = await Veterinarian.findOne({ token });
  if (tokenValid) {
    res.json({ msg: "Token valid, the user exists" });
  } else {
    const error = new Error("Token no valid");
    return res.status(404).json({ msg: error.message });
  }
};

const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const vet = await Veterinarian.findOne({ token });
  if (!vet) {
    const error = new Error("The token isn't valid");
    return res.status(400).json({ msg: error.message });
  }

  try {
    vet.token = null;
    vet.password = password;
    await vet.save();
    res.json({ msg: "Your password has been successfully updated" });
    console.log(vet);
  } catch (error) {
    console.error(error);
  }
};

const updateProfile = async (req, res) => {
  const veterinarian = await Veterinarian.findById(req.params.id);
  if (!veterinarian) {
    const error = new Error("There was a error");
    return res.status(400).json({ msg: error.message });
  }

  const { email } = req.body;
  if (veterinarian.email !== email) {
    const existEmail = await Veterinarian.findOne({ email });
    if (existEmail) {
      const error = new Error("That email is already in use");
      return res.status(400).json({ msg: error.message });
    }
  }

  try {
    veterinarian.name = req.body.name;
    veterinarian.email = req.body.email;
    veterinarian.web = req.body.web;
    veterinarian.phone = req.body.phone;

    const veteterinarianUpdated = await veterinarian.save();
    return res.json(veteterinarianUpdated);
  } catch (error) {
    console.error(error);
  }
};

const updatePassword = async (req, res) => {
  const { id } = req.veterinarian;
  const { currentPassword, newPassword } = req.body;

  const veterinarian = await Veterinarian.findById(id);
  if (!veterinarian) {
    const error = new Error("There was a error");
    return res.status(400).json({ msg: error.message });
  }

  if (await veterinarian.checkPassword(currentPassword)) {
    veterinarian.password = newPassword;
    await veterinarian.save();

    return res.json({
      msg: "Password saved successfully",
    });
  } else {
    const error = new Error("Wrong current password");

    return res.status(400).json({ msg: error.message });
  }
};

export {
  register,
  profile,
  confirm,
  authenticate,
  recoverPassword,
  checkToken,
  newPassword,
  updateProfile,
  updatePassword,
};
