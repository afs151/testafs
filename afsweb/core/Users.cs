using System;
using System.Collections.Generic;
using System.Web;
using System.Data.SqlClient;
using Newtonsoft.Json;
using System.Data;
using System.Web.UI.WebControls;

namespace core
{
    public class Users
    {
        private string connectionstring = System.Configuration.ConfigurationManager.ConnectionStrings["local"].ConnectionString;
        public Users() { }
        public bool AddUser(int userciaid, string username, string userpassword, string userfname, string userlname, string useremail, string userphone, string userext, string oficina)
        {
            // This function will add a user to our database

            // First create a new Guid for the user. This will be unique for each user
            Guid userGuid = System.Guid.NewGuid();

            // Hash the password together with our unique userGuid
            string hashedPassword = Security.HashSHA1(userpassword);

            SqlConnection con = new SqlConnection(connectionstring);
            using (SqlCommand cmd = new SqlCommand(@"INSERT INTO [catusers]([userciaid],[username],[userpassword],[userguid],[userfname]
                                                                ,[userlname],[useremail],[userphone],[userext]) 
                                                                VALUES (@userciaid, @username, @userpassword, @userguid, @userfname, @userlname
                                                                        ,@useremail, @userphone, @userext)", con))
            {
                cmd.Parameters.AddWithValue("@userciaid", userciaid);
                cmd.Parameters.AddWithValue("@username", username);
                cmd.Parameters.AddWithValue("@userpassword", hashedPassword);
                cmd.Parameters.AddWithValue("@userguid", userGuid);
                cmd.Parameters.AddWithValue("@userfname", userfname);
                cmd.Parameters.AddWithValue("@userlname", userlname);
                cmd.Parameters.AddWithValue("@useremail", useremail);
                cmd.Parameters.AddWithValue("@userphone", userphone);
                cmd.Parameters.AddWithValue("@userext", userext);
                cmd.Parameters.AddWithValue("@useroffice", oficina);

                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
            }
            return true;
        }
        public string passreset(int uid, string Password)
        {
            Guid userGuid = System.Guid.NewGuid();
            string hashedPassword = Security.HashSHA1(Password);
            string tsql = "update catusers set userpassword=@password,userguid=@userguid where userid=@uid;";

            extendsql sqlService = new extendsql();
            sqlService.cmdType = extendsql.CommandTypes.TXT;
            sqlService.cnnName = extendsql.ConnectionNames.local;
            sqlService.sqltxt = tsql;
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@password", hashedPassword));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@userguid", userGuid));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@uid", uid));
            sqlService.ExecuteAsync();
            return "{'msg':'Cambio realizado exitosamente'";
        }

        public autuser getuser(string username, string password)
        {
            autuser newuser = new autuser();

            SqlConnection con = new SqlConnection(connectionstring);
            using (SqlCommand cmd = new SqlCommand(@"SELECT * FROM [catusers] WHERE username=@username AND isblocked=0", con))
            {
                cmd.Parameters.AddWithValue("@username", username);
                con.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    string userpassword = Convert.ToString(dr["userpassword"]);
                    string userguid = Convert.ToString(dr["userguid"]);
                    string hashedPassword = Security.HashSHA1(password);
                    if (userpassword == hashedPassword)
                    {
                        newuser.userid = Convert.ToInt16(dr["userid"]);
                        newuser.userciaid = Convert.ToInt16(dr["userciaid"]);
                        newuser.username = Convert.ToString(dr["username"]);
                        newuser.userfname = Convert.ToString(dr["userfname"]);
                        newuser.userlname = Convert.ToString(dr["userlname"]);
                        newuser.useremail = Convert.ToString(dr["useremail"]);
                        newuser.userphone = Convert.ToString(dr["userphone"]);
                        newuser.userext = Convert.ToString(dr["userext"]);
                    }
                }
                con.Close();
            }
            return newuser;
        }
        public bool LogUser(int uid, string uip, string comments = "")
        {
            SqlConnection con = new SqlConnection(connectionstring);
            using (SqlCommand cmd = new SqlCommand("INSERT INTO [userlogins](loginuid,loginuip,loginnotes) VALUES (@loginuid,@loginuip,@loginnotes)", con))
            {
                cmd.Parameters.AddWithValue("@loginuid", uid);
                cmd.Parameters.AddWithValue("@loginuip", uip); // store the hashed value
                cmd.Parameters.AddWithValue("@loginnotes", comments);

                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
            }
            return true;
        }
        public class autuser
        {
            public int userid { get; set; }
            public int userciaid { get; set; }
            public string username { get; set; }
            public string userpassword { get; set; }
            public string userguid { get; set; }
            public string userfname { get; set; }
            public string userlname { get; set; }
            public string useremail { get; set; }
            public string userphone { get; set; }
            public string userext { get; set; }
            public autuser() { }
            public override string ToString()
            {
                string userdefinition = userid.ToString() + "," + username + "," + userguid;
                return userdefinition;
            }
        }

    }

}