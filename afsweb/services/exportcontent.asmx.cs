using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

namespace afsweb.services
{
    /// <summary>
    /// Summary description for exportcontent
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class exportcontent : System.Web.Services.WebService
    {

        [WebMethod(Description = "Excel Export")]
        [System.Web.Script.Services.ScriptMethod()]
        public void ExcelExport()
        {
            string formValue = "";
            if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request.Form["content"]))
            {
                formValue = System.Web.HttpContext.Current.Request.Form["content"];
            }

            formValue = formValue.Replace("<Cell ss:StyleID=\"xls-style-0\"><Data ss:Type=\"String\">&lt;a href=&quot;", "<Cell ss:StyleID=\"xls-style-1\" ss:HRef=\"");
            formValue = formValue.Replace("<Cell ss:StyleID=\"xls-style-1\"><Data ss:Type=\"String\">&lt;a href=&quot;", "<Cell ss:StyleID=\"xls-style-1\" ss:HRef=\"");
            formValue = formValue.Replace("<Cell ss:StyleID=\"xls-style-2\"><Data ss:Type=\"String\">&lt;a href=&quot;", "<Cell ss:StyleID=\"xls-style-1\" ss:HRef=\"");
            formValue = formValue.Replace("<Cell ss:StyleID=\"xls-style-3\"><Data ss:Type=\"String\">&lt;a href=&quot;", "<Cell ss:StyleID=\"xls-style-1\" ss:HRef=\"");
            formValue = formValue.Replace("<Cell ss:StyleID=\"xls-style-4\"><Data ss:Type=\"String\">&lt;a href=&quot;", "<Cell ss:StyleID=\"xls-style-1\" ss:HRef=\"");
            formValue = formValue.Replace("<Cell ss:StyleID=\"xls-style-5\"><Data ss:Type=\"String\">&lt;a href=&quot;", "<Cell ss:StyleID=\"xls-style-1\" ss:HRef=\"");
            formValue = formValue.Replace("<Cell ss:StyleID=\"xls-style-6\"><Data ss:Type=\"String\">&lt;a href=&quot;", "<Cell ss:StyleID=\"xls-style-1\" ss:HRef=\"");
            formValue = formValue.Replace("<Cell ss:StyleID=\"xls-style-7\"><Data ss:Type=\"String\">&lt;a href=&quot;", "<Cell ss:StyleID=\"xls-style-1\" ss:HRef=\"");
            formValue = formValue.Replace("<Cell ss:StyleID=\"xls-style-8\"><Data ss:Type=\"String\">&lt;a href=&quot;", "<Cell ss:StyleID=\"xls-style-1\" ss:HRef=\"");
            formValue = formValue.Replace("<Cell ss:StyleID=\"xls-style-9\"><Data ss:Type=\"String\">&lt;a href=&quot;", "<Cell ss:StyleID=\"xls-style-1\" ss:HRef=\"");
            formValue = formValue.Replace("<Cell ss:StyleID=\"xls-style-10\"><Data ss:Type=\"String\">&lt;a href=&quot;", "<Cell ss:StyleID=\"xls-style-1\" ss:HRef=\"");
            formValue = formValue.Replace("<Cell ss:StyleID=\"xls-style-11\"><Data ss:Type=\"String\">&lt;a href=&quot;", "<Cell ss:StyleID=\"xls-style-1\" ss:HRef=\"");
            formValue = formValue.Replace("<Cell ss:StyleID=\"xls-style-12\"><Data ss:Type=\"String\">&lt;a href=&quot;", "<Cell ss:StyleID=\"xls-style-1\" ss:HRef=\"");
            formValue = formValue.Replace("&quot;&gt;Ir a visor&lt;/a&gt;</Data></Cell>", "\"><Data ss:Type=\"String\">Visor de Documentos</Data></Cell>");
            formValue = formValue.Replace("&quot;", "\"");
            formValue = formValue.Replace("&lt;", "<");
            /* Agregado - JOSE OLIVAS - Monitor Facturacion */
            formValue = formValue.Replace("&quot;&gt;Ver Gastos&lt;/a&gt;</Data></Cell>", "\"><Data ss:Type=\"String\">Visor de Gastos</Data></Cell>");
            formValue = formValue.Replace("><Data ss:Type=\"String\">Visor de Documentos", "/>Visor de Documentos");
            formValue = formValue.Replace("><Data ss:Type=\"String\">Visor de Gastos", "/>Visor de Gastos");
            /* Agregado - JOSE OLIVAS - Monitor Facturacion */


            long ticks = DateTime.UtcNow.Ticks - DateTime.Parse("01/01/1970 00:00:00").Ticks;
            ticks /= 10000000;
            string timestamp = ticks.ToString() + DateTime.Now.Millisecond;

            System.Web.HttpContext.Current.Response.ContentType = "application/vnd.ms-excel";
            //// Remove the charset from the Content-Type header.
            System.Web.HttpContext.Current.Response.Charset = "";
            //// Write the HTML back to the browser.
            System.Web.HttpContext.Current.Response.Write(formValue);
            System.Web.HttpContext.Current.Response.AddHeader("Content-Disposition", "attachment; filename=" + string.Format("DashExcel{0}.xls", timestamp) + ";");
            //// End the response.
            System.Web.HttpContext.Current.Response.End();
        }
    }
}
