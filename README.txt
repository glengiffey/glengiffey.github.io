Reflective Teapot
Author: Glen Giffey

A WebGL scene: a brass teapot inside a cube-mapped environment. It began as
Lab 4 of CSE 5542 (Realtime Rendering) at Ohio State, taught by Han-Wei Shen,
and has since been reworked into a standalone demo.

Open reflective-teapot.html from a web server (see README.md).


MOUSE AND KEYBOARD

  Drag on the canvas                  Rotate, according to the current
  (mouse or one finger)               Selection mode below. Horizontal
                                      movement and vertical movement rotate
                                      about different axes; see Selection.
  's'                                 Scale up.
  'd'                                 Scale down.

Dragging only rotates when the drag starts on the canvas itself, so the
controls underneath stay usable. Scaling is keyboard only, so it is not
available on a touch device.


TEXTURE

  Flat      Phong shading only, no texture.
  Regular   Brick texture, lit by the current light settings.
  Cubemap   Reflects the surrounding environment. This is the default.


SELECTION (what a drag rotates)

  Environment   Horizontal drag rotates the scene about Y, vertical about X.
                The camera does not move; the space is rotated in front of
                it. This is the default.
  Object        Rotates the teapot only, leaving the environment fixed.
                Horizontal drag rotates about Y, vertical about X.
  Roll Camera   Horizontal drag rolls about the camera's Z axis, vertical
                still rotates about X. Scaling with 's' and 'd' has no
                effect in this mode.


CAMERA / LIGHT / CENTER OF INTEREST

Each has Up, Down, Left, Right, Forward, Backward and Reset buttons that step
the value by one unit. Defaults:

  Camera position     [0, 5, -9]
  Light position      [0, 5, -9]
  Center of interest  [0, 0, 0]


LIGHT INTENSITY

Nine sliders set the red, green and blue components of each term, from 0 to
100 percent. Defaults:

  Ambient    0.12, 0.12, 0.12
  Diffuse    0.58, 0.58, 0.58
  Specular   0.55, 0.55, 0.55


BACKGROUND

  Skybox                              The cube map environment (default).
  Red, Green, Blue, Grey, Black,      A solid colour instead.
  White

The background is independent of the Texture setting; changing one leaves the
other alone.


GEOMETRY

  Points   Draws vertices only.
  Lines    Draws the edges of the triangles.
  Faces    Draws filled triangles (default).


RESET SCENE

Restores everything above to its default: camera, light position, center of
interest, light intensities and their sliders, geometry mode, texture mode,
background and all rotations and scaling.
