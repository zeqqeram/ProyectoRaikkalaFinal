
class CaminanteB {
  constructor(cadena) {
    this.cadena = cadena;
    this.cantPasos = 350;
    this.paso = 1;
    this.cualCurva = 0;
    this.prevX = 0;
    this.prevY = -1;
    this.cantTrazos = 9;
    this.porciones = 400;
    this.cualP = 0;
    this.xa = 0;
    this.ya = 0;
    this.xd = 0;
    this.yd = 0;
    this.tengoCuatro = false;
    this.tam = 80;
    this.marronH = random(31, 55);
    this.marronS = random(23, 45);
    this.marronB = random(23, 43);
    this.indice = Math.floor(random(0, 4));
    this.trazo = trazos[this.indice];
  }


  dibujar() {
    if (this.cualCurva < this.cadena.length) {
      const c = this.cadena[this.cualCurva];
      const pos = this.paso / this.cantPasos;

      this.tam = c.grosor;

      let pX = bezierPoint(c.x1, c.x2, c.x3, c.x4, pos);
      let pY = bezierPoint(c.y1, c.y2, c.y3, c.y4, pos);

      const dx = pX - this.prevX;
      const dy = pY - this.prevY;

      if (dx !== 0) {
        this.dir = dy / dx;
      }

      if (this.prevX >= 0) {
        this.cualP = (this.cualP + 1) % this.porciones;
        const anchoNorm = 1.0 / this.porciones;

        const u1 = map(this.cualP, 0, this.porciones, 0, 1);
        const v1 = 0;

        const u2 = u1 + anchoNorm;
        const v2 = 0;

        const u3 = u2;
        const v3 = 1;

        const u4 = u1;
        const v4 = 1;

        const ang = radians(-90) + this.dir;
        const xb = this.tam * cos(ang) + this.prevX;
        const yb = this.tam * sin(ang) + this.prevY;

        const ang2 = radians(90) + this.dir;
        const xc = this.tam * cos(ang2) + this.prevX;
        const yc = this.tam * sin(ang2) + this.prevY;

        if (pX > width || pX < 0) {
          this.tengoCuatro = false;
          this.cualP = 0;
        }

        if (pX > width + 10) {
          pX = 0;
        }

        if (this.tengoCuatro) {
          push();
          colorMode(HSB, 255, 100, 100, 255);
          this.matize = c.matiz
          tint(this.matize, c.saturacion, c.luminosidad, c.alfie);
          noStroke();
          beginShape();
          textureMode(NORMAL);
          texture(this.trazo);
          vertex(this.xa, this.ya, u1, v1);
          vertex(xb, yb, u2, v2);
          vertex(xc, yc, u4, v4);
          vertex(this.xd, this.yd, u3, v3);
          endShape();
          pop();
        }
        this.xa = xb;
        this.ya = yb;
        this.xd = xc;
        this.yd = yc;
        this.tengoCuatro = true;

      }
      this.prevX = pX;
      this.prevY = pY;
    }
  }

  avanzar() {
    this.cualP++;
    if (this.cualP >= this.porciones) {
      this.cualP = 0;
    }
    this.paso++;
    if (this.paso > this.cantPasos) {
      this.paso = 0;
      this.cualCurva++;
    }
  }

  caminaste() {
    if ((this.paso / this.cantPasos) < this.cantPasos) {
      this.yaCamine = false;
    }

    if (!this.yaCamine) {
      this.dibujar();
      this.avanzar();
    }
  }

  listo() {
    return this.llegue = this.prevX >= width
  }

  dibujarMarron() {
    if (this.cualCurva < this.cadena.length) {
      const c = this.cadena[this.cualCurva];
      const pos = this.paso / this.cantPasos;

      this.tam = 30;

      let pX = bezierPoint(c.x1, c.x2, c.x3, c.x4, pos);
      let pY = bezierPoint(c.y1, c.y2, c.y3, c.y4, pos);

      const dx = pX - this.prevX;
      const dy = pY - this.prevY;

      if (dx !== 0) {
        this.dir = dy / dx;
      }

      if (this.prevX >= 0) {
        this.cualP = (this.cualP + 1) % this.porciones;
        const anchoNorm = 1.0 / this.porciones;

        const u1 = map(this.cualP, 0, this.porciones, 0, 1);
        const v1 = 0;

        const u2 = u1 + anchoNorm;
        const v2 = 0;

        const u3 = u2;
        const v3 = 1;

        const u4 = u1;
        const v4 = 1;

        const ang = radians(-90) + this.dir;
        const xb = this.tam * cos(ang) + this.prevX;
        const yb = this.tam * sin(ang) + this.prevY;

        const ang2 = radians(90) + this.dir;
        const xc = this.tam * cos(ang2) + this.prevX;
        const yc = this.tam * sin(ang2) + this.prevY;

        if (pX > width || pX < 0) {
          this.tengoCuatro = false;
          this.cualP = 0;
        }

        if (pX > width + 10) {
          pX = 0;
        }

        if (this.tengoCuatro) {
          push();
          colorMode(HSB, 255, 100, 100, 255);
          tint(this.marronH, this.marronS, this.marronB, 100);
          noStroke();
          beginShape();
          textureMode(NORMAL);
          texture(this.trazo);
          vertex(this.xa, this.ya, u1, v1);
          vertex(xb, yb, u2, v2);
          vertex(xc, yc, u4, v4);
          vertex(this.xd, this.yd, u3, v3);
          endShape();
          pop();
        }

        this.xa = xb;
        this.ya = yb;
        this.xd = xc;
        this.yd = yc;
        this.tengoCuatro = true;

      }
      this.prevX = pX;
      this.prevY = pY;
    }
  }


  reiniciarCaminante() {
    this.cantPasos = 250;
    this.paso = 1;
    this.cualCurva = 0;
    this.prevX = 0;
    this.prevY = -1;
    this.cantTrazos = 9;
    this.porciones = 180;
    this.cualP = 0;
    this.xa = 0;
    this.ya = 0;
    this.xd = 0;
    this.yd = 0;
    this.tengoCuatro = false;
    this.tam = 80;
    this.marronH = random(31, 55);
    this.marronS = random(23, 45);
    this.marronB = random(23, 43);
    this.indice = Math.floor(random(0, 2));
    this.trazo = trazos[this.indice];
  }

}