var http = require('http');
var express = require('express');
var path = require('path');
const fs  = require('fs');
const bodyParser = require('body-parser');
const { POINT_CONVERSION_COMPRESSED } = require('constants');
const { count } = require('console');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/')));

var Sequelize = require("sequelize");
const sequelize = require("./baza.js");
const student = require('./modeli/student.js');


const Predmet = require("./modeli/predmet")(sequelize);
const Grupa = require("./modeli/grupa")(sequelize);
const Dan = require("./modeli/dan")(sequelize);
const Tip = require("./modeli/tip")(sequelize);
const Student = require("./modeli/student")(sequelize);
const Aktivnost = require("./modeli/aktivnost")(sequelize);



Predmet.hasMany(Grupa, {foreignKey: {allowNull: false}});
Grupa.belongsTo(Predmet); //Predmet 1-N Grupa

Predmet.hasMany(Aktivnost, {foreignKey: {allowNull: false}}); 
Aktivnost.belongsTo(Predmet); //Aktivnost N-1 Predmet

Grupa.hasMany(Aktivnost, {foreignKey: {allowNull: true}}); 
Aktivnost.belongsTo(Grupa); //Aktivnost N-0 Grupa

Dan.hasMany(Aktivnost, {foreignKey: {allowNull: false}}); 
Aktivnost.belongsTo(Dan); //Aktivnost N-1 Dan

Tip.hasMany(Aktivnost, {foreignKey: {allowNull: false}}); 
Aktivnost.belongsTo(Tip); //Aktivnost N-1 Tip

Student.belongsToMany(Grupa, { through: 'GrupeStudenti' }); 
Grupa.belongsToMany(Student, { through: 'GrupeStudenti' }); //Student N-M Grupa 

sequelize.sync({alter:true})
app.post('/v2/predmetajax', async function(req,res){

  if(req.body["naziv"].length<2)
  {
    res.json({ message: 'Naziv predmeta nije validan!'});
    return;
  }
  const [predmet, kreiran] =  await Predmet.findOrCreate({
    where: { naziv:req.body["naziv"]},
    defaults: {
      naziv:req.body["naziv"]
    }
  });
  if(kreiran==true){
  console.log(predmet.id.toString())
  res.send(predmet.id.toString())
  }
  else
  res.json({ message: 'Predmet već postoji!'});
})

app.post('/v2/dodavanjeaktivnosti', async function(req,res){
  console.log(req.body)
    if(Number.isInteger(req.body["pocetak"])==false)
      {
        if(req.body["pocetak"]%1!=0.5){
          console.log("OVDJE3")
        res.json({ message: 'Aktivnost nije validna!'});
        return 0;
        }
      }
    
      if(Number.isInteger(req.body["kraj"])==false)
      {
        if(req.body["kraj"]%1!=0.5){
          console.log("OVDJE4")
        res.json({ message: 'Aktivnost nije validna!'});
        return 0;
        }
      }
    
    
    
      if(req.body["pocetak"]<8 || req.body["kraj"]>20 || req.body["pocetak"] >= req.body["kraj"] || req.body["pocetak"] < 0 || req.body["kraj"] > 24){
      res.json({ message: 'Aktivnost nije validna!'});
      console.log("OVDJE")
      return 0;
      }
    
        let nizObjekata = await Aktivnost.findAll();
    
        let niz = nizObjekata.filter(function(e){
          return e.DanId==req.body["DanId"];
        });
    
        for(let i=0;i<niz.length;i++)
        {
          let fullOverlap = req.body["pocetak"] <= niz[i].pocetak && req.body["kraj"] > niz[i].pocetak;
    
          let partialOverlap = req.body["pocetak"] >= niz[i].pocetak && req.body["pocetak"] < niz[i].kraj;
          if (fullOverlap || partialOverlap) {
            console.log("OVDJE2")
            res.json({ message: 'Aktivnost nije validna!'});
          return 0;
        }
          
          }
    
    
    
      try{
      const jane = await Aktivnost.create({
        naziv:req.body["naziv"],pocetak:req.body["pocetak"],kraj:req.body["kraj"],PredmetId:req.body["PredmetId"],GrupaId:req.body["GrupaId"],DanId:req.body["DanId"],TipId:req.body["TipId"]
      });
      res.json({ message: 'Uspješno dodana aktivnost!'});
    }catch(greska)
    {
      res.json({ message: 'Neki od FK ne postoji!'});
    }
});



