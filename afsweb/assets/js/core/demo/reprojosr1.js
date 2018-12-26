
$(document).ready(function () {
    var fechas = {
        fechaini: '',
        fechafin: '',
        tipo: 1,
        aduana: 240
    }
    $("#loading").show();
    $.ajax({
        type: 'POST',
        data: JSON.stringify(fechas),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true,
        url: 'services/reppedimentos.asmx/reppedimentosrojor1',
        success: function (data) {

            var data = $.parseJSON(data.d);
            var source =
                {
                    localdata: data,
                    datatype: "json",
                    datafields:
                        [
                            { name: 'C001NUMPED', type: 'string' },
                            { name: 'C001REFPED', type: 'string' },
                            { name: 'C001TIPOPE', type: 'string' },
                            { name: 'C001ADUSEC', type: 'string' },
                            { name: 'C001PATEN', type: 'string' },
                            { name: 'L001REFR1', type: 'string' },
                            { name: 'C038PEDR1', type: 'string' },
                            { name: 'C001NOMCLI', type: 'string' },
                            { name: 'C001RFCCLI', type: 'string' },
                            { name: 'ESTATUS', type: 'string' },
                            { name: 'D001FECPAG', type: 'string' }
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
                        html += '	<div><input type="button" value="Export to Excel" id="excelExport" /></div>';
                        html += '</div>';
                        var $new = $(html);
                        toolbar.append($new);
                    },
                    columns: [
                        { text: 'PEDIMENTO', datafield: 'C001NUMPED', width: 150, aggregates: ['count'] },
                        { text: 'REFERENCIA', datafield: 'C001REFPED', width: 100 },
                        { text: 'TIPO', datafield: 'C001TIPOPE', width: 100 },
                        { text: 'ADUANA', datafield: 'C001ADUSEC', width: 100 },
                        { text: 'PATENTE', datafield: 'C001PATEN', width: 100 },
                        { text: 'REFERENCIA R1', datafield: 'L001REFR1', width: 100 },
                        //{ text: 'PEDIMENTO R1', datafield: 'C038PEDR1', width: 150 },                               
                        { text: 'CLIENTE', datafield: 'C001NOMCLI', width: 200 },
                        { text: 'RFC', datafield: 'C001RFCCLI', width: 150 },
                        { text: 'SUBESTADO', datafield: 'ESTATUS', width: 100 },
                        { text: 'FECHA PAGO', datafield: 'D001FECPAG' }
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

        fechas = {
            fechaini: date1,
            fechafin: date2,
            tipo: 1,
            aduana: 240
        }

        $.ajax({
            type: 'POST',
            data: JSON.stringify(fechas),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            url: 'services/reppedimentos.asmx/reppedimentosrojor1',
            success: function (data) {
                var data = $.parseJSON(data.d);
                var source =
                    {
                        localdata: data,
                        datatype: "json"
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
