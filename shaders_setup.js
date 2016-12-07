
function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


function initShaders() {

    shaderProgram = gl.createProgram();
    phongshaderProgram = gl.createProgram();
    textureshaderProgram = gl.createProgram();

    var phongfragmentShader = getShader(gl, "phong-shader-fs");
    var fragmentShader = getShader(gl, "shader-fs");
    var texturefragmentShader = getShader(gl, "texture-shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.attachShader(phongshaderProgram, vertexShader);
    gl.attachShader(phongshaderProgram, phongfragmentShader);
    gl.attachShader(textureshaderProgram, vertexShader);
    gl.attachShader(textureshaderProgram, texturefragmentShader);
    gl.linkProgram(shaderProgram);
    gl.linkProgram(phongshaderProgram);
    gl.linkProgram(textureshaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
        if (!gl.getProgramParameter(phongshaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
        if (!gl.getProgramParameter(textureshaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

}

