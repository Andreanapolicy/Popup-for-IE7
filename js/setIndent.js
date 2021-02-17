function setIndent ()
{
    var items = document.getElementsByClassName('b-popup__element-wrapper');
    for (var index in items)
    {
        var classes = items[index].className;
        var indentCoef = classes[classes.length - 1];
        console.log(indentCoef);
        items[index].style.marginLeft = 12 * parseInt(indentCoef) + "px";
    }
};
