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
        var cellclass = function (row, column, value) {
            var color = this.owner.source.records[row]['tpstatusaduana'];
            console.log(color);
            switch (color) {
                case "CARGADO":
                    return "gray";
                    break;
                case "SALIO DE PATIO":
                    return "yellow";
                    break;
                case "CRUZE ROJO":
                    return "style-danger";
                    break;
                case "CRUZE VERDE":
                    return "style-success";
                    break;
                case "PEDIMENTO PAGADO":
                    return "style-default-dark";
                    break;
                case "CRUZE ROJO GAMA":
                    return "style-warning";
                    break;
                case "DESADUANADO":
                    return "style-primary-dark";
                    break;
            }
        };
        var cellclassstatus = function (row, column, value) {
            var color = this.owner.source.records[row]['tpstatus'];
            switch (color) {
                case "DOC DIG":
                    return "aqua";
                    break;
                case "CAM REQ":
                    return "yellow";
                    break;
                case "PROF LISTA":
                    return "aqua";
                    break;
                case "COVE LISTO":
                    return "brown";
                    break;
                case "PAGO AUT":
                    return "aqua";
                    break;
                case "VALIDANDO":
                    return "gray";
                    break;
                case "PAGADO":
                    return "brown";
                    break;
                case "CANCELADO":
                    return "red";
                    break;
                case "REV DOC":
                    return "gray";
                    break;
            }
        };
        var cellclassstatusrem = function (row, column, value) {
            var color = this.owner.source.records[row]['tpstatusbodid'];
            switch (color) {
                case "CANCELADA":
                    return "red";
                    break;
            }
        };
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
                    /*$("#excelExport").on('click', function () {
                        $("#jqxgrid").jqxGrid('exportdata', 'xls', 'jqxGrid', true, null, true, 'services/ExportContent.asmx/ExcelExport');
                    });*/
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
                        if ($.trim($(args).text()) == "Ver/Capturar historial de trafico") {
                            var dataRecord = $("#jqxgrid").jqxGrid('getrowdata', rowindex);
                            
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
                    { text: 'CONS', datafield: 'tpclaveconsolidado', cellclassname: cellclass, width: 50, pinned: true },
                    { text: 'TRAFICO', datafield: 'tpreferencia', cellclassname: cellclass, width: 80, pinned: true },
                    { text: 'CLIENTE', datafield: 'srazonsocial', cellclassname: cellclass, width: 100, aggregates: ['count'] },
                    { text: 'EST PED', datafield: 'tpstatus', cellclassname: cellclassstatus, width: 85 },
                    { text: 'VEHICULO', datafield: 'vehiculo', cellclassname: cellclass, width: 100 },
                    { text: 'TRANSFER', datafield: 'transfer', cellclassname: cellclass, width: 100 },
                    { text: 'CAAT', datafield: 'snumerocaat', cellclassname: cellclass, width: 40 },
                    { text: 'LN MEX', datafield: 'snombre', cellclassname: cellclass, width: 100 },
                    { text: 'DODA', datafield: 'tpdoda', cellclassname: cellclass, width: 75 },
                    { text: 'ITN', datafield: 'tpitn', cellclassname: cellclass, width: 125 },
                    { text: 'HORA', datafield: 'tphoraestimada', cellclassname: cellclass, width: 75 },
                    { text: 'AD', datafield: 'scveaduana', cellclassname: cellclass, width: 30 },
                    { text: 'TP', datafield: 'scvedocumento', cellclassname: cellclass, width: 35 },
                    { text: 'PEDIM', datafield: 'snumpedimento', cellclassname: cellclass, width: 60 },
                    { text: 'EJ PED', datafield: 'tpelabora', cellclassname: cellclass, width: 75 },
                    { text: 'EJ TRAF', datafield: 'tpejecutivo', cellclassname: cellclass, width: 75 },
                    { text: 'OBSERVACIONES', datafield: 'tpobs', cellclassname: cellclass, width: 200 },
                    { text: 'EST BOD', datafield: 'tpstatusbodid', cellclassname: cellclassstatusrem, width: 100 },
                    { text: 'BULTOS', datafield: 'smarcas', cellclassname: cellclass, width: 75 },
                    { text: 'ET', datafield: 'tpgrupotrabajo', cellclassname: cellclass, width: 30 },
                    { text: 'OR CARGA', datafield: 'iconsecutivoordencarga', cellclassname: cellclassstatusrem, width: 50 },
                    { text: 'INI CARGA', columntype: 'button', datafield: 'tpfechainicarga', cellclassname: cellclass, width: 75},
                    { text: 'FIN CARGA', columntype: 'button', datafield: 'tpfechafincarga', cellclassname: cellclass, width: 75},
                    { text: 'SAL PATIO', columntype: 'button', datafield: 'tpfechasalidapatio', cellclassname: cellclass, width: 75},
                    { text: 'O CARGA SAL', datafield: 'tpremisionsalida', cellclassname: cellclass, width: 75 },
                    { text: '', datafield: 'tpid', hidden: true }
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
            url: 'services/reportes.asmx/getrepprogramacion',
            success: function (data) {
                console.log("return",data)
                var data = $.parseJSON(data.d);
                var source =
                        {
                            localdata: data,
                            datatype: "json",
                            datafields: [
                                        { name: 'tpid', type: 'int' },
                                        { name: 'tphoraestimada', type: 'string' },
                                        { name: 'srazonsocial', type: 'string' },
                                        { name: 'dfechacruce', type: 'string' },
                                        { name: 'vehiculo', type: 'string' },
                                        { name: 'transfer', type: 'string' },
                                        { name: 'snumerocaat', type: 'string' },
                                        { name: 'snombre', type: 'string' },
                                        { name: 'scveaduana', type: 'string' },
                                        { name: 'etipooperacion', type: 'string' },
                                        { name: 'tpreferencia', type: 'string' },
                                        { name: 'scvedocumento', type: 'string' },
                                        { name: 'snumpedimento', type: 'string' },
                                        { name: 'susuarioingreso', type: 'string' },
                                        { name: 'tpsuatus', type: 'string' },
                                        { name: 'scomentariosgenerales', type: 'string' },
                                        { name: 'iconsecutivoordencarga', type: 'string' },
                                        { name: 'smarcas', type: 'string' },
                                        { name: 'tpitn', type: 'string' },
                                        { name: 'tpdoda', type: 'string' },
                                        { name: 'tpobs', type: 'string' },
                                        { name: 'tpejecutivo', type: 'string' },
                                        { name: 'tpelabora', type: 'string' },
                                        { name: 'tpstatus', type: 'string' },
                                        { name: 'tpstatusbodid', type: 'string' },
                                        { name: 'tpstatusaduana', type: 'string' },
                                        { name: 'tpgrupotrabajo', type: 'int' },
                                        { name: 'tpclaveconsolidado', type: 'string' },
                                        { name: 'tpfechainicarga', type: 'string' },
                                        { name: 'tpfechafincarga', type: 'string' },
                                        { name: 'tpfechasalidapatio', type: 'string' },
                                        { name: 'tpremisionsalida', type: 'string' },
                                        { name: 'tpentrada', type: 'string' }
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
    namespace.repoedimentogral = new repoedimentogral;
}(this.materialadmin, jQuery));