var canvas = [],
    ctx = [],
    image = [],
    jacketArray = [],
    topArray = [],
    bottomArray = [],
    shoesArray = [],
    dressArray = [],
    outfitToSave,
    selectInstances

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
    var sideNav = document.querySelectorAll('.sidenav2');
    var options = {
        edge: 'left', // Choose the horizontal origin
        closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: false // Choose whether you can drag to open on touch screens
    }
    var sideNavInstances = M.Sidenav.init(sideNav, options);
    var collapsible = document.querySelectorAll('.collapsible');
    var collapsibleInstances = M.Collapsible.init(collapsible);
    var select = document.querySelectorAll('select');
    selectInstances = M.FormSelect.init(select);
    var modal = document.querySelectorAll('.modal');
    var modalInstances = M.Modal.init(modal);
    console.log(selectInstances)
    var userid = JSON.parse(sessionStorage.getItem('user'));
    loadClothes(userid)

});
var loadClothes = function (userid) {
    db.collection("clothing_item").where("user", "==", userid.uid)
        .get()
        .then(function (querySnapshot) {
            var parent;
            querySnapshot.forEach(function (doc) {
                var parent = document.getElementById("generateOutfitsImages")
                var div = document.createElement("div");
                div.classList.add("col", "s3", "m2")
                var img = document.createElement("img");
                img.classList.add("white", "mainImg","pointer");
                img.style.width = "75px";
                img.style.height = "75px";
                img.src = doc.data().img_url;
                img.onclick = function () {
                    select(this, doc.data().type)
                };
                div.appendChild(img);
                parent.appendChild(div);
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

var select = function (arg, type) {
    var indexRef = window[`${type}Array`].length
    var parent = document.getElementById("selectedParent")
    var div = document.createElement("div");
    div.style.position = "relative"
    div.style.display = "inline-block"
    div.style.margin = "3px 10px"
    div.id = `side-${type}-${indexRef}`;
    var img = new Image();
    img.src = arg.src
    img.style.width = "75px";
    img.style.height = "75px";
    var icon = document.createElement("i")
    icon.classList.add("material-icons", "red", "small", "white-text", "deselectClothes","pointer")
    icon.innerHTML = "close"
    icon.onclick = function () {
        deselect(arg, type, indexRef)
    }
    arg.onclick = function () {
        deselect(arg, type, indexRef)
    }
    arg.classList.add("selectedMain")
    img.onload = function () {
        div.appendChild(img)
        div.appendChild(icon)
        parent.appendChild(div)
    };
    window[`${type}Array`].push({
        src: arg.src,
        type: type
    })
}

var deselect = function (arg, type, indexRef) {
    arg.classList.remove("selectedMain")
    var selectedSide = document.getElementById(`side-${type}-${indexRef}`)
    selectedSide.remove()
    delete window[`${type}Array`][indexRef]
    arg.onclick = function () {
        select(this, type)
    }
    console.log(window[`${type}Array`])
}

function drawImage(img, ctx, object) {
    return function () {
        ctx.drawImage(img, object.dx, object.dy, object.dw, object.dh)
    }
}

var generate = function () {
    var sideNav = document.getElementById("slide-out")
    sideNav.remove()
    var main = document.getElementById("generateOutfitMain")
    main.remove()
    var wrapper = document.getElementById("generatedOutfits")
    wrapper.style.display = "block"
    var parent = document.getElementById("outfitWrapper")
    jacketArray = jacketArray.filter(function (val) {
        return val
    });
    bottomArray = bottomArray.filter(function (val) {
        return val
    });
    topArray = topArray.filter(function (val) {
        return val
    });
    shoesArray = shoesArray.filter(function (val) {
        return val
    });
    dressArray = dressArray.filter(function (val) {
        return val
    });
    var noDressNoJacket = cartesian(topArray, bottomArray, shoesArray); // top bottom shoe
    var noDressJacket = cartesian(topArray, bottomArray, shoesArray, jacketArray) // jacket top bottom shoe
    var dressNoJacket = cartesian(dressArray, shoesArray) // dress shoes 
    var dressJacket = cartesian(dressArray, shoesArray, jacketArray) // jacket dress shoes
    var outfits = noDressNoJacket.concat(noDressJacket, dressNoJacket, dressJacket)

    for (var i = 0; i < outfits.length; i++) {
        var divCol = document.createElement("div");
        divCol.classList.add("white", "canvasHolder", "col", "s12", "m6", "l4", "xl3", "center-align")
        divCol.style.margin = "10px 0px"
        var div = document.createElement("div")
        div.style.maxWidth = "260px"
        div.style.display = "inline-block";
        div.style.border = "#ddd solid 1px"
        canvas[i] = document.createElement("canvas")
        canvas[i].width = "240"
        canvas[i].height = "200"
        var a = document.createElement("a")
        a.classList.add("waves-effect", "cyan", "btn-floating", "dynamicFloatingBtn",) //modal-triger
        a.onclick = (function () {
            var currentI = i;
            return function () {
                saveOutfit(canvas[currentI]);
            }
        })();

        a.href = "#modal1"
        var icon = document.createElement("i")
        icon.classList.add("material-icons")
        icon.innerHTML = "save"
        a.appendChild(icon)
        div.appendChild(a)
        div.appendChild(canvas[i])
        divCol.appendChild(div)
        parent.appendChild(divCol)
        image[i] = []
        ctx[i] = canvas[i].getContext("2d");
        var imgData = ctx[i].getImageData(0, 0, 240, 200);
        var data = imgData.data;
        for (var k = 0; k < data.length; k += 4) {
            if (data[k + 3] < 255) {
                data[k] = 255 - data[k];
                data[k + 1] = 255 - data[k + 1];
                data[k + 2] = 255 - data[k + 2];
                data[k + 3] = 255 - data[k + 3];
            }
        }
        ctx[i].putImageData(imgData,0,0);
        for (var j = 0; j < outfits[i].length; j++) {
            var img = outfits[i][j]
            if (img.type === "jacket") {
                img.dx = 10,
                    img.dy = 0,
                    img.dw = 100,
                    img.dh = 100
            } else if (img.type === "top") {
                img.dx = 140,
                    img.dy = 0,
                    img.dw = 100,
                    img.dh = 100
            } else if (img.type === "bottom") {
                img.dx = 140,
                    img.dy = 100,
                    img.dw = 100,
                    img.dh = 100
            } else if (img.type === "shoes") {
                img.dx = 45,
                    img.dy = 115,
                    img.dw = 50,
                    img.dh = 50
            } else if (img.type === "dress") {
                img.dx = 140,
                    img.dy = 25,
                    img.dw = 100,
                    img.dh = 150
            }
            image[i][j] = new Image()
            image[i][j].crossOrigin = "anonymous";

            ctx[i].translate(0.5, 0.5)
            // change non-opaque pixels to white

            image[i][j].onload = drawImage(image[i][j], ctx[i], img)
            image[i][j].src = img.src;
        }
    }
}
// var activeOutfit = function (arg) {
//     outfitToSave = arg
// }

function cartesian() {
    var r = [],
        arg = arguments,
        max = arg.length - 1;

    function helper(arr, i) {
        for (var j = 0, l = arg[i].length; j < l; j++) {
            var a = arr.slice(0); // clone arr
            a.push(arg[i][j]);
            if (i == max)
                r.push(a);
            else
                helper(a, i + 1);
        }
    }
    helper([], 0);
    return r;
}