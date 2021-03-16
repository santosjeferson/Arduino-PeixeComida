function Fire_input() {

    config = {
        apiKey: "-",
        authDomain: "-",
        databaseURL: "-",
        projectId: "-",
        storageBucket: "-",
        messagingSenderId: "-",
        appId: "-"
    };
    // Initialize Firebase 

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
        ref = firebase.database().ref()

    }
    return ref
}



ref = Fire_input()

ref.child("Historico").child("Atual").on("child_added", function(snapshot) {
    KeyAtual = snapshot.key

    // Get dados firebase atual
    ref.child("Historico").child("Atual").child(KeyAtual).on("value", function(snapshot) {
        GetFirebaseAtual = snapshot.val()

        var table = document.getElementById("myTable")

        var row = table.insertRow(0);
        var cell1 = row.insertCell(0);

        cell1.innerHTML = GetFirebaseAtual;

    });

});



ref.child("Historico").child("Proxima").on("child_added", function(snapshot) {
    KeyProximo = snapshot.key

    ref.child("Historico").child("Proxima").child(KeyProximo).on("value", function(snapshot) {
        GetFirebaseProximo = snapshot.val()

        var table = document.getElementById("myTable2")
        var row = table.insertRow(0);

        var cell2 = row.insertCell(0); /// coluna proxima
        cell2.innerHTML = GetFirebaseProximo;

    });

});


function ON() {
    ref = Fire_input()
    button = document.getElementById("On").id;

    ref.child("Button").set({
        Acao: button
    });

}

function ONLUZ() {
    ref = Fire_input()
    luz = document.getElementById("Onluz").id;

    ref.child("Luz").set({
        Luz: luz
    });

}

function OFF() {
    ref = Fire_input()
    button = document.getElementById("Off").id;

    ref.child("Button").set({
        Acao: button
    });
}


function OFFLUZ() {
    ref = Fire_input()
    luz = document.getElementById("Offluz").id;

    ref.child("Luz").set({
        Luz: luz
    });

}


function _TIMER() {
    ref = Fire_input()
    timer = document.getElementById('timer').id;

    ref.child("Button").set({
        Acao: timer
    });

    ref.child("Luz").set({
        Luz: timer
    });
}

function _Comida() {

    comida = document.getElementById('Comida').id;

    function diasNoMesSearch(mes, ano) {
        let data = new Date(ano, mes, 0);
        return data.getDate();
    }

    var today = new Date();
    var dy = today.getDate();
    var mt = today.getMonth() + 1;
    var yr = today.getFullYear();

    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();

    today.setHours(today.getHours() + 8); // hora atual + 8
    var t = new String(today);
    var pxh = t.substring(15, 21);


    let mesAtual = new Date().getMonth() + 1;

    let anoAtual = new Date().getFullYear();
    let diasNoMes = diasNoMesSearch(mesAtual, anoAtual);

    let diaAtual = new Date().getDate();

    if (diaAtual == diasNoMes) {
        diaAtual = 1;
        mesAtual += +1;
    } else {

        if (pxh > "23:59" || pxh == "00:00") {
            diaAtual += +1;
        }
    }


    if (mesAtual == 11) {
        anoAtual += 1;
        mesAtual = 0;
    }

    if (mesAtual < 10) mesAtual = '0' + mesAtual;
    if (mt < 10) mt = '0' + mt;
    if (dy < 10) dy = '0' + dy;
    if (diaAtual < 10) diaAtual = '0' + diaAtual;
    if (h < 10) h = '0' + h;
    if (m < 10) m = '0' + m;
    if (s < 10) s = '0' + s;

    var atual = (dy + '/' + mt + '/' + yr + ' H:' + h + ':' + m)

    var proxima = (diaAtual + '/' + mesAtual + '/' + anoAtual + ' H:' + pxh)


    ref.child('Dados').set({
        Atual: atual,
        Proxima: proxima
    });

    ref.child('Alimentar').set({
        Acao: comida
    });
}