app.post('/v2/dodaj', async function(req,res){

  var nizStudenata =[]
  const sviStudenti = await Student.findAll();
  
  var nizPoruka=[]
  for (var key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      nizStudenata.push(req.body[key])
    }
  }
  for(let i =0;i<nizStudenata.length;i++)
  {
    if(sviStudenti.some(e=> e.ime=== nizStudenata[i].ime && e.index==nizStudenata[i].index)==true)
    {
      const postojeci = await Student.findOne({ where: { index: nizStudenata[i].index } })
      const grupa = await Grupa.findOne({where: {id: Number(nizStudenata[i].grupa)}})
      await dodajIliIzmijeniGrupu(postojeci,grupa)
    }
    else if(sviStudenti.some(e=> e.ime!= nizStudenata[i].ime && e.index==nizStudenata[i].index)==true)
    {
      let student= sviStudenti.find(e=> e.index==nizStudenata[i].index);
      nizPoruka.push("Student "+nizStudenata[i].ime+" nije kreiran jer postoji student "+student.ime+ " sa indexom "+student.index);
    }
    else
    {
       const student = await Student.create({ 
         ime:nizStudenata[i].ime,
         index: nizStudenata[i].index
  })
  const novaGrupa = await Grupa.findOne({where: {id: Number(nizStudenata[i].grupa)}})
  console.log(nizStudenata[i].grupa)
  student.addGrupa(novaGrupa)
  }
 }
 if(nizPoruka.length==0)
 {
  res.status(200).send(nizPoruka)
 }
 else
 res.send(nizPoruka);

})
async function dodajIliIzmijeniGrupu(student, novaGrupa) {
  const studentoveGrupe = await student.getGrupe();

  for (let i = 0; i < studentoveGrupe.length; i++) {
      if (studentoveGrupe[i].PredmetId === novaGrupa.PredmetId) {   
          await student.removeGrupa(studentoveGrupe[i])
          await student.addGrupa(novaGrupa);
          return;
      }
  }

  return student.addGrupa(novaGrupa);    
}


app.get('/v2/predmet', async function(req,res){ 
  const sviPredmeti = await Predmet.findAll();
  res.json(sviPredmeti);
})

app.post('/v2/predmet', async function(req,res){

  if(req.body["naziv"].length<2)
  {
    res.json({ message: 'Naziv predmeta nije validan!'});
    return;
  }
  const [predmet, kreiran] =  await Predmet.findOrCreate({
    where: { naziv:req.body["naziv"]},
    defaults: {
      naziv:req.body["naziv"]
    }
  });
  if(kreiran==true)
  res.json({ message: 'Predmet kreiran!'});
  else
  res.json({ message: 'Predmet već postoji!'});
})

app.put('/v2/predmet/:id', async function(req,res){

  Predmet.findOne({
    where: {
      id: req.params.id
    }
  }).then(function(user) {
    if (user) {
      Predmet.findOne({
        where: {
          naziv: req.body.naziv
        }
      }).then(function(rezultat) {
        if (rezultat) {
          res.json({ message: 'Naziv već postoji!'});
        } else {
          Predmet.update(
            {
                naziv: req.body["naziv"]
            },
            {returning: true, where: {id: req.params.id} }
          )
                .then((result)=>{
                  if(result[1]==1)
                  res.json({ message: 'Update izvršen!'});
                  else
                  res.json({ message: 'ID ne postoji!'});
                })
        .catch((err)=>{
            console.log("Error : ",err)
        })
        }
      });
       
    } else {
      res.json({ message: 'ID ne postoji!'});
    }
  });
 
})

app.delete('/v2/predmet/:id', async function(req,res){ 
  await Predmet.destroy({
    where: {
     id: req.params.id
    }
   }).then(count => { 
    if (!count) {
      res.json({ message: 'ID ne postoji!'});
    }
    else
    res.json({ message: 'Predmet izbrisan!'});
   });
})

