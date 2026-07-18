function le3ba() {
    var out=document.getElementById("out");
    out.innerHTML="Jadet Alik,Berasmi Taw Nebda fih ala 9rib !";
    out.style.color="red";
    out.style.fontSize="20px";
    var vb = document.getElementById('vanishBtn');
    if(vb) vb.style.display = 'inline-block';
}

function vanishAll() {
    var app = document.getElementById('app');
    var vm = document.getElementById('vanishMessage');
    if (app) {
        /*app.style.display = 'none';*/
        app.style.opacity="0";
    } else {
        // fallback: clear body content
        document.body.innerHTML = '';
    }
    if (vm) {
        vm.style.display = 'flex';
        vm.style.opacity = '0';
        // trigger a repaint then fade in
        setTimeout(function(){ vm.style.opacity = '1'; }, 20);
    } else {
        var msg = document.createElement('div');
        msg.textContent = 'ti rzeni fi site';
        msg.style.fontSize = '24px';
        document.body.appendChild(msg);
    }
}
