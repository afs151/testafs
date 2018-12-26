using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Newtonsoft.Json;
using System.Data;

namespace afsweb.services
{
    /// <summary>
    /// Summary description for reppedimentos
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class reppedimentos : System.Web.Services.WebService
    {

        [WebMethod(Description = "Load rep pedimentos pagados", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string reppedimentospagados(string fechaini, string fechafin, int tipo)
        {

            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            var cteid = Session["cteuid"];
            var cterfc = Session["cterfc"];

            if (Session["fechaini"] == null)
                Session["fechaini"] = DateTime.Now.ToString("yyyy-MM-dd");

            if (Session["fechafin"] == null)
                Session["fechafin"] = DateTime.Now.ToString("yyyy-MM-dd");

            if (fechaini == "")
                fechaini = Session["fechaini"].ToString();
            else
                Session["fechaini"] = fechaini;

            if (fechafin == "")
                fechafin = Session["fechafin"].ToString();
            else
                Session["fechafin"] = fechafin;

            if (tipo == 0)
                tipo = 2;

            string tsql = string.Format(@"SELECT C001ADUSEC, C001CVECLI,C001REFPED,
                            concat(C001PATEN,'-',C001NUMPED) as PEDIMENTO, C001NOMCLI,
                            if (C001TIPOPE=1,'IMPO','EXPO') as 'C001TIPOPE', C001CVEDOC,
                            C606NOMBRE,C606BANCO, N036TOTEFE, DATE_FORMAT(D036FECPAG,'%m-%d-%Y') as D036FECPAG
                            FROM AT001 P
                            LEFT JOIN AT036  B ON B.C036PATEN = P.C001PATEN AND B.C036ADUSEC = P.C001ADUSEC AND B.C036NUMPED = P.C001NUMPED
                            LEFT JOIN CAX606 N ON N.C606ID    = B.C036ID    AND N.C606ADUSEC = P.C001ADUSEC
                            WHERE D036FECPAG BETWEEN DATE('{0}') AND DATE('{1}')", fechaini, fechafin);
            if (tipo < 3)
                tsql += " AND C001TIPOPE=" + tipo;

            if (cterfc != null)
                tsql += " AND C001RFCCLI='" + cterfc + "'";


            tsql += " ORDER BY C001NUMPED,PEDIMENTO";

            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.TXT;
            sqlService.cnnName = core.extendsql.ConnectionNames.aduanet;
            sqlService.dbType = core.extendsql.dbTypes.MySql;
            sqlService.sqltxt = tsql;
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@fini", fechaini));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@ffin", fechafin));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@tipo", tipo));

            var ds = sqlService.GetAsyncDataTableMethod();
            var jsonText = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);
            return jsonText;

        }
        [WebMethod(Description = "Load rep pedimentos generales", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string reppedimentospagadosdesaduanados(string fechaini, string fechafin)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            var cteid = Session["cteuid"];
            var cterfc = Session["cterfc"];


            if (Session["fechaini"] == null)
                Session["fechaini"] = DateTime.Now.ToString("yyyy-MM-dd");

            if (Session["fechafin"] == null)
                Session["fechafin"] = DateTime.Now.ToString("yyyy-MM-dd");

            if (fechaini == "")
                fechaini = Session["fechaini"].ToString();
            else
                Session["fechaini"] = fechaini;

            if (fechafin == "")
                fechafin = Session["fechafin"].ToString();
            else
                Session["fechafin"] = fechafin;

            string tsql = string.Format(@"SELECT C001PATEN,C001ADUSEC,C001REFPED,C001NUMPED,C001TIPOPE,C001CVEDOC,C001TIPREG,C001DESORI,C001MEDTRS
            ,C001MEDTRA,C001MEDTRE,F001TOTFAC,F001VALCOE,F001VALDOL,F001TIPCAM,F001FACMEX,F001FACACT
            ,F001FACAJU,DATE_FORMAT(D001FECARR,'%m-%d-%Y') as D001FECARR,DATE_FORMAT(D001FECPAG,'%m-%d-%Y') as D001FECPAG
            ,DATE_FORMAT(D001FECEP,'%m-%d-%Y') as D001FECEP,DATE_FORMAT(D001FECEXT,'%m-%d-%Y') as D001FECEXT
            ,F001VALSEG,F001FLETES,F001SEGURO,F001EMBALA,F001OTRINC,N001TOTINC,N001VALADU,N001VALCOM
            ,C001MARNUM,F001PESO,C001NOMCLI,C001RFCCLI,I001SECFRA,I001TOTFRA,F001TASDT1
            ,F001TASDT2,F001TASREC,F001TASPRE,I001TTDTA1,I001TTDTA2,I001TTREC,I001TTPRE,L001REFREC,L001REFR1,'' FECHADES
            ,DATE_FORMAT(D001FECR1,'%m-%d-%Y') as D001FECR1
FROM AT001
WHERE D001FECPAG BETWEEN DATE('{0}') AND DATE('{1}')
AND C001PATEN=1632
AND (C001ADUSEC=240 OR C001ADUSEC=800)
AND C001FIRELE<>''
AND C001FIRBAN<>''
ORDER BY D001FECPAG DESC;", fechaini, fechafin);

            string jsonText = "";
            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.TXT;
            sqlService.cnnName = core.extendsql.ConnectionNames.aduanet;
            sqlService.dbType = core.extendsql.dbTypes.MySql;
            sqlService.sqltxt = tsql;

            DataTable ds = new DataTable();
            ds = sqlService.GetAsyncDataTableMethod();
            foreach (DataRow dr in ds.Rows)
            {
                string referencia = dr["C001REFPED"].ToString();
                string cvedoc = dr["C001CVEDOC"].ToString();
                if (cvedoc == "R1") {
                    dr["FECHADES"] = "RECTIFICACION";                
                }
                else
                {
                    if (referencia != "")
                    {
                        core.extendsql sqlServiceitn = new core.extendsql();
                        sqlServiceitn.cmdType = core.extendsql.CommandTypes.TXT;
                        sqlServiceitn.cnnName = core.extendsql.ConnectionNames.global;
                        sqlServiceitn.dbType = core.extendsql.dbTypes.MySql;
                        sqlServiceitn.sqltxt = string.Format(@"select dFecha from cb_eventos_trafico where scvetrafico='{0}' and iConsecutivoEvento=505", referencia);
                        sqlServiceitn.RequestParameters.Add(new core.extendsql.rspt("@REF", referencia));
                        var dtresult = sqlServiceitn.GetAsyncDataTableMethod();
                        if (dtresult.Rows.Count > 0)
                        {
                            dr["FECHADES"] = dtresult.Rows[0]["dFecha"];
                        }
                    }
                }
            }

            DataView dv = ds.DefaultView;
            dv.Sort = "FECHADES";
            DataTable sortedDT = dv.ToTable();

            jsonText = JsonConvert.SerializeObject(sortedDT, Newtonsoft.Json.Formatting.None);
            return jsonText;
        }

        [WebMethod(Description = "Load rep pedimentos generales", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string reppedimentogeneral(string fechaini, string fechafin, int tipo)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            var cteid = Session["cteuid"];
            var cterfc = Session["cterfc"];


            if (Session["fechaini"] == null)
                Session["fechaini"] = DateTime.Now.ToString("yyyy-MM-dd");

            if (Session["fechafin"] == null)
                Session["fechafin"] = DateTime.Now.ToString("yyyy-MM-dd");

            if (fechaini == "")
                fechaini = Session["fechaini"].ToString();
            else
                Session["fechaini"] = fechaini;

            if (fechafin == "")
                fechafin = Session["fechafin"].ToString();
            else
                Session["fechafin"] = fechafin;

            if (tipo == 0)
                tipo = 2;

            string tsql = string.Format(@"SELECT C001PATEN,C001ADUSEC,C001REFPED,C001NUMPED,if (C001TIPOPE=1,'IMPO','EXPO') as 'C001TIPOPE',C001CVEDOC,C001TIPREG,C001DESORI,C001MEDTRS
                                        ,C001MEDTRA,C001MEDTRE,F001TOTFAC,F001VALCOE,F001VALDOL,F001TIPCAM,F001FACMEX,F001FACACT
                                        ,F001FACAJU,DATE_FORMAT(D001FECARR,'%m-%d-%Y') as D001FECARR,DATE_FORMAT(D001FECPAG,'%m-%d-%Y') as D001FECPAG
                                        ,DATE_FORMAT(D001FECEP,'%m-%d-%Y') as D001FECEP,DATE_FORMAT(D001FECEXT,'%m-%d-%Y') as D001FECEXT
                                        ,F001VALSEG,F001FLETES,F001SEGURO,F001EMBALA,F001OTRINC,N001TOTINC,N001VALADU,N001VALCOM
                                        ,C001MARNUM,F001PESO,C001NOMCLI,C001RFCCLI,I001SECFRA,I001TOTFRA,F001TASDT1
                                        ,F001TASDT2,F001TASREC,F001TASPRE,I001TTDTA1,I001TTDTA2,I001TTREC,I001TTPRE,L001REFREC,L001REFR1
                                        ,DATE_FORMAT(D001FECR1,'%m-%d-%Y') as D001FECR1
                            FROM AT001
                            WHERE D001FECPAG BETWEEN DATE('{0}') AND DATE('{1}')", fechaini, fechafin, tipo);

            if (tipo < 3)
                tsql += " AND C001TIPOPE=" + tipo;

            if (cterfc != null)
                tsql += " AND C001RFCCLI='" + cterfc + "'";

            tsql += " ORDER BY C001NUMPED";

            string jsonText = "";
            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.TXT;
            sqlService.cnnName = core.extendsql.ConnectionNames.aduanet;
            sqlService.dbType = core.extendsql.dbTypes.MySql;
            sqlService.sqltxt = tsql;
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@fini", fechaini));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@ffin", fechafin));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@tipo", tipo));

            DataTable ds = new DataTable();
            ds = sqlService.GetAsyncDataTableMethod();

            jsonText = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);

            string ret = "{\"data\":" + JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented) + "}";

            return ret;

        }
        [WebMethod(Description = "Load rep pedimentos generales Seguridad", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string repanexo19(string fechaini, string fechafin)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            var cteid = Session["cteuid"];
            var cterfc = Session["cterfc"];


            if (Session["fechaini"] == null)
                Session["fechaini"] = DateTime.Now.ToString("yyyy-MM-dd");

            if (Session["fechafin"] == null)
                Session["fechafin"] = DateTime.Now.ToString("yyyy-MM-dd");

            if (fechaini == "")
                fechaini = Session["fechaini"].ToString();
            else
                Session["fechaini"] = fechaini;

            if (fechafin == "")
                fechafin = Session["fechafin"].ToString();
            else
                Session["fechafin"] = fechafin;

            string tsql = string.Format(@"SELECT DATE_FORMAT(D001FECARR,'%m-%d-%Y')  Fecha_Entrada
                                                ,C001CVEDOC Clave_Doc
                                                ,C001TIPOPE Tipo_OP
                                                ,C001NUMPED Pedimento
                                                ,C001RFCCLI RFC
                                                ,C016PAISCV Pais_Vendedor
                                                ,C016PAISOD Pais_Origen
                                                ,C001MEDTRA Medio_Transporte
                                                ,C016FRAC Fraccion
                                                ,C016UNIUMT UMT
                                                ,F016CANUMT Cantidad_UMT
                                                ,C016UNIUMC UMC
                                                ,F016CANUMC Cantidad_UMC
                                                ,N001VALADU Valor_Aduana
                                                ,F001FLETES Fletes
                                                ,F001SEGURO Seguros
                                                ,F001EMBALA Embalajes
                                                ,F001OTRINC Incrementables
                                                ,DATE_FORMAT(D001FECPAG ,'%m-%d-%Y') Fecha_Pago
                                                ,N001VALCOM Valor_Mercancia
                                                ,N016VALAGR Valor_Agregado
                                                ,C001PATEN Patente
                                                ,GROUP_CONCAT(distinct concat( C006IDECAS,',',C006IDE2CAS,',',C006IDE3CAS) SEPARATOR ' | ') Identificadores_General
                                                ,GROUP_CONCAT(distinct concat(C018IDENTI,',',C018FIRDES,',',F018VALDOL,',',F018CANUMT) SEPARATOR ' | ') Permisos
                                                ,GROUP_CONCAT(distinct concat(C019CVECAS,',',C019IDECAS,',',C019IDE2CAS,',',C019IDE3CAS) SEPARATOR ' | ') Identificadores_Partida
                                                ,(SELECT C023OBSERV FROM AT023 where C016SECFRA=C023SECFRA and C023FRAC=C016FRAC and C016REFPED=C023REFPED) Observaciones
                                                ,GROUP_CONCAT(distinct concat(C004NUMCON,',',C004TIPCON) SEPARATOR ' | ') Contenedor
                                                FROM AT001 A1
                                                LEFT JOIN AT016 A16 ON A1.C001REFPED=A16.C016REFPED
                                                LEFT JOIN AT006 A6 ON A1.C001REFPED=A6.C006REFPED
                                                LEFT JOIN AT004 A4 ON A4.C004REFPED=A1.C001REFPED
                                                LEFT JOIN AT018 A18 ON A16.C016REFPED=A18.C018REFPED AND A16.C016SECFRA=A18.C018SECFRA
                                                LEFT JOIN AT019 A19 ON A16.C016REFPED=A19.C019REFPED AND A16.C016SECFRA=A19.C019SECFRA
                                                WHERE D001FECPAG between date('{0}') and date('{1}')", fechaini, fechafin);

            tsql += @" GROUP BY C001NUMPED,C001ADUSEC,C001PATEN
                       ORDER BY C001NUMPED";

            string jsonText = "[{\"Rows\": 0}]";
            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.TXT;
            sqlService.cnnName = core.extendsql.ConnectionNames.aduanet;
            sqlService.dbType = core.extendsql.dbTypes.MySql;
            sqlService.sqltxt = tsql;
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@fini", fechaini));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@ffin", fechafin));

            DataTable ds = new DataTable();
            ds = sqlService.GetAsyncDataTableMethod();
            jsonText = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);

            string ret = "{\"data\":" + JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented) + "}";