app.get('/v2/grupa', async function(req,res){ 
  const sveGrupe = await Grupa.findAll();
  res.json(sveGrupe);
})

app.post('/v2/grupa', async function(req,res){
  if(req.body["naziv"].length<2)
  {
    res.json({ message: 'Naziv grupe nije validan!'});
    return;
  }
  try{
    const [grupa, kreiran] =  await Grupa.findOrCreate({
    where: { naziv:req.body["naziv"]},
    defaults: {
      naziv:req.body["naziv"],
      PredmetId : req.body["PredmetId"]
    }})
  if(kreiran==true)
  res.json({ message: 'Grupa kreirana!'});
  else
  res.json({ message: 'Grupa već postoji!'});
  }
  catch(greska)
  {
    res.json({ message: 'Predmet ne postoji!'});
  }
  
})

app.put('/v2/grupa/:id', async function(req,res){ 
  Grupa.findOne({
    where: {
      id: req.params.id
    }
  }).then(function(user) {
    if (user) {
      Grupa.findOne({
        where: {
          naziv: req.body.naziv
        }
      }).then(function(rezultat) {
        if (rezultat) {
          res.json({ message: 'Naziv već postoji!'});
        } else {
          Grupa.update(
            {
                naziv: req.body["naziv"]
            },
            {returning: true, where: {id: req.params.id} }
          )
                .then((result)=>{
                  if(result[1]==1)
                  res.json({ message: 'Update izvršen!'});
                  else
                  res.json({ message: 'ID ne postoji!'});
                })
        .catch((err)=>{
            console.log("Error : ",err)
        })
        }
      });
       
    } else {
      res.json({ message: 'ID ne postoji!'});
    }
  });
})

app.delete('/v2/grupa/:id', async function(req,res){ 
  await Grupa.destroy({
    where: {
     id: req.params.id
    }
   }).then(count => { 
    if (!count) {
      res.json({ message: 'ID ne postoji!'});
    }
    else
    res.json({ message: 'Grupa izbrisana!'});
   });
})

app.get('/v2/dan', async function(req,res){ 
  const sviDani = await Dan.findAll();
  res.json(sviDani);
})

app.post('/v2/dan', async function(req,res){
  if(req.body["naziv"].length<2)
  {
    res.json({ message: 'Naziv dana nije validan!'});
    return;
  }
  const [dan, kreiran] =  await Dan.findOrCreate({
    where: { naziv:req.body["naziv"]},
    defaults: {
      naziv:req.body["naziv"]
    }
  });
  if(kreiran==true)
  res.json({ message: 'Dan kreiran!'});
  else
  res.json({ message: 'Dan već postoji!'});
})

app.put('/v2/dan/:id', async function(req,res){ 
  Dan.findOne({
    where: {
      id: req.params.id
    }
  }).then(function(user) {
    if (user) {
      Dan.findOne({
        where: {
          naziv: req.body.naziv
        }
      }).then(function(rezultat) {
        if (rezultat) {
          res.json({ message: 'Naziv već postoji!'});
        } else {
          Dan.update(
            {
                naziv: req.body["naziv"]
            },
            {returning: true, where: {id: req.params.id} }
          )
                .then((result)=>{
                  if(result[1]==1)
                  res.json({ message: 'Update izvršen!'});
                  else
                  res.json({ message: 'ID ne postoji!'});
                })
        .catch((err)=>{
            console.log("Error : ",err)
        })
        }
      });
       
    } else {
      res.json({ message: 'ID ne postoji!'});
    }
  });
})

app.delete('/v2/dan/:id', async function(req,res){ 
  await Dan.destroy({
    where: {
     id: req.params.id
    }
   }).then(count => { 
    if (!count) {
      res.json({ message: 'ID ne postoji!'});
    }
    else
    res.json({ message: 'Dan izbrisan!'});
   });
})

app.get('/v2/tip', async function(req,res){ 
  const sviTipovi = await Tip.findAll();
  res.json(sviTipovi);
})

