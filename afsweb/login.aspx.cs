using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;


namespace afsweb
{
    public partial class login : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //core.Users uid = new core.Users();
            //uid.passreset(0, "Afs10205");
            //bool result = false; // uid.AddUser(1, "admin1", "admin1", "ADMINISTRATOR", "GONZALEZ", "SYSADMIN@AFSFORWARDING.COM", "(867)1234536", "215", "LDO");


            Session.RemoveAll();


        }

        protected void btnLogin_Click()
        {
            int userId = 0;// SMIWeb.cls.Users.GetUserIdByUsernameAndPassword(username, password);
            if (userId > 0)
            {
                // Now you can put users id in a session-variable or what you prefer
                // and redirect the user to the protected area of your website.
                //lblLoginResult.Text = string.Format("You are userId : {0}", userId);
            }
            else
            {
                //lblLoginResult.Text = "Wrong username or password";ja
            }
        }
    }
}