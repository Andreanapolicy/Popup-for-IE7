window.onload = function ()
{
    // var preloader = document.getElementById('popup');
    // var deg = 0;
    // setInterval(function ()
    // {
    //     deg += 5;
    //     preloader.style.transform = '-mc-rotate(' + deg + 'deg)';
    // }, 10);

    var nodes = [tree];
    initSelectionTree(tree, onItemSelected(nodes), undefined);
    document.getElementById("fileTree").onclick = function ()
    {
        var evt = event || window.event;
        var current = evt.target || evt.srcElement;

        if (current.className.match(/show-more/))
        {
            if (current.className.match(/close/))
            {
                if (nodes.length === 0)
                {
                    nodes.push(tree);
                } else
                { //TODO: выбор нового файло на том же уровне, что уже выбранный
                    var newNode = false;

                    for (var nodeIndex = nodes.length - 1; nodeIndex >= 0; nodeIndex--)
                    {
                        for (var index in nodes[nodeIndex].children)
                        {
                            if (nodes[nodeIndex].children[index].id === current.parentElement.id)
                            {
                                nodes.push(nodes[nodeIndex].children[index]);
                                newNode = true;
                                break;
                            }
                        }

                        if (newNode)
                        {
                            break;
                        }

                        nodes.pop();
                    }
                }
            } else
            {
                for (var index in nodes)
                {
                    if (nodes[index].id === current.parentElement.id)
                    {
                        nodes.splice(index, nodes.length - index);
                    }
                }
            }
        } else
        {
            // if (current.className.match(/icon/))
            // {
            //     console.log(current.parentElement.id)
            // }
            // console.log(current.id)
        }

        initSelectionTree(tree, onItemSelected(nodes), undefined);
    }

    function initSelectionTree(tree, onItemSelected, selectedItemId)
    {
        document.getElementById('fileTree').innerHTML = "";
        startRenderTree(tree, nodes, 0);
        setIndent();
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
        showElement(tree.title, tree.type, tree.id, level, true, nodes[level] === tree);
        if (nodes !== [] && nodes[level] === tree)
        {
            startRenderTree(tree.children, nodes, level + 1);
        }
    } else
    {
        for (var index in tree)
        {
            var isDir = false;
            if (tree[index].type === "shared_project" || tree[index].type === "project" || tree[index].type === "folder")
            {
                isDir = true;
            }

            showElement(tree[index].title, tree[index].type, tree[index].id, level, isDir, nodes[level] === tree[index]);

            if (tree[index].children && nodes !== [] && nodes[level] === tree[index])
            {
                startRenderTree(tree[index].children, nodes, level + 1);
            }
        }
    }
}

function showElement(title, type, id, level, isDir, inNode)
{
    var element = document.createElement('span');
    var elementWrapper = document.createElement('span');
    var icon = document.createElement('span');
    var titleNode = document.createTextNode(title);
    var container = document.getElementById('fileTree');

    element.className = "b-popup__element";
    element.id = id;
    elementWrapper.className = "b-popup__element-wrapper b-popup__level_" + level;
    icon.className = "b-popup__icon b-popup__icon_" + type;
    if (isDir)
    {
        var showMoreButton = document.createElement('span');
        showMoreButton.className = "b-popup__show-more b-popup__icon_folder_" + (inNode ? "open" : "close");

        element.appendChild(showMoreButton);
        element.appendChild(icon);
        element.appendChild(titleNode);
    } else
    {
        element.appendChild(icon);
        element.appendChild(titleNode);
    }

    elementWrapper.appendChild(element);
    container.appendChild(elementWrapper);
}