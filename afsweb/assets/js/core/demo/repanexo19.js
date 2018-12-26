(function (namespace, $) {
    "use strict";

    var repanexo19 = function () {
        // Create reference to this instance
        var o = this;
        // Initialize app when document is ready
        $(document).ready(function () {
            o.initialize();
        });

    };
    var p = repanexo19.prototype;
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
                        var dd = today.getDate() - 1;//El reporte tiene a partir de un dia antes
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
                                { text: 'FECHA ENTRADA', datafield: 'Fecha_Entrada', width: 125 },
                                { text: 'CLAVE DOCUMENTO', datafield: 'Clave_Doc', width: 100 },
                                { text: 'TIPO', datafield: 'Tipo_OP', width: 75 },
                                { text: 'PEDIMENTO', datafield: 'Pedimento', width: 75, aggregates: ['count'] },
                                { text: 'RFC', datafield: 'RFC', width: 125 },
                                { text: 'PAIS VENDEDOR', datafield: 'Pais_Vendedor', width: 100 },
                                { text: 'PAIS ORIGEN', datafield: 'Pais_Origen', width: 100 },
                                { text: 'MEDIO TRANSPORTE', datafield: 'Medio_Transporte', width: 125 },
                                { text: 'FRACCION', datafield: 'Fraccion', width: 100 },
                                { text: 'UMT', datafield: 'UMT', width: 75 },
                                { text: 'CANTIDAD UMT', datafield: 'Cantidad_UMT', width: 100 },
                                { text: 'UMC', datafield: 'UMC', width: 75 },
                                { text: 'CANTIDAD UMC', datafield: 'Cantidad_UMC', width: 100 },
                                { text: 'VALOR ADUANA', datafield: 'Valor_Aduana', width: 100 },
                                { text: 'FLETES', datafield: 'Fletes', width: 100 },
                                { text: 'SEGUROS', datafield: 'Seguros', width: 100 },
                                { text: 'EMBALAJES', datafield: 'Embalajes', width: 100 },
                                { text: 'INCREMENTABLES', datafield: 'Incrementables', width: 100 },
                                { text: 'FECHA PAGO', datafield: 'Fecha_Pago', width: 100 },
                                { text: 'VALOR MERCANCIA', datafield: 'Valor_Mercancia', width: 100 },
                                { text: 'VALOR AGREGADO', datafield: 'Valor_Agregado', width: 100 },
                                { text: 'PATENTE', datafield: 'Patente', width: 75 },
                                { text: 'IDENTIFICADORES GENERAL', datafield: 'Identificadores_General', width: 200 },
                                { text: 'PERMISOS', datafield: 'Permisos', width: 200 },
                                { text: 'IDENTIFICADORES PARTIDA', datafield: 'Identificadores_Partida', width: 200 },
                                { text: 'OBSERVACIONES', datafield: 'Observaciones', width: 200 },
                                { text: 'CONTENEDOR', datafield: 'Contenedor', width: 200 },
                                                        
                    ]
                });
        
    }
    p._refreshGrid = function () {
        $('#jqxgrid').jqxGrid('showloadelement');
        var date1 = $("#jqxWidgetDatePicker").jqxDateTimeInput('getText');
        var date2 = $("#jqxWidgetDatePicker2").jqxDateTimeInput('getText');

        var fechas = {
            fechaini: date1,
            fechafin: date2
        }
        //$("#loading").show();
        $.ajax({
            type: 'POST',
            data: JSON.stringify(fechas),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            url: 'services/reppedimentos.asmx/repanexo19',
            success: function (data) {

                var data = $.parseJSON(data.d);
                var source =
                        {
                            localdata: data,
                            datatype: "json",
                            datafields: [
                                        { name: 'Fecha_Entrada', type: 'datetime' },
                                        { name: 'Clave_Doc', type: 'string' },
                                        { name: 'Tipo_OP', type: 'string' },
                                        { name: 'Pedimento', type: 'string' },
                                        { name: 'RFC', type: 'string' },
                                        { name: 'Pais_Vendedor', type: 'string' },
                                        { name: 'Pais_Origen', type: 'string' },
                                        { name: 'Medio_Transporte', type: 'string' },
                                        { name: 'Fraccion', type: 'string' },
                                        { name: 'UMT', type: 'string' },
                                        { name: 'Cantidad_UMT', type: 'string' },
                                        { name: 'UMC', type: 'string' },
                                        { name: 'Cantidad_UMC', type: 'string' },
                                        { name: 'Valor_Aduana', type: 'float' },
                                        { name: 'Fletes', type: 'float' },
                                        { name: 'Seguros', type: 'float' },
                                        { name: 'Embalajes', type: 'float' },
                                        { name: 'Incrementables', type: 'float' },
                                        { name: 'Fecha_Pago', type: 'datetime' },
                                        { name: 'Valor_Mercancia', type: 'float' },
                                        { name: 'Valor_Agregado', type: 'float' },
                                        { name: 'Patente', type: 'string' },
                                        { name: 'Identificadores_General', type: 'string' },
                                        { name: 'Permisos', type: 'string' },
                                        { name: 'Identificadores_Partida', type: 'string' },
                                        { name: 'Observaciones', type: 'string' },
                                        { name: 'Contenedor', type: 'string' }
                                                                     
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
                $('#jqxgrid').jqxGrid('hideloadelement');
            }
        });
    }
    namespace.repanexo19 = new repanexo19;
}(this.materialadmin, jQuery));