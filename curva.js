class Curva {
  constructor(pureza, luz, linea, alfa) {
    this.x1 = 0;
    this.y1 = random(height / 2);
    this.x4 = width + 30;
    this.y4 = random(height / 2);
    this.x2 = width / 2;
    this.y2 = 3 * height / 4;
    this.x3 = random(width);
    this.y3 = random(height / 2, height);
    this.matiz = random(117, 126);
    this.luminosidad = luz;
    this.saturacion = pureza;
    this.grosor = linea;
    this.alfie = alfa;
  }

  dibujar() {
    push();
    colorMode(HSB, 255, 100, 100);
    noStroke();
    noFill();
    bezier(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3, this.x4, this.y4);
    /*beginShape();
    vertex(this.x1, this.y1);
    bezierVertex(this.x2, this.y2, this.x3, this.y3, this.x4, this.y4);
    bezierVertex(this.x3, (this.y3 + this.grosor), this.x2, (this.y2 + this.grosor), this.x1, this.y1 + 40);
    endShape();*/
    pop();
  }
}

  