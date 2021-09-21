var showParkDays = true;
var showKingdomEvents = true;
var parkID = 277;
var kingdomID = 31;
var dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

/**
 * Insert the list of park days into the table element with ID "parkdays"
 * The DIV "showparkdays" will be unhidden if there are park days to show.
 */
function insertParkDays() {
    jsork.park.getParkDays(parkID).then(function(parkDays) {
        if (parkDays.length > 0) {
            $('#showparkdays').attr('hidden', false);
            parkDays.forEach(function(anEvent) {
                var parkDayLine = '<tr>';
                parkDayLine += '<td>' + anEvent.WeekDay + '</td>';
                parkDayLine += '<td>' + anEvent.Time + '</td>';
                parkDayLine += '<td><a target="_new" href="' + anEvent.MapUrl + '">' + anEvent.Address + '</a></td>';
                parkDayLine += '</tr>';
                $('#parkdays').append(parkDayLine);
            });
        }
    });
}

/**
 * Insert the list of Kingdom Events into the table element with ID "kingdomevents"
 * The DIV "showkingdomevents" will be unhidden if there are events to show.
 */
 function insertKingdomEvents() {
    jsork.searchservice.searchKingdomEvent(kingdomID, "").then(function(kingdomEvents) {
         if (kingdomEvents.length > 0) {
            $('#showkingdomevents').attr('hidden', false);
            function addNextEvent(eventList) {
                if (eventList.length > 0) {
                    var nextEvent = eventList.shift();
                    jsork.event.getEventDetail(nextEvent.EventId).then(function(eventDetails) {
                        if (eventDetails.length > 0) {
                            var eventDate = new Date(eventDetails[0].EventStart.split(' ')[0]);
                            var kingdomEventLine = '<tr>';
                            kingdomEventLine += '<td><a target="_new" href="https://ork.amtgard.com/orkui/index.php?Route=Event/index/' + nextEvent.EventId + '">' + nextEvent.Name + '</a></td>';
                            kingdomEventLine += '<td>' + nextEvent.ParkName + '</td>';
                            kingdomEventLine += '<td>' + eventDate.toLocaleString('en-US',dateFormat) + '</td>';
                            kingdomEventLine += '</tr>';
                            $('#kingdomevents').append(kingdomEventLine);
                        }
                        addNextEvent(eventList);
                    });
                }
            }
            addNextEvent(kingdomEvents);
         }
    });
}

function startUp() {
    if (showParkDays) {
        insertParkDays();
    }
    if (showKingdomEvents) {
        insertKingdomEvents();
    }
}

$(document).ready(function() {
    startUp();
});