app.post('/v2/tip', async function(req,res){
  if(req.body["naziv"].length<2)
  {
    res.json({ message: 'Naziv tipa nije validan!'});
    return;
  }
  const [tip, kreiran] =  await Tip.findOrCreate({
    where: { naziv:req.body["naziv"]},
    defaults: {
      naziv:req.body["naziv"]
    }
  });
  if(kreiran==true)
  res.json({ message: 'Tip kreiran!'});
  else
  res.json({ message: 'Tip već postoji!'});
})

app.put('/v2/tip/:id', async function(req,res){ 
  Tip.findOne({
    where: {
      id: req.params.id
    }
  }).then(function(user) {
    if (user) {
      Tip.findOne({
        where: {
          naziv: req.body.naziv
        }
      }).then(function(rezultat) {
        if (rezultat) {
          res.json({ message: 'Naziv već postoji!'});
        } else {
          Tip.update(
            {
                naziv: req.body["naziv"]
            },
            {returning: true, where: {id: req.params.id} }
          )
                .then((result)=>{
                  if(result[1]==1)
                  res.json({ message: 'Update izvršen!'});
                  else
                  res.json({ message: 'ID ne postoji!'});
                })
        .catch((err)=>{
            console.log("Error : ",err)
        })
        }
      });
       
    } else {
      res.json({ message: 'ID ne postoji!'});
    }
  });
})

app.delete('/v2/tip/:id', async function(req,res){ 
  await Tip.destroy({
    where: {
     id: req.params.id
    }
   }).then(count => { 
    if (!count) {
      res.json({ message: 'ID ne postoji!'});
    }
    else
    res.json({ message: 'Tip izbrisan!'});
   });
})

app.get('/v2/student', async function(req,res){ 
  const sviStudenti = await Student.findAll();
  res.json(sviStudenti);
})

app.post('/v2/student', async function(req,res){
  if(req.body["ime"].length<2 || req.body["index"].length<2)
  {
    res.json({ message: 'Ime ili index studenta nije validan!'});
    return;
  }
  const [student, kreiran] =  await Student.findOrCreate({
    where: { index:req.body["index"]},
    defaults: {
      ime:req.body["ime"],index:req.body["index"]}
  });
  if(kreiran==true)
  res.json({ message: 'Student kreiran!'});
  else
  res.json({ message: 'Index već postoji!'});
})

app.put('/v2/student/:id', async function(req,res){
  Student.findOne({
    where: {
      id: req.params.id
    }
  }).then(function(user) {
    if (user) {
      Student.findOne({
        where: {
          index: req.body.index
        }
      }).then(function(rezultat) {
        if (rezultat) {
          res.json({ message: 'Index već postoji!'});
        } else {
          Student.update(
            {
              ime:req.body["ime"],
              index:req.body["index"]
            },
            {returning: true, where: {id: req.params.id} }
          )
                .then((result)=>{
                  if(result[1]==1)
                  res.json({ message: 'Update izvršen!'});
                  else
                  res.json({ message: 'ID ne postoji!'});
                })
        .catch((err)=>{
            console.log("Error : ",err)
        })
        }
      });
       
    } else {
      res.json({ message: 'ID ne postoji!'});
    }
  });
})

app.delete('/v2/student/:id', async function(req,res){ 
  await Student.destroy({
    where: {
     id: req.params.id
    }
   }).then(count => { 
    if (!count) {
      res.json({ message: 'ID ne postoji!'});
    }
    else
    res.json({ message: 'Student izbrisan!'});
   });
})

app.get('/v2/aktivnost', async function(req,res){ 
  const sveAktivnosti = await Aktivnost.findAll();
  res.json(sveAktivnosti);
})

