
//////////////////////////////////////////////////////////////////
// set up gl and general purpose parameters
var gl;
var phongshaderProgram;
var textureshaderProgram;
var shaderProgram;
// Scene defaults, shared by the initial state and by the Reset controls so the
// two cannot drift apart.
var DEFAULT_DRAW_TYPE = 2;
var DEFAULT_CONTROL_TYPE = 1;
var DEFAULT_USE_TEXTURE = 2;
var DEFAULT_LIGHT_AMBIENT = [.12,.12,.12,1];
var DEFAULT_LIGHT_DIFFUSE = [.58,.58,.58,1];
var DEFAULT_LIGHT_SPECULAR = [.55,.55,.55,1];
var DEFAULT_LIGHT_POS = [0,5,-9,1];
var DEFAULT_CAMERA_POS = [0,5,-9];
var DEFAULT_CENTER_OF_INTEREST = [0,0,0];
var DEFAULT_VIEW_UP = [0,1,0];

var draw_type = DEFAULT_DRAW_TYPE;
var control_type = DEFAULT_CONTROL_TYPE;
var use_texture = DEFAULT_USE_TEXTURE;
var show_skybox = true;

// set up the parameters for lighting
var light_ambient = DEFAULT_LIGHT_AMBIENT.slice();
var light_diffuse = DEFAULT_LIGHT_DIFFUSE.slice();
var light_specular = DEFAULT_LIGHT_SPECULAR.slice();
var light_pos = DEFAULT_LIGHT_POS.slice();   // eye space position

var mat_ambient = [0.22, 0.16, 0.06, 1];
var mat_diffuse= [0.78, 0.62, 0.22, 1]; 
var mat_specular = [0.85, 0.72, 0.35, 1]; 
var mat_shine = [35]; 

//set up camera and view parrameters
var cameraPos = DEFAULT_CAMERA_POS.slice();
var centerofInterest = DEFAULT_CENTER_OF_INTEREST.slice();
var viewUp = DEFAULT_VIEW_UP.slice();

//////////// Init OpenGL Context etc. ///////////////

