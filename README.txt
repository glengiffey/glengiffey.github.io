Reflective Teapot
Author: Glen Giffey

A WebGL scene: a brass teapot inside a cube-mapped environment. It began as
Lab 4 of CSE 5542 (Realtime Rendering) at Ohio State, taught by Han-Wei Shen,
and has since been reworked into a standalone demo.

Open reflective-teapot.html from a web server (see README.md).


MOUSE AND KEYBOARD

  Left click and drag on the canvas   Rotate, according to the current
                                      Selection mode below.
  's'                                 Scale up.
  'd'                                 Scale down.

Dragging only rotates when the drag starts on the canvas itself, so the
controls underneath stay usable.


TEXTURE

  Flat      Phong shading only, no texture.
  Regular   Brick texture, lit by the current light settings.
  Cubemap   Reflects the surrounding environment. This is the default.


SELECTION (what the mouse rotates)

  Environment   Rotates the scene around the Y axis. The camera does not
                move; the space is rotated in front of it. This is the
                default.
  Object        Rotates the teapot only, leaving the environment fixed.
  Roll Camera   Switches the drag to rotation about the camera's Z axis.


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
