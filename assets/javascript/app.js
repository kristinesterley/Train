  //Initialize Firebase
  var current_key;
  var formMode = "add";
  var config = {
    apiKey: "AIzaSyC4Rgu03KTJMBm4N5Vy6msm4Dqa5VN7vWc",
    authDomain: "train-ca218.firebaseapp.com",
    databaseURL: "https://train-ca218.firebaseio.com",
    storageBucket: "train-ca218.appspot.com",
    messagingSenderId: "185214098012"
  };


  firebase.initializeApp(config);

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

function resetForm(){
  	$("#trainName").val('');
  	$("#destination").val('');
  	$("#firstTime").val('');
  	$("#frequency").val('');

  	$(".trainForm").text("Add Train");
  	formMode = "add";
}
  var database = firebase.database().ref().child("Trains");
  

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
  		// console.log(timeCalc[0] + " ," + timeCalc[1]);

  		$("#table_body").append("<tr class='key"+key+"'>"+
  			"<td id='n"+key+"'>" + name + "</td>"+
  			"<td id = 'd"+ key+"'>" + destination +"</td>"+
  			"<td id = 'f"+key+"' data-start="+ firstTime+">"+ frequency+ "</td>"+
  			"<td>" + timeCalc[next] + "</td>"+
  			"<td>" + timeCalc[minAway] +"<td>"+
  			"<button type='button' class='btn btn-default update' data-key="+key+">Update</button>" + 
  			"<button type='button' class='btn btn-default delete' data-key="+ key +" >Delete</button></td></tr>");
  	


  });

  	database.on("child_removed", snap => {
  		$(".key"+current_key).remove();
  });

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

  		var updateDatabase = firebase.database().ref().child("Trains/"+current_key);
  		updateDatabase.set({
  			Name: $("#trainName").val().trim(),
    		Destination: $("#destination").val().trim(),
    		FirstTime: $("#firstTime").val().trim(),
    		Frequency: $("#frequency").val().trim()

  		});

  	}


  	resetForm();

  });

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

	$("#cancel").on("click",function(){

		resetForm();
	});		
