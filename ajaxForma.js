var aktivnosti = [];
var predmeti =[];

$(document).ready(function() {

  $.ajax({
    url: "/v2/tip", success: function (data) {
        var s = "";  
               for (var i = 0; i < data.length; i++) {  
                   s +='<option value="' + Number(data[i].id)+ '">' + data[i].naziv + '</option>';
               }  
               $("#izborTip").html(s);  
    }   
});

$.ajax({
  url: "/v2/dan", success: function (data) {
      var s = "";  
             for (var i = 0; i < data.length; i++) {  
                 s +='<option value="' + Number(data[i].id)+ '">' + data[i].naziv + '</option>';
             }  
             $("#dan").html(s);  
  }   
});
  $.ajax({
    url: "http://localhost:3000/v2/predmet", success: function (odgovorServera) {
        predmeti = odgovorServera
    }
});

$.ajax({
    url: "http://localhost:3000/v2/aktivnost", success: function (odgovorServera) {
        aktivnosti = odgovorServera
    }
});
$.ajax({
  url: "/v2/grupa", success: function (data) {
      var s = "";  
             for (var i = 0; i < data.length; i++) {  
                 s +='<option value="' + Number(data[i].id)+ '">' + data[i].naziv + '</option>';
             }  
             $("#grupe").html(s);  
  }   
});
})

  $("#mojaForma").submit(function(event) {
      event.preventDefault();
      let forma = dajFormu();

      let niz = predmeti.filter(function(e){
        return e.naziv==forma.naziv;
      });
      if(forma.naziv.length<2)
      {
        $("#postResultDiv").html("Aktivnost nije validna!");
        resetUnosa();
        return;
      }

      if(niz.length==0)
      {
        let objekat = {naziv : forma.naziv,id:1}
        kreirajPredmet(objekat).then(poruka =>{
          forma.PredmetId=poruka;
          kreirajAktivnost(forma).then(odgovor =>{
            if(odgovor.message=="Uspješno dodana aktivnost!")
            {
              aktivnosti.push(forma);
              $("#postResultDiv").html("Uspješno dodana aktivnost!");
              objekat.id=poruka;
              predmeti.push(objekat);
              console.log(predmeti)
              console.log(aktivnosti)
              resetUnosa();
            }
            else
            {
              obrisiPredmet(poruka).then(serverOdgovor =>{
                $("#postResultDiv").html("Aktivnost nije validna!, slijedi brisanje predmeta");
                resetUnosa();
              });
            }
          })
        })
      }
      else
      {
        kreirajAktivnost(forma).then(odgovor =>{
          if(odgovor.message=="Uspješno dodana aktivnost!")
          {
            aktivnosti.push(forma);
            $("#postResultDiv").html("Uspješno dodana aktivnost!");
            resetUnosa();
          }
          else
          {
              $("#postResultDiv").html("Aktivnost nije validna!, predmet se ne briše!");
              resetUnosa();
           
          }
        })
      }
    });
    function obrisiPredmet(naziv)
    { 
       return $.ajax({
        type : "DELETE",
        url : "http://localhost:3000/v2/predmet/"+naziv,
        data : "string",
        dataType : 'json',
        success: function(odgovorServera){
          let odgovor =JSON.stringify(odgovorServera);
         return JSON.parse(odgovor).message;
        },
        error : function(e) {
          console.log("ERROR: ", e);
        }
      });  
    }

    function kreirajPredmet(objekat)
    {
      return $.ajax({
        type : "POST",
        contentType : "application/json",
        url : "http://localhost:3000/v2/predmetajax",
        data : JSON.stringify(objekat),
        dataType : 'json',
        success : function(odgovorServera) {
            
         return Number(odgovorServera);
        },
        error : function(e) {
          alert("Error!")
          console.log("ERROR: greška ", e);
        }
      });
    }

    function kreirajAktivnost(objekat)
    {
      return $.ajax({
        type : "POST",
        contentType : "application/json",
        url : "http://localhost:3000/v2/dodavanjeaktivnosti",
        data : JSON.stringify(objekat),
        dataType : 'json',
        success : function(odgovorServera) {
            let odgovor =JSON.stringify(odgovorServera);
         return JSON.parse(odgovor).message;
        },
        error : function(e) {
          alert("Error!")
          console.log("ERROR: greška ", e);
        }
      });
    }

    function dajFormu(){
      var formData = {
        Predmetid : 1,
        naziv : $("#nazivPredmeta").val(),
        TipId :  Number($("#izborTip option:selected").val()),
        pocetak :  Number($("#pocetakAktivnosti").val()),
        kraj :  Number($("#krajAktivnosti").val()),
        GrupaId: Number($("#grupe option:selected").val()),
        DanId :  Number($("#dan option:selected").val())
      }
      if(isNaN(formData.pocetak) || isNaN(formData.kraj))
      {
        formData.pocetak=-1;
        formData.kraj=-1;
      }
      console.log(formData);
      return formData;
    }

    function resetUnosa()
    {
      $("#mojaForma").trigger('reset');
    }


        