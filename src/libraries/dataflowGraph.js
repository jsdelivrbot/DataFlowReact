var ObjectSize = function (obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}

function DFNode(id, key, innerHTML, nodeClass, rightNodesList) {
    this.id = id,
    this.key = key,
    this.nodeClass = 'node';
    if (nodeClass) this.nodeClass += ' ' + nodeClass;
    this.innerHTML = innerHTML || '';
    this.row = 0;
    this.col = 0;
    this.rightNodesList = rightNodesList;
    this.x = 0;
    this.y = 0;
    this.size = { w: 0, h: 0 };
    this.leftNodesList = [];
}

function DFGraph(graph) {
    this.graphConfig = graph.chart;
    this.graphStructure = graph.graphStructure;
    this.nodeDB = [];
    this.nodeLinkedList = [];
    this.drawArea = document.getElementById(graph.chart.container);
    this.drawArea.classList.add('DFGraph');
    var self = this;

    var findNodeByKey = function (key, structure) {
        for (var i = 0; i < structure.length; i++) {
            if (structure[i].key === key) {
                return i;
            }
        }
        return -1;
    }

    var traversalNeighbor = function (node, nodeDB, nodeLinkedList, visisted, graph, col) {
        for (var i = 0; i < node.rightNodesList.length; i++) {
            var pos = findNodeByKey(node.rightNodesList[i], graph);
            if (pos == -1) {
                this.nodeDB = [];
                return;
            }
            var nodeInfo = graph[pos];
            var index = visisted.indexOf(nodeInfo.key);
            if (index < 0) {
                var nodeClass = "";
                if (self.graphConfig.node && self.graphConfig.node.HTMLclass) nodeClass += self.graphConfig.node.HTMLclass;
                if (nodeInfo.HTMLclass) nodeClass += " " + nodeInfo.HTMLclass;
                var nextNode = new DFNode(nodeDB.length, nodeInfo.key, nodeInfo.innerHTML, nodeClass, nodeInfo.nextNodes);
                nextNode.leftNodesList.push(node.id);
                nextNode.col = col;
                nodeDB.push(nextNode);
                visisted.push(nodeInfo.key);
                if (!(nodeLinkedList[col] instanceof Array)) nodeLinkedList[col] = [];
                nextNode.row = nodeLinkedList[col].length;
                nodeLinkedList[col].push(nextNode.id);
                traversalNeighbor(nextNode, nodeDB, nodeLinkedList, visisted, graph, col + 1);
            } else {
                nodeDB[index].leftNodesList.push(node.id);
            }
        }
    }
    var createNodes = function () {
        for (var i = 0; i < self.nodeDB.length; i++) {
            var nodeDiv = document.createElement('div');
            nodeDiv.insertAdjacentHTML('beforeend', self.nodeDB[i].innerHTML);
            nodeDiv.className = self.nodeDB[i].nodeClass;
            self.nodeDB[i].nodeDOM = nodeDiv;
            self.drawArea.appendChild(nodeDiv);
            self.nodeDB[i].size.w = nodeDiv.offsetWidth;
            self.nodeDB[i].size.h = nodeDiv.offsetHeight;
        }
    }

    var visisted = [], col = 0;
    for (var i = 0; i < this.graphStructure.length; i++) {
        var nodeInfo = this.graphStructure[i];
        if (!visisted.includes(nodeInfo.key)) {
            var nodeClass = "";
            if (this.graphConfig.node && this.graphConfig.node.HTMLclass) nodeClass += this.graphConfig.node.HTMLclass;
            if (nodeInfo.HTMLclass) nodeClass += " " + nodeInfo.HTMLclass;
            var node = new DFNode(this.nodeDB.length, nodeInfo.key, nodeInfo.innerHTML, nodeClass, nodeInfo.nextNodes);
            this.nodeDB.push(node);
            visisted.push(nodeInfo.key);
            if (!(this.nodeLinkedList[col] instanceof Array)) this.nodeLinkedList[col] = [];
            node.col = col;
            node.row = this.nodeLinkedList[col].length;
            this.nodeLinkedList[col].push(node.id);
            traversalNeighbor(node, this.nodeDB, this.nodeLinkedList, visisted, this.graphStructure, col + 1);
        }
    }
    // replace the key of the node with nodeId
    for (var i = 0; i < this.nodeDB.length; i++) {
        var neighbors = this.nodeDB[i].rightNodesList;
        var neighborIdList = [];
        for (var j = 0; j < neighbors.length; j++) {
            var key = neighbors[j];
            var neighborID = visisted.indexOf(key);
            if (neighborID >= 0) neighborIdList.push(neighborID);
        }
        this.nodeDB[i].rightNodesList = neighborIdList;
    }
    createNodes();
}

