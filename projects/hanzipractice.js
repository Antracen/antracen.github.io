// TODO
// Spaced repetition
// Generate all Heisig packs with C++
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
	let my_canvas = createCanvas(500, 500);
	current_hanzi = createP("Current hanzi:");
	createElement('br');
	createButton("New hanzi (n)").mousePressed(new_hanzi);
	createButton("Check answer (c)").mousePressed(check_hanzi);
	createElement('br');
	createElement('br');
	createElement('b', "Lessons from 'Remembering Simplified Hanzi 1' by James W. Heisig:<br>");
	
	for(let i = 1; i <= 10; i++) {
		createButton("Lesson " + i).mousePressed(() => load_pack(i));
		createElement('br');
	}

	background(200);	
	createElement('br');
	
	createElement("b", "Choose own file: ");
	createElement('br');
	file_input = createFileInput(file_select_func);
}

function set_current_pack(new_txt) {
	txt = new_txt.split("\n").filter((e) => e != "").map((e) => e.split("\t"));

	localStorage.setItem("hanzi_txt", JSON.stringify(txt));
}

function load_pack(num) {
	let heisig_file = new XMLHttpRequest();
	heisig_file.open("GET", "../libraries/Hanzipacks/heisig" + num + ".txt", true);
	heisig_file.send();
	heisig_file.onreadystatechange = function() {
        if (heisig_file.readyState== 4 && heisig_file.status == 200) {
			set_current_pack(heisig_file.responseText);
        }
     }
}

function check_hanzi() {
	current_hanzi.html(txt[current_hanzi_num][0]);
}

function file_select_func(file) {
	set_current_pack(file.data);
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
