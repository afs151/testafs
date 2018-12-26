using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Newtonsoft.Json;
using System.Data;
using System.Web.Script.Serialization;

namespace afsweb.services
{
    /// <summary>
    /// Summary description for ChatService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
   [System.Web.Script.Services.ScriptService]
    public class ChatService : System.Web.Services.WebService
    {

        [WebMethod(Description = "Get Last Messajes from user", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string GetFullMessages(int userout, int uid)
        {

            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            string jsonText = "";
            core.extendsql sqlService = new core.extendsql();
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.sqltxt = @"AFSWEB_SPS_LOADFULLCHATMSG";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@userin", uid));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@userout", userout));
            DataTable ds = new DataTable();
            ds = sqlService.GetAsyncDataTableMethod();

            core.SimpleAES enc = new core.SimpleAES();
            foreach (DataRow rw in ds.Rows)
            {
                if (rw["msgisprotected"].ToString() == "True")
                    rw["msgtext"] = enc.DecryptString(rw["msgtext"].ToString());
            }
            jsonText = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);
            return jsonText;
        }

        [WebMethod(Description = "Get Last Messajes from user", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string GetLastMessages(int userout, int uid)
        {

            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            string jsonText = "[{\"Rows\": 0}]";
            core.extendsql sqlService = new core.extendsql();
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.sqltxt = @"AFSWEB_SPS_LOADNEWCHATMSG";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@userin", uid));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@userout", userout));
            DataTable ds = new DataTable();
            ds = sqlService.GetAsyncDataTableMethod();
            core.SimpleAES enc = new core.SimpleAES();
            foreach (DataRow rw in ds.Rows)
            {
                if (rw["msgisprotected"].ToString() == "True")
                    rw["msgtext"] = enc.DecryptString(rw["msgtext"].ToString());
            }
            jsonText = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);

            return jsonText;

        }

        [WebMethod(Description = "save Last Messajes from user", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string SaveMessage(int userout, string msgtxt, int uid)
        {

            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");


            core.SimpleAES enc = new core.SimpleAES();
            string ecriptedmsg = enc.EncryptToString(msgtxt);

            string jsonText = "[{\"Rows\": 0}]";
            core.extendsql sqlService = new core.extendsql();
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.sqltxt = @"AFSWEB_SPI_SAVENEWCHATMSG";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@usersend", uid));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@userrecive", userout));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@msgtext", ecriptedmsg));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@isprotected", 1));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@pass", ""));
            DataTable ds = new DataTable();
            ds = sqlService.GetAsyncDataTableMethod();
            jsonText = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);


            string to = ds.Rows[0]["USERNAME"].ToString();

            Boolean sendmail = true;

            DateTime currsession = DateTime.UtcNow;
            var start = Session["currenttimemsg"];
            if (start == null)
                Session["currenttimemsg"] = DateTime.UtcNow;
            else
                currsession = DateTime.Parse(Session["currenttimemsg"].ToString());


            if (sendmail)
            {
                if (to.Length > 0)
                {
                    string subject = "AFS DASHBOARD AVISOS - Nuevo mensaje de " + Session["uname"];
                    string boddy = "Ha recibido un nuevo mensaje de " + Session["uname"];
                    boddy += "<br />";
                    boddy += "<br />";
                    boddy += "Para ver sus mensajes completos ir a Chat Interno";
                    boddy += "<br />";
                    boddy += "<br />";
                    boddy += "Avisos de Dashboard, este es un correo automatizado, favor de no reesponder...";
                    boddy += "<br />";
                    boddy += "<br />";
                    boddy += "Si desea dejar de recibir estos avisos favor de notificarle al <a href='mailto:leonel.gonzalez@afsforwarding.com.com' target='_self' >administrador del sistema</a>";
                    core.emailhandler.SendMailMessage(to, subject, boddy, Context.IsDebuggingEnabled);
                }
            }
            else
                Session["currenttimemsg"] = null;

            return jsonText;

        }

        [WebMethod(Description = "Get Last Messajes from user", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string GetUnReadMessages(int uid)
        {

            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            string jsonText = "[{\"Rows\": 0}]";
            core.extendsql sqlService = new core.extendsql();
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.sqltxt = @"AFSWEB_SPS_NOTIFYNEWMSG";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@userid", uid));
            DataTable ds = new DataTable();
            ds = sqlService.GetAsyncDataTableMethod();
            core.SimpleAES enc = new core.SimpleAES();
            foreach (DataRow rw in ds.Rows)
            {
                rw["msgtext"] = enc.DecryptString(rw["msgtext"].ToString());
            }
            jsonText = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);

            return jsonText;

        }
    }
}
