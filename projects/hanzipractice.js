// TODO
// Spaced repetition
// Built in Heisig / HSK packs
// Show and edit current word list

let file_input;
let txt = "";
let current_hanzi;
let current_hanzi_num = -1;

function setup() {
	let saved_txt = localStorage.getItem("hanzi_txt");
	if(saved_txt != null) {
		txt = JSON.parse(saved_txt);
	}
	textSize(32);
	let my_canvas = createCanvas(400, 400);
	current_hanzi = createP("Current hanzi:");
	createElement('br');
	let clear_canvas_button = createButton("New hanzi (n)");
	let check_button = createButton("Check answer (c)");
	background(200);
	
	clear_canvas_button.mousePressed(new_hanzi);
	check_button.mousePressed(check_hanzi);
	createElement('br');
	file_input = createFileInput(file_select_func);
}

function check_hanzi() {
	current_hanzi.html(txt[current_hanzi_num][0]);
}

function file_select_func(file) {
	txt = file.data;
	txt = txt.split("\n").filter((e) => e != "");
	txt = txt.map((e) => e.split("\t"));

	localStorage.setItem("hanzi_txt", JSON.stringify(txt));
}

function new_hanzi() {
	background(200)
	if(txt != "") {
		current_hanzi_num = int(random(0, txt.length));
		let hanzi_text = txt[current_hanzi_num][1];
		current_hanzi.html(hanzi_text);
	}
}

function draw() {
	if(mouseIsPressed) {
		line(mouseX, mouseY, pmouseX, pmouseY);
	}
}

function keyPressed() {
	if (keyCode === 78) {
		new_hanzi();
	}
	else if (keyCode === 67) {
		check_hanzi();
	}
}