function initGL(canvas) {
    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (e) {
        console.error("WebGL context creation failed:", e);
    }
    if (gl) {
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } else {
        console.error("Could not initialise WebGL");
    }
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

var skyboxpxVertexPositionBuffer;
var skyboxpxVertexColorBuffer;
var skyboxpxVertexTextureCoordBuffer;
var skyboxpxVertexNormalBuffer;
var skyboxpxVertexIndexBuffer;

var skyboxnxVertexPositionBuffer;
var skyboxnxVertexColorBuffer;
var skyboxnxVertexTextureCoordBuffer;
var skyboxnxVertexNormalBuffer;
var skyboxnxVertexIndexBuffer;

var skyboxpyVertexPositionBuffer;
var skyboxpyVertexColorBuffer;
var skyboxpyVertexTextureCoordBuffer;
var skyboxpyVertexNormalBuffer;
var skyboxpyVertexIndexBuffer;

var skyboxnyVertexPositionBuffer;
var skyboxnyVertexColorBuffer;
var skyboxnyVertexTextureCoordBuffer;
var skyboxnyVertexNormalBuffer;
var skyboxnyVertexIndexBuffer;

var skyboxpzVertexPositionBuffer;
var skyboxpzVertexColorBuffer;
var skyboxpzVertexTextureCoordBuffer;
var skyboxpzVertexNormalBuffer;
var skyboxpzVertexIndexBuffer;

var skyboxnzVertexPositionBuffer;
var skyboxnzVertexColorBuffer;
var skyboxnzVertexTextureCoordBuffer;
var skyboxnzVertexNormalBuffer;
var skyboxnzVertexIndexBuffer;

var teapotVertexPositionBuffer;
var teapotVertexNormalBuffer; 
var teapotVertexTextureCoordBuffer; 
var teapotVertexColorBuffer;
var teapotVertexIndexBuffer;

////////////////    Initialize VBO  ////////////////////////

//////////////////////////////////////////////////////////////////////////////

var skypxTexture;
var skynxTexture;
var skypyTexture;
var skynyTexture;
var skypzTexture;
var skynzTexture; 

function initSkyBoxTextures() {
    skypxTexture = loadSkyBoxFace("posx.jpg", 2);
    skynxTexture = loadSkyBoxFace("negx.jpg", 3);
    skypyTexture = loadSkyBoxFace("posy.jpg", 4);
    skynyTexture = loadSkyBoxFace("negy.jpg", 5);
    skypzTexture = loadSkyBoxFace("posz.jpg", 6);
    skynzTexture = loadSkyBoxFace("negz.jpg", 7);
}

// Load one skybox face into its own texture unit. A face that never arrives
// leaves that side of the box untextured, so report it rather than silently
// rendering a black wall.
function loadSkyBoxFace(url, unit) {
    var texture = gl.createTexture();
    texture.image = new Image();
    texture.image.onload = function() { handleSkyBoxTextureLoaded(texture, unit); };
    texture.image.onerror = function() {
        console.error("Skybox face failed to load: " + url +
                      " (that side of the background will render black)");
    };
    texture.image.src = url;
    return texture;
}

function handleSkyBoxTextureLoaded(texture, i) {
  gl.activeTexture(gl.TEXTURE0 +i);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.bindTexture(gl.TEXTURE_2D, null);
  drawScene();
}

/////////////////////////////////////////////////////////////////////////////

function initSkybox(){
  // Keep skybox comfortably away from scene objects but inside far clip plane.
  var s = 40.0;
  var pxvertices = [ s,  s,  s,
                     s,  s, -s,
                     s, -s, -s,
                     s, -s,  s ];
  var nxvertices = [ -s,  s,  s,
                     -s,  s, -s,
                     -s, -s, -s,
                     -s, -s,  s ];

  var pyvertices = [  s, s,  s,
                     -s, s,  s,
                     -s, s, -s,
                      s, s, -s ];
  var nyvertices = [  s, -s,  s,
                     -s, -s,  s,
                     -s, -s, -s,
                      s, -s, -s ];

  var pzvertices = [  s,  s, s,
                     -s,  s, s,
                     -s, -s, s,
                      s, -s, s ];

  var nzvertices = [  s,  s, -s,
                     -s,  s, -s,
                     -s, -s, -s,
                      s, -s, -s ];

  var colors = [  1.0, 0.0, 0.0, 1.0,
                  1.0, 0.0, 0.0, 1.0,
                  1.0, 0.0, 0.0, 1.0,
                  1.0, 0.0, 0.0, 1.0 ];

  var normals = [0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0 ];

  var texcoords = [0.0,0.0,
                   1.0,0.0,
                   1.0,1.0,
                   0.0,1.0];

  var pztexcoords = [ 
                      1.0, 0.0,
                      0.0, 0.0,
                      0.0, 1.0,
                      1.0, 1.0
                     ];

  var pytexcoords = [ 
                       1.0,1.0,
                      0.0,1.0,
                      0.0,0.0,
                      1.0,0.0,
                     ];


  // Two non-overlapping triangles that cover the full quad.
  var indices = [0,1,2, 0,2,3];
  ///////////// PX

  skyboxpxVertexPositionBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpxVertexPositionBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pxvertices), gl.STATIC_DRAW); 
  skyboxpxVertexPositionBuffer.itemSize = 3; 
  skyboxpxVertexPositionBuffer.numItems = 4;

  skyboxpxVertexColorBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpxVertexColorBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW); 
  skyboxpxVertexColorBuffer.itemSize = 4; 
  skyboxpxVertexColorBuffer.numItems = 4; 

  skyboxpxVertexTextureCoordBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpxVertexTextureCoordBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW); 
  skyboxpxVertexTextureCoordBuffer.itemSize = 2; 
  skyboxpxVertexTextureCoordBuffer.numItems = 4;

  skyboxpxVertexNormalBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpxVertexNormalBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW); 
  skyboxpxVertexNormalBuffer.itemSize = 3; 
  skyboxpxVertexNormalBuffer.numItems = 4;

  skyboxpxVertexIndexBuffer= gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxpxVertexIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  skyboxpxVertexIndexBuffer.itemSize = 1;
  skyboxpxVertexIndexBuffer.numItems = 6;

  /////////// NX

  skyboxnxVertexPositionBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnxVertexPositionBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nxvertices), gl.STATIC_DRAW); 
  skyboxnxVertexPositionBuffer.itemSize = 3; 
  skyboxnxVertexPositionBuffer.numItems = 4;

  skyboxnxVertexColorBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnxVertexColorBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW); 
  skyboxnxVertexColorBuffer.itemSize = 4; 
  skyboxnxVertexColorBuffer.numItems = 4; 

  skyboxnxVertexTextureCoordBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnxVertexTextureCoordBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pztexcoords), gl.STATIC_DRAW); 
  skyboxnxVertexTextureCoordBuffer.itemSize = 2; 
  skyboxnxVertexTextureCoordBuffer.numItems = 4;

  skyboxnxVertexNormalBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnxVertexNormalBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW); 
  skyboxnxVertexNormalBuffer.itemSize = 3; 
  skyboxnxVertexNormalBuffer.numItems = 4;

  skyboxnxVertexIndexBuffer= gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxnxVertexIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  skyboxnxVertexIndexBuffer.itemSize = 1;
  skyboxnxVertexIndexBuffer.numItems = 6;

  ////////////// PY

  skyboxpyVertexPositionBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpyVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pyvertices), gl.STATIC_DRAW); 
  skyboxpyVertexPositionBuffer.itemSize = 3; 
  skyboxpyVertexPositionBuffer.numItems = 4;

  skyboxpyVertexColorBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpyVertexColorBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW); 
  skyboxpyVertexColorBuffer.itemSize = 4; 
  skyboxpyVertexColorBuffer.numItems = 4; 

  skyboxpyVertexTextureCoordBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpyVertexTextureCoordBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pytexcoords), gl.STATIC_DRAW); 
  skyboxpyVertexTextureCoordBuffer.itemSize = 2; 
  skyboxpyVertexTextureCoordBuffer.numItems = 4;

  skyboxpyVertexNormalBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpyVertexNormalBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW); 
  skyboxpyVertexNormalBuffer.itemSize = 3; 
  skyboxpyVertexNormalBuffer.numItems = 4;

  skyboxpyVertexIndexBuffer= gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxpyVertexIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  skyboxpyVertexIndexBuffer.itemSize = 1;
  skyboxpyVertexIndexBuffer.numItems = 6;

  ///////////////// NY

  skyboxnyVertexPositionBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnyVertexPositionBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nyvertices), gl.STATIC_DRAW); 
  skyboxnyVertexPositionBuffer.itemSize = 3; 
  skyboxnyVertexPositionBuffer.numItems = 4;

  skyboxnyVertexColorBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnyVertexColorBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW); 
  skyboxnyVertexColorBuffer.itemSize = 4; 
  skyboxnyVertexColorBuffer.numItems = 4; 

  skyboxnyVertexTextureCoordBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnyVertexTextureCoordBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pztexcoords), gl.STATIC_DRAW); 
  skyboxnyVertexTextureCoordBuffer.itemSize = 2; 
  skyboxnyVertexTextureCoordBuffer.numItems = 4;

  skyboxnyVertexNormalBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnyVertexNormalBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW); 
  skyboxnyVertexNormalBuffer.itemSize = 3; 
  skyboxnyVertexNormalBuffer.numItems = 4;

  skyboxnyVertexIndexBuffer= gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxnyVertexIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  skyboxnyVertexIndexBuffer.itemSize = 1;
  skyboxnyVertexIndexBuffer.numItems = 6;

  ///////// PZ

  skyboxpzVertexPositionBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpzVertexPositionBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pzvertices), gl.STATIC_DRAW); 
  skyboxpzVertexPositionBuffer.itemSize = 3; 
  skyboxpzVertexPositionBuffer.numItems = 4;

  skyboxpzVertexColorBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpzVertexColorBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW); 
  skyboxpzVertexColorBuffer.itemSize = 4; 
  skyboxpzVertexColorBuffer.numItems = 4; 

  skyboxpzVertexTextureCoordBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpzVertexTextureCoordBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pztexcoords), gl.STATIC_DRAW); 
  skyboxpzVertexTextureCoordBuffer.itemSize = 2; 
  skyboxpzVertexTextureCoordBuffer.numItems = 4;

  skyboxpzVertexNormalBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpzVertexNormalBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW); 
  skyboxpzVertexNormalBuffer.itemSize = 3; 
  skyboxpzVertexNormalBuffer.numItems = 4;

  skyboxpzVertexIndexBuffer= gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxpzVertexIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  skyboxpzVertexIndexBuffer.itemSize = 1;
  skyboxpzVertexIndexBuffer.numItems = 6;

  ////////////// Ny

  skyboxnzVertexPositionBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnzVertexPositionBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nzvertices), gl.STATIC_DRAW); 
  skyboxnzVertexPositionBuffer.itemSize = 3; 
  skyboxnzVertexPositionBuffer.numItems = 4;

  skyboxnzVertexColorBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnzVertexColorBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW); 
  skyboxnzVertexColorBuffer.itemSize = 4; 
  skyboxnzVertexColorBuffer.numItems = 4; 

  skyboxnzVertexTextureCoordBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnzVertexTextureCoordBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW); 
  skyboxnzVertexTextureCoordBuffer.itemSize = 2; 
  skyboxnzVertexTextureCoordBuffer.numItems = 4;

  skyboxnzVertexNormalBuffer= gl.createBuffer(); 
  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnzVertexNormalBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW); 
  skyboxnzVertexNormalBuffer.itemSize = 3; 
  skyboxnzVertexNormalBuffer.numItems = 4;

  skyboxnzVertexIndexBuffer= gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxnzVertexIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  skyboxnzVertexIndexBuffer.itemSize = 1;
  skyboxnzVertexIndexBuffer.numItems = 6;
}

