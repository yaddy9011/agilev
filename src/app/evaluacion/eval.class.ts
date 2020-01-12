import { TasksService } from '../services/tasks.service';
import { obj } from '../clases/obj';
import { Rop } from '../clases/rop';
import { EvalResulService } from '../services/eval-resul.service';

export class Evaluacion {

    idst: string;
    _idEval: String;
    ArrayPrac = [];
    Arrayobj: obj[];
    objs: obj[];
    Rop: Rop[];
    ArrayRelacion = [];
    DatosObj = [];
    arrROP = [];
    AgilidadTotal = 0;


    constructor(private taskService: TasksService,
        public IdEval: String,
        private EvalResulService: EvalResulService) {
        this.idst = localStorage.getItem("ACCESS_IDS");
        this._idEval = IdEval;
    }

    getPracticasbyEval() {
        var prac_v = []
        this.taskService.getPracticasbyEval(this._idEval)
            .subscribe(pa => {
                for (var i = 0; i < pa.length; i++) {
                    const arraData = {
                        _id: pa[i]._id,
                        n_prac: Number(Object.values(pa[i].id_prac)[3]),
                        textprac: Object.values(pa[i].id_prac)[1],
                        nivelapli: pa[i].nivelapli,
                        id_usr: pa[i].id_usr,
                        id_eval: pa[i].id_eval,
                        id_prac: pa[i].id_prac
                    };
                    prac_v[i] = arraData;
                }
            });
        this.ArrayPrac = prac_v;
    }

    getObjetivosByUSR() {
        this.getPracticasbyEval();
        var array_new_obj = [];
        this.taskService.getobj(this.idst)
            .subscribe(obj => {
                this.Arrayobj = obj;
                this.Arrayobj.sort((a, b) => a.pos - b.pos);
                for (var i = 0; i < this.Arrayobj.length; i++) {
                    const arraData = {
                        _id: obj[i]._id,
                        objetivo: Object.values(obj[i].id_obj)[1],
                        id_usr: obj[i].id_usr,
                        id_obj: Object.values(obj[i].id_obj)[0],
                        pos: obj[i].pos,
                        num: Object.values(obj[i].id_obj)[2],
                        n_obj: Object.values(obj[i].id_obj)[3]
                    };
                    array_new_obj.push(arraData);
                }
                this.objs = array_new_obj;
                this.getEvaluacionPorcentajes();
            });
    }

    getEvaluacionPorcentajes() {
        this.taskService.getrop()
            .subscribe(v => {
                var y = [];
                for (let elemento of v) {
                    y.push(elemento);
                }
                this.Rop = y;
                let TotalAgilidadObjetivos: number = 0;
                for (var i = 0; i < this.objs.length; i++) {
                    var n_obj = this.objs[i].n_obj;
                    var var_obj = this.objs[i].objetivo;
                    var xnum = this.objs[i].num;
                    this.BuscarRelacionOP(n_obj);
                    var rsum = this.SumarTotales();

                    for (let elemento of this.ArrayRelacion) {
                        let n_a;
                        switch (elemento.na) {
                            case 0: {
                                break;
                            }
                            case 1: {
                                n_a = "Muy Bajo";
                                break;
                            }
                            case 2: {
                                n_a = "Bajo";
                                break;
                            }
                            case 3: {
                                n_a = "Medio";
                                break;
                            }
                            case 4: {
                                n_a = "Alto";
                                break;
                            }
                            case 5: {
                                n_a = "Muy alto";
                                break;
                            }
                            default: {
                                break;
                            }
                        }

                        const CadenaFinal = {
                            n_obj: n_obj,
                            n_prac: elemento.n_prac,
                            n_c: elemento.nivel_contribucion,
                            n_a: n_a,
                            texp: elemento.textprac
                        };
                        this.arrROP.push(CadenaFinal);
                    }
                    const datosnew = {
                        n_obj: n_obj,
                        objetivo: var_obj,
                        num: xnum,
                        total_Eva: rsum + " %"
                    };
                    TotalAgilidadObjetivos = TotalAgilidadObjetivos + rsum;
                    this.DatosObj.push(datosnew);
                }


                this.AgilidadTotal = Math.round(TotalAgilidadObjetivos / this.DatosObj.length);


                this.EvalResulService.DataEvalObjetivos(this.DatosObj);
                this.EvalResulService.DataEvalPracticas(this.arrROP);
                this.EvalResulService.DataAgilidad(this.AgilidadTotal);
                //this._global.ResultEval = this.DatosObj;
                // console.log(this.arrROP);
                //console.log(this.DatosObj);
            });
    }

    BuscarRelacionOP(n_obj: Number) {
        var t = [];
        for (var i = 0; i < this.Rop.length; i++) {
            var ob = this.Rop[i].n_obj;
            if (ob == n_obj) {

                var nc = this.Rop[i].nivel_contribucion;
                var pa = this.Rop[i].n_prac;
                let arrdp = this.BuscarNA(pa);
                if (arrdp.nivelapli != 0) {
                    const datosnew = {
                        n_obj: ob,
                        n_prac: pa,
                        nivel_contribucion: nc,
                        na: arrdp.nivelapli,
                        textprac: arrdp.textprac
                    };
                    t.push(datosnew);
                }

                // console.log(ob);
                // console.log(pa);
                // console.log(nc);
                // console.log(arrdp.nivelapli);
                // console.log("---");
            }
        }
        this.ArrayRelacion = t;
    }

    BuscarNA(prac: Number) {
        var res;
        for (var i = 0; i < this.ArrayPrac.length; i++) {
            if (prac == Number(this.ArrayPrac[i].n_prac)) {
                let DatosPrac = {
                    nivelapli: Number(this.ArrayPrac[i].nivelapli),
                    textprac: this.ArrayPrac[i].textprac
                }
                res = DatosPrac;
            }
        }
        return res;
    }

    SumarTotales() {

        let SumaNivelAplicacion: number = 0;
        let ResulTotal: number = 0;

        for (var j = 0; j < this.ArrayRelacion.length; j++) {

            var nc = Number(this.ArrayRelacion[j].nivel_contribucion);
            var PNCpo: number = 0;
            switch (nc) {
                case 1: {
                    PNCpo = 0.30;
                    break;
                }
                case 0.75: {
                    PNCpo = 0.20;
                    break;
                }
                case 0.50: {
                    PNCpo = 0.10;
                    break;
                }
                default: {
                    break;
                }
            }

            var na = Number(this.ArrayRelacion[j].na);
            var NewValNa = 0;
            switch (na) {
                case 0: {
                    break;
                }
                case 1: {
                    NewValNa = 0;
                    break;
                }
                case 2: {
                    NewValNa = 0.25;
                    break;
                }
                case 3: {
                    NewValNa = 0.50;
                    break;
                }
                case 4: {
                    NewValNa = 0.75;
                    break;
                }
                case 5: {
                    NewValNa = 1;
                    break;
                }
                default: {
                    break;
                }
            }

            let NAPr = NewValNa + (PNCpo * NewValNa);
            SumaNivelAplicacion = SumaNivelAplicacion + NAPr;
        }

        let porcentaje: number;
        if (SumaNivelAplicacion == 0) {
            porcentaje = 0;
        } else {
            porcentaje = Number(100 / (this.ArrayRelacion.length / SumaNivelAplicacion));
        }
        ResulTotal = Math.round(porcentaje);
        return ResulTotal;
    }

}