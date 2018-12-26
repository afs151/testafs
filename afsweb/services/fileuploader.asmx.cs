using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

namespace afsweb.services
{
    /// <summary>
    /// Summary description for fileuploader
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class fileuploader : System.Web.Services.WebService
    {
        [WebMethod(Description = "Upload Files", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string UploadCargaFile()
        {

            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            System.Web.HttpPostedFile file = System.Web.HttpContext.Current.Request.Files[0];

            long ticks = DateTime.UtcNow.Ticks - DateTime.Parse("01/01/1970 00:00:00").Ticks;
            ticks /= 10000000;
            string timestamp = ticks.ToString() + DateTime.Now.Millisecond;
            string targetFilePath = file.FileName.Split('.')[0] + timestamp + "." + file.FileName.Split('.')[1];
            file.SaveAs(Server.MapPath(@"..\archivosmonitor\temporal\" + targetFilePath));

            var sessionFiles = Session["sessionCargaFiles"];
            if (sessionFiles == null)
                Session.Add("sessionCargaFiles", targetFilePath);
            else
                Session["sessionCargaFiles"] = targetFilePath;

            return "true";
        }
    }
}
