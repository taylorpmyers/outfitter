var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvasClothes = {
    jacket: {
        active: false,
        dx: 10,
        dy: 0,
        dw: 100,
        dh: 100,
    },
    top: {
        active: false,
        dx: 140,
        dy: 0,
        dw: 100,
        dh: 100,
    },
    shoes: {
        active: false,
        dx: 45,
        dy: 115,
        dw: 50,
        dh: 50,
    },
    bottom: {
        active: false,
        dx: 140,
        dy: 100,
        dw: 100,
        dh: 100,
    },
    dress: {
        active: false,
        dx: 140,
        dy: 25,
        dw: 100,
        dh: 150,
    },
}

function loadImage(imgIndex) {
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
        ctx.drawImage(img, imgIndex.dx, imgIndex.dy, imgIndex.dw, imgIndex.dh)
    }
    img.src = imgIndex.active.src;
    return img;
}
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
    var select = document.querySelectorAll('select');
    selectInstances = M.FormSelect.init(select);
    var collapsible = document.querySelectorAll('.collapsible');
    var collapsibleInstances = M.Collapsible.init(collapsible);
    var tabs = document.querySelectorAll('.tabs')
    var tabsInstance = M.Tabs.init(tabs);
    var modal = document.querySelectorAll('.modal');
    var modalInstances = M.Modal.init(modal);

    var userid = JSON.parse(sessionStorage.getItem('user'));
    getClothingItems(userid, "jacket")
    getClothingItems(userid, "top")
    getClothingItems(userid, "bottom")
    getClothingItems(userid, "shoes")
    getClothingItems(userid, "dress")
});

var getClothingItems = function (userid, type) {
    db.collection("clothing_item").where("user", "==", userid.uid).where("type", "==", type)
        .get()
        .then(function (querySnapshot) {
            var parent = document.getElementById(`${type}Div`)
            querySnapshot.forEach(function (doc) {
                var div = document.createElement("div");
                div.classList.add("col", "s3");
                var img = document.createElement("img");
                img.classList.add("white", `${type}`, "pointer");
                img.style.width = "75px";
                img.style.height = "75px";
                img.src = doc.data().img_url;
                img.onclick = function () {
                    updateCanvasImg(this)
                };
                div.appendChild(img);
                parent.appendChild(div);
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

var updateCanvasImg = function (arg) {

    var type = arg.classList[1]

    if (type === "bottom" && canvasClothes.dress.active || type === "top" && canvasClothes.dress.active) {
        canvasClothes.dress.active.classList.remove("activeImg")
        canvasClothes.dress.active = false;
        canvasClothes.dress.loaded = false;
        ctx.clearRect(140, 0, 100, 200);
    } else if (type === "dress" && canvasClothes.top.active && canvasClothes.bottom.active) {
        canvasClothes.top.active.classList.remove("activeImg")
        canvasClothes.top.active = false;
        canvasClothes.top.loaded = false;
        canvasClothes.bottom.active.classList.remove("activeImg")
        canvasClothes.bottom.loaded = false;
        canvasClothes.bottom.active = false;
        ctx.clearRect(140, 0, 100, 200);
    } else if (type === "dress" && canvasClothes.top.active) {
        canvasClothes.top.active.classList.remove("activeImg")
        canvasClothes.top.active = false;
        canvasClothes.top.loaded = false;
        ctx.clearRect(140, 0, 100, 200);
    } else if (type === "dress" && canvasClothes.bottom.active) {
        canvasClothes.bottom.active.classList.remove("activeImg")
        canvasClothes.bottom.loaded = false;
        canvasClothes.bottom.active = false;
        ctx.clearRect(140, 0, 100, 200);
    }

    if (arg.classList[3]) {
        canvasClothes[type].active = false
        canvasClothes[type].loaded = false
        arg.classList.remove("activeImg")
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        renderCanvas()

    } else if (canvasClothes[type].active) {
        canvasClothes[type].active.classList.remove("activeImg")
        canvasClothes[type].loaded = null;
        arg.classList.add("activeImg")
        canvasClothes[type].active = arg
        renderCanvas()

    } else {
        arg.classList.add("activeImg")
        canvasClothes[type].active = arg
        renderCanvas()
    }


}

var renderCanvas = function () {
    var imgArray = []
    for (var key in canvasClothes) {
        var img = canvasClothes[key];
        if (img.active) {
            imgArray.push(img)
        }
    }
    if (imgArray.length == 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
        for (i = 0; i < imgArray.length; i++) {
            loadImage(imgArray[i])
        }
    }
}

var transparent = function () {
    var imgData = ctx.getImageData(0, 0, 240, 200);
    var data = imgData.data;
    for (var k = 0; k < data.length; k += 4) {
        if (data[k + 3] < 255) {
            data[k] = 255 - data[k];
            data[k + 1] = 255 - data[k + 1];
            data[k + 2] = 255 - data[k + 2];
            data[k + 3] = 255 - data[k + 3];
        }
    }
    ctx.putImageData(imgData, 0, 0);
    saveOutfit(canvas)
}