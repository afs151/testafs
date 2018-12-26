
$(document).ready(function () {
    var fechas = {
        fechaini: '',
        fechafin: '',
        tipo: 1
    }
    $("#loading").show();
    $.ajax({
        type: 'POST',
        data: JSON.stringify(fechas),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true,
        url: 'services/reppedimentos.asmx/repsolimpuestosim',
        success: function (data) {

            var data = $.parseJSON(data.d);
            var source =
                    {
                        localdata: data,
                        datatype: "json",
                        datafields:
                        [
                            { name: 'C001CVECLI', type: 'string' },
                            { name: 'C001NOMCLI', type: 'string' },
                            { name: 'C001RFCCLI', type: 'string' },
                            { name: 'C001REFPED', type: 'string' },
                            { name: 'C001NUMPED', type: 'string' },
                            { name: 'C001TIPOPE', type: 'string' },
                            { name: 'C004NUMCON', type: 'string' },
                            { name: 'N008IMPCON', type: 'currency' },
                            { name: 'N008IMPCONFP', type: 'currency' },
                            { name: 'D001FECPAG', type: 'datetime' }
                        ]
                    };
            var dataAdapter = new $.jqx.dataAdapter(source, {
                loadComplete: function () { $("#loading").hide(); },
                loadError: function (xhr, status, error) { }
            });


            $("#jqxgrid").jqxGrid(
                {
                    width: '100%',
                    source: dataAdapter,
                    filterable: true,
                    sortable: true,
                    altrows: true,
                    columnsresize: true,
                    showtoolbar: true,
                    showfilterrow: true,
                    showstatusbar: true,
                    showaggregates: true,
                    theme: 'bootstrap',
                    altrows: true,
                    rendertoolbar: function (toolbar) {
                        var me = this;
                        // Create html
                        var html = '';
                        html += '<div style="margin: 5px;">';
                        html += '	<span style="float: left; margin-top: 5px; margin-right: 4px;">Seleccione rango de fechas:</span>';
                        html += '	<span style="float: left; margin-top: 0px; margin-right: 4px;"><div id="jqxWidgetDatePicker"></div></span>';
                        html += '	<span style="float: left; margin-top: 0px; margin-right: 4px;"><div id="jqxWidgetDatePicker2"></div></span>';
                        html += '	<span style="float: left; margin-top: 0px; margin-right: 4px;"><div><button type="button" class="btn" tooltip="Cargar fechas" id="cmdbusca"><i class="md md-find-in-page"></i></button></div></span>';
                        html += '	<span style="float: left; margin-top: 5px; margin-right: 4px;">Tipo de operacion:</span>';
                        html += '	<span style="float: left; margin-top: 0px; margin-right: 4px;">';
                        html += '	    <select id="cbotipo">';
                        html += '	        <option value="1">Importacion</option>';
                        html += '	        <option value="0">Exportacion</option>';
                        html += '	        <option value="3">Ambos</option>';
                        html += '	    </select>';
                        html += '	</span>';
                        html += '	<div><input type="button" value="Export to Excel" id="excelExport" /></div>';
                        html += '</div>';
                        var $new = $(html);
                        toolbar.append($new);
                    },
                    columns: [
                                { text: 'Pedimento', datafield: 'C001NUMPED', width: 150 },
                                { text: 'Referencia', datafield: 'C001REFPED', width: 100 },
                                { text: 'Tipo', datafield: 'C001TIPOPE', width: 75 },
                                { text: 'Cliente', datafield: 'C001NOMCLI', width: 200 },
                                { text: 'Clave Cliente', datafield: 'C001CVECLI', width: 100, aggregates: ['count'] },                               
                                { text: 'RFC Cliente', datafield: 'C001RFCCLI', width: 150 },                                                                                               
                                { text: 'Contenedor', datafield: 'C004NUMCON', width: 100 },
                                { text: 'Impuestos FP Efectivo', datafield: 'N008IMPCON', width: 200, cellsformat: 'c', aggregates: ['sum'], cellsalign: 'right' },
                                { text: 'Impuestos FP Otros', datafield: 'N008IMPCONFP', width: 200, cellsformat: 'c', aggregates: ['sum'], cellsalign: 'right' },
                                { text: 'Fecha de Pago', datafield: 'D001FECPAG' }
                    ]
                });
            $("#excelExport").jqxButton({ theme: 'bootstrap' });
            $("#excelExport").on('click', function () {
                $("#jqxgrid").jqxGrid('exportdata', 'xls', 'jqxGrid', true, null, true, 'services/ExportContent.asmx/ExcelExport');
            });
            $("#cmdbusca").jqxButton({ theme: 'bootstrap' });
            $("#cmdbusca").click(function () {
                optsvaluechanged();
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


            $("#cbotipo").jqxComboBox({ theme: 'bootstrap' });
            $('#cbotipo').on('change', function () {
                optsvaluechanged();
            });
        },
        error: function (xhr, textStatus, error) {
            if (typeof console == "object") {
                console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
            }
        }
    });

    function optsvaluechanged() {

        $('#jqxgrid').jqxGrid('showloadelement');
        var date1 = $("#jqxWidgetDatePicker").jqxDateTimeInput('getText');
        var date2 = $("#jqxWidgetDatePicker2").jqxDateTimeInput('getText');
        var tipoop = $("#cbotipo").val();

        fechas = {
            fechaini: date1,
            fechafin: date2,
            tipo: tipoop,
            aduana: 240
        }

        $.ajax({
            type: 'POST',
            data: JSON.stringify(fechas),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            url: 'services/reppedimentos.asmx/repsolimpuestosim',
            success: function (data) {
                var data = $.parseJSON(data.d);
                var source =
                        {
                            localdata: data,
                            datatype: "json",
                            datafields:
                    [
                            { name: 'C001CVECLI', type: 'string' },
                            { name: 'C001NOMCLI', type: 'string' },
                            { name: 'C001RFCCLI', type: 'string' },
                            { name: 'C001REFPED', type: 'string' },
                            { name: 'C001NUMPED', type: 'string' },
                            { name: 'C001TIPOPE', type: 'string' },
                            { name: 'C004NUMCON', type: 'string' },
                            { name: 'N008IMPCON', type: 'currency' },
                            { name: 'N008IMPCONFP', type: 'currency' },
                            { name: 'D001FECPAG', type: 'datetime' }
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
    //new $.fn.dataTable.FixedHeader(table);
});
