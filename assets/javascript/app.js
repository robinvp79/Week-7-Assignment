// Initialize Firebase
var config = {
    apiKey: "AIzaSyD8CuYspxgQJqLz3QIvFmaKbbStGQGQrKA",
    authDomain: "traintime-66888.firebaseapp.com",
    databaseURL: "https://traintime-66888.firebaseio.com",
    storageBucket: "",
};
firebase.initializeApp(config);

var dbRef = firebase.database().ref();

function clearForm() {
	$('#trainNameInput').val('');
	$('#destinationInput').val('');
	$('#timeInput').val('');
	$('#frequencyInput').val('');
}

$('#newTrainForm').on('submit', function () {
	var trainName = $('#trainNameInput').val();
	var destination = $('#destinationInput').val();
	var time = $('#timeInput').val();
	var frequency = $('#frequencyInput').val();

	var newTrain = {
		trainName: trainName,
		destination: destination,
		time: time,
		frequency: frequency
	};

	clearForm();

	// push to firebase
	dbRef.push(newTrain);

	console.log('New train:', newTrain);

	return false;
});

dbRef.on('child_added', function (snapshot) {
	var newestTrain = snapshot.val();
	// append row to table here
	var row = $('<tr>');
		
	console.log(newestTrain)
		
	var td = $('<td>').text(newestTrain.trainName);
	row.append(td);

	td = $('<td>').text(newestTrain.destination);
	row.append(td);

	td = $('<td>').text(newestTrain.frequency);
	row.append(td);

	var momentToday = moment();
	console.log(momentToday);
	console.log(newestTrain.time);
	var momentFirstTrain = moment(newestTrain.time, 'HH:mm');
	console.log(momentFirstTrain);
	var frequencyTrain = newestTrain.frequency;
	var minutesTrain = momentToday.diff(momentFirstTrain, 'minutes');
	console.log(minutesTrain);
	while (minutesTrain>0){
		momentFirstTrain = momentFirstTrain.add(frequencyTrain, 'minutes');
		minutesTrain = momentToday.diff(momentFirstTrain, 'minutes');
	}
	console.log(minutesTrain);
	row.append($('<td>',{
		text: momentFirstTrain.format('LT')
	}))
	var minutesAway = momentFirstTrain.diff(momentToday, 'minutes');
	td = $('<td>').text(minutesAway);
	row.append(td);

	$('tbody').append(row);

}, function (error) {
	console.error(error);
});
