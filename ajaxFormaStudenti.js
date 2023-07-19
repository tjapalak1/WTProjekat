
$(document).ready(function() {
  $.ajax({
    url: "/v2/grupa", success: function (data) {
        var s = "";  
               for (var i = 0; i < data.length; i++) {  
                   s +='<option value="' + data[i].id+ '">' + data[i].naziv + '</option>';
               }  
               $("#grupe").html(s);  
    }
});


})

$( "#target" ).submit(function( event ) {
  event.preventDefault();
  let listaStudenata =dajStudente()
  kreirajStudente(listaStudenata).then(odgovorServera=>{
    let string= odgovorServera.join("\n")
    $("#textStudenti").val(string);
  })
});

function kreirajStudente(listaStudenata)
{
  return $.ajax({
    type : "POST",
    contentType : "application/json",
    url : "http://localhost:3000/v2/dodaj",
    data : JSON.stringify(listaStudenata),
    dataType : 'json',
    success : function(odgovorServera) {
        
     return odgovorServera;
    },
    error : function(e) {
      alert("Error!")
      console.log("ERROR: greška ", e);
    }
  });
}




  function dajFormu(){
    var formData = {
      text : $("#textStudenti").val(),
      grupa :  $("#grupe option:selected").val(),
    }
    return formData;
  }

  function dajStudente(){
   let forma = dajFormu();
   let spisakStudenata = forma.text.trim().split(/\r?\n/);
   let nizObjekataStudetana = []
   for(let i =0; i<spisakStudenata.length;i++)
   {
     let spisak = spisakStudenata[i].split(",")
     let imePrezime = spisak[0].trim();
     let indexS = spisak[1].trim();
     let objekat ={
       ime : imePrezime,
       index : indexS,
      grupa: forma.grupa     }
     nizObjekataStudetana.push(objekat)
   }
   return nizObjekataStudetana;
  }

   
   


          