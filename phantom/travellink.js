
var fs = require('fs');
var system = require('system');
var argv = system.args;
var now = new Date();
var today = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
// Range:
var total = 0;
var begin_day = 22;
var begin_return_day = 20;

var do_search = function (i, j) {
  var gothere = {}, goback = {};

  // Set the default date
  var gothere_date = new Date(2013, 06-1, begin_day, 0 ,0 ,0 ,0);
  //gothere_date = new Date("June 23, 2013 12:00:00");
  var second_i = i*24*60*60*1000; var month;
  gothere_date.setTime(gothere_date.getTime() + second_i);

  month = (gothere_date.getMonth() + 1) + ''; if (month.length == 1) month = '0' + month;
  gothere.month = gothere_date.getFullYear() + month;
  gothere.day = gothere_date.getDate() + '';

  // Set the default date
  var goback_date = new Date(2013, 07-1, begin_return_day);
  var second_j = j*24*60*60*1000;
  goback_date.setTime(goback_date.getTime() + second_i + second_j);

  month = (goback_date.getMonth() + 1) + ''; if (month.length == 1) month = '0' + month;
  goback.month = goback_date.getFullYear() + month;
  goback.day = goback_date.getDate() + '';

  var startdate = gothere.day + '.' + gothere.month.substr(4) + '.' + gothere.month.substr(0,4);
  var enddate = goback.day + '.' + goback.month.substr(4) + '.' + goback.month.substr(0,4);

  return {
    startdate:startdate,
    enddate:enddate,
    gothere:gothere,
    goback:goback
  };
};


var sleep = function(amount) {
  var until = new Date().getTime() + amount;
  while (new Date().getTime() < until) {
    // Wait
  }
};

var track = [0, -1];

if (argv.length == 3) {
  track[0] = argv[1].replace(/[^0-9\-]/g, '');
  track[1] = argv[2].replace(/[^0-9\-]/g, '');
  //console.log(track);
  if (track[0] === '' || track[1] ==='') {
    console.log('Empty');
    phantom.exit(1);
  }
} else {
  console.log('Error!');
  phantom.exit(1);
}

var filename = today + 'x' + track[0] + '-' + track[1] + '.json';

var steps = [
  // Fill form:
  function(args) {
    // Prepare arguments
    args = JSON.parse(args);
    var clog=function(msg){console.log('scrap'+msg);};

    var data = {
      // "dtaSearchdivFlightType":"1", (checkbox)
      "TRIP_DEPARTURE_LOCATION_1":"OSL",
      "TRIP_ARRIVAL_LOCATION_1":"CEB",
       "TRIP_DEPARTURE_DATERANGE_1":"H0",
       "TRIP_RETURN_DATERANGE_1":"H0",
      "TRIP_DEPARTURE_LOCATION_TEXT_1":"Oslo (Oslo Airport, OSL)",
      "TRIP_ARRIVAL_LOCATION_TEXT_1":"Cebu (CEB)",
      "TRIP_DEPARTURE_DAY_1":args.gothere.day,
      "TRIP_DEPARTURE_YEARMONTH_1":args.gothere.month,
      "TRIP_RETURN_DAY_1":args.goback.day,
      "TRIP_RETURN_YEARMONTH_1":args.goback.month,
      "startDate1":args.startdate,
      "endDate1":args.enddate
    };
    for (var i in data) {
      if (data.hasOwnProperty(i)) {
        $('input[name="'+i+'"]').val(data[i]);
      }
    }
    clog('Submitting form..');
    $('#form_searchflight').submit();
  },
  // Redirect page
  false, //function(){}, // STEP 1
  false, //function(){}, // STEP 2
  function(args) {
    // Results
    var clog=function(msg){console.log('scrap'+msg);};
    var packet = [];
    $('.accordion > div > li').each(function() {
      var p = $(this);
      var ob = p.find('.departurefareadvice:eq(0)');
      var hb = p.find('.departurefareadvice:eq(1)');
      var obj = {
        price: p.find('.priceamount').text(),
        outbound: {
          duration: ob.find('.duration:eq(0)').text(),
          steps: []
        },
        homebound: {
          duration: hb.find('.duration:eq(0)').text(),
          steps: []
        }
      };
      hb.find('.departure-info').each(function(){
        var step = {
          departure: {
            time: $(this).find('.time:eq(0)').text(),
            airport: $(this).find('.departureairport').text()
          },
          arrival: {
            time: $(this).find('.time:eq(1)').text(),
            airport: $(this).find('.arrivalairport').text()
          }
        };
        obj.homebound.steps.push(step);
      });
      ob.find('.departure-info').each(function(){
        var step = {
          departure: {
            time: $(this).find('.time:eq(0)').text(),
            airport: $(this).find('.departureairport').text()
          },
          arrival: {
            time: $(this).find('.time:eq(1)').text(),
            airport: $(this).find('.arrivalairport').text()
          }
        };
        obj.outbound.steps.push(step);
      });
      packet.push(obj);
    });
    var result = JSON.stringify(packet);
    //clog(result);
    return result;
  }
];

var page = require('webpage').create(), t;
var url = '';
page.onConsoleMessage = function(msg) {
  if (false || msg.substr(0,5) == 'scrap') {
    console.log("\t" + msg.substr(5));
  }
};

var stage = 0;
var timedExit = false;
var texit = function(){
  return setTimeout(function(){
    phantom.exit(1);
  }, 5000);
};
page.onLoadStarted = function(url) {
  //console.log(stage + " loading: " + page.url.replace(/http\:\/\/www\.travellink\.no/, ''));
};
var jQuery = "http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js";
page.onLoadFinished = function(status) {
  if (timedExit) {
    timedExit = clearTimeout(timedExit);
  }

  //console.log(stage + " finished: " + page.url.replace(/http\:\/\/www\.travellink\.no/, ''));

  if ( status === "success" ) {
    // page.render('debug_stage_' + stage.toString() + '.png');
    // Do page stuffs
    if (typeof steps[stage] === 'function') {
      // Use jQuery
      if (stage === 0){
        stage++;
        var packet = JSON.stringify(do_search(track[0], track[1]));
        page.includeJs(jQuery, function() {
          page.evaluate(steps[0], packet);
        });
      }
      else if (stage == 3) {
        stage++;
        page.includeJs(jQuery, function() {
          var result = page.evaluate(steps[3]);

          if (result && result !== '[]') {
            fs.write(filename, result, 'w');
            console.log('Saved: ' + filename);
            phantom.exit(0);
          } else {
            console.log(result);
            page.render(filename+'.png');
            phantom.exit(1);
          }
        });
      }
      else { stage++; }
    } else { stage++; }
  } else {
    console.log("ERROR! Could not load page");
    console.log(page.url);
    console.log(track);
    page.render('error.png');
    timedExit = texit(1000);
  }
};


page.viewportSize = { width: '1024px', height: '768px' };

page.open("http://www.travellink.no/main?type=Flow&name=FGSearchFlight");



//do_search(0,-1);