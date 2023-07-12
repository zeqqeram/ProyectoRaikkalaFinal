let dibujada;
let arrCurva;

class Guia {
    constructor() {
        this.arrCurva = [[], [], [], []];
    }

    //para obtener las listas separadas 
    dameUnaLista(index) {
        return this.arrCurva[index];
    }

    actualizar() {
        // sacamos promedio amplitud
        this.sumatoriaAmp = 0;
        for (let i = 0; i < listaAmp.length; i++) {
            this.numeroListaA = listaAmp[i];
            this.sumatoriaAmp += this.numeroListaA;
        }
        if (this.sumatoriaAmp != 0) {
            this.ampProm = this.sumatoriaAmp / listaAmp.length;
        }

        // sacamos promedio frecuencia
        this.sumatoriaFrec = 0;
        for (let i = 0; i < listaFreq.length; i++) {
            this.numeroListaF = listaFreq[i];
            this.sumatoriaFrec += this.numeroListaF;
        }
        if (this.sumatoriaFrec != 0) {
            this.frecuProm = this.sumatoriaFrec / listaFreq.length;
        }

        //sacamos promedio diferencia de pitch 
        this.sumatoriaDif = 0;
        for (let i = 0; i < listaDif.length; i++) {
            this.numeroListaD = listaDif[i];
            this.sumatoriaDif += this.numeroListaD;
        }
        if (this.sumatoriaDif != 0) {
            this.difProm = this.sumatoriaDif / listaDif.length;
        }
    }

    dibujar() {
        if (this.ampProm != NaN && this.frecuProm != NaN && this.difProm != NaN) {

            //asignamos valores segun los promedios recibidos
            if (this.ampProm < ampMedia) {
                this.ampliUsada = random(10, 50);
            } else {
                this.ampliUsada = random(70, 90);
            }

            if (this.frecuProm > freqMedia) {
                this.blancoU = random(30, 60);//30 60 80 100
                this.negroU = random(80, 100);
            } else {
                this.blancoU = random(80, 100);
                this.negroU = random(30, 60);
            }

            if (this.difProm > 2) {
                this.alfieU = random(170,190);
            } else {
                this.alfieU = random(80,100);
            }
            if (!finale) {
                if (Array.isArray(this.arrCurva) && this.arrCurva.length > 0) {//compruebo que el array se haya inicializado bien
                    let encontreUna = false;
                    //i es para filas, j es para columnas
                    for (let i = 0; i < 70 && !encontreUna; i++) { //posicion dentro de la lista 
                        let encontreFila = false;
                        for (let j = 0; j < this.arrCurva.length; j++) { //recorre las 3 listas 
                            const fila = this.arrCurva[j]; //define las filas

                            if (!fila[i]) { //si el lugar i de una lista esta vacio..
                                fila[i] = new Curva(this.blancoU, this.negroU, this.ampliUsada, this.alfieU); //agrega al fin en ese lugar vacio
                                if (j === 0) {
                                    trabajo1 = true;
                                    marronTrabaja = true;
                                } else if (j === 1) {
                                    trabajo2 = true;
                                } else if (j === 2) {
                                    trabajo3 = true;
                                } else if (j === 3) {
                                    trabajo4 = true;
                                }

                                fila[i].dibujar(); //se dibuja la curva que agregamos recien
                                encontreUna = true;
                                encontreFila = true;
                                break; //corto el for interno (el de j) para que no agregue curvas de mas
                            }
                        }
                        if (encontreFila) {
                            break; //corto el for externo(el de i) pq ya agregue una curva y si no salgo es un loop
                        }
                    }
                }
            }
        }
    }
}