app.post('/v2/aktivnost', async function(req,res){

if(Number.isInteger(req.body["pocetak"])==false)
  {
    if(req.body["pocetak"]%1!=0.5){
    res.json({ message: 'Aktivnost nije validna!'});
    return 0;
    }
  }

  if(Number.isInteger(req.body["kraj"])==false)
  {
    if(req.body["kraj"]%1!=0.5){
    res.json({ message: 'Aktivnost nije validna!'});
    return 0;
    }
  }



  if(req.body["pocetak"]<8 || req.body["kraj"]>20 || req.body["pocetak"] >= req.body["kraj"] || req.body["pocetak"] < 0 || req.body["kraj"] > 24){
  res.json({ message: 'Aktivnost nije validna!'});
  return 0;
  }

    let nizObjekata = await Aktivnost.findAll();

    let niz = nizObjekata.filter(function(e){
      return e.DanId==req.body["DanId"];
    });

    for(let i=0;i<niz.length;i++)
    {
      let fullOverlap = req.body["pocetak"] <= niz[i].pocetak && req.body["kraj"] > niz[i].pocetak;

      let partialOverlap = req.body["pocetak"] >= niz[i].pocetak && req.body["pocetak"] < niz[i].kraj;
      if (fullOverlap || partialOverlap) {
        res.json({ message: 'Aktivnost nije validna!'});
      return 0;
    }
      
      }



  try{
  const jane = await Aktivnost.create({
    naziv:req.body["naziv"],pocetak:req.body["pocetak"],kraj:req.body["kraj"],PredmetId:req.body["PredmetId"],GrupaId:req.body["GrupaId"],DanId:req.body["DanId"],TipId:req.body["TipId"]
  });
  res.json({ message: 'Aktivnost uspješno kreirana!'});
}catch(greska)
{
  res.json({ message: 'Neki od FK ne postoji!'});
}
})

app.put('/v2/aktivnost/:id', async function(req,res){ 

  if(Number.isInteger(req.body["pocetak"])==false)
  {
    if(req.body["pocetak"]%1!=0.5){
    res.json({ message: 'Aktivnost nije validna!'});
    return 0;
    }
  }

  if(Number.isInteger(req.body["kraj"])==false)
  {
    if(req.body["kraj"]%1!=0.5){
    res.json({ message: 'Aktivnost nije validna!'});
    return 0;
    }
  }



  if(req.body["pocetak"]<8 || req.body["kraj"]>20 || req.body["pocetak"] >= req.body["kraj"] || req.body["pocetak"] < 0 || req.body["kraj"] > 24){
  res.json({ message: 'Aktivnost nije validna!'});
  return 0;
  }

    let nizObjekata = await Aktivnost.findAll();

    let niz = nizObjekata.filter(function(e){
      return e.DanId==req.body["DanId"];
    });

    for(let i=0;i<niz.length;i++)
    {
      let fullOverlap = req.body["pocetak"] <= niz[i].pocetak && req.body["kraj"] > niz[i].pocetak;

      let partialOverlap = req.body["pocetak"] >= niz[i].pocetak && req.body["pocetak"] < niz[i].kraj;
      if (fullOverlap || partialOverlap) {
        res.json({ message: 'Aktivnost nije validna!'});
      return 0;
    }
      
      }

try{
  await Aktivnost.update(
    {
      naziv:req.body["naziv"],pocetak:req.body["pocetak"],kraj:req.body["kraj"],PredmetId:req.body["PredmetId"],GrupaId:req.body["GrupaId"],DanId:req.body["DanId"],TipId:req.body["TipId"]
    },
    {returning: true, where: {id: req.params.id} }
  )
        .then((result)=>{
          if(result[1]==1)
          res.json({ message: 'Update izvršen!'});
          else
          res.json({ message: 'ID ne postoji!'});
        })
}
catch(err){
  res.json({ message: 'Neki od FK ne postoji!'});
  
}
})

app.delete('/v2/aktivnost/:id', async function(req,res){ 
  await Aktivnost.destroy({
    where: {
     id: req.params.id
    }
   }).then(count => { 
    if (!count) {
      res.json({ message: 'ID ne postoji!'});
    }
    else
    res.json({ message: 'Aktivnost izbrisana!'});
   });
})










