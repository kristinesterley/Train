
  //Global Variables
  var current_key;
  var formMode = "add";

    //Initialize Firebase
  var config = {
    apiKey: "AIzaSyC4Rgu03KTJMBm4N5Vy6msm4Dqa5VN7vWc",
    authDomain: "train-ca218.firebaseapp.com",
    databaseURL: "https://train-ca218.firebaseio.com",
    storageBucket: "train-ca218.appspot.com",
    messagingSenderId: "185214098012"
  };
  firebase.initializeApp(config);

  // calculateTime takes two parameters: first time and frequency
  //using these values, calculateTime computes the next train arrival time
  // and the number of minutes until it arrives and returns those two values in 
  // an array

  function calculateTime(fTime, freq) {

      // First Time (pushed back 1 year to make sure it comes before current time)
      var firstTimeConverted = moment(fTime, "hh:mm").subtract(1, "years");

      // Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

      // Time apart (remainder)
      var tRemainder = diffTime % freq;

      // Minute Until Train
      var tMinutesTillTrain = freq - tRemainder;

      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");

      var returnArray=[];
      returnArray[0] = moment(nextTrain).format("hh:mm A");
      returnArray[1] = tMinutesTillTrain;
      return returnArray;

  }

// resetform clears the form fields and set the form title and mode to "add"

function resetForm(){
  	$("#trainName").val('');
  	$("#destination").val('');
  	$("#firstTime").val('');
  	$("#frequency").val('');

  	$(".trainForm").text("Add Train");
  	formMode = "add";
}

// get a handle to the database

  var database = firebase.database().ref().child("Trains");
 
// when a new train record is added as well as the window loads, get the 
// data from the database and add it to the table

  database.on("child_added", snap => {
  		var name = snap.child("Name").val();
  		var destination = snap.child("Destination").val();
  		var frequency = snap.child("Frequency").val();
  		var firstTime = snap.child("FirstTime").val();
  		var key = snap.key;

  		var next = 0;
  		var minAway = 1;
  		var timeCalc = [];
  		timeCalc = calculateTime(firstTime,frequency);


  		$("#table_body").append("<tr class='key"+key+"'>"+
  			"<td id='n"+key+"'>" + name + "</td>"+
  			"<td id = 'd"+ key+"'>" + destination +"</td>"+
  			"<td id = 'f"+key+"' data-start="+ firstTime+">"+ frequency+ "</td>"+
  			"<td id = 'a"+key+"'>" + timeCalc[next] + "</td>"+
  			"<td id = 'm"+key+"'>" + timeCalc[minAway] +"<td>"+
  			"<button type='button' class='btn btn-default update' data-key="+key+">Update</button>" + 
  			"<button type='button' class='btn btn-default delete' data-key="+ key +" >Delete</button></td></tr>");
  	


  });

  // when a train record is removed from the database, delete it from the table

  database.on("child_removed", snap => {
  		$(".key"+current_key).remove();
  });

  // when the user clicks the submit button, first check if in add mode or otherwise
  // in update mode.
  // if adding, add the data to the database
  // if updating, update the database and update the table in the display

  // once done, reset the form to be empty and in add mode

  $("#submit").on("click",function(){

  	if (formMode === "add"){

  		database.push({
    		Name: $("#trainName").val().trim(),
    		Destination: $("#destination").val().trim(),
    		FirstTime: $("#firstTime").val().trim(),
    		Frequency: $("#frequency").val().trim()
 		});
  	} 
  	else {

      var uName = $("#trainName").val().trim();
      var uDest = $("#destination").val().trim();
      var uFirstTime = $("#firstTime").val().trim();
      var uFreq = $("#frequency").val().trim();

  		var updateDatabase = firebase.database().ref().child("Trains/"+current_key);
  		updateDatabase.set({
  			Name: uName,
    		Destination: uDest,
    		FirstTime: uFirstTime,
    		Frequency: uFreq

  		});
      //refresh the row in the display to show new info ****
      var next = 0;
      var minAway = 1;
      var timeCalc = [];
      timeCalc = calculateTime(uFirstTime,uFreq);

      $("#n"+ current_key).text(uName);
      $("#d"+ current_key).text(uDest);
      $("#f"+ current_key).text(uFreq);
      $("#f"+ current_key).attr("data-start",uFirstTime);
      $("#a"+ current_key).text(timeCalc[next]);
      $("#m"+ current_key).text(timeCalc[minAway]);

  	}


  	resetForm();


  });

 // when user clicks the delete button, save off the key then 
 // delete the record from the database. The database.on("child_removed")
 // code will be kicked off, and in that code, the row is deleted from the display

  $(document).on("click",'.delete',function(){
  	current_key = $(this).attr("data-key");
  	database.child(current_key).remove();
  });

  $(document).on("click",'.update',function(){

  	$(".trainForm").text("Update Train");
  	 current_key = $(this).attr("data-key");
  	 formMode = "update";

  	 $("#trainName").val($("#n"+ current_key).text());
  	 $("#destination").val($("#d"+ current_key).text());
  	 $("#frequency").val($("#f"+ current_key).text());
  	 $("#firstTime").val($("#f"+ current_key).attr("data-start"));

  });

  // if user clicks cancel, clear the form and set to add mode

	$("#cancel").on("click",function(){
		resetForm();
	});		
