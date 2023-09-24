function toggleMenu() {
    var bar = document.getElementById("sidebar");

    var menu = bar.getElementsByTagName("nav")[0];

    if(menu.style.left == "") {
        menu.style.left = "-12em";
    } else if (menu.style.left = "-12em") {
        menu.style.left = "";
    }
}

window.onload = function(e){
    document.getElementById("navtrigger").addEventListener("touchend", toggleMenu, false);
}

