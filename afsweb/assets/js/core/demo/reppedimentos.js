(function (namespace, $) {
    "use strict";

    var reppedimentos = function () {
        // Create reference to this instance
        var o = this;
        // Initialize app when document is ready
        $(document).ready(function () {
            o.initialize();
        });

    };
    var p = reppedimentos.prototype;
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
                                { text: 'Pedimento', datafield: 'PEDIMENTO', width: 125, aggregates: ['count'] },
                                { text: 'Referencia', datafield: 'C001REFPED', width: 100 },
                                { text: 'Tipo', datafield: 'C001TIPOPE', width: 100 },
                                { text: 'Aduana', datafield: 'C001ADUSEC', width: 50 },
                                { text: 'Clave Cliente', datafield: 'C001CVECLI', width: 100 },
                                { text: 'Cliente', datafield: 'C001NOMCLI', width: 200 },
                                { text: 'Clave', datafield: 'C001CVEDOC', width: 50 },
                                { text: 'Nombre de Cuenta', datafield: 'C606NOMBRE', width: 200 },
                                { text: 'Banco', datafield: 'C606BANCO', width: 100 },
                                { text: 'Importe Efectivo', datafield: 'N036TOTEFE', width: 100, cellsformat: 'c', aggregates: ['sum'] },
                                { text: 'Fecha de Pago', datafield: 'D036FECPAG' }
                    ]
                });

    }
    p._refreshGrid = function () {
        $('#jqxgrid').jqxGrid('showloadelement');
        var date1 = $("#jqxWidgetDatePicker").jqxDateTimeInput('getText');
        var date2 = $("#jqxWidgetDatePicker2").jqxDateTimeInput('getText');

        var fechas = {
            fechaini: date1,
            fechafin: date2,
            tipo: 1
        }
        //$("#loading").show();
        $.ajax({
            type: 'POST',
            data: JSON.stringify(fechas),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            url: 'services/reppedimentos.asmx/reppedimentospagados',
            success: function (data) {

                var data = $.parseJSON(data.d);
                var source =
                        {
                            localdata: data,
                            datatype: "json",
                            datafields:
                    [
                        { name: 'C001ADUSEC', type: 'string' },
                        { name: 'C001CVECLI', type: 'string' },
                        { name: 'C001REFPED', type: 'string' },
                        { name: 'PEDIMENTO', type: 'string' },
                        { name: 'C001NOMCLI', type: 'string' },
                        { name: 'C001TIPOPE', type: 'string' },
                        { name: 'C001CVEDOC', type: 'string' },
                        { name: 'C606NOMBRE', type: 'string' },
                        { name: 'C606BANCO', type: 'string' },
                        { name: 'N036TOTEFE', type: 'currency' },
                        { name: 'D036FECPAG', type: 'datetime' }
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
    namespace.reppedimentos = new reppedimentos;
}(this.materialadmin, jQuery));