// setup() Runs wen website loads.
function setup(){
	createElement("h1", "MANDELBROT SET");
	canvas = createCanvas(900, 600);
	generate_image();
	createP("The Mandelbrot set is a set of complex numbers C for which the recursive formula Z_{n+1} = Z_n^2 + C does not go to infinity for Z_0 = 0.");
	createP("In this illustration, a pixel (x,y) is mapped to a complex number C ([-2,1], [-1.2,-1.2]) and the color of the pixel is based on the number of iterations until |Z| > 2.");
}

// Generate the Mandelbrot image
function generate_image() {

	for(var x = 0; x < canvas.width; x++){
		for(var y = 0; y < canvas.height; y++){

			// Scale x and y to lie in [-2,1] and [-1.2,1.2]
			x_scaled = map(x + x_offset, 0, canvas.width, -2, 1);
			y_scaled = map(y, 0, canvas.height, -1.2, 1.2);

			// Create C and Z
			var c_real = x_scaled;
			var c_comp = y_scaled;
			var z_real = 0;
			var z_comp = 0;
			var z_real_squared = 0;
			var z_comp_squared = 0;

			var max_iterations = 100;
			var iteration = 0;
			// Loop until |Z| > 2 or max_iterations reached
			// Z_new = Z_old*Z_old + C
			while(z_real_squared + z_comp_squared < 4 && iteration <= max_iterations) {
				z_comp = 2*z_real*z_comp + c_comp;
				z_real = z_real_squared - z_comp_squared + c_real;
				z_real_squared = z_real*z_real;
				z_comp_squared = z_comp*z_comp;
				iteration++;
			}
			// Map the number of itrations to [0,255] and draw
			var color = map(iteration, 0, max_iterations, 0, 255);
			stroke(255 - color);
			point(x, y);

		}
	}

}
