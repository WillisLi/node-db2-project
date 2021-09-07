const Cars = require('./cars-model')
const db = require('../../data/db-config')
const vinValidator = require('vin-validator');

const checkCarId = (req, res, next) => {
  const carId = req.params.id;
  Cars.getById(carId)
    .then(car => {
      if (car) {
        req.car = car
        next();
      } else {
        res.status(404).json( { message: `car with id ${carId} is not found` } )
      }
    })
    .catch(next)
}

const checkCarPayload = (req, res, next) => {
  const error = { status: 400}
  const carBody = req.body;
  if (!carBody.vin) {
    error.message = "vin is missing"
    next(error)
  } else if (!carBody.make) {
    error.message = "make is missing"
    next(error)
  } else if (!carBody.model) {
    error.message = "model is missing"
    next(error)
  } else if (!carBody.mileage) {
    error.message = "mileage is missing"
    next(error)
  } 

  if (error.message) {
    next(error)
  } else {
    next()
  }
}

const checkVinNumberValid = (req, res, next) => {
  const vin = req.body.vin;
  const isValidVin = vinValidator.validate(vin);
  if (isValidVin) {
    next()
  } else {
    res.status(400).json( { message: `vin ${vin} is invalid` } )
  }
}

const checkVinNumberUnique = (req, res, next) => {
  const vin = req.body.vin;
  db('cars').where('vin', vin).first()
    .then(exists => {
      if (exists) {
        next( { status: 400, message: `vin ${vin} already exists`} )
      } else {
        next();
      }
    })
    .catch(next);
}

module.exports = { checkCarId, checkCarPayload, checkVinNumberValid, checkVinNumberUnique }