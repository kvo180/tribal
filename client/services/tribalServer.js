const tribalServer = function( $http ) {

  let socket = io();

  this.test = function() {
    return $http.get( '/test' );
  };

  this.addSong = (playlistHash, songUri) => {
    return $http.get('/addSong', {
      params: {
        playlistHash: playlistHash,
        songUri: songUri
      }
    });
  };

  this.insertVotes = function(vote) {
    console.log('where will i see this?', vote);
    return $http.get('/inputVotes', {
      params: {
        vote: vote
      }
    });
  };

  this.grabSongsFromPlaylist = function(hash) {
    return $http.get('/grabSongsData', {
      params: {
        playlist: hash
      }
    });
  };

  // get (new or existing) playlist from server
  this.getPlaylist = function( playlistId, callback ) {
    socket.emit( 'playlist', playlistId, callback );
  };

  // // request that the server add a song to the playlist
  // this.addSong = function( uri ) {
  //   socket.emit( 'add song', uri );
  // };

  this.registerSongAddedHandler = function( callback ) {
    socket.on( 'song added', callback );
  };

  this.spotifySearch = function(trackName) {
    return $http.get( '/tracks', {
      params: {
        trackName: trackName,
      }
    });
  };

  this.checkPlaylistHash = function(hash) {
    console.log('tribal server: ', hash);
    return $http.get('/playlist', {
      params: {
        playlist: hash
      }
    });
  };
};

angular.module('tribal').service('tribalServer', ['$http', tribalServer]);
