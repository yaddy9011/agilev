import { TasksService } from '../services/tasks.service';
import { EvalResulService } from '../services/eval-resul.service';

export class Evaluacion {

    idst: string;
    _idEval: String;

    constructor(private taskService: TasksService,
        public IdEval: String,
        private EvalResulService: EvalResulService) {
        this.idst = localStorage.getItem("ACCESS_IDS");
        this._idEval = IdEval;
    }

    GetDataEva() {

        const Data = {
            id_eval: this._idEval,
            id_usr: this.idst
        };

        this.taskService.GetDataEval(Data)
            .subscribe(evals => {

                let levels = evals.map((ev, i) => {

                    let nc = ev.relaop.nivel_contribucion;
                    let na = ev.prac.nivelapli;
                    let nc_title = "";
                    let na_title = "";
                    let na_new = 0;
                    let Premio: boolean
                    let PNCpo = 0;

                    switch (nc) {
                        case 0:
                            nc_title = "Muy Bajo";
                            PNCpo = 0;
                            break;
                        case 0.25:
                            nc_title = "Bajo";
                            PNCpo = 0;
                            break;
                        case 0.50:
                            nc_title = "Medio";
                            PNCpo = 0.10;
                            break;
                        case 0.75:
                            nc_title = "Alto";
                            PNCpo = 0.20;
                            break;
                        case 1:
                            nc_title = "Muy Alto";
                            PNCpo = 0.30;
                            break;
                    }

                    switch (na) {
                        case 0:
                            na_title = "No Aplica";
                            na_new = 0;
                            Premio = false;
                            break;
                        case 1:
                            na_title = "Muy Bajo";
                            na_new = 0;
                            Premio = true;
                            break;
                        case 2:
                            na_title = "Bajo";
                            na_new = 0.25;
                            Premio = true;
                            break;
                        case 3:
                            na_title = "Medio";
                            na_new = 0.50;
                            Premio = true;
                            break;
                        case 4:
                            na_title = "Alto";
                            na_new = 0.75;
                            Premio = false;
                            break;
                        case 5:
                            na_title = "Muy Alto";
                            na_new = 1;
                            Premio = false;
                            break;
                    }

                    const arraData = {
                        n_obj: Number(ev.n_obj),
                        n_prac: Number(ev.relaop.n_prac),
                        nc_t: nc_title,
                        nc: nc,
                        na_t: na_title,
                        na: na_new,
                        premio: Premio,
                        PNCpo: PNCpo
                    };
                    return arraData;
                });

                let newlv = levels.sort((a, b) => a.n_obj - b.n_obj);

                // console.log(newlv);

                const arrSuma = newlv.reduce((contador, objeto) => {
                    //console.log(objeto.n_obj + " " + objeto.na);
                    var new_na;
                    if (objeto.premio == true) {
                        new_na = objeto.na + (objeto.PNCpo * objeto.na);
                    } else {
                        new_na = objeto.na
                    }
                    contador[objeto.n_obj] = (contador[objeto.n_obj] || 0) + new_na;
                    return contador;
                }, {});

                // console.log(arrSuma);

                const TotalRop = levels.reduce((contador, objeto) => {
                    contador[objeto.n_obj] = (contador[objeto.n_obj] || 0) + 1;
                    return contador;
                }, {});

                var RelacionEval = evals.map(function (task, index, array) {
                    let PorcentajeEval = Math.round(Number(100 / (TotalRop[task.n_obj] / arrSuma[task.n_obj])));

                    // console.log(task.n_obj);
                    // console.log(TotalRop[task.n_obj]);
                    // console.log(arrSuma[task.n_obj]);
                    // console.log(PorcentajeEval);

                    const arraData = {
                        id_eval: task.prac.id_eval,
                        n_obj: task.n_obj,
                        n_prac: task.relaop.n_prac,
                        Descrip_prac: task.Datos_practicas.descripcion,
                        Descrip_obj: task.Datos_obj.descrip,
                        nc_t: levels[index].nc_t,
                        nc: levels[index].nc,
                        na_t: levels[index].na_t,
                        na: levels[index].na,
                        LaO: PorcentajeEval,
                        TexObj: task.n_obj + ": " + task.Datos_obj.descrip
                    };
                    return arraData;
                });

                console.log(RelacionEval);


                let sinRepetidos = RelacionEval.filter((valorActual, indiceActual, arreglo) => {
                    return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.n_obj) === JSON.stringify(valorActual.n_obj)) === indiceActual
                });

                var total = sinRepetidos.reduce(function (contador, current) {
                    contador = contador + current.LaO;
                    return contador;
                }, 0);

                var agility = Math.round(total / sinRepetidos.length);

                this.EvalResulService.DataEvalObjetivos(RelacionEval);
                this.EvalResulService.DataAgilidad(agility);

            });
    }



}