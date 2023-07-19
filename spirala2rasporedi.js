let div=document.getElementById("okvir");
iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],9,21);
dodajAktivnost(div,"WT","predavanje",9,12,"Ponedjeljak");
dodajAktivnost(div,"WT","vježbe",12,13.5,"Ponedjeljak");
dodajAktivnost(div,"WT","vježbe",11,13.5,"Ponedjeljak"); //preklapanje
dodajAktivnost(div,"RMA","predavanje",14,17,"Ponedjeljak");
dodajAktivnost(div,"RMA","vježbe",12.5,14,"Utorak");

dodajAktivnost(div,"RMA","vježbe",12,13,"Utorak"); //preklapanje

dodajAktivnost(div,"DM","tutorijal",14,16,"Utorak");
dodajAktivnost(div,"DM","predavanje",16,19,"Utorak");
dodajAktivnost(div,"RA","predavanje",10.5,12,"Srijeda");
dodajAktivnost(div,"RA","predavanje",9,13,"Srijeda"); //preklapanje
dodajAktivnost(div,"WT","spirala",12,15.5,"Srijeda");
dodajAktivnost(div,"RG","projekat",11,14.5,"Četvrtak");
dodajAktivnost(div,"WT","spirala",16.5,19,"Četvrtak");
dodajAktivnost(div,"WT","spirala",15,17,"Četvrtak"); //preklapanje
dodajAktivnost(div,"AFJ","učenje",20,21,"Petak");
dodajAktivnost(div,"AFJ","predavanje",9,11.5,"Petak");
dodajAktivnost(div,"AFJ","predavanje",11,12,"Petak"); //preklapanje
dodajAktivnost(div,"AFJ","predavanje",7,9,"Petak"); //ne postoji vrijeme u rasporedu


