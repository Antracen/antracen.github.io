// TODO
// Spaced repetition
// Generate all Heisig packs with C++
// Show and edit current word list

let current_hanzi_num = 0;
let toggle = 1;

function setup() {

	//load_local_data();

	let my_canvas = createCanvas(500, 500);
	background(200);
	show_help();
	createElement('br'); createElement('br');

	// Add buttons which load Heisig-lessons
	createElement('b', "Lessons from 'Remembering Simplified Hanzi 1' <br> by James W. Heisig:<br>");
	for(let i = 1; i <= 6; i++) createButton("Lesson " + i).mousePressed(() => load_heisig(i));
	createElement('br');
	for(let i = 6; i <= 10; i++) createButton("Lesson " + i).mousePressed(() => load_heisig(i));
	createElement('br');
	
	createElement('br');
	createElement("b", "Choose own file: ");
	createElement('br');
	createFileInput(file_select_func);
}

function show_help() {
	textSize(15);
	textAlign(LEFT, TOP);
	text("This is a website made for practicing writing chinese or japanese characters. To use it; either load an existing lesson or upload your own by supplying a file where each line is a tab-separated pair of first the character and then the explanation / pronounciation / romanization. The site uses local storage to remember the lesson / file you used on your last visit. \n\n After a lesson is properly loaded, these are the controls: \n\n S: Show answer \n N: New character \n Space: Show answer if not present, else show new character \n H: Show help", 40, 40, 420, 420);
}

// Load potential local user data.
function load_local_data() {
	let saved_txt = localStorage.getItem("hanzi_txt");
	if(saved_txt != null) {
		txt = JSON.parse(saved_txt);
		shuffle_array(txt);
	} 
	else return;

	let saved_hanzi_num = localStorage.getItem("hanzi_num");
	if(saved_hanzi_num != null) current_hanzi_num = saved_hanzi_num;
}

// Generate the txt-array from a string
function set_current_pack(new_txt) {
	txt = new_txt.split("\n").filter((e) => e != "").map((e) => e.split("\t"));
	shuffle_array(txt);

	localStorage.setItem("hanzi_txt", JSON.stringify(txt));
}

function load_heisig(num) {
	background(200);
	let heisig_file = new XMLHttpRequest();
	heisig_file.open("GET", "../libraries/Hanzipacks/heisig" + num + ".txt", true);
	heisig_file.send();
	heisig_file.onreadystatechange = function() {
        if (heisig_file.readyState== 4 && heisig_file.status == 200) {
			set_current_pack(heisig_file.responseText);
        }
     }
	textSize(12);
	textAlign(LEFT, BOTTOM);
	text("Loaded lesson " + num, 0, 500);
}

function show_hanzi() {
	textSize(50);
	textAlign(RIGHT, TOP);
	text(txt[current_hanzi_num][0], 500, 0);
}

function file_select_func(file) {
	set_current_pack(file.data);
}

function new_hanzi() {
	background(200)
	if(txt != "") {
		current_hanzi_num += 1;
		if(current_hanzi_num >= txt.length) {
			current_hanzi_num = 0;
			shuffle_array(txt);
		}
		textSize(20);
		textAlign(LEFT, TOP);
		text(txt[current_hanzi_num][1], 0, 0);
	}
}

// Fisher-Yates algorithm for array shuffling
function shuffle_array(arr) {
	for(var i = 0; i < arr.length-1; i++) {
		// j is a random integer such that i <= j < length
		var j = i + int(random(0, arr.length-i));
		var temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}
}

function draw() {
	if(mouseIsPressed) line(mouseX, mouseY, pmouseX, pmouseY);
}

function keyPressed() {
	if(keyCode === 78) { // N
		new_hanzi();
		toggle = 0;
	} else if(keyCode === 83) { // S
		show_hanzi();
	} else if(keyCode === 32) { // SPACE
		if(toggle == 0) show_hanzi();
		else new_hanzi();
		toggle = 1-toggle;
	} else if(keyCode === 72) { // H
		show_help();
	}
}
