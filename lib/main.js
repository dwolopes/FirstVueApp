var vm = new Vue({
  el: '#container-form',
  data: {
    msg:'Digite a distância',
    distance: 0,
    spaceships: [],
    spaceshipsWithstopNecessaries: []
  },
  watch: {
    /* 
    ** distance is the main watched method to calculate the spaceship stops, rely on it
    ** receive the diferrent values of distance e calculate based on it the number of stops
    ** related to that distance among all spaceship
    */  
    distance: function (newDistance) {
      this.msg = 'Calculando... Fique atento, para haver naves precisamos de uma distância maior ou igual a 12600 mglt.';
      const hoursPerDay = 24;
      let mgltStringToInt, mgltPerDay,daysOfTravelTotal = 0;
      if(newDistance <= 0) {
        return this.msg = 'A distância deve ser maior que Zero :(';
      };
      /**
       * After recover spaceships' data inside created attribute, it is assigned
       * to a array and then it is mapped and filtered. The main goal here is
       * treat and calculate from each position of the array recovered from the API
       * its Stops. There is some spaceships without all neccessary data to calculate
       * the stops, those one are excluded from the recoverede array - spaceships -
       * before it goes to the - spaceshipsWithstopNecessaries - whose contain the 
       * final result.
       */
      vm.spaceshipsWithstopNecessaries = vm.spaceships.map(function(spaceship){
        mgltStringToInt = parseInt(spaceship.MGLT,10); 
        mgltPerDay = hoursPerDay * mgltStringToInt;
        daysOfTravelTotal = newDistance / mgltPerDay;
        totalDaysOfautonomy = vm._consumablesConvert(spaceship.consumables);
        stopNecessaries = Math.floor(daysOfTravelTotal / totalDaysOfautonomy);
        spaceship['stopNecessaries'] = stopNecessaries;
        return spaceship;
      }).filter(function(spaceship){
        if(spaceship.stopNecessaries){
          return spaceship;
        }
      })
    }
  },
  methods: {
    //Private Method responsible for converting consumables in autonomies days
    _consumablesConvert: function(consumables){
      arrayConsumables = consumables.split(' ');
      let numberRelatedToTheTime = parseInt(arrayConsumables[0]);
      let dayWeekOrMonth = arrayConsumables[arrayConsumables.length - 1];
      let totalDaysOfautonomy = 0;
      switch(dayWeekOrMonth.charAt(0)){
        case 'y':
          totalDaysOfautonomy = numberRelatedToTheTime * 365;
          break;
        case 'm':
          totalDaysOfautonomy = numberRelatedToTheTime * 30;
          break;
        case 'w':
          totalDaysOfautonomy = numberRelatedToTheTime * 7;
          break;
        case 'd':
          totalDaysOfautonomy = numberRelatedToTheTime;
          break;
        default:
        totalDaysOfautonomy = 0;
      }
      return totalDaysOfautonomy;
    },
  },
  created: function () {
    // Method responsible for retriving the spaceships and theis detailed.
    // The data is assigned to - spaceships - property.
    fetch('https://swapi.co/api/starships', {mode: 'cors'})
      .then(function getSpaceships (data) {
        // Retrieve all data from the API
        data.json().then(function (jsonResponse) {
          while (jsonResponse.next != null){
            jsonResponse.results.map( function (currentValue) {
              vm.spaceships.push(currentValue);
            })
            /**
             * The API has a attribute 'next' with the next's page URL.
             * Each page return 10 spaceships and after retrieve all ,
             * we include(push) them to the spachships'.
             */
            return fetch(jsonResponse.next,{mode: 'cors'}).then(getSpaceships);
          }          
        })
      })
      .catch(function (error) {
        console.log(error);
      })
  }
})
