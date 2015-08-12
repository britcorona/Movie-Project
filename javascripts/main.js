requirejs.config({
  baseUrl: './javascripts',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'firebase': '../bower_components/firebase/firebase',
    'hbs': '../bower_components/require-handlebars-plugin/hbs',
    'lodash': '../bower_components/lodash/lodash.min',
    'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
    'jquery-ui': '../bower_components/jquery-ui/jquery-ui.min'
  },
  shim: {
    'bootstrap': ['jquery'],
    'firebase': {
    	exports: 'Firebase'
    }
  }
});

requirejs(["jquery", "bootstrap", "hbs", "firebase", "lodash", "add-movies", "jquery-ui"],
  function($, bootstrap, Handlebars, _firebase, _, addMovies, ui) {
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


//Movie Trailer Code    

    $("#titleInput").keypress(function(){
      $('#titleInput').autocomplete({
     source:
       function (query, process) {
        console.log(query.term);
         $.when(
           $.ajax({
               url: "http://www.omdbapi.com/?s=" + query.term
           })
         ).then(function (data) {
           var process_data = [];
           $.each(data.Search.slice(0, 4), function(i,item) {
              process_data.push( { title: item.Title, year: item.Year, label: item.Title, image: "http://img.omdbapi.com/?i=" + item.imdbID + "&apikey=8513e0a1"} );
              process( process_data );
             });
           });
       
     },
    
     select: function (e, ui) {
       e.preventDefault();
       $("#titleInput").val(ui.item.label);
       addMovies.addMovie();
     },
     messages: {
       noResults: '',
       results: function() {}
     }
   })
   .data('ui-autocomplete')._renderItem = function(ul, item) {
     return $('<li>')
         .data( "ui-autocomplete-item", item)
         .append('<a>' + '<img width="50" src="' + item.image + '" alt="" />' + '<span class="ui-autocomplete-artist">' + item.title  + '</span>' + '<span class="ui-autocomplete-divider"><i class="fa fa-minus"></i></span>' + '<span class="ui-autocomplete-album-name">' + item.year  + '</span>' + '<span class="ui-autocomplete-icon pull-right"><i class="fa fa-plus-circle fa-2x"></i></span>' + '</a>')
         .appendTo(ul);
    };
  }); 
// End of Movie Trailer Code 



  //Delete Button
    $( document ).on( "click", "#deleteButton", function() {
      var titleKey = $(this).parent().attr("key");
      console.log("titleKey", titleKey);
      var fb = new Firebase('https://movie-project.firebaseio.com/movies/' + titleKey);
      fb.remove();
    });


  //Seen-It Feature
    $( document ).on( "click", "#okButton", function() {
      var watchedKey = $(this).parent().attr("key");
      var seenIt = new Firebase('https://movie-project.firebaseio.com/movies/' + watchedKey);
      if ( $(this).parent().attr("seen") === "false" ) {
        seenIt.update({'seen-it': true});
      } else {
        seenIt.update({'seen-it': false});
      }
    });


  //Star Rating Feature
    $(document).on('click', '.rating span', function() {
      var value = $(this).attr('value');
      var starKey = $(this).parent().parent().attr('key');
      var rating = new Firebase('https://movie-project.firebaseio.com/movies/' + starKey);
      rating.update({'rating': value});
    });

    var $modal = $('.modal').modal({
      show: false
    });


  //Pop Up Box with Movie Info
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
            if (data.length > 0) {
              var trailerTitle = data[0].title.toLowerCase();
              if (trailerTitle.indexOf(title) !== -1) {
                $('#trailer').html(data[0].code);
              } else {
                $('#trailer').html('No trailer available');
              }
            } else {
              $('#trailer').html('No trailer available');
            }
            $modal.modal('show');
          });
          
        });
      });
    });

  });

