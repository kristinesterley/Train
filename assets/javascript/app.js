  //Initialize Firebase
  var key="";
  var config = {
    apiKey: "AIzaSyC4Rgu03KTJMBm4N5Vy6msm4Dqa5VN7vWc",
    authDomain: "train-ca218.firebaseapp.com",
    databaseURL: "https://train-ca218.firebaseio.com",
    storageBucket: "train-ca218.appspot.com",
    messagingSenderId: "185214098012"
  };
  firebase.initializeApp(config);

  var database = firebase.database().ref().child("Trains");
  

  	database.on("child_added", snap => {
  		var name = snap.child("Name").val();
  		var destination = snap.child("Destination").val();
  		var frequency = snap.child("Frequency").val();
  		var firstTime = snap.child("FirstTime").val();
  		key = snap.key;
  		console.log(key);

  		$("#table_body").append("<tr><td>" + name + "</td><td>" + destination 
  			+ "</td><td>"+ frequency+
  			"</td><td><button type='button' class='btn btn-default update' data-key="+key+">Update</button>" + 
  			"<button type='button' class='btn btn-default delete' data-key="+ key +" >Delete</button></td></tr>");
  	
  });


  $("#submit").on("click",function(){

  	var newStoreRef = database.push();
  	newStoreRef.set({
    	Name: $("#trainName").val().trim(),
    	Destination: $("#destination").val().trim(),
    	FirstTime: $("#firstTime").val().trim(),
    	Frequency: $("#frequency").val().trim()
 	});

  	$("#trainName").val('');
  	$("#destination").val('');
  	$("#firstTime").val('');
  	$("#frequency").val('');

  });
  $(document).on("click",'.delete',function(){
  	var temp = $(this).attr("data-key");
  	database.child(temp).remove();
  });
