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
    /// Summary description for administracion
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class administracion : System.Web.Services.WebService
    {

        [WebMethod(Description = "Load rep pedimentos generales Seguridad", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string repoperaciones(string fechaini, string fechafin)
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

            string tsql = string.Format(@"SELECT 
 cb_trafico.sCveTrafico referencia
,cb_trafico.sNumPedimento pedimento
,DATE_FORMAT(cb_trafico.dFechaCruce, '%d/%m/%Y') fechacruce
,cu_cliente.sRazonSocial cliente
,cb_trafico.eTipoOperacion tipooperacion
,0 gastosmex
,0 gastosame
,0 gastosmexglobal
,0 gastosameglobal
FROM cb_trafico
LEFT Join cu_cliente on cu_cliente.sCveCliente=cb_trafico.sCveCliente
WHERE DATE(cb_trafico.dFechaCruce) BETWEEN DATE('{0}') AND DATE('{1}')
AND cb_trafico.sNumPatente=1632
and cb_trafico.sCveAduana=240
and cb_trafico.sNumPedimento <> ''
order by dFechaCruce;", fechaini, fechafin);

            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.TXT;
            sqlService.cnnName = core.extendsql.ConnectionNames.global;
            sqlService.dbType = core.extendsql.dbTypes.MySql;
            sqlService.sqltxt = tsql;
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@fini", fechaini));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@ffin", fechafin));

            DataTable ds = new DataTable();
            ds = sqlService.GetAsyncDataTableMethod();

            foreach (DataRow dr in ds.Rows)
            {
                string referencia = dr["referencia"].ToString();
                if (referencia != "")
                {
                    core.extendsql sqlServiceitn = new core.extendsql();
                    sqlServiceitn.cmdType = core.extendsql.CommandTypes.SP;
                    sqlServiceitn.cnnName = core.extendsql.ConnectionNames.local;
                    sqlServiceitn.dbType = core.extendsql.dbTypes.SQLServer;
                    sqlServiceitn.sqltxt = "AFSWEB_SPS_GASTOSBYREF";
                    sqlServiceitn.RequestParameters.Add(new core.extendsql.rspt("@REF", referencia));
                    var dtresult = sqlServiceitn.GetAsyncDataTableMethod();
                    if (dtresult.Rows.Count > 0)
                    {
                        dr["gastosmex"] = dtresult.Rows[0]["summex"];
                        dr["gastosame"] = dtresult.Rows[0]["sumame"];
                    }
                    core.extendsql sqlServiceglobal = new core.extendsql();
                    sqlServiceglobal.cmdType = core.extendsql.CommandTypes.TXT;
                    sqlServiceglobal.cnnName = core.extendsql.ConnectionNames.global;
                    sqlServiceglobal.dbType = core.extendsql.dbTypes.MySql;
                    sqlServiceglobal.sqltxt = string.Format(@"SELECT 
    IFNULL(SUM(CASE WHEN ct_servicios.eTipoServicio='MX' THEN cb_servicios_trafico.iImporte END),0) as summex,
    IFNULL(SUM(CASE WHEN ct_servicios.eTipoServicio='US' THEN cb_servicios_trafico.iImporte END),0) as sumame
from cb_servicios_trafico
left join ct_servicios on ct_servicios.iConsecutivo=cb_servicios_trafico.iConsecutivoServicio
where cb_servicios_trafico.sCveTrafico='{0}'", referencia);
                    var dtresultglobal = sqlServiceglobal.GetAsyncDataTableMethod();
                    if (dtresultglobal.Rows.Count > 0)
                    {
                        dr["gastosmexglobal"] = dtresultglobal.Rows[0]["summex"];
                        dr["gastosameglobal"] = dtresultglobal.Rows[0]["sumame"];
                    }
                }
            }

            return JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);

        }

        [WebMethod(Description = "Get acumulated expences", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string GetGastosGlobal(string scvetrafico)
        {

            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            string jsonText = "";
            core.extendsql sqlService = new core.extendsql();
            sqlService.cnnName = core.extendsql.ConnectionNames.global;
            sqlService.cmdType = core.extendsql.CommandTypes.TXT;
            sqlService.dbType = core.extendsql.dbTypes.MySql;
            sqlService.sqltxt = string.Format(@"select 
 cb_servicios_trafico.sCveTrafico
,ct_servicios.sDescripcion
,ct_servicios.eTipoServicio
,cb_servicios_trafico.iImporte
from cb_servicios_trafico
left join ct_servicios on ct_servicios.iConsecutivo=cb_servicios_trafico.iConsecutivoServicio
where cb_servicios_trafico.sCveTrafico='{0}'
order by ct_servicios.eTipoServicio desc, ct_servicios.sDescripcion;", scvetrafico);
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@cvetrafico", scvetrafico));
            DataTable ds = new DataTable();
            ds = sqlService.GetAsyncDataTableMethod();

            jsonText = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);
            return jsonText;
        }
        [WebMethod(Description = "Get acumulated expences", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string syncgastos(string scvetrafico)
        {

            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");


            System.Web.Security.FormsIdentity identity = (System.Web.Security.FormsIdentity)Context.User.Identity;
            string userData = identity.Ticket.UserData;
            string[] data = userData.Split(",".ToCharArray());

            core.extendsql sqlService = new core.extendsql();
            sqlService.cnnName = core.extendsql.ConnectionNames.global;
            sqlService.cmdType = core.extendsql.CommandTypes.TXT;
            sqlService.dbType = core.extendsql.dbTypes.MySql;
            sqlService.sqltxt = string.Format(@"select 
 cb_servicios_trafico.sCveTrafico
,ct_servicios.sDescripcion
,ct_servicios.eTipoServicio
,cb_servicios_trafico.iImporte
from cb_servicios_trafico
left join ct_servicios on ct_servicios.iConsecutivo=cb_servicios_trafico.iConsecutivoServicio
where cb_servicios_trafico.sCveTrafico='{0}'
order by ct_servicios.eTipoServicio desc, ct_servicios.sDescripcion;", scvetrafico);
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@cvetrafico", scvetrafico));
            DataTable ds = new DataTable();
            ds = sqlService.GetAsyncDataTableMethod();

            foreach (DataRow dr in ds.Rows)
            {
                string referencia = dr["sCveTrafico"].ToString();
                string sDescripcion = dr["sDescripcion"].ToString();
                string eTipoServicio = dr["eTipoServicio"].ToString();
                string iImporte = dr["iImporte"].ToString();
                if (referencia != "")
                {
                    core.extendsql sqlServiceitn = new core.extendsql();
                    sqlServiceitn.cmdType = core.extendsql.CommandTypes.SP;
                    sqlServiceitn.cnnName = core.extendsql.ConnectionNames.local;
                    sqlServiceitn.dbType = core.extendsql.dbTypes.SQLServer;
                    sqlServiceitn.sqltxt = @"AFSWEB_SPI_GASTOSREFSYNC";
                    sqlServiceitn.RequestParameters.Add(new core.extendsql.rspt("@opgref", referencia));
                    sqlServiceitn.RequestParameters.Add(new core.extendsql.rspt("@opgdescgasto", sDescripcion));
                    sqlServiceitn.RequestParameters.Add(new core.extendsql.rspt("@opgtipogastodesc", eTipoServicio));
                    sqlServiceitn.RequestParameters.Add(new core.extendsql.rspt("@opgmontogasto", iImporte));
                    sqlServiceitn.RequestParameters.Add(new core.extendsql.rspt("@opgusuario", data[2]));
                    sqlServiceitn.ExecuteAsync();
                }
            }

            return "";
        }
        [WebMethod(Description = "Get detailed expences", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string GetGastosLocal(string scvetrafico)
        {

            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            string jsonText = "";
            core.extendsql sqlService = new core.extendsql();
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.sqltxt = @"AFSWEB_SPS_GASTOSDETBYREF";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@REF", scvetrafico));
            DataTable ds = new DataTable();
            ds = sqlService.GetAsyncDataTableMethod();

            jsonText = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);
            return jsonText;
        }
        [WebMethod(Description = "Get acumulated expences", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string GetCatGastos(int tipogasto)
        {

            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            string jsonText = "";
            core.extendsql sqlService = new core.extendsql();
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.sqltxt = @"AFSWEB_SPS_CATGASTOS";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@TIPOGASTO", tipogasto));
            DataTable ds = new DataTable();
            ds = sqlService.GetAsyncDataTableMethod();

            jsonText = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);
            return jsonText;
        }
        [WebMethod(Description = "Get detailed expences", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string GetDetGastos(int tipogasto)
        {

            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            string jsonText = "";
            core.extendsql sqlService = new core.extendsql();
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.sqltxt = @"AFSWEB_SPS_CATGASTOS";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@TIPOGASTO", tipogasto));
            DataTable ds = new DataTable();
            ds = sqlService.GetAsyncDataTableMethod();

            jsonText = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);
            return jsonText;
        }
        [WebMethod(Description = "Set New Gasto", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string setgasto(string opgref, int opgconceptoid, int opgtipogasto, string opgmontogasto)
        {

            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            System.Web.Security.FormsIdentity identity = (System.Web.Security.FormsIdentity)Context.User.Identity;
            string userData = identity.Ticket.UserData;
            string[] data = userData.Split(",".ToCharArray());

            core.extendsql sqlService = new core.extendsql();
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.sqltxt = @"AFSWEB_SPI_GASTOSREF";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@opgref", opgref));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@opgconceptoid", opgconceptoid));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@opgtipogasto", opgtipogasto));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@opgmontogasto", opgmontogasto));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@opgusuario", data[2]));
            sqlService.ExecuteAsync();
            return "";
        }
        [WebMethod(Description = "Set New Gasto", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string setrelno(string opgref)
        {

            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            System.Web.Security.FormsIdentity identity = (System.Web.Security.FormsIdentity)Context.User.Identity;
            string userData = identity.Ticket.UserData;
            string[] data = userData.Split(",".ToCharArray());

            core.extendsql sqlService = new core.extendsql();
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.sqltxt = @"AFSWEB_SPU_GASTOSRELNO";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@REF", opgref));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@USER", data[2]));
            sqlService.ExecuteAsync();
            return "";
        }
    }
}
