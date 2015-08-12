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
        $('div').filter('[seen="true"]').css('opacity', "0.4");
        $('.rating').filter('[rating="2"]').addClass('two');
        $('.rating').filter('[rating="4"]').addClass('four');
        $('.rating').filter('[rating="6"]').addClass('six');
        $('.rating').filter('[rating="8"]').addClass('eight');
        $('.rating').filter('[rating="10"]').addClass('ten');
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
      var seenIt = new Firebase('https://movie-project.firebaseio.com/movies/' + watchedKey);
      if ( $(this).parent().attr("seen") === "false" ) {
        seenIt.update({'seen-it': true});
      } else {
        seenIt.update({'seen-it': false});
      }
    });

    $(document).on('click', '.rating span', function() {
      var value = $(this).attr('value');
      var starKey = $(this).parent().parent().attr('key');
      var rating = new Firebase('https://movie-project.firebaseio.com/movies/' + starKey);
      rating.update({'rating': value});
    });

    var $modal = $('.modal').modal({
      show: false
    });

    require(['hbs!../templates/modal'], function(modalTemplate) {
      $(document).on('click', '.movie-name > img', function() {
        var modalKey = $(this).parent().attr("key");
        var modalInfo = new Firebase('https://movie-project.firebaseio.com/movies/' + modalKey);
        modalInfo.on('value', function(snapshot) {
          var movieInfo = snapshot.val();
          console.log(movieInfo);
          var title = movieInfo.title.toLowerCase();
          $.ajax({
            url: "http://trailersapi.com/trailers.json?movie="+title+"&limit=5"
          }).done(function(data) {
            console.log(data);
            $('#movie-modal').html(modalTemplate(movieInfo));
            $('#trailer').html(data[0].code);
            $modal.modal('show');
          });
          
        });
      });
    });

  });

