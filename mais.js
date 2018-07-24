var vm = new Vue({
  el: '#container-form',
  data: {
    distance: 0,
    spaceships: []
  },
  methods: {
    stopCalculator: function (event) {
      event.preventDefault()
      console.log('Você clicou para calcular as paradas.')
    }
  },
  created: function () {
    fetch('https://swapi.co/api/starships', {mode: 'cors'})
      .then(function getSpaceships (data) {
        data.json().then(function (jsonResponse) {
          while (jsonResponse.next != null){
            jsonResponse.results.map( function (currentValue) {
              vm.spaceships.push(currentValue)
            })
            return fetch(jsonResponse.next,{mode: 'cors'}).then(getSpaceships)
          }          
        })
      })
      .catch(function (error) {
        console.log(error)
      })
  }
})
