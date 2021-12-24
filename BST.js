let root = null;
const canvasWidth = 1024;
const canvasHeight = 500;
const delay = 500;

/************
 * BST CORE *
 ************/

class Node {
	constructor(d, height, y, parent, loc) {
		if (d instanceof Node) {
			// if parameter passed is a node then use all properties of the node to be cloned for the new node
			this.data = d.data;
			this.left = d.left;
			this.right = d.right;
			this.parent = d.parent;
			this.loc = d.loc;
			this.height = d.height;
			this.x = d.x;
			this.y = d.y;
			this.highlighted = d.highlighted;
		} else {
			this.data = d;
			this.left = null;
			this.right = null;
			this.parent = parent;
			this.loc = loc;
			this.height = height;
			this.x = canvasWidth / 2;
			this.y = y;
			this.highlighted = false;
		}
	}
}

// DELAY CODE EXECUTION FOR SPECIFIED MILLISECONDS
function sleep(ms) {
  self.postMessage([root]);
	const start = Date.now();
	while (Date.now() < start + ms);
}
// UNHIGHLIGHT ALL NODES
function unhighlightAll(node) {
	if (node !== null) {
		node.highlighted = false;
		unhighlightAll(node.left);
		unhighlightAll(node.right);
	}
}
// GET CURRENT HEIGHT/LEVEL OF A NODE
function getHeight(node) {
	if (node == null) return 0;
	return node.height;
}

// INSERT AN ELEMENT TO THE TREE
function bstPush(node, data, posY, parent, loc) {
	let curr = node;

	if (curr != null) {
		// highlight current node in each recursion step
		curr.highlighted = true;
	}

	if (curr == null) {
		// if current node is null then place the new node there
		curr = new Node(data, 1, posY, parent, loc);
	} else if (data < curr.data) {
		// if new data < current node's data, then go to left subtree
		sleep(delay);
		curr.highlighted = false;
		curr.left = bstPush(curr.left, data, posY + 40, curr, "left");
	} else if (data >= curr.data) {
		// if new data >= current node's data, then go to right subtree
		sleep(delay);
		curr.highlighted = false;
		curr.right = bstPush(curr.right, data, posY + 40, curr, "right");
	}

	curr.height = Math.max(getHeight(curr.left), getHeight(curr.right)) + 1; // update the heights of all nodes traversed by the bstPush() function

	return curr; // return the modifications back to the caller
}

// FIND NODE BY MOUSE POSITION ON DELETE
function findNodeByPos(node, posX, posY) {
	if (node) {
		let dx = node.x - posX,
			dy = node.y - posY;
		let dist = Math.sqrt(dx * dx + dy * dy);
		if (dist < 15) return node;
		return (
			findNodeByPos(node.left, posX, posY) ||
			findNodeByPos(node.right, posX, posY)
		);
	} else {
		return null;
	}
}

