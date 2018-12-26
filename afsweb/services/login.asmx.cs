using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI.WebControls;
using System.Web.Security;
using Newtonsoft.Json;
using System.Data;

namespace afsweb.services
{
    /// <summary>
    /// Summary description for login
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class login : System.Web.Services.WebService
    {

        [WebMethod(Description = "login de acceso", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string validateuser(string uid, string pwd)
        {
            Session.RemoveAll();
            var auser = new core.Users.autuser();
            var clsuid = new core.Users();
            string returnjson = "";
            auser = clsuid.getuser(uid, pwd);
            if (auser.userid > 0)
            {
                string userdata = auser.userid + "," + auser.userid + "," + auser.userfname + " " + auser.userlname;
                FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1, auser.userfname, DateTime.Now, DateTime.Now.AddMinutes(60), true, userdata, FormsAuthentication.FormsCookiePath);
                string hashCookies = FormsAuthentication.Encrypt(ticket);
                HttpCookie cookie = new HttpCookie(FormsAuthentication.FormsCookieName, hashCookies);
                Context.Response.Cookies.Add(cookie);
                returnjson = JsonConvert.SerializeObject(auser, Newtonsoft.Json.Formatting.Indented);
            }
            else
                throw new Exception(string.Format("User or password incorrect"));
            

            return returnjson;
        }
        [WebMethod(Description = "login de acceso", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string resetuserpassword(int userid, string newpassword)
        {

            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            var auser = new core.Users.autuser();
            var clsuid = new core.Users();
            clsuid.passreset(userid, newpassword);
            
            return "Password actualizado exitosamente";
        }
    }
}
