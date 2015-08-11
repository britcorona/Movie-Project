requirejs.config({
  baseUrl: './javascripts',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'firebase': '../bower_components/firebase/firebase',
    'hbs': '../bower_components/require-handlebars-plugin/hbs',
    'lodash': '../bower_components/lodash/lodash.min',
    'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min'
  },
  shim: {
    'bootstrap': ['jquery'],
    'firebase': {
    	exports: 'Firebase'
    }
  }
});

requirejs(["jquery", "bootstrap", "hbs", "firebase", "lodash", "add-movies"],
  function($, bootstrap, Handlebars, _firebase, _, addMovies) {
    var ref = new Firebase("https://movie-project.firebaseio.com/");
    require(['hbs!../templates/movie-list'], function(movieTemplate) {
      ref.on('value', function(snapshot) {
        var movies = snapshot.val();
        console.log(movies);
        $('#movieList').html(movieTemplate(movies));
      });
    });

    $('#addMovie').click(function() {
      console.log('click');
      addMovies.addMovie();

    });

    $( document ).on( "click", "#deleteButton", function() {
      var titleKey = $(this).parent().attr("key");
      console.log("titleKey", titleKey);
      var fb = new Firebase('https://movie-project.firebaseio.com/movies/' + titleKey);
      fb.remove();
    });


    $( document ).on( "click", "#okButton", function() {
      var watchedKey = $(this).parent().attr("key");
      console.log("watchedKey", watchedKey);
      var seenIt = new Firebase('https://movie-project.firebaseio.com/movies/' + watchedKey);
      seenIt.push();
      $(this).parent().css("opacity", "0.4");
    
    });

  });