app.post('/v1/predmet', function(req, res) {

  fs.readFile('predmeti.txt', (err, contents) => {  
    if (err) {
        res.writeHead(504, {'Content-Type': 'application/json'});
        throw err;
    }

    let spisakPredmeta = contents.toString().split("\n");
    var postojiPredmet=false;

    for (var i = 0; i < spisakPredmeta.length; i++) {
      if(spisakPredmeta[i]==req.body["naziv"])
      {
        postojiPredmet=true;
        break;
      }
    }

    if(postojiPredmet==true)
    res.json({ message: 'Naziv predmeta postoji!' })
    else
    {
      fs.appendFile('predmeti.txt', req.body["naziv"]+"\n", function (err) {
    if (err) throw err;
  });
  res.json({ message: 'Uspješno dodan predmet!' })
    }
});
});

app.post('/v1/aktivnost', function(req, res) {

  if(Number.isInteger(req.body["pocetak"])==false)
  {
    if(req.body["pocetak"]%1!=0.5){
    res.json({ message: 'Aktivnost nije validna!'});
    return 0;
    }
  }

  if(Number.isInteger(req.body["kraj"])==false)
  {
    if(req.body["kraj"]%1!=0.5){
    res.json({ message: 'Aktivnost nije validna!'});
    return 0;
    }
  }



  if(req.body["pocetak"]<8 || req.body["kraj"]>20 || req.body["pocetak"] >= req.body["kraj"] || req.body["pocetak"] < 0 || req.body["kraj"] > 24){
  res.json({ message: 'Aktivnost nije validna!'});
  return 0;
  }

  fs.readFile('aktivnosti.txt', (err, contents) => {  
    if (err) {
        res.writeHead(504, {'Content-Type': 'application/json'});
        throw err;
    }
    let spisakAktivnosti = contents.toString().split("\n")
              let nizObjekata = [];
              for(let i=0; i < spisakAktivnosti.length-1;++i){
                  let parametri = spisakAktivnosti[i].split(",");
                  let objekat = { naziv : parametri[0], tip : parametri[1], pocetak : Number(parametri[2]), kraj : Number(parametri[3]), dan : parametri[4]};
                  nizObjekata.push(objekat);
              }

    let niz = nizObjekata.filter(function(e){
      return e.dan==req.body["dan"];
    });

    for(let i=0;i<niz.length;i++)
    {
      let fullOverlap = req.body["pocetak"] <= niz[i].pocetak && req.body["kraj"] > niz[i].pocetak;

      let partialOverlap = req.body["pocetak"] >= niz[i].pocetak && req.body["pocetak"] < niz[i].kraj;
      if (fullOverlap || partialOverlap) {
        res.json({ message: 'Aktivnost nije validna!'});
      return 0;
    }
      
      }
    
 fs.appendFile('aktivnosti.txt', req.body["naziv"]+","+req.body["tip"]+","+req.body["pocetak"]+","+req.body["kraj"]+","+req.body["dan"]+"\n", function (err) {
    if (err) throw err;
  });
  res.json({ message: 'Uspješno dodana aktivnost!' });
  });
     
});
    





app.get('/v1/aktivnosti', function(req, res) {


  fs.readFile('aktivnosti.txt', (err, contents) => {  
  if (err) {
      res.writeHead(504, {'Content-Type': 'application/json'});
      throw err;
  }
  let spisakAktivnosti = contents.toString().split("\n");
            let nizObjekata = [];
            for(let i=0; i < spisakAktivnosti.length-1; ++i){
                let parametri = spisakAktivnosti[i].split(",");
                let objekat = { naziv : parametri[0], tip : parametri[1], pocetak : Number(parametri[2]), kraj : Number(parametri[3]), dan : parametri[4]};
                nizObjekata.push(objekat);
            }
  res.end(JSON.stringify(nizObjekata));
});
});

app.get('/v1/predmeti', function(req, res) {


    fs.readFile('predmeti.txt', (err, contents) => {  
    if (err) {
        res.writeHead(504, {'Content-Type': 'application/json'});
        throw err;
    }

    let spisakPredmeta = contents.toString().split("\n");
    let listaObjekata = [];
    for (var i = 0; i < spisakPredmeta.length-1; i++) {
      let objekat = {naziv:spisakPredmeta[i]};
      listaObjekata.push(objekat);
    }
    res.end(JSON.stringify(listaObjekata));

});
});

