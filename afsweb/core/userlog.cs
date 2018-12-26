using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;

namespace core
{
    public class userlog
    {
        public userlog(int userid, string source)
        {
            insertlog(userid, source);
        }
        private void insertlog(int userid, string source)
        {
            var connectionstring = System.Configuration.ConfigurationManager.ConnectionStrings["internal"].ConnectionString;

            SqlConnection con = new SqlConnection(connectionstring);
            using (SqlCommand cmd = new SqlCommand("INSERT INTO userlog(loguserid,logsource)VALUES(@userid,@source)", con))
            {
                cmd.Parameters.AddWithValue("@userid", userid);
                cmd.Parameters.AddWithValue("@source", source); // store the hashed value
                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
            }
        }
    }
}