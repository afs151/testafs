using System;
using System.Collections.Generic;
using System.Text;
using System.Net.Mail;
using System.IO;
using System.Net;


namespace core
{
    class emailhandler
    {



        private static char[] charSeparators = new char[] { };
        private static String[] result;
        private static string syspath = System.Configuration.ConfigurationManager.AppSettings["syspath"];
        private static string sLogFormat = DateTime.Now.ToShortDateString().ToString() + " " + DateTime.Now.ToLongTimeString().ToString() + " ==> ";

        public static void SendMailMessage(string to, string subject, string message, bool debug, bool adminOnly = false, string attfile = "", bool islog = false)
        {
            try
            {
                string cc = "";
                cc = System.Configuration.ConfigurationManager.AppSettings["Email.CC"];


                MailMessage mailMsg = new MailMessage();

                result = to.Split(charSeparators, StringSplitOptions.RemoveEmptyEntries);
                for (int count = 0; count < result.Length; count++)
                {
                    if (REGEXMATCH(result[count]))
                    {
                        mailMsg.To.Add(new MailAddress(result[count]));
                        Console.WriteLine("To: " + result[count]);
                    }
                }

                if (cc != null)
                {
                    result = cc.Split(charSeparators, StringSplitOptions.RemoveEmptyEntries);
                    for (int count = 0; count < result.Length; count++)
                    { if (REGEXMATCH(result[count])) { mailMsg.CC.Add(new MailAddress(result[count])); } }
                }


                if (debug || adminOnly)
                {
                    Console.WriteLine("Running @t DEBUG MODE CLEAR TO RECIPIENTS");
                    mailMsg.To.Clear();
                    Console.WriteLine("Running @t DEBUG MODE CLEAR CC RECIPIENTS");
                    mailMsg.CC.Clear();
                    Console.WriteLine("Running @t DEBUG MODE ADDING TO DEBUG RECIPIENT : " + System.Configuration.ConfigurationManager.AppSettings["Email.To.Debug"]);
                    mailMsg.To.Add(System.Configuration.ConfigurationManager.AppSettings["Email.To.Debug"]);
                }

                mailMsg.Subject = subject;
                mailMsg.Body = message.Replace("*", "<br />");
                if (debug)
                {
                    mailMsg.Subject = mailMsg.Subject + " DEBUG MODE";
                    mailMsg.Body = mailMsg.Body + "<br /><br />-------------- INTERNAL NOTE: @t DEBUGGING MODE----------------------------";
                }

                mailMsg.IsBodyHtml = true;

                if (attfile.Length > 0)
                    mailMsg.Attachments.Add(new Attachment(attfile));

                SmtpClient smtpMail = new SmtpClient();
                smtpMail.Send(mailMsg);

            }
            catch (SmtpException exc)
            {
                string msg = exc.Message;
                Console.WriteLine(sLogFormat + "Faltal Error(E-Mail V3) : " + msg);
                Console.ReadKey();
            }
        }
        private static bool REGEXMATCH(string address)
        {
            System.Text.RegularExpressions.Regex r = new System.Text.RegularExpressions.Regex(@"[a-zA-Z0-9_\-\.]+@[a-zA-Z0-9_\-\.]+\.[a-zA-Z]{2,5}");
            System.Text.RegularExpressions.Match m = r.Match(address);
            return m.Success;
        }
    }
}
