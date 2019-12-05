var docToDelete;
var storageToDelete;
var table;

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
    var tabs = document.querySelectorAll('.tabs')
    var tabsInstance = M.Tabs.init(tabs);
    var collapsible = document.querySelectorAll('.collapsible');
    var collapsibleInstances = M.Collapsible.init(collapsible);
    var select = document.querySelectorAll('select');
    var selectInstances = M.FormSelect.init(select);
    var modal = document.querySelectorAll('.modal');
    var modalInstances = M.Modal.init(modal);
    var userid = JSON.parse(sessionStorage.getItem('user'));
    loadCloset("clothing_item", userid)
    loadCloset("outfit", userid)
});
var loadCloset = function (table, userid) {
    db.collection(table).where("user", "==", userid.uid)
        .get()
        .then(function (querySnapshot) {
            var parent;
            querySnapshot.forEach(function (doc,i) {
                var parent = document.getElementById(table)
                var col = document.createElement("div")
                col.id = doc.id
                col.style.margin = "10px 0px"
                var div = document.createElement("div");
                div.style.border = "#ddd solid 1px"
                div.classList.add("outfitCenter")
                if (table === "outfit") {
                    col.classList.add("canvasHolder", "col", "s12", "m6", "l4", "xl3")
                    div.style.maxWidth = "260px"
                } else {
                    col.classList.add("canvasHolder", "col", "s6", "m4", "l3", "xl2")
                    div.style.maxWidth = "135px"
                }

                var img = document.createElement("img");
                img.classList.add("white", "mainImg", `${table}Closet`);
                img.src = doc.data().img_url;
                var a = document.createElement("a")
                a.classList.add("waves-effect", "red", "btn-floating", "modal-trigger", "dynamicFloatingBtn")
                a.onclick = function () {
                    updateDoc(doc.id,doc.data().img_ref,table)
                }
                a.href = "#modal1"
                var icon = document.createElement("i")
                icon.classList.add("material-icons")
                icon.innerHTML = "delete_forever"
                a.appendChild(icon)
                div.appendChild(a)
                div.appendChild(img)
                col.appendChild(div)
                parent.appendChild(col)
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}
var updateDoc = function (docId,storageRef, tableName) {
    docToDelete = docId;
    storageToDelete = storageRef
    table = tableName;   
}

var removeElement = function (docId){
    var el = document.getElementById(docId);
    el.remove();
}