app.delete('/v1/all', function (req, res) {
  fs.truncate('predmeti.txt', 0, function(){})

  fs.truncate('aktivnosti.txt', 0, function(){})
  
  res.json({ message: 'Uspješno obrisan sadržaj datoteka!'});
})

app.get('/v1/predmet/:naziv/aktivnost', function(req, res) {
  fs.readFile('aktivnosti.txt', (err, contents) => {  
    if (err) {
        res.writeHead(504, {'Content-Type': 'application/json'});
        throw err;
    }
    let spisakAktivnosti = contents.toString().split("\n");
              let nizObjekata = [];
              for(let i=0; i < spisakAktivnosti.length-1; ++i){
                  let parametri = spisakAktivnosti[i].split(",");
                  let objekat = { naziv : parametri[0], tip : parametri[1], pocetak : Number(parametri[2]), kraj : Number(parametri[3]), dan : parametri[4]};
                  nizObjekata.push(objekat);
              }
              let niz = nizObjekata.filter(function(e){
                return e.naziv==req.params.naziv;
              })

    res.end(JSON.stringify(niz));
  });
 
});

app.delete('/v1/predmet/:naziv', function (req, res) {
  let spisakPredmeta=[];
  let listaObjekata = [];
  fs.readFile('predmeti.txt', (err, contents) => {  
    if (err) {
        res.writeHead(504, {'Content-Type': 'application/json'});
        throw err;
    }
    spisakPredmeta = contents.toString().split("\n");
    for (var i = 0; i < spisakPredmeta.length-1; i++) {
      let objekat = {naziv:spisakPredmeta[i]};
      listaObjekata.push(objekat);
    }
    if (listaObjekata.some(e => e.naziv ===req.params.naziv)) {
      fs.truncate('predmeti.txt', 0, function(){
           let niz = spisakPredmeta.filter(function(e){
        return e!=req.params.naziv;
      })
      var linesExceptFirst =niz.join("\n");
      fs.appendFile('predmeti.txt',linesExceptFirst, function (err) {
        if (err) throw err;
      });
      res.json({ message: 'Uspješno obrisan predmet!'});
      })
    }
    else
    res.json({ message: 'Greška - predmet nije obrisan!'});
});
});

app.delete('/v1/aktivnost/:naziv', function (req, res) {
  let spisakAktivnosti=[];
  let listaObjekata = [];
  fs.readFile('aktivnosti.txt', (err, contents) => {  
    if (err) {
        res.writeHead(504, {'Content-Type': 'application/json'});
        throw err;
    }
    spisakAktivnosti = contents.toString().split("\n");
      for(let i=0; i < spisakAktivnosti.length-1; ++i){
        let parametri = spisakAktivnosti[i].split(",");
        let objekat = { naziv : parametri[0], tip : parametri[1], pocetak : parametri[2], kraj : parametri[3], dan : parametri[4]};
        listaObjekata.push(objekat);
    }
    if (listaObjekata.some(e => e.naziv ===req.params.naziv)) {
      fs.truncate('aktivnosti.txt', 0, function(){
      let niz = listaObjekata.filter(function(e){
        return e.naziv!=req.params.naziv;
      })
      let stringovi = [];
      for(let i=0;i<niz.length;i++)
      {
        stringovi.push(niz[i].naziv+","+niz[i].tip+","+niz[i].pocetak+","+niz[i].kraj+","+niz[i].dan);
      }
      var linesExceptFirst =stringovi.join("\n");
      if(stringovi.length==0){
      fs.truncate('aktivnosti.txt', 0, function(){})
      res.json({ message: 'Uspješno obrisana aktivnost!'});
      }
      else
      {
      linesExceptFirst+="\n";
      fs.appendFile('aktivnosti.txt',linesExceptFirst, function (err) {
        if (err) throw err;
      });
      res.json({ message: 'Uspješno obrisana aktivnost!'});
    }
      })
      
      
      
    }
    else
    res.json({ message: 'Greška - aktivnost nije obrisana!'});

});

});


module.exports = app.listen(3000);




    



  