using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Newtonsoft.Json;

namespace afsweb.services
{
    /// <summary>
    /// Summary description for common
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class common : System.Web.Services.WebService
    {
        [WebMethod(Description = "Carga listado de usuarios", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string loadusertable()
        {/*
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");
            */

            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.TXT;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.sqltxt = @"SELECT * FROM catusers
                                    WHERE ISBLOCKED=0 
                                    ORDER BY userfname, userlname";
            var jsonText = JsonConvert.SerializeObject(sqlService.GetAsyncDataTableMethod(), Newtonsoft.Json.Formatting.None);
            return jsonText;
        }
        [WebMethod(Description = "Carga listado de clientes", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string loadclientstable()
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");


            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.TXT;
            sqlService.cnnName = core.extendsql.ConnectionNames.global;
            sqlService.dbType = core.extendsql.dbTypes.MySql;
            sqlService.sqltxt = @"select sCveCliente,sRazonSocial from cu_cliente order by sRazonSocial";
            var jsonText = JsonConvert.SerializeObject(sqlService.GetAsyncDataTableMethod(), Newtonsoft.Json.Formatting.None);
            return jsonText;
        }
    }
}
