window.alert = function() {};

let assert = chai.assert;
describe('raspored', function() {
 describe('iscrtajRaspored()', function() {
   it('Provjera broja redova #1', function() {
       var div= document.createElement("div");
       raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21);
         var tabela = div.firstChild;
     assert.equal(tabela.rows.length, 6,"Broj redova treba biti 6");
   });
   it('Provjera broja redova #2', function() {
    var div= document.createElement("div");
    raspored.iscrtajRaspored(div,["Srijeda","Četvrtak","Petak"],8,21);
      var tabela = div.firstChild;
  assert.equal(tabela.rows.length, 4,"Broj redova treba biti 4");
});
   it('Provjera početka i kraja #1', function() {
    var div= document.createElement("div");
    raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],10,5);
      var tabela = div.firstChild;
  assert.equal(div.innerHTML, "Greška","satPocetak ne smije biti veci od satKraj ");
});
it('Provjera početka i kraja #2', function() {
  var div= document.createElement("div");
  raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],-5,5);
    var tabela = div.firstChild;
assert.equal(div.innerHTML, "Greška","satPocetak ne smije biti negativan broj");
});
it('Provjera početka i kraja #3', function() {
  var div= document.createElement("div");
  raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],2,-5);
    var tabela = div.firstChild;
assert.equal(div.innerHTML, "Greška","satKraj ne smije biti negativan broj");
});
it('Provjera početka i kraja #4', function() {
  var div= document.createElement("div");
  raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],1.5,6);
    var tabela = div.firstChild;
assert.equal(div.innerHTML, "Greška","satPocetak ne smije biti decimalan broj");
});
it('Provjera početka i kraja #5', function() {
  var div= document.createElement("div");
  raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],1,6.5);
    var tabela = div.firstChild;
assert.equal(div.innerHTML, "Greška","satKraj ne smije biti decimalan broj");
});
it('Provjera broja kolona #1', function() {
  var div= document.createElement("div");
  raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21);
    var tabela = div.firstChild;
assert.equal(tabela.rows[1].cells.length, 27,"Tabela ima 27 kolona");
});
it('Provjera broja kolona #2', function() {
  var div= document.createElement("div");
  raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],15,21);
    var tabela = div.firstChild;
assert.equal(tabela.rows[1].cells.length, 13,"Tabela ima 13 kolona");
});
it('Provjera prvog dana', function() {
  var div= document.createElement("div");
  raspored.iscrtajRaspored(div,["Utorak","Srijeda","Četvrtak","Petak"],8,21);
    var tabela = div.firstChild;
assert.equal(tabela.rows[1].cells[0].innerHTML, "Utorak","Prvi dan rasporeda je utorak");
});
it('Provjera praznog rasporeda', function() {
  var div= document.createElement("div");
  raspored.iscrtajRaspored(div,[],8,21);
    var tabela = div.firstChild;
assert.equal(div.innerHTML, "Greška","Dani nisu proslijeđeni");
});
it('Provjera zadnjeg dana', function() {
  var div= document.createElement("div");
  raspored.iscrtajRaspored(div,["Utorak","Srijeda","Četvrtak"],8,21);
    var tabela = div.firstChild;
assert.equal(tabela.rows[3].cells[0].innerHTML, "Četvrtak","Zadnji dan rasporeda je četvrtak");
});
it('Provjera umetanja zadnjeg sata u tabelu #1', function() {
  var div= document.createElement("div");
  raspored.iscrtajRaspored(div,["Utorak","Srijeda","Četvrtak","Petak"],8,21);
    var tabela = div.firstChild;
    var prviRedVelicina = tabela.rows[0].cells.length;
    var vrijednost = 0;
    for(var i = 0;i<prviRedVelicina;i++)
    {
      if(tabela.rows[0].cells[i].innerHTML=="")
      continue;
      else{
        vrijednost=tabela.rows[0].cells[i].innerHTML;
      }
    }
assert.equal(vrijednost, "19:00","Zadnji sat koji se prikazuje u rasporedu je 19:00");
 });
 it('Provjera umetanja zadnjeg sata u tabelu #2', function() {
  var div= document.createElement("div");
  raspored.iscrtajRaspored(div,["Utorak","Srijeda","Četvrtak","Petak"],8,19);
    var tabela = div.firstChild;
    var prviRedVelicina = tabela.rows[0].cells.length;
    var vrijednost = 0;
    for(var i = 0;i<prviRedVelicina;i++)
    {
      if(tabela.rows[0].cells[i].innerHTML=="")
      continue;
      else{
        vrijednost=tabela.rows[0].cells[i].innerHTML;
      }
    }
assert.equal(vrijednost, "17:00","Zadnji sat koji se prikazuje u rasporedu je 17:00");
});
});
});

