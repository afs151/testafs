(function (namespace, $) {
    "use strict";

    var repoedimentogral = function () {
        // Create reference to this instance
        var o = this;
        // Initialize app when document is ready
        $(document).ready(function () {
            o.initialize();
        });

    };
    var p = repoedimentogral.prototype;
    var theme = 'bootstrap';
    // =========================================================================
    // INIT
    // =========================================================================
    p.initialize = function () {
        this._loadDom();
        this._refreshGrid();
    };

    p._loadDom = function () {
        $("#jqxgrid").jqxGrid(
                {
                    width: '100%',
                    //source: dataAdapter,
                    filterable: true,
                    sortable: true,
                    altrows: true,
                    columnsresize: true,
                    showtoolbar: true,
                    showfilterrow: true,
                    showstatusbar: true,
                    showaggregates: true,
                    theme: 'bootstrap',
                    rendertoolbar: function (toolbar) {
                        var me = this;
                        // Create html
                        var html = '';
                        html += '<div style="margin: 5px;">';
                        html += '	<span style="float: left; margin-top: 5px; margin-right: 4px;">Seleccione rango de fechas:</span>';
                        html += '	<span style="float: left; margin-top: 0px; margin-right: 4px;"><div id="jqxWidgetDatePicker"></div></span>';
                        html += '	<span style="float: left; margin-top: 0px; margin-right: 4px;"><div id="jqxWidgetDatePicker2"></div></span>';
                        html += '	<span style="float: left; margin-top: 0px; margin-right: 4px;"><div><button type="button" class="btn" tooltip="Cargar fechas" id="cmdbusca"><i class="md md-find-in-page"></i></button></div></span>';
                        html += '	<div><input type="button" value="Export to Excel" id="excelExport" /></div>';
                        html += '</div>';
                        var $new = $(html);
                        toolbar.append($new);
                        $("#excelExport").jqxButton({ theme: 'bootstrap' });
                        $("#excelExport").on('click', function () {
                            $("#jqxgrid").jqxGrid('exportdata', 'xls', 'jqxGrid', true, null, true, 'services/ExportContent.asmx/ExcelExport');
                        });
                        $("#cmdbusca").jqxButton({ theme: 'bootstrap' });
                        $("#cmdbusca").click(function () {
                            p._refreshGrid();
                        });
                        var today = new Date();
                        var dd = today.getDate();
                        var mm = today.getMonth() + 1; //January is 0!
                        var yyyy = today.getFullYear();

                        if (dd < 10) {
                            dd = '0' + dd
                        }
                        if (mm < 10) {
                            mm = '0' + mm
                        }
                        today = yyyy + '-' + mm + '-' + dd;
                        if ($('#feci').val() == "")
                            $('#feci').val(today);
                        if ($('#fecf').val() == "")
                            $('#fecf').val(today);
                        var fechaini = $('#feci').val();
                        $("#jqxWidgetDatePicker").jqxDateTimeInput({ width: '150px', height: '25px', theme: 'bootstrap', formatString: 'yyyy-MM-dd' });
                        $("#jqxWidgetDatePicker").jqxDateTimeInput('setDate', fechaini);
                        var fechafin = $('#fecf').val();
                        $("#jqxWidgetDatePicker2").jqxDateTimeInput({ width: '150px', height: '25px', theme: 'bootstrap', formatString: 'yyyy-MM-dd' });
                        $("#jqxWidgetDatePicker2").jqxDateTimeInput('setDate', fechafin);

                        var contextMenu = $("#Menu").jqxMenu({ width: 200, height: 30, autoOpenPopup: false, mode: 'popup', theme: theme });
                        $("#jqxgrid").on('contextmenu', function () {
                            return false;
                        });
                        $("#Menu").on('itemclick', function (event) {
                            var args = event.args;
                            var rowindex = $("#jqxgrid").jqxGrid('getselectedrowindex');
                            if ($.trim($(args).text()) == "Abrir expediente digital") {
                                var dataRecord = $("#jqxgrid").jqxGrid('getrowdata', rowindex);
                                var datatosend = {
                                    referencia: dataRecord.C001REFPED
                                }
                                $.ajax({
                                    type: 'POST',
                                    data: JSON.stringify(datatosend),
                                    contentType: 'application/json; charset=utf-8',
                                    dataType: 'json',
                                    url: 'services/reportes.asmx/VisorPed',
                                    success: function (data) {
                                        var obj = $.parseJSON(data.d).data;
                                        //$("#successmsg").text("Cambio realizado exitosamente");
                                        //$("#successNotification").jqxNotification("open");
                                        var url = 'https://localhost/vdigital.aspx?key=' + obj[0].encref;
                                        window.open(url);
                                    },
                                    error: function (xhr, textStatus, error) {
                                        if (typeof console == "object") {
                                            console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                                        }
                                    }
                                });
                                //var url = 'https://localhost/vdigital.aspx?key=' + dataRecord.encref;
                                //window.open(url);
                            }
                        });
                        $("#jqxgrid").on('rowclick', function (event) {
                            if (event.args.rightclick) {
                                $("#jqxgrid").jqxGrid('selectrow', event.args.rowindex);
                                var scrollTop = $(window).scrollTop();
                                var scrollLeft = $(window).scrollLeft();
                                contextMenu.jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft, parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
                                return false;
                            }
                        });
                        //$("#cbotipo").jqxComboBox({ theme: 'bootstrap' });
                        //$('#cbotipo').on('change', function () {
                        //    optsvaluechanged();
                        //});
                    },
                    columns: [
                                { text: 'PEDIMENTO', datafield: 'C001NUMPED', width: 100, aggregates: ['count'] },
                                { text: 'REFERENCIA', datafield: 'C001REFPED', width: 100 },
                                { text: 'TIPO', datafield: 'C001TIPOPE', width: 75 },
                                { text: 'ADUANA', datafield: 'C001ADUSEC', width: 75 },
                                { text: 'PATENTE', datafield: 'C001PATEN', width: 75 },
                                { text: 'NOMBRE CLIENTE', datafield: 'C001NOMCLI', width: 200 },
                                { text: 'RFC DEL CLIENTE', datafield: 'C001RFCCLI', width: 125 },
                                { text: 'CLAVE DOCUMENTO', datafield: 'C001CVEDOC', width: 100 },
                                { text: 'TIPO REGIMEN', datafield: 'C001TIPREG', width: 100 },
                                { text: 'DESTINO/ORIGEN MCIA', datafield: 'C001DESORI', width: 100 },
                                { text: 'MEDIO TRANS. SALIDA', datafield: 'C001MEDTRS', width: 125 },
                                { text: 'MEDIO TRANS. ARRIBO', datafield: 'C001MEDTRA', width: 125 },
                                { text: 'MEDIO TRANS. ENTRADA', datafield: 'C001MEDTRE', width: 125 },
                                { text: 'TOTAL VALOR FACTURA (M.E.)', datafield: 'F001TOTFAC', width: 100 },
                                { text: 'PRECIO TOTAL PAGADO (M.E.)', datafield: 'F001VALCOE', width: 100 },
                                { text: 'VALOR TOTAL EN DOLARES', datafield: 'F001VALDOL', width: 100 },
                                { text: 'TIPO DE CAMBIO', datafield: 'F001TIPCAM', width: 100 },
                                { text: 'FACTOR DE MONEDA EXTRANJERA', datafield: 'F001FACMEX', width: 100 },
                                { text: 'FACTOR ACTUALIZACION', datafield: 'F001FACACT', width: 100 },
                                { text: 'FACTOR DE AJUSTE', datafield: 'F001FACAJU', width: 100 },
                                { text: 'FECHA DE ENTRADA', datafield: 'D001FECARR', width: 100 },
                                { text: 'FECHA DE PAGO', datafield: 'D001FECPAG', width: 100 },
                                { text: 'FECHA ENTRADA/PRESENTACION', datafield: 'D001FECEP', width: 100 },
                                { text: 'FECHA DE EXTRACCION', datafield: 'D001FECEXT', width: 100 },
                                { text: 'VALOR SEGUROS', datafield: 'F001VALSEG', width: 100 },
                                { text: 'VALOR FLETES', datafield: 'F001FLETES', width: 100 },
                                { text: 'SEGUROS', datafield: 'F001SEGURO', width: 100 },
                                { text: 'VALOR EMBALAJE', datafield: 'F001EMBALA', width: 100 },
                                { text: 'OTROS INCREMENTOS', datafield: 'F001OTRINC', width: 100 },
                                { text: 'TOTAL DE INCREMENTOS', datafield: 'N001TOTINC', width: 100 },
                                { text: 'VALOR EN ADUANA', datafield: 'N001VALADU', width: 100 },
                                { text: 'PRECIO PAGADO', datafield: 'N001VALCOM', width: 100 },
                                { text: 'MARCA NUMERO', datafield: 'C001MARNUM', width: 130 },
                                { text: 'PESO BRUTO', datafield: 'F001PESO', width: 100 },                                
                                { text: 'TOTAL DE FRACCIONES', datafield: 'I001SECFRA', width: 100 },
                                { text: 'TOTAL DE FRACCIONES', datafield: 'I001TOTFRA', width: 100 },
                                { text: 'DTA 1', datafield: 'F001TASDT1', width: 100 },
                                { text: 'DTA 2', datafield: 'F001TASDT2', width: 100 },
                                { text: 'TASA RECARGOS', datafield: 'F001TASREC', width: 115 },
                                { text: 'TASA PREVALIDACION', datafield: 'F001TASPRE', width: 115 },
                                { text: 'TIPO TASADTA 1', datafield: 'I001TTDTA1', width: 115 },
                                { text: 'TIPO TASADTA 2', datafield: 'I001TTDTA2', width: 115 },
                                { text: 'TIPO TASA RECARGOS', datafield: 'I001TTREC', width: 100 },
                                { text: 'TIPO TASA PREVALIDACION', datafield: 'I001TTPRE', width: 100 },
                                { text: 'OPERACION ORIGINAL DE UN R1', datafield: 'L001REFREC', width: 100 },
                                { text: 'OPERACION R1', datafield: 'L001REFR1', width: 100 },
                                { text: 'FECHA DE RECTIFICACION', datafield: 'D001FECR1' }
                    ]
                });
        
    }
    p._refreshGrid = function () {

        var dialog = bootbox.dialog({ message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> loading, please wait...</div>' });

        var date1 = $("#jqxWidgetDatePicker").jqxDateTimeInput('getText');
        var date2 = $("#jqxWidgetDatePicker2").jqxDateTimeInput('getText');

        var fechas = {
            fechaini: date1,
            fechafin: date2,
            tipo:1
        }
        //$("#loading").show();
        $.ajax({
            type: 'POST',
            data: JSON.stringify(fechas),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            url: 'services/reppedimentos.asmx/reppedimentogeneral',
            success: function (data) {

                var data = $.parseJSON(data.d);
                var source =
                        {
                            localdata: data,
                            datatype: "json",
                            datafields: [
                                    { name: 'C001PATEN', type: 'string' },
                                        { name: 'C001ADUSEC', type: 'string' },
                                        { name: 'C001REFPED', type: 'string' },
                                        { name: 'C001NUMPED', type: 'string' },
                                        { name: 'C001TIPOPE', type: 'string' },
                                        { name: 'C001CVEDOC', type: 'string' },
                                        { name: 'C001TIPREG', type: 'string' },
                                        { name: 'C001DESORI', type: 'string' },
                                        { name: 'C001MEDTRS', type: 'string' },
                                        { name: 'C001MEDTRA', type: 'string' },
                                        { name: 'C001MEDTRE', type: 'string' },
                                        { name: 'F001TOTFAC', type: 'float' },
                                        { name: 'F001VALCOE', type: 'float' },
                                        { name: 'F001VALDOL', type: 'float' },
                                        { name: 'F001TIPCAM', type: 'float' },
                                        { name: 'F001FACMEX', type: 'float' },
                                        { name: 'F001FACACT', type: 'float' },
                                        { name: 'F001FACAJU', type: 'float' },
                                        { name: 'D001FECARR', type: 'datetime' },
                                        { name: 'D001FECPAG', type: 'datetime' },
                                        { name: 'D001FECEP', type: 'datetime' },
                                        { name: 'D001FECEXT', type: 'datetime' },
                                        { name: 'F001VALSEG', type: 'float' },
                                        { name: 'F001FLETES', type: 'float' },
                                        { name: 'F001SEGURO', type: 'float' },
                                        { name: 'F001EMBALA', type: 'float' },
                                        { name: 'F001OTRINC', type: 'float' },
                                        { name: 'N001TOTINC', type: 'float' },
                                        { name: 'N001VALADU', type: 'float' },
                                        { name: 'N001VALCOM', type: 'float' },
                                        { name: 'C001MARNUM', type: 'string' },
                                        { name: 'F001PESO', type: 'string' },
                                        { name: 'C001NOMCLI', type: 'string' },
                                        { name: 'C001RFCCLI', type: 'string' },
                                        { name: 'I001SECFRA', type: 'int' },
                                        { name: 'I001TOTFRA', type: 'int' },
                                        { name: 'F001TASDT1', type: 'float' },
                                        { name: 'F001TASDT2', type: 'float' },
                                        { name: 'F001TASREC', type: 'float' },
                                        { name: 'F001TASPRE', type: 'float' },
                                        { name: 'I001TTDTA1', type: 'int' },
                                        { name: 'I001TTDTA2', type: 'int' },
                                        { name: 'I001TTREC', type: 'int' },
                                        { name: 'I001TTPRE', type: 'int' },
                                        { name: 'L001REFREC', type: 'float' },
                                        { name: 'L001REFR1', type: 'float' },
                                        { name: 'D001FECR1', type: 'datetime' }
                            ]
                        };
                var dataAdapter = new $.jqx.dataAdapter(source, {
                    loadComplete: function () { },
                    loadError: function (xhr, status, error) { }
                });
                $('#jqxgrid').jqxGrid({ source: dataAdapter });
            },
            error: function (xhr, textStatus, error) {
                if (typeof console == "object") {
                    console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                }
            },
            complete: function () {
                dialog.modal('hide');
            }
        });
    }
//$(document).ready(function () {
    //var fechas = {
    //    fechaini: '',
    //    fechafin: ''
    //}
    //$("#loading").show();
    //$.ajax({
    //    type: 'POST',
    //    data: JSON.stringify(fechas),
    //    contentType: 'application/json; charset=utf-8',
    //    dataType: 'json',
    //    async: true,
    //    url: 'services/reportes.asmx/reppedimentogeneralS',
    //    success: function (data) {

    //        var data = $.parseJSON(data.d);
    //        var source =
    //                {
    //                    localdata: data,
    //                    datatype: "json",
    //                    datafields: [
    //                            { name: 'C001PATEN', type: 'string' },
    //                                { name: 'C001ADUSEC', type: 'string' },
    //                                { name: 'C001REFPED', type: 'string' },
    //                                { name: 'C001NUMPED', type: 'string' },
    //                                { name: 'C001TIPOPE', type: 'string' },
    //                                { name: 'C001CVEDOC', type: 'string' },
    //                                { name: 'C001TIPREG', type: 'string' },
    //                                { name: 'C001DESORI', type: 'string' },
    //                                { name: 'C001MEDTRS', type: 'string' },
    //                                { name: 'C001MEDTRA', type: 'string' },
    //                                { name: 'C001MEDTRE', type: 'string' },
    //                                { name: 'F001TOTFAC', type: 'float' },
    //                                { name: 'F001VALCOE', type: 'float' },
    //                                { name: 'F001VALDOL', type: 'float' },
    //                                { name: 'F001TIPCAM', type: 'float' },
    //                                { name: 'F001FACMEX', type: 'float' },
    //                                { name: 'F001FACACT', type: 'float' },
    //                                { name: 'F001FACAJU', type: 'float' },
    //                                { name: 'D001FECARR', type: 'datetime' },
    //                                { name: 'D001FECPAG', type: 'datetime' },
    //                                { name: 'D001FECEP', type: 'datetime' },
    //                                { name: 'D001FECEXT', type: 'datetime' },
    //                                { name: 'F001VALSEG', type: 'float' },
    //                                { name: 'F001FLETES', type: 'float' },
    //                                { name: 'F001SEGURO', type: 'float' },
    //                                { name: 'F001EMBALA', type: 'float' },
    //                                { name: 'F001OTRINC', type: 'float' },
    //                                { name: 'N001TOTINC', type: 'float' },
    //                                { name: 'N001VALADU', type: 'float' },
    //                                { name: 'N001VALCOM', type: 'float' },
    //                                { name: 'C001MARNUM', type: 'string' },
    //                                { name: 'F001PESO', type: 'string' },
    //                                { name: 'C001NOMCLI', type: 'string' },
    //                                { name: 'C001RFCCLI', type: 'string' },
    //                                { name: 'I001SECFRA', type: 'int' },
    //                                { name: 'I001TOTFRA', type: 'int' },
    //                                { name: 'F001TASDT1', type: 'float' },
    //                                { name: 'F001TASDT2', type: 'float' },
    //                                { name: 'F001TASREC', type: 'float' },
    //                                { name: 'F001TASPRE', type: 'float' },
    //                                { name: 'I001TTDTA1', type: 'int' },
    //                                { name: 'I001TTDTA2', type: 'int' },
    //                                { name: 'I001TTREC', type: 'int' },
    //                                { name: 'I001TTPRE', type: 'int' },
    //                                { name: 'L001REFREC', type: 'float' },
    //                                { name: 'L001REFR1', type: 'float' },
    //                                { name: 'D001FECR1', type: 'datetime' }
    //                    ]
    //                };
    //        var dataAdapter = new $.jqx.dataAdapter(source, {
    //            loadComplete: function () { $("#loading").hide(); },
    //            loadError: function (xhr, status, error) { }
    //        });


            //$("#jqxgrid").jqxGrid(
            //    {
            //        width: '100%',
            //        source: dataAdapter,
            //        filterable: true,
            //        sortable: true,
            //        altrows: true,
            //        columnsresize: true,
            //        showtoolbar: true,
            //        showfilterrow: true,
            //        showstatusbar: true,
            //        showaggregates: true,
            //        theme: 'bootstrap',
            //        altrows: true,
            //        rendertoolbar: function (toolbar) {
            //            var me = this;
            //            // Create html
            //            var html = '';
            //            html += '<div style="margin: 5px;">';
            //            html += '	<span style="float: left; margin-top: 5px; margin-right: 4px;">Seleccione rango de fechas:</span>';
            //            html += '	<span style="float: left; margin-top: 0px; margin-right: 4px;"><div id="jqxWidgetDatePicker"></div></span>';
            //            html += '	<span style="float: left; margin-top: 0px; margin-right: 4px;"><div id="jqxWidgetDatePicker2"></div></span>';
            //            html += '	<span style="float: left; margin-top: 0px; margin-right: 4px;"><div><button type="button" class="btn" tooltip="Cargar fechas" id="cmdbusca"><i class="md md-find-in-page"></i></button></div></span>';
            //            //html += '	<span style="float: left; margin-top: 5px; margin-right: 4px;">Tipo de operacion:</span>';
            //            //html += '	<span style="float: left; margin-top: 0px; margin-right: 4px;">';
            //            //html += '	    <select id="cbotipo">';
            //            //html += '	        <option value="3">Ambos</option>';
            //            //html += '	        <option value="1">Importacion</option>';
            //            //html += '	        <option value="0">Exportacion</option>';                      
            //            //html += '	    </select>';
            //            //html += '	</span>';
            //            html += '	<div><input type="button" value="Export to Excel" id="excelExport" /></div>';
            //            html += '</div>';
            //            var $new = $(html);
            //            toolbar.append($new);
            //        },
            //        columns: [
            //                    { text: 'PEDIMENTO', datafield: 'C001NUMPED', width: 100, aggregates: ['count'] },
            //                    { text: 'REFERENCIA', datafield: 'C001REFPED', width: 100 },
            //                    { text: 'TIPO', datafield: 'C001TIPOPE', width: 75 },
            //                    { text: 'ADUANA', datafield: 'C001ADUSEC', width: 75 },
            //                    { text: 'PATENTE', datafield: 'C001PATEN', width: 75 },
            //                    { text: 'NOMBRE CLIENTE', datafield: 'C001NOMCLI', width: 200 },
            //                    { text: 'RFC DEL CLIENTE', datafield: 'C001RFCCLI', width: 125 },
            //                    { text: 'CLAVE DOCUMENTO', datafield: 'C001CVEDOC', width: 100 },
            //                    { text: 'TIPO REGIMEN', datafield: 'C001TIPREG', width: 100 },
            //                    { text: 'DESTINO/ORIGEN MCIA', datafield: 'C001DESORI', width: 100 },
            //                    { text: 'MEDIO TRANS. SALIDA', datafield: 'C001MEDTRS', width: 125 },
            //                    { text: 'MEDIO TRANS. ARRIBO', datafield: 'C001MEDTRA', width: 125 },
            //                    { text: 'MEDIO TRANS. ENTRADA', datafield: 'C001MEDTRE', width: 125 },
            //                    { text: 'TOTAL VALOR FACTURA (M.E.)', datafield: 'F001TOTFAC', width: 100 },
            //                    { text: 'PRECIO TOTAL PAGADO (M.E.)', datafield: 'F001VALCOE', width: 100 },
            //                    { text: 'VALOR TOTAL EN DOLARES', datafield: 'F001VALDOL', width: 100 },
            //                    { text: 'TIPO DE CAMBIO', datafield: 'F001TIPCAM', width: 100 },
            //                    { text: 'FACTOR DE MONEDA EXTRANJERA', datafield: 'F001FACMEX', width: 100 },
            //                    { text: 'FACTOR ACTUALIZACION', datafield: 'F001FACACT', width: 100 },
            //                    { text: 'FACTOR DE AJUSTE', datafield: 'F001FACAJU', width: 100 },
            //                    { text: 'FECHA DE ENTRADA', datafield: 'D001FECARR', width: 100 },
            //                    { text: 'FECHA DE PAGO', datafield: 'D001FECPAG', width: 100 },
            //                    { text: 'FECHA ENTRADA/PRESENTACION', datafield: 'D001FECEP', width: 100 },
            //                    { text: 'FECHA DE EXTRACCION', datafield: 'D001FECEXT', width: 100 },
            //                    { text: 'VALOR SEGUROS', datafield: 'F001VALSEG', width: 100 },
            //                    { text: 'VALOR FLETES', datafield: 'F001FLETES', width: 100 },
            //                    { text: 'SEGUROS', datafield: 'F001SEGURO', width: 100 },
            //                    { text: 'VALOR EMBALAJE', datafield: 'F001EMBALA', width: 100 },
            //                    { text: 'OTROS INCREMENTOS', datafield: 'F001OTRINC', width: 100 },
            //                    { text: 'TOTAL DE INCREMENTOS', datafield: 'N001TOTINC', width: 100 },
            //                    { text: 'VALOR EN ADUANA', datafield: 'N001VALADU', width: 100 },
            //                    { text: 'PRECIO PAGADO', datafield: 'N001VALCOM', width: 100 },
            //                    { text: 'MARCA NUMERO', datafield: 'C001MARNUM', width: 130 },
            //                    { text: 'PESO BRUTO', datafield: 'F001PESO', width: 100 },                                
            //                    { text: 'TOTAL DE FRACCIONES', datafield: 'I001SECFRA', width: 100 },
            //                    { text: 'TOTAL DE FRACCIONES', datafield: 'I001TOTFRA', width: 100 },
            //                    { text: 'DTA 1', datafield: 'F001TASDT1', width: 100 },
            //                    { text: 'DTA 2', datafield: 'F001TASDT2', width: 100 },
            //                    { text: 'TASA RECARGOS', datafield: 'F001TASREC', width: 115 },
            //                    { text: 'TASA PREVALIDACION', datafield: 'F001TASPRE', width: 115 },
            //                    { text: 'TIPO TASADTA 1', datafield: 'I001TTDTA1', width: 115 },
            //                    { text: 'TIPO TASADTA 2', datafield: 'I001TTDTA2', width: 115 },
            //                    { text: 'TIPO TASA RECARGOS', datafield: 'I001TTREC', width: 100 },
            //                    { text: 'TIPO TASA PREVALIDACION', datafield: 'I001TTPRE', width: 100 },
            //                    { text: 'OPERACION ORIGINAL DE UN R1', datafield: 'L001REFREC', width: 100 },
            //                    { text: 'OPERACION R1', datafield: 'L001REFR1', width: 100 },
            //                    { text: 'FECHA DE RECTIFICACION', datafield: 'D001FECR1' }
            //        ]
            //    });
            //$("#excelExport").jqxButton({ theme: 'bootstrap' });
            //$("#excelExport").on('click', function () {
            //    $("#jqxgrid").jqxGrid('exportdata', 'xls', 'jqxGrid', true, null, true, 'services/ExportContent.asmx/ExcelExport');
            //});
            //$("#cmdbusca").jqxButton({ theme: 'bootstrap' });
            //$("#cmdbusca").click(function () {
            //    optsvaluechanged();
            //});
            //var today = new Date();
            //var dd = today.getDate();
            //var mm = today.getMonth() + 1; //January is 0!
            //var yyyy = today.getFullYear();

            //if (dd < 10) {
            //    dd = '0' + dd
            //}
            //if (mm < 10) {
            //    mm = '0' + mm
            //}
            //today = yyyy + '-' + mm + '-' + dd;
            //if ($('#feci').val() == "")
            //    $('#feci').val(today);
            //if ($('#fecf').val() == "")
            //    $('#fecf').val(today);
            //var fechaini = $('#feci').val();
            //$("#jqxWidgetDatePicker").jqxDateTimeInput({ width: '150px', height: '25px', theme: 'bootstrap', formatString: 'yyyy-MM-dd' });
            //$("#jqxWidgetDatePicker").jqxDateTimeInput('setDate', fechaini);
            //var fechafin = $('#fecf').val();
            //$("#jqxWidgetDatePicker2").jqxDateTimeInput({ width: '150px', height: '25px', theme: 'bootstrap', formatString: 'yyyy-MM-dd' });
            //$("#jqxWidgetDatePicker2").jqxDateTimeInput('setDate', fechafin);

            //$("#cbotipo").jqxComboBox({ theme: 'bootstrap' });
            //$('#cbotipo').on('change', function () {
            //    optsvaluechanged();
            //});

    //    },
    //    error: function (xhr, textStatus, error) {
    //        if (typeof console == "object") {
    //            console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
    //        }
    //    }
    //});

    //function optsvaluechanged() {

    //    $('#jqxgrid').jqxGrid('showloadelement');
    //    var date1 = $("#jqxWidgetDatePicker").jqxDateTimeInput('getText');
    //    var date2 = $("#jqxWidgetDatePicker2").jqxDateTimeInput('getText');
    //    //var tipoop = $("#cbotipo").val();
    //    //var tipoadu = $("#cboaduana").val();

    //    fechas = {
    //        fechaini: date1,
    //        fechafin: date2
    //        //tipo: tipoop,
    //        //aduana: 240
    //    }

    //    $.ajax({
    //        type: 'POST',
    //        data: JSON.stringify(fechas),
    //        contentType: 'application/json; charset=utf-8',
    //        dataType: 'json',
    //        async: true,
    //        url: 'services/reportes.asmx/reppedimentogeneralS',
    //        success: function (data) {
    //            var data = $.parseJSON(data.d);
    //            var source =
    //                    {
    //                        localdata: data,
    //                        datatype: "json",
    //                        datafields: [
    //                                { name: 'C001PATEN', type: 'string' },
    //                                { name: 'C001ADUSEC', type: 'string' },
    //                                { name: 'C001REFPED', type: 'string' },
    //                                { name: 'C001NUMPED', type: 'string' },
    //                                { name: 'C001TIPOPE', type: 'string' },
    //                                { name: 'C001CVEDOC', type: 'string' },
    //                                { name: 'C001TIPREG', type: 'string' },
    //                                { name: 'C001DESORI', type: 'string' },
    //                                { name: 'C001MEDTRS', type: 'string' },
    //                                { name: 'C001MEDTRA', type: 'string' },
    //                                { name: 'C001MEDTRE', type: 'string' },
    //                                { name: 'F001TOTFAC', type: 'float' },
    //                                { name: 'F001VALCOE', type: 'float' },
    //                                { name: 'F001VALDOL', type: 'float' },
    //                                { name: 'F001TIPCAM', type: 'float' },
    //                                { name: 'F001FACMEX', type: 'float' },
    //                                { name: 'F001FACACT', type: 'float' },
    //                                { name: 'F001FACAJU', type: 'float' },
    //                                { name: 'D001FECARR', type: 'datetime' },
    //                                { name: 'D001FECPAG', type: 'datetime' },
    //                                { name: 'D001FECEP', type: 'datetime' },
    //                                { name: 'D001FECEXT', type: 'datetime' },
    //                                { name: 'F001VALSEG', type: 'float' },
    //                                { name: 'F001FLETES', type: 'float' },
    //                                { name: 'F001SEGURO', type: 'float' },
    //                                { name: 'F001EMBALA', type: 'float' },
    //                                { name: 'F001OTRINC', type: 'float' },
    //                                { name: 'N001TOTINC', type: 'float' },
    //                                { name: 'N001VALADU', type: 'float' },
    //                                { name: 'N001VALCOM', type: 'float' },
    //                                { name: 'C001MARNUM', type: 'string' },
    //                                { name: 'F001PESO', type: 'string' },
    //                                { name: 'C001NOMCLI', type: 'string' },
    //                                { name: 'C001RFCCLI', type: 'string' },
    //                                { name: 'I001SECFRA', type: 'int' },
    //                                { name: 'I001TOTFRA', type: 'int' },
    //                                { name: 'F001TASDT1', type: 'float' },
    //                                { name: 'F001TASDT2', type: 'float' },
    //                                { name: 'F001TASREC', type: 'float' },
    //                                { name: 'F001TASPRE', type: 'float' },
    //                                { name: 'I001TTDTA1', type: 'int' },
    //                                { name: 'I001TTDTA2', type: 'int' },
    //                                { name: 'I001TTREC', type: 'int' },
    //                                { name: 'I001TTPRE', type: 'int' },
    //                                { name: 'L001REFREC', type: 'float' },
    //                                { name: 'L001REFR1', type: 'float' },
    //                                { name: 'D001FECR1', type: 'datetime' }
    //                        ]
    //                    };
    //            var dataAdapter = new $.jqx.dataAdapter(source, {
    //                loadComplete: function () { },
    //                loadError: function (xhr, status, error) { }
    //            });
    //            $('#jqxgrid').jqxGrid({ source: dataAdapter });
    //        },
    //        error: function (xhr, textStatus, error) {
    //            if (typeof console == "object") {
    //                console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
    //            }
    //        },
    //        complete: function () {
    //            $('#jqxgrid').jqxGrid('hideloadelement');
    //        }
    //    });
    //}

    //new $.fn.dataTable.FixedHeader(table);
//});
    namespace.repoedimentogral = new repoedimentogral;
}(this.materialadmin, jQuery));