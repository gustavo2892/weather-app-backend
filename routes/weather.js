var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET users listing. */
router.get('/', function (req, res, next) {

  var city = req.query.city;
  var stateCity = req.query.stateCity;

  let location = req.query.city + " " + req.query.stateCity;

  axios.get(`http://maps.googleapis.com/maps/api/geocode/json?address=${location}`)
    .then(resData => {

      if (resData.data.status == 'OVER_QUERY_LIMIT') {

        let error = "OVER_QUERY_LIMIT";
        let result = {
          error: error
        }
        res.status(200).send(result);

      } else if (resData.data.status == 'ZERO_RESULTS') {

        let error = "ZERO_RESULTS";
        let result = {
          error: error
        }
        res.status(200).send(result);

      } else {

        let latitude = resData.data.results[0].geometry.location.lat;
        let longitude = resData.data.results[0].geometry.location.lng;
        let finalLocation = resData.data.results[0].formatted_address;

        axios.get(`https://api.darksky.net/forecast/fe2b0d186b49f45b6093e3862eb63051/${latitude},${longitude}`)
          .then(resData => {
            console.log("Resposta Dark Sky: " + resData);
            let temperature = (((resData.data.currently.temperature) - 32) / 1.8).toFixed(0);
            let iconTemperature = resData.data.currently.icon;

            let result = {
              temperature: temperature + 'ºC',
              iconTemperature: iconTemperature,
              city: city,
              stateCity: stateCity,
              error: 'OK'
            }
            res.status(200).send(result);
          })
        .catch(err => console.log('Erro 01 Api Dark Sky: ' + err));
}})
  .catch(err => console.log('Erro 02: ' + err));
})
module.exports = router;
