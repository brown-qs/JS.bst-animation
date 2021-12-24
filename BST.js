let root = null;

class Node {
  constructor(d, height, y, parent, loc) {
    if (d instanceof Node) { // if parameter passed is a node then use all properties of the node to be cloned for the new node
      this.data = d.data;
      this.left = d.left;
      this.right = d.right;
      this.parent = d.parent;
      this.loc = d.loc;
      this.height = d.height;
      this.x = d.x;
      this.y = d.y;
      this.highlighted = d.highlighted;
    }
    else {
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
  const start = Date.now();
  while (Date.now() < start + ms);
}

// INSERT AN ELEMENT TO THE TREE
function push(node, data, posY, parent, loc) {
  let curr = node;

  if (curr != null) { // highlight current node in each recursion step
    curr.highlighted = true;
  }

  if (curr == null) { // if current node is null then place the new node there
    msg = 'Found a null node. Inserted ' + data + '.';
    curr = new Node(data, 1, posY, parent, loc);
  }
  else if (data < curr.data) { // if new data < current node's data, then go to left subtree
    sleep(delay);
    curr.highlighted = false;
    curr.left = push(curr.left, data, posY + 40, curr, 'left');
  }
  else if (data >= curr.data) { // if new data >= current node's data, then go to right subtree
    sleep(delay);
    curr.highlighted = false;
    curr.right = push(curr.right, data, posY + 40, curr, 'right');
  }

  curr.height = Math.max(getHeight(curr.left), getHeight(curr.right)) + 1; // update the heights of all nodes traversed by the push() function

  return curr; // return the modifications back to the caller
}