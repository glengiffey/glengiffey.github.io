Author: Glen Giffey
Date Due: 11/20/2016
Course: CSE 5542
Realtime Rendering

Professor: Han-Wei Shen

Lab 4 focuses on Phong lighting with the image in the center of the canvas. Any extra objects are to "pretty up the environment".

Code for this lab was developed in Sublime Text Editor 3 in Windows 10 and tested on Google Chrome.

1. To control the object select a control method using the html buttons

	Environment - 	(Default)
					Environment rotates around the Y-axis (camera position does not change)
						(Implemented via the view matrix)
	Object 		-	Object rotates around the Y-axis

	Arms		-	Striped cylinders rotate around the rectangles

	Roll Camera -	Switches mouse drag to camera Z-axis rotation

	Sliders 	-	Switches mousedown event off to allow slider use(switching to another control type 
																		reactivates the listener)

2. The camera position can be changed via HTML buttons (the new position is output to the console at each change). Default position is [0, 5, 10].

3. The coefficients for the light intensity can be change via the respective sliders. 
	NOTE: The slider button must have been selected for the sliders to work. (the new value is output to the console at each change).
	Defaults are:
		light_ambient = [ 0, 0, 0, 1]
		light_diffuse = [ 0.8, 0.8, 0.8, 1]
		light_specular= [ 1, 1, 1, 1]

4. The light position can be changed via HTML buttons (the new position is output to the console at each change). Default position is [0, 5, 10].

5. The center of interest can be changed via HTML buttons (the new position is output to the console at each change). Default position is [0, 0, 0].

6. At any time the background buttons can be used to change the background color

7. If the image becomes messy or you just want to start over the "Reset Scene" button resets the entire scene

Controls -
			To rotate the selected object click the left mouse button and drag left or right.
			To scale the selected object press 's' or 'd'

	Background:
		Red 		-	Changes background color to red.
		Green 		-	Changes background color to green.
		Blue 		-	Changes background color to blue.
		Grey 		-	Changes background color to grey.
		Black 		-	Changes background color to black.
		White 		-	Changes background color to white.
	Geometry:
		Points 		- 	Only renders vertices
		Lines		-	Only renders lines connecting triangles
		Faces		- 	Renders the faces of the objects

		Reset Scene	-	Resets matrices to initial positions, rotations and scales.

NOTE:
	The rotations taking place are rotating the space and not changing the position of the camera.
	i.e. the objects are being rotated in front of the camera. (Camera position does not change outside of the HTML buttons)
	For simplicity scaling has been implemented as 's'(increase) and 'd'(decrease) instead of right click and drag