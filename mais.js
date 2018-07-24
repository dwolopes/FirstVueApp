var vm = new Vue({
  el: '#container-form',
  data: {
    msg:'Digite a distância',
    distance: 0,
    spaceships: []
  },
  methods: {
    _consumablesConvert: function(consumables){
      console.log(consumables)
    },
    stopCalculator: function () {
      if(vm.distance <= 0) return this.msg = 'A distância deve ser maior que Zero :('
      this.msg = 'Calculando...'
      let hoursPerDay = 24
      let mgltStringToInt = 0
      let mgltPerDay = 0
      let daysOfTravelTotal = 0;
      vm.spaceships.map(function(spaceship){
        mgltStringToInt = parseInt(spaceship.MGLT,10) 
        mgltPerDay = hoursPerDay * mgltStringToInt
        daysOfTravelTotal = Math.round(vm.distance/mgltPerDay)
        vm._consumablesConvert(spaceship.consumables)
      })
    }
  },
  created: function () {
    fetch('https://swapi.co/api/starships', {mode: 'cors'})
      .then(function getSpaceships (data) {
        // Retrieve all data from the API
        data.json().then(function (jsonResponse) {
          while (jsonResponse.next != null){
            jsonResponse.results.map( function (currentValue) {
              vm.spaceships.push(currentValue)
            })
            /*
            **The API has a attribute 'next' with the next's page URL.
            **Each page return 10 spaceships and after retrieve all ,
            **we include(push) them to the spachships'.
            */
            return fetch(jsonResponse.next,{mode: 'cors'}).then(getSpaceships)
          }          
        })
      })
      .catch(function (error) {
        console.log(error)
      })
  }
})
