let file_input;
let txt = "";

function setup() {
	textSize(32);
	let my_canvas = createCanvas(400, 400);
	createElement('br');
	let clear_canvas_button = createButton("New hanzi");
	background(200);
	clear_canvas_button.mousePressed(new_hanzi);
	createElement('br');
	file_input = createInput("", "file");
}

function new_hanzi() {
	background(200)
	if(txt != "") {
		line = random(0, txt.size());
		text(txt[line], 50, 50);
	}
	else if(file_input.value() != "") {
		txt = loadStrings(file_input.value()); 
	}
}

function draw() {
	if(mouseIsPressed) {
		line(mouseX, mouseY, pmouseX, pmouseY);
	}
}
