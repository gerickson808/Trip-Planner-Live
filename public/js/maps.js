function initialize_gmaps() {
  var $listPanel = $('.lists');
  var days = [];
  var day = 0;
  days[day] = {};
  // initialize new google maps LatLng object
  var myLatlng = new google.maps.LatLng(40.705189, -74.009209);

  // set the map options hash
  var mapOptions = {
    center: myLatlng,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    // styles: styleArr
  };

  // get the maps div's HTML obj
  var map_canvas_obj = document.getElementById('map-canvas');

  // initialize a new Google Map with the options
  var map = new google.maps.Map(map_canvas_obj, mapOptions);

  // add the marker to the map
  var marker = new google.maps.Marker({
    position: myLatlng,
    title: 'Hello World!'
  });
  //Add items on click
  $listPanel.on('click','button', function(){
    var $option = $(this).siblings('select').find('option:selected');
    var type = $option[0].className;
    var name = $option[0].innerText;
    if(!days[day][name]) addItems(name, type);
  });

  //
  function addItems(name, type) {
    //add to list
    var listItem = formatSelection(name,type);
    $('.'+type+'-list').append(listItem);
    //add to map
    var thing = getObject(name,type);
    var location = thing.place[0].location;
    var marker = markerType(type);
    drawLocation(location, marker, name, type);
  }

  //Format selected option for adding
  function formatSelection(name, type){
    return "<div class='itinerary-item'><span class='title'>"+name+"</span><button class='btn btn-xs btn-danger remove btn-circle'>x</button></div>";
  }

  //Find thing object from dumb array
  function getObject(name,type){
    object = window[type].filter(function(obj){
      return obj.name === name;
    });
    return object[0];
  }

  //Pick an icon, any icon
  function markerType(type){
    var source;
    switch (type){
      case "hotels":
        source = '/images/lodging_0star.png';
        break;
      case "restaurants":
        source = '/images/restaurant.png';
        break;
      default:
        source = '/images/star-3.png';
    }
    return {icon: source};
  }
  //Remove list items!!
  $('.panel-body').on('click','.remove', function(){
    var $entry = $(this).parent();
    removeitems($entry);
  });

  //remove items
  function removeitems(entry){
    var name = deleteListEntryAndMarker(entry);
    days[day][name] = null;
  }

  function deleteListEntryAndMarker(entry){
    var $name = $(entry).find('span').text();
    days[day][$name].marker.setMap(null);
    console.log("entry", entry);
    entry.remove();
    return $name;
  }

  // draw some locations on the map
  function drawLocation(location, opts, name, type) {
    if (typeof opts !== 'object') {
      opts = {};
    }
    opts.position = new google.maps.LatLng(location[0], location[1]);
    opts.map = map;
    var marker = new google.maps.Marker(opts);
    days[day][name] = {marker: marker, type: type}
    console.log("Days[day]["+name+"] JUST ASSIGNED AS",days[day][name]);
    console.log("Days[day] is now", days[day])
  }

  //remove days

$("#day-title").on("click", ".remove", function(){
  var $daytoRemove = $('.current-day');
  var dayNum = day;
  if(day!=0) $daytoRemove.prev().click();
  else if(days.length === 1) return;
  else {
    $daytoRemove.next().click();
    $('.day-btn').removeClass('current-day');
    $daytoRemove.addClass('current-day');
    day = 0;
  }
  $('.add-day').prev().remove();
  console.log($daytoRemove.prev());
  days.splice(dayNum,1);
})


  //add days buttons
  $(".add-day").on("click", function(){
    var num = $(".day-buttons").children().length;
    $(this).before('<button class="btn btn-circle day-btn">' + num +'</button>');
  });

  //switch days
  $(".day-buttons").on("click", ".day-btn", function(){
      deleteList();
      $(".current-day").removeClass("current-day");
      $(this).addClass("current-day");
      day = Number($(this).text())-1;
      console.log("switch", days[day]);
      if(!days[day]) days[day] = {};
      console.log(day);
      addEventsforDay();
  });

  //delete list entry and marker
  function deleteList(){
    var $listItems = $('.list-group').children()
    $listItems.each(function(index, listItem){
    console.log(listItem);
        deleteListEntryAndMarker(listItem);
    });
  }

  //loop through events in current day and add markers
  function addEventsforDay(){
    for(var name in days[day]){
      console.log("add", name, days[day]);
      addItems(name, days[day][name].type);
    }
  }
}

$(document).ready(function() {
  initialize_gmaps();

});
