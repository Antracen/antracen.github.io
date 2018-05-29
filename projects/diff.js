var EigenType = {real:0, complex:1, repeated:2};
Object.freeze(EigenType)

var answer;
var answer1;
var answer2;
var answer3;
var a,b,c,d;

function setup(){

	createP("This is a solver for differential equations on the form X' = A*X");
	createP("OBS: This project is far from done. Some simple matrix ODEs can be solved.");
	createP("Matrix (A):");
	a = createInput(2);
	b = createInput(1);
	createElement("br");
	c = createInput(1);
	d = createInput(1);
	createElement("br");

	var button = createButton("Calculate");
	button.mousePressed(calculate);
	
	answer1 = createP("");
	answer = createP("");
	answer2 = createP("");
	answer3 = createP("");
}

function calculate() {
	if(a.value() == "" || b.value() == "" || c.value() == "" || d.value == "") {
		alert("Error: must supply matrix values to calculate");
		return;
	}
	var matrix = [a.value(), b.value(), c.value(), d.value()];

	var eigen_equation = [1, -matrix[0]-matrix[3], matrix[0]*matrix[3]-matrix[1]*matrix[2]];

	var p = eigen_equation[1];
	var q = eigen_equation[2];

	var eigen_type; // 0=complex, 1=real,repeated, 2=

	// Eigenvalues
	var e1, e2;

	if(p*p/4 < q) { // complex solution
		eigen_type = EigenType.complex;
	}
	else {
		e1 = -p/2 + sqrt((p*p/4 - q));
		e2 = -p/2 - sqrt((p*p/4 - q));
		if(e1 == e2) eigen_type = EigenType.repeated;
		else eigen_type = EigenType.real;
	}
	answer1.html("Eigenequation: " + eigen_equation[0] + "*l^2 + " + eigen_equation[1] + "*l +" + eigen_equation[2] + " = 0");
	answer.html("Eigenvalues: " + e1 + " & " + e2);

	if(eigen_type == EigenType.real) {
		var v1 = calculate_eigenvector(e1, matrix);
		var v2 = calculate_eigenvector(e2, matrix);
		
		answer2.html("Eigenvectors: " + v1 + " & " + v2);
		answer3.html("Solution: A*(" + v1 + ")*e^(" + e1 + "*t) + B*(" + v2 + ")*e^(" + e2 + "*t)");
	}

}

function calculate_eigenvector(e, matrix) {
	// matrix[0]*x + matrix[1]*y = e*x
	var v_eq_1 = [e-matrix[0], matrix[1]];
	if(v_eq_1[0] == 0 && v_eq_1[1] == 0) {
		// matrix[2]*x + matrix[3]*y = e*y
		var v_eq_2 = [matrix[2], e-matrix[3]];
		if(matrix[2] == 0 && e-matrix[3] != 0) {
			return [1,0];
		}
	}
	if(v_eq_1[1] == 0 && v_eq_1[0] != 0) {
		return [0,1];
	}
	if(v_eq_1[0] == 0 && v_eq_1[1] != 0) {
		return [1,0];
	}
	return [1, v_eq_1[1]/v_eq_1[0]];
}
