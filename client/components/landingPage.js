angular.module('tribal')

.controller('LandingPageCtrl', function($location, tribalServer) {
  this.showForm = false;
  this.showError = false;
  this.showMain = false;
  this.showInit = true;
  this.playlistUri = '';
  this.playlistHash = $location.search().playlist;
  this.existingPlaylist = ($event) => {
    this.showForm = true;
  };
  this.clickCancel = ($event) => {
    this.showForm = false;
  };
  this.submitPlaylist = (hash) => {
    console.log('submit playlist input: ', hash);
    tribalServer.checkPlaylistHash(hash)
      .then(res => {
        console.log('uri: ', res.data);
        this.playlistUri = res.data;
        this.showMain = true;
        this.showInit = false;
        $location.search('playlist', hash);
      })
      .catch(err => {
        console.log('error: ', err);
        this.showError = true;
      });
  };
  if (this.playlistHash) {
    this.submitPlaylist(this.playlistHash);
  }
})

.directive('landingPage', function() {
  return {
    scope: {},
    restrict: 'E',
    controllerAs: 'ctrl',
    bindToController: true,
    controller: 'LandingPageCtrl',
    templateUrl: '/templates/landingPage.html'
  };
});