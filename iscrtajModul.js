let raspored = (function(){
var prvi =[];
var drugi =[];
var treci =[];
var cetvrti =[];
var peti =[];
var vrijeme1 =0;
var vrijeme2=0;


var iscrtajRaspored=function(div,dani,satPocetak,satKraj) {

    if(dani.length==0 || satPocetak >= satKraj || Number.isInteger(satPocetak)==false || Number.isInteger(satKraj)==false || satPocetak < 0 || satKraj > 24)
        div.innerHTML = "Greška";
        else
        {

        var brojKolona=satKraj-satPocetak;
        brojKolona=(brojKolona*2)+1;

    
            var body = document.body,
                tbl  = document.createElement('table');
                

                var tr = tbl.insertRow();
                for (var i = satPocetak; i < satKraj; i++) {
                    var th = document.createElement("th");
                    tr.appendChild(th);
                    th.setAttribute("colSpan", 2);
                    if (i == satPocetak) {
                      if (i < 10) th.appendChild(document.createTextNode("0" + i + ":00"));
                      else th.appendChild(document.createTextNode(i + ":00"));
                    } 
                    else if ((i % 2 == 0 && i < 14) || (i % 2 == 1 && i >= 15)) {
                      if (i < 10) th.appendChild(document.createTextNode("0" + i + ":00"));
                      else th.appendChild(document.createTextNode(i + ":00"));
                    }
                  }

            for(var i = 0; i < dani.length; i++){
                var tr = tbl.insertRow();
                for(var j = 0; j < brojKolona; j++){
                        
                        var td = tr.insertCell();
                        if(i==0 && j==0)
                        td.setAttribute("class", "boldirano");
                        if(j==0)
                        td.appendChild(document.createTextNode(dani[i]));       
                }
            }
           
            
            div.appendChild(tbl);
            vrijeme1=satPocetak;
            vrijeme2=satKraj;
        }
    }


var pomocnaAktivnost=function(dan,aktivnost){

    if(dan.localeCompare("Ponedjeljak")==0)
    {
        for(var i = 0; i < prvi.length; i++)
            {
                if((aktivnost.vrijemePocetak >= prvi[i].vrijemePocetak && aktivnost.vrijemePocetak<prvi[i].vrijemeKraj) || (aktivnost.vrijemeKraj >= prvi[i].vrijemePocetak && aktivnost.vrijemeKraj<prvi[i].vrijemeKraj)|| (aktivnost.vrijemePocetak <= prvi[i].vrijemePocetak && aktivnost.vrijemeKraj>=prvi[i].vrijemeKraj))
            {alert("Greška - već postoji termin u rasporedu u zadanom vremenu");
            return 0;
            }
                
            }
            prvi.push(aktivnost);
            prvi.sort(function(a, b) {
                return parseFloat(a.vrijemePocetak) - parseFloat(b.vrijemePocetak);
            });
    }
    if(dan.localeCompare("Utorak")==0)
    {
        for(var i = 0; i < drugi.length; i++)
            {
                if((aktivnost.vrijemePocetak >= drugi[i].vrijemePocetak && aktivnost.vrijemePocetak<drugi[i].vrijemeKraj) || (aktivnost.vrijemeKraj >= drugi[i].vrijemePocetak && aktivnost.vrijemeKraj<drugi[i].vrijemeKraj)|| (aktivnost.vrijemePocetak <= drugi[i].vrijemePocetak && aktivnost.vrijemeKraj>=drugi[i].vrijemeKraj))
                {alert("Greška - već postoji termin u rasporedu u zadanom vremenu");
            return 0;
            }
            }
            drugi.push(aktivnost);
            drugi.sort(function(a, b) {
                return parseFloat(a.vrijemePocetak) - parseFloat(b.vrijemePocetak);
            });
    }
    if(dan.localeCompare("Srijeda")==0)
    {
        for(var i = 0; i < treci.length; i++)
            {
                if((aktivnost.vrijemePocetak >= treci[i].vrijemePocetak && aktivnost.vrijemePocetak<treci[i].vrijemeKraj) || (aktivnost.vrijemeKraj >= treci[i].vrijemePocetak && aktivnost.vrijemeKraj<treci[i].vrijemeKraj)|| (aktivnost.vrijemePocetak <= treci[i].vrijemePocetak && aktivnost.vrijemeKraj>=treci[i].vrijemeKraj))
                {alert("Greška - već postoji termin u rasporedu u zadanom vremenu");
            return 0;
            }
            }
            treci.push(aktivnost);
            treci.sort(function(a, b) {
                return parseFloat(a.vrijemePocetak) - parseFloat(b.vrijemePocetak);
            });
    }
    if(dan.localeCompare("Četvrtak")==0)
    {
        for(var i = 0; i < cetvrti.length; i++)
            {
                if((aktivnost.vrijemePocetak >= cetvrti[i].vrijemePocetak && aktivnost.vrijemePocetak<cetvrti[i].vrijemeKraj) || (aktivnost.vrijemeKraj >= cetvrti[i].vrijemePocetak && aktivnost.vrijemeKraj<cetvrti[i].vrijemeKraj)|| (aktivnost.vrijemePocetak <= cetvrti[i].vrijemePocetak && aktivnost.vrijemeKraj>=cetvrti[i].vrijemeKraj))
                {alert("Greška - već postoji termin u rasporedu u zadanom vremenu");
            return 0;
            }
            }
            cetvrti.push(aktivnost);
            peti.sort(function(a, b) {
                return parseFloat(a.vrijemePocetak) - parseFloat(b.vrijemePocetak);
            });
    }
    if(dan.localeCompare("Petak")==0)
    {
        for(var i = 0; i < peti.length; i++)
            {
                if((aktivnost.vrijemePocetak >= peti[i].vrijemePocetak && aktivnost.vrijemePocetak<peti[i].vrijemeKraj) || (aktivnost.vrijemeKraj >= peti[i].vrijemePocetak && aktivnost.vrijemeKraj<peti[i].vrijemeKraj)|| (aktivnost.vrijemePocetak <= peti[i].vrijemePocetak && aktivnost.vrijemeKraj>=peti[i].vrijemeKraj))
                {alert("Greška - već postoji termin u rasporedu u zadanom vremenu");
            return 0;
            }
            }
            peti.push(aktivnost);
            peti.sort(function(a, b) {
                return parseFloat(a.vrijemePocetak) - parseFloat(b.vrijemePocetak);
            });
    }
}

var dodajAktivnost=function(raspored, naziv, tip, vrijemePocetak, vrijemeKraj,dan){
    
    var tabela=raspored.firstChild;
    
    if(tabela==null)
    {
     alert("Greška - raspored nije kreiran");
     return 0;
    }

     if(vrijemePocetak>=vrijemeKraj || vrijemePocetak<0 || vrijemePocetak>24 || vrijemeKraj<0 || vrijemeKraj>24 || vrijemePocetak<vrijeme1 || vrijemePocetak>vrijeme2 || vrijemeKraj>vrijeme2 || vrijemeKraj<vrijeme1)
     {
     alert("Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin");
     return 0;
     }

     var provjeraDani = [];
     for(var i = 0; i < tabela.rows.length; i++)
     {
         provjeraDani.push(tabela.rows[i].cells[0].innerHTML);
     }
    
     if(provjeraDani.includes(dan)==false){
     alert("Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin");
     return 0;
     }

     var aktivnost = {naziv:naziv, tip:tip, vrijemePocetak:vrijemePocetak,vrijemeKraj:vrijemeKraj};
     if(pomocnaAktivnost(dan,aktivnost)==false)
     return 0;
     dodaj(raspored,dan)
     return 1;

}

var  dodaj = function(raspored,dan)
{
    if(dan.localeCompare("Ponedjeljak")==0){
    var tabela = raspored.firstChild;
    var noviPocetak=vrijeme1*2;
    var noviKraj=vrijeme2*2;
    var velicina = tabela.rows[1].cells.length;

    for(var i = 0; i < velicina-1; i++)
    tabela.rows[1].deleteCell(-1);

    var k=0;
    for(var i = noviPocetak; i < noviKraj; i++)
    {
        if(i==(prvi[k].vrijemePocetak*2))
        {
            var td = tabela.rows[1].insertCell();
            td.setAttribute("colSpan",prvi[k].vrijemeKraj*2-prvi[k].vrijemePocetak*2);
            var h3=document.createElement("h3");
                h3.innerHTML=prvi[k].naziv;
                td.appendChild(h3);
                var p=document.createElement("p");
                p.innerHTML=prvi[k].tip;
                td.appendChild(p);

            if(Number.isInteger(prvi[k].vrijemePocetak)==true && Number.isInteger(prvi[k].vrijemeKraj)==true)
            td.setAttribute("class", "obje");

            if(Number.isInteger(prvi[k].vrijemePocetak)==false && Number.isInteger(prvi[k].vrijemeKraj)==true)
            td.setAttribute("class", "lijevo");

            if(Number.isInteger(prvi[k].vrijemePocetak)==true && Number.isInteger(prvi[k].vrijemeKraj)==false)
            td.setAttribute("class", "desno");

            i-=1;
            i+=prvi[k].vrijemeKraj*2-prvi[k].vrijemePocetak*2;
            if(k<prvi.length-1)
            {
              k++;  
            }
            
        }
        else
        {
            var td = tabela.rows[1].insertCell();
        }
}

    }
    if(dan.localeCompare("Utorak")==0){
        var tabela = raspored.firstChild;
        var noviPocetak=vrijeme1*2;
        var noviKraj=vrijeme2*2;
        var velicina = tabela.rows[2].cells.length;
    
        for(var i = 0; i < velicina-1; i++)
        tabela.rows[2].deleteCell(-1);
    
        var k=0;
        for(var i = noviPocetak; i < noviKraj; i++)
        {
            if(i==(drugi[k].vrijemePocetak*2))
            {
                var td = tabela.rows[2].insertCell();
                td.setAttribute("colSpan",drugi[k].vrijemeKraj*2-drugi[k].vrijemePocetak*2);
                var h3=document.createElement("h3");
                h3.innerHTML=drugi[k].naziv;
                td.appendChild(h3);
                var p=document.createElement("p");
                p.innerHTML=drugi[k].tip;
                td.appendChild(p);

                if(Number.isInteger(drugi[k].vrijemePocetak)==true && Number.isInteger(drugi[k].vrijemeKraj)==true)
                td.setAttribute("class", "obje");

                if(Number.isInteger(drugi[k].vrijemePocetak)==false && Number.isInteger(drugi[k].vrijemeKraj)==true)
                td.setAttribute("class", "lijevo");

                if(Number.isInteger(drugi[k].vrijemePocetak)==true && Number.isInteger(drugi[k].vrijemeKraj)==false)
                td.setAttribute("class", "desno");

                i-=1;
                i+=drugi[k].vrijemeKraj*2-drugi[k].vrijemePocetak*2;
                if(k<drugi.length-1)
                {
                  k++;  
                }
                
            }
            else
            {
                var td = tabela.rows[2].insertCell();
            }
    }
    
        }

        if(dan.localeCompare("Srijeda")==0){
            var tabela = raspored.firstChild;
            var noviPocetak=vrijeme1*2;
            var noviKraj=vrijeme2*2;
            var velicina = tabela.rows[3].cells.length;
        
            for(var i = 0; i < velicina-1; i++)
            tabela.rows[3].deleteCell(-1);
        
            var k=0;
            for(var i = noviPocetak; i < noviKraj; i++)
            {
                if(i==(treci[k].vrijemePocetak*2))
                {
                    var td = tabela.rows[3].insertCell();
                    td.setAttribute("colSpan",treci[k].vrijemeKraj*2-treci[k].vrijemePocetak*2);
                    var h3=document.createElement("h3");
                    h3.innerHTML=treci[k].naziv;
                    td.appendChild(h3);
                    var p=document.createElement("p");
                    p.innerHTML=treci[k].tip;
                    td.appendChild(p);

                    if(Number.isInteger(treci[k].vrijemePocetak)==true && Number.isInteger(treci[k].vrijemeKraj)==true)
                     td.setAttribute("class", "obje");

                    if(Number.isInteger(treci[k].vrijemePocetak)==false && Number.isInteger(treci[k].vrijemeKraj)==true)
                    td.setAttribute("class", "lijevo");

                   if(Number.isInteger(treci[k].vrijemePocetak)==true && Number.isInteger(treci[k].vrijemeKraj)==false)
                   td.setAttribute("class", "desno");

                    i-=1;
                    i+=treci[k].vrijemeKraj*2-treci[k].vrijemePocetak*2;
                    if(k<treci.length-1)
                    {
                      k++;  
                    }
                    
                }
                else
                {
                    var td = tabela.rows[3].insertCell();
                }
        }
        
            }
    
            if(dan.localeCompare("Četvrtak")==0){
                var tabela = raspored.firstChild;
                var noviPocetak=vrijeme1*2;
                var noviKraj=vrijeme2*2;
                var velicina = tabela.rows[4].cells.length;
            
                for(var i = 0; i < velicina-1; i++)
                tabela.rows[4].deleteCell(-1);
            
                var k=0;
                for(var i = noviPocetak; i < noviKraj; i++)
                {
                    if(i==(cetvrti[k].vrijemePocetak*2))
                    {
                        var td = tabela.rows[4].insertCell();
                        td.setAttribute("colSpan",cetvrti[k].vrijemeKraj*2-cetvrti[k].vrijemePocetak*2);
                        var h3=document.createElement("h3");
                        h3.innerHTML=cetvrti[k].naziv;
                        td.appendChild(h3);
                        var p=document.createElement("p");
                        p.innerHTML=cetvrti[k].tip;
                        td.appendChild(p);
                        if(Number.isInteger(cetvrti[k].vrijemePocetak)==true && Number.isInteger(cetvrti[k].vrijemeKraj)==true)
                     td.setAttribute("class", "obje");

                    if(Number.isInteger(cetvrti[k].vrijemePocetak)==false && Number.isInteger(cetvrti[k].vrijemeKraj)==true)
                    td.setAttribute("class", "lijevo");

                   if(Number.isInteger(cetvrti[k].vrijemePocetak)==true && Number.isInteger(cetvrti[k].vrijemeKraj)==false)
                   td.setAttribute("class", "desno");

                        i-=1;
                        i+=cetvrti[k].vrijemeKraj*2-cetvrti[k].vrijemePocetak*2;
                        if(k<cetvrti.length-1)
                        {
                          k++;  
                        }
                        
                    }
                    else
                    {
                        var td = tabela.rows[4].insertCell();
                    }
            }
            
                }

                if(dan.localeCompare("Petak")==0){
                    var tabela = raspored.firstChild;
                    var noviPocetak=vrijeme1*2;
                    var noviKraj=vrijeme2*2;
                    var velicina = tabela.rows[5].cells.length;
                
                    for(var i = 0; i < velicina-1; i++)
                    tabela.rows[5].deleteCell(-1);
                
                    var k=0;
                    for(var i = noviPocetak; i < noviKraj; i++)
                    {
                        if(i==(peti[k].vrijemePocetak*2))
                        {
                            var td = tabela.rows[5].insertCell();
                            td.setAttribute("colSpan",peti[k].vrijemeKraj*2-peti[k].vrijemePocetak*2);
                            var h3=document.createElement("h3");
                            h3.innerHTML=peti[k].naziv;
                            td.appendChild(h3);
                            var p=document.createElement("p");
                            p.innerHTML=peti[k].tip;
                            td.appendChild(p);
                            if(Number.isInteger(peti[k].vrijemePocetak)==true && Number.isInteger(peti[k].vrijemeKraj)==true)
                            td.setAttribute("class", "obje");

                            if(Number.isInteger(peti[k].vrijemePocetak)==false && Number.isInteger(peti[k].vrijemeKraj)==true)
                            td.setAttribute("class", "lijevo");

                            if(Number.isInteger(peti[k].vrijemePocetak)==true && Number.isInteger(peti[k].vrijemeKraj)==false)
                           td.setAttribute("class", "desno");

                            i-=1;
                            i+=peti[k].vrijemeKraj*2-peti[k].vrijemePocetak*2;
                            if(k<peti.length-1)
                            {
                              k++;  
                            }
                            
                        }
                        else
                        {
                            var td = tabela.rows[5].insertCell();
                        
                        }
                }
                
                    }

                    
}
return {
                        iscrtajRaspored:iscrtajRaspored,
                        dodajAktivnost: dodajAktivnost
                    }
}
());
