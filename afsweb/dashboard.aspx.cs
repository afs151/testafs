using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Security;

namespace afsweb
{
    public partial class dashboard : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
//            if (!Context.User.Identity.IsAuthenticated)
//            { Response.Redirect("login.aspx"); }


            //string sourcepage = Request.QueryString["ReturnUrl"];
            //if (sourcepage != null)
            //    Response.Redirect(sourcepage);


            //if (aduana > 1)
            //    Response.Redirect("dashboardim.aspx");

        }
    }
}