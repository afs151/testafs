using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data;

namespace afsweb.services
{
    /// <summary>
    /// Summary description for dashboard
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class dashboard : System.Web.Services.WebService
    {
        [WebMethod(Description = "Load Grid Programacion", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string loadgridprogramacion()
        {/*
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");
            */

            var cteid = Session["cteuid"];
            var jsonText = "";
            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.dbType = core.extendsql.dbTypes.SQLServer;
            var cmd = @"AFSWEB_SPS_GETPROGRAMACION";

            sqlService.sqltxt = cmd;

            System.Data.DataSet ds = new System.Data.DataSet();
            ds = sqlService.GetAsyncDataSetMethod();

            foreach (System.Data.DataTable dt in ds.Tables)
            {
                foreach (DataRow dr in dt.Rows)
                {
                    string referencia = dr["tpreferencia"].ToString();
                    string consremesa = dr["consremesa"].ToString();

                    if (referencia != "")
                    {
                        var txtcommand = "";
                        if (dr["consremesa"].ToString() == "0" || dr["consremesa"].ToString() == "")
                        {
                            txtcommand = string.Format(@"SELECT 
cu_cliente.sAlias 
,cu_cliente.sRazonSocial
,cb_contenedores_trafico.sNumeroCajaTrailer vehiculo
,cu_transfer.snombre transfer
,cu_transfer.snumerocaat
,cu_linea_transportista_mexicana.snombre
,cb_trafico.scveaduana
,cb_trafico.etipooperacion
,cb_trafico.scvetrafico
,cb_trafico.scvedocumento
,cb_trafico.snumpedimento
,cb_detalle_orden_carga.iconsecutivoordencarga
,REPLACE(REPLACE(REPLACE(cb_trafico.smarcas,'S/M S/N', ''),'S/N',''),' ','')smarcas
FROM CB_TRAFICO 
LEFT JOIN CU_CLIENTE ON CU_CLIENTE.SCVECLIENTE=CB_TRAFICO.SCVECLIENTE
LEFT JOIN CU_TRANSFER ON CU_TRANSFER.SCVETRANSFER=CB_TRAFICO.SCVETRANSFER
LEFT JOIN CU_LINEA_TRANSPORTISTA_MEXICANA ON CU_LINEA_TRANSPORTISTA_MEXICANA.SCVETRANSPORTISTA=CB_TRAFICO.SCVETRANSPORTISTAMEXICANO
left join cb_detalle_orden_carga on cb_detalle_orden_carga.sCveTrafico=cb_trafico.sCveTrafico
left join cb_contenedores_trafico on cb_contenedores_trafico.scvetrafico=cb_trafico.sCveTrafico
WHERE cb_trafico.scvetrafico = '{0}' limit 1;", referencia);
                        }
                        else
                        {
                            txtcommand = string.Format(@"SELECT 
cu_cliente.sAlias 
,cu_cliente.sRazonSocial
,cb_contenedores_trafico.sNumeroCajaTrailer vehiculo
,cu_transfer.snombre transfer
,cu_transfer.snumerocaat
,cu_linea_transportista_mexicana.snombre
,cb_trafico.scveaduana
,cb_trafico.etipooperacion
,cb_trafico.scvetrafico
,cb_trafico.scvedocumento
,cb_trafico.snumpedimento
,cb_detalle_orden_carga.iconsecutivoordencarga
,REPLACE(REPLACE(REPLACE(cb_trafico.smarcas,'S/M S/N', ''),'S/N',''),' ','')smarcas
FROM cb_bulto
left join CB_TRAFICO on cb_bulto.sCveTrafico=cb_trafico.sCveTrafico
LEFT JOIN CU_CLIENTE ON CU_CLIENTE.SCVECLIENTE=CB_TRAFICO.SCVECLIENTE
LEFT JOIN CU_TRANSFER ON CU_TRANSFER.SCVETRANSFER=CB_TRAFICO.SCVETRANSFER
LEFT JOIN CU_LINEA_TRANSPORTISTA_MEXICANA ON CU_LINEA_TRANSPORTISTA_MEXICANA.SCVETRANSPORTISTA=CB_TRAFICO.SCVETRANSPORTISTAMEXICANO
left join cb_detalle_orden_carga on cb_detalle_orden_carga.sCveTrafico=cb_trafico.sCveTrafico
left join cb_remesa_consolidada_factura on cb_remesa_consolidada_factura.sCveTrafico=cb_trafico.sCveTrafico
left join cb_contenedores_trafico on cb_contenedores_trafico.iConsecutivo=cb_remesa_consolidada_factura.iConsecutivoContenedorRemesa
WHERE cb_bulto.sCveEntradaBodega = '{0}'
and cb_remesa_consolidada_factura.iConsecutivoRemesa={1} limit 1;", referencia, consremesa);
                        }
                        core.extendsql sqlServiceitn = new core.extendsql();
                        sqlServiceitn.cmdType = core.extendsql.CommandTypes.TXT;
                        sqlServiceitn.cnnName = core.extendsql.ConnectionNames.global;
                        sqlServiceitn.dbType = core.extendsql.dbTypes.MySql;
                        sqlServiceitn.sqltxt = txtcommand;
                        sqlServiceitn.RequestParameters.Add(new core.extendsql.rspt("@REF", referencia));
                        var dtresult = sqlServiceitn.GetAsyncDataTableMethod();
                        if (dtresult.Rows.Count > 0)
                        {
                            if (dtresult.Rows[0]["sAlias"].ToString() != "")
                            {
                                dr["srazonsocial"] = dtresult.Rows[0]["sAlias"];
                            }
                            else
                            {
                                dr["srazonsocial"] = dtresult.Rows[0]["sRazonSocial"];
                            }
                            dr["vehiculo"] = dr["tpvehiculo"].ToString() + " # " + dtresult.Rows[0]["vehiculo"];
                            if (dtresult.Rows[0]["sAlias"].ToString() != "")
                            {
                                dr["transfer"] = dtresult.Rows[0]["transfer"];
                                dr["snumerocaat"] = dtresult.Rows[0]["snumerocaat"];
                            }
                            else {
                                dr["transfer"] = dr["ctnombre"].ToString();
                                dr["snumerocaat"] = dr["ctcaat"].ToString();
                            }
                            dr["snombre"] = dtresult.Rows[0]["snombre"];
                            dr["scveaduana"] = dtresult.Rows[0]["scveaduana"];
                            dr["etipooperacion"] = dtresult.Rows[0]["etipooperacion"];
                            dr["scvetrafico"] = dtresult.Rows[0]["scvetrafico"];
                            dr["scvedocumento"] = dtresult.Rows[0]["scvedocumento"];
                            dr["snumpedimento"] = dtresult.Rows[0]["snumpedimento"];
                            dr["iconsecutivoordencarga"] = dtresult.Rows[0]["iconsecutivoordencarga"];
                            dr["smarcas"] = dtresult.Rows[0]["smarcas"];
                        }
                        else
                        {
                            dr["srazonsocial"] = dr["tpcliente"];
                        }
                    }
                    else
                    {
                        dr["srazonsocial"] = dr["tpcliente"];
                    }
                    if (dr["consremesa"].ToString() != "0")
                    {
                        dr["scvedocumento"] = "RM" + dr["consremesa"];
                    }
                }
            }

            jsonText = Newtonsoft.Json.JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);

            return jsonText;

        }
        [WebMethod(Description = "Load Grid Programacion", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string loadgridprogramacionfullimpo()
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            var cteid = Session["cteuid"];
            var jsonText = "";
            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.dbType = core.extendsql.dbTypes.SQLServer;
            var cmd = @"AFSWEB_SPS_GETPROGRAMACIONIMPO";

            sqlService.sqltxt = cmd;

            System.Data.DataSet ds = new System.Data.DataSet();
            ds = sqlService.GetAsyncDataSetMethod();

            foreach (System.Data.DataTable dt in ds.Tables)
            {
                foreach (DataRow dr in dt.Rows)
                {
                    string referencia = dr["tpreferencia"].ToString();
                    string consremesa = dr["consremesa"].ToString();

                    if (referencia != "")
                    {
                        var txtcommand = "";
                        if (dr["consremesa"].ToString() == "0")
                        {
                            txtcommand = string.Format(@"SELECT 
cu_cliente.sAlias 
,cu_cliente.sRazonSocial
,cb_contenedores_trafico.sNumeroCajaTrailer vehiculo
,cu_transfer.snombre transfer
,cu_transfer.snumerocaat
,cu_linea_transportista_mexicana.snombre
,cb_trafico.scveaduana
,cb_trafico.etipooperacion
,cb_trafico.scvetrafico
,cb_trafico.scvedocumento
,cb_trafico.snumpedimento
,cb_detalle_orden_carga.iconsecutivoordencarga
,REPLACE(REPLACE(REPLACE(cb_trafico.smarcas,'S/M S/N', ''),'S/N',''),' ','')smarcas
FROM CB_TRAFICO 
LEFT JOIN CU_CLIENTE ON CU_CLIENTE.SCVECLIENTE=CB_TRAFICO.SCVECLIENTE
LEFT JOIN CU_TRANSFER ON CU_TRANSFER.SCVETRANSFER=CB_TRAFICO.SCVETRANSFER
LEFT JOIN CU_LINEA_TRANSPORTISTA_MEXICANA ON CU_LINEA_TRANSPORTISTA_MEXICANA.SCVETRANSPORTISTA=CB_TRAFICO.SCVETRANSPORTISTAMEXICANO
left join cb_detalle_orden_carga on cb_detalle_orden_carga.sCveTrafico=cb_trafico.sCveTrafico
left join cb_contenedores_trafico on cb_contenedores_trafico.scvetrafico=cb_trafico.sCveTrafico
WHERE cb_trafico.scvetrafico = '{0}' limit 1;", referencia);
                        }
                        else
                        {
                            txtcommand = string.Format(@"SELECT 
cu_cliente.sAlias 
,cu_cliente.sRazonSocial
,cb_contenedores_trafico.sNumeroCajaTrailer vehiculo
,cu_transfer.snombre transfer
,cu_transfer.snumerocaat
,cu_linea_transportista_mexicana.snombre
,cb_trafico.scveaduana
,cb_trafico.etipooperacion
,cb_trafico.scvetrafico
,cb_trafico.scvedocumento
,cb_trafico.snumpedimento
,cb_detalle_orden_carga.iconsecutivoordencarga
,REPLACE(REPLACE(REPLACE(cb_trafico.smarcas,'S/M S/N', ''),'S/N',''),' ','')smarcas
FROM cb_bulto
left join CB_TRAFICO on cb_bulto.sCveTrafico=cb_trafico.sCveTrafico
LEFT JOIN CU_CLIENTE ON CU_CLIENTE.SCVECLIENTE=CB_TRAFICO.SCVECLIENTE
LEFT JOIN CU_TRANSFER ON CU_TRANSFER.SCVETRANSFER=CB_TRAFICO.SCVETRANSFER
LEFT JOIN CU_LINEA_TRANSPORTISTA_MEXICANA ON CU_LINEA_TRANSPORTISTA_MEXICANA.SCVETRANSPORTISTA=CB_TRAFICO.SCVETRANSPORTISTAMEXICANO
left join cb_detalle_orden_carga on cb_detalle_orden_carga.sCveTrafico=cb_trafico.sCveTrafico
left join cb_remesa_consolidada_factura on cb_remesa_consolidada_factura.sCveTrafico=cb_trafico.sCveTrafico
left join cb_contenedores_trafico on cb_contenedores_trafico.iConsecutivo=cb_remesa_consolidada_factura.iConsecutivoContenedorRemesa
WHERE cb_bulto.sCveEntradaBodega = '{0}'
and cb_remesa_consolidada_factura.iConsecutivoRemesa={1} limit 1;", referencia, consremesa);
                        }
                        core.extendsql sqlServiceitn = new core.extendsql();
                        sqlServiceitn.cmdType = core.extendsql.CommandTypes.TXT;
                        sqlServiceitn.cnnName = core.extendsql.ConnectionNames.global;
                        sqlServiceitn.dbType = core.extendsql.dbTypes.MySql;
                        sqlServiceitn.sqltxt = txtcommand;
                        sqlServiceitn.RequestParameters.Add(new core.extendsql.rspt("@REF", referencia));
                        var dtresult = sqlServiceitn.GetAsyncDataTableMethod();
                        if (dtresult.Rows.Count > 0)
                        {
                            if (dtresult.Rows[0]["sAlias"].ToString() != "")
                            {
                                dr["srazonsocial"] = dtresult.Rows[0]["sAlias"];
                            }
                            else
                            {
                                dr["srazonsocial"] = dtresult.Rows[0]["sRazonSocial"];
                            }
                            dr["vehiculo"] = dr["tpvehiculo"].ToString() + " # " + dtresult.Rows[0]["vehiculo"];
                            dr["transfer"] = dtresult.Rows[0]["transfer"];
                            dr["snumerocaat"] = dtresult.Rows[0]["snumerocaat"];
                            dr["snombre"] = dtresult.Rows[0]["snombre"];
                            dr["scveaduana"] = dtresult.Rows[0]["scveaduana"];
                            dr["etipooperacion"] = dtresult.Rows[0]["etipooperacion"];
                            dr["scvetrafico"] = dtresult.Rows[0]["scvetrafico"];
                            dr["scvedocumento"] = dtresult.Rows[0]["scvedocumento"];
                            dr["snumpedimento"] = dtresult.Rows[0]["snumpedimento"];
                            dr["iconsecutivoordencarga"] = dtresult.Rows[0]["iconsecutivoordencarga"];
                            dr["smarcas"] = dtresult.Rows[0]["smarcas"];
                        }
                        else
                        {
                            dr["srazonsocial"] = dr["tpcliente"];
                            //dr["tpreferencia"] = dr["tpentrada"];
                        }
                    }
                    else
                    {
                        dr["srazonsocial"] = dr["tpcliente"];
                        //dr["tpreferencia"] = dr["tpentrada"];
                    }
                    if (dr["consremesa"].ToString() != "0")
                    {
                        dr["scvedocumento"] = "RM" + dr["consremesa"];
                    }
                }
            }

            jsonText = Newtonsoft.Json.JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);

            return jsonText;

        }
        [WebMethod(Description = "Load Grid Programacion", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string loadgridprogramacionfullexpo()
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            var cteid = Session["cteuid"];
            var jsonText = "";
            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.dbType = core.extendsql.dbTypes.SQLServer;
            var cmd = @"AFSWEB_SPS_GETPROGRAMACIONEXPO";

            sqlService.sqltxt = cmd;

            System.Data.DataSet ds = new System.Data.DataSet();
            ds = sqlService.GetAsyncDataSetMethod();

            foreach (System.Data.DataTable dt in ds.Tables)
            {
                foreach (DataRow dr in dt.Rows)
                {
                    string referencia = dr["tpreferencia"].ToString();
                    string consremesa = dr["consremesa"].ToString();

                    if (referencia != "")
                    {
                        var txtcommand = "";
                        if (dr["consremesa"].ToString() == "0")
                        {
                            txtcommand = string.Format(@"SELECT 
cu_cliente.sAlias 
,cu_cliente.sRazonSocial
,cb_contenedores_trafico.sNumeroCajaTrailer vehiculo
,cu_transfer.snombre transfer
,cu_transfer.snumerocaat
,cu_linea_transportista_mexicana.snombre
,cb_trafico.scveaduana
,cb_trafico.etipooperacion
,cb_trafico.scvetrafico
,cb_trafico.scvedocumento
,cb_trafico.snumpedimento
,cb_detalle_orden_carga.iconsecutivoordencarga
,REPLACE(REPLACE(REPLACE(cb_trafico.smarcas,'S/M S/N', ''),'S/N',''),' ','')smarcas
FROM CB_TRAFICO 
LEFT JOIN CU_CLIENTE ON CU_CLIENTE.SCVECLIENTE=CB_TRAFICO.SCVECLIENTE
LEFT JOIN CU_TRANSFER ON CU_TRANSFER.SCVETRANSFER=CB_TRAFICO.SCVETRANSFER
LEFT JOIN CU_LINEA_TRANSPORTISTA_MEXICANA ON CU_LINEA_TRANSPORTISTA_MEXICANA.SCVETRANSPORTISTA=CB_TRAFICO.SCVETRANSPORTISTAMEXICANO
left join cb_detalle_orden_carga on cb_detalle_orden_carga.sCveTrafico=cb_trafico.sCveTrafico
left join cb_contenedores_trafico on cb_contenedores_trafico.scvetrafico=cb_trafico.sCveTrafico
WHERE cb_trafico.scvetrafico = '{0}' limit 1;", referencia);
                        }
                        else
                        {
                            txtcommand = string.Format(@"SELECT 
cu_cliente.sAlias 
,cu_cliente.sRazonSocial
,cb_contenedores_trafico.sNumeroCajaTrailer vehiculo
,cu_transfer.snombre transfer
,cu_transfer.snumerocaat
,cu_linea_transportista_mexicana.snombre
,cb_trafico.scveaduana
,cb_trafico.etipooperacion
,cb_trafico.scvetrafico
,cb_trafico.scvedocumento
,cb_trafico.snumpedimento
,cb_detalle_orden_carga.iconsecutivoordencarga
,REPLACE(REPLACE(REPLACE(cb_trafico.smarcas,'S/M S/N', ''),'S/N',''),' ','')smarcas
FROM cb_bulto
left join CB_TRAFICO on cb_bulto.sCveTrafico=cb_trafico.sCveTrafico
LEFT JOIN CU_CLIENTE ON CU_CLIENTE.SCVECLIENTE=CB_TRAFICO.SCVECLIENTE
LEFT JOIN CU_TRANSFER ON CU_TRANSFER.SCVETRANSFER=CB_TRAFICO.SCVETRANSFER
LEFT JOIN CU_LINEA_TRANSPORTISTA_MEXICANA ON CU_LINEA_TRANSPORTISTA_MEXICANA.SCVETRANSPORTISTA=CB_TRAFICO.SCVETRANSPORTISTAMEXICANO
left join cb_detalle_orden_carga on cb_detalle_orden_carga.sCveTrafico=cb_trafico.sCveTrafico
left join cb_remesa_consolidada_factura on cb_remesa_consolidada_factura.sCveTrafico=cb_trafico.sCveTrafico
left join cb_contenedores_trafico on cb_contenedores_trafico.iConsecutivo=cb_remesa_consolidada_factura.iConsecutivoContenedorRemesa
WHERE cb_bulto.sCveEntradaBodega = '{0}'
and cb_remesa_consolidada_factura.iConsecutivoRemesa={1} limit 1;", referencia, consremesa);
                        }
                        core.extendsql sqlServiceitn = new core.extendsql();
                        sqlServiceitn.cmdType = core.extendsql.CommandTypes.TXT;
                        sqlServiceitn.cnnName = core.extendsql.ConnectionNames.global;
                        sqlServiceitn.dbType = core.extendsql.dbTypes.MySql;
                        sqlServiceitn.sqltxt = txtcommand;
                        sqlServiceitn.RequestParameters.Add(new core.extendsql.rspt("@REF", referencia));
                        var dtresult = sqlServiceitn.GetAsyncDataTableMethod();
                        if (dtresult.Rows.Count > 0)
                        {
                            if (dtresult.Rows[0]["sAlias"].ToString() != "")
                            {
                                dr["srazonsocial"] = dtresult.Rows[0]["sAlias"];
                            }
                            else
                            {
                                dr["srazonsocial"] = dtresult.Rows[0]["sRazonSocial"];
                            }
                            dr["vehiculo"] = dr["tpvehiculo"].ToString() + " # " + dtresult.Rows[0]["vehiculo"];
                            dr["transfer"] = dtresult.Rows[0]["transfer"];
                            dr["snumerocaat"] = dtresult.Rows[0]["snumerocaat"];
                            dr["snombre"] = dtresult.Rows[0]["snombre"];
                            dr["scveaduana"] = dtresult.Rows[0]["scveaduana"];
                            dr["etipooperacion"] = dtresult.Rows[0]["etipooperacion"];
                            dr["scvetrafico"] = dtresult.Rows[0]["scvetrafico"];
                            dr["scvedocumento"] = dtresult.Rows[0]["scvedocumento"];
                            dr["snumpedimento"] = dtresult.Rows[0]["snumpedimento"];
                            dr["iconsecutivoordencarga"] = dtresult.Rows[0]["iconsecutivoordencarga"];
                            dr["smarcas"] = dtresult.Rows[0]["smarcas"];
                        }
                        else
                        {
                            dr["srazonsocial"] = dr["tpcliente"];
                            //dr["tpreferencia"] = dr["tpentrada"];
                        }
                    }
                    else
                    {
                        dr["srazonsocial"] = dr["tpcliente"];
                        //dr["tpreferencia"] = dr["tpentrada"];
                    }
                    if (dr["consremesa"].ToString() != "0")
                    {
                        dr["scvedocumento"] = "RM" + dr["consremesa"];
                    }
                }
            }

            jsonText = Newtonsoft.Json.JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);

            return jsonText;

        }
        [WebMethod(Description = "Load Grid Programacion", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string loadgridprogramacionglobal()
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            var cteid = Session["cteuid"];
            var jsonText = "[{\"Rows\": 0}]";
            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.TXT;
            sqlService.cnnName = core.extendsql.ConnectionNames.global;
            sqlService.dbType = core.extendsql.dbTypes.MySql;
            var cmd = @"SELECT 
cu_cliente.srazonsocial 
,DATE_FORMAT(cb_trafico.dfechacruce, '%d/%m/%Y') dfechacruce
,CONCAT('CAJA # ', cb_contenedores_trafico.sNumeroCajaTrailer, ' TIPO CONT: ', cb_contenedores_trafico.sCveContenedor) vehiculo
,cu_transfer.snombre transfer
,cu_transfer.snumerocaat
,cu_linea_transportista_mexicana.snombre
,cb_trafico.scveaduana
,cb_trafico.etipooperacion
,cb_trafico.scvetrafico
,cb_trafico.scvedocumento
,cb_trafico.snumpedimento
,cb_trafico.susuarioingreso
,'' estatus
,cb_trafico.scomentariosgenerales
,cb_detalle_orden_carga.iconsecutivoordencarga
,cb_trafico.smarcas
,'' itns
,'' obs
,'green' colorname
FROM CB_TRAFICO 
LEFT JOIN CU_CLIENTE ON CU_CLIENTE.SCVECLIENTE=CB_TRAFICO.SCVECLIENTE
LEFT JOIN CU_TRANSFER ON CU_TRANSFER.SCVETRANSFER=CB_TRAFICO.SCVETRANSFER
LEFT JOIN CU_LINEA_TRANSPORTISTA_MEXICANA ON CU_LINEA_TRANSPORTISTA_MEXICANA.SCVETRANSPORTISTA=CB_TRAFICO.SCVETRANSPORTISTAMEXICANO
left join cb_detalle_orden_carga on cb_detalle_orden_carga.sCveTrafico=cb_trafico.sCveTrafico
left join cb_contenedores_trafico on cb_contenedores_trafico.scvetrafico=cb_trafico.sCveTrafico
WHERE DATE(cb_trafico.dfechacruce) = DATE(NOW())
and cb_trafico.etipooperacion = 'I'
and (cb_trafico.scveaduana = 240 OR cb_trafico.scveaduana = 800)
order by scvetrafico;
SELECT 
cu_cliente.srazonsocial 
,DATE_FORMAT(cb_trafico.dfechacruce, '%d/%m/%Y') dfechacruce
,CONCAT('CAJA # ', cb_contenedores_trafico.sNumeroCajaTrailer, ' TIPO CONT: ', cb_contenedores_trafico.sCveContenedor) vehiculo
,cu_transfer.snombre transfer
,cu_transfer.snumerocaat
,cu_linea_transportista_mexicana.snombre
,cb_trafico.scveaduana
,cb_trafico.etipooperacion
,cb_trafico.scvetrafico
,cb_trafico.scvedocumento
,cb_trafico.snumpedimento
,cb_trafico.susuarioingreso
,'' estatus
,cb_trafico.scomentariosgenerales
,cb_detalle_orden_carga.iconsecutivoordencarga
,cb_trafico.smarcas
,'' itns
,'' obs
FROM CB_TRAFICO 
LEFT JOIN CU_CLIENTE ON CU_CLIENTE.SCVECLIENTE=CB_TRAFICO.SCVECLIENTE
LEFT JOIN CU_TRANSFER ON CU_TRANSFER.SCVETRANSFER=CB_TRAFICO.SCVETRANSFER
LEFT JOIN CU_LINEA_TRANSPORTISTA_MEXICANA ON CU_LINEA_TRANSPORTISTA_MEXICANA.SCVETRANSPORTISTA=CB_TRAFICO.SCVETRANSPORTISTAMEXICANO
left join cb_detalle_orden_carga on cb_detalle_orden_carga.sCveTrafico=cb_trafico.sCveTrafico
left join cb_contenedores_trafico on cb_contenedores_trafico.scvetrafico=cb_trafico.sCveTrafico
WHERE DATE(cb_trafico.dfechacruce) = DATE(NOW())
and cb_trafico.etipooperacion = 'E'
and (cb_trafico.scveaduana = 240 OR cb_trafico.scveaduana = 800)
order by scvetrafico desc;";

            sqlService.sqltxt = cmd;

            System.Data.DataSet ds = new System.Data.DataSet();
            ds = sqlService.GetAsyncDataSetMethod();

            foreach (System.Data.DataTable dt in ds.Tables)
            {
                foreach (DataRow dr in dt.Rows)
                {
                    string referencia = dr["scvetrafico"].ToString();
                    if (referencia != "")
                    {
                        core.extendsql sqlServiceitn = new core.extendsql();
                        sqlServiceitn.cmdType = core.extendsql.CommandTypes.SP;
                        sqlServiceitn.cnnName = core.extendsql.ConnectionNames.local;
                        sqlServiceitn.dbType = core.extendsql.dbTypes.SQLServer;
                        sqlServiceitn.sqltxt = "AFSWEB_SPS_OPTRAFPROG";
                        sqlServiceitn.RequestParameters.Add(new core.extendsql.rspt("@REF", referencia));
                        var dtresult = sqlServiceitn.GetAsyncDataTableMethod();
                        if (dtresult.Rows.Count > 0)
                        {
                            dr["itns"] = dtresult.Rows[0]["tpitn"];
                            dr["obs"] = dtresult.Rows[0]["tpobs"];
                        }

                    }
                }
            }

            jsonText = Newtonsoft.Json.JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);

            return jsonText;

        }
        [WebMethod(Description = "Actualiza ITN", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string actualizaitn(string referencia, string itn)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            System.Web.Security.FormsIdentity identity = (System.Web.Security.FormsIdentity)Context.User.Identity;
            string userData = identity.Ticket.UserData;
            string[] data = userData.Split(",".ToCharArray());

            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.dbType = core.extendsql.dbTypes.SQLServer;
            sqlService.sqltxt = "AFSWEB_SPU_ITN";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@REF", referencia));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@ITN", itn));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@USUARIO", data[2]));
            sqlService.ExecuteAsync();
            return "";
        }
        [WebMethod(Description = "Actualiza DODA", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string actualizadoda(string referencia, string doda)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            System.Web.Security.FormsIdentity identity = (System.Web.Security.FormsIdentity)Context.User.Identity;
            string userData = identity.Ticket.UserData;
            string[] data = userData.Split(",".ToCharArray());

            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.dbType = core.extendsql.dbTypes.SQLServer;
            sqlService.sqltxt = "AFSWEB_SPU_DODA";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@REF", referencia));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@DODA", doda));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@USUARIO", data[2]));
            sqlService.ExecuteAsync();
            return "";
        }
        [WebMethod(Description = "Actualiza OBS", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string actualizaobs(string referencia, string obs)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");


            System.Web.Security.FormsIdentity identity = (System.Web.Security.FormsIdentity)Context.User.Identity;
            string userData = identity.Ticket.UserData;
            string[] data = userData.Split(",".ToCharArray());

            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.dbType = core.extendsql.dbTypes.SQLServer;
            sqlService.sqltxt = "AFSWEB_SPU_OBS";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@REF", referencia));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@OBS", obs));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@USUARIO", data[2]));
            sqlService.ExecuteAsync();
            return "";
        }
        [WebMethod(Description = "Actualiza Historial", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string actualizahistorial(string referencia, string detalle)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            System.Web.Security.FormsIdentity identity = (System.Web.Security.FormsIdentity)Context.User.Identity;
            string userData = identity.Ticket.UserData;
            string[] data = userData.Split(",".ToCharArray());

            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.dbType = core.extendsql.dbTypes.SQLServer;
            sqlService.sqltxt = "AFSWEB_SPI_OPTRAFHIST";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@REF", referencia));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@DETALLE", detalle));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@USUARIO", data[2]));
            sqlService.ExecuteAsync();
            return "";
        }
        [WebMethod(Description = "Actualiza Historial", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string loadtimeline(string referencia)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            System.Web.Security.FormsIdentity identity = (System.Web.Security.FormsIdentity)Context.User.Identity;
            string userData = identity.Ticket.UserData;
            string[] data = userData.Split(",".ToCharArray());

            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.dbType = core.extendsql.dbTypes.SQLServer;
            sqlService.sqltxt = "AFSWEB_SPS_OPTRAFHIST";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@REF", referencia));
            var ds = sqlService.GetAsyncDataTableMethod();
            return Newtonsoft.Json.JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);
        }
        [WebMethod(Description = "Actualiza", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string actualizaejecutivo(string referencia, string ejecutivo)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            System.Web.Security.FormsIdentity identity = (System.Web.Security.FormsIdentity)Context.User.Identity;
            string userData = identity.Ticket.UserData;
            string[] data = userData.Split(",".ToCharArray());

            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.dbType = core.extendsql.dbTypes.SQLServer;
            sqlService.sqltxt = "AFSWEB_SPU_EJECUTIVO";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@REF", referencia));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@EJECUTIVO", ejecutivo));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@USUARIO", data[2]));
            sqlService.ExecuteAsync();
            return "";
        }
        [WebMethod(Description = "Actualiza", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string actualizaelabora(string referencia, string elabora)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            System.Web.Security.FormsIdentity identity = (System.Web.Security.FormsIdentity)Context.User.Identity;
            string userData = identity.Ticket.UserData;
            string[] data = userData.Split(",".ToCharArray());

            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.dbType = core.extendsql.dbTypes.SQLServer;
            sqlService.sqltxt = "AFSWEB_SPU_ELABORADOPOR";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@REF", referencia));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@ELABORADOPOR", elabora));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@USUARIO", data[2]));
            sqlService.ExecuteAsync();
            return "";
        }
        [WebMethod(Description = "Actualiza", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string actualizaestatus(string referencia, string estatus)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            System.Web.Security.FormsIdentity identity = (System.Web.Security.FormsIdentity)Context.User.Identity;
            string userData = identity.Ticket.UserData;
            string[] data = userData.Split(",".ToCharArray());

            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.dbType = core.extendsql.dbTypes.SQLServer;
            sqlService.sqltxt = "AFSWEB_SPU_ESTATUS";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@REF", referencia));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@ESTATUS", estatus));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@USUARIO", data[2]));
            sqlService.ExecuteAsync();
            return "";
        }
        [WebMethod(Description = "Actualiza", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string actualizaestatusbod(string referencia, string estatusbod)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            System.Web.Security.FormsIdentity identity = (System.Web.Security.FormsIdentity)Context.User.Identity;
            string userData = identity.Ticket.UserData;
            string[] data = userData.Split(",".ToCharArray());

            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.dbType = core.extendsql.dbTypes.SQLServer;
            sqlService.sqltxt = "AFSWEB_SPU_ESTATUSBOD";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@REF", referencia));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@ESTATUSBOD", estatusbod));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@USUARIO", data[2]));
            sqlService.ExecuteAsync();
            return "";
        }
        [WebMethod(Description = "Actualiza", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string actualizaestatusadu(string referencia, string estatusadu)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            System.Web.Security.FormsIdentity identity = (System.Web.Security.FormsIdentity)Context.User.Identity;
            string userData = identity.Ticket.UserData;
            string[] data = userData.Split(",".ToCharArray());

            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.dbType = core.extendsql.dbTypes.SQLServer;
            sqlService.sqltxt = "AFSWEB_SPU_ESTATUSADU";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@REF", referencia));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@ESTATUSADU", estatusadu));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@USUARIO", data[2]));
            sqlService.ExecuteAsync();
            return "";
        }
        [WebMethod(Description = "Actualiza", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string programatrafico(string referencia, string tipoop, string cliente, string grupotr, string vehiculo, string entrada, string consremesa)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            System.Web.Security.FormsIdentity identity = (System.Web.Security.FormsIdentity)Context.User.Identity;
            string userData = identity.Ticket.UserData;
            string[] data = userData.Split(",".ToCharArray());

            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.dbType = core.extendsql.dbTypes.SQLServer;
            sqlService.sqltxt = "AFSWEB_SPI_PROGRAMATRAFICO";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@REF", referencia));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@TIPOOP", tipoop));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@CLIENTE", cliente));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@GRUPO", grupotr));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@VEHICULO", vehiculo));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@USUARIO", data[2]));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@TPENTRADA", entrada));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@CONSREMESA", consremesa));
            sqlService.ExecuteAsync();
            return "";
        }
        [WebMethod(Description = "Actualiza", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string desprogramatrafico(string referencia)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            System.Web.Security.FormsIdentity identity = (System.Web.Security.FormsIdentity)Context.User.Identity;
            string userData = identity.Ticket.UserData;
            string[] data = userData.Split(",".ToCharArray());

            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.dbType = core.extendsql.dbTypes.SQLServer;
            sqlService.sqltxt = "AFSWEB_SPU_DESPROGRAMATRAFICO";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@REF", referencia));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@USUARIO", data[2]));
            sqlService.ExecuteAsync();
            return "";
        }
        [WebMethod(Description = "Load Grid Programacion", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string buscaref(string referencia)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            var cteid = Session["cteuid"];
            var jsonText = "[{\"Rows\": 0}]";
            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.TXT;
            sqlService.cnnName = core.extendsql.ConnectionNames.global;
            sqlService.dbType = core.extendsql.dbTypes.MySql;
            var cmd = string.Format(@"SELECT 
cu_cliente.srazonsocial 
,cb_trafico.etipooperacion
,cb_trafico.scvetrafico
FROM CB_TRAFICO 
LEFT JOIN CU_CLIENTE ON CU_CLIENTE.SCVECLIENTE=CB_TRAFICO.SCVECLIENTE
WHERE cb_trafico.scvetrafico='{0}';", referencia);

            sqlService.sqltxt = cmd;

            System.Data.DataSet ds = new System.Data.DataSet();
            ds = sqlService.GetAsyncDataSetMethod();

            jsonText = Newtonsoft.Json.JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);

            return jsonText;
        }
        [WebMethod(Description = "Load Grid Programacion", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string buscaentrada(string referencia)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            var jsonText = "";
            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.TXT;
            sqlService.cnnName = core.extendsql.ConnectionNames.global;
            sqlService.dbType = core.extendsql.dbTypes.MySql;
            var cmd = string.Format(@"SELECT 
cu_cliente.srazonsocial 
,cb_entrada_bodega.sCveEntradaBodega
,cb_entrada_bodega.eTipoOperacion
FROM cb_entrada_bodega 
LEFT JOIN cu_cliente ON cu_cliente.sCveCliente=cb_entrada_bodega.sCveCliente
WHERE cb_entrada_bodega.sCveEntradaBodega='{0}' order by cb_entrada_bodega.dFechaLlegadaMercancia desc;", referencia);

            sqlService.sqltxt = cmd;

            System.Data.DataSet ds = new System.Data.DataSet();
            ds = sqlService.GetAsyncDataSetMethod();

            jsonText = Newtonsoft.Json.JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);

            return jsonText;
        }
        [WebMethod(Description = "Actualiza", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string actualizaconsolidado(string referencia, string clave)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            System.Web.Security.FormsIdentity identity = (System.Web.Security.FormsIdentity)Context.User.Identity;
            string userData = identity.Ticket.UserData;
            string[] data = userData.Split(",".ToCharArray());

            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.dbType = core.extendsql.dbTypes.SQLServer;
            sqlService.sqltxt = "AFSWEB_SPU_CLAVECONSOLIDADO";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@REF", referencia));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@CLAVECONS", clave));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@USUARIO", data[2]));
            sqlService.ExecuteAsync();
            return "";
        }
        [WebMethod(Description = "Actualiza", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string updateinicarga(string referencia)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            System.Web.Security.FormsIdentity identity = (System.Web.Security.FormsIdentity)Context.User.Identity;
            string userData = identity.Ticket.UserData;
            string[] data = userData.Split(",".ToCharArray());

            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.dbType = core.extendsql.dbTypes.SQLServer;
            sqlService.sqltxt = "AFSWEB_SPU_INICIOCARGA";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@REF", referencia));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@USUARIO", data[2]));
            sqlService.ExecuteAsync();
            return "";
        }
        [WebMethod(Description = "Actualiza", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string updatefincarga(string referencia)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");


            System.Web.Security.FormsIdentity identity = (System.Web.Security.FormsIdentity)Context.User.Identity;
            string userData = identity.Ticket.UserData;
            string[] data = userData.Split(",".ToCharArray());

            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.dbType = core.extendsql.dbTypes.SQLServer;
            sqlService.sqltxt = "AFSWEB_SPU_FINALIZACARGA";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@REF", referencia));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@USUARIO", data[2]));

            sqlService.ExecuteAsync();
            return "";
        }
        [WebMethod(Description = "Actualiza", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string updatefechasalida(string referencia, string txtremision)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            System.Web.Security.FormsIdentity identity = (System.Web.Security.FormsIdentity)Context.User.Identity;
            string userData = identity.Ticket.UserData;
            string[] data = userData.Split(",".ToCharArray());

            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.dbType = core.extendsql.dbTypes.SQLServer;
            sqlService.sqltxt = "AFSWEB_SPU_SALIDADEPATIO";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@REF", referencia));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@REMISIONSALIDA", txtremision));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@USUARIO", data[2]));
            sqlService.ExecuteAsync();
            return "";
        }
        [WebMethod(Description = "Actualiza", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string actualizhoraestimada(string referencia, string hora)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            System.Web.Security.FormsIdentity identity = (System.Web.Security.FormsIdentity)Context.User.Identity;
            string userData = identity.Ticket.UserData;
            string[] data = userData.Split(",".ToCharArray());

            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.dbType = core.extendsql.dbTypes.SQLServer;
            sqlService.sqltxt = "AFSWEB_SPU_HORAESTIMADA";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@REF", referencia));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@HORA", hora));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@USUARIO", data[2]));
            sqlService.ExecuteAsync();
            return "";
        }
        [WebMethod(Description = "Actualiza", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string actualiztransfer(string referencia, int transfer)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            System.Web.Security.FormsIdentity identity = (System.Web.Security.FormsIdentity)Context.User.Identity;
            string userData = identity.Ticket.UserData;
            string[] data = userData.Split(",".ToCharArray());

            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.dbType = core.extendsql.dbTypes.SQLServer;
            sqlService.sqltxt = "AFSWEB_SPU_TRANSFER";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@REF", referencia));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@TRANSFER", transfer));
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@USUARIO", data[2]));
            sqlService.ExecuteAsync();
            return "";
        }
        [WebMethod(Description = "Load Cruces Diarios", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string loadcrucesdiarios(string pref)
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            var cteid = Session["cteuid"];
            var jsonText = "[{\"Rows\": 0}]";
            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.TXT;
            sqlService.cnnName = core.extendsql.ConnectionNames.global;
            sqlService.sqltxt = @"[smidashboard_sps_crucesdiarios]";
            var ds = sqlService.GetAsyncDataTableMethod();
            jsonText = Newtonsoft.Json.JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);

            return jsonText;

        }
        [WebMethod(Description = "Load Usuarios", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string GetUsuarios(int tipousuario)
        {/*
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");
            */

            var cteid = Session["cteuid"];
            var jsonText = "";
            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.sqltxt = "AFSWEB_SPS_GETUSERSBYTYPE";
            sqlService.RequestParameters.Add(new core.extendsql.rspt("@TYPE", tipousuario));
            var ds = sqlService.GetAsyncDataTableMethod();
            jsonText = Newtonsoft.Json.JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);

            return jsonText;

        }
        [WebMethod(Description = "Load Usuarios", EnableSession = true)]
        [System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
        public string GetTransfers()
        {
            if (!Context.User.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException("Access denied or your session has expired, return to login page and try again");

            var cteid = Session["cteuid"];
            var jsonText = "";
            core.extendsql sqlService = new core.extendsql();
            sqlService.cmdType = core.extendsql.CommandTypes.SP;
            sqlService.cnnName = core.extendsql.ConnectionNames.local;
            sqlService.sqltxt = "AFSWEB_SPS_GETTRANSFERS";
            var ds = sqlService.GetAsyncDataTableMethod();
            jsonText = Newtonsoft.Json.JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.None);

            return jsonText;

        }
    }

}
