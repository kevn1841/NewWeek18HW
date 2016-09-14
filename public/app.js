$( document ).ready(function() {


var i = 0;

$("#factBtn").click(function() {
  $.getJSON('/Articles', function(data) {
  	i++;
    console.log(i)
  // for each entry of that json...
    // append each animal of the named properties to the table
    checkFact();
    $('#fact').html('<h3>'+ data[i].title+ '</h3>');
	});
});

function checkFact(){
	if(i == 19){
		i = 0;
	}
}
})