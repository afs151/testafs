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
    /// Summary description for reportes
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class reportes : System.Web.Services.WebService
    {

        [WebMethod(Description = "Carga reporte de proramacion", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string getrepprogramacion(string fechaini, string fechafin)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.dbType = core.extendsql.dbTypes.SQLServer;
            sqlService.sqltxt = "AFSWEB_SPS_GETREPORTEPROGRAMACION";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@fini", fechaini));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@ffin", fechafin));

            var ds = sqlService.GetAsyncDataTableMethod();
            var jsonText = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);
            return jsonText;

        }
        
    }
}
