/*************
 * UI MODULE *
 *************/

let root = null;
let BST;
const canvasWidth = 1024;
const canvasHeight = 500;
let isBusy = false;

function displayNode(curr) {
	if (curr != null) {
		ellipseMode(CENTER);
		textAlign(CENTER);
		stroke("black");
		strokeWeight(3);
		if (curr.left != null) line(curr.x, curr.y, curr.left.x, curr.left.y);
		if (curr.right != null) line(curr.x, curr.y, curr.right.x, curr.right.y);
		noStroke();
		fill("red");
		if (curr.highlighted) ellipse(curr.x, curr.y, 40, 40);
		fill(231, 173, 173);
		ellipse(curr.x, curr.y, 30, 30);
		fill("black");
		text(curr.data, curr.x, curr.y + 5);
		displayNode(curr.left);
		displayNode(curr.right);
	}
}

function insert(value) {
	if (isNaN(value) === true) return undefined;
	isBusy = true;
	BST.postMessage(["Insert", value]); // send message 'Delete' and inputted value to ask the Tree to delete an element
	BST.onmessage = function (event) {
		root = event.data[0]; // receive our tree modifications from the BST so the browser's main thread can display changes at each step in the algo instead of the final change
		if (event.data[1] === "Finished") isBusy = false;
	};
}

function del(posX, posY) {
	isBusy = true;
	BST.postMessage(["Delete", posX, posY]); // send message 'Delete' and inputted value to ask the Tree to delete an element
	BST.onmessage = function (event) {
		root = event.data[0]; // receive our tree modifications from the BST so the browser's main thread can display changes at each step in the algo instead of the final change
		if (event.data[1] === "Finished") isBusy = false;
	};
}

function setup() {
	// INITIALIZE WEB WORKER THREAD FOR THE TREE ALGORITHM AND VISUALIZATION
	BST = new Worker("BST.js");

	// SET CANVAS AND TEXT SIZE
	const canvas = createCanvas(canvasWidth, canvasHeight);
	canvas.parent("main");
	canvas.mouseClicked(function (event) {
		if (isBusy) return;
		del(event.layerX, event.layerY);
	});

	document.getElementById("insertButton").addEventListener("click", (e) => {
		if (isBusy) return;
		let input = document.getElementById("insertValue");
		let value = Number(input.value);
		if (value < -100 || value > 100) {
			alert("Out of range! Only from -100 to 100.");
			return;
		}
		insert(value);
		input.value = '';
		input.focus()
	});
}

function draw() {
	background("white");
	displayNode(root);
	fill("black");
}
