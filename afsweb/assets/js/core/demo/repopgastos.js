(function (namespace, $) {
    "use strict";

    var repopgastos = function () {
        // Create reference to this instance
        var o = this;
        // Initialize app when document is ready
        $(document).ready(function () {
            o.initialize();
        });

    };
    var p = repopgastos.prototype;
    var theme = 'bootstrap';
    // =========================================================================
    // INIT
    // =========================================================================
    p.initialize = function () {
        this._loadDom();
        this._refreshGrid();
        this._loadGastos(1);
    };

    p._loadDom = function () {

        var cellclass = function (row, column, value) {
            var gastosmex = this.owner.source.records[row]['gastosmex'];
            var gastosame = this.owner.source.records[row]['gastosame'];
            var gastosmexglobal = this.owner.source.records[row]['gastosmexglobal'];
            var gastosameglobal = this.owner.source.records[row]['gastosameglobal'];

            if (gastosmex != gastosmexglobal && gastosame != gastosameglobal) {
                return "red-light ";
            }
            else if (gastosmex == gastosmexglobal && gastosame == gastosameglobal) {
                return "green-light ";
            }
            else if (gastosmex == gastosmexglobal || gastosame == gastosameglobal) {
                return "yellow-light ";
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
            theme: theme,
            rendertoolbar: function (toolbar) {
                var me = this;
                // Create html
                var html = '';
                html += '<div style="margin: 5px;">';
                html += '	<span style="float: left; margin-top: 5px; margin-right: 4px;">Seleccione rango de fechas:</span>';
                html += '	<span style="float: left; margin-top: 0px; margin-right: 4px;"><div id="jqxWidgetDatePicker"></div></span>';
                html += '	<span style="float: left; margin-top: 0px; margin-right: 4px;"><div id="jqxWidgetDatePicker2"></div></span>';
                html += '	<span style="float: left; margin-top: 0px; margin-right: 4px;"><div><button type="button" class="btn" tooltip="Cargar fechas" id="cmdbusca"><i class="md md-find-in-page"></i></button></div></span>';
                html += '	<div><input type="button" value="Exportar a Excel" id="excelExport" /></div>';
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

                var contextMenu = $("#Menu").jqxMenu({ width: 230, height: 150, autoOpenPopup: false, mode: 'popup', theme: theme });
                $("#jqxgrid").on('contextmenu', function () {
                    return false;
                });
                $("#Menu").on('itemclick', function (event) {
                    var args = event.args;
                    var rowindex = $("#jqxgrid").jqxGrid('getselectedrowindex');
                    var dataRecord = $("#jqxgrid").jqxGrid('getrowdata', rowindex);

                    var tipoop = "";
                    if (dataRecord.tipooperacion == "I") {
                        tipoop = "IMPORTACION";
                    }
                    else {
                        tipoop = "EXPORTACION";
                    }

                    if ($.trim($(args).text().toLowerCase()) == "capturar gasto") {
                        $('#txtgastosspan').text(dataRecord.referencia);
                        $('#txtgastostipospan').text(tipoop);
                        $('#formgastos').modal('show');
                    }
                    else if ($.trim($(args).text().toLowerCase()) == "ver detalle de gastos local") {
                        $('#txtgastoslocalspan').text(dataRecord.referencia);
                        $('#txtgastoslocaltipospan').text(tipoop);
                        p._loadGastosLocal(dataRecord.referencia);
                    }
                    else if ($.trim($(args).text().toLowerCase()) == "ver detalle de gastos globalpc") {
                        $('#txtgastosglobalspan').text(dataRecord.referencia);
                        $('#txtgastosglobaltipospan').text(tipoop);
                        p._loadGastosGlobal(dataRecord.referencia);
                    }
                    else if ($.trim($(args).text().toLowerCase()) == "asingar relacion de gastos") {
                        bootbox.confirm({
                            message: "Asignar relacion de gastos?",
                            callback: function (result) {
                                if (result) {
                                    p._saveRelGastos(dataRecord.referencia);
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
                        { text: 'REFERENCIA', datafield: 'referencia', width: 100, cellclassname: cellclass, align: 'center' },
                        { text: 'PEDIMENTO', datafield: 'pedimento', width: 100, aggregates: ['count'], cellclassname: cellclass, align: 'center' },
                        { text: 'TIPO OP', datafield: 'tipooperacion', width: 70, cellclassname: cellclass, align: 'center' },
                        { text: 'CLIENTE', datafield: 'cliente', width: 300, cellclassname: cellclass, align: 'center' },
                        { text: 'FECHA CRUCE', datafield: 'fechacruce', width: 150, cellclassname: cellclass, align: 'center' },
                        { text: 'FACTURA', datafield: 'opginvoice', width: 100, cellclassname: cellclass, align: 'center' },
                        { text: 'PAGO FACTURA', datafield: null, width: 150, cellclassname: cellclass, align: 'center' },
                        { text: 'MX', datafield: 'gastosmex', columngroup: 'local', align: 'center', width: 100, aggregates: ['sum'], cellclassname: cellclass, cellsalign: 'right', cellsformat: 'c2' },
                        { text: 'US', datafield: 'gastosame', columngroup: 'local', align: 'center', width: 100, aggregates: ['sum'], cellclassname: cellclass, cellsalign: 'right', cellsformat: 'c2' },
                        { text: 'MX', datafield: 'gastosmexglobal', columngroup: 'global', align: 'center', width: 100, aggregates: ['sum'], cellclassname: cellclass, cellsalign: 'right', cellsformat: 'c2' },
                        { text: 'US', datafield: 'gastosameglobal', columngroup: 'global', align: 'center', width: 100, aggregates: ['sum'], cellclassname: cellclass, cellsalign: 'right', cellsformat: 'c2' },
            ],
            columngroups:
                        [
                          { text: 'GASTOS LOCAL', align: 'center', name: 'local' },
                          { text: 'GASTOS GLOBALPC', align: 'center', name: 'global' },
                        ]
        });
        $("#jqxgridgastosglobal").jqxGrid(
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
            groupable: true,
            showgroupaggregates: true,
            theme: theme,
            rendertoolbar: function (toolbar) {
                var me = this;
                // Create html
                var html = '';
                html += '<div style="margin: 5px;">';
                html += '	<div><input type="button" value="Sincronizar" id="syncgastosglobal" /></div>';
                html += '	<div><input type="button" value="Excel" id="excelExportgastosglobal" /></div>';
                html += '</div>';
                var $new = $(html);
                toolbar.append($new);
                $("#excelExportgastosglobal").jqxButton({ theme: theme });
                $("#syncgastosglobal").jqxButton({ theme: theme });
                $("#excelExportgastosglobal").on('click', function () {
                    $("#jqxgridgastosglobal").jqxGrid('exportdata', 'xls', 'jqxGrid', true, null, true, 'services/ExportContent.asmx/ExcelExport');
                });
                $("#syncgastosglobal").on('click', function () {
                    bootbox.confirm({
                        message: "Sincronizar gastos con BD Local?",
                        callback: function (result) {
                            if (result) {
                                p._syncGastos();
                            }
                        }
                    });
                });
            },
            groups: ['TIPO'],
            columns: [
                { text: 'REFERENCIA', datafield: 'sCveTrafico', width: 150 },
                { text: 'CONCEPTO', datafield: 'sDescripcion', width: 200, aggregates: ['count'] },
                { text: 'TIPO', datafield: 'eTipoServicio', width: 50 },
                {
                    text: 'MONTO', datafield: 'iImporte', cellsalign: 'right', cellsformat: 'c2', width: 150, aggregates: ["sum"],
                    cellsrenderer: function (row, column, value, defaultRender, column1, rowData) {
                        if (value.toString().indexOf("Sum") >= 0) {
                            return defaultRender.replace("Sum", "Total");
                        }
                    },
                    aggregatesrenderer: function (aggregates, column, element) {
                        var renderstring = '<div style="position: relative; margin-top: 4px; margin-right:5px; text-align: right; overflow: hidden;">' + "Total" + ': ' + aggregates.sum + '</div>';
                        return renderstring;
                    }
                },
            ]
        });
        $("#jqxgridgastoslocal").jqxGrid(
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
            groupable: true,
            showgroupaggregates: true,
            theme: theme,
            rendertoolbar: function (toolbar) {
                var me = this;
                // Create html
                var html = '';
                html += '<div style="margin: 5px;">';
                html += '	<div><input type="button" value="Exportar a Excel" id="excelExportgastoslocal" /></div>';
                html += '</div>';
                var $new = $(html);
                toolbar.append($new);
                $("#excelExportgastoslocal").jqxButton({ theme: theme });
                $("#excelExportgastoslocal").on('click', function () {
                    $("#jqxgridgastoslocal").jqxGrid('exportdata', 'xls', 'jqxGrid', true, null, true, 'services/ExportContent.asmx/ExcelExport');
                });
                var contextMenuGastos = $("#MenuGastos").jqxMenu({ width: 230, height: 150, autoOpenPopup: false, mode: 'popup', theme: theme });
                $("#jqxgridgastoslocal").on('contextmenu', function () {
                    return false;
                });
                $("#MenuGastos").on('itemclick', function (event) {
                    var args = event.args;
                    var rowindex = $("#jqxgrid").jqxGrid('getselectedrowindex');
                    var dataRecord = $("#jqxgrid").jqxGrid('getrowdata', rowindex);

                    if ($.trim($(args).text().toLowerCase()) == "editar gasto") {
                        alert(dataRecord.opgid);
                    }
                    else if ($.trim($(args).text().toLowerCase()) == "eliminar gasto") {
                        $('#txtgastoslocalspan').text(dataRecord.referencia);
                        $('#txtgastoslocaltipospan').text(tipoop);
                        p._loadGastosLocal(dataRecord.referencia);
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
            groups: ['TIPO'],
            columns: [
                { datafield: 'opgid', hidden: true },
                { datafield: 'opgconceptoid', hidden: true },
                { text: 'REFERENCIA', datafield: 'sCveTrafico', width: 150 },
                { text: 'CONCEPTO', datafield: 'sDescripcion', width: 200, aggregates: ['count'] },
                { text: 'TIPO', datafield: 'eTipoServicio', width: 50 },
                {
                    text: 'MONTO', datafield: 'iImporte', cellsalign: 'right', cellsformat: 'c2', width: 150, aggregates: ["sum"],
                    cellsrenderer: function (row, column, value, defaultRender, column1, rowData) {
                        if (value.toString().indexOf("Sum") >= 0) {
                            return defaultRender.replace("Sum", "Total");
                        }
                    },
                    aggregatesrenderer: function (aggregates, column, element) {
                        var renderstring = '<div style="position: relative; margin-top: 4px; margin-right:5px; text-align: right; overflow: hidden;">' + "Total" + ': ' + aggregates.sum + '</div>';
                        return renderstring;
                    }
                }
            ]
        });

        $('input[type=radio][name=inlineRadioOptions]').change(function () {
            p._loadGastos(parseInt(this.value));
        });

        $("#cmdcapturagastos").click(function () {
            bootbox.confirm({
                message: "Grabar gasto?",
                callback: function (result) {
                    if (result) {
                        p._saveNewGasto();
                    }
                }
            });
        })
    }
    p._refreshGrid = function () {
        $('#jqxgrid').jqxGrid('showloadelement');
        var date1 = $("#jqxWidgetDatePicker").jqxDateTimeInput('getText');
        var date2 = $("#jqxWidgetDatePicker2").jqxDateTimeInput('getText');

        var fechas = {
            fechaini: date1,
            fechafin: date2
        }
        var dialog = bootbox.dialog({ message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> loading, please wait...</div>' });

        $.ajax({
            type: 'POST',
            data: JSON.stringify(fechas),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            url: 'services/administracion.asmx/repoperaciones',
            success: function (data) {

                var data = $.parseJSON(data.d);
                var source =
                        {
                            localdata: data,
                            datatype: "json",
                            datafields: [
                                        { name: 'referencia', type: 'string' },
                                        { name: 'pedimento', type: 'string' },
                                        { name: 'cliente', type: 'string' },
                                        { name: 'proveedor', type: 'string' },
                                        { name: 'fechacruce', type: 'string' },
                                        { name: 'gastosmex', type: 'float' },
                                        { name: 'gastosame', type: 'float' },
                                        { name: 'gastosmexglobal', type: 'float' },
                                        { name: 'gastosameglobal', type: 'float' },
                                        { name: 'tipooperacion', type: 'string' },
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
    p._loadGastos = function (tipogasto) {
        var datos = {
            tipogasto: tipogasto,
        }
        var dialog = bootbox.dialog({ message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> loading, please wait...</div>' });
        $.ajax({
            type: 'POST',
            data: JSON.stringify(datos),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            url: 'services/administracion.asmx/GetCatGastos',
            success: function (data) {
                $('#txtgastosref').empty().append('<option value="0"></option>');

                var json = $.parseJSON(data.d);
                $.each(json, function (key, value) {
                    $('#txtgastosref').append($('<option>').text(value.cgconcepto).attr('value', value.cgid));
                });
            }, error: function (xhr, textStatus, error) {
                var errorM = $.parseJSON(xhr.responseText);
                bootbox.alert(errorM.Message);
            },
            complete: function () {
                dialog.modal('hide');
            }
        });
    }
    p._loadGastosGlobal = function (scvetrafico) {
        var datos = {
            scvetrafico: scvetrafico,
        }
        var dialog = bootbox.dialog({ message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> loading, please wait...</div>' });
        $.ajax({
            type: 'POST',
            data: JSON.stringify(datos),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            url: 'services/administracion.asmx/GetGastosGlobal',
            success: function (data) {
                var data = $.parseJSON(data.d);
                var source =
                        {
                            localdata: data,
                            datatype: "json",
                            datafields: [
                                        { name: 'sCveTrafico', type: 'string' },
                                        { name: 'sDescripcion', type: 'string' },
                                        { name: 'eTipoServicio', type: 'string' },
                                        { name: 'iImporte', type: 'double' },
                            ]
                        };
                var dataAdapter = new $.jqx.dataAdapter(source, {
                    loadComplete: function () { },
                    loadError: function (xhr, status, error) { }
                });
                $('#jqxgridgastosglobal').jqxGrid({ source: dataAdapter, groups: ['eTipoServicio'] });

                $('#formgastosglobal').modal('show');

            }, error: function (xhr, textStatus, error) {
                var errorM = $.parseJSON(xhr.responseText);
                bootbox.alert(errorM.Message);
            },
            complete: function () {
                dialog.modal('hide');
            }
        });
    }
    p._loadGastosLocal = function (scvetrafico) {
        var datos = {
            scvetrafico: scvetrafico,
        }
        var dialog = bootbox.dialog({ message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> loading, please wait...</div>' });
        $.ajax({
            type: 'POST',
            data: JSON.stringify(datos),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            url: 'services/administracion.asmx/GetGastosLocal',
            success: function (data) {
                var data = $.parseJSON(data.d);
                var source =
                        {
                            localdata: data,
                            datatype: "json",
                            datafields: [
                                        { name: 'opgid', type: 'int' },
                                        { name: 'opgconceptoid', type: 'int' },
                                        { name: 'sCveTrafico', type: 'string' },
                                        { name: 'sDescripcion', type: 'string' },
                                        { name: 'eTipoServicio', type: 'string' },
                                        { name: 'iImporte', type: 'double' },
                            ]
                        };
                var dataAdapter = new $.jqx.dataAdapter(source, {
                    loadComplete: function () { },
                    loadError: function (xhr, status, error) { }
                });
                $('#jqxgridgastoslocal').jqxGrid({ source: dataAdapter, groups: ['eTipoServicio'] });

                $('#formgastoslocal').modal('show');

            }, error: function (xhr, textStatus, error) {
                var errorM = $.parseJSON(xhr.responseText);
                bootbox.alert(errorM.Message);
            },
            complete: function () {
                dialog.modal('hide');
            }
        });
    }
    p._saveNewGasto = function () {
        var opgref = $('#txtgastosspan').text();
        if (opgref == "") {
            bootbox.alert("No ha seleccionado Referencia");
            return;
        }

        var opgconceptoid = $('#txtgastosref').val();
        var opgtipogasto = $("input[name=inlineRadioOptions]:checked").val();
        var opgmontogasto = $('#dollars10').val();
        if (opgmontogasto <= 0) {
            bootbox.alert("Debe asignar monto del gasto");
            return;
        }

        var datos = {
            opgref: opgref,
            opgconceptoid: opgconceptoid,
            opgtipogasto: opgtipogasto,
            opgmontogasto: opgmontogasto,
        }
        var dialog = bootbox.dialog({ message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> loading, please wait...</div>' });
        $.ajax({
            type: 'POST',
            data: JSON.stringify(datos),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            url: 'services/administracion.asmx/setgasto',
            success: function (data) {
                bootbox.alert("El gasto se ha registrado exitosamente");
                p._refreshGrid();
            }, error: function (xhr, textStatus, error) {
                var errorM = $.parseJSON(xhr.responseText);
                bootbox.alert(errorM.Message);
            },
            complete: function () {
                $('#formgastos').modal('hide');
                dialog.modal('hide');
            }
        });
    }
    p._syncGastos = function () {
        var opgref = $('#txtgastosglobalspan').text();
        if (opgref == "") {
            bootbox.alert("No ha seleccionado Referencia");
            return;
        }

        var datos = {
            scvetrafico: opgref,
        }
        var dialog = bootbox.dialog({ message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> loading, please wait...</div>' });
        $.ajax({
            type: 'POST',
            data: JSON.stringify(datos),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            url: 'services/administracion.asmx/syncgastos',
            success: function (data) {
                bootbox.alert("La sincronizacion se ha realizado exitosamente");
                p._refreshGrid();
            }, error: function (xhr, textStatus, error) {
                var errorM = $.parseJSON(xhr.responseText);
                bootbox.alert(errorM.Message);
            },
            complete: function () {
                $('#formgastos').modal('hide');
                dialog.modal('hide');
            }
        });
    }
    p._saveRelGastos = function (opgref) {

        var datos = {
            opgref: opgref,
        }
        var dialog = bootbox.dialog({ message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> loading, please wait...</div>' });
        $.ajax({
            type: 'POST',
            data: JSON.stringify(datos),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            url: 'services/administracion.asmx/setrelno',
            success: function (data) {
                bootbox.alert("Se asigno exitosamente la relacion de gastos");
                p._refreshGrid();
            }, error: function (xhr, textStatus, error) {
                var errorM = $.parseJSON(xhr.responseText);
                bootbox.alert(errorM.Message);
            },
            complete: function () {
                dialog.modal('hide');
            }
        });
    }
    namespace.repopgastos = new repopgastos;
}(this.materialadmin, jQuery));