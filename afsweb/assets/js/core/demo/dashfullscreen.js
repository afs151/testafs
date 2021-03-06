(function (namespace, $) {
    "use strict";

    var dashboard = function () {
        // Create reference to this instance
        var o = this;
        // Initialize app when document is ready
        $(document).ready(function () {
            o.initialize();
        });

    };
    var p = dashboard.prototype;
    var theme = "bootstrap";

    p.rickshawSeries = [[], []];
    p.rickshawGraph = null;
    p.rickshawRandomData = null;
    p.rickshawTimer = null;
    p.theme = '';


    p.initialize = function () {
        this._initializeDom();
        this._UserWellcome();
        this._refreshgridprogramacion();
        this._enableEvents();
        this._loadIntervalProgramacion();
    }

    p._loadIntervalProgramacion = function () {
        refreshIntervalMessages = setInterval(function () {
            p._refreshgridprogramacion();
        }, 50000);
    };

    p._initializeDom = function () {
        $("#successNotification").jqxNotification({
            width: 250, position: "bottom-right", opacity: 0.9,
            autoOpen: false, animationOpenDelay: 800, autoClose: true, autoCloseDelay: 5000, template: "info", theme: theme
        });

        $("#errorNotification").jqxNotification({ width: 250, position: "bottom-right", autoCloseDelay: 5000, autoOpen: false, closeOnClick: true, autoClose: true, template: "error", animationOpenDelay: 800 });

        $("#warningNotification").jqxNotification({
            width: 250, position: "bottom-right", opacity: 0.9,
            autoOpen: false, animationOpenDelay: 800, autoClose: true, autoCloseDelay: 5000, template: "warning", theme: theme
        });
        p._createdomgrid("#jqxgrid", "btnprogramatraf", "excelExport", "#menuimpo");
        p._createdomgrid("#jqxgridexp", "btnprogramatrafexp", "excelExportexp","#menuexpo");
        p._createdomgrid("#jqxgridfur", "btnprogramatraffur", "excelExportfur", "#menufur");
        p._createdomgrid("#jqxgridconso", "btnprogramatrafcons", "excelExportcons", "#menuconso");
        p._createdomgrid("#jqxgridadel", "btnprogramatrafadel", "excelExportadel", "#menuadel");
        p._createdomgrid("#jqxgriddirectos", "btnprogramatrafdir", "excelExportadir", "#menudir");
    }

    p._createdomgrid = function (ctrlgrid, btnprogtraf, btnexporta, ctrlmenu) {
        var cellclass = function (row, column, value) {
            var color = this.owner.source.records[row]['tpstatusaduana'];
            console.log(color);
            switch (color) {
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
                case "DOCUMENTOS DIGITALIZADOS":
                    return "aqua";
                    break;
                case "CAMBIOS REQUERIDOS":
                    return "yellow";
                    break;
                case "PROFORMA LISTA":
                    return "aqua";
                    break;
                case "COVE LISTO":
                    return "brown";
                    break;
                case "PAGO AUTORIZADO":
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
                case "REVISION DE DOCUMENTOS":
                    return "gray";
                    break;
            }
        };
        $(ctrlgrid).jqxGrid(
        {
            width: '100%',
            height: '700',
            filterable: true,
            sortable: true,
            showtoolbar: true,
            showfilterrow: true,
            showstatusbar: true,
            showaggregates: true,
            columnsresize: true,
            theme: theme,
            altrows: true,
            rendertoolbar: function (toolbar) {
                var me = this;
                var html = '';
                html += '<div style="margin: 5px;">';
                html += '	<input type="button" value="Programar trafico" id="' + btnprogtraf + '" data-toggle="modal" data-target="#formreset" />';
                html += '	<input type="button" value="Exportar a Excel" id="' + btnexporta + '" />';
                html += '</div>';
                var $new = $(html);
                toolbar.append($new);
                $("#" + btnprogtraf).jqxButton({ theme: theme });
                $("#" + btnexporta).jqxButton({ theme: theme });
                $("#" + btnexporta).on('click', function () {
                    $(ctrlgrid).jqxGrid('exportdata', 'xls', 'jqxGrid', true, null, true, 'services/ExportContent.asmx/ExcelExport');
                });
                var contextMenu = $(ctrlmenu).jqxMenu({ width: 220, height: 240, autoOpenPopup: false, mode: 'popup', theme: theme });
                $(ctrlgrid).on('contextmenu', function () {
                    return false;
                });
                $(ctrlmenu).on('itemclick', function (event) {
                    var args = event.args;
                    var rowindex = $(ctrlgrid).jqxGrid('getselectedrowindex');
                    var dataRecord = $(ctrlgrid).jqxGrid('getrowdata', rowindex);

                    var referencia = dataRecord.tpreferencia;

                    if ($.trim($(args).text().toLowerCase()) == "capturar itn") {
                        $('#txtadelantaspan').text(referencia);
                        $('#formitn').modal('show');
                    }
                    else if ($.trim($(args).text().toLowerCase()) == "ver/capturar historial de trafico") {
                        $('#txtrefhistspan').text(dataRecord.tpreferencia);
                        p._refreshTimeLine(dataRecord.tpreferencia);
                        $('#formhist').modal('show');
                    }
                    else if ($.trim($(args).text().toLowerCase()) == "capturar observaciones") {
                        $('#txtrefobsspan').text(dataRecord.tpreferencia);
                        $('#txtobsrefs').text(dataRecord.obs);
                        $('#formbs').modal('show');
                    }
                    else if ($.trim($(args).text().toLowerCase()) == "capturar ejecutivo") {
                        $('#txtejecutivospan').text(dataRecord.tpreferencia);
                        $('#formejecutivo').modal('show');
                    }
                    else if ($.trim($(args).text().toLowerCase()) == "capturar elaborado por") {
                        $('#txtelaborospan').text(dataRecord.tpreferencia);
                        $('#formelaboro').modal('show');
                    }
                    else if ($.trim($(args).text().toLowerCase()) == "capturar estatus") {
                        $('#txtstatusspan').text(dataRecord.tpreferencia);
                        $('#formstatus').modal('show');
                    }
                    else if ($.trim($(args).text().toLowerCase()) == "capturar estatus de bodega") {
                        $('#txtestatusbodspan').text(dataRecord.tpreferencia);
                        $('#formestatusbod').modal('show');
                    }
                    else if ($.trim($(args).text().toLowerCase()) == "capturar estatus en aduana") {
                        $('#txtestatusaduanaspan').text(dataRecord.tpreferencia);
                        $('#formestatusaduana').modal('show');
                    }
                    else if ($.trim($(args).text().toLowerCase()) == "consolidar") {
                        $('#txtconsolidaspan').text(dataRecord.tpreferencia);
                        $('#formconsolidado').modal('show');
                    }
                });
                $(ctrlgrid).on('rowclick', function (event) {
                    if (event.args.rightclick) {
                        $(ctrlgrid).jqxGrid('selectrow', event.args.rowindex);
                        var scrollTop = $(window).scrollTop();
                        var scrollLeft = $(window).scrollLeft();
                        contextMenu.jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft, parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
                        return false;
                    }
                });
            },
            columns: [
                { text: 'CLAVE CONS', datafield: 'tpclaveconsolidado', cellclassname: cellclass, width: 100 },
                { text: 'CLIENTE', datafield: 'srazonsocial', cellclassname: cellclass, width: 250 },
                { text: 'VEHICULO', datafield: 'vehiculo', cellclassname: cellclass, aggregates: ['count'], width: 200 },
                { text: 'TRANSFER', datafield: 'transfer', cellclassname: cellclass, width: 100 },
                { text: 'CAAT', datafield: 'snumerocaat', cellclassname: cellclass, width: 50 },
                { text: 'LINEA_MEX', datafield: 'snombre', cellclassname: cellclass, width: 120 },
                { text: 'ITN', datafield: 'tpitn', cellclassname: cellclass, width: 120 },
                { text: 'ADUANA', datafield: 'scveaduana', cellclassname: cellclass, width: 75 },
                { text: 'REFERENCIA', datafield: 'tpreferencia', cellclassname: cellclass, width: 100 },
                { text: 'TIPO_PEDIMENTO', datafield: 'scvedocumento', cellclassname: cellclass, width: 100 },
                { text: 'PEDIMENTO', datafield: 'snumpedimento', cellclassname: cellclass, width: 100 },
                { text: 'ELABORA', datafield: 'tpelabora', cellclassname: cellclass, width: 100 },
                { text: 'EJECUTIVO', datafield: 'tpejecutivo', cellclassname: cellclass, width: 100 },
                { text: 'ESTATUS', datafield: 'tpstatus', cellclassname: cellclassstatus, width: 200 },
                { text: 'OBSERVACIONES', datafield: 'tpobs', cellclassname: cellclass, width: 200 },
                { text: 'REMISION', datafield: 'iconsecutivoordencarga', cellclassname: cellclass, width: 100 },
                { text: 'ESTATUS BODEGA', datafield: 'tpstatusbodid', cellclassname: cellclass, width: 250 },
                { text: 'ESTATUS ADUANA', datafield: 'tpstatusaduana', cellclassname: cellclass, width: 250 },
                { text: 'BULTOS', datafield: 'smarcas', cellclassname: cellclass, width: 250 },
                { text: 'EQUIPO DE TRABAJO', datafield: 'tpgrupotrabajo', cellclassname: cellclass, width: 150 },
                { text: '', datafield: 'colorname', hidden: true },
            ]
        });
    }

    p._UserWellcome = function () {

        $("#messageNotification").jqxNotification({
            width: 250, position: "bottom-right", opacity: 0.9,
            autoOpen: false, animationOpenDelay: 800, autoClose: true, autoCloseDelay: 10000, template: "info"
        });
        $("#timeNotification").jqxNotification({
            width: 250, position: "bottom-right", opacity: 0.9,
            autoOpen: false, animationOpenDelay: 800, autoClose: true, autoCloseDelay: 10000, template: "time"
        });
        var userlname = $.cookie('userlname');
        var userfname = $.cookie('userfname');
        var uprofile = $.cookie('Administrator');
        var pagedh = location.pathname.substring(1);

        $("#notificationuser").text(userlname + ' ' + userfname);
        $("#messageNotification").jqxNotification("open");
    }


    p._initRickshaw = function () {
        // Don't init a rickshaw graph twice
        if (this.rickshawGraph !== null) {
            return;
        }

        var o = this;

        // Create random data
        this.rickshawRandomData = new Rickshaw.Fixtures.RandomData(50);
        for (var i = 0; i < 75; i++) {
            this.rickshawRandomData.addData(this.rickshawSeries);
        }

        // Update knob charts
        this._updateKnob();

        // Init Richshaw graph
        this.rickshawGraph = new Rickshaw.Graph({
            element: $('#rickshawGraph').get(0),
            width: $('#rickshawGraph').closest('.card-body').width(),
            height: $('#rickshawGraph').height(),
            interpolation: 'linear',
            renderer: 'area',
            series: [
				{
				    data: this.rickshawSeries[0],
				    color: $('#rickshawGraph').data('color1'),
				    name: 'Tiempo de respuesta'
				}, {
				    data: this.rickshawSeries[1],
				    color: $('#rickshawGraph').data('color2'),
				    name: 'Promedio'
				}
            ]
        });

        // Add hover info
        var hoverDetail = new Rickshaw.Graph.HoverDetail({
            graph: this.rickshawGraph
        });

        // Render graph
        this.rickshawGraph.render();

        // Add animated data
        clearInterval(this.rickshawTimer);
        this.rickshawTimer = setInterval(function () {
            o._refreshRickshaw();
        }, 2000);

        materialadmin.App.callOnResize(function () {
            o.rickshawGraph.configure({
                height: $('#rickshawGraph').height(),
                width: $('#rickshawGraph').closest('.card-body').outerWidth()
            });
            o.rickshawGraph.render();
        });
    }

    p._refreshRickshaw = function () {
        this.rickshawRandomData.removeData(this.rickshawSeries);
        this.rickshawRandomData.addData(this.rickshawSeries);
        this.rickshawGraph.update();
        this._updateKnob();
    }

    // =========================================================================
    // KNOB
    // =========================================================================

    p._initKnob = function () {
        if (!$.isFunction($.fn.knob)) {
            return;
        }

        $('.dial').each(function () {
            var options = materialadmin.App.getKnobStyle($(this));
            $(this).knob(options);
        });
    }

    p._updateKnob = function () {
        var val1 = this.rickshawSeries[0][this.rickshawSeries[0].length - 2];
        var val2 = this.rickshawSeries[0][this.rickshawSeries[0].length - 1];

        $({ animatedVal: val1.y }).animate({ animatedVal: val2.y }, {
            duration: 1200,
            easing: "swing",
            step: function () {
                $('#serverStatusKnob input').val(Math.ceil(this.animatedVal)).trigger("change");
            }
        });
    }

    p._refreshgridprogramacion = function () {
        $('#jqxgrid').jqxGrid('showloadelement');
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

        today = mm + '/' + dd + '/' + yyyy;

        $("#progcruces").text("Programacion de cruces del dia: " + today + "   Aduana Laredo");
        $("#currentTime").text("Cargando programacion de cruces del dia: " + today);

        var gridfields = [
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
                                { name: 'tpobs', type: 'string' },
                                { name: 'tpejecutivo', type: 'string' },
                                { name: 'tpelabora', type: 'string' },
                                { name: 'tpstatus', type: 'string' },
                                { name: 'tpstatusbodid', type: 'string' },
                                { name: 'tpstatusaduana', type: 'string' },
                                { name: 'tpgrupotrabajo', type: 'int' },
                                { name: 'tpclaveconsolidado', type: 'string' },
        ];

        var dialog = bootbox.dialog({ message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> loading, please wait...</div>' });

        var url = 'services/dashboard.asmx/loadgridprogramacion';

        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify({}),
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            error: function (request, status, error) {
                console.log('error=' + error);
                console.log('error status=' + status);
            },
            success: function (result) {
                var datanew = $.parseJSON(result.d);
                var source =
                        {
                            localdata: datanew,
                            datatype: "json",
                            datafields: gridfields,
                        }; 
                var dataAdapter = new $.jqx.dataAdapter(source, {
                    loadComplete: function (data) { },
                    loadError: function (xhr, status, error) { }
                });
                $('#jqxgrid').jqxGrid({ source: dataAdapter });
                var datainformations = $('#jqxgrid').jqxGrid('getdatainformation');
                var rowscounts = datainformations.rowscount;

                $("#currentTime").text("Total de importaciones programadas para el dia de hoy: " + rowscounts);
                $("#timeNotification").jqxNotification("open");

                //===============================================================================
                // EXPORTACION
                //===============================================================================
                var datanewexp = $.parseJSON(result.d).Table1;
                var sourceexp =
                        {
                            localdata: datanewexp,
                            datatype: "json",
                            datafields: gridfields,
                        };
                var dataAdapterexp = new $.jqx.dataAdapter(sourceexp, {
                    loadComplete: function (dataexp) { },
                    loadError: function (xhr, status, error) { }
                });

                $('#jqxgridexp').jqxGrid({ source: dataAdapterexp });
                var datainformationsexp = $('#jqxgridexp').jqxGrid('getdatainformation');
                var rowscountsexp = datainformationsexp.rowscount;

                $("#currentTime").text("Total de exportaciones programadas para el dia de hoy: " + rowscountsexp);
                $("#timeNotification").jqxNotification("open");

                var datanewcons = $.parseJSON(result.d).Table2;
                var sourcecons =
                        {
                            localdata: datanewcons,
                            datatype: "json",
                            datafields: gridfields,
                        };
                var dataAdaptercons = new $.jqx.dataAdapter(sourcecons, {
                    loadComplete: function (datacons) { },
                    loadError: function (xhr, status, error) { }
                });

                $('#jqxgridconso').jqxGrid({ source: dataAdaptercons });

                var datanewfur = $.parseJSON(result.d).Table3;
                var sourcefur =
                        {
                            localdata: datanewfur,
                            datatype: "json",
                            datafields: gridfields,
                        };
                var dataAdapterfur = new $.jqx.dataAdapter(sourcefur, {
                    loadComplete: function (datacons) { },
                    loadError: function (xhr, status, error) { }
                });

                $('#jqxgridfur').jqxGrid({ source: dataAdapterfur });

                var datanewadel = $.parseJSON(result.d).Table4;
                var sourceadel =
                        {
                            localdata: datanewadel,
                            datatype: "json",
                            datafields: gridfields,
                        };
                var dataAdapteradel = new $.jqx.dataAdapter(sourceadel, {
                    loadComplete: function (dataadel) { },
                    loadError: function (xhr, status, error) { }
                });

                $('#jqxgridadel').jqxGrid({ source: dataAdapteradel });

                var datanewadir = $.parseJSON(result.d).Table5;
                var sourcedir =
                        {
                            localdata: datanewadir,
                            datatype: "json",
                            datafields: gridfields,
                        };
                var dataAdapteradir = new $.jqx.dataAdapter(sourcedir, {
                    loadComplete: function (dataadir) { },
                    loadError: function (xhr, status, error) { }
                });

                console.log(datanewadir);
                $('#jqxgriddirectos').jqxGrid({ source: dataAdapteradir });
            },
            complete: function () {
                dialog.modal('hide');
            }
        });
    }
    p._refreshTimeLine = function (referencia) {

        var data = {
            referencia: referencia,
        };

        var url = 'services/dashboard.asmx/loadtimeline';

        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            // tell to expect JSON in the response, and parse it automatically
            datatype: 'json',
            error: function (request, status, error) {
                console.log('error=' + error);
                console.log('error status=' + status);
            },
            success: function (result) {
                var datanew = $.parseJSON(result.d);
                $(".timeline").empty();
                $.each(datanew, function (key, value) {
                    var htmltimeline = '<li class="timeline-inverted">';
                    htmltimeline += '     <div class="timeline-circ circ-xl style-primary-dark"><i class="md md-access-time"></i></div>';
                    htmltimeline += '         <div class="timeline-entry">';
                    htmltimeline += '             <div class="card style-default-light">';
                    htmltimeline += '                 <div class="card-body small-padding">';
                    htmltimeline += '                     <p>';
                    htmltimeline += '                         <span class="text-medium">' + value.thusuario + '<span class="text-primary"></span></span><br />';
                    htmltimeline += '                         <span class="opacity-50">' + value.thfecharegistr + '</span>';
                    htmltimeline += '                     </p>';
                    htmltimeline += '     ' + value.thdetalle;
                    htmltimeline += '                 </div>';
                    htmltimeline += '            </div>';
                    htmltimeline += '     </div>';
                    htmltimeline += '</li>';
                    var $new = $(htmltimeline).hide();
                    $(".timeline").append(htmltimeline);
                });

            },
            complete: function () {
                //$('#jqxgrid').jqxGrid('hideloadelement');
            }
        });
    };

    $("body").on("click", "button.gridstatus", function (ev) {
        ev.preventDefault();
        var stat = $(this).data("stat");
        if (stat === "w") {
            $("#jqxgrid").jqxGrid('clearfilters');
            $("#jqxgridexp").jqxGrid('clearfilters');
        }
        else
            p._filterGridStatus(stat);
    });
    $("#excelExportExp").on('click', function () {
        $("#jqxgridexp").jqxGrid('exportdata', 'xls', 'jqxGrid');
    });

    p._filterGridStatus = function (status) {
        var filtergroup = new $.jqx.filter();
        var filter_or_operator = 1;
        var filtervalue = status;
        var filtercondition = 'equal';
        var filter1 = filtergroup.createfilter('stringfilter', filtervalue, filtercondition);
        filtergroup.addfilter(filter_or_operator, filter1);
        $("#jqxgrid").jqxGrid('addfilter', 'colorname', filtergroup);
        $("#jqxgrid").jqxGrid('applyfilters');
        $("#jqxgridexp").jqxGrid('addfilter', 'colorname', filtergroup);
        $("#jqxgridexp").jqxGrid('applyfilters');
    };
    var loadded = false;
    p._loadCrucesDiarios = function () {
        var data = {
            pref: 'T3035240'
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            url: 'services/common.asmx/loadcrucesdiarios',
            success: function (data) {
                var obj = $.parseJSON(data.d).Table[0];

                var datacruces = [{ y: moment().subtract(6, 'days').format('YYYY-MM-D'), a: obj.CRU6, b: obj.CRU6EXP, c: obj.CRU6REM },
                      { y: moment().subtract(5, 'days').format('YYYY-MM-D'), a: obj.CRU5, b: obj.CRU5EXP, c: obj.CRU5REM },
                      { y: moment().subtract(4, 'days').format('YYYY-MM-D'), a: obj.CRU4, b: obj.CRU4EXP, c: obj.CRU4REM },
                      { y: moment().subtract(3, 'days').format('YYYY-MM-D'), a: obj.CRU3, b: obj.CRU3EXP, c: obj.CRU3REM },
                      { y: moment().subtract(2, 'days').format('YYYY-MM-D'), a: obj.CRU2, b: obj.CRU2EXP, c: obj.CRU2REM },
                      { y: moment().subtract(1, 'days').format('YYYY-MM-D'), a: obj.CRU1, b: obj.CRU1EXP, c: obj.CRU1REM },
                      { y: moment().format('YYYY-MM-D'), a: obj.CRU0, b: obj.CRU0EXP, c: obj.CRU0REM }];

                p._loadMorrisCruces(datacruces);


            },
            error: function (xhr, textStatus, error) {
                if (typeof console == "object") {
                    console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                }
            }
        });
    };
    p._loadTopTenClientes = function () {
        var data = {
            pref: 'T3035240'
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            url: 'services/common.asmx/loadtoptenctes',
            success: function (data) {
                var parsedContent = JSON.parse(data.d.slice(9, -1));
                Morris.Bar({
                    element: 'topten',
                    data: parsedContent,
                    xkey: 'y',
                    ykeys: ['a', 'b'],
                    labels: ['Cruzados', 'Recibidos'],
                    resize: true,
                    xLabelAngle: 45,
                    gridTextSize: 10
                });
            },
            error: function (xhr, textStatus, error) {
                if (typeof console == "object") {
                    console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                }
            }
        });
    }
    p._loadTopTenClientesExpo = function () {
        var data = {
            pref: 'T3035240'
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            url: 'services/common.asmx/loadtoptenctesexp',
            success: function (data) {
                var parsedContent = JSON.parse(data.d.slice(9, -1));
                Morris.Bar({
                    element: 'toptenexp',
                    behaveLikeLine: true,
                    data: parsedContent,
                    xkey: 'y',
                    ykeys: ['a', 'b'],
                    labels: ['Cruzados', 'Recibidos'],
                    hideHover: 'auto',
                    resize: true,
                    gridTextSize: 10,
                    xLabelAngle: 45
                });
            },
            error: function (xhr, textStatus, error) {
                if (typeof console == "object") {
                    console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                }
            }
        });
    }
    p._loadFacturacionMensual = function () {
        var data = {
            pref: 'T3035240'
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify({}),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            url: 'services/reportes.asmx/repfacturassica',
            success: function (data) {
                var obj = $.parseJSON(data.d).data;

                if (!obj)
                    return;

                $('#sicaimpo').text(obj[0].sicaimpo || 0);
                $('#sicaexpo').text(obj[0].sicaexpo || 0);

            },
            error: function (xhr, textStatus, error) {
                if (typeof console == "object") {
                    console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                }
            }
        });
    }
    p._loadMorrisCruces = function (obj) {
        Morris.Area({
            element: 'crucesxsemana',
            behaveLikeLine: true,
            data: obj,
            xkey: 'y',
            ykeys: ['c', 'a', 'b'],
            labels: ['Remesas', 'Importacion', 'Exportacion']
        });
    }
    p._ReloadMorrisCruces = function (obj) {
        var chart = Morris.Area({ element: 'crucesxsemana' });
        chart.setData(obj);
    }
    p.yearsInGraph = [2016, 2017, 2018];
    p._loadMorris = function (obj) {
        new Morris.Line({
            element: 'line-example',
            data: obj,
            xkey: ['m'],
            ykeys: ['a1', 'a2', 'a3', 'a4'],
            labels: ['Cruces 2016', 'Cruces 2017', 'Cruces 2018', 'Cruces 2016'],
            smooth: false,
            xLabelFormat: function (str) {
                return p._morrisformatDate(str);
            }
        });
    }
    p._loadHistImpo = function () {
        var data = {
            pref: 'T3035240'
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            url: 'services/common.asmx/loadcrucesanualesimpo',
            success: function (data) {
                var parsedContent = JSON.parse(data.d.slice(9, -1));
                new Morris.Line({
                    element: 'line-example',
                    data: parsedContent,
                    xkey: ['m'],
                    ykeys: ['a1', 'a2', 'a3'],
                    labels: ['Cruces 2018', 'Cruces 2017', 'Cruces 2016'],
                    smooth: false,
                    xLabelFormat: function (str) {
                        return p._morrisformatDate(str);
                    }
                });
                var obj = $.parseJSON(data.d).Table[0];
                $("#cruces2017trendup").replaceWith("<h2 class='no-margin text-primary-dark'><span class='text-xxl'>" + obj.pct + "</span><i class='md md-trending-up'></i></h2><i class='fa fa-caret-up text-success fa-fw'></i>despachos vs 2018");
            },
            error: function (xhr, textStatus, error) {
                if (typeof console == "object") {
                    console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                }
            }
        });
    }
    p._loadHistExpo = function () {
        var data = {
            pref: 'T3035240'
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            url: 'services/common.asmx/loadcrucesanualesexpo',
            success: function (data) {
                var parsedContent = JSON.parse(data.d.slice(9, -1));
                new Morris.Line({
                    element: 'line-example-exp',
                    data: parsedContent,
                    xkey: ['m'],
                    ykeys: ['a1', 'a2', 'a3'],
                    labels: ['Cruces 2018', 'Cruces 2017', 'Cruces 2016'],
                    barColors: ["#B21516", "#1531B2", "#1AB244", "#B29215"],
                    smooth: false,
                    xLabelFormat: function (str) {
                        return p._morrisformatDate(str);
                    }
                });
                var obj = $.parseJSON(data.d).Table[0];
                $("#cruces2017trendupexp").replaceWith("<h2 class='no-margin text-primary-dark'><span class='text-xxl'>" + obj.pct + "</span><i class='md md-trending-up'></i></h2><i class='fa fa-caret-up text-success fa-fw'></i>despachos vs 2018");
            },
            error: function (xhr, textStatus, error) {
                if (typeof console == "object") {
                    console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                }
            }
        });
    }
    p._loadMorrisexp = function (obj) {
        new Morris.Line({
            element: 'line-example-exp',
            data: obj,
            xkey: ['m'],
            ykeys: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6'],
            labels: ['Expo 2017', 'Remesas 2017', 'Expo 2018', 'Remesas 2018', 'Expo 2016', 'Remesas 2016'],
            smooth: false,
            lineColors: ['steelblue', 'steelblue', 'green', 'green', 'gray', 'gray'],
            xLabelFormat: function (str) {
                return p._morrisformatDate(str);
            }
        });
    }
    p._morrisformatDate = function (myDate) {
        var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
        var d = new Date(myDate);
        var curr_month = d.getMonth();
        return (m_names[curr_month]);
    }
    p._morrisformatHoverLabel = function (row, preUnit) {
        var m_long_names = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", "Enero");
        var d = new Date(row.m);
        var curr_month = d.getMonth();

        var hoverText = "Cruces " + m_long_names[curr_month + 1];
        var a = 1;
        var i;
        for (i = 0; i <= 2; i++) {
            hoverText = hoverText + "<br/>" + p.yearsInGraph[i] + ": " + preUnit + row['a' + (a++)];
        }
        return hoverText;
    }
    p._enableEvents = function () {
        var o = this;
        $("#btnenviarcomments").click(function () {
            $('#formcomments').modal('hide');
            var coments = $("#textarea1").val();
            $("#textarea1").val('');
            if (coments == "")
                return;

            var uid = $.cookie('uid');
            var data = {
                txtcomments: coments,
                uid: uid
            }
            $.ajax({
                data: JSON.stringify(data),
                dataType: 'json',
                url: 'services/login.asmx/commentsrequest',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    var obj = $.parseJSON(result.d);
                    alert("GRACIAS!!! Sus comentarios se enviaron exitosamente, nos comunicaremos con usted cualquier duda al respecto");

                }
            });
            return false;
        });
        $("#btnsenderror").click(function () {
            $('#formerrors').modal('hide');
            var coments = $("#textarea2").val();
            $("#textarea2").val('');
            if (coments == "")
                return;

            var uid = $.cookie('uid');

            var data = {
                txtcomments: coments,
                uid: uid,
            }

            $.ajax({
                data: JSON.stringify(data),
                dataType: 'json',
                url: 'services/login.asmx/bugrequest',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    var obj = $.parseJSON(result.d);
                    alert("GRACIAS!!! por tus comentarios, se atenderan a la brevedad posible");

                }
            });
            return false;
        });
        $("#tabimpo").on('click', function (event) {
            event.preventDefault();
            $('#btnsalida').show();
        });
        $("#tabexpo").on('click', function (event) {
            event.preventDefault();
            $('#btnsalida').hide();
        });
        $("#cmdcapturaitn").click(function () {
            var referencia = $("#txtadelantaspan").text().toUpperCase();
            if (referencia == "") {
                bootbox.alert("No ha seleccionado Referencia");
                return;
            }
            var coments = $("#txtitnref").val().toUpperCase();
            if (coments == "") {
                bootbox.alert("No ha asignado ITN");
                return;
            }

            var uid = $.cookie('uid');

            var data = {
                referencia: referencia,
                itn: coments,
            }
            $.ajax({
                data: JSON.stringify(data),
                dataType: 'json',
                url: 'services/dashboard.asmx/actualizaitn',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    p._refreshgridprogramacion();

                    bootbox.alert("Informacion actualizada exitosamente");
                }, complete: function () {
                    $("#txtadelantaspan").text('');
                    $("#txtitnref").val('')
                    $('#formitn').modal('hide');
                }
            });
            return false;
        });

        $("#cmdcapturaobs").click(function () {

            var referencia = $("#txtrefobsspan").text().toUpperCase();
            if (referencia == "") {
                bootbox.alert("No ha seleccionado Referencia");
                return;
            }
            var coments = $("#txtobsrefs").val().toUpperCase();
            if (coments == "") {
                bootbox.alert("No ha asignado observaciones");
                return;
            }

            var uid = $.cookie('uid');

            var data = {
                referencia: referencia,
                obs: coments,
            }
            $.ajax({
                data: JSON.stringify(data),
                dataType: 'json',
                url: 'services/dashboard.asmx/actualizaobs',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    p._refreshgridprogramacion();

                    bootbox.alert("Informacion actualizada exitosamente");
                }, complete: function () {
                    $("#txtrefobsspan").text('');
                    $("#txtobsrefs").val('')
                    $('#formbs').modal('hide');
                }
            });
            return false;
        });
        $("#cmdguardahist").click(function () {

            var referencia = $("#txtrefhistspan").text().toUpperCase();
            if (referencia == "") {
                bootbox.alert("No ha seleccionado Referencia");
                return;
            }
            var coments = $("#txthistrefs").val().toUpperCase();
            if (coments == "") {
                bootbox.alert("No ha asignado observaciones");
                return;
            }

            var uid = $.cookie('uid');
            var username = $.cookie('userfname') + " " + $.cookie('userlname');

            var data = {
                referencia: referencia,
                detalle: coments,
                usuario: username,
            }
            $.ajax({
                data: JSON.stringify(data),
                dataType: 'json',
                url: 'services/dashboard.asmx/actualizahistorial',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (result) {

                    p._refreshTimeLine(referencia);

                    bootbox.alert("Informacion actualizada exitosamente");
                }, complete: function () {
                    //$("#txtrefhistspan").text('');
                    $("#txthistrefs").val('')
                    //$('#formhist').modal('hide');
                }
            });
            return false;
        });
        $("#cmdcapturaejecutivo").click(function () {
            var referencia = $("#txtejecutivospan").text().toUpperCase();
            if (referencia == "") {
                bootbox.alert("No ha seleccionado Referencia");
                return;
            }
            var coments = $("#txtejecutivoref option:selected").text();
            if (coments == "") {
                bootbox.alert("No ha asignado ejecutivo");
                return;
            }
            var uid = $.cookie('uid');
            var data = {
                referencia: referencia,
                ejecutivo: coments,
            }
            $.ajax({
                data: JSON.stringify(data),
                dataType: 'json',
                url: 'services/dashboard.asmx/actualizaejecutivo',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    p._refreshgridprogramacion();

                    bootbox.alert("Informacion actualizada exitosamente");
                }, complete: function () {
                    $("#txtejecutivospan").text('');
                    $('#formejecutivo').modal('hide');
                }
            });
            return false;
        });
        $("#cmdcapturaelaboro").click(function () {
            var referencia = $("#txtelaborospan").text().toUpperCase();
            if (referencia == "") {
                bootbox.alert("No ha seleccionado Referencia");
                return;
            }
            var coments = $("#txtelabororef option:selected").text();
            if (coments == "") {
                bootbox.alert("No ha asignado elaborado por");
                return;
            }
            var uid = $.cookie('uid');
            var data = {
                referencia: referencia,
                elabora: coments,
            }
            $.ajax({
                data: JSON.stringify(data),
                dataType: 'json',
                url: 'services/dashboard.asmx/actualizaelabora',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    p._refreshgridprogramacion();

                    bootbox.alert("Informacion actualizada exitosamente");
                }, complete: function () {
                    $("#txtelaborospan").text('');
                    $('#formelaboro').modal('hide');
                }
            });
            return false;
        });
        $("#cmdcapturastatus").click(function () {
            var referencia = $("#txtstatusspan").text().toUpperCase();
            if (referencia == "") {
                bootbox.alert("No ha seleccionado Referencia");
                return;
            }
            var coments = $("#txtstatusref option:selected").text();
            if (coments == "") {
                bootbox.alert("No ha asignado estatus");
                return;
            }
            var uid = $.cookie('uid');
            var data = {
                referencia: referencia,
                estatus: coments,
            }
            $.ajax({
                data: JSON.stringify(data),
                dataType: 'json',
                url: 'services/dashboard.asmx/actualizaestatus',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    p._refreshgridprogramacion();

                    bootbox.alert("Informacion actualizada exitosamente");
                }, complete: function () {
                    $("#txtstatusspan").text('');
                    $('#formstatus').modal('hide');
                }
            });
            return false;
        });
        $("#cmdcapturaestatusbod").click(function () {
            var referencia = $("#txtestatusbodspan").text().toUpperCase();
            if (referencia == "") {
                bootbox.alert("No ha seleccionado Referencia");
                return;
            }
            var coments = $("#txtestatusbodref option:selected").text();
            if (coments == "") {
                bootbox.alert("No ha asignado estatus de bodega");
                return;
            }
            var uid = $.cookie('uid');
            var data = {
                referencia: referencia,
                estatusbod: coments,
            }
            $.ajax({
                data: JSON.stringify(data),
                dataType: 'json',
                url: 'services/dashboard.asmx/actualizaestatusbod',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    p._refreshgridprogramacion();

                    bootbox.alert("Informacion actualizada exitosamente");
                }, complete: function () {
                    $("#txtestatusbodspan").text('');
                    $('#formestatusbod').modal('hide');
                }
            });
            return false;
        });
        $("#cmdcapturaestatusaduana").click(function () {
            var referencia = $("#txtestatusaduanaspan").text().toUpperCase();
            if (referencia == "") {
                bootbox.alert("No ha seleccionado Referencia");
                return;
            }
            var coments = $("#txtestatusaduanaref option:selected").text();
            if (coments == "") {
                bootbox.alert("No ha asignado estatus de aduana");
                return;
            }
            var uid = $.cookie('uid');
            var data = {
                referencia: referencia,
                estatusadu: coments,
            }
            $.ajax({
                data: JSON.stringify(data),
                dataType: 'json',
                url: 'services/dashboard.asmx/actualizaestatusadu',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    p._refreshgridprogramacion();

                    bootbox.alert("Informacion actualizada exitosamente");
                }, complete: function () {
                    $("#txtestatusaduanaspan").text('');
                    $('#formestatusaduana').modal('hide');
                }
            });
            return false;
        });
        $("#cmdbuscaref").click(function () {
            var referencia = $("#txtreferencia").val().toUpperCase();

            if (referencia == "") {
                bootbox.alert("No ha seleccionado Referencia");
                return;
            }

            var uid = $.cookie('uid');
            var data = {
                referencia: referencia,
            }
            $.ajax({
                data: JSON.stringify(data),
                dataType: 'json',
                url: 'services/dashboard.asmx/buscaref',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    var datares = $.parseJSON(result.d).Table[0];

                    if (datares) {
                        $('#txtcliente').val(datares.srazonsocial);

                        if (datares.etipooperacion == "E") {
                            $("input[name=inlineRadioOptions][value=" + 2 + "]").prop('checked', true);
                        }
                        else {
                            $("input[name=inlineRadioOptions][value=" + 1 + "]").prop('checked', true);
                        }

                    }
                    else {
                        bootbox.alert("Atencion!! El trafico no se ha encontrado en el sistema de trafico, al programarlo se asignara por default como Adelantado")
                        $("input[name=inlineRadioOptions][value=" + 5 + "]").prop('checked', true);
                    }

                    
                }, complete: function () {

                }
            });
            return false;
        });
        $("#cmdcapturaconsolidado").click(function () {
            var referencia = $("#txtconsolidaspan").text().toUpperCase();
            if (referencia == "") {
                bootbox.alert("No ha seleccionado Referencia");
                return;
            }
            var coments = $("#txtconsref").val().toUpperCase();
            if (coments == "") {
                bootbox.alert("No ha asignado clave de consolidado");
                return;
            }

            var uid = $.cookie('uid');

            var data = {
                referencia: referencia,
                clave: coments,
            }
            $.ajax({
                data: JSON.stringify(data),
                dataType: 'json',
                url: 'services/dashboard.asmx/actualizaconsolidado',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    p._refreshgridprogramacion();

                    bootbox.alert("Informacion actualizada exitosamente");
                }, complete: function () {
                    $("#txtconsolidaspan").text('');
                    $("#txtconsref").val('')
                    $('#formconsolidado').modal('hide');
                }
            });
            return false;
        });
        $("#btnprograma").click(function () {
            var tipoop = $("input[name=inlineRadioOptions]:checked").val();
            var referencia = $("#txtreferencia").val();
            var cliente = $("#txtcliente").val();
            var grupotr = $("#cbogrupotr").val();
            var vehiculo = $("#cbovechiculo option:selected").text();

            if (referencia == "") {
                bootbox.alert("No ha seleccionado Referencia");
                return;
            }
            if (cliente == "") {
                bootbox.alert("No ha seleccionado cliente");
                return;
            }
            var data = {
                referencia: referencia,
                tipoop: tipoop,
                cliente: cliente,
                grupotr: grupotr,
                vehiculo: vehiculo,
            }

            $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                url: 'services/dashboard.asmx/programatrafico',
                success: function (data) {
                    p._refreshgridprogramacion();
                    bootbox.alert('Trafico programado exitosamente');
                },
                error: function (xhr, textStatus, error) {
                    if (typeof console == "object") {
                        console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                    }
                }, complete: function () {
                    $("#txtreferencia").val('');
                    $("#txtcliente").val('');
                    $("#cbogrupotr").val(0);
                    $("#cbovechiculo").val(0);
                    $('#formreset').modal('hide');
                }
            });
            return false;
        });
    }
    // =========================================================================
    namespace.dashboard = new dashboard;
}(this.materialadmin, jQuery));