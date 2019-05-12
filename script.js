var app = angular.module("starWars", []);

var movieStars = [{
    name: "Luke Skywalker",
    url: "https://swapi.co/api/people/1/"
  }, {
    name: "Darth Vader",
    url: "https://swapi.co/api/people/4/"
  }, {
    name: "Obi-wan Kenobi",
    url: "https://swapi.co/api/people/unknown/"
  }, {
    name: "R2-D2",
    url: "https://swapi.co/api/people/2/"
  }];

app.factory("Films", ['$http',function FilmsFactory($http) {
	return function(url) {
		return $http.get(url);
	};
}]);

app.controller("CharactersController", ['$scope','Films',function($scope, Films) {
	$scope.characters=movieStars;
	$scope.selectedCharacter;
	$scope.films=[];
	$scope.doneRetrievingFilms=false;
	$scope.isSelectedCharacter=function(character) {
		return $scope.selectedCharacter===character;
	}
	$scope.setCharacter = function(character) {		
		$scope.selectedCharacter=character;
		$scope.setCharacterFilms();
	};
	$scope.setCharacterFilms = function() {
		$scope.films=[];
		$scope.doneRetrievingFilms=false;
		let filmUrls=null;
		Films($scope.selectedCharacter.url)
			.success(function(data) {
				filmUrls=data.films;
				for (let i=0; i<filmUrls.length; i++) {
					Films(filmUrls[i]).success(function(data) {
						$scope.films.push(data);
						if (i===filmUrls.length-1)
							$scope.doneRetrievingFilms=true;
					});
				}		
			}).error(function(error,status){
				if (status===404)
				$scope.doneRetrievingFilms=true;
			}); 
		
		
	};
}]);