////////////////    Initialize JSON geometry file ///////////

function initTeapotJSON() {
  var request = new  XMLHttpRequest();
  request.open("GET", "teapot.json");
  request.onreadystatechange =
    function () {
      if (request.readyState == 4) {
        if ((request.status === 200 || request.status === 0) && request.responseText) {
          try {
            handleLoadedTeapot(JSON.parse(request.responseText));
          } catch (e) {
            console.error("Failed to parse teapot.json:", e);
          }
        } else {
          console.error("Failed to load teapot.json: status=" + request.status +
                        ", responseText empty=" + !request.responseText);
        }
      }
    }
  request.send();
}

function handleLoadedTeapot(teapotData) {
    teapotVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotData.vertexPositions), gl.STATIC_DRAW);
    teapotVertexPositionBuffer.itemSize=3;
    teapotVertexPositionBuffer.numItems=teapotData.vertexPositions.length/3; 
    
    teapotVertexNormalBuffer =  gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,  teapotVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotData.vertexNormals), gl.STATIC_DRAW);
    teapotVertexNormalBuffer.itemSize=3;
    teapotVertexNormalBuffer.numItems= teapotData.vertexNormals.length/3;

    teapotVertexTextureCoordBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(teapotData.vertexTextureCoords), gl.STATIC_DRAW);
    teapotVertexTextureCoordBuffer.itemSize=2;
    teapotVertexTextureCoordBuffer.numItems=teapotData.vertexTextureCoords.length/2;

    teapotVertexIndexBuffer= gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(teapotData.indices), gl.STATIC_DRAW);
    teapotVertexIndexBuffer.itemSize=1;
    teapotVertexIndexBuffer.numItems=teapotData.indices.length;

	    teapotVertexColorBuffer = teapotVertexNormalBuffer;

	    drawScene();
}

///////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////

var model = mat4.create();    //Base sphere

function initModels() {
  mat4.identity(model);

}

///////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////

var sampleTexture; 
var cubemapTexture;
function initCubeMap() {
	cubemapTexture = gl.createTexture();
	var ct = 0;
	var failed = 0;
    var img = new Array(6);
    var urls = [
       "posx.jpg", "negx.jpg",
       "posy.jpg", "negy.jpg",
       "posz.jpg", "negz.jpg"
    ];
    for (var i = 0; i < 6; i++) {
        img[i] = new Image();
	        img[i].onload = function() {
	            ct++;
	            if (ct == 6) {
	                gl.activeTexture(gl.TEXTURE1);
	                gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);
                var targets = [
                   gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 
                   gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 
                   gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z 
                ];
                for (var j = 0; j < 6; j++) {
                    gl.texImage2D(targets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img[j]);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	                }
	                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
	                drawScene();
	            }
	        }
	        // A face that never arrives leaves ct short of 6, so the cube map is
	        // never uploaded. Report that instead of silently losing reflections.
	        img[i].onerror = (function (url) {
	            return function () {
	                failed++;
	                console.error("Cube map face failed to load: " + url + " (" + failed +
	                              " of 6 faces missing; reflections will not render)");
	            };
	        })(urls[i]);
	        img[i].src = urls[i];
	    }
}

