(function (namespace, $) {
    "use strict";

    var Login = function () {
        // Create reference to this instance
        var o = this;
        // Initialize app when document is ready
        $(document).ready(function () {
            o.initialize();
        });

    };
    var p = Login.prototype;
    var theme = "bootstrap";

    // =========================================================================
    // INIT
    // =========================================================================

    p.initialize = function () {
        this._enableEvents();
    };
    p._enableEvents = function () {
        var o = this;
        $("#jqxLoader").jqxLoader({ isModal: true, width: 100, height: 60, imagePosition: 'top', theme: theme });

        $("#messageNotification").jqxNotification({
            width: 250, position: "bottom-right", opacity: 0.9,
            autoOpen: false, animationOpenDelay: 800, autoClose: true, autoCloseDelay: 10000, template: "info", theme: theme
        });

        $("#errorNotification").jqxNotification({
            width: 250, position: "bottom-right", opacity: 0.9,
            autoOpen: false, animationOpenDelay: 800, autoClose: true, autoCloseDelay: 10000, template: "error", theme: theme
        });

        $("#cmdlogin").on('click', function () {
            p._userLogin();
        });

        $("#btnsolicita").click(function () {
            p._newRequest();
        });

        $("#btnreset").click(function () {
            p._resetPassword();
        });
    };
    p._userLogin = function () {
        var data = {
            uid: $("#username").val(),
            pwd: $("#password").val(),
        }
        if (data.uid == "" || data.pwd == "") {
            var errorM = "No ha tecleado usuario o password, favor de verificar";
            $("#errormsg").text(errorM);
            $("#errorNotification").jqxNotification("open");
            return;
        }

        $('#jqxLoader').jqxLoader('open');
        $.ajax({
            data: JSON.stringify(data),
            dataType: 'json',
            url: 'services/login.asmx/validateuser',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                var obj = $.parseJSON(result.d);
                $.cookie('userid', obj.userid, { expires: 7, path: '/' });
                $.cookie('userciaid', obj.userciaid, { expires: 7, path: '/' });
                $.cookie('userfname', obj.userfname, { expires: 7, path: '/' });
                $.cookie('userlname', obj.userlname, { expires: 7, path: '/' });
                $.cookie('useremail', obj.useremail, { expires: 7, path: '/' });
                window.location = "dashboard.aspx";

            }, error: function (xhr, textStatus, error) {
                if (typeof console == "object") {
                    console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                }
                var errorM = $.parseJSON(xhr.responseText);
                $("#errormsg").text(errorM.Message);
                $("#errorNotification").jqxNotification("open");
            }, complete: function () {
                $('#jqxLoader').jqxLoader('close');
            }
        });
    };
    p._newRequest = function () {
        var fname = $("#Firstname1").val();
        var lname = $("#Lastname1").val();
        var email = $("#Email1").val();
        var pass = $("#Password1").val();
        var cia = $("#cia1").val();
        var comments = $("#textarea1").val();

        if (fname == "" || lname == "" || email == "" || pass == "") {
            var errorM = "Campos Requeridos, favor de verificar\nPrimer Nombre\nPrimer Apellido\nEmail\nPassword";
            $("#errormsg").text(errorM);
            $("#errorNotification").jqxNotification("open");
            //alert("Error");
            return;
        }

        var data = {
            Firstname: fname,
            Lastname: lname,
            Email: email,
            Password: pass,
            cia: cia,
            comments: comments
        };

        $.ajax({
            data: JSON.stringify(data),
            dataType: 'json',
            url: 'services/login.asmx/newrequestlogin',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                var obj = $.parseJSON(result.d);
                $("#notificationuser").text("Solicitud enviada exitosamete");
                $("#messageNotification").jqxNotification("open");
            }, error: function (xhr, textStatus, error) {
                var errorM = $.parseJSON(xhr.responseText);
                $("#errormsg").text(errorM.Message);
                $("#errorNotification").jqxNotification("open");
            }, complete: function () {
                $('#formModal').modal('hide');
                $("#Firstname1").val('');
                $("#Lastname1").val('');
                $("#Email1").val('');
                $("#Password1").val('');
                $("#textarea1").val('');
            }
        });

    };
    p._newSolRequest = function () {
        var solnombre = $("#solnombre").val().toUpperCase();
        var solapellido = $("#solapellido").val().toUpperCase();
        var solemail = $("#solemail").val().toUpperCase();
        var solrfc = "";
        var solcompnombre = $("#solcompnombre").val().toUpperCase();
        var solcomprfc = $("#solcomprfc").val().toUpperCase();
        var solcomptel = $("#solcomptel").val().toUpperCase();
        var solcompext = $("#solcompext").val().toUpperCase();
        var solobs = $("#solobs").val().toUpperCase();

        if (solnombre == "" || solapellido == "" || solemail == "" || solcompnombre == "" || solcomprfc == "" || solcomptel == "") {
            var errorM = "Campos Requeridos, favor de verificar\nNombre\nApellido\nEmail\Nombre de Compañia\nRFC Compañia\nTelefono";
            $("#errormsg").text(errorM);
            $("#errorNotification").jqxNotification("open");
            return;
        }

        var newsol = {
            solnombre: solnombre,
            solapellido: solapellido,
            solemail: solemail,
            solrfc: solrfc,
            solcompnombre: solcompnombre,
            solcomprfc: solcomprfc,
            solcomptel: solcomptel,
            solcompext: solcompext,
            solobs: solobs
        };

        $.ajax({
            data: JSON.stringify(newsol),
            dataType: 'json',
            url: 'services/proecimaster.asmx/guardasolicitud',
            contentType: 'application/json; charset=utf-8',
            type: 'POST',
            success: function (result) {
                var obj = $.parseJSON(result.d);
                $("#notificationuser").text("Solicitud enviada exitosamete");
                $("#messageNotification").jqxNotification("open");
            }, error: function (xhr, textStatus, error) {
                var errorM = $.parseJSON(xhr.responseText);
                $("#errormsg").text(errorM.Message);
                $("#errorNotification").jqxNotification("open");
            }, complete: function () {
                $('#formModalnewsol').modal('hide');
                $("#solnombre").val('');
                $("#solapellido").val('');
                $("#solemail").val('');
                $("#solcompnombre").val('');
                $("#solcomprfc").val('');
                $("#solcomptel").val('');
                $("#solcompext").val('');
                $("#solobs").val('');
            }
        });
    };

    p._resetPassword = function () {
        $('#formreset').modal('hide');
        if ($("#txtusuario").val() == "") {
            var errorM = "No ha proporcionado usuario";
            $("#errormsg").text(errorM);
            $("#errorNotification").jqxNotification("open");
            return;
        }
        var data = {
            uname: $("#txtusuario").val()
        };

        $.ajax({
            data: JSON.stringify(data),
            dataType: 'json',
            url: 'services/login.asmx/passwordrequest',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                var obj = $.parseJSON(result.d);
                $("#notificationuser").text("Solicitud enviada exitosamete");
                $("#messageNotification").jqxNotification("open");
            }, error: function (xhr, textStatus, error) {
                if (typeof console == "object") {
                    console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                }
                var errorM = $.parseJSON(xhr.responseText);
                $("#errormsg").text(errorM.Message);
                $("#errorNotification").jqxNotification("open");
            }
        });
    };
    p.fillcbo = function () {
        $("#cia1").empty();
        $.ajax({
            type: 'POST',
            //data: JSON.stringify(useriddata),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            url: 'services/login.asmx/getbranchsvalue',
            success: function (data) {

                var data = $.parseJSON(data.d);
                //var options = $("#options");
                if (data.length > 0) {
                    //ShowModel();
                    $.each(data, function (key, value) {
                        $("#cia1").append("<option value=" + value.branch_id + ">GRUPO PROECI -" + value.modality + "</option>");
                    });
                }
                else {
                    //alert('El usuario cuenta con todas las sucursales. Favor de verificar');

                    //$('#formModal').modal('toggle');
                }
                //$.each(data, function () {
                //    //data.append($("<option />").val(this.ImageFolderID).text(this.Name));
                //    $("#dropDownCars").append("<option>" + value.carsName + "</option>");
                //});
            },
            error: function (xhr, textStatus, error) {
                if (typeof console == "object") {
                    console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                }
            }
        });
    };
    namespace.Login = new Login;
}(this.materialadmin, jQuery));