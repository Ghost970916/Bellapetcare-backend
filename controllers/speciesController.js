const Species = require("../models/Species")
const ApiResponse = require("../utils/apiResponse")

exports.getAllSpecies = async (req, res) => {
  try {
    const species = await Species.find({ isActive: true })
    return ApiResponse.success(res, species)
  } catch (error) {
    return ApiResponse.error(res, error.message)
  }
}

exports.getSpeciesById = async (req, res) => {
  try {
    const species = await Species.findById(req.params.id)
    if (!species) {
      return ApiResponse.error(res, "Species not found", 404)
    }
    return ApiResponse.success(res, species)
  } catch (error) {
    return ApiResponse.error(res, error.message)
  }
}

exports.createSpecies = async (req, res) => {
  try {
    const species = new Species(req.body)
    await species.save()
    return ApiResponse.success(res, species, "Species created successfully", 201)
  } catch (error) {
    return ApiResponse.error(res, error.message)
  }
}

exports.updateSpecies = async (req, res) => {
  try {
    const species = await Species.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!species) {
      return ApiResponse.error(res, "Species not found", 404)
    }
    return ApiResponse.success(res, species, "Species updated successfully")
  } catch (error) {
    return ApiResponse.error(res, error.message)
  }
}

exports.deleteSpecies = async (req, res) => {
  try {
    const species = await Species.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })
    if (!species) {
      return ApiResponse.error(res, "Species not found", 404)
    }
    return ApiResponse.success(res, null, "Species deleted successfully")
  } catch (error) {
    return ApiResponse.error(res, error.message)
  }
}