function initTextures() {
  sampleTexture = gl.createTexture();
  sampleTexture.image = new Image();
  sampleTexture.image.onload = function() { handleTextureLoaded(sampleTexture); }
  sampleTexture.image.onerror = function() { console.warn("brick.png not found; Regular texture mode unavailable"); }
  sampleTexture.image.src = "brick.png";
}

function handleTextureLoaded(texture) {
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.bindTexture(gl.TEXTURE_2D, null);
  drawScene();
}



///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

var rMatrix = mat4.create();  // camera rotation matrix
var mMatrix = mat4.create();  // model matrix     
var vMatrix = mat4.create();  // view matrix      
var pMatrix = mat4.create();  //projection matrix  
var nMatrix = mat4.create();  //normal matrix
var v2wMatrix = mat4.create();  // eye space to world space matrix

var X_angle = 0.0;
var Z_angle = 0.0;

function setMatrixUniforms(theshaderProgram) {
  // Recompute nMatrix from current mMatrix so rotated objects get correct normals
  mat4.identity(nMatrix);
  nMatrix = mat4.multiply(nMatrix, vMatrix);
  nMatrix = mat4.multiply(nMatrix, mMatrix);
  nMatrix = mat4.inverse(nMatrix);
  nMatrix = mat4.transpose(nMatrix);

  gl.uniformMatrix4fv(theshaderProgram.mMatrixUniform, false, mMatrix);
  gl.uniformMatrix4fv(theshaderProgram.vMatrixUniform, false, vMatrix);
  gl.uniformMatrix4fv(theshaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(theshaderProgram.nMatrixUniform, false, nMatrix);
  gl.uniformMatrix4fv(theshaderProgram.v2wMatrixUniform, false, v2wMatrix);
}

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

function drawScene() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  pMatrix = mat4.perspective(60, gl.viewportWidth / gl.viewportHeight, 0.1, 100, pMatrix);  // set up the projection matrix

  vMatrix = mat4.multiply(mat4.lookAt(cameraPos, centerofInterest, viewUp, vMatrix), rMatrix);  // set up the view matrix

  mat4.identity(mMatrix);

  mat4.identity(v2wMatrix);
  v2wMatrix = mat4.multiply(v2wMatrix, vMatrix);
  v2wMatrix = mat4.inverse(v2wMatrix);
  if (show_skybox) {
    drawSkybox();
  }
  gl.useProgram(phongshaderProgram);

  gl.uniform4f(phongshaderProgram.light_posUniform,light_pos[0], light_pos[1], light_pos[2], light_pos[3]);  

  gl.uniform4f(phongshaderProgram.light_ambientUniform, light_ambient[0], light_ambient[1], light_ambient[2], 1.0); 
  gl.uniform4f(phongshaderProgram.light_diffuseUniform, light_diffuse[0], light_diffuse[1], light_diffuse[2], 1.0); 
  gl.uniform4f(phongshaderProgram.light_specularUniform, light_specular[0], light_specular[1], light_specular[2],1.0); 

  gl.uniform4f(phongshaderProgram.ambient_coefUniform, mat_ambient[0], mat_ambient[1], mat_ambient[2], 1.0); 
  gl.uniform4f(phongshaderProgram.diffuse_coefUniform, mat_diffuse[0], mat_diffuse[1], mat_diffuse[2], 1.0); 
  gl.uniform4f(phongshaderProgram.specular_coefUniform, mat_specular[0], mat_specular[1], mat_specular[2],1.0); 

  gl.uniform1f(phongshaderProgram.shininess_coefUniform, mat_shine[0]); 


  if (teapotVertexPositionBuffer == null || teapotVertexNormalBuffer == null || teapotVertexIndexBuffer == null) {
    return;
  }

  // Select shader program based on texture mode
  var teapotProgram;
  if (use_texture === 2) {
    teapotProgram = shaderProgram;        // cubemap reflective
  } else if (use_texture === 1) {
    teapotProgram = textureshaderProgram; // 2D texture
  } else {
    teapotProgram = phongshaderProgram;   // Phong shading (default)
  }
  gl.useProgram(teapotProgram);

  mat4.multiply(mMatrix, model);
  mMatrix = mat4.scale(mMatrix, [2/10, 2/10, 2/10]);
  gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer);
  gl.vertexAttribPointer(teapotProgram.vertexPositionAttribute, teapotVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalBuffer);
  gl.vertexAttribPointer(teapotProgram.vertexNormalAttribute, teapotVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexTextureCoordBuffer);
  gl.vertexAttribPointer(teapotProgram.vertexTexCoordsAttribute, teapotVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexColorBuffer);
  gl.vertexAttribPointer(teapotProgram.vertexColorAttribute, teapotVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotVertexIndexBuffer);

  // Keep reflective shader lighting uniforms in sync with sliders.
  if (teapotProgram === shaderProgram) {
    gl.uniform4f(shaderProgram.light_posUniform, light_pos[0], light_pos[1], light_pos[2], light_pos[3]);
    gl.uniform4f(shaderProgram.light_ambientUniform, light_ambient[0], light_ambient[1], light_ambient[2], 1.0);
    gl.uniform4f(shaderProgram.light_diffuseUniform, light_diffuse[0], light_diffuse[1], light_diffuse[2], 1.0);
    gl.uniform4f(shaderProgram.light_specularUniform, light_specular[0], light_specular[1], light_specular[2], 1.0);
    gl.uniform4f(shaderProgram.ambient_coefUniform, mat_ambient[0], mat_ambient[1], mat_ambient[2], 1.0);
    gl.uniform4f(shaderProgram.diffuse_coefUniform, mat_diffuse[0], mat_diffuse[1], mat_diffuse[2], 1.0);
    gl.uniform4f(shaderProgram.specular_coefUniform, mat_specular[0], mat_specular[1], mat_specular[2], 1.0);
    gl.uniform1f(shaderProgram.shininess_coefUniform, mat_shine[0]);
  }
  if (teapotProgram === textureshaderProgram) {
    gl.uniform4f(textureshaderProgram.light_posUniform, light_pos[0], light_pos[1], light_pos[2], light_pos[3]);
    gl.uniform4f(textureshaderProgram.light_ambientUniform, light_ambient[0], light_ambient[1], light_ambient[2], 1.0);
    gl.uniform4f(textureshaderProgram.light_diffuseUniform, light_diffuse[0], light_diffuse[1], light_diffuse[2], 1.0);
    gl.uniform4f(textureshaderProgram.light_specularUniform, light_specular[0], light_specular[1], light_specular[2], 1.0);
    gl.uniform4f(textureshaderProgram.ambient_coefUniform, mat_ambient[0], mat_ambient[1], mat_ambient[2], 1.0);
    gl.uniform4f(textureshaderProgram.diffuse_coefUniform, mat_diffuse[0], mat_diffuse[1], mat_diffuse[2], 1.0);
    gl.uniform4f(textureshaderProgram.specular_coefUniform, mat_specular[0], mat_specular[1], mat_specular[2], 1.0);
    gl.uniform1f(textureshaderProgram.shininess_coefUniform, mat_shine[0]);
  }

  // Bind appropriate texture for the selected mode
  if (use_texture === 2) {
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);
    gl.uniform1i(shaderProgram.cube_map_textureUniform, 1);
  } else if (use_texture === 1) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sampleTexture);
    gl.uniform1i(textureshaderProgram.textureUniform, 0);
  }

  setMatrixUniforms(teapotProgram);   // pass the modelview matrix and projection matrix to the shader

  if (draw_type === 2) {
    gl.drawElements(gl.TRIANGLES, teapotVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
  } else if (draw_type === 1) {
    gl.drawElements(gl.LINES, teapotVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
  } else {
    gl.drawArrays(gl.POINTS, 0, teapotVertexPositionBuffer.numItems);
  }
  
}

function drawSkybox() {
  gl.useProgram(textureshaderProgram);
  // Render skybox as unlit texture even though texture shader supports lighting.
  gl.uniform4f(textureshaderProgram.light_posUniform, 0.0, 0.0, 0.0, 1.0);
  gl.uniform4f(textureshaderProgram.light_ambientUniform, 1.0, 1.0, 1.0, 1.0);
  gl.uniform4f(textureshaderProgram.light_diffuseUniform, 0.0, 0.0, 0.0, 1.0);
  gl.uniform4f(textureshaderProgram.light_specularUniform, 0.0, 0.0, 0.0, 1.0);
  gl.uniform4f(textureshaderProgram.ambient_coefUniform, 1.0, 1.0, 1.0, 1.0);
  gl.uniform4f(textureshaderProgram.diffuse_coefUniform, 0.0, 0.0, 0.0, 1.0);
  gl.uniform4f(textureshaderProgram.specular_coefUniform, 0.0, 0.0, 0.0, 1.0);
  gl.uniform1f(textureshaderProgram.shininess_coefUniform, 1.0);

  // PX

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpxVertexPositionBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexPositionAttribute, skyboxpxVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpxVertexNormalBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexNormalAttribute, skyboxpxVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpxVertexTextureCoordBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexTexCoordsAttribute, skyboxpxVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpxVertexColorBuffer);  
  gl.vertexAttribPointer(textureshaderProgram.vertexColorAttribute, skyboxpxVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxpxVertexIndexBuffer);   


  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, skypxTexture);
  gl.uniform1i(textureshaderProgram.textureUniform, 2);
  setMatrixUniforms(textureshaderProgram);   // pass the modelview mattrix and projection matrix to the shader 

  gl.drawElements(gl.TRIANGLES, skyboxpxVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  // NX

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnxVertexPositionBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexPositionAttribute, skyboxnxVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnxVertexNormalBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexNormalAttribute, skyboxnxVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnxVertexTextureCoordBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexTexCoordsAttribute, skyboxnxVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnxVertexColorBuffer);  
  gl.vertexAttribPointer(textureshaderProgram.vertexColorAttribute, skyboxnxVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxnxVertexIndexBuffer);   


  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, skynxTexture);
  gl.uniform1i(textureshaderProgram.textureUniform, 3);
  setMatrixUniforms(textureshaderProgram);   // pass the modelview mattrix and projection matrix to the shader 

  gl.drawElements(gl.TRIANGLES, skyboxnxVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  // PY

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpyVertexPositionBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexPositionAttribute, skyboxpyVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpyVertexNormalBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexNormalAttribute, skyboxpyVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpyVertexTextureCoordBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexTexCoordsAttribute, skyboxpyVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpyVertexColorBuffer);  
  gl.vertexAttribPointer(textureshaderProgram.vertexColorAttribute, skyboxpyVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxpyVertexIndexBuffer);   


  gl.activeTexture(gl.TEXTURE4);
  gl.bindTexture(gl.TEXTURE_2D, skypyTexture);
  gl.uniform1i(textureshaderProgram.textureUniform, 4);
  setMatrixUniforms(textureshaderProgram);   // pass the modelview mattrix and projection matrix to the shader 

  gl.drawElements(gl.TRIANGLES, skyboxpyVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  // NY

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnyVertexPositionBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexPositionAttribute, skyboxnyVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnyVertexNormalBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexNormalAttribute, skyboxnyVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnyVertexTextureCoordBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexTexCoordsAttribute, skyboxnyVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnyVertexColorBuffer);  
  gl.vertexAttribPointer(textureshaderProgram.vertexColorAttribute, skyboxnyVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxnyVertexIndexBuffer);   


  gl.activeTexture(gl.TEXTURE5);
  gl.bindTexture(gl.TEXTURE_2D, skynyTexture);
  gl.uniform1i(textureshaderProgram.textureUniform, 5);
  setMatrixUniforms(textureshaderProgram);   // pass the modelview mattrix and projection matrix to the shader 

  gl.drawElements(gl.TRIANGLES, skyboxnyVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  // PZ

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpzVertexPositionBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexPositionAttribute, skyboxpzVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpzVertexNormalBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexNormalAttribute, skyboxpzVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpzVertexTextureCoordBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexTexCoordsAttribute, skyboxpzVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxpzVertexColorBuffer);  
  gl.vertexAttribPointer(textureshaderProgram.vertexColorAttribute, skyboxpzVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxpzVertexIndexBuffer);   


  gl.activeTexture(gl.TEXTURE6);
  gl.bindTexture(gl.TEXTURE_2D, skypzTexture);
  gl.uniform1i(textureshaderProgram.textureUniform, 6);
  setMatrixUniforms(textureshaderProgram);   // pass the modelview mattrix and projection matrix to the shader 

  gl.drawElements(gl.TRIANGLES, skyboxpzVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  // NZ

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnzVertexPositionBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexPositionAttribute, skyboxnzVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnzVertexNormalBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexNormalAttribute, skyboxnzVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnzVertexTextureCoordBuffer);
  gl.vertexAttribPointer(textureshaderProgram.vertexTexCoordsAttribute, skyboxnzVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyboxnzVertexColorBuffer);  
  gl.vertexAttribPointer(textureshaderProgram.vertexColorAttribute, skyboxnzVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyboxnzVertexIndexBuffer);   


  gl.activeTexture(gl.TEXTURE7);
  gl.bindTexture(gl.TEXTURE_2D, skynzTexture);
  gl.uniform1i(textureshaderProgram.textureUniform, 7);
  setMatrixUniforms(textureshaderProgram);   // pass the modelview matrix and projection matrix to the shader 

  gl.drawElements(gl.TRIANGLES, skyboxnzVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

///////////////////////////////////////////////////////////////

var lastMouseX = 0, lastMouseY = 0;

///////////////////////////////////////////////////////////////

function onDocumentMouseDown( event ) {
  if (!event.target || event.target.id !== "code03-canvas") {
    return;
  }
  event.preventDefault();
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'mouseup', onDocumentMouseUp, false );
  document.addEventListener( 'mouseout', onDocumentMouseOut, false );
  var mouseX = event.clientX;
  var mouseY = event.clientY;

  lastMouseX = mouseX;
  lastMouseY = mouseY; 
}

