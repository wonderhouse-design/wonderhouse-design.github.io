function toggleMenu() {
    var menu = document.getElementById("sidebar").getElementsByTagName("nav")[0];
    if(menu.style.left == "") {
        menu.style.left = "-12em";
    } else if (menu.style.left = "-12em") {
        menu.style.left = "";
    }
}

window.onload = function(e){
    document.getElementById("navtrigger").addEventListener("touchend", toggleMenu, false);
    var items = document.getElementsByClassName("s-sidebar__trigger");
    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener("touchend", toggleMenu, false);
    }
}