// DELETE AN ELEMENT FROM THE TREE
function bstPop(node, key) {
	unhighlightAll(root);
	node.highlighted = true;

	if (key < node.data) {
		// if key < current node's data then look at the left subtree
		sleep(delay);
		node.left = bstPop(node.left, key);
	} else if (key > node.data) {
		// if key > current node's data then look at the right subtree
		sleep(delay);
		node.right = bstPop(node.right, key);
	} else {
		sleep(delay);
		if (!node.left && !node.right) {
			// if node has no child (is a leaf) then just delete it.
			node = null;
		} else if (!node.left) {
			// if node has RIGHT child then set parent of deleted node to right child of deleted node
			sleep(delay);
			// CODE FOR BLINKING ANIMATION AND BLA BLA BLA..
			for (let i = 0; i < 2; i += 1) {
				node.right.highlighted = true;
				if (node === root) node.highlighted = true;
				else node.parent.highlighted = true;
				sleep(delay / 2);
				node.right.highlighted = false;
				if (node === root) node.highlighted = false;
				else node.parent.highlighted = false;
				sleep(delay / 2);
			}
			// END CODE FOR BLINKING ANIMATION AND BLA BLA BLA..
			let del = node;
			node.right.parent = node.parent;
			node.right.loc = node.loc;
			node = node.right;
			del = null;
			node.y -= 40;
		} else if (!node.right) {
			// if node has LEFT child then set parent of deleted node to left child of deleted node
			sleep(delay);
			for (let i = 0; i < 2; i += 1) {
				node.left.highlighted = true;
				if (node === root) node.highlighted = true;
				else node.parent.highlighted = true;
				sleep(delay / 2);
				node.left.highlighted = false;
				if (node === root) node.highlighted = false;
				else node.parent.highlighted = false;
				sleep(delay / 2);
			}
			let del = node;
			node.left.parent = node.parent;
			node.left.loc = node.loc;
			node = node.left;
			del = null;
			node.y -= 40;
		} else {
			// if node has TWO children then find largest node in the left subtree. Copy the value of it into node to delete. After that, recursively delete the largest node in the left subtree
			sleep(delay);
			let largestLeft = node.left;
			while (largestLeft.right) {
				unhighlightAll(root);
				largestLeft.highlighted = true;
				sleep(delay / 2);
				largestLeft = largestLeft.right;
			}
			unhighlightAll(root);
			largestLeft.highlighted = true;
			sleep(delay);
			// CODE FOR BLINKING ANIMATION AND BLA BLA BLA...
			for (let i = 0; i < 2; i += 1) {
				largestLeft.highlighted = true;
				node.highlighted = true;
				sleep(delay / 2);
				largestLeft.highlighted = false;
				node.highlighted = false;
				sleep(delay / 2);
			}
			// END CODE FOR BLINKING ANIMATION AND BLA BLA BLA...
			node.data = largestLeft.data;
			unhighlightAll(root);
			sleep(delay);
			node.left = bstPop(node.left, largestLeft.data);
		}
	}
	if (node == null) return node;

	node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1; // update the heights of all nodes traversed by the bstPop() function

	return node; // return the modifications back to the caller
}

// AFTER INSERT OR DELETE, ALWAYS UPDATE ALL NODES POSITION IN THE CANVAS
// FORMULA FOR DETERMINING NODE POSITION IS: (NODE'S PARENT POSITION - ((2 ^ (NODE'S CURRENT HEIGHT + 1)) * 10)))
function updatePosition(node) {
	if (node != null) {
		if (node.loc === "left")
			node.x = node.parent.x - 2 ** (getHeight(node.right) + 1) * 10;
		else if (node.loc === "right")
			node.x = node.parent.x + 2 ** (getHeight(node.left) + 1) * 10;
		else if (node.loc === "root") {
			node.x = canvasWidth / 2;
			node.y = 50;
		}
		if (node.parent != null) node.y = node.parent.y + 40;
		if (node.left != null) node.left.parent = node; // update parent information of current node
		if (node.right != null) node.right.parent = node; // update parent information of current node
		updatePosition(node.left);
		updatePosition(node.right);
	}
}

// EVENT LISTENER TO LISTEN COMMANDS FROM THE MAIN THREAD. THE TREE WILL EXECUTE EVERYTHING THE MAIN THREAD WANTS.
// AT EACH STEP IN THE ALGORITHM, THE TREE WILL NOTIFY THE MAIN THREAD ABOUT CHANGES IN THE TREE SO THE MAIN THREAD CAN DISPLAY THE CHANGES STEP-BY-STEP TO USERS FOR EASIER UNDERSTANDING
self.addEventListener("message", (event) => {
	switch (event.data[0]) {
		case "Insert": {
			const value = event.data[1]; // get value from user input
			root = bstPush(root, value, 50, null, "root"); // push it
			updatePosition(root); // update all node position
			self.postMessage([root, "Finished"]); // let main thread know that operation has finished
			break;
		}
		case "Delete": {
			const posX = event.data[1]; // get value from user input
			const posY = event.data[2]; // get value from user input

			let node = findNodeByPos(root, posX, posY);
			if (node) {
				root = bstPop(root, node.data); // delete it
				updatePosition(root); // update the node position
				unhighlightAll(root); // unhighlight all nodes
			}
			self.postMessage([root, "Finished"]); // send message to main thread that the tree is empty
			break;
		}
		default:
			break;
	}
});