function onDocumentMouseMove( event ) {
  var mouseX = event.clientX;
  var mouseY = event.clientY;

  var diffX = mouseX - lastMouseX;
  var diffY = mouseY - lastMouseY;

  X_angle = diffX/5;
  Z_angle = diffY/5;

  if(control_type==1) {
    mat4.rotate(rMatrix, degToRad(X_angle), [0,1,0]);
    mat4.rotate(rMatrix, degToRad(Z_angle), [1,0,0]);
  }
  else if(control_type==2) {
    mat4.rotateY(model, degToRad(X_angle));
    mat4.rotateX(model, degToRad(Z_angle));
  }
  else if(control_type==4) {
    mat4.rotate(rMatrix, degToRad(X_angle), [0,0,1]);
    mat4.rotate(rMatrix, degToRad(Z_angle), [1,0,0]);
  }

  lastMouseX = mouseX;
  lastMouseY = mouseY;

  drawScene();
}

function onDocumentMouseUp( event ) {
  document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
  document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
  document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function onDocumentMouseOut( event ) {
  document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
  document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
  document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function onKeyDown(event) {
  switch(event.keyCode) {
    case 83:
      if(control_type==1) { mat4.scale( rMatrix, [1.05, 1.05, 1.05]); }
      else if(control_type==2) { mat4.scale( model, [1.05, 1.05, 1.05]); }
      break;
    case 68:
      if(control_type==1) { mat4.scale( rMatrix, [.95, .95, .95]); }
      else if(control_type==2) { mat4.scale( model, [.95, .95, .95]); }
      break;
  }
  drawScene();
}

///////////////////////////////////////////////////////////////

function webGLStart() {
  var canvas = document.getElementById("code03-canvas");
  initGL(canvas);
  if (!gl) {
    return;
  }
  if (!initShaders()) {
    return;
  }

  gl.enable(gl.DEPTH_TEST);

  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
  shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
  gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
  shaderProgram.vertexTexCoordsAttribute = gl.getAttribLocation(shaderProgram, "aVertexTexCoords");
  gl.enableVertexAttribArray(shaderProgram.vertexTexCoordsAttribute); 
  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

  phongshaderProgram.vertexPositionAttribute = gl.getAttribLocation(phongshaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(phongshaderProgram.vertexPositionAttribute);
  phongshaderProgram.vertexNormalAttribute = gl.getAttribLocation(phongshaderProgram, "aVertexNormal");
  gl.enableVertexAttribArray(phongshaderProgram.vertexNormalAttribute);
  phongshaderProgram.vertexTexCoordsAttribute = gl.getAttribLocation(phongshaderProgram, "aVertexTexCoords");
  gl.enableVertexAttribArray(phongshaderProgram.vertexTexCoordsAttribute); 
  phongshaderProgram.vertexColorAttribute = gl.getAttribLocation(phongshaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(phongshaderProgram.vertexColorAttribute);

  textureshaderProgram.vertexPositionAttribute = gl.getAttribLocation(textureshaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(textureshaderProgram.vertexPositionAttribute);
  textureshaderProgram.vertexNormalAttribute = gl.getAttribLocation(textureshaderProgram, "aVertexNormal");
  gl.enableVertexAttribArray(textureshaderProgram.vertexNormalAttribute);
  textureshaderProgram.vertexTexCoordsAttribute = gl.getAttribLocation(textureshaderProgram, "aVertexTexCoords");
  gl.enableVertexAttribArray(textureshaderProgram.vertexTexCoordsAttribute); 
  textureshaderProgram.vertexColorAttribute = gl.getAttribLocation(textureshaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(textureshaderProgram.vertexColorAttribute);

  shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");
  shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
  shaderProgram.v2wMatrixUniform = gl.getUniformLocation(shaderProgram, "uV2WMatrix");
  shaderProgram.light_posUniform = gl.getUniformLocation(shaderProgram, "light_pos");
  shaderProgram.ambient_coefUniform = gl.getUniformLocation(shaderProgram, "ambient_coef");
  shaderProgram.diffuse_coefUniform = gl.getUniformLocation(shaderProgram, "diffuse_coef");
  shaderProgram.specular_coefUniform = gl.getUniformLocation(shaderProgram, "specular_coef");
  shaderProgram.shininess_coefUniform = gl.getUniformLocation(shaderProgram, "mat_shininess");
  shaderProgram.light_ambientUniform = gl.getUniformLocation(shaderProgram, "light_ambient");
  shaderProgram.light_diffuseUniform = gl.getUniformLocation(shaderProgram, "light_diffuse");
  shaderProgram.light_specularUniform = gl.getUniformLocation(shaderProgram, "light_specular");

  phongshaderProgram.mMatrixUniform = gl.getUniformLocation(phongshaderProgram, "uMMatrix");
  phongshaderProgram.vMatrixUniform = gl.getUniformLocation(phongshaderProgram, "uVMatrix");
  phongshaderProgram.pMatrixUniform = gl.getUniformLocation(phongshaderProgram, "uPMatrix");
  phongshaderProgram.nMatrixUniform = gl.getUniformLocation(phongshaderProgram, "uNMatrix");
  phongshaderProgram.v2wMatrixUniform = gl.getUniformLocation(phongshaderProgram, "uV2WMatrix"); 

  textureshaderProgram.mMatrixUniform = gl.getUniformLocation(textureshaderProgram, "uMMatrix");
  textureshaderProgram.vMatrixUniform = gl.getUniformLocation(textureshaderProgram, "uVMatrix");
  textureshaderProgram.pMatrixUniform = gl.getUniformLocation(textureshaderProgram, "uPMatrix");
  textureshaderProgram.nMatrixUniform = gl.getUniformLocation(textureshaderProgram, "uNMatrix");
  textureshaderProgram.v2wMatrixUniform = gl.getUniformLocation(textureshaderProgram, "uV2WMatrix");
  textureshaderProgram.light_posUniform = gl.getUniformLocation(textureshaderProgram, "light_pos");
  textureshaderProgram.ambient_coefUniform = gl.getUniformLocation(textureshaderProgram, "ambient_coef");
  textureshaderProgram.diffuse_coefUniform = gl.getUniformLocation(textureshaderProgram, "diffuse_coef");
  textureshaderProgram.specular_coefUniform = gl.getUniformLocation(textureshaderProgram, "specular_coef");
  textureshaderProgram.shininess_coefUniform = gl.getUniformLocation(textureshaderProgram, "mat_shininess");
  textureshaderProgram.light_ambientUniform = gl.getUniformLocation(textureshaderProgram, "light_ambient");
  textureshaderProgram.light_diffuseUniform = gl.getUniformLocation(textureshaderProgram, "light_diffuse");
  textureshaderProgram.light_specularUniform = gl.getUniformLocation(textureshaderProgram, "light_specular");

  phongshaderProgram.light_posUniform = gl.getUniformLocation(phongshaderProgram, "light_pos");
  phongshaderProgram.ambient_coefUniform = gl.getUniformLocation(phongshaderProgram, "ambient_coef"); 
  phongshaderProgram.diffuse_coefUniform = gl.getUniformLocation(phongshaderProgram, "diffuse_coef");
  phongshaderProgram.specular_coefUniform = gl.getUniformLocation(phongshaderProgram, "specular_coef");
  phongshaderProgram.shininess_coefUniform = gl.getUniformLocation(phongshaderProgram, "mat_shininess");

  phongshaderProgram.light_ambientUniform = gl.getUniformLocation(phongshaderProgram, "light_ambient"); 
  phongshaderProgram.light_diffuseUniform = gl.getUniformLocation(phongshaderProgram, "light_diffuse");
  phongshaderProgram.light_specularUniform = gl.getUniformLocation(phongshaderProgram, "light_specular"); 

  textureshaderProgram.textureUniform = gl.getUniformLocation(textureshaderProgram, "myTexture");
  shaderProgram.cube_map_textureUniform = gl.getUniformLocation(shaderProgram, "cubeMap");  
  
  initModels();

  initSkybox();
  initSkyBoxTextures();

  initTeapotJSON();
  initTextures();
  initCubeMap();

  mat4.identity(mMatrix); 
  mat4.identity(rMatrix);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  document.addEventListener('mousedown', onDocumentMouseDown, false); 
  document.addEventListener('keydown', onKeyDown, false);

  centerofInterest = [0, 0, 0];
  viewUp = [0, 1, 0];
  X_angle = 0;
  Z_angle = 0;

  drawScene();
}

function ResetCamera() {
  cameraPos = DEFAULT_CAMERA_POS.slice();
  drawScene();
}

function ResetLight() {
  light_pos = DEFAULT_LIGHT_POS.slice();
  drawScene();
}

function ResetCenterOfInterest() {
  centerofInterest = DEFAULT_CENTER_OF_INTEREST.slice();
  drawScene();
}

// Push the current light intensities back into the sliders, so the UI cannot
// keep showing stale positions after the scene is reset.
function syncIntensitySliders() {
  var groups = [['ambient', light_ambient], ['diffuse', light_diffuse], ['specular', light_specular]];
  var channels = ['r', 'g', 'b'];
  for (var i = 0; i < groups.length; i++) {
    for (var c = 0; c < channels.length; c++) {
      var slider = document.getElementById(groups[i][0] + '-' + channels[c]);
      if (slider) { slider.value = Math.round(groups[i][1][c] * 100); }
    }
  }
}

function CameraPosition( value ) {
  switch(value){
    case 1:
      vec3.add(cameraPos, [ 0, 1, 0]);
      break;
    case 2:
      vec3.add(cameraPos, [ 0, -1, 0]);
      break;
    case 3:
      vec3.add(cameraPos, [-1, 0, 0]);
      break;
    case 4:
      vec3.add(cameraPos, [1, 0, 0]);
      break;
    case 5:
      vec3.add(cameraPos, [0, 0, -1]);
      break;
    case 6:
      vec3.add(cameraPos, [0, 0, 1]);
      break;
  }
  drawScene();
}

function AmbientIntensity( r, g ,b) {
  if(r>=0){ light_ambient[0] = r/100.00; }
  else if(g>=0){ light_ambient[1] = g/100.00; }
  else if(b>=0){ light_ambient[2] = b/100.00; }
  drawScene();
}

function DiffuseIntensity( r, g, b) {
  if(r>=0){ light_diffuse[0] = r/100.00; }
  else if(g>=0){ light_diffuse[1] = g/100.00; }
  else if(b>=0){ light_diffuse[2] = b/100.00; }
  drawScene();
}

function SpecularIntensity( r, g, b) {
  if(r>=0){ light_specular[0] = r/100.00; }
  else if(g>=0){ light_specular[1] = g/100.00; }
  else if(b>=0){ light_specular[2] = b/100.00; }
  drawScene();
}

function LightPosition( value ) {
  switch(value){
    case 1:
      vec3.add(light_pos, [ 0, 1, 0]);
      break;
    case 2:
      vec3.add(light_pos, [ 0, -1, 0]);
      break;
    case 3:
      vec3.add(light_pos, [-1, 0, 0]);
      break;
    case 4:
      vec3.add(light_pos, [1, 0, 0]);
      break;
    case 5:
      vec3.add(light_pos, [0, 0, 1]);
      break;
    case 6:
      vec3.add(light_pos, [0, 0, -1]);
      break;
  }
  drawScene();
}

function Control( value ) {
  control_type = value;
  drawScene();
}

function CenterOfInterest( value ) {
  switch(value){
    case 1:
      vec3.add(centerofInterest, [0, 1, 0]);
      break;
    case 2:
      vec3.add(centerofInterest, [0, -1, 0]);
      break;
    case 3:
      vec3.add(centerofInterest, [-1, 0, 0]);
      break;
    case 4:
      vec3.add(centerofInterest, [1, 0, 0]);
      break;
    case 5:
      vec3.add(centerofInterest, [0, 0, 1]);
      break;
    case 6:
      vec3.add(centerofInterest, [0, 0, -1]);
      break;
  }
  drawScene();
}

function BG(red, green, blue) {
    show_skybox = false;
    gl.clearColor(red, green, blue, 1.0);
    drawScene();
}

function BGSkybox() {
    show_skybox = true;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    drawScene();
} 

function redraw() {
  cameraPos = DEFAULT_CAMERA_POS.slice();
  centerofInterest = DEFAULT_CENTER_OF_INTEREST.slice();
  viewUp = DEFAULT_VIEW_UP.slice();
  light_pos = DEFAULT_LIGHT_POS.slice();
  light_ambient = DEFAULT_LIGHT_AMBIENT.slice();
  light_diffuse = DEFAULT_LIGHT_DIFFUSE.slice();
  light_specular = DEFAULT_LIGHT_SPECULAR.slice();
  X_angle = 0;
  Z_angle = 0;
  draw_type = DEFAULT_DRAW_TYPE;
  use_texture = DEFAULT_USE_TEXTURE;
  control_type = DEFAULT_CONTROL_TYPE;
  show_skybox = true;

  mat4.identity(rMatrix);

  initModels();
  syncIntensitySliders();
  drawScene();
}

function geometry(type) {

    draw_type = type;
    drawScene();
}

function texture(value) {
    use_texture = value;
    show_skybox = true;
    drawScene();
} 
