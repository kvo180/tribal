const tribalServer = function( $http ) {

  let socket = io();

  this.test = function() {
    return $http.get( '/test' );
  };

  this.addSong = (playlistHash, songUri, artist, title, url, duration) => {
    console.log('addSong');
    socket.emit('add song', { _id: playlistHash, songArtist: artist, songTitle: title });
    return $http.get('/addSong', {
      params: {
        playlistHash: playlistHash,
        songUri: songUri,
        artist: artist,
        title: title,
        url: url,
        duration: duration
      }
    });
  };

  this.updatePlaylistSongs = (callback) => {
    console.log('updatePlaylistSongs: ', callback);
    socket.on('song added', callback);
  };

  this.registerReorder = (callback) => {
    console.log('registerReorder: ', callback);
    socket.on('reordered', callback);
  };

  this.insertVotes = function(vote, songId, hash, $index, callback) {
    // socket.emit('voting', vote, songId, hash, $index, callback);
    socket.emit('reorder', hash);
    return $http.get('/inputVotes', {
      params: {
        vote: vote,
        songId: songId,
        hash: hash,
        index: $index
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

  this.registerVote = function(callback) {
    socket.on('voted', callback);
  };
  // get (new or existing) playlist from server
  this.getPlaylist = function(hash) {
    console.log('get playlist: ', hash);
    socket.emit('playlist', hash);
    return $http.post('/playlistStatus', { playlist: hash });
  };

  // // request that the server add a song to the playlist
  // this.addSong = function( uri ) {
  //   socket.emit( 'add song', uri );
  // };

  this.registerSongAddedHandler = function(callback) {
    socket.on('song added', callback);
  };

  this.spotifySearch = function(trackName) {
    return $http.get( '/tracks', {
      params: {
        trackName: trackName,
      }
    });
  };

  this.checkPlaylistHash = function(hash) {
    return $http.get('/playlist', {
      params: {
        playlist: hash
      }
    });
  };

  this.emitStartParty = () => {
    socket.emit('start');
  };

  this.startParty = function(playlistHash, currentSongIndex) {
    console.log('tribalServer startParty: ', playlistHash);
    return $http.post('/play', { playlist: playlistHash, currentSongIndex: currentSongIndex });
  };

  this.resumeSong = function(playlistHash) {
    console.log('tribalServer playSong: ', playlistHash);
    socket.emit('resume');
    return $http.post('/resume', { playlist: playlistHash });
  };

  this.pauseSong = function(playlistHash) {
    console.log('tribalServer pauseSong: ', playlistHash);
    socket.emit('pause');
    return $http.post('/pause', { playlist: playlistHash });
  };

  this.songEnded = () => {
    socket.emit('songEnded');
    socket.emit('removeLastPlayed');
  };

  this.playlistEnded = () => {
    socket.emit('playlistEnded');
  };

  this.updateCurrentSong = (playlistHash, currentSongIndex) => {
    console.log('tribalServer updateCurrentSong: ', playlistHash);
    return $http.get('/currentSong', {
      params: {
        playlist: playlistHash,
        currentSongIndex: currentSongIndex
      }
    });
  };

  this.removeLastPlayed = (callback) => {
    console.log('removeLastPlayed: ', callback);
    socket.on('remove last song', callback);
  };

  this.registerStartParty = function(callback) {
    console.log('registerStartParty: ', callback);
    socket.on('starting', callback);
  };

  this.registerPlay = function(callback) {
    console.log('registerPlay: ', callback);
    socket.on('resuming', callback);
  };

  this.registerPause = function(callback) {
    console.log('registerPause: ', callback);
    socket.on('paused', callback);
  };

  this.registerCurrentSong = (callback) => {
    console.log('registerCurrentSong:', callback);
    socket.on('currentSong', callback);
  };

  this.registerRestartPlaylist = (callback) => {
    console.log('registerRestartPlaylist:', callback);
    socket.on('restart playlist', callback);
  };

  // this.getCurrentSong = function(playlistHash, currentSongIndex) {
  //   console.log('getCurrentSong: ', playlistHash);
  //   return $http.post('/currentSong', { playlist: playlistHash, currentSongIndex: currentSongIndex });
  // };
};

angular.module('tribal').service('tribalServer', ['$http', tribalServer]);