            return ret;

        }
        [WebMethod(Description = "Load rep solicitus impuestos IM", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string repsolimpuestosim(string fechaini, string fechafin, int tipo)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            var cteid = Session["cteuid"];
            var cterfc = Session["cterfc"];
            if (Session["fechaini"] == null)
                Session["fechaini"] = DateTime.Now.ToString("yyyy-MM-dd");

            if (Session["fechafin"] == null)
                Session["fechafin"] = DateTime.Now.ToString("yyyy-MM-dd");

            if (fechaini == "")
                fechaini = Session["fechaini"].ToString();
            else
                Session["fechaini"] = fechaini;

            if (fechafin == "")
                fechafin = Session["fechafin"].ToString();
            else
                Session["fechafin"] = fechafin;

            if (tipo == 0)
                tipo = 2;

            string tsql = string.Format(@"select 
                                             AT001.C001CVECLI
                                            ,AT001.C001NOMCLI
                                            ,AT001.C001RFCCLI
                                            ,AT001.C001REFPED
	                                        ,case AT001.C001TIPOPE when 1 then 'IMPO' else 'EXPO' END AS C001TIPOPE
	                                        ,CONCAT(AT001.C001PATEN,'-',AT001.C001ADUSEC,'-',AT001.C001NUMPED) AS C001NUMPED 
	                                        ,ifnull(AT004.C004NUMCON,'') AS C004NUMCON
	                                        ,ifnull((SELECT SUM(N008IMPCON) FROM AT008 WHERE C008REFPED=C001REFPED AND C008CVEPAG=0),0) AS N008IMPCON
	                                        ,ifnull((SELECT SUM(N008IMPCON) FROM AT008 WHERE C008REFPED=C001REFPED AND C008CVEPAG>0),0) AS N008IMPCONFP
                                            ,DATE_FORMAT(AT001.D001FECPAG ,'%m-%d-%Y') AS D001FECPAG 
                                        from AT001
                                        left join AT004 on AT004.C004REFPED=AT001.C001REFPED 
                                        WHERE D001FECPAG BETWEEN DATE('{0}') AND DATE('{1}')
                                        AND C001FIRBAN='' 
                                        AND C001FIRELE=''", fechaini, fechafin);

            if (tipo < 3)
                tsql += " AND C001TIPOPE=" + tipo;

            if (cterfc != null)
                tsql += " AND C001RFCCLI='" + cterfc + "'";

            tsql += " ORDER BY D001FECPAG,C001ADUSEC,C001NUMPED";
            string jsonText = "[{\"Rows\": 0}]";
            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.TXT;
            sqlService.cnnName = core.extendsql.ConnectionNames.aduanet;
            sqlService.dbType = core.extendsql.dbTypes.MySql;
            sqlService.sqltxt = tsql;
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@fini", fechaini));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@ffin", fechafin));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@tipo", tipo));

            DataTable ds = new DataTable();
            ds = sqlService.GetAsyncDataTableMethod();

            jsonText = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);

            string ret = "{\"data\":" + JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented) + "}";

            return ret;

        }
        [WebMethod(Description = "Load rep traficos adelantados", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string reppedimentosrojor1(string fechaini, string fechafin, int tipo, int aduana)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            var cteid = Session["cteuid"];
            var cterfc = Session["cterfc"];

            if (Session["fechaini"] == null)
                Session["fechaini"] = DateTime.Now.ToString("yyyy-MM-dd");

            if (Session["fechafin"] == null)
                Session["fechafin"] = DateTime.Now.ToString("yyyy-MM-dd");

            if (fechaini == "")
                fechaini = Session["fechaini"].ToString();
            else
                Session["fechaini"] = fechaini;

            if (fechafin == "")
                fechafin = Session["fechafin"].ToString();
            else
                Session["fechafin"] = fechafin;

            string jsonText = "[{\"Rows\": 0}]";
            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.TXT;

            //sqlService.sqltxt = @"[smidashboard_sps_reprojosr1]";
            string tsql = string.Format(@"SELECT C001ADUSEC,C001PATEN,C001REFPED,C001NUMPED,L001REFR1,
                                            if (C001TIPOPE=1,'IMPO','EXPO') as 'C001TIPOPE', AT001.C001NOMCLI,AT001.C001RFCCLI,AT001.D001FECPAG 
                                            FROM AT001
                                            WHERE D001FECR1 BETWEEN DATE('{0}') AND DATE('{1}') AND L001REFR1='T'", fechaini, fechafin, tipo);

            if (tipo < 3)
                tsql += " AND C001TIPOPE=" + tipo;

            if (cterfc != null)
                tsql += " AND C001RFCCLI='" + cterfc + "'";


            tsql += " ORDER BY C001ADUSEC,C001NUMPED";

            sqlService.sqltxt = tsql;
            sqlService.cnnName = core.extendsql.ConnectionNames.aduanet;
            sqlService.dbType = core.extendsql.dbTypes.MySql;
            DataTable ds = new DataTable();
            ds = sqlService.GetAsyncDataTableMethod();
            jsonText = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);

            string ret = "{\"data\":" + JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented) + "}";

            return ret;

        }
    }
}