DFGraph.prototype.positionGraph = function () {
    var self = this, positioned = [], largestWidth = 0, i, j, k, list = this.nodeLinkedList;
    var checkIfAllPositioned = function (col) {
        for (var i = 0; i < list[col].length; i++) {
            if (!positioned.includes(list[col][i])) {
                return false;
            }
        }
        return true;
    }

    var findAndPositionPivot = function () {
        var i = 0, pivot = 0, offset = 0;
        for (i = 0; i < list.length; i++) {
            var length = list[i].length;
            if (length > largestWidth) {
                pivot = i;
                largestWidth = length;
            }
        }
        for (i = 0; i < list[pivot].length; i++) {
            var nodeId = list[pivot][i];
            var curNode = self.nodeDB[nodeId];
            var rightNodesCount = curNode.rightNodesList.length;
            var leftNodesCount = curNode.leftNodesList.length;
            var largerCount = rightNodesCount > leftNodesCount ? rightNodesCount : leftNodesCount;
            var length = self.graphConfig.rowSeparation * (largerCount - 1);
            var centerPoint = Math.round(length * 10 / 2) / 10;
            curNode.y = centerPoint + offset;
            curNode.x = pivot * self.graphConfig.colSeparation;
            positioned.push(curNode.id);
            offset += length + self.graphConfig.rowSeparation;
        }
        return pivot;
    }


    // find the positionedNode and adjust the position.
    var adjustPositionBasedOnNeighbor = function (node, c, r) {
        node.x = c * self.graphConfig.colSeparation;
        if (r == 0 && positioned.includes(list[c][r + 1])) {  // top node, position based on lower node.
            node.y = self.nodeDB[list[c][r + 1]].y - self.graphConfig.rowSeparation;
            positioned.push(node.id);
        } else if (r == list[c].length - 1 && positioned.includes(list[c][r - 1])) {  // bottom node, position based on upper node.
            node.y = self.nodeDB[list[c][r - 1]].y + self.graphConfig.rowSeparation;
            positioned.push(node.id);
        } else if (r != 0 && r != list[c].length - 1 && positioned.includes(list[c][r + 1]) && positioned.includes(list[c][r - 1])) {
            // nodes are in between, position based on adjustency nodes
            node.y = (self.nodeDB[list[c][r - 1]].y + self.nodeDB[list[c][r + 1]].y) / 2;
            positioned.push(node.id);
        }
    }

    var positionToTheLeftFromPivot = function (pivot) {
        var count = 0, i, j, isPositioned, increment;
        for (i = pivot; i >= 0; i--) {
            j = 0;
            count = 0;
            increment = 1;
            isPositioned = false;
            while (!isPositioned) {
                var curNode = self.nodeDB[list[i][j]];
                if (positioned.includes(curNode.id)) {
                    if (curNode.leftNodesList.length == 1) {
                        var leftNode = self.nodeDB[curNode.leftNodesList[0]];
                        leftNode.x = leftNode.col * self.graphConfig.colSeparation;
                        var topBound = self.nodeDB[leftNode.rightNodesList[0]].y;
                        var bottomBound = self.nodeDB[leftNode.rightNodesList[leftNode.rightNodesList.length - 1]].y;
                        leftNode.y = Math.round((bottomBound + topBound) * 10 / 2) / 10;
                        positioned.push(leftNode.id);
                    } else if (curNode.leftNodesList.length > 1) {
                        var temp = (curNode.leftNodesList.length - 1) / 2;
                        for (k = 0; k < curNode.leftNodesList.length; k++) {
                            var leftNode = self.nodeDB[curNode.leftNodesList[k]];
                            leftNode.x = leftNode.col * self.graphConfig.colSeparation;
                            leftNode.y = curNode.y - (temp - k) * self.graphConfig.rowSeparation;
                            positioned.push(leftNode.id);
                        }
                    }
                } else {
                    adjustPositionBasedOnNeighbor(curNode, i, j);
                }
                if (j <= 0) {
                    increment = 1;
                }
                if (j >= list[i].length - 1) {
                    increment = -1;
                    if (checkIfAllPositioned(i)) {
                        isPositioned = true;
                    }
                }
                j += increment;
                count++;
                if (count > 100) {
                    console.log(i);
                    isPositioned = true;
                }
            }
        }
    }

    // go to right from pivot
    var positionToTheRightFromPivot = function (pivot) {
        var count = 0, i, j, isPositioned, increment;
        for (i = pivot; i < list.length; i++) {
            j = 0;
            var count = 0;
            var increment = 1;
            isPositioned = false;
            while (!isPositioned) {
                // for (j = 0; isPositioned; j++) {
                var curNode = self.nodeDB[list[i][j]];
                if (positioned.includes(curNode.id)) {
                    if (curNode.rightNodesList.length == 1) {
                        var rightNode = self.nodeDB[curNode.rightNodesList[0]];
                        rightNode.x = rightNode.col * self.graphConfig.colSeparation;
                        var topBound = self.nodeDB[rightNode.leftNodesList[0]].y;
                        var bottomBound = self.nodeDB[rightNode.leftNodesList[rightNode.leftNodesList.length - 1]].y;
                        rightNode.y = Math.round((bottomBound + topBound) * 10 / 2) / 10;
                        positioned.push(rightNode.id);
                    } else if (curNode.rightNodesList.length > 1) {
                        var temp = (curNode.rightNodesList.length - 1) / 2;
                        for (k = 0; k < curNode.rightNodesList.length; k++) {
                            var rightNode = self.nodeDB[curNode.rightNodesList[k]];
                            rightNode.x = rightNode.col * self.graphConfig.colSeparation;
                            rightNode.y = curNode.y - (temp - k) * self.graphConfig.rowSeparation;
                            positioned.push(rightNode.id);
                        }
                    }
                } else {
                    adjustPositionBasedOnNeighbor(curNode, i, j);
                }
                if (j <= 0) {
                    increment = 1;
                }
                if (j >= list[i].length - 1) {
                    increment = -1;
                    if (checkIfAllPositioned(i)) {
                        isPositioned = true;
                    }
                }
                j += increment;
                count++;
                if (count > 100) {
                    console.log(i);
                    isPositioned = true;
                }
            }
        }
    }

    var calculateGraphSize = function () {
        var nodeList = self.drawArea.children;
        var width = 0, height = 0, elementWidth = 0, elementHeight = 0;
        for (var i = 0; i < self.nodeDB.length; i++) {
            var x = self.nodeDB[i].x,
                y = self.nodeDB[i].y,
                width = self.nodeDB[i].
            width = x > width ? x : width;
            height = y > height ? y : height;
        }
        for (var i = 0; i < nodeList.length; i++) {
            var w = nodeList[i].offsetWidth,
                h = nodeList[i].offsetHeight;
            elementWidth = w > elementWidth ? w : elementWidth;
            elementHeight = h > elementHeight ? h : elementHeight;
        }
        width += w;
        height += h;
        return { width: width, height: height, elementWidth: elementWidth, elementHeight: elementHeight };
    };

    var checkNegative = function () {
        var min = 0;
        for (var i = 0; i < self.nodeDB.length; i++) {
            var topStyle = self.nodeDB[i].nodeDOM.style.top;
            var positionY = Number.parseFloat(topStyle.substring(0, topStyle.length - 2));
            min = positionY < min ? positionY : min;
        }
        for (var i = 0; i < self.nodeDB.length; i++) {
            var node = self.nodeDB[i];
            node.y -= min;
            node.nodeDOM.style.top = (node.y - (node.size.h / 2)) + 'px';
        }
    }

    var getPathString = function (src, dest) {
        var startPoint = { x: src.x + (src.size.w / 2), y: src.y },
            endPoint = { x: dest.x - (dest.size.w / 2), y: dest.y }, P1 = {}, P2 = {};
        P1.x = P2.x = (startPoint.x + endPoint.x) / 2;
        P1.y = startPoint.y;
        P2.y = endPoint.y;;
        var sp = startPoint.x + ',' + startPoint.y, p1 = P1.x + ',' + P1.y, p2 = P2.x + ',' + P2.y, ep = endPoint.x + ',' + endPoint.y,
        pathString = ["M", sp, 'C', p1, p2, ep];
        return pathString.join(" ");
    }

    var drawConnection = function () {
        for (var i = 0; i < self.nodeLinkedList.length; i++) {
            for (var j = 0; j < self.nodeLinkedList[i].length; j++) {
                var curNode = self.nodeDB[self.nodeLinkedList[i][j]];
                for (var k = 0; k < curNode.rightNodesList.length; k++) {
                    var nextNode = self.nodeDB[curNode.rightNodesList[k]];
                    var pathString = getPathString(curNode, nextNode);
                    var connLine = self._R.path(pathString);
                    connLine.attr(self.graphConfig.connectors.style);
                }
            }
        }
    }

    var pivot = findAndPositionPivot();
    positionToTheLeftFromPivot(pivot);
    positionToTheRightFromPivot(pivot);

    this.graphSize = calculateGraphSize();
    //console.log(this.graphSize.width + ' ' + this.drawArea.clientWidth);
    var width = this.graphSize.width < this.drawArea.offsetWidth ? this.drawArea.offsetWidth : this.graphSize.width + this.graphConfig.padding * 2,
        height = this.graphSize.height < this.drawArea.clientHeight ? this.drawArea.clientHeight : this.graphSize.height + this.graphConfig.padding * 2;

    this._R = new Raphael(this.drawArea, width, height);
    var containerCenter = {
        x: this.drawArea.clientWidth / 2,
        y: this.drawArea.clientHeight / 2
    },
    graphCenter = {
        x: this.graphSize.width / 2,
        y: this.graphSize.height / 2
    },
    deltaX = containerCenter.x - graphCenter.x,
    deltaY = containerCenter.y - graphCenter.y + this.graphSize.elementHeight / 2;
    for (i = 0; i < this.nodeDB.length; i++) {
        var node = this.nodeDB[i];
        node.x += (this.graphSize.width < this.drawArea.clientWidth) ? deltaX : this.graphConfig.padding;
        node.y += (this.graphSize.height < this.drawArea.clientHeight) ? deltaY : this.graphConfig.padding;
        node.nodeDOM.style.left = (node.x - (node.size.w / 2)) + 'px';
        node.nodeDOM.style.top = (node.y - (node.size.h / 2)) + 'px';
    }

    checkNegative();
    drawConnection();
}

function DataFlowGraph(graphInfo, callback) {
    var dataflowGraph = new DFGraph(graphInfo);
    dataflowGraph.positionGraph();
    if (callback) callback();
}

module.exports = DataFlowGraph;

//Polly Fills for IE

if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {

        value: function (element, start) {

            var obj, length, n, index;

            if (this == null) {
                throw new TypeError('this is null');
            }

            obj = Object(this);


            length = obj.length >>> 0;


            if (length === 0) {
                return false;
            }
            n = start | 0;
            index = Math.max(n >= 0 ? n : length - Math.abs(n), 0);

            while (index < length) {

                if (obj[index] === element) {
                    return true;
                }
                index++;
            }
            return false;
        }
    });
}
Number.parseFloat = parseFloat

if (!String.prototype.includes) {
    String.prototype.includes = function (char, index) {
        'use strict';
        if (typeof index !== 'number') {
            index = 0;
        }

        if (index + char.length > this.length) {
            return false;
        } else {
            return this.indexOf(char, index) !== -1;
        }
    };
}