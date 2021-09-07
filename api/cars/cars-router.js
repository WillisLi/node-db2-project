const router = require('express').Router();
const Cars = require('./cars-model')
const { checkCarId, checkCarPayload, checkVinNumberValid, checkVinNumberUnique } = require('./cars-middleware');

router.get('/', (req, res, next) => {
    Cars.getAll()
        .then(carsList => {
            res.json(carsList)
        })
        .catch(next)
})

router.get('/:id', checkCarId, (req, res) => {
    res.json(req.car);
})

router.post('/', checkCarPayload, checkVinNumberValid, checkVinNumberUnique, (req, res, next) => {
    Cars.create(req.body)
        .then(newCar => {
            res.status(201).json(newCar)
        })
        .catch(next);
})

router.use((err, req, res, next) => { // eslint-disable-line
    res.status(err.status || 500).json({
      custom: `Something is wrong`,
      message: err.message,
      stack: err.stack,
    }); 
  })

module.exports = router;
