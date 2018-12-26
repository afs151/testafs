(function (namespace, $) {
    "use strict";

    var dashdirecto = function () {
        // Create reference to this instance
        var o = this;
        // Initialize app when document is ready
        $(document).ready(function () {
            o.initialize();
        });

    };
    var p = dashdirecto.prototype;
    var theme = "bootstrap";


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
            position: "top-right", opacity: 0.9,
            autoOpen: false, animationOpenDelay: 800, autoClose: true, autoCloseDelay: 5000, template: "info", theme: theme
        });

        $("#errorNotification").jqxNotification({ position: "top-right", autoCloseDelay: 5000, autoOpen: false, closeOnClick: true, autoClose: true, template: "error", animationOpenDelay: 800 });

        $("#warningNotification").jqxNotification({
            position: "top-right", opacity: 0.9,
            autoOpen: false, animationOpenDelay: 800, autoClose: true, autoCloseDelay: 5000, template: "warning", theme: theme
        });
        p._createdomgrid("#jqxgriddirectos", "btnprogramatrafdir", "excelExportadir", "#menudir");

        var validformats = ".pdf,.doc,.docx,.odt,.xls,.xlsx,.xml,.jpg,.jpeg,.png,.ppt,.gif";
        Dropzone.autoDiscover = false;
        $("#mydropzone").dropzone({
            url: "services/fileuploader.asmx/UploadCargaFile",
            addRemoveLinks: true,
            acceptedFiles: validformats,
            sending: function (file, xhr, formData) {
                var ref = $("#txtrefuploadspan").text().toUpperCase();
                if (ref == "") {
                    toast.error("No ha tecleado referencia !!");
                    this.removeFile(file);
                }
                formData.append('ref', ref);

                formData.append('doctype', $("#selectTipo option:selected").val());
                formData.append('tipodoc', $("#selectTipo option:selected").text());

            },
            success: function (file, response) {
                console.log("Successfully uploaded :" + imgName);
            },
            removedfile: function (file) {
                var _ref; // Remove file on clicking the 'Remove file' button
                return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
            }, error: function (xhr, textStatus, error) {
                var errorM = $.parseJSON(xhr.responseText);
            }
        });
    }

    p._createdomgrid = function (ctrlgrid, btnprogtraf, btnexporta, ctrlmenu) {
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
        var cellclassstatusrem = function (row, column, value) {
            var color = this.owner.source.records[row]['tpstatusbodid'];
            switch (color) {
                case "CANCELADA":
                    return "red";
                    break;
            }
        };
        $(ctrlgrid).jqxGrid(
        {
            width: '100%',
            height: '1000',
            filterable: true,
            sortable: true,
            showtoolbar: false,
            showfilterrow: true,
            showstatusbar: true,
            showaggregates: true,
            columnsresize: true,
            theme: theme,
            altrows: true,
            selectionmode: 'singlecell',
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
                var contextMenu = $(ctrlmenu).jqxMenu({ width: 240, height: 300, autoOpenPopup: false, mode: 'popup', theme: theme });
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
                    else if ($.trim($(args).text().toLowerCase()) == "capturar ej trafico") {
                        $('#txtejecutivospan').text(dataRecord.tpreferencia);
                        $('#formejecutivo').modal('show');
                    }
                    else if ($.trim($(args).text().toLowerCase()) == "capturar ej pedimento") {
                        $('#txtelaborospan').text(dataRecord.tpreferencia);
                        $('#formelaboro').modal('show');
                    }
                    else if ($.trim($(args).text().toLowerCase()) == "capturar estatus trafico") {
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

                        var last2 = yyyy.toString().slice(-2);
                        today = last2 + mm + dd;

                        $('#txtconsco').text(today + "-");

                        $('#formconsolidado').modal('show');
                    }
                    else if ($.trim($(args).text().toLowerCase()) == "subir documentos o fotos de trafico") {
                        $('#txtrefuploadspan').text(dataRecord.tpreferencia);
                        $('#formfileupload').modal('show');
                    }
                    else if ($.trim($(args).text().toLowerCase()) == "desprogramar trafico") {

                        var conf = confirm("DESCPROGRAMAR TRAFICO : " + dataRecord.tpreferencia + " ?");
                        if (conf) {
                            p._desprogramatr(dataRecord.tpreferencia);
                        }
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
                { text: 'CONS', datafield: 'tpclaveconsolidado', cellclassname: cellclass, width: 50, pinned: true },
                { text: 'REFERENCIA', datafield: 'tpreferencia', cellclassname: cellclass, width: 100, pinned: true },
                { text: 'CLIENTE', datafield: 'srazonsocial', cellclassname: cellclass, width: 100 },
                { text: 'EST PED', datafield: 'tpstatus', cellclassname: cellclassstatus, width: 100 },
                { text: 'VEHICULO', datafield: 'vehiculo', cellclassname: cellclass, aggregates: ['count'], width: 200 },
                { text: 'TRANSFER', datafield: 'transfer', cellclassname: cellclass, width: 100 },
                { text: 'CAAT', datafield: 'snumerocaat', cellclassname: cellclass, width: 50 },
                { text: 'LN MEX', datafield: 'snombre', cellclassname: cellclass, width: 100 },
                { text: 'DODA', datafield: 'tpdoda', cellclassname: cellclass, width: 75 },
                { text: 'ITN', datafield: 'tpitn', cellclassname: cellclass, width: 75 },
                { text: 'AD', datafield: 'scveaduana', cellclassname: cellclass, width: 50 },
                { text: 'TP', datafield: 'scvedocumento', cellclassname: cellclass, width: 50 },
                { text: 'PEDIM', datafield: 'snumpedimento', cellclassname: cellclass, width: 75 },
                { text: 'EJ PED', datafield: 'tpelabora', cellclassname: cellclass, width: 75 },
                { text: 'EJ TRAF', datafield: 'tpejecutivo', cellclassname: cellclass, width: 75 },
                { text: 'OBSERVACIONES', datafield: 'tpobs', cellclassname: cellclass, width: 200 },
                { text: 'EST BOD', datafield: 'tpstatusbodid', cellclassname: cellclassstatusrem, width: 50 },
                { text: 'EST ADU', datafield: 'tpstatusaduana', cellclassname: cellclass, width: 75 },
                { text: 'BULTOS', datafield: 'smarcas', cellclassname: cellclass, width: 75 },
                { text: 'ET', datafield: 'tpgrupotrabajo', cellclassname: cellclass, width: 50 },
                { text: 'OR CARGA', datafield: 'iconsecutivoordencarga', cellclassname: cellclassstatusrem, width: 50 },
                {
                    text: 'INI CARGA', columntype: 'button', datafield: 'tpfechainicarga', cellclassname: cellclass, width: 75,
                    buttonclick: function (row, column, columntype, oldvalue, newvalue) {
                        var value = $(ctrlgrid).jqxGrid('getcellvalue', row, 'tpreferencia');
                        var dateini = $(ctrlgrid).jqxGrid('getcellvalue', row, 'tpfechainicarga');
                        var datefin = $(ctrlgrid).jqxGrid('getcellvalue', row, 'tpfechafincarga');
                        var cancelada = $(ctrlgrid).jqxGrid('getcellvalue', row, 'tpstatusbodid');
                        if (cancelada == "CANCELADA") {
                            bootbox.alert("No es posible iniciar carga ya que se encuentra cancelada");
                            return;
                        }
                        if (dateini != null) {
                            bootbox.alert("Ya ha iniciado carga para esta referencia");
                            return;
                        }
                        if (datefin != null) {
                            bootbox.alert("No es posible iniciar carga nuevamente si ya ha finalidado");
                            return;
                        }
                        var conf = confirm("INICIAR CARGA DE TRAFICO : " + value + " ?");
                        if (conf) {
                            var data = {
                                referencia: value,
                            }
                            $.ajax({
                                type: 'POST',
                                data: JSON.stringify(data),
                                contentType: 'application/json; charset=utf-8',
                                dataType: 'json',
                                url: 'services/dashboard.asmx/updateinicarga',
                                success: function (data) {
                                    //bootbox.alert("Cambio realizado con exito");
                                    p._refreshgridprogramacion();
                                },
                                error: function (xhr, textStatus, error) {
                                    if (typeof console == "object") {
                                        console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                                    }
                                }
                            });

                        }

                    }
                },
                {
                    text: 'FIN CARGA', columntype: 'button', datafield: 'tpfechafincarga', cellclassname: cellclass, width: 75,
                    buttonclick: function (row, column, columntype, oldvalue, newvalue) {
                        var value = $(ctrlgrid).jqxGrid('getcellvalue', row, 'tpreferencia');
                        var dateini = $(ctrlgrid).jqxGrid('getcellvalue', row, 'tpfechainicarga');
                        var datefin = $(ctrlgrid).jqxGrid('getcellvalue', row, 'tpfechafincarga');
                        var cancelada = $(ctrlgrid).jqxGrid('getcellvalue', row, 'tpstatusbodid');
                        if (cancelada == "CANCELADA") {
                            bootbox.alert("No es posible finalizar carga ya que se encuentra cancelada");
                            return;
                        }
                        if (dateini == null) {
                            bootbox.alert("No ha iniciado carga un para esta referencia, favor de verificar");
                            return;
                        }
                        if (datefin != null) {
                            bootbox.alert("Ya ha finalizado carga de esta referencia");
                            return;
                        }
                        var conf = confirm("FINALIZAR CARGA DE TRAFICO : " + value + " ?");
                        if (conf) {
                            var data = {
                                referencia: value,
                            }
                            $.ajax({
                                type: 'POST',
                                data: JSON.stringify(data),
                                contentType: 'application/json; charset=utf-8',
                                dataType: 'json',
                                url: 'services/dashboard.asmx/updatefincarga',
                                success: function (data) {
                                    p._refreshgridprogramacion();
                                    var conf = confirm("Cambio realizado con exito, desea subir fotogafias de carga?");
                                    if (conf) {

                                        $("#selectTipo").val(1);
                                        $("#txtrefuploadspan").text(value);
                                        $('#formfileupload').modal('show');
                                    }
                                },
                                error: function (xhr, textStatus, error) {
                                    if (typeof console == "object") {
                                        console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                                    }
                                }
                            });

                        }

                    }
                },
                {
                    text: 'SAL PATIO', columntype: 'button', datafield: 'tpfechasalidapatio', cellclassname: cellclass, width: 75,
                    buttonclick: function (row, column, columntype, oldvalue, newvalue) {
                        var value = $(ctrlgrid).jqxGrid('getcellvalue', row, 'tpreferencia');
                        var dateini = $(ctrlgrid).jqxGrid('getcellvalue', row, 'tpfechasalidapatio');
                        var iconsecutivoordencarga = $(ctrlgrid).jqxGrid('getcellvalue', row, 'iconsecutivoordencarga');
                        var cancelada = $(ctrlgrid).jqxGrid('getcellvalue', row, 'tpstatusbodid');
                        if (cancelada == "CANCELADA") {
                            bootbox.alert("No es posible asignar salida de patio, ya que se encuentra cancelada");
                            return;
                        }
                        if (dateini != null) {
                            bootbox.alert("Ya se ha realizado la fecha de salida de patio para esta referencia");
                            return;
                        }
                        var conf = confirm("ASIGNAR FECHA DE SALIDA DE PATIO : " + value + " ?");
                        if (conf) {
                            var txtremision = prompt("TECLEE O ESCANEE NUMERO DE REMISION");
                            if (txtremision == "") {
                                bootbox.alert("Debe teclear numero de remsion");
                                return;
                            }

                            if (txtremision != iconsecutivoordencarga) {
                                bootbox.alert("El numero de remision no coincide para esta referencia, favor de verificar");
                                return;
                            }

                            var data = {
                                referencia: value,
                                txtremision: txtremision,
                            }
                            $.ajax({
                                type: 'POST',
                                data: JSON.stringify(data),
                                contentType: 'application/json; charset=utf-8',
                                dataType: 'json',
                                url: 'services/dashboard.asmx/updatefechasalida',
                                success: function (data) {
                                    //bootbox.alert("Cambio realizado con exito");
                                    p._refreshgridprogramacion();
                                },
                                error: function (xhr, textStatus, error) {
                                    if (typeof console == "object") {
                                        console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                                    }
                                }
                            });

                        }

                    }
                },
                { text: 'O CARGA SAL', datafield: 'tpremisionsalida', cellclassname: cellclass, width: 75 },
                { text: '', datafield: 'colorname', hidden: true },
            ]
        });
    }

    p._UserWellcome = function () {

        $("#messageNotification").jqxNotification({
            position: "bottom-right", opacity: 0.9,
            autoOpen: false, animationOpenDelay: 800, autoClose: true, autoCloseDelay: 10000, template: "info"
        });
        $("#timeNotification").jqxNotification({
            position: "bottom-right", opacity: 0.9,
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
        $('#jqxgriddirectos').jqxGrid('showloadelement');
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
                                { name: 'tpfechainicarga', type: 'string' },
                                { name: 'tpfechafincarga', type: 'string' },
                                { name: 'tpfechasalidapatio', type: 'string' },
                                { name: 'tpremisionsalida', type: 'string' },
                                { name: 'tpentrada', type: 'string' },
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
                var datainformations = $('#jqxgriddirectos').jqxGrid('getdatainformation');
                var rowscounts = datainformations.rowscount;

                $("#currentTime").text("Total de cargas directas programadas para el dia de hoy: " + rowscounts);
                $("#timeNotification").jqxNotification("open");

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
    p._filterGridStatus = function (status) {
        var filtergroup = new $.jqx.filter();
        var filter_or_operator = 1;
        var filtervalue = status;
        var filtercondition = 'equal';
        var filter1 = filtergroup.createfilter('stringfilter', filtervalue, filtercondition);
        filtergroup.addfilter(filter_or_operator, filter1);
        $("#jqxgriddirectos").jqxGrid('addfilter', 'colorname', filtergroup);
        $("#jqxgriddirectos").jqxGrid('applyfilters');
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
        $("#btnuploadfile").click(function () {
            Dropzone.forElement("#mydropzone").removeAllFiles(true);
            bootbox.alert("Los archivos seleccionados se importaron exitosamente");
        });
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
                        bootbox.confirm({
                            message: "Atencion!! El trafico no se ha encontrado en el sistema de trafico, pertenece a una remesa?",
                            buttons: {
                                confirm: {
                                    label: 'Si',
                                },
                                cancel: {
                                    label: 'No',
                                }
                            },
                            callback: function (result) {
                                if (result) {
                                    $("#txtentrada").val(referencia);
                                    $('#formreset').modal('hide');
                                    $('#formbuscaentrada').modal('show');
                                }
                            }
                        });
                    }
                }, complete: function () {

                }
            });
            return false;
        });
        $("#cmdbuscaentrada").click(function () {
            var referencia = $("#txtentrada").val().toUpperCase();

            if (referencia == "") {
                bootbox.alert("No ha seleccionado numero de entrada");
                return;
            }

            var uid = $.cookie('uid');
            var data = {
                referencia: referencia,
            }
            $.ajax({
                data: JSON.stringify(data),
                dataType: 'json',
                url: 'services/dashboard.asmx/buscaentrada',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    var datares = $.parseJSON(result.d).Table[0];

                    if (datares) {
                        $('#txtclienteentrada').val(datares.srazonsocial);
                    }
                    else {
                        bootbox.alert("Atencion!! El numero de entrada no se ha encontrado en el sistema, al programarlo se asignara por default como Adelantado")
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
            var consolidado = $("#txtconsco").val().toUpperCase();
            var coments = $("#txtconsref").val().toUpperCase();
            if (coments == "") {
                bootbox.alert("No ha asignado clave de consolidado");
                return;
            }

            var uid = $.cookie('uid');

            var data = {
                referencia: referencia,
                clave: consolidado + coments,
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
                entrada: "",
                consremesa: 0,
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
        $("#btnprogramaentrada").click(function () {
            var tipoop = 1;
            var referencia = "";
            var cliente = $("#txtclienteentrada").val();;
            var grupotr = 0;
            var vehiculo = "";
            var entrada = $("#txtentrada").val();
            var consremesa = $("#txtconsremesa").val();

            if (entrada == "") {
                bootbox.alert("No ha seleccionado Entrada");
                return;
            }
            if (cliente == "") {
                bootbox.alert("No ha seleccionado cliente");
                return;
            }
            if (consremesa < 1) {
                bootbox.alert("Debe asignar consecutivo o remesa");
                return;
            }
            var data = {
                referencia: referencia,
                tipoop: tipoop,
                cliente: cliente,
                grupotr: grupotr,
                vehiculo: vehiculo,
                entrada: entrada,
                consremesa: consremesa,
            }

            $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                url: 'services/dashboard.asmx/programatrafico',
                success: function (data) {
                    p._refreshgridprogramacion();
                    bootbox.alert('Remesa programada exitosamente');
                },
                error: function (xhr, textStatus, error) {
                    if (typeof console == "object") {
                        console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                    }
                }, complete: function () {
                    $("#txtentrada").val('');
                    $("#txtclienteentrada").val('');
                    $('#formbuscaentrada').modal('hide');
                }
            });
            return false;
        });
    }

    p._desprogramatr = function (referencia) {

        if (referencia == "") {
            bootbox.alert("No ha seleccionado Referencia");
            return;

        }
        var data = {
            referencia: refencia,
        }

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            url: 'services/dashboard.asmx/desprogramatrafico',
            success: function (data) {
                p._refreshgridprogramacion();
                bootbox.alert('Trafico se ha desprogramado exitosamente');
            },
            error: function (xhr, textStatus, error) {
                if (typeof console == "object") {
                    console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                }
            }, complete: function () {

            }
        });
    }
    // =========================================================================
    namespace.dashdirecto = new dashdirecto;
}(this.materialadmin, jQuery));