
(function (namespace, $) {
    "use strict";

    var repanexo24 = function () {
        var o = this;
        $(document).ready(function () {
            o.initialize();
        });

    };
    var p = repanexo24.prototype;
    var theme = 'bootstrap';
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
                //sortable: true,
                columnsresize: false,
                //autoheight: true,
                // autorowheight: true,
                //pageable: true,
                showtoolbar: true,
                showfilterrow: true,
                //showstatusbar: true,
                //showaggregates: true,
                theme: 'bootstrap',
                //altrows: true,
                rendertoolbar: function (toolbar) {
                    var me = this;
                    // Create html
                    var html = '';
                    html += '<div style="margin: 5px;">';
                    html += '	<span style="float: left; margin-top: 5px; margin-right: 4px;">Seleccione rango de fechas:</span>';
                    html += '	<span style="float: left; margin-top: 0px; margin-right: 4px;"><div id="jqxWidgetDatePicker"></div></span>';
                    html += '	<span style="float: left; margin-top: 0px; margin-right: 4px;"><div id="jqxWidgetDatePicker2"></div></span>';
                    html += '	<span style="float: left; margin-top: 0px; margin-right: 4px;"><div><button type="button" class="btn" tooltip="Cargar fechas" id="cmdbusca"><i class="md md-find-in-page"></i></button></div></span>';
                    html += '	<span style="float: left; margin-top: 5px; margin-right: 4px;">Cliente:</span>';
                    html += '	<span style="float: left; margin-top: 0px; margin-right: 4px;">';
                    html += '	    <select id="cbocli" style="max-width: 300px;">';
                    html += '	    </select>';
                    html += '	</span>';
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
                    $.ajax({
                        type: 'POST',
                        //data: JSON.stringify(useriddata),
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json',
                        async: true,
                        url: 'services/reppedimentos.asmx/repfillcboclientes',
                        success: function (data) {
                            var data = $.parseJSON(data.d);
                            if (data.length > 0) {
                                $("#cbocli").append("<option value=''>TODOS</option>");
                                $.each(data, function (key, value) {
                                    $("#cbocli").append("<option value=" + value.RFC + ">" + value.NOM + "</option>");
                                    // $("#cbocli").append("<option value=" + value.IATA + ">" + value.aeropuerto + "</option>");
                                });
                            }
                            else {
                                alert('Error');
                            }
                        },
                        error: function (xhr, textStatus, error) {
                            if (typeof console == "object") {
                                console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                            }
                        }
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
                                referencia: dataRecord.REFERENCIA
                            }
                            $.ajax({
                                type: 'POST',
                                data: JSON.stringify(datatosend),
                                contentType: 'application/json; charset=utf-8',
                                dataType: 'json',
                                url: 'services/reportes.asmx/VisorPed',
                                success: function (data) {
                                    var obj = $.parseJSON(data.d).data;
                                    var url = 'https://localhost/vdigital.aspx?key=' + obj[0].encref;
                                    window.open(url);
                                },
                                error: function (xhr, textStatus, error) {
                                    if (typeof console == "object") {
                                        console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                                    }
                                }
                            });
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
                },
                columns: [
                    { text: 'PEDIMENTO', datafield: 'PEDIMENTO', width: 75 },
                    { text: 'REFERENCIA', datafield: 'REFERENCIA', aggregates: ['count'], width: 75 },
                    { text: 'ADUANA', datafield: 'ADUANA', width: 75 },
                    { text: 'CLAVE PED', datafield: 'CLAVE_PEDIMENTO', width: 100 },
                    { text: 'FECHA PAGO', datafield: 'FECHA_PAGO', width: 125 },
                    { text: 'TIPO CAMBIO', datafield: 'TIPO_CAMBIO', width: 100 },
                    { text: 'SEGUROS', datafield: 'SEGUROS', width: 100 },
                    { text: 'FLETES', datafield: 'FLETES', width: 100 },
                    { text: 'EMBALAJES', datafield: 'EMBALAJES', width: 100 },
                    { text: 'OTROS', datafield: 'OTROS', width: 100 },
                    { text: 'DTA', datafield: 'DTA', width: 100 },
                    { text: 'PREVAL', datafield: 'PREVAL', width: 100 },
                    { text: 'IGI', datafield: 'IGI', width: 100 },
                    { text: 'IVA', datafield: 'IVA', width: 100 },
                    { text: 'ECI', datafield: 'ECI', width: 100 },
                    { text: 'REC', datafield: 'REC', width: 100 },
                    { text: 'FACTOR CONVERSION', datafield: 'FACTOR_CONVERSION', width: 100 },
                    { text: 'VALOR COMERCIAL', datafield: 'VALOR_COMERCIAL', width: 100 },
                    { text: 'VALOR DOLARES', datafield: 'VALOR_DOLARES', width: 100 },
                    { text: 'TOTAL INCREMENTABLES', datafield: 'TOTAL_INCREMENTABLES', width: 100 },
                    { text: 'VALOR ADUANA', datafield: 'VALOR_ADUANA', width: 100 },
                    { text: 'FACTURA', datafield: 'FACTURA', width: 100 },
                    { text: 'FECHA FACTURA', datafield: 'FECHA_FACTURA', width: 200 },
                    { text: 'PROVEEDOR', datafield: 'PROVEEDOR', width: 200 },
                    { text: 'VALOR FACTURA', datafield: 'VALOR_FACTURA', width: 100 },
                    { text: 'COVE', datafield: 'COVE', width: 125 },
                    { text: 'INCOTERM', datafield: 'INCOTERM', width: 100 },
                    { text: 'RENGLON', datafield: 'RENGLON', width: 100 },
                    { text: 'NUMERO PARTE', datafield: 'NUMERO_PARTE', width: 100 },
                    { text: 'PAIS ORIGEN', datafield: 'PAIS_ORIGEN', width: 100 },
                    { text: 'PAIS VENDEDOR', datafield: 'PAIS_VENDEDOR', width: 100 },
                    { text: 'FRACCION', datafield: 'FRACCION', width: 100 },
                    { text: 'DESCRIPCION', datafield: 'DESCRIPCION', width: 200 },
                    { text: 'PRECIO UNITARIO', datafield: 'PRECIO_UNITARIO', width: 100 },
                    { text: 'UMT', datafield: 'UMT', width: 100 },
                    { text: 'CANTIDAD_UMT', datafield: 'CANTIDAD_UMT', width: 100 },
                    { text: 'UMC', datafield: 'UMC', width: 100 },
                    { text: 'CANTIDAD_UMC', datafield: 'CANTIDAD_UMC', width: 100 },
                    { text: 'TOTAL PARTIDA', datafield: 'TOTAL_PARTIDA', width: 125 }

                ]
            });


    }
    p._refreshGrid = function () {
        $('#jqxgrid').jqxGrid('showloadelement');
        var date1 = $("#jqxWidgetDatePicker").jqxDateTimeInput('getText');
        var date2 = $("#jqxWidgetDatePicker2").jqxDateTimeInput('getText');
        var rfc = $("#cbocli").val();
        var fechas = {
            fechaini: date1,
            fechafin: date2,
            rfc: rfc
        }
        $.ajax({
            type: 'POST',
            data: JSON.stringify(fechas),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            url: 'services/reppedimentos.asmx/repnumpartes24',
            success: function (data) {

                var data = $.parseJSON(data.d);
                var source =
                    {
                        localdata: data,
                        datatype: "json",
                        datafields:
                            [
                                { name: 'PEDIMENTO', type: 'string' },
                                { name: 'REFERENCIA', type: 'string' },
                                { name: 'ADUANA', type: 'string' },
                                { name: 'CLAVE_PEDIMENTO', type: 'string' },
                                { name: 'FECHA_PAGO', type: 'datetime' },
                                { name: 'TIPO_CAMBIO', type: 'string' },
                                { name: 'SEGUROS', type: 'float' },
                                { name: 'FLETES', type: 'float' },
                                { name: 'EMBALAJES', type: 'float' },
                                { name: 'OTROS', type: 'float' },
                                { name: 'DTA', type: 'float' },
                                { name: 'PREVAL', type: 'float' },
                                { name: 'IGI', type: 'float' },
                                { name: 'IVA', type: 'float' },
                                { name: 'ECI', type: 'float' },
                                { name: 'REC', type: 'float' },
                                { name: 'FACTURA', type: 'string' },
                                { name: 'FECHA_FACTURA', type: 'datetime' },
                                { name: 'PROVEEDOR', type: 'string' },
                                { name: 'VALOR_FACTURA', type: 'float' },
                                { name: 'FACTOR_CONVERSION', type: 'float' },
                                { name: 'VALOR_COMERCIAL', type: 'float' },
                                { name: 'VALOR_DOLARES', type: 'float' },
                                { name: 'TOTAL_INCREMENTABLES', type: 'float' },
                                { name: 'VALOR_ADUANA', type: 'float' },
                                { name: 'NUMERO_PARTE', type: 'string' },
                                { name: 'RENGLON', type: 'string' },
                                { name: 'PAIS_ORIGEN', type: 'string' },
                                { name: 'PAIS_VENDEDOR', type: 'string' },
                                { name: 'FRACCION', type: 'string' },
                                { name: 'DESCRIPCION', type: 'string' },
                                { name: 'PRECIO_UNITARIO', type: 'string' },
                                { name: 'CANTIDAD_FACTURA', type: 'string' },
                                { name: 'UMT', type: 'string' },
                                { name: 'CANTIDAD_UMT', type: 'string' },
                                { name: 'UMC', type: 'string' },
                                { name: 'CANTIDAD_UMC', type: 'string' },
                                { name: 'VALOR_COMERCIAL', type: 'string' },
                                //{ name: 'FRACCION', type: 'string' },
                                //{ name: 'DESCRIPCION', type: 'string' },
                                { name: 'PRECIO_PAGADO', type: 'string' },
                                { name: 'VALOR_PARTIDA', type: 'string' },
                                { name: 'TOTAL_PARTIDA', type: 'string' },
                                { name: 'COVE', type: 'string' },
                                { name: 'INCOTERM', type: 'string' },
                            ]
                    };
                var dataAdapter = new $.jqx.dataAdapter(source, {
                    loadComplete: function () { $("#loading").hide(); },
                    loadError: function (xhr, status, error) { }
                });
                $('#jqxgrid').jqxGrid({ source: dataAdapter });
            },
            error: function (xhr, textStatus, error) {
                if (typeof console == "object") {
                    console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                }
            }
        });
    }
    //function optsvaluechanged() {

    //    $('#jqxgrid').jqxGrid('showloadelement');
    //    var date1 = $("#jqxWidgetDatePicker").jqxDateTimeInput('getText');
    //    var date2 = $("#jqxWidgetDatePicker2").jqxDateTimeInput('getText');
    //    // var tipoop = $("#cbotipo").val();
    //    //var tipoadu = $("#cboaduana").val();

    //    fechas = {
    //        fechaini: date1,
    //        fechafin: date2,
    //        //tipo: tipoop,
    //        //aduana: 240
    //    }

    //    $.ajax({
    //        type: 'POST',
    //        data: JSON.stringify(fechas),
    //        contentType: 'application/json; charset=utf-8',
    //        dataType: 'json',
    //        async: true,
    //        url: 'services/reportes.asmx/repnumpartes24',
    //        success: function (data) {
    //            var data = $.parseJSON(data.d);
    //            var source =
    //                    {
    //                        localdata: data,
    //                        datatype: "json",
    //                        datafields: [
    //                                 { name: 'PEDIMENTO', type: 'string' },
    //                                { name: 'REFERENCIA', type: 'string' },
    //                                { name: 'ADUANA', type: 'string' },
    //                                { name: 'CLAVE_PEDIMENTO', type: 'string' },
    //                                { name: 'FECHA_PAGO', type: 'datetime' },
    //                                { name: 'TIPO_CAMBIO', type: 'string' },
    //                                { name: 'SEGUROS', type: 'float' },
    //                                { name: 'FLETES', type: 'float' },
    //                                { name: 'EMBALAJES', type: 'float' },
    //                                { name: 'OTROS', type: 'float' },
    //                                { name: 'DTA', type: 'float' },
    //                                { name: 'PREVAL', type: 'float' },
    //                                { name: 'IGI', type: 'float' },
    //                                { name: 'IVA', type: 'float' },
    //                                { name: 'ECI', type: 'float' },
    //                                { name: 'REC', type: 'float' },
    //                                { name: 'FACTURA', type: 'string' },
    //                                { name: 'FECHA_FACTURA', type: 'datetime' },
    //                                { name: 'PROVEEDOR', type: 'string' },
    //                                { name: 'VALOR_FACTURA', type: 'float' },
    //                                { name: 'FACTOR_CONVERSION', type: 'float' },
    //                                { name: 'VALOR_COMERCIAL', type: 'float' },
    //                                { name: 'VALOR_COLARES', type: 'float' },
    //                                { name: 'TOTAL_INCREMENTABLES', type: 'float' },
    //                                { name: 'VALOR_ADUANA', type: 'float' },
    //                                { name: 'NUMERO_PARTE', type: 'string' },
    //                                { name: 'RENGLON', type: 'string' },
    //                                { name: 'PAIS_ORIGEN', type: 'string' },
    //                                { name: 'FRACCION', type: 'string' },
    //                                { name: 'DESCRIPCION', type: 'string' },
    //                                { name: 'PRECIO_UNITARIO', type: 'string' },
    //                                { name: 'CANTIDAD_FACTURA', type: 'string' },
    //                                { name: 'UNIDAD_MEDIDA', type: 'string' },
    //                                { name: 'VALOR_COMERCIAL', type: 'string' },
    //                                //{ name: 'FRACCION', type: 'string' },
    //                                //{ name: 'DESCRIPCION', type: 'string' },
    //                                { name: 'PRECIO_PAGADO', type: 'string' },
    //                                { name: 'VALOR_PARTIDA', type: 'string' },
    //                                { name: 'TOTAL_PARTIDA', type: 'string' },
    //                                { name: 'COVE', type: 'string' },
    //                                { name: 'INCOTERM', type: 'string' },
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
    //                ssss
    //                console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
    //            }
    //        },
    //        complete: function () {
    //            $('#jqxgrid').jqxGrid('hideloadelement');
    //        }
    //    });
    //}

    //new $.fn.dataTable.FixedHeader(table);
    namespace.repanexo24 = new repanexo24;
}(this.materialadmin, jQuery));
