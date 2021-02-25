window.onload = function ()
{
    initSelectionTree(tree, onItemSelected(), '148');
};

function initSelectionTree(tree, onItemSelected, selectedItemId)
{
    var timer;
    var nodes = [];
    var container = "fileTree";
    if (selectedItemId === undefined)
    {
        nodes = [tree];
    }

    if (selectedItemId !== tree.id && nodes.length === 0)
    {
        nodes = [tree];
        getNodes(tree.children, selectedItemId, nodes);
        nodes.pop();
    }

    renderTree(tree, nodes, selectedItemId, container);

    document.getElementById(container).ondblclick = function ()
    {
        clearTimeout(timer);
        var current = getCurrentElement(event, true);
        event.preventDefault ? event.preventDefault() : event.returnValue = false;

        if (isUnselectableElement(current))
        {
            return;
        }

        if (!current.className.match(/show-more/))
        {
            selectedItemId = openNewDirectoryClick(current, nodes, selectedItemId, tree);
            renderTree(tree, nodes, selectedItemId, container);
        }
    }

    document.getElementById(container).onclick = function ()
    {
        if (timer)
        {
            clearTimeout(timer);
        }

        var current = getCurrentElement(event, false);

        if (isUnselectableElement(getMainElement(current)))
        {
            return;
        }

        timer = setTimeout(function ()
        {
            if (current.className.match(/show-more/))
            {
                if (current.className.match(/close/))
                {
                    selectedItemId = openNewDirectoryClick(getMainElement(current), nodes, selectedItemId, tree);
                } else
                {
                    selectedItemId = closeDirectory(nodes, selectedItemId, getMainElement(current));
                }
            } else
            {
                selectedItemId = selectItem(getMainElement(current));
            }

            renderTree(tree, nodes, selectedItemId, container);
        }, 250);
    }
}

function getNodes(tree, selectedItemId, nodes)
{
    if (nodes[nodes.length - 1].id === selectedItemId || !tree.length)
    {
        return;
    }

    for (var index in tree)
    {
        if (tree[index].id === selectedItemId)
        {
            nodes.push(tree[index]);
            break;
        }

        if (tree[index].children)
        {
            nodes.push(tree[index]);

            getNodes(tree[index].children, selectedItemId, nodes);
            if (tree[index].id === nodes[nodes.length - 1].id)
            {
                nodes.pop();
            } else
            {
                break;
            }
        }
    }
}

function renderTree(tree, nodes, selectedItemId, container)
{
    document.getElementById(container).innerHTML = "";
    startRenderTree(tree, nodes, 0, selectedItemId, container);
    setIndent();
}

function isUnselectableElement(current)
{
    return current.className.match(/disable/);
}

function getCurrentElement(event, transform)
{
    var evt = event || window.event;
    var current = evt.target || evt.srcElement;

    if (transform)
    {
        current = getMainElement(current)
    }

    return current;
}

function getMainElement(current)
{
    var newCurrent = current;
    if (current.className.match(/icon/))
    {
        newCurrent = current.parentElement;
    }

    return newCurrent;
}

function changeSelectedItem(nodes, selectedItemId)
{
    for (var index in nodes.children)
    {
        if (nodes.children[index].id === selectedItemId || nodes === selectedItemId)
        {
            selectedItemId = undefined;
            break;
        }
    }

    return selectedItemId;
}

function openNewDirectory(nodes, selectedItemId, current)
{
    var newNode = false;
    var resetSelectedItem = false;

    for (var nodeIndex = nodes.length - 1; nodeIndex >= 0; nodeIndex--)
    {
        newNode = findNewNode(nodes, nodeIndex, current);

        if (newNode)
        {
            break;
        }

        if (!resetSelectedItem)
        {
            selectedItemId = changeSelectedItem(nodes[nodeIndex], selectedItemId);
        }

        nodes.pop();
    }

    return selectedItemId;
}

function findNewNode(nodes, nodeIndex, current)
{
    var newNode = false;

    for (var index in nodes[nodeIndex].children)
    {
        if (nodes[nodeIndex].children[index].id === current.id)
        {
            nodes.push(nodes[nodeIndex].children[index]);
            newNode = true;
            break;
        }
    }

    return newNode;
}

function openNewDirectoryClick(current, nodes, selectedItemId, tree)
{
    if (!current.children)
    {
        return;
    }

    if (nodes.length === 0)
    {
        nodes.push(tree);
    } else
    {
        selectedItemId = openNewDirectory(nodes, selectedItemId, current)
    }

    return selectedItemId;
}

function closeDirectory(nodes, selectedItemId, current)
{
    var resetSelectedItem = false;
    for (var nodeIndex = nodes.length - 1; nodeIndex >= 0; nodeIndex--)
    {
        if (!resetSelectedItem)
        {
            for (var index in nodes[nodeIndex].children)
            {
                if (nodes[nodeIndex].children[index].id === selectedItemId || nodes[nodeIndex] === selectedItemId)
                {
                    selectedItemId = undefined;
                    resetSelectedItem = true;
                    break;
                }
            }
        }

        if (nodes[nodeIndex].id === current.id)
        {
            nodes.splice(nodeIndex, nodes.length - nodeIndex);
        }
    }

    return selectedItemId;
}

function selectItem(current)
{
    var selectedItemId;
    if (current.className.match(/icon/))
    {
        selectedItemId = current.id;
    } else
    {
        selectedItemId = current.id;
    }

    return selectedItemId;
}

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

function isDir(element)
{
    return element.type === "shared_project" || element.type === "project" || element.type === "folder";
}

function startRenderTree(tree, nodes, level, selectedItemId, container)
{
    if (level === 0)
    {
        showElement(tree.title, tree.type, tree.id, level, true, nodes[level] === tree, selectedItemId === tree.id, nodes.unselectable, container);
        if (nodes !== [] && nodes[level] === tree)
        {
            startRenderTree(tree.children, nodes, level + 1, selectedItemId, container);
        }
    } else
    {
        for (var index in tree)
        {
            showElement(tree[index].title, tree[index].type, tree[index].id, level, isDir(tree[index]), nodes[level] === tree[index], selectedItemId === tree[index].id, tree[index].unselectable, container);

            if (tree[index].children && nodes !== [] && nodes[level] === tree[index])
            {
                startRenderTree(tree[index].children, nodes, level + 1, selectedItemId, container);
            }
        }
    }
}

function showElement(title, type, id, level, isDir, inNode, isSelected, isUnselectable, containerName)
{
    var element = document.createElement('span');
    var elementWrapper = document.createElement('span');
    var icon = document.createElement('span');
    var titleNode = document.createTextNode(title);

    element.className = "b-popup__element " + (isUnselectable ? "b-popup__element_disable" : "");
    element.id = id;
    elementWrapper.className = "b-popup__element-wrapper b-popup__level_" + level + " " + (isSelected ? "b-popup__element-wrapper_active" : "") + (isUnselectable ? "b-popup__element-wrapper_disable" : "");
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

    var container = document.getElementById(containerName);

    elementWrapper.appendChild(element);
    container.appendChild(elementWrapper);
}