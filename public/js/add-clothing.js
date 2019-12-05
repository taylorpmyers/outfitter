var selectedFile;
var selectInstances;

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
    var select = document.querySelectorAll('select');
    selectInstances = M.FormSelect.init(select);
});

var addClothing = function () {
   
    var data = {
        type: document.getElementById("clothingType").value,
        // color: selectInstances[2].getSelectedValues(),
        // occasion: selectInstances[1].getSelectedValues(),
    }
    firebasePost("clothing_item", userid, selectedFile, data);
}
var onFileSelection = function (event) {
    if (event.target.files && event.target.files[0]) {
        var img = document.querySelector('#preview');
        selectedFile = event.target.files[0]
        console.log(selectedFile)
        img.src = URL.createObjectURL(event.target.files[0]);
    }
}