let adrugi = chai.assert;
describe('aktivnosti', function() {
 describe('dodajAktivnost()', function() {
   it('Provjera kreiranja rasporeda', function() {
       var div= document.createElement("div");
      var varijabla =  raspored.dodajAktivnost(div,"WT","predavanje",9,12,"Ponedjeljak");
     assert.equal(varijabla, 0,"Raspored nije kreiran");
   })
   it('Provjera pocetka i kraja aktivnosti #1', function() {
    var div= document.createElement("div");
    raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21);
   var varijabla =  raspored.dodajAktivnost(div,"WT","predavanje",7,12,"Ponedjeljak");
  assert.equal(varijabla, 0,"Pocetak aktivnosti ne smije biti prije vremena pocetka rasporeda");
})
it('Provjera pocetka i kraja aktivnosti #2', function() {
  var div= document.createElement("div");
  raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,15);
 var varijabla =  raspored.dodajAktivnost(div,"WT","predavanje",13,16,"Ponedjeljak");
assert.equal(varijabla, 0,"Kraj aktivnosti ne smije biti oslije vremena kraja rasporeda");
});
it('Provjera pocetka i kraja aktivnosti #3', function() {
  var div= document.createElement("div");
  raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,15);
 var varijabla =  raspored.dodajAktivnost(div,"WT","predavanje",11,10,"Ponedjeljak");
assert.equal(varijabla, 0,"Vrijeme pocetka aktivnosti ne smije biti poslije vremena kraja aktivnosti");
});
it('Provjera pocetka i kraja aktivnosti #4', function() {
  var div= document.createElement("div");
  raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,15);
 var varijabla =  raspored.dodajAktivnost(div,"WT","predavanje",-1,10,"Ponedjeljak");
assert.equal(varijabla, 0,"Vrijeme pocetka aktivnosti ne smije biti broj manji od 0");
});
it('Provjera pocetka i kraja aktivnosti #5', function() {
  var div= document.createElement("div");
  raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21);
 var varijabla =  raspored.dodajAktivnost(div,"WT","predavanje",9,25,"Ponedjeljak");
assert.equal(varijabla, 0,"Vrijeme kraja aktivnosti ne smije biti broj veci od 24");
});
it('Provjera pocetka i kraja aktivnosti #6', function() {
  var div= document.createElement("div");
  raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21);
 var varijabla =  raspored.dodajAktivnost(div,"WT","predavanje",9,25,"Ponedjeljak");
assert.equal(varijabla, 0,"Vrijeme kraja aktivnosti ne smije biti broj veci od 24");
});
it('Provjera dodavanja aktivnosti za dan koji se ne nalazi u rasporedu #1', function() {
  var div= document.createElement("div");
  raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak"],8,21);
 var varijabla =  raspored.dodajAktivnost(div,"OI","predavanje",9,12,"Petak");
assert.equal(varijabla, 0,"Petak ne postoji u rasporedu");
});
it('Provjera dodavanja aktivnosti za dan koji se ne nalazi u rasporedu #2', function() {
  var div= document.createElement("div");
  raspored.iscrtajRaspored(div,["Utorak","Srijeda","Četvrtak"],8,21);
 var varijabla =  raspored.dodajAktivnost(div,"OI","predavanje",9,12,"Ponedjeljak");
assert.equal(varijabla, 0,"Ponedjeljak ne postoji u rasporedu");
});
it('Provjera dodavanja aktivnosti za dan koji se ne nalazi u rasporedu #3', function() {
  var div= document.createElement("div");
  raspored.iscrtajRaspored(div,["Utorak","Srijeda","Četvrtak"],8,21);
 var varijabla =  raspored.dodajAktivnost(div,"OI","predavanje",9,12,"Ponedjeljak");
assert.equal(varijabla, 0,"Ponedjeljak ne postoji u rasporedu");
});
it('Provjera preklapanja aktivnosti #1', function() {
  var div= document.createElement("div");
  raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21);
  raspored.dodajAktivnost(div,"WT","predavanje",9,12,"Ponedjeljak");
  raspored.dodajAktivnost(div,"WT","vježbe",12,13.5,"Ponedjeljak");
  raspored.dodajAktivnost(div,"RMA","predavanje",14,17,"Ponedjeljak");
  raspored.dodajAktivnost(div,"RMA","vježbe",12.5,14,"Utorak");
  raspored.dodajAktivnost(div,"DM","tutorijal",14,16,"Utorak");
  raspored.dodajAktivnost(div,"DM","predavanje",16,19,"Utorak");
  raspored.dodajAktivnost(div,"OI","predavanje",12,15,"Petak");
  var varijabla = raspored.dodajAktivnost(div,"OI","predavanje",11,15,"Ponedjeljak");
assert.equal(varijabla, 0,"Ponedjeljak ima aktivnost koja traje od 9 do 12");
});
it('Provjera preklapanja aktivnosti #2', function() {
  var div= document.createElement("div");
  raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21);
  raspored.dodajAktivnost(div,"WT","predavanje",9,12,"Ponedjeljak");
  raspored.dodajAktivnost(div,"WT","vježbe",12,13.5,"Ponedjeljak");
  raspored.dodajAktivnost(div,"RMA","predavanje",14,17,"Ponedjeljak");
  raspored.dodajAktivnost(div,"RMA","vježbe",12.5,14,"Utorak");
  raspored.dodajAktivnost(div,"DM","tutorijal",14,16,"Utorak");
  raspored.dodajAktivnost(div,"DM","predavanje",16,19,"Utorak");
  raspored.dodajAktivnost(div,"OI","predavanje",12,15,"Petak");
  var varijabla = raspored.dodajAktivnost(div,"OI","predavanje",17,18,"Utorak");
assert.equal(varijabla, 0,"Utorak ima aktivnost koja traje od 16 do 19");
});
it('Provjera preklapanja aktivnosti #3', function() {
  var div= document.createElement("div");
  raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21);
  raspored.dodajAktivnost(div,"WT","predavanje",9,12,"Ponedjeljak");
  raspored.dodajAktivnost(div,"WT","vježbe",12,13.5,"Ponedjeljak");
  raspored.dodajAktivnost(div,"RMA","predavanje",14,17,"Ponedjeljak");
  raspored.dodajAktivnost(div,"RMA","vježbe",12.5,14,"Utorak");
  raspored.dodajAktivnost(div,"DM","tutorijal",14,16,"Utorak");
  raspored.dodajAktivnost(div,"DM","predavanje",16,19,"Utorak");
  raspored.dodajAktivnost(div,"DM","predavanje",10,12,"Četvrtak");
  raspored.dodajAktivnost(div,"OI","predavanje",12,15,"Petak");
  var varijabla = raspored.dodajAktivnost(div,"OI","predavanje",9,13,"Četvrtak");
assert.equal(varijabla, 0,"Četvrtak ima aktivnost koja traje od 10 do 12");
});
});
});




