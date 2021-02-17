window.onload = function ()
{
    var preloader = document.getElementById('popup');
    var deg = 0;
    var nodes = [tree];
    initSelectionTree(tree, onItemSelected(nodes), undefined);
    setIndent();
    // setInterval(function ()
    // {
    //     deg += 5;
    //     preloader.style.transform = '-mc-rotate(' + deg + 'deg)';
    // }, 10);

    function initSelectionTree(tree, onItemSelected, selectedItemId)
    {
        if (!selectedItemId)
        {
            selectedItemId = tree.id;
        }


        startRenderTree(tree, nodes, 0);
    }
};

/**
 * @param {TreeNode} tree
 * @param {function(Array<TreeNode>):void} onItemSelected
 * @param {string|undefined} selectedItemId
 * @return {Element}
 */

/**
 * @typedef {{
 *   id: string,
 *   title: string,
 *   type: ContentType,
 *   unselectable: boolean,
 *   children: (Array<TreeNode>|undefined),
 * }}
 */
var TreeNode;


/**
 * @typedef {
 *     Array<TreeNode>
 * }
 */
var nodeChain;

/**
 * @param {nodeChain} nodeChain
 * @return {void}
 */
function onItemSelected(nodeChain)
{

}

/**
 * @typedef {(
 *   'doc'|
 *   'ppt'|
 *   'xls'|
 *   'meeting'|
 *   'folder'|
 *   'project'|
 *   'shared_project'
 * )}
 */
var ContentType;

function startRenderTree(tree, nodes, level)
{
    if (level === 0)
    {
        showElement(tree.title, tree.type, level)
        startRenderTree(tree.children, nodes !== [] ? nodes.splice(0, 1) : [], level + 1)
    } else
    {
        for (var index in tree)
        {
            showElement(tree[index].title, tree[index].type, level);

            if (tree[index].children)
            {
                startRenderTree(tree[index].children, nodes !== [] ? nodes.splice(0, 1) : [], level + 1)
            }
        }
    }
}

function showElement(title, type, level)
{
    var element = document.createElement('span');
    var elementWrapper = document.createElement('span');
    var icon = document.createElement('span');
    var title = document.createTextNode(title);
    var container = document.getElementById('fileTree');

    element.className = "b-popup__element";
    elementWrapper.className = "b-popup__element-wrapper b-popup__level_" + level;
    icon.className = "b-popup__icon b-popup__icon_" + type;
    if (type === "shared_project" || type === "project" || type === "folder")
    {
        var showMoreButton = document.createElement('span');
        showMoreButton.className = "b-popup__show-more b-popup__icon_folder_close";

        element.appendChild(showMoreButton);
        element.appendChild(icon);
        element.appendChild(title);
    } else
    {
        element.appendChild(icon);
        element.appendChild(title);
    }

    elementWrapper.appendChild(element);
    container.appendChild(elementWrapper);
}