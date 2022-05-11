import mongoose from 'mongoose'

const patientSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  owner: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  dischargeDate: {
    type: Date,
    require: true,
    default: Date.now()
  },
  symptoms: {
    type: String,
    require: true,
  },
  veterinarian: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Veterinarian"
  },
},{
  timestams: true,
})

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;