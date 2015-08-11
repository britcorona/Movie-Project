define(['jquery', 'firebase'], function($, _firebase) {
  return {
    addMovie: function() {
      var ref = new Firebase("https://movie-project.firebaseio.com/movies");
      var title = $("#titleInput").val();
      console.log(title);
      $.ajax({
        url: "http://www.omdbapi.com/?t=" + title
      }).done(function(data) {
        ref.push({
          "title": data.Title,
          "actors": data.Actors,
          "year": data.Year,
          "seen-it": false,
          "rating": 0
        });
        $("#titleInput").val("");
      });
    }
  };
});