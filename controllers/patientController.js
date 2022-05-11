import e from "express";
import Patient from "../models/PatientModel.js";

const addPatient = async (req, res) => {
  const patient = new Patient(req.body);
  patient.veterinarian = req.veterinarian._id;
  try {
    const savedPatient = await patient.save();
    res.json(savedPatient);
  } catch (error) {
    console.error(error);
  }
};

const getPatients = async (req, res) => {
  const patients = await Patient.find()
    .where("veterinarian")
    .equals(req.veterinarian);
  res.json(patients);
};

const getPatient = async (req, res) => {
  const { id } = req.params;
  const patient = await Patient.findById(id);

  if (!patient) {
    return res.status(404).json({ msg: "Not found" });
  }
  if (patient.veterinarian._id.toString() !== req.veterinarian._id.toString()) {
    return res.json({ msg: "no valid action" });
  }
  
  res.json(patient);
  
};

const updatePatient = async (req, res) => {
  const { id } = req.params;
  const patient = await Patient.findById(id);
  if (!patient) {
    return res.status(404).json({ msg: "Not found" });
  }
  if (patient.veterinarian._id.toString() !== req.veterinarian._id.toString()) {
    return res.json({ msg: "no valid action" });
  }
  // update patient
  patient.name = req.body.name || patient.name;
  patient.owner = req.body.owner || patient.owner;
  patient.email = req.body.email || patient.email;
  patient.dischargeDate = req.body.dischargeDate || patient.dischargeDate;
  patient.symptoms = req.body.symptoms || patient.symptoms;

  try {
    const patientUpdated = await patient.save();
    res.json(patientUpdated)
  } catch (error) {
    console.error(error)
  }
};
const deletePatient = async (req, res) => {
  const { id } = req.params;
  const patient = await Patient.findById(id);
  if (!patient) {
    return res.status(404).json({ msg: "Not found" });
  }
  if (patient.veterinarian._id.toString() !== req.veterinarian._id.toString()) {
    return res.json({ msg: "no valid action" });
  }

  try {
    await patient.deleteOne();
    res.json({msg: "Patient deleted"});
  } catch (error) {
    console.error(error);
  }
};

export { addPatient, getPatients, getPatient, updatePatient, deletePatient };
