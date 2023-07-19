const supertest = require("supertest");
const assert = require('assert');
const app = require("../index");
const fs = require('fs');

const data = fs.readFileSync('testniPodaci.txt', 
              {encoding:'utf8'}); 

              let spisakAktivnosti = data.toString().split(/\r?\n/);
              let nizObjekata = [];
              for(let i=0; i < spisakAktivnosti.length; ++i){
                  let parametri = spisakAktivnosti[i].split(",");
                  let objekat = { operacija : parametri[0], ruta : parametri[1], ulaz : parametri[2], izlaz : parametri[3]};
                  if(objekat.operacija=="POST")
                  {
                    let pozicija = 0;
                    let string ="";
                    let string2="";
                    for(let i=2;i<parametri.length;i++) 
                    {
                      if(parametri[i].includes("}"))
                      {
                        string+=parametri[i];
                        pozicija=i+1;
                        break;
                      }
                      else
                      {
                      string+=parametri[i];
                      string+=",";
                      }
                    }
                    objekat.ulaz=string;

                    for(let i=pozicija;i<parametri.length;i++)
                    {
                      if(parametri[i].includes("}"))
                      {
                        string2+=parametri[i];
                        break;
                      }
                      else
                      {
                      string2+=parametri[i];
                      string2+=",";
                      }
                    }
                    objekat.izlaz=string2;
                  }
                  if(objekat.operacija=="GET")
                  {
                    let pomocni = [];
                    for(let i=3;i<parametri.length;i++)
                  {
                    pomocni.push(parametri[i]);
                  }
                  let string = pomocni.join(",");
                  objekat.izlaz=string;                  
                }
                  nizObjekata.push(objekat);
              }

              for(let i=0;i<nizObjekata.length;i++)
              {
               let praviUlaz=JSON.stringify(JSON.parse(nizObjekata[i].ulaz.replace(/\\\"/g,"\"")));
               let praviIzlau=JSON.stringify(JSON.parse(nizObjekata[i].izlaz.replace(/\\\"/g,"\"")));
                if(nizObjekata[i].operacija=="GET")
                {
                  describe("Test "+(i+1), function() {
                    it("Test GET "+nizObjekata[i].ruta+" rute", function(done) {
                          supertest(app)
                            .get(nizObjekata[i].ruta)
                            .expect(praviIzlau)
                            .end(function(err, res){
                              if (err) done(err);
                              done();
                            });
                        });
                      });
                }
                if(nizObjekata[i].operacija=="DELETE")
                {
                  describe("Test "+(i+1), function() {
                    it("Test DELETE"+nizObjekata[i].ruta+" rute", function(done) {
                          supertest(app)
                            .delete(nizObjekata[i].ruta)
                            .expect(praviIzlau)
                            .end(function(err, res){
                              if (err) done(err);
                              done();
                            });
                        });
                      });
                }
                if(nizObjekata[i].operacija=="POST")
                {
                
                  describe("Test "+(i+1), function() {
                    it("Test POST"+nizObjekata[i].ruta+" rute", function(done) {
                          supertest(app)
                            .post(nizObjekata[i].ruta).type("json")
                            .send(praviUlaz)
                            .expect(praviIzlau)
                            .end(function(err, res){
                              if (err) done(err);
                              done();
                            });
                        });
                      });
                }
              }


 
            
                    