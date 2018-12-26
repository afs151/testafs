(function (namespace, $) {
    "use strict";

    var reppedpagdes = function () {
        // Create reference to this instance
        var o = this;
        // Initialize app when document is ready
        $(document).ready(function () {
            o.initialize();
        });

    };
    var p = reppedpagdes.prototype;
    var theme = 'bootstrap';
    // =========================================================================
    // INIT
    // =========================================================================
    p.initialize = function () {
        this._loadDom();
        this._refreshGrid();
    };

    p._loadDom = function () {
        var cellclass = function (row, column, value) {
            var color = this.owner.source.records[row]['FECHADES'];
            console.log(color);
            switch (color) {
                case "":
                    return "style-danger";
                    break;
                case null:
                    return "style-danger";
                    break;
            }
        };

        $("#jqxgrid").jqxGrid(
                {
                    width: '100%',
                    filterable: true,
                    sortable: true,
                    altrows: true,
                    columnsresize: true,
                    showtoolbar: true,
                    showfilterrow: true,
                    showstatusbar: true,
                    showaggregates: true,
                    theme: theme,
                    rendertoolbar: function (toolbar) {
                        var me = this;
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
                        $("#excelExport").jqxButton({ theme: theme });
                        $("#excelExport").on('click', function () {
                            $("#jqxgrid").jqxGrid('exportdata', 'xls', 'jqxGrid', true, null, true, 'services/ExportContent.asmx/ExcelExport');
                        });
                        $("#cmdbusca").jqxButton({ theme: theme });
                        $("#cmdbusca").click(function () {
                            p._refreshGrid();
                        });
                        var today = new Date();
                        var dd = today.getDate();
                        var mm = today.getMonth() + 1; 
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
                        $("#jqxWidgetDatePicker").jqxDateTimeInput({ width: '150px', height: '25px', theme: theme, formatString: 'yyyy-MM-dd' });
                        $("#jqxWidgetDatePicker").jqxDateTimeInput('setDate', fechaini);
                        var fechafin = $('#fecf').val();
                        $("#jqxWidgetDatePicker2").jqxDateTimeInput({ width: '150px', height: '25px', theme: theme, formatString: 'yyyy-MM-dd' });
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
                                { text: 'PEDIMENTO', datafield: 'C001NUMPED', width: 100, aggregates: ['count'], cellclassname: cellclass },
                                { text: 'REFERENCIA', datafield: 'C001REFPED', width: 100, cellclassname: cellclass },
                                { text: 'TIPO', datafield: 'C001TIPOPE', width: 75, cellclassname: cellclass },
                                { text: 'ADUANA', datafield: 'C001ADUSEC', width: 75, cellclassname: cellclass },
                                { text: 'PATENTE', datafield: 'C001PATEN', width: 75, cellclassname: cellclass },
                                { text: 'NOMBRE CLIENTE', datafield: 'C001NOMCLI', width: 200, cellclassname: cellclass },
                                { text: 'CLAVE DOCUMENTO', datafield: 'C001CVEDOC', width: 100, cellclassname: cellclass },
                                { text: 'TIPO REGIMEN', datafield: 'C001TIPREG', width: 100, cellclassname: cellclass },
                                { text: 'FECHA DE PAGO', datafield: 'D001FECPAG', width: 150, cellclassname: cellclass },
                                { text: 'FECHA DESADUANADO', datafield: 'FECHADES', cellclassname: cellclass },
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
        }
        //$("#loading").show();
        $.ajax({
            type: 'POST',
            data: JSON.stringify(fechas),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            url: 'services/reppedimentos.asmx/reppedimentospagadosdesaduanados',
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
                                        { name: 'FECHADES', type: 'datetime' }
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
    namespace.reppedpagdes = new reppedpagdes;
}(this.materialadmin, jQuery));