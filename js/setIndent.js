function setIndent ()
{
    var items = document.getElementById("fileTree").children;
    for (var index = 0; index < items.length; index++)
    {
        var classes = items[index].className;
        var indentCoef = classes.match(/\d+/)[0];
        items[index].style.paddingLeft = 12 * parseInt(indentCoef) + "px";
    }
}
