let file_input;
let txt = "";
let current_hanzi;
let current_hanzi_num = -1;

function setup() {
	let cookie_data = document.cookie;
	if(cookie_data != "") {
		cookie_data = cookie_data.split(";");
		txt = JSON.parse(cookie_data[0].substring(4, cookie_data[0].length));
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
	txt = txt.split("\n");
	txt = txt.map((e) => e.split("\t"));

	let date = new Date();
    date.setTime(date.getTime() + (50000*24*60*60*1000));
	let cookie_expires = "; expires=" + date.toUTCString();
	document.cookie = "txt=" + JSON.stringify(txt) + cookie_expires;
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
